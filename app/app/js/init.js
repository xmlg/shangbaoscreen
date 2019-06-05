(function() {
    window.IABS = {}; // intelligent analysis big screen
    //http://dc.cqdailynews.com:8092
    //IABS.domain = "http://192.168.110.100";
    IABS.domain = "http://" + document.domain +":" +window.location.port +"/cb";

    IABS.getScaleAndLocation = function() {
        // 用于"transform": "scale(" + scale + ")",
        var scale = 1;
        // 缩放后居中的位置,
        var location = {
            x: 0,
            y: 0
        }
        var width = document.body.clientWidth;
        var height = document.body.clientHeight;
        if (width / height < 1920 / 1080) {
            scale = width / 1920;
            location.y = (height - 1080 * scale) / 2;
        } else {
            scale = height / 1080;
            location.x = (width - 1920 * scale) / 2;
        }
        return {
            scale: scale,
            location: location
        };
    }

    IABS.resizePage = function() {
        var scaleAndLocation = IABS.getScaleAndLocation();
        if (scaleAndLocation.scale != 1) {
            $(".page-content-container").css({
                "transform-origin": "left top",
                "-webkit-transform-origin": "left top",
                "transform": "scale(" + scaleAndLocation.scale + ")",
                "-webkit-transform": "scale(" + scaleAndLocation.scale + ")",
                "transform-origin": "left top",
                "-webkit-transform-origin": "left top",
                "margin-left": scaleAndLocation.location.x + "px",
                "margin-top": scaleAndLocation.location.y + "px"
            });
        }
    }

    IABS.configData = {
        'shiftInterval': 30, //页面切换时间间隔 单位s
    }

    

})();

function getResquestUrl(url, call, type) {
    $.ajax({
        type: type ? type : "get",
        url: url,
        dataType: "json",
        success: function(obj) {
            call(obj);
        },
        error: function(message) {
            console.log(message);
        }
    });
}