App.prototype.renderSection3 = function() {
	var self = this;
	var svg = d3.select('.section-3 svg');
	var sectionData = self.sectionData_3;
	var wb_wz = true;
	if($.isEmptyObject(sectionData) == false) {
		var starTime = sectionData[0];

		var dayLength = 0;
		var maxValue = 0;
		var matrix = [];
		var keys = [];
		if(self.carouselIndexSection3 == 0) {
			var data = sectionData[1];
			var nameMap = {
				'szb': '报纸',
				'weibo': '微博',
				'wcm': '网站',
				'weixin': '微信',
				'app': '客户端',
				'total': '总量'
			}
			deaw_viewpoit(nameMap);

		} else {
			var data = {};
			var data_B = sectionData[1];
			data['szb'] = data_B.szb;
			data['weibo'] = data_B.weibo;
			data['weixin'] = data_B.weixin;
			data['app'] = data_B.app;
			var nameMap = {
				'szb': '报纸',
				'weibo': '微博',
				'weixin': '微信',
				'app': '客户端',
			}
			deaw_viewpoit(nameMap);
		}

		function deaw_viewpoit(nameMap) {

			for(var key in data) {
				var subData = data[key].split(';');
				keys.push(key);
				matrix.push(subData);
				dayLength = subData.length;
				subData.forEach(function(d) {
					if(Number(d) > maxValue) {
						maxValue = Number(d);
					}
				})
			}

			var endDate = new Date(starTime);
			var startDate = new Date(endDate.getTime() - (dayLength - 1) * 24 * 3600 * 1000);
			var section = d3.select('.section-3');
			var xScale = d3.time.scale()
				.domain([0, dayLength])
				.range([0, 600]);

			var yTicks = d3.scale.linear()
				.domain([0, maxValue])
				.ticks(4);

			if(yTicks[yTicks.length - 1] < maxValue && yTicks.length >= 2) {
				var step = yTicks[1] - yTicks[0];
				yTicks.push(yTicks[yTicks.length - 1] + step);

			}

			var yScale = d3.scale.linear()
				.domain([yTicks[0], yTicks[yTicks.length - 1]])
				.range([0, 215]);

			var color = d3.scale.ordinal()
				.range(["#14D7DE", "#029EA3", "#0E769D", "#48C8F5", "#489BEE", "#93E0FA"]);

			/*渲染x-axis start*/
			var xTickScale = d3.time.scale()
				.domain([0, dayLength - 1])
				.range([startDate, endDate]);

			var xTicks = d3.range(0, dayLength).map(function(d, i) {
				return xTickScale(d);
			});
			var xAxis = svg.select('g.x-axis');
			//$('#gx').empty();
			var update = xAxis.selectAll('text').data(xTicks);
			var enter = update.enter();
			var exit = update.exit();

			exit.remove();
			enter.append('text');
			update.text(function(d, i) {
					var date = new Date(d);
					return(date.getMonth() + 1) + '月' + date.getDate() + '日';
				})
				.attr({
					x: function(d, i) {
						return xScale(i);
					},
					y: 20,
					'font-size': '12px',
					'stroke': 'none',
					'fill': '#278FAA',
					'text-anchor': 'middle'
				});
			/*渲染x-axis end*/

			/*渲染y-axis start*/
			var yAxis = svg.select('g.y-axis');
			//	$('#gy').empty();
			var update = yAxis.selectAll('text').data(yTicks);
			var enter = update.enter();
			var exit = update.exit();

			exit.remove();
			enter.append('text');
			update.text(function(d, i) {
					return d;
				})
				.attr({
					'y': function(d, i) {
						return -yScale(d) + 5;
					},
					'x': '-10',
					'font-size': '12px',
					'stroke': 'none',
					'fill': '#278FAA',
					'text-anchor': 'end'
				});
			/*渲染y-axis end*/

			/*渲染line start*/
			var line = d3.svg.line()
				.interpolate('cardinal')
				.x(function(d, i) {
					return xScale(i);
				})
				.y(function(d) {
					return -yScale(Number(d)) - 5;
				});

			var main = svg.select('g.main');
			//	$('#gmain').empty();
			var update = main.selectAll('path').data(matrix);
			var enter = update.enter();
			var exit = update.exit();
			exit.remove();
			enter.append("path")
				.attr({
					'fill': 'none',
					'stroke-width': 2,
					'stroke': function(d, i) {
						return color(i);
					},
					'd': function(d) {
						return line(d);
					}
				});
			update
				.transition()
				.duration(3000)
				.attr({
					'stroke': function(d, i) {
						return color(i);
					},
					'd': function(d) {
						return line(d);
					}
				});
			/*渲染line end*/

			/*渲染legend start*/
			var legendData = keys;
			var legend = d3.select('.section-3 .legend');
			$('.section-3 .legend').empty();
			var update = legend.selectAll('.item').data(legendData);
			var enter = update.enter();
			var exit = update.exit();

			enter.append('div').classed('item', true).each(function(d, i) {
				var item = d3.select(this);
				item.append('div').classed('color-lump', true);
				item.append('div').classed('name', true);
			});

			update.each(function(d, i) {
				var item = d3.select(this);
				var colorLump = item.select('div.color-lump');
				var name = item.select('div.name');

				colorLump.style('background-color', color(i));
				name.text(nameMap[d]);
			});
			/*渲染legend end*/

		}

	}

}