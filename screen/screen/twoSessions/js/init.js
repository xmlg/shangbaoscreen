//根据分辨率调整页面大小
function screen() {
    var width = $(window).width();
    var height = $(window).height();
    var location = {
        x: 0,
        y: 0
    };

    if (width / height < 1920 / 1080) {
        scale = width / 1920;
        location.y = (height - 1080 * scale) / 2;
    } else {
        scale = height / 1080;
        location.x = (width - 1920 * scale) / 2;
    }
    $("body").css({
        "width": 1920,
        "height": 1080,
        "transform": "scale(" + scale + ")",
        "-ms-transform": "scale(" + scale + ")",
        "-moz-transform": "scale(" + scale + ")",
        "-webkit-transform": "scale(" + scale + ")",
        "-o-transform": "scale(" + scale + ")",
        "transform-origin": "left top",
        "-ms-transform-origin": "left top",
        "-webkit-transform-origin": "left top",
        "-moz-transform-origin": "left top",
        "-o-transform-origin": "left top",
        "margin-left": location.x + "px",
        "margin-top": location.y + "px"
    });

}

$(window).resize(function() {
    screen();
});

screen();