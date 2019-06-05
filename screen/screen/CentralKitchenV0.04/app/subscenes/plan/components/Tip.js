define(function(require) {

    var Component = require('components/Component');

    function Tip(parent, width, name, value) {
        Component.call(this, parent);
        
        this.snapElement.attr('class', 'Tip');
        
        this.name = name;
        this.value = value;
        this.width = width;
    }
    Tip.prototype = Object.create(Component.prototype);
    Tip.constructor = Tip;
    Tip.prototype.init = function() {
        var self = this;

        var rect = this.snapElement.rect(-15, -7, 0, 14).attr({
            stroke: '#0d7e9e',
            fill: '#0d7e9e',
            opacity: 0.3
        });

        var ox = -(this.width + 15) + this.width / 2;
        var oy = 0;

        var x1 = ox + this.width / 2 + 2;
        var x2 = ox - this.width / 2 - 2;
        var y1 = 7 + 2;
        var y2 = -7 - 2;

        var pl1 = this.snapElement.polyline([x1 - 5, y1, x1, y1, x1, y1 - 5]).attr({
            'class':'pl1',
            stroke: '#0d7e9e',
            fill: 'none',
            opacity: 0
        });
        var pl2 = this.snapElement.polyline([x2 + 5, y2, x2, y2, x2, y2 + 5]).attr({
            'class':'pl2',
            stroke: '#0d7e9e',
            fill: 'none',
            opacity: 0
        });

        var plSet = Snap.set(pl1, pl2);

        var nameText = this.snapElement.text(-(this.width + 15) + 5, 3.5, this.name);
        nameText.attr({
            'font-family': 'SimHei',
            fill: '#13b5e4',
            'font-size': '12px',
            opacity: 0
        });

        var valueText = this.snapElement.text(-1, 2.5, this.value || '0');
        valueText.attr({
            'font-family': 'SimHei',
            fill: '#ffffff',
            'font-size': '12px',
            'text-anchor': 'middle',
            opacity: 0
        });
        this.valueText = valueText;

        delay(1000, function() {
            valueText.animate({
                opacity: 1
            }, 1000);
            rect.animate({
                x: -(self.width + 15),
                y: -7,
                width: self.width,
                height: 14
            }, 1000);
        });
        delay(2000, function() {
            nameText.animate({
                opacity: 1
            }, 1000);
            plSet.animate({
                opacity: 1
            }, 1000);
        });
    }
    Tip.prototype.increase = function(increment) {
        this.value += increment || 1;
        this.valueText.attr({
            text: this.value || '0'
        });
    }
    return Tip;
});