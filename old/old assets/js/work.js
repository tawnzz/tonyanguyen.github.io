$(document).ready(function() {
    $('.work-title1').hover(function() {
        $('.work-des1').slideToggle(800, 'swing');
    });

    $('.work-title2').hover(function() {
        $('.work-des2').slideToggle(800, 'swing');
    });

    $('.work-title3').hover(function() {
        $('.work-des3').slideToggle(800, 'swing');
    }); 

    $('.work-title4').hover(function() {
        $('.work-des4').slideToggle(800, 'swing');
    }); 

    $('.menu-item').mouseenter(function () {
        $(this).css({
            outline: "0px solid transparent"
        }).animate({
            outlineWidth: '4px',
            outlineColor: '#f37736'
        }, 550);
    }).mouseleave(function () {
        $(this).animate({
            outlineWidth: '0px',
            outlineColor: '#037736'
        }, 560);
    });    
})
