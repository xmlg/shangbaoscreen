function App() {
    var self = this;

    this.pieG = d3.select('g.pie');
    this.legendG = d3.select('g.legend');
    this.list = d3.select('div.list');
    this.requestData();
    this.startTimingTask();
}

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestData();
    }, 5 * 1000);
}

App.prototype.requestData = function() {
    var self = this;
   // var url = 'js/bumenchuanboli.json'
    var url = '/cas/casData/screenJson?type=exMedia';
    d3.json(url, function(error, data) {
        if(error) {
            return;
        }
    //    console.log(data);
        var nameMaps = {
            '浙江日报政治新闻部': '政治新闻部',
            '浙江日报经济新闻部': '经济新闻部',
            '浙江日报文化新闻部': '文化新闻部',
            '浙江日报社会与生态新闻部': '社会与生态新闻部',
            '浙江日报理论评论部': '理论评论部',
            '浙江日报编辑中心': '编辑中心',
            '浙江日报服务专刊部': '服务专刊部',
            '集团图片新闻中心': '图片中心',
            '总编辑办公室': '总编办',
            '集团编委委员': '编委'
        }
        var formatedData = data.Records.map(function(d, i) {
            return {
                name: nameMaps[d.department] || d.department,
                value: Number(d.avgndex)
            }
        });
        self.data = formatedData;
        self.render();
    });
}

App.prototype.render = function() {
    this.renderPie();
    this.renderList();
}

App.prototype.renderList = function() {
    var self = this;
    var sortData = this.data.sort(function(a, b) {
        return b.value - a.value;
    });
    var update = this.list.selectAll('div.list-item').data(sortData);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('div').classed('list-item', true)
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.append('div').classed('td1', true);
            var td2 = listItem.append('div').classed('td2', true);
            var td3 = listItem.append('div').classed('td3', true);

            td1.text(i + 1);
            td2.text(d.name);
            td3.text(d.value);
        });
    update.each(function(d, i) {
    	//console.log(d.name);
        var listItem = d3.select(this);
        var td1 = listItem.select('div.td1');
        var td2 = listItem.select('div.td2');
        var td3 = listItem.select('div.td3');

        td1.text(i + 1);
        td2.text(d.name);
        td3.text(d.value.toFixed(2));
    })
}

App.prototype.renderPie = function() {
    var self = this;

    var innerRadius = 100;
    var radiusScale = d3.scale.linear()
        .domain(
            d3.extent(
                self.data,
                function(d, i) {
                    return d.value;
                }
            )
        )
        .range([innerRadius + 125, innerRadius + 225]);

    var color = d3.scale.ordinal()
        .range(["#262F2A", "#515E40", "#133E37", "#1F936C", "#0A5F66",
            "#06ABB1", "#276266", "#208178", "#1C6460", "#1C6460"
        ]);

    var arc = d3.svg.arc()
        .padAngle(1.5 * Math.PI / 180)
        .innerRadius(innerRadius);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return 1;
        });

    var pieData = pie(self.data);

    var update = self.pieG.selectAll('path').data(pieData);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('path')
        .attr("d", function(d, i) {
            return arc.outerRadius(innerRadius)(d);
        })
        .style('stroke', function(d,i) {
            var c = d3.rgb(color(0));
            return c.brighter(3);
        })
        .style('stroke-width', '3')
        .style("fill", function(d,i) {
            var c = d3.rgb(color(i));
            return c.brighter(2);
        });
    update
        .transition()
        .delay(function(d, i) {
            return i * 100;
        })
        .attr("d", function(d, i) {
            return arc.outerRadius(radiusScale(d.data.value))(d);
        })
        .style('stroke', function(d,i) {
            var c = d3.rgb(color(i));
            return c.brighter(3);
        })
        .style("fill", function(d,i) {
            var c = d3.rgb(color(i));
            return c.brighter(2);
        });

    var update = self.legendG.selectAll('g').data(pieData);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('g').each(function(d, i) {
        var g = d3.select(this);
        g.append('line').classed('line1', true);
        g.append('line').classed('line2', true);
        g.append('circle');
        g.append('text').classed('text1', true);
        g.append('text').classed('text2', true);
    });
    update
        .transition()
        .delay(function(d,i){
            return i*100;
        })
        .each('end',function(d, i) {
            var g = d3.select(this);
            var line1 = g.select('line.line1');
            var line2 = g.select('line.line2');
            var circle = g.select('circle');
            var text1 = g.select('text.text1');
            var text2 = g.select('text.text2');

            text1.text(d.data.name);
            text2.text(d.data.value);

            var angle = (d.endAngle + d.startAngle) / 2;
            var x = (innerRadius + 275) * Math.sin(angle);
            var y = -(innerRadius + 275) * Math.cos(angle);

            var x1 = (innerRadius + 45) * Math.sin(angle);
            var y1 = -(innerRadius + 45) * Math.cos(angle);

            line2.attr({
                'x1': 0,
                'y1': 0,
                'x2': -x1,
                'y2': -y1,
                'stroke': '#1C9C9E'
            });

            g.attr('transform', 'translate(' + x + ',' + y + ')')
            if(x > 0) {
                line1.attr({
                    'x1': '0',
                    'y1': '0',
                    'x2': '200',
                    'y2': '0',
                    'stroke': '#1C9C9E'
                });

                circle.attr({
                    'cx': '200',
                    'cy': '0',
                    'r': '12',
                    'stroke': 'none',
                    'fill': '#1C9C9E'
                });

                text1.attr({
                    fill: '#27F5F1',
                    'font-size': '36px',
                    x: 180,
                    y: 35,
                    'text-anchor': 'end'
                });

                text2.attr({
                    fill: '#27F5F1',
                    'font-size': '36px',
                    x: 180,
                    y: 90,
                    'text-anchor': 'end'
                });
            } else {
                line1.attr({
                    'x1': '0',
                    'y1': '0',
                    'x2': '-200',
                    'y2': '0',
                    'stroke': '#1C9C9E'
                });

                circle.attr({
                    'cx': '-200',
                    'cy': '0',
                    'r': '12',
                    'stroke': 'none',
                    'fill': '#1C9C9E'
                });

                text1.attr({
                    fill: '#27F5F1',
                    'font-size': '36px',
                    x: -180,
                    y: 35,
                    'text-anchor': 'start'
                });

                text2.attr({
                    fill: '#27F5F1',
                    'font-size': '36px',
                    x: -180,
                    y: 90,
                    'text-anchor': 'start'
                });
            }
        })

}

var app = new App();