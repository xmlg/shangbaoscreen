define(function(require) {
    var ClassifyLabel = require('./ClassifyLabel');
    var PathWay = require('components/PathWay');
    var dataManager = require('tool/dataManager');

    function ClassifyLabelOfHistoryToday(parent, text, value, content, targetPoint) {
        ClassifyLabel.call(this, parent, text, value, targetPoint);
        this.content = content;
    }
    ClassifyLabelOfHistoryToday.prototype = Object.create(ClassifyLabel.prototype);
    ClassifyLabelOfHistoryToday.constructor = ClassifyLabelOfHistoryToday;
    ClassifyLabelOfHistoryToday.prototype.init = function() {
        var self = this;
        ClassifyLabel.prototype.init.call(this, cb.bind(this))

        function cb() {
            var HISTORYINTODAY = dataManager.getData().JSONPLAN.HISTORYINTODAY;
            var pattern = this.snapElement.path("M0 5 L10 5 M5 0 L5 10").attr({
                fill: "none",
                stroke: "rgba(13,126,158,0.2)",
                strokeWidth: 1,
                transform: 'scale(2,1)'
            }).pattern(0, 0, 10, 10);
            var mask = this.snapElement.circle(-210, 36, 0).attr({
                fill: "r()#fff-#000"
            });

            var bgRect = this.snapElement.rect(-280, -1, 137, 82).attr({
                fill: pattern,
                mask: mask
            });

            var bgRect2 = this.snapElement.rect(-280, 25, 0, 37).attr({
                fill: 'l(0,0,1,0)rgba(13, 126, 158,0)-rgba(13, 126, 158,0.25)'
            });

            var line01 = this.snapElement.line(-79.5, 0, -79.5, -0).attr({
                stroke: '#0d7e9e',
                'stroke-width': 2
            });
            var line02 = this.snapElement.line(-82, 0, -82, -0).attr({
                stroke: '#0d7e9e',
                'stroke-width': 1.5
            });
            var line03 = this.snapElement.line(-82, 0, -82, 0).attr({
                stroke: 'rgba(13,126,158,0.5)',
                'stroke-width': 1
            });

            var path01 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: 'rgba(13,126,158,0.5)',
                'stroke-width': '1',
                'transform': 'translate(0.5,0.5)'
            });

            var path02 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var path03 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var path04 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var path05 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var path06 = this.snapElement.path('').attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': '2',
                'transform': 'translate(0.5,0.5)'
            });

            var circle01 = this.snapElement.circle(-132, 3, 0).attr({
                fill: '#0d7e9e'
            });

            var circle02 = this.snapElement.circle(-132, 3, 0).attr({
                fill: 'none',
                stroke: '#0d7e9e',
                'stroke-width': 1
            });

            var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
            var $foreignObject = $(foreignObject);

            this.snapElement.append(foreignObject);
            var foreignObject = this.snapElement.select('foreignObject');
            $p = $('<p></p>');
            $p.css({
                margin: '0px',
                height: '100%',
                width: '100%',
                overflow: 'hidden',
                'font-size': '12px',
                'line-height': '18px',
                color: '#13b5e4',
                fontFamily: 'SimHei'
            });
            $p.hide();
            $foreignObject.append($p)

            foreignObject.attr({
                width: 155,
                height: 37,
                x: -280,
                y: 25
            });

            var title = this.snapElement.text(-281, 15, HISTORYINTODAY.TYPENAME).attr({
                'font-family': 'SimHei',
                fill: '#39A2C2',
                'font-size': '12px',
                'letter-spacing': '0.5px',
                opacity: 0
            });

            delay(0, function() {
                line01.animate({
                    y1: 3,
                    y2: -3
                }, 100);
            });
            delay(100, function() {
                line02.animate({
                    y1: 2,
                    y2: -2
                }, 100);
            });
            delay(200, function() {
                line03.animate({
                    x2: -131
                }, 100);
            });
            delay(300, function() {
                circle02.animate({
                    r: 3
                }, 100);
            });
            delay(400, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8'
                }, 100);
            });
            delay(500, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3'
                }, 100);
                path02.animate({
                    d: 'M-136 -1 L-143,-8'
                }, 100);
                path03.animate({
                    d: 'M-285 -8 L-290 -3'
                }, 100);
            });
            delay(600, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3 L-290 70'
                }, 100);
                path02.animate({
                    d: 'M-136 -1 L-143,-8 L-235 -8'
                }, 100);
                path03.animate({
                    d: 'M-285 -8 A5 5 0 0 0 -290 -3 L-290 5'
                }, 100);
                path04.animate({
                    d: 'M-290 60 L-290 70'
                }, 100);
            });
            delay(700, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3 L-290 70 L-275 85'
                }, 100);
                path04.animate({
                    d: 'M-290 60 L-290 70 L-275 85'
                }, 100);
                path05.animate({
                    d: 'M-130 85 L-125 85'
                }, 100);
            });
            delay(800, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3 L-290 70 L-275 85 L-125 85'
                }, 100);
                path04.animate({
                    d: 'M-290 60 L-290 70 L-275 85 L-255 85'
                }, 100);
                path05.animate({
                    d: 'M-130 85 L-125 85 A5 5 0 0 0 -120 80'
                }, 100);
            });
            delay(900, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3 L-290 70 L-275 85 L-125 85 A5 5 0 0 0 -120 80'
                }, 100);
                path05.animate({
                    d: 'M-130 85 L-125 85 A5 5 0 0 0 -120 80 L-120 75'
                }, 100);
            });
            delay(1000, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3 L-290 70 L-275 85 L-125 85 A5 5 0 0 0 -120 80 L-120 15'
                }, 100);
                path06.animate({
                    d: 'M-120 30 L-120 15'
                }, 100);
            });
            delay(1100, function() {
                path01.animate({
                    d: 'M-133 2 L-143,-8 L-285 -8 A5 5 0 0 0 -290 -3 L-290 70 L-275 85 L-125 85 A5 5 0 0 0 -120 80 L-120 15 L-133 2'
                }, 100);
                path06.animate({
                    d: 'M-120 30 L-120 15 L-128 7'
                }, 100);
                circle01.animate({
                    r: 2
                }, 100);
            });
            delay(1200, function() {
                mask.animate({
                    r: 70
                }, 100);
            });
            delay(1300, function() {
                bgRect2.animate({
                    width: 155
                }, 100);
                title.animate({
                    opacity: 1
                }, 100);

            });
            delay(1400, function() {
                var text = HISTORYINTODAY.CONTENT;
                $p.show();
                Snap.animate(0, text.length, function(val) {
                    $p.text(text.slice(0, val));
                }, 200, function() {});
            });
            self.title = title;
            self.$p = $p;
            self.startTimeTask();
        }
    };
    ClassifyLabelOfHistoryToday.prototype.startTimeTask = function() {
        var self = this;
        window.setInterval(function() {
            var HISTORYINTODAY = dataManager.getData().JSONPLAN.HISTORYINTODAY;

            var text1 = HISTORYINTODAY.CONTENT || '';
            Snap.animate(0, text1.length, function(val) {
                self.$p.text(text1.slice(0, val));
            }, 1000, function() {});

            var text2 = HISTORYINTODAY.TYPENAME || '今日历史';
            Snap.animate(0, text2.length, function(val) {
                self.title.attr({
                    text: text2.slice(0, val)
                });
            }, 1000, function() {});
        }, 10 * 1000);
    };
    return ClassifyLabelOfHistoryToday;
});