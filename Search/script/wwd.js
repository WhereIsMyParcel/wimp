
/* global WorldWind */
"use strict";
var wwd; //WorldWind
var recipientInfo; //Recipient Info -> JSONObject
var placeList = new Array(); //List of place
var routingList = new Array(); //List of coordinates where the parcel was passed(placeList)
var switchList = [ //Remember to change if layers Array change
        {layer: '#blueMarble', enabled: false},
        {layer: '#bingAerialWithLabels', enabled: true},
        {layer: '#bingRoads', enabled: false}
    ];
var navigatorRange = 500000; //Visualization Height from terrain
document.getElementById("worldMap").style.cursor = "pointer";

function initializer(pathList, recipient){
    jQuery.ajax({
            type: "GET",
            url: "http://nominatim.openstreetmap.org/search?q="
                  + recipient.address + " "
                  + recipient.city
                  + "&format=json",
            async: false,
            success: function (data) {
                recipientInfo = {latitude: data[0].lat,
                                    longitude: data[0].lon,
                                    address: recipient.address,
                                    city: recipient.city};
            }
        });
    for(var i=(pathList.length)-1; i>=0; i--){
        var place = pathList[i].place;
        var url = "http://nominatim.openstreetmap.org/search?q=" + place + "&format=json";
        
        jQuery.ajax({
            type: "GET",
            url: url,
            async: false,
            success: function (data) {
                var coordinate = {latitude: data[0].lat,
                                    longitude: data[0].lon,
                                    date: pathList[i].date,
                                    hour: pathList[i].hour,
                                    place: place,
                                    note: pathList[i].note};
                placeList.push(coordinate);
            }
        });
    }
    
    if(placeList.length > 1){
        routing();}
    drawMap();
}

function routing(){
    var url = "../routing?places=" + JSON.stringify(placeList);
    
    jQuery.ajax({
        type: "GET",
        url: url,
        async: false,
        success: function (data) {
            routingList = data;
        }
    });
}

