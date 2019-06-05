define(function(require) {
    var Border = require('components/Border');
    function BorderType1(parent, w, h) {
        Border.call(this, parent, w, h);
        var pattern = this.childElement.path("M0 0 L0 5 M0 0 L5 0").attr({
            fill: "none",
            stroke: "rgba(13,126,158,0.1)",
            strokeWidth: 1
        }).pattern(0, 0, 5, 5);
        var ww = w - 30;
        var hh = h - 30;
        this.bgRect = this.childElement.rect(-ww / 2, -hh / 2, ww, 0).attr({
            stroke: "rgba(13,126,158,0.1)",
            strokeWidth: 1,
            fill: pattern
        });
    }
    BorderType1.prototype = Object.create(Border.prototype);
    BorderType1.constructor = BorderType1;
    BorderType1.prototype.init = function(cb) {
        var self = this;
        Border.prototype.init.call(this, cbb.bind(this));

        function cbb() {

            var w = self.w - 30;
            var h = self.h - 30;
            var bgRect = self.bgRect

            var line = self.childElement.line(-w / 2, -h / 2, w / 2, -h / 2).attr({
                stroke: "rgba(13,126,158,0.33)",
                strokeWidth: 1
            });
            var queue = new Queue(true);
            queue.runActions([
                function() {
                    line.attr({
                        y1: -h / 2,
                        y2: -h / 2
                    });
                    queue.run()
                },
                function() {
                    line.animate({
                        y1: h / 2,
                        y2: h / 2
                    }, 5000, queue.run);
                },
            ]);
            bgRect.animate({
                height: h
            }, 500, cb);
        }
    }
    return BorderType1;
})