$(document).ready(function() {

    $(function() {
        //page title
        var pageTitle = $("title").text();

        //change page title!
        $(window).blur(function() {
            $("title").text("😔 Come back! ");
        });

        //change back on focus
        $(window).focus(function() {
          $("title").text(pageTitle);
        });
    });
})
