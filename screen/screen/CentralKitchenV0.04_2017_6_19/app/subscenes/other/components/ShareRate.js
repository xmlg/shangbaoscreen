define(function(
    require
) {
    var BorderType2 = require('components/BorderType1');
    var PathWay = require('components/PathWay');
    var dataManager = require('tool/dataManager');

    function ShareRate(parent, w, h) {
        BorderType2.call(this, parent, w, h);
        this.chartG = this.snapElement.g();
        this.value = 0;

        //新式样
        var pathWayStyle = {
            stroke: "#00A0E8",
            strokeWidth: 1,
            fill: "none",
            opacity: 1
        };

        this.tipG = this.snapElement.g();

        this.tipPath = this.tipG.path('');
        this.tipPath.attr(pathWayStyle);

        this.tipG.attr({
            opacity: 0
        });
        this.tipG.text(30, -35, '取用效率值').attr({
            stroke: 'none',
            fill: '#fff',
            fontSize: '16px',
            fontFamily: 'SimHei'
        });
        this.tipsText = this.tipG.text(70, -55, '0%').attr({
            stroke: 'none',
            fill: '#fff',
            fontSize: '24px',
            fontFamily: 'SimHei',
            textAnchor: 'middle'
        });
    }
    ShareRate.prototype = Object.create(BorderType2.prototype);
    ShareRate.constructor = ShareRate;
    ShareRate.prototype.init = function() {
        var self = this;
        self.gs = [];

        function creatSubG(index) {
            var g = self.chartG.g();
            var width = 78.5 - index * 5;
            var y = 68.5 - index * 11.5;

            var color = d3.rgb('#1380a0').darker(1).brighter(index * 0.2);

            g.attr({
                transform: 'matrix(1,0,0,1,0,' + y + ')'
            });
            var rectL = g.rect(-11.5, -3, 0, 5).attr({
                fill: color.toString()
            });
            var rectR = g.rect(-4, -3, 0, 5).attr({
                fill: color.toString()
            });
            rectL.animate({
                x: -(11.5 + width),
                width: width
            }, 1000);

            var path1 = g.path('M-11 -0.5 -6 -0.5 -6 -4 77.5 -4 77.5 -0.5 84 -0.5 84 -2.5').attr({
                stroke: '#444444',
                fill: 'none',
                opacity: 0
            });
            var path2 = g.path('M-11 -0.5 -6 -0.5 -6 3 77.5 3 77.5 -0.5 84 -0.5 84 2').attr({
                stroke: '#444444',
                fill: 'none',
                opacity: 0
            });
            self.gs.push({
                rectL: rectL,
                rectR: rectR,
                path1: path1,
                path2: path2,
                width: width
            });
        }

        BorderType2.prototype.init.call(this, function() {
            self.setTitle('共享稿件取用率');

            d3.range(0, 14).forEach(function(d, i) {
                creatSubG(i);
            });

            //已共享 已取用
            self.snapElement.circle(-90, 81, 0).attr({
                stroke: '#33A1D2',
                strokeWidth: 2,
                fill: 'none'
            }).animate({
                r: 3
            }, 250);
            self.snapElement.circle(-90 + 89, 81, 0).attr({
                stroke: '#33A1D2',
                strokeWidth: 2,
                fill: 'none'
            }).animate({
                r: 3
            }, 250);
            delay(250, function() {
                self.snapElement.path('')
                    .attr({
                        stroke: '#33A1D2',
                        fill: 'none'
                    })
                    .animatePath('M-90 84 -90 100 -84 104 -19 104 -13 99 -13 84', 500);
                self.snapElement.path('')
                    .attr({
                        transform: 'matrix(1,0,0,1,89,0)',
                        stroke: '#33A1D2',
                        fill: 'none'
                    })
                    .animatePath('M-90 84 -90 100 -84 104 -19 104 -13 99 -13 84', 500);
            });
            delay(750, function() {
                self.snapElement.text(-51.5, 94, '已共享').attr({
                    fill: '#33A1D2',
                    stroke: 'none',
                    textAnchor: 'middle',
                    fontFamily: 'SimHei'
                }).blinkShow(2, 250);
                self.snapElement.text(-51.5 + 89, 94, '已取用').attr({
                    fill: '#33A1D2',
                    stroke: 'none',
                    textAnchor: 'middle',
                    fontFamily: 'SimHei'
                }).blinkShow(2, 250);;
                self.snapElement.circle(-13, 81, 0).attr({
                    stroke: '#33A1D2',
                    strokeWidth: 2,
                    fill: 'none'
                }).animate({
                    r: 3
                }, 250);
                self.snapElement.circle(-13 + 89, 81, 0).attr({
                    stroke: '#33A1D2',
                    strokeWidth: 2,
                    fill: 'none'
                }).animate({
                    r: 3
                }, 250);
                self.update();
            });
        });
    };

    ShareRate.prototype.updateTip = function(index, value) {
        var self = this;
		if(value>90){
			value = 89;
		}
        var y = 63.5 - index * 11.5;
        this.tipG.attr({
            transform: 'matrix(1,0,0,1,0,' + y + ')'
        });
        this.tipsText.attr({
            text: value + '%'
        })
        if(this.lastIndex != index) {
            this.tipG.attr({
                opacity: 0
            });
            delay(1500, function() {
                self.tipG.blinkShow(2, 500);
                self.tipPath.animatePath('M5 0 30 -30 110 -30 110 -29 80 -29 79 -30', 500);
            });
            this.lastIndex = index;
        }
    }

    ShareRate.prototype.update = function() {
        var self = this;
        var ORGINALSHARE = dataManager.getData().JSONEDIT.ORGINALSHARE;
        var SHAREMANU = dataManager.getData().JSONEDIT.SHAREMANU.TOTAL;
        var newValue = ~~(100 * ORGINALSHARE / SHAREMANU);
        var oldValue = this.value;
        this.value = newValue;

        var maxIndex = ~~(this.value / 10) - 1;
        var delayTime = 0;

        this.updateTip(maxIndex, this.value)

        if(newValue > oldValue) {
            for(var i = 0; i < 14 && i <= maxIndex; i++) {
                (function(i) {
                    delay(delayTime, function() {
                        var g = self.gs[i];
                        g.rectR.animate({
                            width: g.width
                        }, 100);
                        g.path1.animate({
                            opacity: 1
                        }, 100);
                        g.path2.animate({
                            opacity: 1
                        }, 100);
                    });
                })(i);
                delayTime += 100;
            }
        } else {
            for(var i = 13; i > 0 && i > maxIndex; i--) {
                (function(i) {
                    delay(delayTime, function() {
                        var g = self.gs[i];
                        g.rectR.animate({
                            width: 0
                        }, 100);
                        g.path1.animate({
                            opacity: 0
                        }, 100);
                        g.path2.animate({
                            opacity: 0
                        }, 100);
                    });
                })(i);
                delayTime += 100;
            }
        }
    }
    return ShareRate;
});