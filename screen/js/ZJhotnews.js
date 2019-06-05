function App() {
	var self = this;
	this.svg0 = d3.select('#svg0');
	this.mainG = d3.select('#svg0').append('g').classed('mainG', true);
	this.onFocusLineG = d3.select('#svg0').append('g').classed('onFocusLineG', true);
	this.onFocusChildG = d3.select('#svg0').append('g').classed('onFocusChildG', true);
	this.onFocusMainG = d3.select('#svg0').append('g').classed('onFocusMainG', true);

	this.list1 = d3.select('#list1');

	this.projection = d3.geo.conicConformal()
		.scale(12100)
		.translate([385, 470])
		.rotate([-120, -29, 4.5]);

	this.pathGenerator = d3.geo.path()
		.projection(this.projection);

	this.onfocusIndex = 0;
	this.focusNextRecordTask = new TimedTask(function() {
		var nextRecord = self.focusNextRecord();
		if (nextRecord && nextRecord.LNG && nextRecord.LAT && nextRecord.CHILDERNS) {
			return 20000 + nextRecord.CHILDERNS.length * 1000;
		}
		return 21000;
	}, 0);
	this.requestDataTask = new TimedTask(function() {
		self.requestData();
		return 60000;
	}, 0);
	this.focusNextRecordTask.start();
	this.requestDataTask.start();
};

App.prototype.focusNextRecord = function() {
	if (this.data) {
		this.onfocusIndex++;
		if (this.onfocusIndex >= this.data.length) {
			this.onfocusIndex = 0;
		}
		this.render(this.data);
		return this.data[this.onfocusIndex];
	}
}

App.prototype.requestData = function() {
	var self = this;
	//var url  =  '../mlfdp/js/areahotpoint/zj.json'
	var url = serverDomain + '/screen/areahotpoint/zjhotpoint?user_id=admin&department=aa&page_no=0&page_size=10';
	console.log('requestData');
	d3.json(url, function(error, data) {
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			return;
		}
		self.data = data;
		self.render(data);
	});
};

App.prototype.render = function(data) {
	this.renderList(data);
	this.renderLandMark(data);
	this.renderOnFocusLandMark(data[this.onfocusIndex]);
	this.renderOnFocusPath(data[this.onfocusIndex]);
	this.renderOnFocusChildren(data[this.onfocusIndex]);
};

App.prototype.renderList = function(data) {
	var self = this;
	var domain = d3.extent(data, function(d) {
		return d.CLUSTERNUMS;
	});
	var scale = d3.scale.linear()
		.domain(domain)
		.range([25, 80]);

	var update = this.list1.selectAll('li').data(data);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('li').each(function() {
		d3.select(this).append('div').classed('mark', true);
		d3.select(this).append('div').classed('content', true)
			.append('div').classed('content-inner', true);

		var bar = d3.select(this).append('div').classed('bar', true);
		bar.append('div').classed('value', true);
		bar.append('div').classed('bar-outer', true)
			.append('div').classed('bar-inner', true);
	});

	update.each(function(d, i) {
		var contentInner = d3.select(this).select('.content-inner').text(d.TITLE);
		d3.select(this).select('.value').text(d.CLUSTERNUMS);
		d3.select(this).select('.bar-inner').style('width', scale(d.CLUSTERNUMS) + '%');

		if (i === self.onfocusIndex) {
			d3.select(this).classed('focus', true);
			var bar1 = d3.select(this)[0];
			var bar2 = $(bar1).children();
			var bar3 = $(bar2)[2];
			var bar_children = $(bar3).children()[1];
			$(bar_children).addClass('focus2');
			self.scrolleOnFocusText(contentInner[0][0]);
		} else {
			d3.select(this).classed('focus', false);
			var bar1 = d3.select(this)[0];
			var bar2 = $(bar1).children();
			var bar3 = $(bar2)[2];
			var bar_children = $(bar3).children()[1];
			$(bar_children).removeClass('focus2');
		}
	})
};

