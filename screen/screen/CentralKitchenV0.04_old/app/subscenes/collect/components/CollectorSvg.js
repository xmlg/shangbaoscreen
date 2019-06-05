define(function(require) {
    var svgRepository = require('tool/svgRepository');
    var Component = require('components/Component');

    function CollectorSvg(parent, valueDetail) {
        Component.call(this, parent);
        this.valueDetail = valueDetail;

        this.svgWrapperG = this.snapElement.g();
        this.svgWrapperG.append(svgRepository.getSvg('collector'));
        this.svgWrapperG.attr({
            transform: 'matrix(0.5,0,0,0.5,0,0)'
        })

        this.ring0 = this.svgWrapperG.select('#ring0');
        this.ring1 = this.svgWrapperG.select('#ring1');
        this.ring2 = this.svgWrapperG.select('#ring2');
        this.text = this.svgWrapperG.select('#text');

        this.text1 = this.text.select('#t1');
        this.text2 = this.text.select('#t2');
        this.text3 = this.text.select('#t3');
        this.text4 = this.text.select('#t4');
        this.text5 = this.text.select('#t5');

        this.text1.attr({
            text: this.valueDetail[0]
        });
        this.text2.attr({
            text: this.valueDetail[1]
        })
        this.text3.attr({
            text: this.valueDetail[2]
        })
        this.text4.attr({
            text: this.valueDetail[3]
        })
        this.text5.attr({
            text: this.valueDetail[4]
        })

        Snap.set(this.ring0, this.ring1, this.ring2, this.text).attr({
            transform: 'scale(3)',
            opacity: 0
        })
    }
    CollectorSvg.prototype = Object.create(Component.prototype);
    CollectorSvg.constructor = Component;
    CollectorSvg.prototype.init = function(fn) {
        var self = this;

        self.ring0.animateQueue({
            transform: 'scale(1)',
            opacity: 1
        }, 250, function() {
            var queue = new Queue(true);
            queue.runActions([
                function() {
                    self.ring0.animate({
                        transform: 'scale(1) rotate(-30)'
                    }, 5000, queue.run)
                },
                function() {
                    self.ring0.animate({
                        transform: 'scale(1) rotate(30)'
                    }, 5000, queue.run)
                }
            ])
        });

        delay(100, function() {
            self.ring1.animateQueue({
                transform: 'scale(1)',
                opacity: 1
            }, 250, function() {
                var queue = new Queue(true);
                queue.runActions([
                    function() {
                        self.ring1.animate({
                            transform: 'scale(1) rotate(-45)'
                        }, 5000, queue.run)
                    },
                    function() {
                        self.ring1.animate({
                            transform: 'scale(1) rotate(-0)'
                        }, 5000, queue.run)
                    }
                ])
            });
        })

        delay(200, function() {
            self.ring2.animateQueue({
                transform: 'scale(1)',
                opacity: 1
            }, 250);
        })

        delay(300, function() {
            self.text.animate({
                transform: 'scale(1)',
                opacity: 1
            }, 250);
        })
    };
    CollectorSvg.prototype.setValues = function(valueDetail) {
        this.valueDetail = valueDetail;
        this.text1.attr({
            text: this.valueDetail[0]
        });
        this.text2.attr({
            text: this.valueDetail[1]
        })
        this.text3.attr({
            text: this.valueDetail[2]
        })
        this.text4.attr({
            text: this.valueDetail[3]
        })
        this.text5.attr({
            text: this.valueDetail[4]
        })
    }
    CollectorSvg.prototype.increase = function(index, increment) {
        var self = this;
        this.valueDetail[index - 1] += increment || 1;
        this['text' + index].attr({
            text: this.valueDetail[index - 1]
        });
        this['text' + index].stop().animate({
            fill: '#0ff',
            fontSize: '38px'
        }, 200, function() {
            self['text' + index].stop().animate({
                fill: '#fff',
                fontSize: '36px'
            }, 100)
        })
    }
    return CollectorSvg;
});