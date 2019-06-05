define(function(require) {
    var Component = require('components/Component');

    function StarBig(parent, media, ox, oy) {
        Component.call(this, parent);

        this.media = media;
        this.name = media.MEDIANAME;

        this.ox = ox;
        this.oy = oy;

        this.snapElement.attr({
            opacity: 0
        });

        this.snapElement.circle(0, 0, 8).attr({
            fill: '#ffffff',
            opacity: 0.75,
            stroke: '#f4b94d',
            strokeWidth: 4
        });

        this.snapElement.circle(0, 0, 20).attr({
            'class': 'star-border',
            fill: 'none',
            stroke: 'rgba(242,181,95,1)',
            strokeDasharray: '18,5',
            strokeWidth: 1,
            filter: 'url("#filter5790")'
        });

        this.snapElement.circle(0, 0, 20).attr({
            'class': 'star-border-halo',
            fill: 'none',
            stroke: 'rgba(242,181,95,1)',
            strokeDasharray: '18,5',
            strokeWidth: 1
        });

        this.text = this.snapElement.text(0, 20, this.name).attr({
            fill: '#ffffff',
            fontSize: '12px',
            fontFamily: 'SimHei',
            textAnchor: 'middle'
        });

        //this.setPosition(this.ox, this.oy)
    }

    StarBig.prototype = Object.create(Component.prototype);
    StarBig.prototype.constructor = StarBig;
    StarBig.prototype.init = function() {
        var self = this;
        this.snapElement.animate({
            opacity: 1
        }, 500);
    };
    StarBig.prototype.showName = function() {

    };
    StarBig.prototype.hideName = function() {

    };

    return StarBig;
});