App.prototype.renderLandMark = function(data) {
	var self = this;
	console.log(data)
	var domain = d3.extent(data, function(d) {
		return d.CLUSTERNUMS;
	});
	this.scale = d3.scale.linear()
		.domain(domain)
		.range([50, 100]);

	var update = this.mainG.selectAll('g').data(
		data.filter(function(d) {
			return  d.LAT && d.LNG;
		}));
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append("g").each(function(d, i) {
		var mark = d3.select(this);
		var onFocus = (i === self.onfocusIndex);
		var pro = self.projection([d.LNG, d.LAT]);

		var size = self.scale(d.CLUSTERNUMS);

		mark
			.attr('transform', 'translate(' + pro[0] + ',' + pro[1] + ')')
			.transition()
			.duration(1000)
			.tween('', function() {
				return function(t) {
					mark.call(d3.dynamicSymbol.mark(size, 'rgba(255,255,0,0.5)', t, d.FLAGFORZB));
				}
			});
	});
	update.each(function(d, i) {
		var mark = d3.select(this);
		var onFocus = (i === self.onfocusIndex);
		var pro = self.projection([d.LNG, d.LAT]);

		var size = self.scale(d.CLUSTERNUMS);

		mark.call(d3.dynamicSymbol.mark(size, 'rgba(255,255,0,0.5)', 1, d.FLAGFORZB));
	});
}

App.prototype.renderOnFocusLandMark = function(data) {
	var self = this;

	var size = 150;
	var update = this.onFocusMainG.selectAll('g.main').data(data.LNG && data.LAT ? [data] : []);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append("g").classed('main', true);
	update.each(function(d, i) {
		var mark = d3.select(this);
		var pro = self.projection([d.LNG, d.LAT]);

		mark
			.attr('transform', 'translate(' + pro[0] + ',' + pro[1] + ')')
			.transition()
			.duration(1000)
			.tween('', function() {
				return function(t) {
					mark.call(d3.dynamicSymbol.mark01(size, 'rgba(255,255,0,0.8)', t, d.FLAGFORZB));
				}
			});

	});
}

App.prototype.renderOnFocusPath = function(data) {
	var self = this;

	var update = this.onFocusLineG.selectAll('g.path').data(data.LNG && data.LAT ? data.CHILDERNS : []);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('g').classed('path', true)
		.each(function(d, i) {
			var linearGradient = d3.select(this).append('linearGradient').attr('id', 'linearGradient' + i);
			linearGradient.append('stop')
				.attr({
					offset: "0%",
					style: 'stop-color:rgb(255,255,0);stop-opacity:0.1'
				});
			linearGradient.append('stop')
				.attr({
					offset: "50%",
					style: 'stop-color:rgb(255,255,0);stop-opacity:1'
				});
			linearGradient.append('stop')
				.attr({
					offset: "100%",
					style: 'stop-color:rgb(255,255,0);stop-opacity:0.1'
				});
			d3.select(this).append('path').classed('main', true);
			d3.select(this).append('path').classed('bg', true);;
		});
	update.each(function(d, i) {
		var x0 = self.projection([data.LNG, data.LAT])[0];
		var y0 = self.projection([data.LNG, data.LAT])[1];
		var x1 = self.projection([d.LNG, d.LAT])[0];
		var y1 = self.projection([d.LNG, d.LAT])[1];

		var mx = (x0 + x1) / 2;
		var my = (y0 + y1) / 2;

		var dx = 100;
		var dy = 0;
		if (y1 - y0 == 0) {
			dy = 100;
			dx = 0;
		} else {
			dy = -((dx) * (x1 - x0)) / (y1 - y0);
		}
		var s = 0.2 * Math.pow((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0), 0.5) / Math.pow(dy * dy + dx * dx, 0.5);

		if (y1 < y0) {
			dx = -dx;
			dy = -dy;
		}

		var linearGradient = d3.select(this).select('linearGradient');
		if ((x1 - x0) >= 0 && (y1 - y0) >= 0) {
			linearGradient.attr({
				x1: '0%',
				y1: '0%',
				x2: '100%',
				y2: '100%'
			});
		} else if ((x1 - x0) >= 0 && (y1 - y0) <= 0) {
			linearGradient.attr({
				x1: '0%',
				y1: '100%',
				x2: '100%',
				y2: '0%'
			});
		} else if ((x1 - x0) <= 0 && (y1 - y0) <= 0) {
			linearGradient.attr({
				x1: '100%',
				y1: '100%',
				x2: '0%',
				y2: '0%'
			});
		} else if ((x1 - x0) <= 0 && (y1 - y0) >= 0) {
			linearGradient.attr({
				x1: '100%',
				y1: '0%',
				x2: '0%',
				y2: '100%'
			});
		}

		var path = d3.select(this).select('path.main');
		var pathBg = d3.select(this).select('path.bg');

		pathBg.attr({
				stroke: 'none',
				'stroke-width': 0,
				fill: 'url(#linearGradient' + i + ')',
				style: 'filter:url(#glow)'
			})
			.transition()
			.delay(i * 100)
			.duration(5000)
			.attrTween('d', function() {
				return function(t) {
					if (t < 0.5) {
						return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], 0, t * 2, 100, 3);
					} else {
						return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], (t - 0.5) * 2, 1, 100, 3);
					}
				}
			});

		path.attr({
				stroke: 'none',
				'stroke-width': 0,
				fill: 'url(#linearGradient' + i + ')'
			})
			.transition()
			.delay(i * 100)
			.duration(5000)
			.attrTween('d', function() {
				return function(t) {
					if (t < 0.5) {
						return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], 0, t * 2, 100, 2);
					} else {
						return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], (t - 0.5) * 2, 1, 100, 2);
					}
				}
			});
	})
}

