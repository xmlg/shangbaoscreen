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
		var id = getUrlParams("id");
		var scene_level = getUrlParams("scene_level");
		var myDate = new Date();
		var today = myDate.format("yyyy-MM-dd");
		$.get('/isearch/front/search.jhtml?code=551b1ff558194a0eb61d171ef40f3085&pageNumber=1&pageSize=10&searchWord=&type=39,35&&fastTime='+today+',&dayOrder=desc', function(data) {
		//$.get('new_file.json', function(data) {
			if($.isEmptyObject(data) == true) {
				
			} else {
                console.log(data);
                self.dat = data.page.content;
				//self.dat = JSON.parse(data);
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
		});
		/**
		 * [getUrlParams description] 获取路由参数
		 * @param  {[type]} params [description] 要获取的参数名
		 * @return {[type]}        [description]
		 */
		function getUrlParams(params) {
		    var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
		    var paramsData = window.location.search.substr(1).match(reg);
		    return !!paramsData ? paramsData[2] : "0";
		}
	}
	App.prototype.appendList = function(data) {
		var main_child = $('.main_child');
		var data_text = data.content?data.content: 'null';
		if (data_text.length>70) {
			data_text = data_text.substring (0,67)+"...";
		};
		var date = new Date();  
		date.setTime(Number(data.date));  
		data.date = date.Format("yyyy-MM-dd HH:mm:ss");
        console.log(data_text);
        main_child.append("<div class='item'><div class='item_name'><span class='item_from'>" + data.title + "</span><span class='item_time'>   " + data.date + "</span></div><div class='item_main'>" + data_text  + "</div></div>")
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
			return  'images/xhs.jpg';
		}else if (val.indexOf('新浪')!=-1){
			return 'images/xl.png';
		}else if (val.indexOf('城市通')!=-1){
			return 'images/cst.png';
		}else if (val.indexOf('爱湖州')!=-1){
			return 'images/ahz.png';
		}else if (val.indexOf('甬派')!=-1){
			return 'images/yp.png';
		}else if (val.indexOf('澎湃')!=-1){
			return 'images/PP.png';
		}else if (val.indexOf('浙江新闻')!=-1){
			return 'images/zjxw.jpg';
		}else if (val.indexOf('读创文本库')!=-1){
			return 'images/duchuang.png';
		}else if (val.indexOf('读特文本库')!=-1){
			return 'images/dute.jpg';
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
    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
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