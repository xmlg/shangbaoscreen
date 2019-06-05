(function() {
	function App() {
		var self = this;
		this.rightScroll = 800;
		this.scroll_height = 100;

	}
	App.prototype.start = function() {

		App.prototype.getListData();
		var setinter = window.setInterval(function(){
			$('.main_child').empty();
			App.prototype.getListData();
		},180000)
	}
	App.prototype.getListData = function() {
		$.get('/screen/clientlist/get', function(data) {
		//$.get('new_file.json', function(data) {
			if($.isEmptyObject(data) == true) {
				
			} else {
				//self.dat = data;
				self.dat = JSON.parse(data);
				self.datlength = dat.length;
				if(datlength == 1) {
					App.prototype.appendList(dat[0])
				}
				if(datlength == 2) {
					App.prototype.appendList(dat[0])
					App.prototype.appendList(dat[1])
				}
				if(datlength >= 3) {
					App.prototype.appendList(dat[0])
					App.prototype.appendList(dat[1])
					App.prototype.appendList(dat[2])
					var n = 2,o=-1;
					var setInterr = window.setInterval(function() {
						n++;
						o++;
						if(n < datlength) {
							App.prototype.appendList(dat[n])
						//	App.prototype.scrollMove(datlength,n)
							
							App.prototype.doMove('main_child')
						} else {
							n = -1;
							o=0;
						}
					}, 15000)
				}

			}
		})
	}
	App.prototype.appendList = function(data) {
		var main_child = $('.main_child');
		var data_text = data.TEXT?data.TEXT: 'null';
		if (data_text.length>70) {
			data_text = data_text.substring (0,67)+"...";
		};
		
		main_child.append("<div class='item'><div class='item_name'><span class='item_from'>" + data.FROM + "</span><span class='item_time'>   " + data.TIME + "</span></div><div class='item_logo'><img src="+showImg(data.FROM)+"></div><div class='item_main'>" + data_text  + "</div></div>")
	}
	App.prototype.doMove = function(ele) {
		var ele = $('.' + ele);
		var eleChild = ele.children()[0];
		$(eleChild).animate({
			"margin-top": "-285px"
		}, {
			duration: 3000,
			queue: false,
			complete: function() {
				$(eleChild).remove();
			}
		})
	}
	function showImg(val){
		
		if (val.indexOf('新华社')!=-1){
			return  'img/xhs.jpg';
		}
		if (val.indexOf('新浪')!=-1){
			return 'img/xl.png';
		}
		if (val.indexOf('城市通')!=-1){
			return 'img/cst.png';
		}
		if (val.indexOf('爱湖州')!=-1){
			return 'img/ahz.png';
		}
		if (val.indexOf('甬派')!=-1){
			return 'img/yp.png';
		}
		if (val.indexOf('澎湃')!=-1){
			return 'img/PP.png';
		}
		if (val.indexOf('浙江新闻')!=-1){
			return 'img/zjxw.jpg';
		}
		
		
//		switch(val){
//			case ((val instanceof '新华社')!=-1):
//			return  'img/xhs.jpg';
//			case ((val instanceof '新浪')!=-1):
//			return 'img/xl.png';
//			case ((val instanceof '城市通')!=-1):
//			return 'img/cst.png';
//			case ((val instanceof '爱湖州')!=-1):
//			return 'img/ahz.png'
//		}
	}
	App.prototype.scrollMove = function(eleLength, m) {
		console.log(m);
		var step = 700 / eleLength;
		var scrollChild = $(".scroll_child");
		var scrollChildTop = 187 + m * step;
		scrollChild.animate({
			'top':
			scrollChildTop + 'px'
		}, {
			duration: 3000,
			queue: false,
			complete: function() {

			}
		})
	}
	var app = new App();
	app.start();
})()