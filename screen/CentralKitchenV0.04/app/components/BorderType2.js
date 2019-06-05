define(function(require) {
    var Border = require('components/Border');

    function BorderType2(parent, w, h) {
        Border.call(this, parent, w, h);
    }
    BorderType2.prototype = Object.create(Border.prototype);
    BorderType2.constructor = BorderType2;
    BorderType2.prototype.init = function(cb) {
        var self = this;
        Border.prototype.init.call(this, cbb.bind(this));

        function cbb() {
            var pattern = self.snapElement.path("M0 0 L0 5 M0 0 L5 0").attr({
                fill: "none",
                stroke: "rgba(13,126,158,0.1)",
                strokeWidth: 1
            }).pattern(0, 0, 5, 5);
            var w = self.w - 40;
            var h = self.h - 40;
            var p = [];
            p[0] = [w / 2, -h / 2 + 20];
            p[1] = [w / 2 - 20, -h / 2];
            p[2] = [-w / 2, -h / 2];
            p[3] = [-w / 2, h / 2];
            p[4] = [w / 2, h / 2];
            var bgRect = self.snapElement.path('M ' + p[0] + ' L' + p[1] + ' L' + p[2] + ' L' + p[3] + ' L' + p[4] + 'Z')
                .attr({
                    stroke: "rgba(13,126,158,0.5)",
                    strokeWidth: 1,
                    fill: 'none',
                    transform: 'scale(0,0)'
                });

            bgRect.animate({
                transform: 'scale(1,1)'
            }, 500, cb);
        }
    }
    return BorderType2;
})