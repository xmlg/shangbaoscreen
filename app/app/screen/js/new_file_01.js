function App() {
    var self = this;
    this.svg = d3.select('svg');

    this.xAxis = this.svg.append('g').classed('x-axis', true)
        .attr('transform', 'translate(380,990)');
    this.yAxis = this.svg.append('g').classed('y-axis', true)
        .attr('transform', 'translate(240,945)');
    this.bars = this.svg.append('g').classed('bars', true)
        .attr('transform', 'translate(380,945)');
    this.line = this.svg.append('g').classed('line', true)
        .attr('transform', 'translate(380,945)');
    this.topDetail = this.svg.append('g').classed('detail', true)
        .attr('transform', 'translate(380,0)');

    this.title = d3.select('.title');
    this.titleInner = d3.select('.title .inner');
    this.titleText = d3.select('.title .inner .title-text');
    this.authorInfo = d3.select('.title .inner .author-info');

    this.selectTopDetailIndex = 0;

    this.initXAxis();
    this.initTopDetail();

    this.requestData();
    this.startTimingTask();
}

App.prototype.startTimingTask = function() {
    var self = this;

    var interval = window.setInterval(function() {
        self.requestData();
    }, 60 * 1000);

    var interval = window.setInterval(function() {
        self.selectTopDetailIndex++;
        if(self.selectTopDetailIndex >= 10) {
            self.selectTopDetailIndex = 0;
        }
        self.render();
    }, 10 * 1000);
}

App.prototype.requestData = function() {
    var self = this;

    var virtualData = [];
    for(var i = 0; i < 10; i++) {
        var value = ~~(Math.random() * 100) + 100;
        virtualData.push({
            value: value,
            value2: value + 50 + ~~(Math.random() * 50)
        })
    }

    self.data = virtualData;
    self.render();
    //var url = serverDomain + '/screen/weibo/get';
    //	d3.json(url, function(error, data) {
    //		if (error) {
    //			return;
    //		}
    //		self.data = data;
    //		self.render();
    //	});
}

App.prototype.initXAxis = function() {
    this.xAxisTicks = ['政治', '经济', '军事', '文化', '交通', '司法', '艺术', '教育', '环境', '科学'];

    var enter = this.xAxis.selectAll('text').data(this.xAxisTicks).enter();
    enter.append('text')
        .text(function(d, i) {
            return d;
        })
        .attr('x', function(d, i) {
            return i * 134.5;
        })
        .style({
            'fill': '#11ACD9',
            'text-anchor': 'middle',
            'dominant-baseline': 'middle',
            'font-size': '40px'
        });
}

App.prototype.initTopDetail = function() {
    this.topDetail
        .append('circle')
        .classed('inner', true)
        .attr({
            cx: '-14px',
            cy: '211px',
            r: '10px',
            fill: 'rgb(40, 254, 250)',
            stroke: 'none'
        });
    this.topDetail
        .append('circle')
        .classed('outer', true)
        .attr({
            cx: '-14px',
            cy: '211px',
            r: '13px',
            fill: 'none',
            stroke: 'rgb(40, 254, 250)'
        });
    this.topDetail.append('text')
        .attr({
            x: 5,
            y: 223,
            fill: 'rgb(40, 254, 250)'
        })
        .style('font-size', '37px')
        .text('影响力最高稿件');
}

App.prototype.render = function() {
    this.preproces();
    this.renderYAxis();
    this.renderBars();
    this.renderLines();
    this.renderTopDetail();
    this.renderTitle();
}

App.prototype.preproces = function() {
    var maxValue = 0;
    this.data.forEach(function(d, ii) {
        if(d.value > maxValue) {
            maxValue = d.value;
        }
        if(d.value2 > maxValue) {
            maxValue = d.value2;
        }
    });
    maxValue = Math.ceil(maxValue / 100) * 100;
    this.yScale = d3.scale.linear()
        .domain([0, maxValue])
        .range([0, 530]);
    this.yAxisTicks = this.yScale.ticks(4);
}

App.prototype.renderYAxis = function() {
    var self = this;
    var step = (this.yAxisTicks[1] - this.yAxisTicks[0]) / 5;
    var lines = [];

    this.yAxisTicks.forEach(function(d, i) {
        if(i === self.yAxisTicks.length - 1) {
            lines.push(d);
            return;
        }
        lines.push(d);
        lines.push(d + step);
        lines.push(d + 2 * step);
        lines.push(d + 3 * step);
        lines.push(d + 4 * step);
    });

    var update = this.yAxis.selectAll('line').data(lines);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('line');
    update
        .transition()
        .attr({
            'x1': 0,
            'x2': 1500,
            'y1': function(d, i) {
                return -self.yScale(d);
            },
            'y2': function(d, i) {
                return -self.yScale(d);
            },
            'stroke': '#0C2234',
            'stroke-width': function(d, i) {
                if(self.yAxisTicks.indexOf(d) >= 0) {
                    return '3px';
                } else {
                    return '2px';
                }
            }
        });

    var update = this.yAxis.selectAll('text').data(this.yAxisTicks);
    var enter = update.enter();
    var exit = update.exit();
    exit.remove();
    enter.append('text');
    update.text(function(d, i) {
            return d;
        })
        .transition()
        .attr('x', '-10px')
        .attr('y', function(d, i) {
            return -self.yScale(d);
        })
        .style({
            'fill': '#11ACD9',
            'text-anchor': 'end',
            'dominant-baseline': 'middle',
            'font-size': '40px'
        });
}

