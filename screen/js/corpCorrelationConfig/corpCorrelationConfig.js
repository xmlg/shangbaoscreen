function App() {
	var self = this;
	this.data = [];
	this.requestData();
	this.markSortFlag = 1; //0 不排序 ,1,2;
	this.subSortType = 3; //0,1,2,3,4;//0:无，1:sid 2:title 3:time
	this.subSortFlag = 0; //0,1;

	this.pageSize = 10;
	this.pageIndex = 0;
	d3.select('.prePage').on('click', function() {
		if (self.pageIndex > 0) {
			self.pageIndex--;
			self.render();
		}
	});
	d3.select('.nextPage').on('click', function() {
		if (self.pageIndex < self.data.length - 1) {
			self.pageIndex++;
			self.render();
		}
	})
}

App.prototype.getSortData = function() {
	var self = this;
	if (!this.data) {
		return [];
	}
	var sortData = this.data.sort(function(a, b) {
		var mb = Number(b.MARK);
		var ma = Number(a.MARK);
		if (ma !== mb && self.markSortFlag) {
			return -(Number(b.MARK) - Number(a.MARK)) * Math.pow(-1, self.markSortFlag);
		} else {
			if (self.subSortType === 1) {
				return -1 * b.SID.localeCompare(a.SID) * Math.pow(-1, self.subSortFlag);
			}
			if (self.subSortType === 2) {
				return -1 * b.URLTITLE.localeCompare(a.URLTITLE) * Math.pow(-1, self.subSortFlag);
			}
			if (self.subSortType === 3) {
				return (new Date(b.URLTIME).getTime() - new Date(a.URLTIME).getTime()) * Math.pow(-1, self.subSortFlag);
			}
			return b._i - a._i;
		}
	});
	return sortData;
}

App.prototype.getData = function() {
	var sortData = this.getSortData();
	return sortData.slice(this.pageIndex * this.pageSize, Math.min(this.pageIndex * this.pageSize + this.pageSize, sortData.length));
}

App.prototype.getTopsData = function() {
	var topsData = this.getSortData().filter(function(d, i) {
		return d.MARK === '1';
	});
	return topsData;
}

App.prototype.checkTopsData = function() {
	return this.getTopsData().length < 7;
}

App.prototype.requestData = function() {
	$('div.load').show();
	var self = this;
	var url = serverDomain + '/screen/CorpCorrelation/getCorpCorrelation/';
	d3.json(url, function(error, data) {
		$('div.load').hide();
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			return;
		}
		var top = data.top || [];
		var bottom = data.bottom || [];
		var all = top.concat(bottom);
		self.data = all;
		console.log(all);
		all.forEach(function(d, i) {
			d._i = i;
		})
		self.render();
	});
}
App.prototype.sendData = function() {
	$('div.load').show();
	var self = this;
	var url = serverDomain + '/screen/CorpCorrelation/setMark';
	var query = '?s_id=';
	var topData = app.getTopsData();
	topData.forEach(function(d, i) {
		if (i !== topData.length - 1) {
			query += d.SID + ';';
		} else {
			query += d.SID;
		}
	});

	d3.json(url + query, function(error, data) {
		$('div.load').hide();
		if (error) {
			console.warn('error:');
			console.warn(error);
			return;
		}
		self.requestData();
	});
}

