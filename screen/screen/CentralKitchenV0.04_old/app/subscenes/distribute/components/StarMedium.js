define(function(require) {
    var Component = require('components/Component');

    function StarMedium(parent, ox, oy) {
        Component.call(this, parent);

        this.ox = ox;
        this.oy = oy;

        this.snapElement.attr({
            opacity: 0
        });

        this.snapElement.append(Snap.parse('<image xlink:href="img/mark2.png" x="-25" y="-25" height="50px" width="50px"/>'));

        this.text = this.snapElement.text(0, 20, '').attr({
            opacity:0,
            fill: '#ffffff',
            fontSize: '12px',
            fontFamily: 'SimHei',
            textAnchor: 'middle'
        });

        this.setPosition(this.ox, this.oy)
    }

    StarMedium.prototype = Object.create(Component.prototype);
    StarMedium.prototype.constructor = StarMedium;
    StarMedium.prototype.init = function() {
        var self = this;

        this.snapElement.animate({
            opacity: 1
        }, 500);
    };
    StarMedium.prototype.showName = function(name) {
        this.text.attr({text:name});
        this.text.animate({
            opacity: 1
        },500);
    };
    StarMedium.prototype.hideName = function() {
        this.text.animate({
            opacity: 0
        },500);
    };
    return StarMedium;
});