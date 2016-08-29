"use strict";

function verify(){
    var trackingCode = $("#trackingCode").val();

    if(trackingCode !== ""){
        $.ajax({
            type: "GET",
            url: "trackingCode?trackingCode=" + trackingCode,
            async: true,
            success: function (data) {
                if(data === "true"){
                    $("#notFound").hide();
                    $("#loader").show();
                    setTimeout(function(){
                        location.href = "Search/search.html?trackingCode="+trackingCode;
                    }, 500);
                }
                else{
                    $("#loader").hide();
                    $('#notFound').html("<strong>Tracking Code Not Found &#128566;</strong>");
                    $("#notFound").show();
                }
            },
            error: function (){
                $("#loader").hide();
                $('#notFound').html("<strong>Warning!</strong> Database error <strong>&#128533;</strong>");
                $("#notFound").show();
            }
        });
    }
    else
    {
        $("#loader").hide();
        $('#notFound').html("<strong>Please!</strong> Don't be lazy <strong>&#128527;</strong>");
        $("#notFound").show();
    }
    return false;
}

/*Clearable Input*/
jQuery(function($) {
    function tog(v){return v?'addClass':'removeClass';}
    $(document).on('input', '.clearable', function(){
        $(this)[tog(this.value)]('x');
    }).on('mousemove', '.x', function( e ){
        $(this)[tog(this.offsetWidth-30 < e.clientX-this.getBoundingClientRect().left)]('onX');   
    }).on('touchstart click', '.onX', function( ev ){
        ev.preventDefault();
        $(this).removeClass('x onX').val('').change();
    });
});
/*END Clearable Input*/

$(document).ready(function(){
    $(window).on("resize load", function () {
        var heightScrollbar = $('.scrollbar').height();
        var heightFooter = $('#footer').height();
        
        var height = heightScrollbar - (heightFooter+100);
        
        if(height > 450){
            $('#homeChild').css('top', height/2 - [(height/100) * 20]);
            $('#homeParent').height(height);
        }
        else if(height > 300){
            $('#homeChild').css('top', height/2);
            $('#homeParent').height(height);
        }
        else{
            $('#homeChild').css('top', 150);
            $('#homeParent').height(330);
        }
    });
});