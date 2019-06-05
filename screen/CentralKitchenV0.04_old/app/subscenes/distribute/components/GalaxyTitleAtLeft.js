define(function(require) {
    var Component = require('components/Component');

    function GalaxyTitleAtLeft(parent) {
        Component.call(this, parent);
        this.snapElement.attr({
            opacity: 0
        });
    }
    GalaxyTitleAtLeft.prototype = Object.create(Component.prototype);
    GalaxyTitleAtLeft.constructor = GalaxyTitleAtLeft;
    GalaxyTitleAtLeft.prototype.setOrigin = function(x, y) {
        this.p0.attr({
            d: 'M-41 -226 -21 -226 ' + x + ' ' + y
        });
    };
    GalaxyTitleAtLeft.prototype.init = function() {
        this.snapElement.append(Snap.parse('<image xlink:href="img/c.png" x="-110" y="-260" height="75px" width="75px"/>'));
        this.hide();

        var text1 = this.snapElement.text(-300, -260, '');

        var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var $foreignObject = $(foreignObject);

        this.snapElement.append(foreignObject);
        var foreignObject = this.snapElement.select('foreignObject');
        
        this.content = $p = $('<p></p>');
        $p.css({
            margin: '0px',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            'font-size': '16px',
            'line-height': '18px',
            color: '#ffffff',
            fontFamily: 'SimHei'
        });
        $foreignObject.append($p)

        foreignObject.attr({
            width: 205,
            height: 18,
            x: -315,
            y: -240
        });

        var text3 = this.snapElement.text(-73, -222, '1000');
        var text4 = this.snapElement.text(-73, -207, '总计');

        this.title = text1;
        this.value = text3;

        text1.attr({
            fill: '#157F9E',
            textAnchor: 'middle',
            fontFamily: 'SimHei',
            opacity: 1
        });

        text3.attr({
            fill: '#ffffff',
            textAnchor: 'middle',
            fontFamily: 'SimHei',
            opacity: 1
        });

        text4.attr({
            fill: '#ffffff',
            textAnchor: 'middle',
            fontFamily: 'SimHei',
            fontSize: '12px',
            opacity: 1
        });

        var p0 = this.p0 = this.snapElement.path('M-41 -226 -21 -226').attr({
            stroke: '#157F9E',
            fill: 'none',
            opacity: 1
        });
        var p1 = this.snapElement.path('M-50 -267 -235 -267 -262 -282 -344 -282 -365 -265 -365 -221 -345 -203 -50 -203 Z').attr({
            fill: '#157F9E',
            opacity: 0
        });
        this.snapElement.path('').attr({
            stroke: '#157F9E',
            fill: 'none',
            opacity: 0.5
        }).animatePath('M-50 -252 -50 -267 -235 -267 -262 -282 -344 -282 -365 -265 -365 -221 -345 -203 -90 -203', 1000, function() {
            p1.animate({
                opacity: 0.1
            }, 100);
        });
    };
    GalaxyTitleAtLeft.prototype.set = function(title, content, value) {
        this.content.text(content);
        this.title.attr({
            text: title
        });
        this.value.attr({
            text: value
        });
    }
    GalaxyTitleAtLeft.prototype.show = function() {
        this.snapElement.animate({
            opacity: 1
        }, 500);
    }
    GalaxyTitleAtLeft.prototype.hide = function() {
        this.snapElement.animate({
            opacity: 0
        }, 500);
    }
    return GalaxyTitleAtLeft;
});