App.prototype.renderOnFocusChildren = function(data) {
	var self = this;

	var update = this.onFocusChildG.selectAll('g.child').data(data.LNG && data.LAT ? data.CHILDERNS : []);
	var enter = update.enter();
	var exit = update.exit();

	var size = 50;

	exit.remove();
	enter.append('g').classed('child', true);
	update.each(function(d, i) {
		var mark = d3.select(this);
		var pro = self.projection([d.LNG, d.LAT]);
		mark.call(d3.dynamicSymbol.mark02(0, '#74E0FF', '#F4F075', 0));
		mark.attr('transform', 'translate(' + pro[0] + ',' + pro[1] + ')')
			.transition()
			.delay(2500 + i * 100)
			.duration(2500)
			.tween('', function() {
				return function(t) {
					mark.call(d3.dynamicSymbol.mark02(size, '#74E0FF', '#F4F075', t, d.FLAGFORZB));
				}
			});
	});
}

App.prototype.scrolleOnFocusText = function(text) {
	window.setTimeout(function() {
		var $text = $(text);
		var containerWidth = $text.width();
		var textWidth = $text[0].scrollWidth;
		if (containerWidth < textWidth) {
			$text.animate({
				left: textWidth - containerWidth + 875 + 'px'
			}, {
				step: function(now, fx) {
					$(this).css('transform', 'translate(-' + now + 'px,0px)');
				},
				duration: (textWidth / containerWidth) *8500,
				easing: 'linear',
				complete: function() {
					$text.css('left', containerWidth + 'px');
					$text.animate({
						left: '0px'
					}, {
						step: function(now, fx) {
							$(this).css('transform', 'translate(' + now + 'px,0px)');
						},
						duration:8500,
						easing: 'linear',
					});
				}
			});
		}
	}, 500);
}

var app = new App();

function setTime() {
	var str = '';
	var date = new Date();

	var month = date.getMonth() + 1;
	str += date.getFullYear() + '-';
	str += date.getMonth() + 1 + '-';
	str += date.getDate() + '';

	d3.select('#timer').text(str);
	d3.select('.col1-span').text(str)
}
setTime();

window.setInterval(setTime, 1000);