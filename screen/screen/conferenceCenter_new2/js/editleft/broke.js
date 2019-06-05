(function() {
	function App() {
		var self = this;

	};
	App.prototype.start = function() {
		App.prototype.getBrokeData();

	};
	App.prototype.getBrokeData = function() {
		$.get('baoliaoxinxi.json', function(data) {

			if($.isEmptyObject(data) == true) {
				alert('暂无数据')
			} else {
				var dataLength = data.length;
				var n = 2;
				if(dataLength >= 3) {
					//self.dat = data.item;
					self.dat = data;
					App.prototype.appendItem(self.dat[0]);
					App.prototype.appendItem(self.dat[1]);
					App.prototype.appendItem(self.dat[2]);

					var setinter = window.setInterval(function() {
						if(n < dataLength - 1) {
							n++
							App.prototype.appendItem(self.dat[n]);
							App.prototype.DoMove('content');

						} else {
							n = -1;
							App.prototype.getBrokeData();
						}
					}, 5000000)
				}
				if(dataLength < 3 && dataLength > 1) {
					App.prototype.appendItem(self.dat[0]);
					App.prototype.appendItem(self.dat[1]);
				}
				if(dataLength == 1) {
					App.prototype.appendItem(self.dat[0]);
				}

			}

		})

	};
	App.prototype.DoMove = function(ele) {
		var ele = $('#' + ele)
		var item0 = ele.children()[0];
		$(item0).animate({
			'margin-top': "-168px"
		}, {
			duration: 3000,
			queue: false,
			complete: function() {
				$(item0).remove();
			}
		})
	}
	App.prototype.appendItem = function(data) {
		var content = $('#content').append(
			"<div class='item'><div class='item_id'>" + 96068 + "</div><div class='item_content'><div class='item_details'><span class='item_time'>" + data.TIME + "</span><span class='item_data'></span><span class='item_name'>" + data.NAME + "</span><span class='item_phone'>" + data.PHONE + "</span><span class='item_from'>" + data.CODE+ "</span></div><div class='item_text'>" + data.CONTENT + "</div></div></div>");
	}
	
	var app = new App();
	app.start();
})()