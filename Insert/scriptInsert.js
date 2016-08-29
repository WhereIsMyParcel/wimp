"use strict";

var loadingTimeOut = 500; //millisends(ms)

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

/*INPUT-COURIER*/
function submitCourier(){
    var courierName = $("#courierName").val();

    if(courierName !== ""){
        $("#errorCourier").hide();
        $("#successCourier").hide();
        $("#loadingCourier").show();
        
        setTimeout(function(){
            $.ajax({
                type: "GET",
                url: "../insert/courier?courierName=" + courierName,
                async: true,
                success: function (data) {
                    if(data === "true")
                        $("#successCourier").css("display", "inline");
                    else{
                        console.error(data);
                        $('#errorCourier').html("<strong>Error!</strong> Value non accepted");
                        $("#errorCourier").css("display", "inline");
                    }
                },
                error: function (){
                    $('#errorCourier').html("<strong>Error!</strong> Error during insertion");
                    $("#errorCourier").css("display", "inline");
                }
            });
            $("#loadingCourier").hide();
        }, loadingTimeOut);
    }
    else{
        $("#successCourier").hide();
        $('#errorCourier').html("<strong>Please!</strong> Don't be lazy <strong>&#128527;</strong>");
        $("#errorCourier").css("display", "inline");
    }
    return false;
}
/*END INPUT-COURIER*/

/*INPUT-SENDER*/
function submitSender(){   
    var S_name = $("#S_name").val();
    var S_surname = $("#S_surname").val();
    var S_address = $("#S_address").val();
    var S_city = $("#S_city").val();
    var S_postCode = $("#S_postCode").val();
    var S_region = $("#S_region").val();
    var S_landline = $("#S_landline").val();
    var S_mobilePhone = $("#S_mobilePhone").val();
    var S_email = $("#S_email").val();
    
    $("#errorSender").hide();
    $("#successSender").hide();
    $("#loadingSender").show();

    setTimeout(function(){
        $.ajax({
            type: "GET",
            url: "../insert/sender"
                    + "?name=" + S_name
                    + "&surname=" + S_surname
                    + "&address=" + S_address
                    + "&city=" + S_city
                    + "&postCode=" + S_postCode
                    + "&region=" + S_region
                    + "&landline=" + S_landline
                    + "&mobilePhone=" + S_mobilePhone
                    + "&email=" + S_email,
            async: true,
            success: function (data) {
                if(data === "true")
                    $("#successSender").css("display", "inline");
                else{
                    console.error(data);
                    $('#errorSender').html("<strong>Error!</strong> Value/s non accepted");
                    $("#errorSender").css("display", "inline");
                }
            },
            error: function (){
                $('#errorSender').html("<strong>Error!</strong> Error during insertion");
                $("#errorSender").css("display", "inline");
            }
        });
        $("#loadingSender").hide();
    }, loadingTimeOut);
    return false;
}
/*END INPUT-SENDER*/

/*INPUT-RECIPIENT*/
function submitRecipient(){   
    var R_name = $("#R_name").val();
    var R_surname = $("#R_surname").val();
    var R_address = $("#R_address").val();
    var R_city = $("#R_city").val();
    var R_postCode = $("#R_postCode").val();
    var R_region = $("#R_region").val();
    var R_landline = $("#R_landline").val();
    var R_mobilePhone = $("#R_mobilePhone").val();
    var R_email = $("#R_email").val();
    
    $("#errorRecipient").hide();
    $("#successRecipient").hide();
    $("#loadingRecipient").show();

    setTimeout(function(){
        $.ajax({
            type: "GET",
            url: "../insert/Recipient"
                    + "?name=" + R_name
                    + "&surname=" + R_surname
                    + "&address=" + R_address
                    + "&city=" + R_city
                    + "&postCode=" + R_postCode
                    + "&region=" + R_region
                    + "&landline=" + R_landline
                    + "&mobilePhone=" + R_mobilePhone
                    + "&email=" + R_email,
            async: true,
            success: function (data) {
                if(data === "true")
                    $("#successRecipient").css("display", "inline");
                else{
                    console.error(data);
                    $('#errorRecipient').html("<strong>Error!</strong> Value/s non accepted");
                    $("#errorRecipient").css("display", "inline");
                }
            },
            error: function (){
                $('#errorRecipient').html("<strong>Error!</strong> Error during insertion");
                $("#errorRecipient").css("display", "inline");
            }
        });
        $("#loadingRecipient").hide();
    }, loadingTimeOut);
    return false;
}
/*END INPUT-RECIPIENT*/

