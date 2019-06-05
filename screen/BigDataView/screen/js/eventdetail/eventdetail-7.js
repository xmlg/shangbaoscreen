App.prototype.renderSection7 = function() {
    var self = this;

    var sectionDataTemp = self.sectionData_7;
    if($.isEmptyObject(sectionDataTemp) == false) {

        var section = d3.select('.section-7');
        var radarG = section.select('g.radar');
       //sectionData = [400,0,455,193,144];
        sectionData = [sectionDataTemp.SZB, sectionDataTemp.WEIBO, sectionDataTemp.WCM, sectionDataTemp.WEIXIN, sectionDataTemp.APP];
        sectionData.forEach(function (d, i) {
            section.select('.legend-' + (i + 1) + ' .value')
                .transition()
                .duration(1000)
                .tween("text", function () {
                    var legendValue = d3.select(this);
                    var v0 = Number(legendValue.text() || 0);
                    var i = d3.interpolateRound(v0, d);
                    return function (t) {
                    	
                        legendValue.text(i(t));
                    }
                });
        });

        var dScale = d3.scale.linear()
            .domain([0, d3.median(sectionData) * 2])
            .range([0, 125])
            .clamp(true);

        var update = radarG.selectAll('path.line').data([sectionData]);
        var enter = update.enter();
        var exit = update.exit();

        var line0 = d3.svg.line()
            .x(function (d, i) {
                return 0;
            })
            .y(function (d, i) {
                return 0;
            });

        var line1 = d3.svg.line()
            .x(function (d, i) {
                return dScale(d) * Math.sin(i * 72 * Math.PI / 180);
            })
            .y(function (d, i) {
                return -dScale(d) * Math.cos(i * 72 * Math.PI / 180);
            });

        exit.remove();
        enter.append("path")
            .classed('line', true)
            .attr({
                'fill': 'rgba(45, 160, 150, 0.5)',
                'stroke': '#269797',
                'stroke-width': 1
            })
            .attr("d", function (d) {
                return line0(d) + ' Z';
            });
        update
            .transition()
            .duration(1000)
            .attr("d", function (d) {
                return line1(d) + ' Z';
            });
    }
}