
"use strict";

/*TOOLTIP*/
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});
/*END TOOLTIP*/
/*NO-TOP-PAGE*/
$(document).ready(function(){
    $(".notALink").click(function(e){
        return false;
    });
});
/*END NO-TOP-PAGE*/