define(function(require) {
    var Component = require('components/Component');

    function Barometer(parent) {
        Component.call(this, parent);

        this.snapElement.attr('class', 'Barometer');
    }
    Barometer.prototype = Object.create(Component.prototype);
    Barometer.constructor = Barometer;
    Barometer.prototype.showIncrement = function(increment) {
        var text = '';
        if(increment > 0) {
            text = '+' + increment
        } else if(increment < 0) {
            text = '-' + Math.abs(increment);
        } else {
            return;
        }
        
        var textElement = this.snapElement.text(0, 0, text);
        textElement.animate();
    };
    return Barometer;
})