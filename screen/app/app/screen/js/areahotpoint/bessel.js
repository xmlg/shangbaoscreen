function Bessel(p0, p1, p2) {
	this.getPoint = function(t) {
		var r = [0, 0];
		r[0] = Math.pow(1 - t, 2) * p0[0] + 2 * t * (1 - t) * p1[0] + Math.pow(t, 2) * p2[0];
		r[1] = Math.pow(1 - t, 2) * p0[1] + 2 * t * (1 - t) * p1[1] + Math.pow(t, 2) * p2[1];
		return r;
	}
}

function getBesselD(p0, p1, p2) {
	var bessel = new Bessel(p0, p1, p2);
	var d = '';
	for (var i = 0; i <= 100; i++) {
		var point = bessel.getPoint(i / 100);
		if (i == 0) {
			d += 'M' + point[0] + ' ' + point[1] + ' ';
		} else {
			d += 'L' + point[0] + ' ' + point[1] + ' ';
		}
	}
	return d;
}

function getBesselSegmentD(p0, p1, p2, t0, t1, s, b) {
	if(t0 == t1){
		return 'M 0 0 L 0 0 Z';
	}
	var normalX = p1[0] - (p0[0] - p1[0]) / 2;
	var normalY = p1[1] - (p0[1] - p1[1]) / 2;
	var bessel = new Bessel(p0, p1, p2);
	var increment = (t1 - t0) / s;
	var d = '';
	var cd = ' z'
	for (i = t0; i <= t1; i += increment) {
		var h = b * (i - t0) / (t1 - t0);
		var point = bessel.getPoint(i);
		if (i == t0) {
			d += 'M' + point[0] + ' ' + point[1] + ' ';
		} else {
			var prevPoint = bessel.getPoint(i - increment);
			var dx = point[0] - prevPoint[0];
			var dy = point[1] - prevPoint[1];
			if (dy != 0) {
				var s = -dx / dy;

				var ddx = h / Math.pow(1 + s * s, 0.5)
				var ddy = (s * h) / Math.pow(1 + s * s, 0.5)
			} else {
				var ddy = h;
				var ddx = 0;
			}
			if (ddy * normalY + ddx * normalX < 0) {
				ddx = -ddx;
				ddy = -ddy;
			}
			d += 'L' + (point[0] + ddx) + ' ' + (point[1] + ddy) + ' ';
			cd = 'L' + (point[0] - ddx) + ' ' + (point[1] - ddy) + ' ' + cd;
		}
	}
	return d + cd;
}