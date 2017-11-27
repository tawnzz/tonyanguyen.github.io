$(document).ready(function () {
  $("#intro").click( function (){
    if($(this).hasClass("helperClass")){
     $(this).find("p").text("You found me!");

    }else{
      $(this).find("p").text("Hi, I'm Tonya");
    }
    $(this).toggleClass("helperClass");
  });
});                  


