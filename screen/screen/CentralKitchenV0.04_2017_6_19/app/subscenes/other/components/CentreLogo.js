define(function(require) {
    var Component = require('components/Component');
    var dataManager = require('tool/dataManager');
    
    function CentreLogo(parent) {
        Component.call(this, parent);
        this.logoG = this.snapElement.g().attr({
            opacity: 0
        });
        this.originalNewsG = this.snapElement.g().attr({
            opacity: 0
        });
        this.leftScaleSet = new Snap.Set();
        this.rightScaleSet = new Snap.Set();

        this.$video = $('video');

        this.source = this.originalNewsG.text(-305, -160, '原创稿件').attr({
            fill: '#60BBDD',
            fontFamily: 'SimHei',
            fontSize: '13px',
            opacity: 0
        });
        this.title = this.originalNewsG.text(-65, -115, '深度:贫富不均的装甲部队 从土豪到贫民').attr({
            textAnchor: 'middle',
            fill: '#FFFFFF',
            fontFamily: 'SimHei',
            fontSize: '18px',
            opacity: 0
        });

        var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var $foreignObject = $(foreignObject);
        this.originalNewsG.append(foreignObject);

        var foreignObject = this.foreignObject = this.originalNewsG.select('foreignObject');
        var $div = $('<div></div>');

        $div.css({
            margin: '0px',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            'font-size': '16px',
            'line-height': '24px',
            fontFamily: 'SimHei',
            color: '#FFFFFF',
            textIndent: '2em',
            padding: '10px 10px',
        });
       // $div.text('装甲部队，有着令人害怕的攻击力，而且可以在一回合内攻击数次。装甲部队在战况不利时也能迅速撤退，脱离战场（除非和他们交战的也是支移动力极高的快速部队）。它包括装甲车和装甲兵。');
        $foreignObject.append($div);

        foreignObject.attr({
            width: '391px',
            height: '125px',
            x: -258,
            y: -80,
            opacity: 0
        });

        this.centerDatas = [];
        this.count = 0;
        this.mapHasPushed = {};

        this.startTimeTask();
    }
    CentreLogo.prototype = Object.create(Component.prototype);
    CentreLogo.constructor = CentreLogo;
    CentreLogo.prototype.init = function() {
        var self = this;

        this.$video[0].play();

        this.logoG.text(-175, -135, '运转效率').attr({
            fill: '#FFFFFF',
            fontFamily: 'SimHei',
            fontSize: '16px',
            textAnchor: 'middle',
            letterSpacing: '1px'
        });
        this.logoG.text(175, -135, '健康值').attr({
            fill: '#FFFFFF',
            fontFamily: 'SimHei',
            fontSize: '16px',
            textAnchor: 'middle',
            letterSpacing: '1px'
        });

        this.valueLeft = this.logoG.text(-175, -105, '0').attr({
            fill: '#FFFFFF',
            fontFamily: 'SimHei',
            fontSize: '26px',
            textAnchor: 'middle'
        });
        this.valueRight = this.logoG.text(175, -105, '0%').attr({
            fill: '#FFFFFF',
            fontFamily: 'SimHei',
            fontSize: '26px',
            textAnchor: 'middle'
        });

        function creatRightScale(index) {
            var y = -index * 4 + 100.5;
            var x = Math.pow(180 * 180 - y * y, 0.5);
            var g = self.logoG.g().attr({
                transform: 'translate(' + x + ',' + y + ')',
                opacity: 0.5
            });
            g.line(0, 0, 55, 0).attr({
                stroke: '#fff'
            });
            g.circle(55, 0, 1 + index * 0.01).attr({
                fill: '#fff'
            });
            self.rightScaleSet.push(g);
        }

        function creatLeftScale(index) {
            var y = -index * 4 + 100.5;
            var x = -Math.pow(180 * 180 - y * y, 0.5);
            var g = self.logoG.g().attr({
                transform: 'translate(' + x + ',' + y + ')',
                opacity: 0.5
            });
            g.line(0, 0, -55, 0).attr({
                stroke: '#fff'
            });
            g.circle(-55, 0, 1 + index * 0.01).attr({
                fill: '#fff'
            });
            self.leftScaleSet.push(g);
        }

        for(var i = 0; i < 50; i++) {
            creatRightScale(i);
            creatLeftScale(i);
        }

        delay(1500, function() {
            self.logoG.animate({
                opacity: 1
            }, 500);
        });

        var snap = Snap("svg");

        var p1 = this.p1 = this.originalNewsG.path('M30,15 L30,30 L15,30');
        var p2 = this.p2 = this.originalNewsG.path('M-15,30 L-30,30 L-30,15');
        var p3 = this.p3 = this.originalNewsG.path('M-30,-15 L-30,-30 L-15,-30');
        var p4 = this.p4 = this.originalNewsG.path('M15,-30 L30,-30 L30,-15');

        var p5 = this.p5 = this.originalNewsG.path('M15,0 L0,0 L0,-15');
        var p6 = this.p6 = this.originalNewsG.path('M-15,0 L0,0 L0,15');

        var p7 = this.p7 = this.originalNewsG.path('M-205,-40 L175,-40 L175,75 L-205,75 Z');

        var gradient1 = this.gradient1 = snap.gradient("l(0, 0, 1, 1) rgba(255,255,255,1)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)");
        var gradient2 = this.gradient2 = snap.gradient("l(0, 0, 1, 1) rgba(255,255,255,0)-rgba(255,255,255,1)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)");
        var gradient3 = this.gradient3 = snap.gradient("l(0, 0, 1, 1) rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,1)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)");
        var gradient4 = this.gradient4 = snap.gradient("l(0, 0, 1, 1) rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,1)-rgba(255,255,255,0)-rgba(255,255,255,0)");
        var gradient5 = this.gradient5 = snap.gradient("l(0, 0, 1, 1) rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,1)-rgba(255,255,255,0)");
        var gradient6 = this.gradient6 = snap.gradient("l(0, 0, 1, 1) rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,0)-rgba(255,255,255,1)");

        var gradientSet = this.gradientSet = Snap.set(gradient1, gradient2, gradient3, gradient4, gradient5, gradient6);

        Snap.set(p1, p2, p3, p4, p5, p6).attr({
            fill: "none",
            stroke: "#ffffff",
            strokeWidth: 1,
            opacity: 0,
            transform: 'translate(0.5 0.5)'
        });

        p7.attr({
            fill: 'none',
            stroke: "none",
            strokeWidth: 1,
            opacity: 1,
            transform: 'translate(0.5 0.5) scale(0)'
        });

        var set = this.set = Snap.set(p1, p2, p3, p4);
        var set2 = this.set2 = Snap.set(p5, p6);

        var group1 = this.group1 = this.originalNewsG.group(p1, p2, p3, p4);
        var group2 = this.group2 = this.originalNewsG.group(p5, p6);
        var group3 = this.group3 = this.originalNewsG.group(p7);

        var group = this.group = this.originalNewsG.group(group1, group2, group3);
        group.attr({
            transform: 'translate(-50,-35)'
        })

        //
        //

        this.update();

        //      delay(2000, function() {
        //          self.setNews({
        //              title: '中国装甲部队'
        //          });
        //      });
        //      document.body.addEventListener('click', function() {
        //          self.setNews({
        //              title: '中国装甲部队'
        //          });
        //      });
    }
    CentreLogo.prototype.update = function() {
        var self = this;
        
        var v1 = ~~(Math.random() * 25) + 475;
        var v2 = ~~(Math.random() * 5) + 95;

        var scale1 = d3.scale.linear().domain([0, 500]).range([0, 49]);
        var scale2 = d3.scale.linear().domain([0, 100]).range([0, 49]);

        this.leftScaleSet.forEach(function(g, i) {
            if(i <= ~~scale1(v1)) {
                g.attr({
                    opacity: 0.8
                });
            } else {
                g.attr({
                    opacity: 0.3
                });
            }
        });
        this.rightScaleSet.forEach(function(g, i) {
            if(i <= ~~scale2(v2)) {
                g.attr({
                    opacity: 0.8
                });
            } else {
                g.attr({
                    opacity: 0.3
                });
            }
        });
        this.valueLeft.attr({
            text: v1 + ''
        });
        this.valueRight.attr({
            text: v2 + '%'
        });

        var CENTERDATAS = dataManager.getData().CENTER.CENTERDATAS;
        CENTERDATAS.forEach(function(d, i) {
            if(!self.mapHasPushed[d.SOURCETYPE + ':' + d.TITLE]) {
                self.mapHasPushed[d.SOURCETYPE + ':' + d.TITLE] = true;
                self.count++;
                self.centerDatas.push(d);
                if(self.count > 100) {
                    self.count = 0;
                    self.mapHasPushed = {};
                }
            }
        });
    };
    CentreLogo.prototype.showOriginalNews = function() {
        var self = this;

        if(self.state != 'showOriginalNews') {
            self.state = 'showOriginalNews';
            self.logoG.animate({
                opacity: 0
            }, 500);
            this.$video.animate({
                opacity: 0
            }, 500);
            this.originalNewsG.animate({
                opacity: 1
            }, 500);

            this.group.attr({
                transform: 'translate(-50,-35)'
            })

            this.p1.attr({
                d: 'M30,15 L30,30 L15,30'
            });
            this.p2.attr({
                d: 'M-15,30 L-30,30 L-30,15'
            });
            this.p3.attr({
                d: 'M-30,-15 L-30,-30 L-15,-30'
            });
            this.p4.attr({
                d: 'M15,-30 L30,-30 L30,-15'
            });

            this.p5.attr({
                d: 'M15,0 L0,0 L0,-15'
            });
            this.p6.attr({
                d: 'M-15,0 L0,0 L0,15'
            });

            this.p7.attr({
                d: 'M-205,-40 L175,-40 L175,75 L-205,75 Z'
            });

            this.source.attr({
                opacity: 0
            });
            this.title.attr({
                opacity: 0
            });
            this.foreignObject.attr({
                opacity: 0
            });
            var queue = new Queue();
            queue.runActions([
                function() {
                    delay(750, queue.run);
                },
                function() {
                    self.group.animate({
                        transform: 'translate(-50,-35) rotate(360)'
                    }, 100 + 145 + 200 + 250 + 250);
                    self.set2.animate({
                        opacity: 0
                    }, 100);
                    self.set.animate({
                        opacity: 1
                    }, 100, queue.run)
                },
                function() {
                    self.set2.animate({
                        opacity: 1
                    }, 150);
                    self.set.animate({
                        opacity: 0
                    }, 150, queue.run)
                },
                function() {
                    self.set2.animate({
                        opacity: 0.5
                    }, 200);
                    self.set.animate({
                        opacity: 1
                    }, 200, queue.run)
                },
                function() {
                    self.set2.animate({
                        opacity: 1
                    }, 250);
                    self.set.animate({
                        opacity: 0
                    }, 250, queue.run)
                },
                function() {
                    self.set2.animate({
                        opacity: 0.5
                    }, 250);
                    self.set.animate({
                        opacity: 0.5
                    }, 250, queue.run)
                },
                function() {
                    self.p1.animate({
                        d: 'M263,110 L263,145 L228,145'
                    }, 250)
                    self.p2.animate({
                        d: 'M-228,145 L-263,145 L-263,110'
                    }, 250)

                    self.p3.animate({
                        d: 'M-263,-110 L-263,-145 L-228,-145'
                    }, 250)
                    self.p4.animate({
                        d: 'M228,-145 L263,-145 L263,-110'
                    }, 250)
                    Snap.animate(0, 1, function(val) {}, 100, queue.run);
                },
                function() {
                    self.p5.animate({
                        d: 'M-190,80 L-210,80 L-210,60'
                    }, 250);
                    self.p6.animate({
                        d: 'M165,-45 L180,-45 L180,-30'
                    }, 250);
                    Snap.animate(0, 1, function(val) {}, 100, queue.run);
                },
                function() {
                    self.p7.animate({
                        transform: 'translate(0.5 0.5) scale(1)'
                    }, 250, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: self.gradientSet[0]
                    });
                    Snap.animate(0, 1, function(val) {}, 10, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: self.gradientSet[1]
                    });
                    Snap.animate(0, 1, function(val) {}, 10, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: self.gradientSet[2]
                    });
                    Snap.animate(0, 1, function(val) {}, 10, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: self.gradientSet[3]
                    });
                    Snap.animate(0, 1, function(val) {}, 10, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: self.gradientSet[4]
                    });
                    Snap.animate(0, 1, function(val) {}, 10, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: self.gradientSet[5]
                    });
                    Snap.animate(0, 1, function(val) {}, 25, queue.run);
                },
                function() {
                    self.p7.attr({
                        fill: 'none'
                    });
                    self.source.attr({
                        opacity: 1
                    });
                    self.title.attr({
                        opacity: 1
                    });
                    self.foreignObject.attr({
                        opacity: 1
                    });
                }
            ]);
        }
    };
    CentreLogo.prototype.showLogo = function() {
        var self = this;

        if(self.state != 'showLogo') {
            self.state = 'showLogo';
            this.$video.css({
                opacity: 1
            });
            this.originalNewsG.animate({
                opacity: 0
            }, 500);
            this.$video[0].currentTime = 0;
            this.$video[0].play();
            delay(1500, function() {
                self.logoG.animate({
                    opacity: 1
                }, 500);

            });
        }
    }
    CentreLogo.prototype.setNews = function(d) {
        var self = this;

        this.source.attr({
            text: d.SOURCETYPE
        });
        this.title.attr({
            text: d.TITLE
        });
        this.foreignObject.attr({
            text: d.CONTENT
        });

        self.showOriginalNews();
        self.timeout && window.clearTimeout(self.timeout);
        self.timeout = window.setTimeout(function() {
            self.showLogo();
        }, 10 * 1000)
    };
    CentreLogo.prototype.startTimeTask = function() {
        var self = this;
        window.setInterval(function() {
            var d = self.centerDatas.pop();
            d && self.setNews(d);
        }, 5 * 1000);
    }
    return CentreLogo;
});