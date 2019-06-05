function App() {
	var self = this;

	this.body = d3.select('svg');
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
	//	var url = serverDomain + '/screen/weibo/get';
	//	d3.json(url, function(error, data) {
	//		if (error) {
	//			return;
	//		}
	//		self.data = data;
	//		self.render();
	//	});
	self.render();
}

App.prototype.render = function() {
	this.renderSection1();
	this.renderSection2();
	this.renderSection3();
	this.renderSection4();
	this.renderSection5();
	this.renderSection6();
	this.renderSection7();
	this.renderSection8();
	this.renderSection9();
}

App.prototype.renderSection1 = function() {

}

App.prototype.renderSection2 = function() {

}

App.prototype.renderSection3 = function() {
	function r() {
		return Math.random() * 1000 + 1000;
	}
	var startDate = new Date(2016, 6, 1);
	var endDate = new Date(2016, 6, 7);

	var sectionData_3 = [
		[0, r(), r(), r(), r(), r(), r()],
		[0, r(), r(), r(), r(), r(), r()],
		[0, r(), r(), r(), r(), r(), r()],
		[0, r(), r(), r(), r(), r(), r()],
		[0, r(), r(), r(), r(), r(), r()],
		[0, r(), r(), r(), r(), r(), r()]
	];

	var maxValue = 0;

	sectionData_3.forEach(function(d, i) {
		d.forEach(function(d, i) {
			if(d > maxValue) {
				maxValue = d;
			}
		})
	})

	var svg = d3.select('.section-3 svg');

	var xScale = d3.time.scale()
		.domain([0, sectionData_3[0].length - 1])
		.range([0, 525]);

	var yScale = d3.scale.linear()
		.domain([0, 2000])
		.range([0, 215]);

	var color = d3.scale.ordinal()
		.range(["#14D7DE", "#029EA3", "#0E769D", "#48C8F5", "#489BEE", "#93E0FA"]);

	/*渲染x-axis start*/
	var xTickScale = d3.time.scale()
		.domain([0, sectionData_3[0].length - 1])
		.range([startDate, endDate]);

	var xTicks = d3.range(0, sectionData_3[0].length).map(function(d, i) {
		return xTickScale(d);
	});

	var xAxis = svg.select('g.x-axis');

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
	var yTicks = yScale.ticks(5);

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
			return -yScale(d);
		});

	var main = svg.select('g.main');

	var update = main.selectAll('path').data(sectionData_3);
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
	var legendData = ['微博', '论坛', '博客', '手机客户端', '微信公众号', '新闻'];
	var legend = d3.select('.section-3 .legend');

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
		name.text(d);
	});
	/*渲染legend end*/
}

