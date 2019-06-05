define(function(require) {
    function CenterLogo() {}
    CenterLogo.prototype.init = function() {
        $(".centerLogo").html("");
        for (var i = 0; i < 210; i++) {
            $(".centerLogo").append("<img src='video/videoImgs/logo_00" + handleIndex(i) + ".jpg' class='videoImg' style='z-index:" + i + "'>");
        }
        var $imgs = $(".videoImg");
        loadImg(0, function() {
            $(".centerLogo").show();
            showVideo();
        });

        function loadImg(index, success) {
            var img = new Image();
            img.src = $imgs.eq(index).attr("src");
            img.onload = function() {
                if (index !== $imgs.length - 1) {
                    loadImg(++index, success);
                } else {
                    success();
                }
            };
        }

        function showVideo(success) {
            var index = 0;
            var interVal = setInterval(function() {
                $imgs.eq(index).show();
                if (index !== 0) {
                    $imgs.eq(index - 1).hide();
                }
                index++;
                if (index === 210) {
                    clearInterval(interVal);
                }
            }, 10);
        }

        function handleIndex(index) {
            if (index < 10) {
                index = "00" + index;
                return index;
            }
            if (index < 100) {
                index = "0" + index;
            }
            return index;
        }
    };
    CenterLogo.prototype.update = function() {
        var self = this;
        //self.init();
    };
    CenterLogo.constructor = CenterLogo;
    return CenterLogo;
});
