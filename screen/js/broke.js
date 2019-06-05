(function() {
	function App() {
		var self = this;
//		var srterval = window.setInterval(function(){
//			window.location.reload()
//		},160*1000)
	};
	App.prototype.start = function() {
		App.prototype.getBrokeData();

	};
	App.prototype.getBrokeData = function() {
		$.get('/isearch/front/storme_news.jhtml?pageSize=50&day='+new Date().getDate(), function(data) {
			//var data = JSON.parse(data);
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
							//n = -1;
							window.location.reload()
							//App.prototype.getBrokeData();
						}
					}, 15000)
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
			'margin-top': "-250px"
		}, {
			duration: 3000,
			queue: false,
			complete: function() {
				$(item0).remove();
			}
		})
	}
	App.prototype.appendItem = function(data) {
		var CONTENT =data.content;
		if (CONTENT.length>145) {
			CONTENT= CONTENT.substring(0,144)+'...';
		}
		var date = new Date();  
		date.setTime(Number(data.time));  
		data.time = date.Format("yyyy-MM-dd HH:mm:ss");  

		var content = $('#content').append(
			"<div class='item'><div class='item_id'>" + data.source + "</div><div class='item_content'><div class='item_details'><span class='item_time'>" + data.time + "</span><span class='item_data'></span><span class='item_name'>" + data.title + "</span><span class='item_phone'>" + data.name + "</span>" +
			// "<span class='item_from'>" + data.code+ "</span>" +
			"</div><div class='item_text'>" + CONTENT + "</div></div></div>");
	}
	App.prototype.nextFouse = function() {

	}
	Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {  
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "H+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };  
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
        for (var k in o)  
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
        return fmt;  
    }  
	var app = new App();
	app.start();
})()