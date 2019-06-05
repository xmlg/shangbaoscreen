define(function(require) {
    var Component = require('components/Component');

    function StarSmall(parent, ox, oy) {
        Component.call(this, parent);

        this.ox = ox;
        this.oy = oy;

        this.snapElement.attr({
            opacity: 0
        });

        this.snapElement.append(Snap.parse('<image xlink:href="img/mark3.png" x="-15" y="-15" height="30px" width="30px"/>'));

        this.name = this.snapElement.text(0, 20, '').attr({
            opacity: 0,
            fill: '#ffffff',
            fontSize: '12px',
            fontFamily: 'SimHei',
            textAnchor: 'middle'
        });

        this.setPosition(this.ox, this.oy)
    }

    StarSmall.prototype = Object.create(Component.prototype);
    StarSmall.prototype.constructor = StarSmall;
    StarSmall.prototype.init = function() {
        var self = this;

        this.snapElement.animate({
            opacity: 1
        }, 500);
    };
    StarSmall.prototype.showName = function(name) {
        this.name.attr({text:name});
        this.name.animate({
            opacity: 1
        }, 500);
    };
    StarSmall.prototype.hideName = function() {
        this.name.animate({
            opacity: 0
        }, 500);
    };
    return StarSmall;
});