App.prototype.renderSection4 = function() {
	var sectionData = [{
		date: '2016-07-12',
		viewpoints: [{
			text: '7月12日观点1',
			value: '31'
		}, {
			text: '7月12日观点2',
			value: '25'
		}, {
			text: '7月12日观点3',
			value: '21'
		}, {
			text: '7月12日观点4',
			value: '37'
		}, {
			text: '7月12日观点5',
			value: '29'
		}]
	}, {
		date: '2016-07-13',
		viewpoints: [{
			text: '7月13日观点1',
			value: '21'
		}, {
			text: '7月13日观点2',
			value: '32'
		}, {
			text: '7月13日观点3',
			value: '35'
		}, {
			text: '7月13日观点4',
			value: '11'
		}, {
			text: '7月13日观点5',
			value: '19'
		}]
	}];

	var g = d3.select('.section-4 svg g');

	var nodes = [];
	var max = 0;
	sectionData.forEach(function(d, i) {
		var step = 640 / d.viewpoints.length;
		d.viewpoints.forEach(function(dd, ii) {
			nodes.push({
				x: 640 * i + ii * step + 0 * step / 8,
				y: 0
			});
			nodes.push({
				x: 640 * i + ii * step + 2 * step / 8,
				y: 0
			});
			nodes.push({
				x: 640 * i + ii * step + 2.5 * step / 8,
				y: -0.1 * dd.value
			});
			nodes.push({
				x: 640 * i + ii * step + 3 * step / 8,
				y: 0.1 * dd.value
			});
			nodes.push({
				x: 640 * i + ii * step + 3.5 * step / 8,
				y: 0
			});
			nodes.push({
				text: dd.text,
				x: 640 * i + ii * step + 5 * step / 8,
				y: dd.value
			});
			nodes.push({
				x: 640 * i + ii * step + 6.5 * step / 8,
				y: -0.1 * dd.value
			});
			nodes.push({
				x: 640 * i + ii * step + 7 * step / 8,
				y: 0.1 * dd.value
			});
			if(dd.value > max) {
				max = dd.value;
			}
		});
	});

	var yScale = d3.scale.linear()
		.domain([0, max])
		.range([0, 125]);

	var line = d3.svg.line()
		.x(function(d) {
			return d.x;
		})
		.y(function(d) {
			return -yScale(d.y);
		});

	var update = g.selectAll('path').data([nodes]);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append("path")
		.style('filter', 'url(#filter3000)')
		.attr({
			'fill': 'none',
			'stroke-width': 4,
			'stroke': '#14D7DE',
			'd': function(d) {
				return line(d);
			}
		});
	update
		.transition()
		.duration(3000)
		.attr({
			'd': function(d) {
				return line(d);
			}
		});

	var update = g.selectAll('circle').data(
		nodes.filter(function(d) {
			return d.text;
		})
	);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('circle');
	update.attr({
		fill: '#14D7DE',
		r: '10',
		cx: function(d) {
			return d.x;
		},
		cy: function(d) {
			return -yScale(d.y) - 20;
		}
	});

	var update = g.selectAll('g').data(
		nodes.filter(function(d) {
			return d.text;
		})
	);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('g')
		.each(function(d, i) {
			var g = d3.select(this);

			var x = d.x;
			var y = -yScale(d.y) - 45;
			
			g.attr({
				'transform': 'translate(' + x + ',' + y + ')'
			})
			
			var rect = g.append('rect');
			var text = g.append('text')
				.attr({
					'text-anchor': 'middle',
					'fill': '#ffffff'
				})
				.text(d.text);
			var $text = $(text[0][0]);
			var w = $text.width();
			
			rect.attr({
				width:w + 25,
				height:34,
				x:-(w + 25)/2,
				y:-22,
				fill:'#215C69'
			});
		});
	update.each(function(d, i) {
		var g = d3.select(this);
		var x = d.x;
		var y = -yScale(d.y) - 45;
		g.attr({
			'transform': 'translate(' + x + ',' + y + ')'
		})
		g.select('text').text(d.text);
	});
}

App.prototype.renderSection5 = function() {

}

