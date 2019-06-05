define(function(require) {
    var Component = require('components/Component');
    function Border(parent, w, h) {
        Component.call(this, parent);

        this.childElement = this.snapElement.g();
        this.title = this.childElement.text(0, 0, '').attr({
            fill: '#9BD4D7',
            textAnchor: 'middle',
            fontFamily: 'SimHei',
            transform: 'matrix(1,0,0,1,0,-140)',
            letterSpacing: '2.5px',
            fontSize: '18px'
        });

        this.w = w;
        this.h = h;
    }
    Border.prototype = Object.create(Component.prototype);
    Border.constructor = Border;
    Border.prototype.init = function(fn) {

        var y0 = 35 - 3;
        var y1 = 35 - 18;
        var y2 = 35 - 50;

        var x0 = 35 - 36;
        var x1 = 35 - 12;
        var x2 = 35 - 4;

        var path01 = this.snapElement.path('M' + [x0, y0, x1, y0, x2, y1, x2, y2].join(' '));
        var path02 = this.snapElement.path('M' + [-x0, y0, -x1, y0, -x2, y1, -x2, y2].join(' '));
        var path03 = this.snapElement.path('M' + [-x0, -y0, -x1, -y0, -x2, -y1, -x2, -y2].join(' '));
        var path04 = this.snapElement.path('M' + [x0, -y0, x1, -y0, x2, -y1, x2, -y2].join(' '));

        this.path01 = path01;
        this.path02 = path02;
        this.path03 = path03;
        this.path04 = path04;

        var filter = Snap.filter.blur(1);

        var set = Snap.set(path01, path02, path03, path04);
        set.attr({
            stroke: 'rgb(13,126,158)',
            'stroke-width': 1,
            fill: 'none',
            filter: "url('#filter3000')",
            opacity: 0
        });

        var y0 = this.h / 2 - 3;
        var y1 = this.h / 2 - 18;
        var y2 = this.h / 2 - 50;

        var x0 = this.w / 2 - 36;
        var x1 = this.w / 2 - 12;
        var x2 = this.w / 2 - 4;

        var queue = new Queue();
        var step1 = function() {
            set.animate({
                opacity: 1
            }, 150, queue.run)
        }
        var step2 = function() {
            set.animate({
                opacity: 0
            }, 150, queue.run)
        }
        var step3 = function() {
            set.animate({
                opacity: 1
            }, 150, queue.run)
        }
        var step4 = function() {
            path01.animate({
                d: 'M' + [x0, y0, x1, y0, x2, y1, x2, y2].join(' ')
            }, 550);
            path02.animate({
                d: 'M' + [-x0, y0, -x1, y0, -x2, y1, -x2, y2].join(' ')
            }, 550);
            path03.animate({
                d: 'M' + [-x0, -y0, -x1, -y0, -x2, -y1, -x2, -y2].join(' ')
            }, 550);
            path04.animate({
                d: 'M' + [x0, -y0, x1, -y0, x2, -y1, x2, -y2].join(' ')
            }, 550, fn);
        }
        queue.runActions([step1, step2, step3, step4]);
    }
    Border.prototype.setTitle = function(title) {
        var self = this;
        this.titleType = title;
        this.title.attr({
            text: ''
        });
        Snap.animate(0, title.length, function(val) {
            self.title.attr({
                text: title.slice(0, ~~val)
            });
        }, 1000);
    }
    Border.prototype.blink = function(cb) {
        var self = this;

        var path01 = this.path01;
        var path02 = this.path02;
        var path03 = this.path03;
        var path04 = this.path04;
        var childElement = this.childElement;

        var queue = new Queue();

        var step1 = function() {
            var y0 = (self.h / 2 - 3) * 1.15;
            var y1 = (self.h / 2 - 18) * 1.15;
            var y2 = (self.h / 2 - 50) * 1.15;

            var x0 = (self.w / 2 - 36) * 1.15;
            var x1 = (self.w / 2 - 12) * 1.15;
            var x2 = (self.w / 2 - 4) * 1.15;

            path01.animate({
                d: 'M' + [x0, y0, x1, y0, x2, y1, x2, y2].join(' ')
            }, 100);
            path02.animate({
                d: 'M' + [-x0, y0, -x1, y0, -x2, y1, -x2, y2].join(' ')
            }, 100);
            path03.animate({
                d: 'M' + [-x0, -y0, -x1, -y0, -x2, -y1, -x2, -y2].join(' ')
            }, 100);
            path04.animate({
                d: 'M' + [x0, -y0, x1, -y0, x2, -y1, x2, -y2].join(' ')
            }, 100, queue.run);
            childElement.animate({
                transform: 'scale(1.1)'
            }, 100)
        };
        var step2 = function() {
            var y0 = 35 - 3;
            var y1 = 35 - 18;
            var y2 = 35 - 50;

            var x0 = 35 - 36;
            var x1 = 35 - 12;
            var x2 = 35 - 4;

            path01.animate({
                d: 'M' + [x0, y0, x1, y0, x2, y1, x2, y2].join(' ')
            }, 300);
            path02.animate({
                d: 'M' + [-x0, y0, -x1, y0, -x2, y1, -x2, y2].join(' ')
            }, 300);
            path03.animate({
                d: 'M' + [-x0, -y0, -x1, -y0, -x2, -y1, -x2, -y2].join(' ')
            }, 300);
            path04.animate({
                d: 'M' + [x0, -y0, x1, -y0, x2, -y1, x2, -y2].join(' ')
            }, 300, queue.run);
            childElement.animate({
                transform: 'scale(0.5)',
                opacity: 0
            }, 150)
        }
        var step3 = function() {
            cb && cb();

            var y0 = (self.h / 2 - 3) * 1.1;
            var y1 = (self.h / 2 - 18) * 1.1;
            var y2 = (self.h / 2 - 50) * 1.1;

            var x0 = (self.w / 2 - 36) * 1.1;
            var x1 = (self.w / 2 - 12) * 1.1;
            var x2 = (self.w / 2 - 4) * 1.1;

            path01.animate({
                d: 'M' + [x0, y0, x1, y0, x2, y1, x2, y2].join(' ')
            }, 400);
            path02.animate({
                d: 'M' + [-x0, y0, -x1, y0, -x2, y1, -x2, y2].join(' ')
            }, 400);
            path03.animate({
                d: 'M' + [-x0, -y0, -x1, -y0, -x2, -y1, -x2, -y2].join(' ')
            }, 400);
            path04.animate({
                d: 'M' + [x0, -y0, x1, -y0, x2, -y1, x2, -y2].join(' ')
            }, 400, queue.run);

            delay(150, function() {
                childElement.animate({
                    transform: 'scale(1.1)',
                    opacity: 1
                }, 250)
            });
        };
        var step4 = function() {
            var y0 = (self.h / 2 - 3) * 1;
            var y1 = (self.h / 2 - 18) * 1;
            var y2 = (self.h / 2 - 50) * 1;

            var x0 = (self.w / 2 - 36) * 1;
            var x1 = (self.w / 2 - 12) * 1;
            var x2 = (self.w / 2 - 4) * 1;

            path01.animate({
                d: 'M' + [x0, y0, x1, y0, x2, y1, x2, y2].join(' ')
            }, 100);
            path02.animate({
                d: 'M' + [-x0, y0, -x1, y0, -x2, y1, -x2, y2].join(' ')
            }, 100);
            path03.animate({
                d: 'M' + [-x0, -y0, -x1, -y0, -x2, -y1, -x2, -y2].join(' ')
            }, 100);
            path04.animate({
                d: 'M' + [x0, -y0, x1, -y0, x2, -y1, x2, -y2].join(' ')
            }, 100, queue.run);

            childElement.animate({
                transform: 'scale(1)'
            }, 100)
        }
        queue.runActions([step1, step2, step3, step4]);
    }
    return Border;
});