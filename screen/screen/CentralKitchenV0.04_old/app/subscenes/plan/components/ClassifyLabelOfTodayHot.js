define(function(require) {

    var ClassifyLabel = require('./ClassifyLabel');
    var PathWay = require('components/PathWay');

    function ClassifyLabelOfTodayHot(parent, text, value, values, targetPoint) {
        ClassifyLabel.call(this, parent, text, value, targetPoint);
        this.values = values;

    }
    ClassifyLabelOfTodayHot.prototype = Object.create(ClassifyLabel.prototype);
    ClassifyLabelOfTodayHot.constructor = ClassifyLabelOfTodayHot;
    ClassifyLabelOfTodayHot.prototype.init = function() {
        var self = this;
        ClassifyLabel.prototype.init.call(this, cb.bind(this))

        function cb() {
            var contentG = this.contentG = this.snapElement.g().attr({
                opacity: 0
            });

            this.contentG.text(-175, 95, '垂直领域热点').attr({
                textAnchor: 'end',
                fontFamily: 'SimHei',
                fontSize: '12px',
                fill: '#13b5e4'
            });
            this.contentG.text(-175, 120, '地域热点').attr({
                textAnchor: 'end',
                fontFamily: 'SimHei',
                fontSize: '12px',
                fill: '#13b5e4'
            });
            this.contentG.text(-175, 145, '网信办门户排行热点').attr({
                textAnchor: 'end',
                fontFamily: 'SimHei',
                fontSize: '12px',
                fill: '#13b5e4'
            });

            var sum = d3.sum(this.values);
            var widthScale = d3.scale.linear().domain([0, sum])
                .range([5, 35]);
            var w1 = widthScale(this.values[0]);
            var w2 = widthScale(this.values[1]);
            var w3 = widthScale(this.values[2]);

            this.rect1 = this.contentG.rect(-170, 86, w1, 10).attr({
                fill: '#13b5e4'
            });

            this.rect2 = this.contentG.rect(-170, 111, w2, 10).attr({
                fill: '#13b5e4'
            });

            this.rect3 = this.contentG.rect(-170, 136, w3, 10).attr({
                fill: '#13b5e4'
            });

            this.valueText1 = this.contentG.text(-163 + w1, 95, this.values[0]).attr({
                fontFamily: 'SimHei',
                fontSize: '12px',
                fill: '#ffffff'
            });

            this.valueText2 = this.contentG.text(-163 + w2, 120, this.values[1]).attr({
                fontFamily: 'SimHei',
                fontSize: '12px',
                fill: '#ffffff'
            });

            this.valueText3 = this.contentG.text(-163 + w3, 145, this.values[2]).attr({
                fontFamily: 'SimHei',
                fontSize: '12px',
                fill: '#ffffff'
            });
            var pattern = this.snapElement.path("M0 5 L10 5 M5 0 L5 10").attr({
                fill: "none",
                stroke: "rgba(13,126,158,0.2)",
                strokeWidth: 1,
                transform: 'scale(2,1)'
            }).pattern(0, 0, 10, 10);
            var mask = this.snapElement.circle(-200, 117, 0).attr({
                fill: "r()#fff-#000"
            });

            var bgRect = this.snapElement.rect(-280, 80, 157, 82).attr({
                fill: pattern,
                mask: mask
            });

            var path01 = this.path01 = new PathWay(
                this,
                'M-82 0 -95 10 -95 73 -108 82', {
                    stroke: '#0d7e9e',
                    'stroke-width': 1,
                    fill: 'none',
                    transform: 'translate(-0.5 -0.5)',
                    opacity: 0.5
                },
                '#00AAff'
            );
            var line01 = this.snapElement.line(-79.5, 0, -79.5, -0).attr({
                stroke: '#0d7e9e',
                'stroke-width': 2
            });
            var line02 = this.snapElement.line(-82, 0, -82, -0).attr({
                stroke: '#0d7e9e',
                'stroke-width': 1.5
            });

            var circle01 = this.snapElement.circle(-111, 83, 0).attr({
                fill: '#0d7e9e'
            });

            var circle02 = this.snapElement.circle(-111, 83, 0).attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': 1
            });

            var border01 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: 'rgba(13,126,158,0.5)',
                'stroke-width': '1',
                'transform': 'translate(0.5,0.5)'
            });

            var border02 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var border03 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var border04 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var border05 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var border06 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            delay(0, function() {
                line01.animate({
                    y1: 3,
                    y2: -3
                }, 50);
            });
            delay(50, function() {
                line02.animate({
                    y1: 2,
                    y2: -2
                }, 50);
            });
            delay(100, function() {
                path01.init(150)
            });
            delay(250, function() {
                circle02.animate({
                    r: 3
                }, 25);
            });
            delay(275, function() {
                border01.attr({
                    d: 'M-112 82 L-112 82'
                })
            });
            delay(350, function() {
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70'
                }, 25);
                border01.animate({
                    d: 'M-112 82 L-123 70'
                }, 25);
                border02.animate({
                    d: 'M-115 78 L-123 70'
                }, 25);

            });
            delay(375, function() {
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70 A5 5 0 0 0 -290 75'
                }, 25);

                border02.animate({
                    d: 'M-115 78 L-123 70 L-215 70'
                }, 25);
                border03.animate({
                    d: 'M-285 70 A5 5 0 0 0'
                }, 25);

            });
            delay(450, function() {
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70 A5 5 0 0 0 -290 75 L-290 150'
                }, 25);

                border03.animate({
                    d: 'M-285 70 A5 5 0 0 0 -290 75 L-290 83'
                }, 25);
                border04.animate({
                    d: 'M-290 140 L-290 150'
                }, 25);

            });
            delay(475, function() {
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70 A5 5 0 0 0 -290 75 L-290 150 L-275 165'
                }, 25);

                border04.animate({
                    d: 'M-290 140 L-290 150 L-275 165'
                }, 25);
                border05.animate({
                    d: 'M-105 165 L-100 165'
                }, 25);

            });
            delay(550, function() {
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70 A5 5 0 0 0 -290 75 L-290 150 L-275 165 L-105 165'
                }, 25);

                border04.animate({
                    d: 'M-290 140 L-290 150 L-275 165 L-255 165'
                }, 25);
                border05.animate({
                    d: 'M-105 165 L-100 165 A5 5 0 0 0 -95 160'
                }, 25);

            });
            delay(575, function() {
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70 A5 5 0 0 0 -290 75 L-290 150 L-275 165 L-105 165 A10 10 0 0 0 -95 160'
                }, 25);
                border05.animate({
                    d: 'M-105 165 L-100 165 A5 5 0 0 0 -95 160 L-95 155'
                }, 25);
                border06.animate({
                    d: 'M-95 110 L-95 101'
                }, 25);

            });
            delay(600, function() {
                mask.animate({
                    r: 90
                }, 100);
                contentG.animate({
                    opacity: 1
                }, 100)
                border01.animate({
                    d: 'M-112 82 L-123 70 L-285 70 A5 5 0 0 0 -290 75 L-290 150 L-275 165 L-105 165 A10 10 0 0 0 -95 160  L-95 101 L-114  80'
                }, 25);
                border06.animate({
                    d: 'M-95 110 L-95 101 L-106 89'
                }, 25);
                circle01.animate({
                    r: '2'
                }, 25);

            });
        }
    }
    ClassifyLabelOfTodayHot.prototype.updateValues = function() {
        var sum = d3.sum(this.values);
        var widthScale = d3.scale.linear().domain([0, sum])
            .range([5, 35]);
        var w1 = widthScale(this.values[0]);
        var w2 = widthScale(this.values[1]);
        var w3 = widthScale(this.values[2]);

        this.rect1.attr({
            width: w1
        });
        this.rect2.attr({
            width: w2
        });
        this.rect2.attr({
            width: w3
        });

        this.valueText1.attr({
            x: -163 + w1,
            text: this.values[0]
        });
        this.valueText2.attr({
            x: -163 + w2,
            text: this.values[1]
        });
        this.valueText3.attr({
            x: -163 + w3,
            text: this.values[2]
        });

    }
    ClassifyLabelOfTodayHot.prototype.increase = function(increment, type, cb) {
        var self = this;
        this.value += increment || 1;
        this.values[type - 1] += increment;
        this.valueText.attr({
            text: this.value
        });
        this.targetPath.run(null, cb);
        this.path01.run(null, function() {
            self.updateValues();
        })

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
    }
    return ClassifyLabelOfTodayHot;
});