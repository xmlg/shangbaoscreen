define(function(require) {
        var Component = require('components/Component');
        var svgRepository = require('tool/svgRepository');
        
        function Numbers(parent, value) {
            Component.call(this, parent);
            if(value<0){
            	value = 0;
            }
            this.value = value || 0;
	
            this.showValue = 0;
        }
        Numbers.prototype = Object.create(Component.prototype);
        Numbers.constructor = Numbers;
        Numbers.prototype.init = function(cb) {
            this.numberG = this.snapElement.g();
            this.numberG.append(svgRepository.getSvg('numberSvg'));
            this.numberG.attr({
                transform: 'translate(5,0) scale(0.5,0.5)'
            });
            this.setValue(this.value);
            cb && cb();
        }
        Numbers.prototype.setValueInner = function(value) {
            var showValue = '' + Math.min(value, 999999);
            for(var i = 6, l = showValue.length; i > l; i--) {
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
            }
            for(var i = 0; i < showValue.length; i++) {
	
                var polygons = this.numberG.selectAll('g')[i].selectAll('polygon');
                var mapValues = map[showValue[i]];
                polygons.attr({
                    fill: '#333333'
                });

                for(var j = 0; j < mapValues.length; j++) {
	
                    polygons[mapValues[j] - 1].attr({
                        fill: '#ffffff'
                    });
                }
            }
        }
        Numbers.prototype.setValue = function(value) {
            var self = this;
            this.value = value;
            var i = d3.interpolate(this.showValue, Math.min(value, 999999));

            this.showValue = Math.min(value, 999999);
            Snap.animate(0, 1, function(val) {
                self.setValueInner(~~i(val));
            }, 1000, function() {
                self.setValueInner(self.showValue);
            });
        }
        return Numbers;
    });