App.prototype.renderBars = function() {
    var self = this;

    var update = this.bars.selectAll('rect').data(this.data);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('rect')
        .attr({
            'x': function(d, i) {
                return i * 134.5 - 35;
            },
            'y': function(d, i) {
                return -self.yScale(0)
            },
            'width': 70,
            'height': function(d, i) {
                return self.yScale(0)
            },
            'fill': 'url(#grad)'
        });;
    update
        .transition()
        .duration(3000)
        .attr({
            'x': function(d, i) {
                return i * 134.5 - 35;
            },
            'y': function(d, i) {
                return -self.yScale(d.value)
            },
            'height': function(d, i) {
                return self.yScale(d.value)
            }
        });

    var update = this.bars.selectAll('text').data(this.data);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('text')
        .attr({
            'x': function(d, i) {
                return i * 134.5;
            },
            'y': function(d, i) {
                return -self.yScale(0)
            },
            'fill': '#0C2C36',
            'text-anchor': 'middle',
            'dominant-baseline': 'text-before-edge',
            'font-size': '35px'
        });
    update
        .transition()
        .duration(3000)
        .attr({
            'x': function(d, i) {
                return i * 134.5;
            },
            'y': function(d, i) {
                return -self.yScale(d.value)
            }
        })
        .tween("text", function(d, i) {
            var text = d3.select(this);
            var v0 = Number(text.text() || 0);
            var i = d3.interpolateRound(v0, d.value);
            return function(t) {
                text.text(i(t));
            }
        });
}

App.prototype.renderLines = function() {
    var self = this;

    var update = this.line.selectAll('g.point').data(this.data);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('g').classed('point', true)
        .attr('transform', function(d, i) {
            var x = i * 134.5;
            var y = -self.yScale(0);
            return 'translate(' + x + ',' + y + ')';
        })
        .each(function(d, i) {
            var g = d3.select(this);
            g.append('circle').attr({
                'r': 9,
                'fill': '#28FEFA',
                'stroke': 'none',
                'stroke-width': 1
            })
            g.append('circle').attr({
                'r': 13,
                'fill': 'none',
                'stroke': '#28FEFA',
                'stroke-width': 2
            })
            g.append('text').attr({
                'y': -15,
                'fill': '#28FEFA',
                'text-anchor': 'middle',
                'dominant-baseline': 'text-after-edge',
                'font-size': '35px'
            }).text(0);
        });
    update
        .transition()
        .duration(3000)
        .attr('transform', function(d, i) {
            var x = i * 134.5;
            var y = -self.yScale(d.value2);
            return 'translate(' + x + ',' + y + ')';
        })
        .tween("text", function(d, i) {
            var text = d3.select(this).select('text');
            var v0 = Number(text.text() || 0);
            var i = d3.interpolateRound(v0, d.value2);
            return function(t) {
                text.text(i(t));
            }
        });

    var line0 = d3.svg.line()
        .x(function(d, i) {
            return i * 134.5;
        })
        .y(function(d, i) {
            return -self.yScale(0);
        });

    var line1 = d3.svg.line()
        .x(function(d, i) {
            return i * 134.5;
        })
        .y(function(d, i) {
            return -self.yScale(d.value2);
        });

    var update = this.line.selectAll('path.line').data([this.data]);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append("path")
        .classed('line', true)
        .attr({
            'fill': 'none',
            'stroke': '#28FEFA',
            'stroke-width': 2
        })
        .attr("d", function(d) {
            return line0(d);
        });
    update
        .transition()
        .duration(3000)
        .attr("d", function(d) {
            return line1(d);
        });
}

App.prototype.renderTopDetail = function() {
    this.topDetail.selectAll('path').remove();
    var x = this.selectTopDetailIndex * 134.5;

    var d = 'M' + (x + 17.5) + ',308 L' + x + ',328L ' + (x - 17.5) + ', 308 L-55,308 L-55,246 L1242,246 L1242,308 Z';

    this.topDetail.append('path')
        .attr('d', d)
        .attr({
            'stroke': '#0EAEAD',
            'stroke-width': 2,
            'fill': '#0E4F55'
        })
}

App.prototype.renderTitle = function() {
    this.titleInner.style('transform', 'translateY(0px)');

    this.titleText.text('titleText' + this.selectTopDetailIndex);
    this.authorInfo.text('authorInfo' + this.selectTopDetailIndex);

    var h = Math.max($(this.titleInner[0][0]).height() - 58, 0);

    var duration = Math.min((h / 58) * 1000, 5000);

    this.titleInner.data([{}])
        .transition()
        .duration(duration + 1000)
        .style('transform', 'translateY(-' + h + 'px)')
        .transition()
        .style('transform', 'translateY(0px)');
}

var app = new App();