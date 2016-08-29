"use strict";

var trackingCode = getUrlVars()["trackingCode"];

/*Verify if the code exist in DB*/
$.ajax({
    type: "GET",
    url: "../trackingCode?trackingCode=" + trackingCode,
    async: true,
    success: function (data) {
        if(data === "false"){
            location.href = "../index.html";
        }
    },
    error: function() {
        location.href = "../index.html";
    }
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
    });
    return vars;
}
/*END VERIFY*/

/*icon-collapse*/
$('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
    }).on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
});
/*END icon-collapse*/

/*PDF Conversion*/
function toPdf() {
    var wimpImgData = 'data:image/png;base64,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';
    var nasaImgData = 'data:image/png;base64,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';
    var doc = new jsPDF('p', 'pt');

    /*Date*/
        var cT = new Date();
        var conversionDate = cT.getDate() +"/"+ (cT.getMonth()+1) +"/"+ cT.getFullYear()
                        +" "+ cT.getHours() +":"+ cT.getMinutes() +":"+ cT.getSeconds();
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext("2d"); 
        var dateWidth = ctx.measureText(conversionDate).width;
    /*END Date*/

    /*Header and footer*/
    var header = function (data) {
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.addImage(wimpImgData, 'PNG', data.settings.margin.left, 40, 25, 25);
        doc.text("Shipping Report: " + trackingCode, data.settings.margin.left + 35, 60);
        
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(conversionDate, (doc.internal.pageSize.width-19)-dateWidth, 50);
        doc.setFontSize(11);
        doc.text(' In partnership with ', data.settings.margin.left + 32.5, 80);
        doc.addImage(nasaImgData, 'PNG', data.settings.margin.left + 130, 69, 18, 14.88);
    };
    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
        var ctrPages = "Page " + data.pageCount;
        
        if (typeof doc.putTotalPages === 'function') {
            ctrPages = ctrPages + " of " + totalPagesExp;
        }
        doc.text(ctrPages, data.settings.margin.left, doc.internal.pageSize.height - 30);
        doc.addImage(wimpImgData, 'PNG', (doc.internal.pageSize.width/2)-17.5, 
                        doc.internal.pageSize.height-55, 35, 35);
        doc.text(conversionDate, (doc.internal.pageSize.width-35)-dateWidth, doc.internal.pageSize.height - 30);
    };
    /*END Header and footer*/
    
    var options = {
        beforePageContent: header,
        afterPageContent: footer,
        margin: {top: 95},
        theme: 'grid',
        styles: {
            overflow: 'linebreak'
        }
    };
    
    var table = doc.autoTableHtmlToJson(document.getElementById("pathTable"));
    var tableColumns = [];
    for(var i=0; i<(table.columns.length)-1; i++){
       tableColumns[i] = table.columns[i];
    }
    
    
    doc.autoTable(tableColumns, table.data, options);
    
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }
    doc.save(trackingCode + ".pdf");
}
/*END PDF Conversion*/

/*Modal-Info*/
$(document).ready(function(){
    $("#infoLayers").on('click', function() {
        alert("A layer must always stay active."); 
    });
    $("#infoProjection").on('click', function() {
        alert("A projection must always stay active."); 
    });
});
$(document).ready(function(){
    $('#resetView, #resetZoom').hover(function() {
        $(this).tooltip('hide');
    });
    $('#resetView, #resetZoom').click(function() {
        $(this).tooltip('show');
    });
});
/*END Modal-Info*/