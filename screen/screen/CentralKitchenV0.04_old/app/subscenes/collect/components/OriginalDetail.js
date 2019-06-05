define(function(require) {
    var Component = require('components/Component');

    function OriginalDetail(parent, values) {
        Component.call(this, parent);

        this.snapElement.attr('class', 'OriginalDetail');

        this.values = values;

    }
    OriginalDetail.prototype = Object.create(Component.prototype);
    OriginalDetail.constructor = OriginalDetail;
    OriginalDetail.prototype.init = function() {
        this.snapElement.path('M-0 -0 -0 0 0 0 0 -0 Z').attr({
            stroke: '#157AA1',
            strokeWidth: 1,
            fill: 'none',
            opacity: 0
        }).animate({
            d: 'M-250 -80 -250 80 250 80 250 -80 Z',
            opacity: 1
        }, 250);

        this.snapElement.path('M-2550 -850 -2550 -850 -2550 -850').attr({
            stroke: '#FFF',
            strokeWidth: 1,
            fill: 'none',
            opacity: 0
        }).animate({
            d: 'M-245 -85 -255 -85 -255 -75',
            opacity: 1
        }, 500);

        this.snapElement.path('M2550 -850 2550 -850 2550 -850').attr({
            stroke: '#FFF',
            strokeWidth: 1,
            fill: 'none',
            opacity: 0
        }).animate({
            d: 'M245 -85 255 -85 255 -75',
            opacity: 1
        }, 500);

        this.snapElement.path('M2550 850 2550 850 2550 850').attr({
            stroke: '#FFF',
            strokeWidth: 1,
            fill: 'none',
            opacity: 0
        }).animate({
            d: 'M245 85 255 85 255 75',
            opacity: 1
        }, 500);

        this.snapElement.path('M-2550 850 -2550 850 -2550 850').attr({
            stroke: '#FFF',
            strokeWidth: 1,
            fill: 'none',
            opacity: 0
        }).animate({
            d: 'M-245 85 -255 85 -255 75',
            opacity: 1
        }, 500);

        this.line = this.snapElement.path();
        this.group1 = this.snapElement.g();
        this.group2 = this.snapElement.g();
        this.group3 = this.snapElement.g();

        var extent = d3.extent(this.values);
        var rScale = d3.scale.linear().domain(extent).range([30, 40]);
        var yScale = d3.scale.linear().domain(extent).range([30, -30]);
        var aScale = d3.scale.linear().domain(
            [0, this.values.reduce(function(a, b) {
                return a + b;
            }, 0)]
        ).range([0, Math.PI * 2]);

        var nodes = [];

        function initGroup(group, index, x, value, name) {

            var y = yScale(value);
            var r = rScale(value);
            var a = aScale(value);

            group.attr({
                transform: 'translate(' + x + ',' + y + ')'
            })

            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(r * 0.875);
            if(x < 0) {
                group.path('M-20 0 -90 0 -90 1 -60 1 -59 0').attr({
                    'class': 'name-line',
                    stroke: '#888888',
                    opacity: 0.5
                })
                group.text(-90, 0, name).attr({
                    'class': 'name',
                    'font-family': 'SimHei',
                    'font-size': '14px',
                    dy: -4,
                    fill: '#ffffff'
                })
            } else {
                group.path('M20 0 90 0 90 1 60 1 59 0').attr({
                    'class': 'name-line',
                    stroke: '#888888',
                    opacity: 0.5
                })
                group.text(90, 0, name).attr({
                    'class': 'name',
                    'textAnchor': 'end',
                    'font-family': 'SimHei',
                    'font-size': '14px',
                    dy: -4,
                    fill: '#ffffff'
                })
            }

            group.path(arc({
                startAngle: 0,
                endAngle: a
            })).attr({
                'class': 'arc',
                fill: '#2C4E4B',
                opacity: 0.8
            })
            group.circle(0, 0, r).attr({
                'class': 'c3',
                stroke: '#13b5e4',
                fill: 'none',
                strokeOpacity: 0.5,
                strokeDasharray: '1,1'
            });
            group.circle(0, 0, r * 0.75).attr({
                'class': 'c2',
                stroke: '#13b5e4',
                fill: 'none',
                strokeOpacity: 0.5
            });
            group.circle(0, 0, r * 0.5).attr({
                'class': 'c1',
                fill: '#13b5e4',
                opacity: 0.5
            });

            var node = {
                x: x,
                y: y + 0.75 * r
            }

            nodes.push(node);

            group.circle(0, 0.75 * r, 2).attr({
                'class': 'node',
                fill: '#13b5e4'
            });

            group.text(0, 0, value).attr({
                'class': 'value',
                'textAnchor': 'middle',
                'font-family': 'SimHei',
                'font-weight': 900,
                'font-size': '16px',
                dy: 5,
                fill: '#FFFFFF',
                'letter-spacing': '1px'
            })
        }

        initGroup(this.group1, 1, -150, this.values[0], '图集稿');
        initGroup(this.group2, 2, 0, this.values[1], '新闻稿');
        initGroup(this.group3, 3, 150, this.values[2], '视频稿件');

        this.line.attr({
            d: 'M' + nodes[0].x + ' ' + nodes[0].y + ' ' + nodes[1].x + ' ' + nodes[1].y + ' ' + nodes[2].x + ' ' + nodes[2].y,
            stroke: '#f00',
            fill: 'none',
            strokeWidth: 2,
            strokeOpacity: 0.5,
        });
    }

    OriginalDetail.prototype.update = function() {

        var extent = d3.extent(this.values);
        var rScale = d3.scale.linear().domain(extent).range([30, 40]);
        var yScale = d3.scale.linear().domain(extent).range([30, -30]);
        var aScale = d3.scale.linear().domain(
            [0, this.values.reduce(function(a, b) {
                return a + b;
            }, 0)]
        ).range([0, Math.PI * 2]);

        var nodes = [];

        function updateGroup(group, x, value) {

            var y = yScale(value);
            var r = rScale(value);
            var a = aScale(value);

            group.animate({
                transform: 'translate(' + x + ',' + y + ')'
            }, 500)

            var arc = d3.svg.arc()
                .innerRadius(0)
                .outerRadius(r * 0.875);

            group.select('.arc').attr({
                d: arc({
                    startAngle: 0,
                    endAngle: a
                })
            });
            group.select('.c3').animate({
                r: r,
            }, 500);
            group.select('.c2').animate({
                r: 0.75 * r,
            }, 500);
            group.select('.c1').animate({
                r: 0.5 * r,
            }, 500);
            var node = {
                x: x,
                y: y + 0.75 * r
            }

            nodes.push(node);

            group.select('.node').animate({
                cy: 0.75 * r
            }, 500);

            Snap.animate(group.select('.value').innerSVG(), value, function(val) {
                group.select('.value').attr({
                    text: ~~val
                });
            }, 500);
        }

        updateGroup(this.group1, -150, this.values[0]);
        updateGroup(this.group2, 0, this.values[1]);
        updateGroup(this.group3, 150, this.values[2]);

        this.line.animate({
            d: 'M' + nodes[0].x + ' ' + nodes[0].y + ' ' + nodes[1].x + ' ' + nodes[1].y + ' ' + nodes[2].x + ' ' + nodes[2].y
        }, 500);
    };

    OriginalDetail.prototype.increase = function(index, increment) {
        this.values[index - 1] += increment || 1;

        var valueText = this['group' + index].select('.value');

        valueText.stop().animate({
            fill: '#8ff',
            'font-size': '18px',
            dy:6
        }, 250, function() {
            valueText.stop().animate({
                fill: '#fff',
                'font-size': '16px',
                dy:5
            }, 250)
        });

        this.update();
    };

    return OriginalDetail;
});