function drawMap(){
    //Configuration
    WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING); //Logger
    WorldWind.configuration.gpuCacheSize = 500e6; // GPU Memory -> 500MB
    
    //WWD
    wwd = new WorldWind.WorldWindow("worldMap");
    var wwdLayer = new WorldWind.RenderableLayer();
    wwdLayer.displayName = "WIMP Search System using NASA World Wind";
    
    //Create an array of layers(for options layer visibility)
    var layers = [//Remember to change if layersSwitchList change
            {layer: new WorldWind.BMNGLayer(), enabled: false},
            {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
            {layer: new WorldWind.BingRoadsLayer(null), enabled: false},
            {layer: new WorldWind.CompassLayer(), enabled: true},
            {layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: false},
            {layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
        ];

    for (var i=0; i<layers.length; i++) {
        layers[i].layer.enabled = layers[i].enabled;
        wwd.addLayer(layers[i].layer);
    }
    
    wwd.addLayer(wwdLayer);

    //Look Location on WWD startup
    wwd.navigator.lookAtLocation.latitude 
            = parseFloat(placeList[placeList.length-1].latitude);
    wwd.navigator.lookAtLocation.longitude 
            = parseFloat(placeList[placeList.length-1].longitude);
    //Height from terrain
    wwd.navigator.range = navigatorRange;
    
    //PERSONALIZED
    wwdPlacemark();
    if(placeList.length > 1){
        wwdPath();}
    wwdOptions();
    WorldWind.HighlightController(wwd); //Add highlightController to World Wind
    wwdEvents();
    //END PERSONALIZED
}

/*Path*/
function wwdPath(){
    // Create a layer to hold the path
    var pathsLayer = new WorldWind.RenderableLayer();
    pathsLayer.displayName = "Path using OSRM System";
    wwd.addLayer(pathsLayer);
    
    //Create the path's positions
    var pathPositions = [];
    for(var i=0; i<routingList.length; i++){
        pathPositions.push(
                new WorldWind.Position(routingList[i][0], routingList[i][1]));
    }
    
    //Path Attributes
    var pathAttributes = new WorldWind.ShapeAttributes(null);
    pathAttributes.outlineColor = new WorldWind.Color(38/256, 123/256, 209/256, 0.1);
    //Path Highlight
    var highlightAttributes = new WorldWind.ShapeAttributes(pathAttributes);
    highlightAttributes.outlineColor = WorldWind.Color.RED;
    //Set the pat as a Polyline
    var polyLinePath = new WorldWind.SurfacePolyline(pathPositions, pathAttributes);
    polyLinePath.highlightAttributes = highlightAttributes;
    //Add path(polyLinePath) to NASA World Wind Layer
    pathsLayer.addRenderable(polyLinePath);
}
/*END Path*/

/*Placemark*/
function wwdPlacemark(){
    var pinLibrary = WorldWind.configuration.baseUrl,
            placemark,
            placemarkAttributes = new WorldWind.PlacemarkAttributes(null),
            highlightAttributes,
            placemarkLayer = new WorldWind.RenderableLayer("Placemarks");
    
    //Placemark Attributes
    placemarkAttributes.imageScale = 0.4;
    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 0.0);
    placemarkAttributes.imageColor = WorldWind.Color.WHITE;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1);
    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
    placemarkAttributes.drawLeaderLine = true;
    placemarkAttributes.leaderLineAttributes.outlineColor = new WorldWind.Color(39/256, 174/256, 96/256, 1);

    //Recipient Placemark
        //Create placemark and its label
        placemark = new WorldWind.Placemark(
            new WorldWind.Position(parseFloat(recipientInfo.latitude),
                    parseFloat(recipientInfo.longitude), 1e2), false, null);
        placemark.label = String(recipientInfo.address +"\n"+ recipientInfo.city);
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.type = -1; //Unique type for every placemark -> Placemark OnClick
        //Placemark Attributes
        placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        placemarkAttributes.imageSource = "../images/wwd/endMarker.png";
        placemark.attributes = placemarkAttributes;
        //Placemark Highlight
        highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 0.5;
        placemark.highlightAttributes = highlightAttributes;
        placemarkLayer.addRenderable(placemark);
    //END Recipient Placemark
    //Path Placemark
    for(var i=0; i<placeList.length; i++){
        var imageName = "middleMarker.png";
        if(i===0)
            imageName = "startMarker.png";
        else if(i===(placeList.length-1))
            imageName = "parcelMarker.png";

        //Create placemark and its label
        placemark = new WorldWind.Placemark(
            new WorldWind.Position(parseFloat(placeList[i].latitude),
                    parseFloat(placeList[i].longitude), 1e2), false, null);
        placemark.label = String(placeList[i].place);
        placemark.altitudeMode = WorldWind.RELATIVE_TO_GROUND;
        placemark.type = i; //Unique type for every placemark -> Placemark OnClick
        //Placemark Attributes
        placemarkAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        placemarkAttributes.imageSource = "../images/wwd/" + imageName;
        placemark.attributes = placemarkAttributes;
        //Placemark Highlight
        highlightAttributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);
        highlightAttributes.imageScale = 0.5;
        placemark.highlightAttributes = highlightAttributes;

        //Add placemark to layer
        placemarkLayer.addRenderable(placemark);
    }
    //Add placemark layer to NASA World Wind Layer
    wwd.addLayer(placemarkLayer);
}
/*END Placemark*/

/*Options*/
function wwdOptions(){
    // Add Image and place it in the upper-left corner.
    var screenOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.01, WorldWind.OFFSET_FRACTION, 0.98);
    var screenImageOptions = new WorldWind.ScreenImage(screenOffset, "../images/wwd/options.png");
    screenImageOptions.imageOffset = new WorldWind.Offset(WorldWind.OFFSET_FRACTION, 0.01, WorldWind.OFFSET_FRACTION, 0.98);

    // Add the screen image options to a layer and the layer to the World Window's layer.
    var screenImageLayer = new WorldWind.RenderableLayer();
    screenImageLayer.displayName = "Options screen image layer";
    screenImageLayer.addRenderable(screenImageOptions);
    wwd.addLayer(screenImageLayer);
}
/*END Options*/

