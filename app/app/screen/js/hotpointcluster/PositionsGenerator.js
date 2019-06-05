function Group(x, y) {
	this.x = x;
	this.y = y;
}

function Cell(x, y, w, h, group) {
	this.name = 'cell' + w + h;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.group = group;
}

function PositionsGenerator(dx, dy) {
	var groups = [];
	var cells = [];

	groups[0] = new Group();
	groups[1] = new Group();
	groups[2] = new Group();
	groups[3] = new Group();
	groups[4] = new Group();
	groups[5] = new Group();
	groups[6] = new Group();
	groups[7] = new Group();

	cells[0] = new Cell(0, 0, 2, 2, groups[0]);
	cells[1] = new Cell(0, 0, 2, 2, groups[1]);

	cells[2] = new Cell(0, 0, 2, 1, groups[2]);
	cells[3] = new Cell(0, 1, 2, 1, groups[2]);

	cells[4] = new Cell(0, 0, 2, 1, groups[3]);
	cells[5] = new Cell(0, 1, 2, 1, groups[3]);

	cells[6] = new Cell(0, 0, 2, 1, groups[4]);
	cells[7] = new Cell(0, 1, 1, 1, groups[4]);
	cells[8] = new Cell(1, 1, 1, 1, groups[4]);

	cells[9] = new Cell(0, 1, 2, 1, groups[5]);
	cells[10] = new Cell(0, 0, 1, 1, groups[5]);
	cells[11] = new Cell(1, 0, 1, 1, groups[5]);

	cells[12] = new Cell(0, 0, 1, 1, groups[6]);
	cells[13] = new Cell(1, 0, 1, 1, groups[6]);
	cells[14] = new Cell(0, 1, 1, 1, groups[6]);
	cells[15] = new Cell(1, 1, 1, 1, groups[6]);

	cells[16] = new Cell(0, 0, 1, 1, groups[7]);
	cells[17] = new Cell(1, 0, 1, 1, groups[7]);
	cells[18] = new Cell(0, 1, 1, 1, groups[7]);
	cells[19] = new Cell(1, 1, 1, 1, groups[7]);

	function shuffle(o) { //v1.0
		for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	};

	function resetGroupPositions() {
		var groupPositions = [{
			x: 0,
			y: 0
		}, {
			x: 1,
			y: 0
		}, {
			x: 2,
			y: 0
		}, {
			x: 3,
			y: 0
		}, {
			x: 0,
			y: 1
		}, {
			x: 1,
			y: 1
		}, {
			x: 2,
			y: 1
		}, {
			x: 3,
			y: 1
		}];
		shuffle(groupPositions);
		//shuffle(cells)
		groups.forEach(function(d, i) {
			d.x = groupPositions[i].x;
			d.y = groupPositions[i].y;
		})
	};
	resetGroupPositions();

	function getCellInfo(index) {
		var cell = cells[index];
		return {
			className: cell.name,
			x: (cell.x + cell.group.x * 2) * dx,
			y: (cell.y + cell.group.y * 2) * dy,
			w: cell.w * dx - 3,
			h: cell.h * dy - 3
		}
	}
	this.resetGroupPositions = resetGroupPositions;
	this.getCellInfo = getCellInfo;
}

var positionsGenerator = new PositionsGenerator(1890 / 8, 862 / 4);