App.prototype.renderSection6 = function() {
	var svg = d3.select('.section-6 svg');

	function r() {
		return Math.random() * 1500 + 500;
	}

	var sectionData = [{
		value1: 500,
		value2: 100
	}, {
		value1: r(),
		value2: r()
	}, {
		value1: r(),
		value2: r()
	}, {
		value1: r(),
		value2: r()
	}, {
		value1: r(),
		value2: r()
	}, {
		value1: r(),
		value2: r()
	}];

	var maxValue = d3.max(sectionData, function(d, i) {
		return Math.max(d.value1, d.value2);
	});

	var startDate = new Date(2016, 6, 1);
	var endDate = new Date(2016, 6, 7);

	var xScale = d3.time.scale()
		.domain([0, sectionData.length - 1])
		.range([50, 475]);

	var yTicks = d3.scale.linear()
		.domain([-maxValue, maxValue])
		.ticks(3);

	if(yTicks[yTicks.length - 1] < maxValue && yTicks.length >= 2) {
		var step = yTicks[1] - yTicks[0];
		yTicks.unshift(yTicks[0] - step);
		yTicks.push(yTicks[yTicks.length - 1] + step);
	}

	var yScale = d3.scale.linear()
		.domain([yTicks[0], yTicks[yTicks.length - 1]])
		.range([0, 200]);

	/*渲染x-axis start*/
	var xTickScale = d3.time.scale()
		.domain([0, sectionData.length - 1])
		.range([startDate, endDate]);

	var xTicks = d3.range(0, sectionData.length).map(function(d, i) {
		return xTickScale(d);
	});

	var xAxis = svg.select('g.x-axis');

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

	var update = xAxis.selectAll('line').data(xTicks);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('line');
	update
		.attr({
			'x1': function(d, i) {
				return xScale(i);
			},
			'y1': 0,
			'x2': function(d, i) {
				return xScale(i);
			},
			'y2': -7,
			'stroke': "#2f98d3",
			'stroke-width': 2
		});

	/*渲染x-axis end*/

	/*渲染y-axis start*/
	var yAxis = svg.select('g.y-axis');

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

	var update = yAxis.selectAll('line').data(yTicks);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('line');
	update
		.attr({
			'x1': 0,
			'y1': function(d, i) {
				return -yScale(d);
			},
			'x2': -7,
			'y2': function(d, i) {
				return -yScale(d);
			},
			'stroke': "#2f98d3",
			'stroke-width': 2
		});
	/*渲染y-axis end*/

	/*渲染rect start*/
	var main = svg.select('g.main');

	var update = main.selectAll('g').data(sectionData);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter
		.append('g')
		.attr('transform', function(d, i) {
			return 'translate(' + xScale(i) + ',0)';
		})
		.each(function(d, i) {
			var g = d3.select(this);
			var rect0 = g.append('rect').classed('rect0', true);
			var rect1 = g.append('rect').classed('rect1', true);

			rect0.attr({
				'x': -10,
				'y': -100,
				'width': 20,
				'height': 0,
				'fill': '#e34153',
				'stroke-width': 0
			})

			rect1.attr({
				'x': -10,
				'y': -100,
				'width': 20,
				'height': 0,
				'fill': '#00fcff',
				'stroke-width': 0
			})
		});

	update
		.each(function(d, i) {
			var g = d3.select(this);
			var rect0 = g.select('rect.rect0', true);
			var rect1 = g.select('rect.rect1', true);

			rect0
				.transition()
				.duration(3000)
				.attr({
					'y': -yScale(d.value1),
					'height': yScale(d.value1) - 100
				})

			rect1
				.transition()
				.duration(3000)
				.attr({
					'y': -100,
					'height': 100 - yScale(-d.value2)
				});
		})

	/*渲染rect end*/

	/*渲染tooltip start*/
	var tooltipG = svg.select('g.tooltip');

	var update = tooltipG.selectAll('line').data([{}]);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('line');
	update
		.attr({
			'stroke': '#d0cfcf',
			'stroke-width': 1,
			'x1': xScale(0),
			'y1': 0,
			'x2': xScale(0),
			'y2': -215
		});
	/*渲染tooltip end*/

	/*渲染tooltip start*/
	var tooltipTopG = svg.select('g.tooltip-top');

	var update = tooltipTopG.selectAll('g').data([{}]);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('g').each(function() {
		var g = d3.select(this);
		var text1 = g.append('text').classed('text1', true);
		var text2 = g.append('text').classed('text2', true);
		var path = g.append('path')
			.attr({
				y: -215,
				d: 'M15,-5 L5,0 L15,5 L15,40 L150,40 L150,-40 L15,-40 Z',
				fill: 'rgba(14, 202, 200, 0.5)'
			});

		text1.attr({
			'stroke-width': 0,
			'fill': '#00fcff',
			x: 30,
			y: -15
		}).text('正面：' + sectionData[0].value1);
		text2.attr({
			'stroke-width': 0,
			'fill': '#00fcff',
			x: 30,
			y: 25
		}).text('负面：' + sectionData[0].value2);
	});
	update
		.each(function() {
			var g = d3.select(this);
			var text1 = g.select('text.text1');
			var text2 = g.select('text.text2');

			g.attr('transform', 'translate(' + xScale(0) + ',-215)');

			text1.text('正面：' + sectionData[0].value1);
			text2.text('负面：' + sectionData[0].value2);
		});
	/*渲染tooltip end*/
}

