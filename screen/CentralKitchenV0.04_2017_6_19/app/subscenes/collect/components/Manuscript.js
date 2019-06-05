define(function(require) {
    var Component = require('components/Component');

    function Manuscript(parent, data) {
        var self = this;
        Component.call(this, parent);
        this.data = data;

        function creatManuscriptG(name, i) {
            var manuscriptG = self.snapElement.g().attr({
                transform: 'matrix(1,0,0,1,1745.5,' + (0.5 + i * 29) + ')'
            });
            manuscriptG.text(-37, 12, name).attr({
                'class': 'text',
                fill: '#fff',
                fontFamily: 'SimHei',
                fontSize: '12px',
                opacity: 0
            });
            manuscriptG.text(103, 13, '0').attr({
                'class': 'value',
                fill: '#fff',
                fontFamily: 'SimHei',
                fontSize: '14px',
                opacity: 0
            });
            manuscriptG.path().attr({
                'class': 'up',
                stroke: '#fff',
                strokeWidth: '1',
                fill: 'none'
            });
            manuscriptG.path().attr({
                'class': 'down',
                transform: 'rotate(180) translate(-104,-17)',
                stroke: '#fff',
                strokeWidth: '1',
                fill: 'none'
            });
            for(var i = 0; i < 19; i++) {
                manuscriptG.rect(10 + i * 4.5, 4, 4, 9).attr({
                    fill: 'rgb(255, 255, 255)',
                    opacity: 0
                });
            }
            return manuscriptG;
        }

        this.manuscriptG1 = creatManuscriptG('数字报', 1);
        this.manuscriptG2 = creatManuscriptG('网站', 2);
        this.manuscriptG3 = creatManuscriptG('客户端', 3);
        this.manuscriptG4 = creatManuscriptG('微信', 4);
        this.manuscriptG5 = creatManuscriptG('微博', 5);
    }
    Manuscript.prototype = Object.create(Component.prototype);
    Manuscript.constructor = Manuscript;
    Manuscript.prototype.init = function() {
        var self = this;
        var sum = d3.sum(this.data);
        var extent = [0, sum]
        var scale = d3.scale.linear().domain(extent).rangeRound([1, 18]);

        function animateManuscriptG(manuscriptG, value) {
            manuscriptG.select('.up').animatePath('M7 5 7 12 12 16 93 16 97 12', 500);
            manuscriptG.select('.down').animatePath('M7 5 7 12 12 16 93 16 97 12', 500);
            manuscriptG.selectAll('text').animate({
                opacity: 1
            }, 100);
            manuscriptG.selectAll('text.value').attr({
                text: value
            });

            var opacityScale = d3.scale.linear().domain([0, scale(value)]).range([1, 0.3]);

            manuscriptG.selectAll('rect').forEach(function(element, index) {
                delay(index * 50 + 100, function() {
                    if(index < scale(value)) {
                        element.animate({
                            opacity: opacityScale(index)
                        }, 100);
                    }
                });
            });
        }

        animateManuscriptG(self.manuscriptG1, self.data[0]);
        animateManuscriptG(self.manuscriptG2, self.data[1]);
        animateManuscriptG(self.manuscriptG3, self.data[2]);
        animateManuscriptG(self.manuscriptG4, self.data[3]);
        animateManuscriptG(self.manuscriptG5, self.data[4]);

        this.snapElement.path('').attr({
            stroke: "#00A0E8",
            strokeWidth: 1,
            fill: "none",
            transform: 'translate(0.5,0.5)',
            opacity: 1
        }).animatePath('M1720 23 1710 23 1700 33 1700 160 1710 170 1720 170', 500);

        this.snapElement.path('').attr({
            stroke: "#00A0E8",
            strokeWidth: 1,
            fill: "none",
            transform: 'translate(0.5,0.5)',
            opacity: 1
        }).animatePath('M1625 220 1625 245 1635 255 1635 275', 500);

        delay(500, function() {
            self.snapElement.path('').attr({
                stroke: "#00A0E8",
                strokeWidth: 1,
                fill: "none",
                transform: 'translate(0.5,0.5)',
                opacity: 1
            }).animatePath('M1700 96.5 1680 96.5', 500);
        });

        delay(1000, function() {
            self.snapElement.path('M1625 220 1625 225 M1635 275 1635 270 M1720 23 1715 23 M1720 170 1715 170 M1685 96.5 1680 96.5').attr({
                stroke: "#00E0E8",
                strokeWidth: 2,
                fill: "none",
                transform: 'translate(0.5,0.5)',
                opacity: 0
            }).animate({
                opacity: 1
            }, 500);
        })
    }
    Manuscript.prototype.update = function() {
        var self = this;
        var sum = d3.sum(this.data);
        var extent = [0, sum];
        var scale = d3.scale.linear().domain(extent).rangeRound([1, 18]);

        function updateManuscriptG(manuscriptG, value) {
            manuscriptG.selectAll('text.value').attr({
                text: value
            });
            var opacityScale = d3.scale.linear().domain([0, scale(value)]).range([1, 0.3]);
            manuscriptG.selectAll('rect').forEach(function(element, index) {
                if(index <= scale(value)) {
                    element.animate({
                        opacity: opacityScale(index)
                    }, 100);
                } else {
                    element.animate({
                        opacity: 0
                    }, 100);
                }
            })
        }

        updateManuscriptG(self.manuscriptG1, self.data[0]);
        updateManuscriptG(self.manuscriptG2, self.data[1]);
        updateManuscriptG(self.manuscriptG3, self.data[2]);
        updateManuscriptG(self.manuscriptG4, self.data[3]);
        updateManuscriptG(self.manuscriptG5, self.data[4]);

    }
    Manuscript.prototype.increase = function(index, increment) {
        this.data[index - 1] += increment || 1;

        var valueText = this['manuscriptG' + index].select('.value');

        this.update();

        valueText.stop().animate({
            fill: '#8ff'
        }, 500, function() {
            valueText.stop().attr({
                fill: '#fff'
            })
        });
    }
    return Manuscript;
});