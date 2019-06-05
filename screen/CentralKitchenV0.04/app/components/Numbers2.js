define(function(require) {
    var Component = require('components/Component');
    var svgRepository = require('tool/svgRepository');

    function Numbers2(parent, value, value2) {
        Component.call(this, parent);
        if (value < 0) {
            value = 0;
        }
        this.value = value || 0;

        this.showValue = 0;
        if (value2 < 0) {
            value2 = 0;
        }
        this.value2 = value2 || 0;

        this.showValue2 = 0;
    }
    Numbers2.prototype = Object.create(Component.prototype);
    Numbers2.constructor = Numbers2;
    Numbers2.prototype.init = function(cb) {
        this.numberG = this.snapElement.g();
        this.numberG.append(svgRepository.getSvg('numberSvg'));
        this.numberG.attr({
            transform: 'translate(5,0) scale(0.5,0.5)'
        });
        this.numberG2 = this.snapElement.g();
        this.numberG2.append(svgRepository.getSvg('numberSvg'));
        this.numberG2.attr({
            transform: 'translate(5,45) scale(0.5,0.5)'
        });
        this.setValue(this.value);
        this.setValue2(this.value2);
        //this.setValue(this.value);
        cb && cb();
    }
    Numbers2.prototype.setValueInner = function(value) {
        var showValue = '' + Math.min(value, 999999);
        for (var i = 6, l = showValue.length; i > l; i--) {
            showValue = 'x' + showValue;
        }

        var map = {
            '0': [1, 2, 4, 5, 6, 7],
            '1': [4, 5],
            '2': [1, 3, 4, 7, 6],
            '3': [1, 3, 4, 5, 6],
            '4': [2, 3, 4, 5],
            '5': [1, 2, 3, 5, 6],
            '6': [1, 2, 3, 5, 6, 7],
            '7': [1, 4, 5],
            '8': [1, 2, 3, 4, 5, 6, 7],
            '9': [1, 2, 3, 4, 5, 6],
            'x': []
        };
        for (var i = 0; i < showValue.length; i++) {

            var polygons = this.numberG.selectAll('g')[i].selectAll('polygon');
            var mapValues = map[showValue[i]];
            polygons.attr({
                fill: '#333333'
            });

            for (var j = 0; j < mapValues.length; j++) {

                polygons[mapValues[j] - 1].attr({
                    fill: '#ffffff'
                });
            }
        }
    };

    Numbers2.prototype.setValueInner2 = function(value) {
        var showValue2 = '' + Math.min(value, 999999);
        for (var i = 6, l = showValue2.length; i > l; i--) {
            showValue2 = 'x' + showValue2;
        }

        var map = {
            '0': [1, 2, 4, 5, 6, 7],
            '1': [4, 5],
            '2': [1, 3, 4, 7, 6],
            '3': [1, 3, 4, 5, 6],
            '4': [2, 3, 4, 5],
            '5': [1, 2, 3, 5, 6],
            '6': [1, 2, 3, 5, 6, 7],
            '7': [1, 4, 5],
            '8': [1, 2, 3, 4, 5, 6, 7],
            '9': [1, 2, 3, 4, 5, 6],
            'x': []
        };
        for (var i = 0; i < showValue2.length; i++) {

            var polygons = this.numberG2.selectAll('g')[i].selectAll('polygon');
            var mapValues = map[showValue2[i]];
            polygons.attr({
                fill: '#333333'
            });

            for (var j = 0; j < mapValues.length; j++) {

                polygons[mapValues[j] - 1].attr({
                    fill: '#ffffff'
                });
            }
        }
    };
    Numbers2.prototype.setValue = function(value) {
        var self = this;
        this.value = value;
        var i = d3.interpolate(this.showValue, Math.min(value, 999999));

        this.showValue = Math.min(value, 999999);
        Snap.animate(0, 1, function(val) {
            self.setValueInner(~~i(val));
        }, 1000, function() {
            self.setValueInner(self.showValue);
        });
    };
    Numbers2.prototype.setValue2 = function(value) {
        var self = this;
        this.value2 = value;
        var i = d3.interpolate(this.showValue2, Math.min(value, 999999));

        this.showValue2 = Math.min(value, 999999);
        Snap.animate(0, 1, function(val) {
            self.setValueInner2(~~i(val));
        }, 1000, function() {
            self.setValueInner2(self.showValue2);
        });
    };
    return Numbers2;
});