/*Events*/
function wwdEvents(){
    var highlightedItems = [];
    //Gesture-handling function for Placemark-click event
    var handleClick = function (recognizer) {
        // The input argument is either an Event or a TapRecognizer. 
        var x = recognizer.clientX,
            y = recognizer.clientY;

        var redrawRequired = highlightedItems.length > 0;

        // De-highlight any previously highlighted placemarks.
        for (var i=0; i<highlightedItems.length; i++) {
            highlightedItems[i].highlighted = false;
        }
        highlightedItems = [];

        // Perform the pick. Convert from 
        // window coordinates to canvas coordinates
        var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
        if (pickList.objects.length > 0) {
            redrawRequired = true;
        }
        
        // Highlight the items picked by simply setting their highlight flag to true.
        if (pickList.objects.length > 0) {
            //Scroll the array and identify wich placemark has been clicked
            for(var i=0; i<pickList.objects.length; i++){
                pickList.objects[i].userObject.highlighted = true;
                
                // Keep track of highlighted items in order to de-highlight them later.
                highlightedItems.push(pickList.objects[i].userObject);
                
                // Reset the navigator heading to 0 to re-orient the globe if Compass clicked
                if (pickList.objects[i].userObject instanceof WorldWind.Compass) {
                    wwd.navigator.heading = 0;
                    wwd.redraw();
                }
                // Show modal if Options clicked
                else if (pickList.objects[i].userObject instanceof WorldWind.ScreenImage) {
                    $("#options").modal();
                }
                // Show placemark info if Placemark clicked
                else if(pickList.objects[i].userObject instanceof WorldWind.Placemark) {
                    $('#legendBodyToBeCovered').css('display', 'none');
                    $('#legendBodyCovered').css('display', 'inline');
                    var type = pickList.objects[i].userObject.type;
                    //type === 0 -> Start marker
                    //type === -1 -> Recipient
                    //type === placeList.length-1 -> Last known position(Parcel)

                    if (type === 0)
                        setMarkerInfo("startMarker", "Starting Point", placeList[type]);
                    else if(type === -1)
                        setMarkerInfo("endMarker", "End Point", false);
                    else if(type === placeList.length-1)
                        setMarkerInfo("parcelMarker", "Last known position" ,placeList[type]);
                    else{
                        for (var j=0; j<placeList.length; j++){
                            if (type === j){
                                setMarkerInfo("middleMarker", "Through point", placeList[j]);
                                break;
                            }
                        }
                    }
                }
            }
        }
        
        // Update the window if we changed anything.
        if (redrawRequired) {
            wwd.redraw();
        }
    };
    //Listener for mouse clicks
    var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
    //Listener for taps on mobile devices
    var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);
}
function setMarkerInfo(markerImage, markerInfo, element){
    //Marker
    var src = '../images/wwd/' + markerImage + '.png';
    $('#markerType').attr('src', src);
    $('#markerType').css('width', '64px');
    $('#markerType').css('height', '64px');
    $('#markerInfo').text(markerInfo);
    //END Marker
    
    if(element !== false){
        //Date
        $('#markerDate').text(element.date);
        //Hour
        $('#markerHour').text(element.hour);
        //Place
        $('#markerPlace').text(element.place);
        //Note
        $('#markerNote').text(element.note);
    }
    else{
        //Date
        $('#markerDate').text("Not Available");
        //Hour
        $('#markerHour').text("Not Available");
        //Place
        $('#markerPlace').text(recipientInfo.city);
        //Note
        $('#markerNote').text("Parcel destination");
    }
}
/*END Events*/

