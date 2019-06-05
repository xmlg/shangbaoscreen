define(function(require) {
	var BorderType1 = require('components/BorderType1');
	var dataManager = require('tool/dataManager');
	var util = require('tool/util');

	function OfficalWeiBo(parent, w, h) {
		var self = this;
		BorderType1.call(this, parent, w, h);

		//      self.newsIndex = 0;
		//      self.newsList = util.clone(dataManager.getData().OFFICALWEIBO.WEIBOMESS);
		//
		//      self.policyIndex = 0;
		//      self.policyList = util.clone(dataManager.getData().OFFICALWEIBO.POLICYS);

		//微博
		self.newsG = self.snapElement.g().attr({
			opacity: 0
		});
		self.newsPath1 = self.newsG.path('M-115 -115  112 -115 125 -102 125 25 -115 25 Z');
		self.newsPath2 = self.newsG.path('M-115 -95  125 -95');

		self.newsTitle = self.newsG.text(0, 2, '').attr({
			fill: '#9BD4D7',
			fontFamily: 'SimHei',
			letterSpacing: '2.5px',
			fontSize: '14px',
			transform: 'matrix(1, 0, 0, 1, -105, -102)'
		});

		self.newsTime1 = self.newsG.text(-100, 7, '').attr({
			fill: '#9BD4D7',
			fontFamily: 'SimHei',
			fontSize: '12px'
		});
		self.newsTime2 = self.newsG.text(110, 7, '').attr({
			fill: '#9BD4D7',
			fontFamily: 'SimHei',
			fontSize: '12px',
			textAnchor: 'end'
		});

		var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
		var $foreignObject = $(foreignObject);
		self.newsG.append(foreignObject);
		var foreignObject = self.newsG.select('foreignObject');
		var $div = $('<div></div>');
		$div.css({
			margin: '0px',
			height: '170%',
			width: '100%',
			overflow: 'hidden',
			'font-size': '16px',
			'line-height': '24px',
			color: '#FFFFFF',
			textIndent: '2em',
			border: 'solid 1px #0d7e9e',
			padding: '5px'
		});
		$foreignObject.append($div);
		self.newsForeignObject = foreignObject;
		foreignObject.attr({
			width: '231px',
			height: '110px',
			x: -110,
			y: -50
		});
	}
	var getWBdata = function() {
		$.ajax({
			type: "get",
			url: "/screen/reporttrack/jsonreporttrack",
			async: true,
			success: function(data) {
				var boarddiv = "<div id='Alldiv' style='width:258px;height:260px;z-index:999;position:absolute;left:657px;top:-43px;margin-top:100px;'>";
				boarddiv += "<div id='divlist1' ></div><div class='divList'><img src='' class='CJ'><span class='rwjl'>任务已新建</span></div><div id='ZX' class='divList'><img class='imga' src=''/><span id='zxz'>撰写中</span></div><div id='GXQ' class='divList'><img class='GXQ' src=''/><span class='GXQ_text'>共享前审批</span></div><div id='GX' class='divList'><img class='GX' src=''/><span class='GX_text'>已共享</span></div><div id='QY' class='divList'><img class='CG' src=''/><span class='CG_text'>已传稿</span></div><div id='DS' class='divList'><img class='DS' src=''/><span class='DS_text'>待审</span></div><div id='YQ' class='divList'><img class='YQ' src=''/><span class='YQ_text'>已签</span></div></div>"
				$(document.body).append(boarddiv);
				//头部开始
				var divlist1 = $('#divlist1');
				divlist1.css({
						'margin-left': '20px',
						'height': '36px',
						'width': '218px',
						'font-size': '22px',
						'text-align': 'center',
						'line-height': '34px'

					})
					//头部结束
				var divlist = $('.divList')
				divlist.css({
					'float': 'left',
					'margin-left': '115px',
					'width': '55%',
					'font-size': '20px',
					'margin-top': '5px',
					'height': '25px',
					'color': 'white'
				});
				setTimeout(function() {
					$('#Alldiv').animate({
						'opacity': 1,
					})
				}, 5000)
				data = JSON.parse(data);
				var wb_data = data.Data;
				if($.isEmptyObject(wb_data) == false) {

					var n = 0
					window.setInterval(function() {
						++n;
						n = n < wb_data.length ? n : 0;
						get_wbdata(n, wb_data);
					}, 10 * 1000)
				} else {}

			}

		});
	}

	function get_wbdata(n, wb_data) {

		var gj_data = wb_data[n];
		var metastatus = [];
		var title = gj_data[0].TITLE;
		$('#divlist1').text(title);
		$.each(gj_data, function(i) {
			metastatus.push(gj_data[i].OPERATION);
		});
		drawList(metastatus);

	}

	function drawList(metastatus) {

		var img_path = '../CentralKitchenV0.04/img/GJ_IMG.png';
		var img_gj = $('.imga')
		var qy = $('.CG');
		var gx = $('.GX');
		var gxq = $('.GXQ');
		var ds = $('.DS');
		var yq = $('.YQ');
		var cj = $('.CJ')
			//var cj_text = $('.rwjl');
		if(metastatus.indexOf("新建") != -1) {
		
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})

			cj.attr('src', '');
			img_gj.attr('src', img_path);
			qy.attr('src', '');
			gx.attr('src', '');
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', '');
			img_gj.css({
				'margin-left': '-50px'
			})
			$('#zxz').css({
				'margin-left': '30px'
			})

		}
		if(metastatus.indexOf("传稿") != -1||metastatus.indexOf("提交") != -1) {
		
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', '');
			gx.attr('src', '');
			gxq.attr('src', img_path);
			ds.attr('src', '');
			yq.attr('src', '');
			gxq.css({
				'margin-left': '-50px'
			})
			$('.GXQ_text').css({
				'margin-left': '30px'
			})
		}

		if(metastatus.indexOf("共享") != -1) {
			
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', '');
			gx.attr('src', img_path);
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', '');
			gx.css({
				'margin-left': '-50px'
			})
			$('.GX_text').css({
				'margin-left': '30px'
			})
		}
		if(metastatus.indexOf("取稿") != -1||metastatus.indexOf("待编") != -1) {
				
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', img_path);
			gx.attr('src', '');
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', '');
			qy.css({
				'margin-left': '-50px'
			})
			$('.CG_text').css({
				'margin-left': '30px'
			})
		}
		if(metastatus.indexOf("退稿") != -1) {
			
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', '');
			gx.attr('src', img_path);
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', '');
			gx.css({
				'margin-left': '-50px'
			})
			$('.GX_text').css({
				'margin-left': '30px'
			})
		}
		if(metastatus.indexOf("待审") != -1||metastatus.indexOf("上版") != -1) {
						
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', '');
			gx.attr('src', '');
			gxq.attr('src', '');
			ds.attr('src', img_path);
			yq.attr('src', '');
			ds.css({
				'margin-left': '-50px'
			})
			$('.DS_text').css({
				'margin-left': '30px'
			})
		}
		if(metastatus.indexOf("撤稿") != -1) {
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', img_path);
			gx.attr('src', '');
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', '');
			qy.css({
				'margin-left': '-50px'
			})
			$('.CG_text').css({
				'margin-left': '30px'
			})
		}
		if(metastatus.indexOf("签发") != -1||metastatus.indexOf("签发照排") != -1) {
			$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', '');
			gx.attr('src', '');
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', img_path);
			yq.css({
				'margin-left': '-50px'
			})
			$('.YQ_text').css({
				'margin-left': '30px'
			})
		}
		
		if(metastatus.indexOf("取消签发") != -1) {
				$('#zxz').css({
				'margin-left': '0px'
			})
			$('.CG_text').css({
				'margin-left': '0px'
			})
			$('.DS_text').css({
				'margin-left': '0px'
			})
			$('.YQ_text').css({
				'margin-left': '0px'
			})
			$('.GXQ_text').css({
				'margin-left': '0px'
			})
			$('.GX_text').css({
				'margin-left': '0px'
			})
			$('.rwjl').css({
				'margin-left': '0px'
			})
			cj.attr('src', '');
			img_gj.attr('src', '');
			qy.attr('src', img_path);
			gx.attr('src', '');
			gxq.attr('src', '');
			ds.attr('src', '');
			yq.attr('src', '');
			qy.css({
				'margin-left': '-50px'
			})
			$('.CG_text').css({
				'margin-left': '30px'
			})
		}
//		if(metastatus.indexOf("共享") != -1||metastatus.indexOf("退稿") != -1) {
//			$('.GXQ_text').css({
//				'margin-left': '0px'
//			})
//			$('.GX_text').css({
//				'margin-left': '0px'
//			})
//			gxq.attr('src', '');
//			gx.attr('src', img_path);
//			gx.css({
//				'margin-left': '-50px'
//			});
//			$('.GX_text').css({
//				'margin-left': '30px'
//			});
//		}


	}

	getWBdata();
	OfficalWeiBo.prototype = Object.create(BorderType1.prototype);
	OfficalWeiBo.constructor = OfficalWeiBo;
	OfficalWeiBo.prototype.init = function() {
		var self = this;
		BorderType1.prototype.init.call(this, function() {
			self.setTitle('选题任务追踪');
			self.startTimeTask();
		});
	};

	OfficalWeiBo.prototype.update = function() {
		var self = this;
		//getWBdata();
		//self.newsList = util.clone(dataManager.getData().OFFICALWEIBO.WEIBOMESS);
	}
	OfficalWeiBo.prototype.startTimeTask = function() {
		var self = this;

		function timeTask() {
			
		}
		timeTask();
		window.setInterval(timeTask, 30 * 1000);
		
		
	}
	return OfficalWeiBo;
});