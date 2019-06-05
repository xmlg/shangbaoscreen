d3.dynamicSymbol = {};
(function() {
	var scale0 = d3.scale.linear().domain([0, 0.1]).range([0, 1]).clamp(true);
	var scale1 = d3.scale.linear().domain([0.1, 0.2]).range([0, 1]).clamp(true);

	var scale2Inner = d3.scale.linear().domain([0.2, 1]).range([0, 1]).clamp(true);
	var ease = d3.ease('elastic', 1, 0.45);

	var scale2 = function(t) {
		return ease(scale2Inner(t));
	}

	d3.dynamicSymbol.mark = function(size, color, t, inner) {
		return function() {
			if (this.classed('mark')) {
				var circle0 = this.select('circle.circle0');
				var circle1 = this.select('circle.circle1');
				var circle2 = this.select('circle.circle2');
				var line0 = this.select('line.line0');
				var line1 = this.select('line.line1');
				var img = this.select('image');
			} else {
				var circle0 = this.append('circle').classed('circle0', true);
				var circle1 = this.append('circle').classed('circle1', true);
				var circle2 = this.append('circle').classed('circle2', true);
				var line0 = this.append('line').classed('line0', true);
				var line1 = this.append('line').classed('line1', true);
				var img = this.append('image').attr('xlink:href', 'img/inner.png');
			}

			line0.attr({
				'x1': size * 0.5 * scale0(t),
				'y1': 0,
				'x2': -size * 0.5 * scale0(t),
				'y2': 0,
				'stroke': color,
				'stroke-width': 2
			})

			line1.attr({
				'x1': 0,
				'y1': size * 0.5 * scale1(t),
				'x2': 0,
				'y2': -size * 0.5 * scale1(t),
				'stroke': color,
				'stroke-width': 2
			})

			circle0.attr({
				'r': size * 0.25 * scale2(t),
				'fill': color
			});
			circle1.attr({
				'r': size * 0.3125 * scale2(t),
				'fill': 'none',
				'stroke': color,
				'stroke-width': 1
			});
			circle2.attr({
				'r': size * 0.375 * scale2(t),
				'fill': 'none',
				'stroke': color,
				'stroke-width': 1
			});
			img.attr({
				x: -size * 0.2 * scale2(t),
				y: -size * 0.2 * scale2(t),
				width: size * 0.4 * scale2(t) + 'px',
				height: size * 0.4 * scale2(t) + 'px'
			});
			if (inner) {
				img.attr('opacity', 1)
			} else {
				img.attr('opacity', 0)
			}
			this.classed('mark', true)
		}
	}
})();
(function() {
	var scale0 = d3.scale.linear().domain([0, 0.1]).range([0, 1]).clamp(true);
	var scale1 = d3.scale.linear().domain([0.1, 0.2]).range([0, 1]).clamp(true);

	var scale2Inner = d3.scale.linear().domain([0.2, 1]).range([0, 1]).clamp(true);
	var ease = d3.ease('elastic', 1, 0.45);

	var scale2 = function(t) {
		return ease(scale2Inner(t));
	}

	d3.dynamicSymbol.mark01 = function(size, color, t, inner) {
		return function() {
			if (this.classed('mark01')) {
				var circle0 = this.select('circle.circle0');
				var circle1 = this.select('circle.circle1');
				var circle2 = this.select('circle.circle2');
				var line0 = this.select('line.line0');
				var line1 = this.select('line.line1');
				var img = this.select('image');
			} else {
				var circle0 = this.append('circle').classed('circle0', true);
				var circle1 = this.append('circle').classed('circle1', true);
				var circle2 = this.append('circle').classed('circle2', true);
				var line0 = this.append('line').classed('line0', true);
				var line1 = this.append('line').classed('line1', true);
				var img = this.append('image').attr('xlink:href', 'img/inner.png');
			}

			line0.attr({
				'x1': size * 0.5 * scale0(t),
				'y1': 0,
				'x2': -size * 0.5 * scale0(t),
				'y2': 0,
				'stroke': color,
				'stroke-width': 2
			})

			line1.attr({
				'x1': 0,
				'y1': size * 0.5 * scale1(t),
				'x2': 0,
				'y2': -size * 0.5 * scale1(t),
				'stroke': color,
				'stroke-width': 2
			})

			circle0.attr({
				'r': size * 0.25 * scale2(t),
				'fill': color
			});
			circle1.attr({
				'r': size * 0.3125 * scale2(t),
				'fill': 'none',
				'stroke': color,
				'stroke-width': 1
			});
			circle2.attr({
				'r': size * 0.375 * scale2(t),
				'fill': 'none',
				'stroke': color,
				'stroke-width': 1
			});
			img.attr({
				x: -size * 0.2 * scale2(t),
				y: -size * 0.2 * scale2(t),
				width: size * 0.4 * scale2(t) + 'px',
				height: size * 0.4 * scale2(t) + 'px'
			});
			if (inner) {
				img.attr('opacity', 1)
			} else {
				img.attr('opacity', 0)
			}
			this.classed('mark01', true)
		}
	}
})();

(function() {
	var scale0 = d3.scale.linear().domain([0, 0.1]).range([0, 1]).clamp(true);
	var scale1 = d3.scale.linear().domain([0.1, 0.2]).range([0, 1]).clamp(true);

	var scale2Inner = d3.scale.linear().domain([0.2, 1]).range([0, 1]).clamp(true);
	var ease = d3.ease('elastic', 1, 0.45);

	var scale2 = function(t) {
		return ease(scale2Inner(t));
	}

	d3.dynamicSymbol.mark02 = function(size, color1, color2, t, inner) {
		return function() {
			if (this.classed('mark02')) {
				var circle0 = this.select('circle.circle0');
				var circle1 = this.select('circle.circle1');
				var circle2 = this.select('circle.circle2');
				var img = this.select('image');
			} else {
				var circle0 = this.append('circle').classed('circle0', true);
				var circle1 = this.append('circle').classed('circle1', true);
				var circle2 = this.append('circle').classed('circle2', true);
				var img = this.append('image').attr('xlink:href', 'img/inner.png');
			}

			circle0.attr({
				'r': size * 0.30 * scale0(t),
				'fill': color1
			});
			circle1.attr({
				'r': size * 0.40 * scale1(t),
				'fill': 'none',
				'stroke': color2,
				'stroke-width': 1
			});
			circle2.attr({
				'r': size * 0.5 * scale2(t),
				'fill': 'none',
				'stroke': color2,
				'stroke-width': 1
			});
			img.attr({
				x: -size * 0.2 * scale2(t),
				y: -size * 0.2 * scale2(t),
				width: size * 0.4 * scale2(t) + 'px',
				height: size * 0.4 * scale2(t) + 'px'
			});
			if (inner) {
				img.attr('opacity', 1)
			} else {
				img.attr('opacity', 0)
			}
			this.classed('mark02', true)
		}
	}
})();