App.prototype.render = function() {
	this.renderPageNumber();
	this.renderTable();
	this.renderTh();
	this.renderTops();
	this.renderTopsModal();

}
App.prototype.renderPageNumber = function() {
	var self = this;
	var maxPageIndex = this.maxPageIndex = Math.ceil(this.data.length / this.pageSize);
	var pageIndexRange = d3.range(1, maxPageIndex + 1);
	var pagination = d3.select('.pagination');

	pagination.selectAll('li.page-number').remove();
	var enter = pagination.selectAll('li.page-number').data(pageIndexRange).enter();
	enter.insert('li', '.inster-befor')
		.classed('page-number', true)
		.classed('active', function(d, i) {
			return (d - 1) === self.pageIndex;
		})
		.append('a')
		.attr('href', '#')
		.text(function(d, i) {
			return d;
		})
		.on('click', function(d, i) {
			self.pageIndex = d - 1;
			self.render();
		})

}
App.prototype.renderTh = function() {
	var self = this;
	var tbody = d3.select('tbody');

	d3.select('.sid-th .sort-mark').text(function() {
		if (self.subSortType === 1) {
			if (self.subSortFlag) {
				return '▼';
			} else {
				return '▲';
			}
		} else {
			return '';
		}
	});

	d3.select('.title-th .sort-mark').text(function() {
		if (self.subSortType === 2) {
			if (self.subSortFlag) {
				return '▼';
			} else {
				return '▲';
			}
		} else {
			return '';
		}
	});

	d3.select('.time-th .sort-mark').text(function() {
		if (self.subSortType === 3) {
			if (self.subSortFlag) {
				return '▼';
			} else {
				return '▲';
			}
		} else {
			return '';
		}
	});

	d3.select('.button-th .sort-mark').text(function() {
		if (self.markSortFlag === 1) {
			return '▲';
		} else if (self.markSortFlag === 2) {
			return '▼';
		} else {
			return '';
		};
	});
}
App.prototype.renderTable = function() {
	var self = this;
	var tbody = d3.select('tbody');

	var update = tbody.selectAll('tr').data(self.getData(), function(d, i) {
		return d.SID;
	});
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('tr').each(function(d, i) {
		var tr = d3.select(this);

		var index = tr.append('th').classed('INDEX', true)
			.classed('text-center', true);
		var sid = tr.append('td').classed('SID', true);
		var title = tr.append('td').classed('URLTITLE', true);
		var time = tr.append('td').classed('URLTIME', true);
		var button = tr.append('td').classed('BUTTON', true)
			.classed('text-center', true)
			.append('button')
			.attr('type', 'button')
			.classed('btn', true);
	});
	update.each(function(d, i) {
		var tr = d3.select(this);

		var index = tr.select('.INDEX', true);
		var sid = tr.select('.SID', true);
		var title = tr.select('.URLTITLE', true);
		var time = tr.select('.URLTIME', true);
		var button = tr.select('button', true)

		index.text(i + 1 + self.pageIndex * self.pageSize);
		sid.text(d.SID);
		title.text(d.URLTITLE);
		time.text(d.URLTIME);
		button.text(d.MARK === '1' ? '取消置顶' : '置顶');

		tr.classed('success', d.MARK === '1' ? true : false);

		button
			.classed('btn-default', d.MARK === '1' ? false : true)
			.classed('btn-success', d.MARK === '1' ? true : false);

		var circle = title.append('div')
			.classed('circle', true);

		circle.attr('title', d.URLTITLE);

		button.on('click', function(d, i) {
			if (d.MARK === '1') {
				d.MARK = '0';
				self.render();
			} else {
				if (self.checkTopsData()) {
					d.MARK = '1';
					self.render();
				} else {
					alert('已达到最大置顶数');
				}
			}
		});

	}).order();
}
App.prototype.renderTops = function() {
	var self = this;
	var l = self.getTopsData().length;
	var progressBar = d3.select('.progress-bar');

	progressBar.style('width', 100 * l / 7 + '%');
	if (l > 0) {
		progressBar.text(l + '/7');
	} else {
		progressBar.text('');
	}
}
App.prototype.renderTopsModal = function() {
	var self = this;
	var topsList = d3.select('.tops-list');
	var data = self.getTopsData();
	var update = topsList.selectAll('li').data(data,function(d,i){
		return d.SID;
	});
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('li')
		.attr('class', 'list-group-item list-group-item-success').each(function(d, i) {
			var li = d3.select(this);
			li.append('button')
				.attr({
					type: 'button',
					class: 'close'
				})
				.append('span')
				.text('×');
			li.append('p').attr('class', 'list-group-item-text title');
			li.append('p').attr('class', 'list-group-item-text text-right time');
		});
	update.each(function(d, i) {
		var li = d3.select(this);
		var button = li.select('button');
		var title = li.select('p.title');
		var time = li.select('p.time');
		
		button.on('click',function(d,i){
			d.MARK = '0';
			self.render();
		});
		title.text(d.URLTITLE);
		time.text('——' + d.URLTIME);
	});
}

var app = new App();

$('.sid-th').click(function() {
	if (app.subSortType !== 1) {
		app.subSortType = 1;
		app.subSortFlag = 0;
	} else {
		app.subSortFlag++;
		if (app.subSortFlag === 2) {
			app.subSortType = 0;
			app.subSortFlag = 0;
		}
	}
	app.render();
});

$('.title-th').click(function() {
	if (app.subSortType !== 2) {
		app.subSortType = 2;
		app.subSortFlag = 0;
	} else {
		app.subSortFlag++;
		if (app.subSortFlag === 2) {
			app.subSortType = 0;
			app.subSortFlag = 0;
		}
	}
	app.render();
});

$('.time-th').click(function() {
	if (app.subSortType !== 3) {
		app.subSortType = 3;
		app.subSortFlag = 0;
	} else {
		app.subSortFlag++;
		if (app.subSortFlag === 2) {
			app.subSortType = 0;
			app.subSortFlag = 0;
		}
	}
	app.render();
});

$('.button-th').click(function() {
	app.markSortFlag++;
	if (app.markSortFlag > 1) {
		app.markSortFlag = 0;
	}
	app.render();
});

$('.send-data').click(function() {
	app.sendData();
});

//$('#topsModal').show();