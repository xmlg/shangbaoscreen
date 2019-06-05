/*ShareReprot*/
define(function(require) {
    var Component = require('components/Component');
    var svgRepository = require('tool/svgRepository');

    function ShareReprot(parent, values) {
        Component.call(this, parent);
        this.values = values || [0, 0, 0, 0];
    }
    ShareReprot.prototype = Object.create(Component.prototype);
    ShareReprot.constructor = ShareReprot;
    ShareReprot.prototype.init = function() {
        var self = this;
        this.snapElement.path('').attr({
            stroke: '#1FAFDC',
            fill: 'none',
            transform: 'matrix(0.99,0,0,0.95,0.5,8.5)'
        }).animatePath('M0 -147  -55 -147 -80 -135 -80 -105 81 -105 81 -135 73 -145', 1000);

        for(var i = 0; i < 22; i++) {
            (function(i) {
                var path = self.snapElement.path('').attr({
                    stroke: '#1FAFDC',
                    fill: 'none',
                    transform: 'matrix(0.99,0,0,0.95,' + (-1.5 + i * 3) + ',8.5)'
                });
                delay(25 * i, function() {
                    path.animatePath('M5 -150 8 -145', 50)
                });
            })(i);
        }

        this.svgWrapperG = this.snapElement.g();
        this.svgWrapperG.append(svgRepository.getSvg('sharereprot'));
        this.svgWrapperG.attr({
            transform: 'matrix(0.5,0,0,0.5,-261.5,-166.5)',
            opacity: 0
        }).animate({
            opacity: 1
        }, 1000);

        this.text0 = this.svgWrapperG.select('#total');

        this.text1 = this.svgWrapperG.select('#text1');
        this.text2 = this.svgWrapperG.select('#text2');
        this.text3 = this.svgWrapperG.select('#text3');
        this.text4 = this.svgWrapperG.select('#text4');

        Snap.set(this.text1, this.text2, this.text3, this.text4).attr({
            x: 15,
            y: 405
        });

        this.rect1 = this.snapElement.rect(0, -0, 15, 15, 7.5, 7.5)
            .attr({
                stroke: 'rgb(11, 41, 54)',
                fill: this.snapElement.rect(0, 0, 15, 7).attr({
                    fill: '#169EC7'
                }).pattern(0, 0, 16, 8),
                transform: 'translate(-62,42.5)'
            });

        this.rect11 = this.snapElement.rect(0, -0, 16, 16, 7.5, 7.5)
            .attr({
                stroke: '#169EC7',
                fill: 'none',
                transform: 'translate(-62.5,42)'
            });

        this.rect2 = this.snapElement.rect(0, -0, 15, 16, 7.5, 7.5)
            .attr({
                stroke: 'rgb(11, 41, 54)',
                fill: this.snapElement.rect(0, 0, 15, 9).attr({
                    fill: '#169EC7'
                }).pattern(0, 0, 16, 10),
                transform: 'translate(-27,42.5)'
            });

        this.rect21 = this.snapElement.rect(0, -0, 16, 16, 7.5, 7.5)
            .attr({
                stroke: '#169EC7',
                fill: 'none',
                transform: 'translate(-27.5,42)'
            });

        this.rect3 = this.snapElement.rect(0, -0, 15, 15, 7.5, 7.5)
            .attr({
                stroke: 'rgb(11, 41, 54)',
                fill: this.snapElement.rect(0, 0, 15, 9).attr({
                    fill: '#169EC7'
                }).pattern(0, 0, 16, 10),
                transform: 'translate(8,42.5)'
            });

        this.rect31 = this.snapElement.rect(0, -0, 16, 16, 7.5, 7.5)
            .attr({
                stroke: '#169EC7',
                fill: 'none',
                transform: 'translate(7.5,42)'
            });

        this.rect4 = this.snapElement.rect(0, -0, 15, 15, 7.5, 7.5)
            .attr({
                stroke: '#004651',
                fill: this.snapElement.rect(0, 0, 15, 9).attr({
                    fill: '#004651'
                }).pattern(0, 0, 16, 10),
                transform: 'translate(43,42.5)'
            });

        this.rect41 = this.snapElement.rect(0, -0, 16, 16, 7.5, 7.5)
            .attr({
                stroke: '#004651',
                fill: 'none',
                transform: 'translate(42.5,42)'
            });

        this.update();
    }
    ShareReprot.prototype.update = function() {
        var scale = d3.scale.linear().domain(d3.extent(this.values)).range([20, 100]);
        var h1 = scale(this.values[0]);
        var h2 = scale(this.values[1]);
        var h3 = scale(this.values[2]);
        var h4 = scale(this.values[3]);

        this.rect1.animate({
            y: -h1,
            height: 15 + h1
        }, 500);

        this.rect11.animate({
            y: -h1,
            height: 16 + h1
        }, 500);

        this.text1.animate({
            y: 405 - h1 * 2,
        }, 500);

        this.rect2.animate({
            y: -h2,
            height: 15 + h2
        }, 500);

        this.rect21.animate({
            y: -h2,
            height: 16 + h2
        }, 500);

        this.text2.animate({
            y: 405 - h2 * 2
        }, 500);

        this.rect3.animate({
            y: -h3,
            height: 15 + h3
        }, 500);

        this.rect31.animate({
            y: -h3,
            height: 16 + h3
        }, 500);

        this.text3.animate({
            y: 405 - h3 * 2
        }, 500);

        this.rect4.animate({
            y: -h4,
            height: 15 + h4
        }, 500);

        this.rect41.animate({
            y: -h4,
            height: 16 + h4
        }, 500);

        this.text4.animate({
            y: 405 - h4 * 2,
        }, 500);

        this.text1.attr({
            text: this.values[0]
        });
        this.text2.attr({
            text: this.values[1]
        });
        this.text3.attr({
            text: this.values[2]
        });
        this.text4.attr({
            text: this.values[3]
        });

        this.text0.attr({
            text: this.values.reduce(function(a, b) {
                return a + b;
            }, 0)
        })
    }
    ShareReprot.prototype.increase = function(index, increment) {
        this.values[index - 1] += increment || 1;
        this.update();

        var text = this['text' + index];
        var text0 = this.text0;

        text.stop().animate({
            fill: '#8ff'
        }, 500, function() {
            text.stop().attr({
                fill: '#fff'
            })
        });

        text0.stop().animate({
            fill: '#8ff'
        }, 500, function() {
            text0.stop().attr({
                fill: '#fff'
            })
        });
    }
    return ShareReprot;
});