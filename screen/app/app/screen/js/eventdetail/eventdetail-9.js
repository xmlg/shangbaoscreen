App.prototype.renderSection9 = function() {
	var self = this;
	var svg = d3.select('.section-9 svg');
	var h1 = d3.select('.section-9 h1');
	var sectionData = self.sectionData_9;
	if($.isEmptyObject(sectionData) == false) {
		svg.selectAll('*').remove();

		switch(self.carouselIndexSection9) {
			case 0:
				h1.text('相关主题-人物');
				var keyword = sectionData.relatedentityNameData;
				break;
			case 1:
				h1.text('相关主题-地点');
				var keyword = sectionData.relatedentityPlaceData;
				break;
			case 2:
				h1.text('相关主题-机构');
				var keyword = sectionData.relatedentityOrgData;
				break;
			default:
				h1.text('相关主题-人物');
				var keyword = sectionData.relatedentityNameData;
		}

		var w = 600;
		var h = 270;

		var max = 0;
		var min = Infinity;

		for(var i = 0; i < keyword.length && i < 10; i++) {
			var d = keyword[i];
			if(d.IRECORDNUM < min) {
				min = d.IRECORDNUM;
			}
			if(d.IRECORDNUM > max) {
				max = d.IRECORDNUM;
			}
		}

		var radiusScale = d3.scale.linear()
			.domain([min, max])
			.range([30, 40]);

		var opacity = d3.scale.linear()
			.domain([min, max])
			.range([0.5, 1.0]);

		var nodes = keyword.filter(function(d, i) {
			return i < 10;
		}).map(function(d, i) {
			if(i === 0) {
				return {
					context: d.STRVALUE,
					value: d.IRECORDNUM,
					fixed: true,
					x: w / 2,
					y: h / 2,
					ox: w / 2,
					oy: h / 2,
					radius: 50
				}
			}
			var node = {};

			node.context = d.STRVALUE;
			node.value = d.IRECORDNUM;
			node.radius = radiusScale(d.IRECORDNUM);
			console.valueOf(node.radius);
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
			.style({
				'fill': 'rgba(14, 111, 115, 1)',
				'overflow':'hidden',
				'fill-opacity': function(d) {
					return opacity(d.value);
				}
			})
			.attr('stroke','rgb(14,202,200)')
			.attr('stroke-width',1.7)
			.transition()
			.duration(750)
			.delay(function(d, i) {
				return i * 5;
			})
			.attrTween("r", function(d,i) {
					var aa = d3.interpolate(0, d.radius);
				return function(t) {
					return d.radius = aa(t);
				};
			});

		node.append('path')
			.attr('d', function(d,i){
					var data_nodeArc = {
						startAngle: Math.PI * 0.5,
						endAngle: Math.PI * 0.9
					};
					var dis = d.radius/15;
					var outRadius = d.radius+dis;
					var innerRadius = d.radius-dis;
					var data_arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outRadius);
					return data_arc(data_nodeArc);
			})
			.attr('fill', 'rgb(14,202,200)').attr('stroke','rgb(14,202,200)');
				node.append('path')
			.attr('d', function(d,i){
					var data_nodeArc = {
						startAngle: Math.PI * -0.2,
						endAngle: Math.PI * 0.2
					};
					var dis = d.radius/15;
					var outRadius = d.radius+dis;
					var innerRadius = d.radius-dis;
					var data_arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outRadius);
					return data_arc(data_nodeArc);
			})
			.attr('fill', 'rgb(14,202,200)').attr('stroke','rgb(14,202,200)');
			
			
			node.append('path')
			.attr('d', function(d,i){
					var data_nodeArc = {
						startAngle: Math.PI * 1.2,
						endAngle: Math.PI *1.6
					};
					var dis = d.radius/15;
					var outRadius = d.radius+dis;
					var innerRadius = d.radius-dis;
					var data_arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outRadius);
					return data_arc(data_nodeArc);
			})
			.attr('fill', 'rgb(14,202,200)').attr('stroke','rgb(14,202,200)');
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
			.attr("dy", ".6em")
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
			})
			.transition()
			.filter(function(d,i){
				var txt = d.context;
				var txtWidth =txt.length;
				return txtWidth>3;
			})
			
			.attr('x',function(d,i){
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
}