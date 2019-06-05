define(function(require) {
    var ClassifyLabel = require('./ClassifyLabel');
    var PathWay = require('components/PathWay');
    var Tip = require('./Tip');

    function ClassifyLabelOfPolicynum(parent, text, value, valueDetail, targetPoint) {
        ClassifyLabel.call(this, parent, text, value, targetPoint);
        this.valueDetail = valueDetail;

        var targetPath2 = this.targetPath2 = new PathWay(
            this,
            'M218 21 206 21 201 46 162 46 152 33 143 33', {
                stroke: '#0d7e9e',
                'stroke-width': 1,
                fill: 'none',
                transform: 'translate(-0.5 -0.5)',
                opacity: 0.5
            },
            '#00AAff'
        );
        targetPath2.setPosition(-300, -20.5);

        var targetPath3 = this.targetPath3 = new PathWay(
            this,
            'M218 21 206 21 201 46 162 46 152 61 143 61', {
                stroke: '#0d7e9e',
                'stroke-width': 1,
                fill: 'none',
                transform: 'translate(-0.5 -0.5)',
                opacity: 0.5
            },
            '#00AAff'
        );
        targetPath3.setPosition(-300, -20.5);

        var tip = this.tip1 = new Tip(this, 60, '全国政策', this.valueDetail[0]);
        tip.setPosition(-167, 12);

        var tip = this.tip2 = new Tip(this, 60, '浙江政策', this.valueDetail[1]);
        tip.setPosition(-167, 40);
    }
    ClassifyLabelOfPolicynum.prototype = Object.create(ClassifyLabel.prototype);
    ClassifyLabelOfPolicynum.constructor = ClassifyLabelOfPolicynum;
    ClassifyLabelOfPolicynum.prototype.init = function() {
        var self = this;
        ClassifyLabel.prototype.init.call(this, cb.bind(this))

        function cb() {
            this.targetPath2.init();
            this.targetPath3.init();

            self.tip1.init();
            self.tip2.init();

            var line01 = this.snapElement.line(-79.5, 0, -79.5, -0).attr({
                stroke: '#0d7e9e',
                'stroke-width': 2
            });
            var line02 = this.snapElement.line(-82, 0, -82, -0).attr({
                stroke: '#0d7e9e',
                'stroke-width': 1.5
            });

            var queue = new Queue();
            queue.runActions([
                function() {
                    Snap.animate(0, 1, function(val) {}, 0, function() {
                        line01.animate({
                            y1: 3,
                            y2: -3
                        }, 100);
                    });
                    Snap.animate(0, 1, function(val) {}, 100, function() {
                        line02.animate({
                            y1: 2,
                            y2: -2
                        }, 100);
                    })
                }
            ]);
        }
    }
    ClassifyLabelOfPolicynum.prototype.increase = function(increment, cb, subPathIndex) {
        var self = this;
        this.value += increment || 1;
        this.valueText.attr({
            text: this.value
        });
        this.targetPath.run(null, cb);
        if(subPathIndex == 1) {
            this.targetPath2.run(null, function() {
                self.tip1.increase();
            });
        }
        if(subPathIndex == 2) {
            this.targetPath3.run(null, function() {
                self.tip2.increase();
            });
        }

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
    return ClassifyLabelOfPolicynum;
});