/*INPUT-PARCEL*/
function submitParcel(){   
    var trackingCode = $("#trackingCode").val();
    var date = $("#parcelDate").val();
    var hour = $("#parcelHour").val();
    var weight = $("#weight").val();
    var ks_Sender = $("#ks_Sender").val();
    var ks_Recipient = $("#ks_Recipient").val();
    var ks_Courier = $("#ks_Courier").val();

    if(trackingCode !== ""){
        $("#errorParcel").hide();
        $("#successParcel").hide();
        $("#loadingParcel").show();
        setTimeout(function(){
            $.ajax({
                type: "GET",
                url: "../insert/parcel"
                        + "?trackingCode=" + trackingCode
                        + "&date=" + date
                        + "&hour=" + hour
                        + "&weight=" + weight
                        + "&ks_Sender=" + ks_Sender
                        + "&ks_Recipient=" + ks_Recipient
                        + "&ks_Courier=" + ks_Courier,
                async: true,
                success: function (data) {
                    if(data === "true")
                        $("#successParcel").css("display", "inline");
                    else{
                        console.error(data);
                        $('#errorParcel').html("<strong>Error!</strong> Value/s non accepted");
                        $("#errorParcel").css("display", "inline");
                    }
                },
                error: function (){
                    $('#errorParcel').html("<strong>Error!</strong> Error during insertion");
                    $("#errorParcel").css("display", "inline");
                }
            });
            $("#loadingParcel").hide();
        }, loadingTimeOut);
    }
    else{
        $("#successParcel").hide();
        $('#errorParcel').html("<strong>Please!</strong> Don't be lazy <strong>&#128527;</strong>");
        $("#errorParcel").css("display", "inline");
    }
    return false;
}
/*END INPUT-PARCEL*/

/*INPUT-PARCEL*/
function submitPath(){
    var ks_Parcel = $("#ks_Parcel").val();
    var place = $("#place").val();
    var date = $("#pathDate").val();
    var hour = $("#pathHour").val();
    var note = $("#note").val();

    if(ks_Parcel !== ""){
        $("#errorPath").hide();
        $("#successPath").hide();
        $("#loadingPath").show();
        setTimeout(function(){
            $.ajax({
                type: "GET",
                url: "../insert/path"
                        + "?ks_Parcel=" + ks_Parcel
                        + "&place=" + place
                        + "&date=" + date
                        + "&hour=" + hour
                        + "&note=" + note,
                async: true,
                success: function (data) {
                    if(data === "true")
                        $("#successPath").css("display", "inline");
                    else{
                        console.error(data);
                        $('#errorPath').html("<strong>Error!</strong> Value/s non accepted");
                        $("#errorPath").css("display", "inline");
                    }
                },
                error: function (){
                    $('#errorPath').html("<strong>Error!</strong> Error during insertion");
                    $("#errorPath").css("display", "inline");
                }
            });
            $("#loadingPath").hide();
        }, loadingTimeOut);
    }
    else{
        $("#successPath").hide();
        $('#errorPath').html("<strong>Please!</strong> Don't be lazy <strong>&#128527;</strong>");
        $("#errorPath").css("display", "inline");
    }
    return false;
}
/*END INPUT-PARCEL*/

$(document).ready(function () {
    $('#infoModal').modal('show');
});