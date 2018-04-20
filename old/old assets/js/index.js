$(document).ready(function() {
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
