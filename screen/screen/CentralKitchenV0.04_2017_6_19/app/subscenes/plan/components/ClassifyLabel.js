define(function(require) {
    var Component = require('components/Component');
    var PathWay = require('components/PathWay');

    function ClassifyLabel(parent, text, value, targetPoint) {
        this.text = text;
        this.value = value;
        this.targetPoint = targetPoint;
        Component.call(this, parent);
    }

    ClassifyLabel.prototype = Object.create(Component.prototype);
    ClassifyLabel.constructor = ClassifyLabel;
    ClassifyLabel.prototype.init = function(cb) {
        var self = this;
        var patternPath = this.snapElement.path("M6 0 6 20").attr({
            fill: "none",
            stroke: "rgba(13,126,158)",
            strokeOpacity: 0.5,
            strokeWidth: 6,
            transform: 'scale(1,1)'
        });
        var pattern = patternPath.pattern(0, 0, 10, 10).attr({
            patternTransform: 'rotate(30)'
        });
        self.patternPath = patternPath;
        self.pattern = pattern;

        var rect = this.snapElement.rect(-75, -12, 150, 0).attr({
            fill: 'rgba(13,126,158,0.2)'
        });

        var rect2 = this.snapElement.rect(-75, -12, 0, 24).attr({
            fill: pattern
        });

        var path1 = this.snapElement.path('M77 -6 L77 6');
        var path2 = this.snapElement.path('M-77 -6 L-77 6');
        var pathSet1 = Snap.set(path1, path2).attr({
            stroke: 'rgb(13,126,158)',
            'stroke-width': 1,
            fill: 'none',
            opacity: 0
        });

        var path3 = this.snapElement.path('M-2 -12 L-2 12');
        var path4 = this.snapElement.path('M2 -12 L2 12');
        var pathSet2 = Snap.set(path3, path4).attr({
            stroke: '#0d7e9e',
            'stroke-width': 1,
            opacity: 0
        });

        var text = this.snapElement.text(-68, 5, this.text);
        text.attr({
            'font-family': 'SimHei',
            fill: '#13b5e4',
            'font-size': '14px',
            'letter-spacing': '0.7px',
            opacity: 0
        });

        var value = this.valueText = this.snapElement.text(67, 6, '0');
        value.attr({
            'font-family': 'SimHei',
            fill: '#ffffff',
            'font-size': '15px',
            'letter-spacing': '0.7px',
            'text-anchor': 'end',
            opacity: 0
        });

        var point2 = [
            [this.targetPoint[0] - this.x],
            [this.targetPoint[1] - this.y]
        ]
        var point1 = [
            [this.targetPoint[0] - this.x - 13],
            [this.targetPoint[1] - this.y]
        ]
        var targetPath = this.targetPath = new PathWay(
            this,
            'M77 0 90 0 ' + point1[0] + ' ' + point1[1] + ' ' + point2[0] + ' ' + point2[1], {
                stroke: '#0d7e9e',
                'stroke-width': 1,
                fill: 'none',
                transform: 'translate(-0.5 -0.5)',
                opacity: 0.5
            },
            '#00AAff'
        );

        var queue = new Queue();
        queue.runActions([
            function() {
                delay(0, function() {
                    pathSet2.animate({
                        opacity: 1
                    }, 100);
                });
                delay(100, function() {
                    pathSet2.animate({
                        opacity: 0
                    }, 100);
                });
                delay(200, function() {
                    pathSet2.animate({
                        opacity: 1
                    }, 100);
                });
                delay(300, function() {
                    pathSet2.animate({
                        opacity: 0
                    }, 100);
                });
                delay(400, function() {
                    pathSet2.animate({
                        opacity: 1
                    }, 100, queue.run);
                });
            },
            function() {
                pathSet2.animate({
                    'stroke-width': 2
                }, 100)
                path3.animate({
                    d: 'M-77 -6 L-77 6'
                }, 250);
                path4.animate({
                    d: 'M77 -6 L77 6'
                }, 250, queue.run);
            },
            function() {
                pathSet1.attr({
                    opacity: 0.5
                });
                path1.animate({
                    d: 'M76 -13 L76 -13 A1 1 0 0 1 77 -12 L77 12 A1 1 0 0 1 76 13 L76 13'
                }, 250);
                path2.animate({
                    d: 'M-76 13 L-76 13 A1 1 0 0 1 -77 12 L-77 -12 A1 1 0 0 1 -76 -13 L-76 -13'
                }, 250, queue.run);
            },
            function() {
                path1.animate({
                    d: 'M65 -15 L74 -15 A3 3 0 0 1 77 -12 L77 12 A3 3 0 0 1 74 15 L65 15'
                }, 250);
                path2.animate({
                    d: 'M-65 15 L-74 15 A3 3 0 0 1 -77 12 L-77 -12 A3 3 0 0 1 -74 -15 L-65 -15'
                }, 250, queue.run);
                targetPath.init();
                cb && cb();
            },
            function() {
                rect.animate({
                    height: 24
                }, 250, queue.run);
            },
            function() {
                rect2.animate({
                    width: 150
                }, 250, queue.run);
                patternPath.attr({
                    strokeOpacity: 1
                });
                pattern.attr({
                    x: self.value * 20 - 10
                }, 1000)

                patternPath.animate({
                    strokeOpacity: 0.2
                }, 1000);
                pattern.animate({
                    x: self.value * 20
                }, 1000)
            },
            function() {
                text.animate({
                    opacity: 1
                }, 250);
                value.animate({
                    opacity: 1
                }, 250, queue.run);
                var i = d3.interpolate(0, self.value);
                Snap.animate(0, 1, function(val) {
                    value.attr({
                        text: ~~i(val)
                    });
                }, 250);
            }
        ])
    }
    ClassifyLabel.prototype.increase = function(increment, cb, meteor) {
        var self = this;

        this.value += increment || 1;
        this.valueText.attr({
            text: this.value
        });
        self.patternPath.stop().animate({
            strokeOpacity: 1
        }, 500, function() {
            self.patternPath.stop().animate({
                strokeOpacity: 0.2
            }, 500);
        });

        this.pattern.stop().animate({
            x: this.value * 20
        }, 250)
        if (meteor !== false) this.targetPath.run(null, cb);
    }
    return ClassifyLabel;
});
