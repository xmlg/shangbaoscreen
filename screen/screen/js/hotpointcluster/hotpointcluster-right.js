function App() {
	this.grid = d3.select('.grid');
	this.pollList = [{
		name: '司法热点聚焦',
		value: '003'
	}, {
		name: '军事热点聚焦',
		value: '004'
	}, {
		name: '社会热点聚焦',
		value: '005'
	}, {
		name: '地产热点聚焦',
		value: '006'
	}, {
		name: '科技热点聚焦',
		value: '007'
	}, {
		name: '人文热点聚焦',
		value: '008'
	}, {
		name: '体育热点聚焦',
		value: '009'
	}, {
		name: '教育热点聚焦',
		value: '010'
	}, {
		name: '生活热点聚焦',
		value: '011'
	}, {
		name: '健康热点聚焦',
		value: '012'
	}];

	this.pollListIndex = 0;

	this.requestJson();
	this.startTimingTask();

}

App.prototype.startTimingTask = function() {
	var self = this;
	var interval = window.setInterval(function() {
		self.requestJson();
	}, 60 * 1000);
}

App.prototype.requestJson = function() {
	var self = this;
	var poll = this.pollList[this.pollListIndex];
	var url = serverDomain + '/screen/hotpointcluster/hotpointnews/?field=zyzxfield_' + poll.value;
	d3.json(url, function(error, data) {
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			return;
		}

		self.renderGrid(data);
		d3.select('div.header').text(poll.name);
	});
	self.pollListIndex++;
	if (self.pollListIndex >= this.pollList.length) {
		self.pollListIndex = 0;
	}
}

App.prototype.renderGrid = function(data) {
	var self = this;
	positionsGenerator.resetGroupPositions();

	data = data.sort(function(a, b) {
		return b.SHORTTITLE.length - a.SHORTTITLE.length;
	});
	console.log(data);
	var colorDomain = d3.scale.linear()
		.domain([1, 20])
		.range(['#122E3A', '#11232F']);

	function rendomColor() {
		return colorDomain(~~(20 * Math.random()));
	}

	var update = self.grid
		.selectAll('div.cell')
		.data(data, function(d, i) {
			return i;
		});
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('div').classed('cell', true)
		.each(function(d, i) {
			d3.select(this).append('div').classed('inner', true).append('span');

			var cellInfo = positionsGenerator.getCellInfo(i);
			var color = rendomColor();
			d3.select(this).select('span').text(d.SHORTTITLE);
			d3.select(this)
				.attr('class', cellInfo.className)
				.classed('cell', true)
				.style({
					top: (1920 - Math.random() * 1920 * 2) + 'px',
					left: (1080 - Math.random() * 1080 * 2) + 'px',
					width: cellInfo.w + 'px',
					height: cellInfo.h + 'px'
				});
			d3.select(this).select('.inner').style({
				'border-color': color,
				'background-color': color
			})
		});
	update.each(function(d, i) {
		var cellInfo = positionsGenerator.getCellInfo(i);
		var color = rendomColor();
		var span = d3.select(this).select('span');
		d3.select(this)
			.attr('class', cellInfo.className)
			.classed('cell', true)
			.transition()
			.duration(1000)
			.style({
				top: cellInfo.y + 'px',
				left: cellInfo.x + 'px',
				width: cellInfo.w + 'px',
				height: cellInfo.h + 'px'
			});
		var inner = d3.select(this).select('.inner');
		inner.style({
			'border-color': color,
			'background-color': color
		});
		if (span.text() != d.SHORTTITLE) {
			inner.transition()
				.delay(function() {
					return i * 100 + 1000;
				})
				.duration(1000)
				.tween('', function() {
					var self = this;
					return function(t) {
						if (t < 0.5) {
							$(self).css('-webkit-transform', 'rotateY(' + (t * 180) + 'deg)');
						} else {
							span.text(d.SHORTTITLE);
							$(self).css('-webkit-transform', 'rotateY(' + (270 + (t - 0.5) * 180) + 'deg)');
						}
					}
				})
				.each('end', function() {
					span.text(d.SHORTTITLE);
				});
		}
	});
}

var app = new App();