(function() {
    //根据分辨率调整页面大小
    function screen(w, h) {
        var width = $(window).width();
        var height = $(window).height();
        var location = {
            x: 0,
            y: 0
        };

        if (width / height < w / h) {
            scale = width / w;
            location.y = (height - h * scale) / 2;
        } else {
            scale = height / h;
            location.x = (width - w * scale) / 2;
        }
        $("body").css({
            "width": w,
            "height": h,
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

        $(window).resize(function() {
            screen(w, h);
        });

    }
    window.screen = screen;
})();