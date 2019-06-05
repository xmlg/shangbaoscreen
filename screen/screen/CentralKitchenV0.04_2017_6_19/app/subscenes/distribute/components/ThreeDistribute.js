define(function(require) {
    var BorderType1 = require('components/BorderType1');
    var dataManager = require('tool/dataManager');

    function ThreeDistribute(parent, w, h) {

        BorderType1.call(this, parent, w, h);
        var self = this;
        self.barGs = [];
        self.nameTextSet = new Snap.set();
        self.barRectSet = new Snap.set();
        self.valueTextSet = new Snap.set();

        this.page1 = self.childElement.g();
        this.page2 = self.childElement.g();
        this.page2.attr({
            opacity: 0
        })

        function creatG(name, i) {
            var g = self.page1.g();
            g.attr({
                transform: 'matrix(1,0,0,1,0,' + (-65 + i * 35) + ')'
            });
            var nameText = g.text(-97, 0, name).attr({
                fill: '#13b5e4',
                fontSize: '14px',
                fontFamily: 'SimHei'
            });
            var valueText = g.text(97, 0, '0').attr({
                fill: '#13b5e4',
                fontFamily: 'SimHei',
                fontSize: '16px',
                textAnchor: 'end'
            });
            var barRect = g.rect(-15, -12, 0, 16).attr({
                fill: '#13b5e4',
                rx: 8,
                ry: 8
            })
            self.barGs.push({
                valueText: valueText,
                barRect: barRect
            });

            self.nameTextSet.push(nameText);
            self.barRectSet.push(barRect);
            self.valueTextSet.push(valueText);
        }

        creatG('三圈环流', 0);
        creatG('三端齐发', 1);
        creatG('核心圈', 2);
        creatG('紧密圈', 3);
        creatG('协同圈', 4);

        self.nameTextSet.attr({
            opacity: 0
        });
        self.barRectSet.attr({
            opacity: 0
        });
        self.valueTextSet.attr({
            opacity: 0
        });

        var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var $foreignObject = $(foreignObject);

        self.page2.append(foreignObject);
        var foreignObject = self.childElement.select('foreignObject');
        var $p = $('<p></p>');
        $p.css({
            margin: '0px',
            width: '100%',
            overflow: 'hidden',
            fontSize: '18px',
            lineHeight: '24px',
            color: 'rgb(16, 170, 228)',
            padding: '0px 25px ',
            height: '216px',
            display: 'table-cell',
            verticalAlign: 'middle',
            fontFamily: 'SimHei',
            'text-align': 'center'
        });
        $p.text('');
        this.$p = $p;
        $foreignObject.append($p)

        foreignObject.attr({
            width: '230px',
            height: '260px',
            x: -115,
            y: -130
        });
    }
    ThreeDistribute.prototype = Object.create(BorderType1.prototype);
    ThreeDistribute.constructor = BorderType1;
    ThreeDistribute.prototype.init = function() {
        var self = this;
        BorderType1.prototype.init.call(this, function() {
            self.setTitle('三圈发稿统计');
            delay(500, function() {
                self.nameTextSet.animate({
                    opacity: 1
                }, 500);
            });
            delay(1000, function() {
                self.update();
                self.barRectSet.animate({
                    opacity: 1
                }, 500);
            });
            delay(1500, function() {
                self.valueTextSet.animate({
                    opacity: 1
                }, 500);
            });
        });
    }
    ThreeDistribute.prototype.update = function() {
        var self = this;
        var CONTENT = dataManager.getData().THREEDISTRIBUTE.CONTENT;
        var ONE = CONTENT.ONE;
        var TWO = CONTENT.TWO;
        var THREE = CONTENT.THREE;
        var FOUR = CONTENT.FOUR;
        var FIVE = CONTENT.FIVE;

        var max = d3.sum([ONE, TWO, THREE, FOUR, FIVE]);
        var widthScale = d3.scale.linear().domain([0, max]).range([25, 75]);

        self.barGs[0].valueText.attr({
            text: ONE + ''
        })
        self.barGs[1].valueText.attr({
            text: TWO + ''
        })
        self.barGs[2].valueText.attr({
            text: THREE + ''
        })
        self.barGs[3].valueText.attr({
            text: FOUR + ''
        })
        self.barGs[4].valueText.attr({
            text: FIVE + ''
        })

        self.barGs[0].barRect.animate({
            width: widthScale(ONE)
        }, 1000);
        self.barGs[1].barRect.animate({
            width: widthScale(TWO)
        }, 1000);
        self.barGs[2].barRect.animate({
            width: widthScale(THREE)
        }, 1000);
        self.barGs[3].barRect.animate({
            width: widthScale(FOUR)
        }, 1000);
        self.barGs[4].barRect.animate({
            width: widthScale(FIVE)
        }, 1000);
    }
    ThreeDistribute.prototype.showPage1 = function() {
        this.page1.animate({
            opacity: 1
        }, 500);
        this.page2.animate({
            opacity: 0
        }, 500);
    }
    ThreeDistribute.prototype.showPage2 = function() {
        this.page1.animate({
            opacity: 0
        }, 500);
        this.page2.animate({
            opacity: 1
        }, 500);
    }
    ThreeDistribute.prototype.showThreeNew = function(title, news) {
        var self = this;
        if (self.titleType !== title) {
            self.blink(function() {
                self.setTitle(title);
                self.showPage2();
                self.$p.text(news);
            })
        } else {
            self.$p.text(news);
        }
        self.setTimeout && window.clearTimeout(self.setTimeout);
        self.setTimeout = window.setTimeout(function() {
            self.blink(function() {
                self.setTitle('三圈发稿统计');
                self.showPage1();
            })
        }, 10 * 1000);
    }
    return ThreeDistribute;
});
