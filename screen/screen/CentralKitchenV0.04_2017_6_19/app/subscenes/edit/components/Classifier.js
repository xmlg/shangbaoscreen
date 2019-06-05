define(function(require) {
    var Component = require('components/Component');
    var svgRepository = require('tool/svgRepository');

    function Classifier(parent, values) {
        Component.call(this, parent);
        this.values = values;
    }
    Classifier.prototype = Object.create(Component.prototype);
    Classifier.constructor = Classifier;
    Classifier.prototype.init = function(fn) {
        this.classifierG = this.snapElement.g();
        this.classifierG.append(svgRepository.getSvg('classifier'));
        this.classifierG.attr({
            transform: 'matrix(0.5,0,0,0.5,0,0)'
        });

        var text = this.classifierG.select('#text');
        text.select('#t1').node.innerHTML = this.values[0];
        text.select('#t2').node.innerHTML = this.values[1];
        text.select('#t3').node.innerHTML = this.values[2];
        text.select('#t4').node.innerHTML = this.values[3];

        text.select('#t0').node.innerHTML = this.values.reduce(function(a, b) {
            return a + b;
        }, 0);

        var ring01 = this.classifierG.select('#ring01');
        var ring02 = this.classifierG.select('#ring02');

        var b1 = ring02.select('#b1');
        var b2 = ring02.select('#b2');
        var b3 = ring02.select('#b3');

        var c1 = ring02.select('#c1');
        var c2 = ring02.select('#c2');
        var c3 = ring02.select('#c3');
        var c4 = ring02.select('#c4');
        var c5 = ring02.select('#c5');
        var c6 = ring02.select('#c6');
        var c7 = ring02.select('#c7');
        var c8 = ring02.select('#c8');

        Snap.set(ring01, b1, b2, b3, c1, c2, c3, c4, c5, c6, c7, c8, text).attr({
            opacity: 0
        });

        delay(650 + 100, function() {
            ring01.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 200, function() {
            b1.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 300, function() {
            b2.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 400, function() {
            b3.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 500, function() {
            c1.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 600, function() {
            c2.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 700, function() {
            c3.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 800, function() {
            c4.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 900, function() {
            c5.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 1000, function() {
            c6.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 1100, function() {
            c7.animate({
                opacity: 1
            }, 100);
        });
        delay(650 + 1200, function() {
            c8.animate({
                opacity: 1
            }, 100);
        })
        delay(650 + 1300, function() {
            text.animate({
                opacity: 1
            }, 100);
        })
    }
    Classifier.prototype.increase = function(index, increment) {
        this.values[index - 1] += increment || 1;
        var totalValue = this.values.reduce(function(a, b) {
            return a + b;
        }, 0);

        var text = this.classifierG.select('#text');

        var tspan = text.select('#t' + index);
        var total = text.select('#t0');

        tspan.node.innerHTML = this.values[index - 1];

        total.attr({
            text: totalValue
        });

        tspan.stop().animate({
            fill: '#8ff'
        }, 500, function() {
            tspan.stop().attr({
                fill: '#fff'
            });
        });

        total.stop().animate({
            fill: '#8ff'
        }, 500, function() {
            total.stop().attr({
                fill: '#fff'
            });
        });
    }
    return Classifier;
})