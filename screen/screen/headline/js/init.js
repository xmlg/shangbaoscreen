(function() {
    window.zbdp = {};
    zbdp.getScaleAndLocation = function() {
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

    zbdp.getTime = function(a) {
        var date = new Date(a);
        var result = {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate(),
            hours: date.getHours()
        };
        return result;
    }

    zbdp.tip = {
        message: function(msg, time, isSucc) {
            $.showTopPrompt({
                msg: msg,
                out: time || 2000,
                isSucc: isSucc
            });
        },
        /** 信息提示(正常/成功) */
        info: function(msg, outTime) {
            $.showTopPrompt({
                msg: msg,
                out: outTime || 2000,
                isSucc: true
            });
        },
        /** 信息提示(失败/警告) */
        error: function(msg, outTime) {
            $.showTopPrompt({
                msg: msg,
                out: outTime || 2000,
                isSucc: false
            });
        }
    }

    zbdp.resizePage = function() {
        console.log('resizePage');
        var scaleAndLocation = zbdp.getScaleAndLocation();
        //if (scaleAndLocation.scale != 1) {
        //    $(".headline-main-container").css({
        //        "transform-origin": "left top",
        //        "-webkit-transform-origin": "left top",
        //        "transform": "scale(" + scaleAndLocation.scale + ")",
        //        "-webkit-transform": "scale(" + scaleAndLocation.scale + ")",
        //        "transform-origin": "left top",
        //        "-webkit-transform-origin": "left top",
        //        "margin-left": scaleAndLocation.location.x + "px",
        //        "margin-top": scaleAndLocation.location.y + "px"
        //    });
        //}
    }

    zbdp.configColors = [
        ['#17e1f3', '#f1e902'],
        ['#12b5e4', '#a6a000'],
        ['#109dc6', '#747000'],
        ['#0e7e9e', '#524f00'],
        ['#005771', '#3d3b00']
    ];

})();
