function App() {
	var self = this;

	this.body = d3.select('body');
	this.requestJson();
	this.startTimingTask();
	this.relationhref();
}
App.prototype.relationhref = function(){
	var interval = window.setInterval(function() {
        window.location.reload(true);
    }, 6*60*60 * 1000);
}


App.prototype.startTimingTask = function() {
	var self = this;
	var interval = window.setInterval(function() {
		self.requestJson();
	}, 15 * 1000);
	//释放内存，防止浏览器崩溃
	interval = null;
}

App.prototype.requestJson = function() {
	var self = this;
	var url = serverDomain + '/screen/weixinpoint/getpoint?user_id=admin&department=aa&page_no=0&page_size=5';
	d3.json(url, function(error, data) {
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			//释放内存，防止浏览器崩溃
			self = null;
			url = null;
			return;
		}
		console.log(data.CONTENT);
		self.render(data.CONTENT);
		//释放内存，防止浏览器崩溃
		self = null;
		url = null;
	});
}

App.prototype.render = function(data) {
	console.log('render:' + JSON.stringify(data));
	this.renderIslandsGroup(data);
}

App.prototype.renderIslandsGroup = function(data) {
	var self = this;
	var update = this.body.selectAll('div.islands-group').data(data);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('div').classed('islands-group', true)
		.each(function(d, i) {
			d3.select(this).classed('islands-group' + i, true);
			var content = d3.select(this).append('div').classed('content', true);
			var svg = d3.select(this).append('svg');
			content.text(d.TITLE);
			content.append('img')
				.attr('src', 'img/underline.png')
				.classed('underline', true);
			self.renderIslands(svg, d);
			//释放内存，防止浏览器崩溃
			content = null;
			svg = null;
		});
	update.each(function(d) {
		var content = d3.select(this).select('div.content');
		var svg = d3.select(this).select('svg');
		content.text(d.TITLE);
		content.append('img')
			.attr('src', 'img/underline.png')
			.classed('underline', true);
		self.renderIslands(svg, d);
		//释放内存，防止浏览器崩溃
		content = null;
		svg = null;
	});
	//释放内存，防止浏览器崩溃
	self = null;
	update = null;
	enter = null;
	exit = null;
}

App.prototype.renderIslands = function(svg, d) {
	svg.selectAll('*').remove();
	var color = d3.scale.category10()
		.domain(d3.range(10));
	var keyword = d.KEYWORDS;
	if (keyword.length > 5) {
		keyword = keyword.slice(0, 5)
	}
	if (keyword.length < 15) {
		for (var i = 0, l = 15 - keyword.length; i < l; i++) {
			keyword.push('');
		}
		//释放内存，防止浏览器崩溃
		i = null;
	}

	var nodes = keyword.map(function(d, i) {
		var node = {};

		var dx = d3.random.normal(0, 150)();
		node.context = d;
		node.radius = d !== '' ? 20 * Math.random() + 25 : 10 * Math.random() + 10;
		node.x = 1920 / 2 + dx;
		node.y = 900 / 2;
		node.oy = 900 / 2 + Math.pow(-1, i) * (Math.random() * 50 + 50 + node.radius / 2);

		//释放内存，防止浏览器崩溃
		dx = null;
		return node;
	});
	nodes.unshift({
		context: '',
		fixed: true,
		x: 960,
		y: 450,
		oy: 450,
		radius: 75
	});
	var node = svg.selectAll("g")
		.data(nodes)
		.enter().append("g");

	node
		.append('circle')
		.style("fill", '#2BA1B6')
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
		.friction(1)
		.gravity(0.00)
		.charge(0)
		.on("tick", tick)
		.start();

	function tick(e) {
		node
			.each(cluster(10 * e.alpha * e.alpha))
			.each(collide(e.alpha))
			.each(function(d) {
				if (d.fixed) {
					d.x = 960;
					d.y = 450;
				}
			})
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
		return function(d) {
			if (d.fixed) {
				return;
			}
			d.y += (d.oy - d.y) * alpha
		};
	}

	var padding = 1.5, // separation between same-color nodes
		clusterPadding = 6, // separation between different-color nodes
		maxRadius = 12;
	// Resolves collisions between d and all other circles.
	function collide(alpha) {
		var quadtree = d3.geom.quadtree(nodes);
		return function(d) {
			var r = d.radius * 1.5 + maxRadius + Math.max(padding, clusterPadding),
				nx1 = d.x - r,
				nx2 = d.x + r,
				ny1 = d.y - r,
				ny2 = d.y + r;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
						y = d.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = d.radius * 1.5 + quad.point.radius * 1.5 + (d.cluster === quad.point.cluster ? padding : clusterPadding);
					if (l < r) {
						l = (l - r) / l * alpha;
						d.x -= x *= l;
						d.y -= y *= l;
						quad.point.x += x;
						quad.point.y += y;
					}
				}
				//释放内存，防止浏览器崩溃
				x = null;
				y = null;
				l = null;
				r = null;
				return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
			});
			//释放内存，防止浏览器崩溃
			r = null;
			nx1 = null;
			nx2 = null;
			ny1 = null;
			ny2 = null;
			// quadtree = null;
		};
	}
	//释放内存，防止浏览器崩溃
	color = null;
	// keyword = null;
	// nodes = null;
	// node = null;
	// force = null;
	padding = null;
	clusterPadding = null;
	maxRadius = null;
}

var app = new App();