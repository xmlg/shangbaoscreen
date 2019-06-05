define(function(require) {
    var Component = require('components/Component');

    function PathWay(parent, d, attrs, color) {
        Component.call(this, parent);
        this.d = d;
        this.color = color;
        this.path = this.snapElement.path('M0 0');
        this.path.attr(attrs || {});
        this.pointMap = {};
        this.pointsMap = {};
        this.speed = 500;
    }
    PathWay.prototype = Object.create(Component.prototype);
    PathWay.constructor = PathWay;
    PathWay.prototype.init = function(ms, cb) {
        this.path.animatePath(this.d, ms || 1000, cb);
    }
    PathWay.prototype.show = function(ms, cb) {
        this.path.animatePath(this.d, ms || 1000, cb);
    }
    PathWay.prototype.hide = function() {
        this.path.attr({
            d: ''
        });
    }
    PathWay.prototype.run = function(ms, cb) {
        var self = this;
        var flyPath = this.path;
        var g = this.snapElement.g().attr({
            filter: 'url("#filter5790")'
        });
        var grd = this.snapElement.paper.gradient('r()#fff-' + (this.color || '#E24E2B'));
        var c = g.circle(0, 0, 3).attr({
            fill: grd,
            opacity: 1
        });
        var polygon = g.polygon();
        polygon.attr({
            points: '100 0 0 100 50 100',
            fill: this.color || '#E24E2B',
            stroke: "none",
            strokeWidth: 0,
            opacity: 0.8
        });
        var mms = 1000 * flyPath.getTotalLength() / this.speed
        Snap.animate(0, flyPath.getTotalLength() + 100, function(val) {
            var l = ~~val;
            var width = 120;

            var points = self.pointsMap[l];
            if(points) {
                c.attr({
                    cx: points.x,
                    cy: points.y
                });
                polygon.attr({
                    points: points.points
                });
            } else {
                var points1 = '';
                var points2 = '';
                var o = flyPath.getPointAtLength(0);
                for(var w = 0; w <= width; w += 15) {
                    var length = Math.max(l - w, 0);
                    var pointAtLength = self.pointMap[length];

                    if(!pointAtLength) {
                        pointAtLength = flyPath.getPointAtLength(length);
                        self.pointMap[length] = pointAtLength;
                    }
                    var h = ~~(width - w) / 40;
                    var point = {
                        x: pointAtLength.x,
                        y: pointAtLength.y,
                        alpha: pointAtLength.alpha
                    };
                    //console.log(point);
                    var x = point.x + h * Math.cos(Math.PI * (point.alpha + 90) / 180);
                    var y = point.y + h * Math.sin(Math.PI * (point.alpha + 90) / 180);
                    points1 += " " + x + " " + y;
                    var x = point.x + h * Math.cos(Math.PI * (point.alpha - 90) / 180);
                    var y = point.y + h * Math.sin(Math.PI * (point.alpha - 90) / 180);
                    points2 = x + " " + y + " " + points2;
                }
                c.attr({
                    cx: flyPath.getPointAtLength(l).x,
                    cy: flyPath.getPointAtLength(l).y
                });
                polygon.attr({
                    points: points1 + " " + points2
                });
                self.pointsMap[l] = {
                    x: flyPath.getPointAtLength(l).x,
                    y: flyPath.getPointAtLength(l).y,
                    points: points1 + " " + points2
                };
            }

        }, ms || mms, function() {
            g.remove();
            grd.remove();
            cb && cb();
        })
    }
    return PathWay;
});