/*GoToLocation*/
$(document).ready(function(){
    // Add smooth scrolling and goToLocation Event
    $(".goToLocation").on('click', function(event) {
        //Prevent default anchor click behavior
        event.preventDefault();
        // Get index from attribute
        var index = $(this).attr("index");
        var control = true;
        // Using jQuery's animate() method to add smooth page scroll
        $('html, .scrollbar').animate({
            scrollTop: $("#worldMap").offset().top
        }, 500, function(){
            if(control){
                wwd.navigator.heading = 0;
                wwd.navigator.range = navigatorRange;
                wwd.goTo(new WorldWind.Location(placeList[index].latitude, placeList[index].longitude));
                wwd.redraw();
            }
            control = false;
        });
    });
});
/*END GoToLocation*/

/*OPTIONS*/
$(document).ready(function(){
    //General options
    $('.input-checkbox').change(function(event) {
        event.preventDefault();
        var id = '#'+$(this).attr('id');

        if(id === '#3D'){
            if(this.checked){
                $('#2D').prop('checked', false);
                changeProjection('3D');
            }
            else{
                $('#2D').prop('checked', true);
                changeProjection('2D');
            }
        }
        else if(id === '#2D'){
            if(this.checked){
                $('#3D').prop('checked', false);
                changeProjection('2D');
            }
            else{
                $('#3D').prop('checked', true);
                changeProjection('3D');
            }
        }
        else if(id === '#compass' || id === '#controls' || id === '#coordinates'){
            changeAddOn($(this).attr('value'));
        }
        else{
            changeLayers($(this).attr('value'), id);
        }
        wwd.redraw();
    });
    //View reset
    $("#resetView").on('click', function(event) {
        event.preventDefault();
        wwd.navigator.heading = 0;
        wwd.navigator.range = navigatorRange;
        var index = parseFloat(placeList.length-1);
        wwd.goTo(new WorldWind.Location(placeList[index].latitude, placeList[index].longitude));
        wwd.redraw();
    });
    //Zoom reset
    $("#resetZoom").on('click', function(event) {
        event.preventDefault();
        wwd.navigator.heading = 0;
        wwd.navigator.range = navigatorRange;
        wwd.redraw();
    });
});

    /*Projection-options*/
    function changeProjection(projection){
        switch (projection){
            case '2D': {
                    wwd.flatGlobe = new WorldWind.Globe2D();
                    wwd.flatGlobe.projection = new WorldWind.ProjectionMercator();
                    wwd.globe = wwd.flatGlobe;
                    break;
            }
            case '3D': {
                    wwd.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
                    wwd.globe = wwd.roundGlobe;
                    break;
            }
        }
    }
    /*END Projection-options*/
    
    /*Add-on-options*/
    function changeAddOn(layerName){
        // Update the layer state for the selected layer.
        for (var i=switchList.length; i<wwd.layers.length; i++) {
            var layer = wwd.layers[i];
            if (layer.hide) {
                continue;
            }
            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
                break;
            }
        }
    }
    /*END Add-on-options*/
    
    /*Layers-options*/
    function changeLayers(layerName, id){
        var notAIndex = -1;
        
        //Update layersSwitchList && Switch on UI
        for (var i=0; i<switchList.length; i++){
            var checkbox = switchList[i].layer;
            if(switchList[i].enabled === true && i !== notAIndex){
                $(checkbox).prop('disabled', false);
                $(checkbox).prop('checked', false);
                switchList[i].enabled = false;
            }
            if(checkbox === id){
                switchList[i].enabled = true;
                notAIndex = i;
            }
        }
        
        // Disable the checkbox
        $(id).prop('disabled', true);
        
        // Delete the previous layer on World Wind
        for(var i=0; i<=(switchList.length-1); i++){
            var layer = wwd.layers[i];
            if(layer.enabled === true){
                layer.enabled = false;
                break;
            }
        }

        // Update the layer state for the selected layer.
        for (var i=0; i<wwd.layers.length; i++) {
            var layer = wwd.layers[i];
            if (layer.hide) {
                continue;
            }
            if (layer.displayName === layerName) {
                layer.enabled = !layer.enabled;
                break;
            }
        }
    }
    /*END Layers-options*/
/*END OPTIONS*/