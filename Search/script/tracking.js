
"use strict";

var trackingCode = getUrlVars()["trackingCode"];
//Tracking Code
document.getElementById("trackingCode").innerHTML = trackingCode;

//ALL-> Parcel Info and his PATH
$.ajax({
    type: "GET",
    url: "../parcel?trackingCode=" + trackingCode,
    async: false,
    success: function (data) {
        setDataInfo(data);
        //Path
        $.ajax({
            type: "GET",
            url: "../places?idParcel=" + data.parcelInfo.idParcel,
            async: false,
            success: function (placeList) {
                var pLength = (placeList.length-1);
                for(var i=0; i<placeList.length; i++){
                    placeList[i].goToLocation = '<img src="../images/wwd/goToLocation.png" class="goToLocation" index="'+(pLength-i)+'" style="margin-left: -5px;"/>';
                }
                
                $('#pathTable').bootstrapTable({
                    data: placeList
                });
                if(placeList.length > 0)
                    initializer(placeList, data.recipient);
                else{
                    $("#worldMap").hide();
                    $("#noPathFound").show();
                }
            },
            error: function () {
                location.href = "../index.html";
            }
        });
    },
    error: function () {
       location.href = "../index.html";
    }
});

function setDataInfo(data){
    //Parcel Info
    document.getElementById("courier").innerHTML = data.courier.courier;
    document.getElementById("shippingDate").innerHTML = data.parcelInfo.shippingDate;
    document.getElementById("weight").innerHTML = data.parcelInfo.weight + " Kg";
    //Sender Info
    document.getElementById("S_name").innerHTML = data.sender.name;
    document.getElementById("S_surname").innerHTML = data.sender.surname;
    document.getElementById("S_address").innerHTML = data.sender.address;
    document.getElementById("S_city").innerHTML = data.sender.city;
    document.getElementById("S_postCode").innerHTML = data.sender.postCode;
    document.getElementById("S_region").innerHTML = data.sender.region;
    document.getElementById("S_landline").innerHTML = data.sender.landline;
    document.getElementById("S_mobilePhone").innerHTML = data.sender.mobilePhone;
    document.getElementById("S_email").innerHTML = data.sender.email;
    //Recipient Info
    document.getElementById("R_name").innerHTML = data.recipient.name;
    document.getElementById("R_surname").innerHTML = data.recipient.surname;
    document.getElementById("R_address").innerHTML = data.recipient.address;
    document.getElementById("R_city").innerHTML = data.recipient.city;
    document.getElementById("R_postCode").innerHTML = data.recipient.postCode;
    document.getElementById("R_region").innerHTML = data.recipient.region;
    document.getElementById("R_landline").innerHTML = data.recipient.landline;
    document.getElementById("R_mobilePhone").innerHTML = data.recipient.mobilePhone;
    document.getElementById("R_email").innerHTML = data.recipient.email;
}