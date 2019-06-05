define(function(require) {
    var Numbers = require('components/Numbers');
    var svgRepository = require('tool/svgRepository');
    
    function MainLabel(parent, name, value) {
        Numbers.call(this, parent, value);
        this.name = name;
    }
    MainLabel.prototype = Object.create(Numbers.prototype);
    MainLabel.constructor = MainLabel;
    MainLabel.prototype.init = function(cb) {
        var self = this;
        this.borderG = this.snapElement.g();
        this.borderG.append(svgRepository.getSvg('numberBorderSvg'));
        this.borderG.attr({
            transform: 'matrix(0.5,0,0,0.5,-89,-59)'
        });
        var maskRect = this.borderG.rect(0, 0, 0, 1000).attr({
            fill: '#ffffff'
        });
        var borderSubGSet = this.borderG.selectAll('g');
        borderSubGSet[0].attr({
            transform: 'translate(0,40)'
        });
        borderSubGSet[1].attr({
            transform: 'matrix(0,0,0,1,307,0)'
        });
        borderSubGSet[2].attr({
            transform: 'translate(0,-40)'
        })
        this.borderG.attr({
            mask: maskRect
        });

        var g = this.snapElement.g().attr({
            transform: 'translate(-44.5,-5.5)'
        });

        var pattern = this.snapElement.path("M0 5 L10 5 M5 0 L5 10").attr({
            fill: "none",
            stroke: "rgba(13,126,158,0.2)",
            strokeWidth: 1,
        }).pattern(0, 0, 10, 10);

        var rect01 = g.rect(21, 21, 0, 0).attr({
            rx: 4,
            ry: 4,
            fill: 'rgba(41,138,161,0.1)'
        });
        var rect02 = g.rect(21, 21, 0, 0).attr({
            rx: 4,
            ry: 4,
            fill: pattern
        });
        var rect03 = g.rect(21, 21, 0, 0).attr({
            rx: 4,
            ry: 4,
            fill: 'none',
            'stroke-width': 2,
            'stroke': 'rgba(41,138,161,0.5)'
        });
        var rect04 = g.rect(1, 1, 40, 0).attr({
            rx: 4,
            ry: 4,
            fill: 'l(0,0,0,1)rgba(13, 126, 158,0)-rgba(13, 126, 158,0.25)',
            'stroke-width': 'none',
        });
        var text = g.text(6, 31, this.name).attr({
            'fill': '#29A6D2',
            'font-family': 'SimHei',
            'font-size': '28px',
            opacity: 0
        })
        var queue = new Queue();
        queue.runActions([
            function() {
                maskRect.animate({
                    width: 500
                }, 500, queue.run);
            },
            function() {
                borderSubGSet[0].animate({
                    transform: 'translate(0,0)'
                }, 250);
                borderSubGSet[2].animate({
                    transform: 'translate(0,0)'
                }, 250, queue.run)

            },
            function() {
                borderSubGSet[1].animate({
                    transform: 'matrix(1,0,0,1,0,0)'
                }, 250, Numbers.prototype.init.bind(self, cb));
                Snap.animate(0, 1, function(val) {}, 100, queue.run);
                rect03.animate({
                    x: -3,
                    y: -3,
                    width: 48,
                    height: 48
                }, 500, queue.run)
            },
            function() {
                rect01.animate({
                    x: 0,
                    y: 0,
                    width: 42,
                    height: 42
                }, 500, queue.run)
            },
            function() {
                rect02.animate({
                    x: 1,
                    y: 1,
                    width: 40,
                    height: 40
                }, 250, queue.run)
            },
            function() {
                text.attr({
                    opacity: 1
                });
                var innerQueue = new Queue(true, true);
                innerQueue.runActions([
                    function() {
                        rect04.attr({
                            y: 1,
                            height: 0
                        });
                        rect04.animate({
                            y: 1,
                            height: 40
                        }, 1500, innerQueue.run);
                    },
                    function() {
                        rect04.animate({
                            y: 40,
                            height: 0
                        }, 1500);
                        Snap.animate(0, 1, function(val) {}, 3000, innerQueue.run);
                    }
                ]);
            }
        ]);

    }
    MainLabel.prototype.increase = function(increment) {
     //  if (increment>0) {
    		 this.value += increment != null ? increment : 1;
      		  this.setValueInner(this.value);
    	//}else{
    	//	 this.value -= increment != null ? increment : 1;
       //		this.setValueInner(this.value);
    //	}
    }
    return MainLabel;
})