App.prototype.renderSection7 = function() {
	var section = d3.select('.section-7');
	var radarG = section.select('g.radar');

	var sectionData = [10, 8, 7, 9, 5];

	sectionData.forEach(function(d, i) {
		section.select('.legend-' + (i + 1) + ' .value')
			.transition()
			.duration(1000)
			.tween("text", function() {
				var legendValue = d3.select(this);
				var v0 = Number(legendValue.text() || 0);
				var i = d3.interpolateRound(v0, d);
				return function(t) {
					legendValue.text(i(t));
				}
			});
	});

	var dScale = d3.scale.linear()
		.domain([0, d3.max(sectionData)])
		.range([0, 125]);

	var update = radarG.selectAll('path.line').data([sectionData]);
	var enter = update.enter();
	var exit = update.exit();

	var line0 = d3.svg.line()
		.x(function(d, i) {
			return 0;
		})
		.y(function(d, i) {
			return 0;
		});

	var line1 = d3.svg.line()
		.x(function(d, i) {
			return dScale(d) * Math.sin(i * 72 * Math.PI / 180);
		})
		.y(function(d, i) {
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
		.attr("d", function(d) {
			return line0(d) + ' Z';
		});
	update
		.transition()
		.duration(1000)
		.attr("d", function(d) {
			return line1(d) + ' Z';
		});
}

App.prototype.renderSection8 = function() {
	var svg1 = d3.select('.section-8 .svg-1 g');
	var svg2 = d3.select('.section-8 .svg-2 g');

	var keywordsArr = [
		'毛泽东',
		'军队',
		'训练',
		'官兵',
		'部队',
		'演习',
		'军委',
		'改革',
		'全军',
		'国防',
		'苏联',
		'演练',
		'作战',
		'信息化',
		'海军',
		'斯大林',
		'人民军队',
		'中队',
		'发展',
		'实战',
		'强军目标',
		'工作',
		'武警部队',
		'创新',
		'管理',
		'学习',
		'印度',
		'支队'
	];

	var keywords = keywordsArr.map(function(d, i) {
		return {
			text: d
		}
	});
	svg1.attr('transform', 'translate(' + 320 / 2 + ',' + 245 / 2 + ')');
	svg2.attr('transform', 'translate(' + 320 / 2 + ',' + 245 / 2 + ')');

	d3.layout.cloud()
		.size([320, 245])
		.words(keywords)
		.padding(2)
		.rotate(function() {
			return ~~(Math.random() * 5) * 45 - 90;
		})
		.font('myFont')
		.fontSize(function(d) {
			return(Math.random() * 10) + 15;
		})
		.on('end', getDraw(svg1))
		.spiral('archimedean')
		.start();

	d3.layout.cloud()
		.size([320, 245])
		.words(keywords)
		.padding(2)
		.rotate(function() {
			return ~~(Math.random() * 5) * 45 - 90;
		})
		.font('myFont')
		.fontSize(function(d) {
			return(Math.random() * 10) + 15;
		})
		.on('end', getDraw(svg2))
		.spiral('archimedean')
		.start();

	function getDraw(g) {
		var fill = d3.scale.category20();

		return function draw(words) {
			var update = g.selectAll('text').data(words, function(d, i) {
				return d ? d.text : i;
			});
			var enter = update.enter();
			var exit = update.exit();

			exit.remove();

			enter.append('text')
				.style('font-size', '0px')
				.style('font-family', 'myFont')
				.style('fill', function(d, i) {
					return fill(i);
				})
				.attr('text-anchor', 'middle')
				.attr('transform', 'translate(0,0) rotate(0)')
				.text(function(d) {
					return d.text;
				});
			update
				.transition()
				.duration(1000)
				.style('font-size', function(d) {
					return d.size + 'px';
				})
				.attr('transform', function(d) {
					if(d.rotate == 90) {
						return 'translate(' + [d.x + 5, d.y] + ')';
					}
					if(d.rotate == -90) {
						return 'translate(' + [d.x - 5, d.y] + ')';
					}
					return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';
				})
				.style('writing-mode', function(d) {
					if(Math.abs(d.rotate) == 90) return 'tb';
					return null;
				})
		}
	}
}

App.prototype.renderSection9 = function() {
	var svg = d3.select('.section-9 svg');
	svg.selectAll('*').remove();

	var keyword = ['国务院工作组', '国务院工作组', '国务院工作组', '国务院工作组', '国务院工作组', '国务院工作组', '国务院工作组', '国务院工作组', '国务院工作组'];

	var w = 600;
	var h = 270;
	var nodes = keyword.map(function(d, i) {
		if(i === 0) {
			return {
				context: d,
				fixed: true,
				x: w / 2,
				y: h / 2,
				ox: w / 2,
				oy: h / 2,
				radius: 50
			}
		}
		var node = {};

		node.context = d;
		node.radius = d !== '' ? 20 * Math.random() + 25 : 10 * Math.random() + 10;
		node.x = w / 2;
		node.y = h / 2;
		var angle = Math.random() * 360;
		var r = 130;
		node.ox = w / 2 + r * Math.cos(angle * Math.PI / 180);
		node.oy = h / 2 + r * Math.sin(angle * Math.PI / 180);

		return node;
	});

	var node = svg.selectAll("g")
		.data(nodes)
		.enter().append("g");

	node
		.append('circle')
		.style("fill", '#3173BA')
		.transition()
		.duration(750)
		.delay(function(d, i) {
			return i * 5;
		})
		.attrTween("r", function(d) {
			var i = d3.interpolate(0, d.radius);
			return function(t) {
				return d.radius = i(t);
			};
		});
	node.append("text")
		.text(function(d) {
			return d.context;
		})
		.style({
			'font': '24px "Helvetica Neue", Helvetica, Arial, sans-serif',
			'font-family': 'SimHei',
			'text-anchor': 'middle',
			'pointer-events': 'none',
			'fill': '#ffffff'
		})
		.attr("dy", ".45em")
		.transition()
		.duration(750)
		.delay(function(d, i) {
			return i * 5;
		})
		.styleTween("font-size", function(d) {
			var i = d3.interpolate(0, Math.min(2 * d.radius * 0.9, (2 * d.radius * 0.9 - 8) / this.getComputedTextLength() * 24));
			return function(t) {
				return i(t) + 'px';
			}
		});

	var force = d3.layout.force()
		.nodes([])
		.size([])
		.friction(0)
		.gravity(0)
		.charge(0)
		.on("tick", tick)
		.start();

	function tick(e) {
		node
			.each(cluster(10 * e.alpha * e.alpha))
			.each(collide(e.alpha))
			.each(function(d) {
				if(d.fixed) {
					d.x = w / 2;
					d.y = h / 2;
				}
				d.x = Math.max(d.x, d.radius);
				d.x = Math.min(d.x, w - d.radius);

				d.y = Math.max(d.y, d.radius);
				d.y = Math.min(d.y, h - d.radius);
			})
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
		return function(d) {
			if(d.fixed) {
				return;
			}
			d.y += (d.oy - d.y) * alpha
			d.x += (d.ox - d.x) * alpha
		};
	}

	var padding = 1.5, // separation between same-color nodes
		clusterPadding = 1.5, // separation between different-color nodes
		maxRadius = 50;
	// Resolves collisions between d and all other circles.
	function collide(alpha) {
		var quadtree = d3.geom.quadtree(nodes);
		return function(d) {
			var r = d.radius * 1.1 + maxRadius + Math.max(padding, clusterPadding),
				nx1 = d.x - r,
				nx2 = d.x + r,
				ny1 = d.y - r,
				ny2 = d.y + r;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if(quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
						y = d.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = d.radius * 1.5 + quad.point.radius * 1.5 + (d.cluster === quad.point.cluster ? padding : clusterPadding);
					if(l < r) {
						l = (l - r) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
		};
	}
}

var app = new App();