function App() {
	var self = this;
	window.microList = {};
	this.body = d3.select('body');
	this.requestJson();
	this.startTimingTask();
}

App.prototype.startTimingTask = function() {
	var self = this;
	var interval = window.setInterval(function() {
		self.requestJson();
	}, 60 * 60 * 1000);
};

App.prototype.requestJson = function() {
	var self = this;
	var url = '/wcm/bigdata.do?modelid=getWeibohotpoint&user_id=admin&department=140518&serviceid=weibohotpointmgr';
	d3.json(url, function(error, data) {
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			return;
		}
		microList.microList = data.DATA;
		self.convertData(data.DATA);
	});
};

App.prototype.toggleLists = function(){
	var self =this;
	microList.micros = [];

	for(var i in microList.microList){
		var item = {};
			item.id = microList.microList[i].id;
			item.eventname = microList.microList[i].eventname;
			item.title = microList.microList[i].eventname;
			item.eventId = microList.microList[i].eventId;
		microList.micros.push(item);
	}
	microList.n = [].concat(microList.micros);
//console.log(microList.micros)
//	console.log(microList.n)

	microList.microInter = setInterval(function(){
		if(microList.n.length == 0){
			microList.n = [].concat(microList.micros);
		}
		var f = microList.n.shift();
		self.getLists(f.id,f.eventname, f.title, f.eventId)
	},1000 * 30)


};
App.prototype.getLists = function(id,keywords,hotname,eventId,listBool){
	var listB = listBool||false;
	var list = $('.micro-list'),
		microC = $('.micro-item-content'),
		microAll =  $('micro-all-list'),
		keywords = keywords;
		microC.empty();
		self = this;
	//console.log(keywords)
	d3.select('.micro-content .head-title').text(hotname);
	var keyword = keywords.split(';');
	if(listB == false){
		list.css('width','360px');
		microAll.empty();
		console.log('false in ');
		$(".micro-item-content-tabel-tbody").empty();
		microAll.css('display','none');
		list.css('right','-900px');
		list.css('opacity','0');
		$(".microlist-item-content").css('display','none');
		$(".head-title").css('display','none');
		setTimeout(function(){
			list.css('right','3px');
			list.css('opacity','1');
		},500)
	}else if(listB == true){
		$(".microlist-item-content").css('display','block');
		$(".head-title").css('display','block');
		list.css('width','850px');
		microAll.css('display','block');
	}




	var url = '/wcm/bigdata.do?modelid=getWeibohotmessagebyevent&user_id=admin&department=140518&serviceid=weibohotpointmgr&id='+eventId+'&batch='+id+'&typeid=widget';
	var autohorUrl = '/wcm/bigdata.do?modelid=weibohoteventstatistics&user_id=admin&department=140518&serviceid=weibohotpointmgr&id='+eventId+'&batch='+id+'&typeid=widget';
	d3.json(url,function(error,data){
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			return;
		}
		//console.log(data)
		var list = data.PAGEITEMS;

		var html = '';
		for(var i = 0;i< list.length;i++){
			var contents = list[i].WEIBOCONTENT;
			//console.log(contents);
			for(var j = 0;j<keyword.length;j++){
				//console.log(keyword[j])
				var item = keyword[j];
				rep(item);
			}
			function rep(q){
				contents = contents.replace(q,'<font style="color:red">'+q+'</font>');
			}
			function formatDate(now) {
				var year=now.getFullYear();
				var month=now.getMonth()+1;
				var date=now.getDate();
				var hour=now.getHours();
				var minute=now.getMinutes();
				var second=now.getSeconds();
				return year+"-"+month+"-"+date+" "+hour+":"+minute;
			}
			html+='<div class="item">' +
					'<div class="title">' +
						'<span>'+list[i].WEIBOAUTHOR +'</span>'+
				        '<span>'+formatDate(new Date(list[i].URLTIME))+'</span>'+
						'<span><a href="'+list[i].URLNAME+'" target="_blank">查看原文</a></span>'+
						'</div>'+
						'<div class="content">'+contents+'</div>' +
			    	'</div>'
					}
		microC.append(html);
	});

	d3.json(autohorUrl,function(error,data){
		if (error || $.isEmptyObject(data) == true) {
			console.warn('error:');
			console.warn(error);
			return;
		}
		//var topauthors = "央视新闻,48;新华网,12;千钧客,6;其他,34";
		//var rttauthors = "近代史,13;观察者网,10;三联生活周刊,8;其他,69";
		var list1 = data[0];
		var list2 = data[1];
		if ($.isEmptyObject(list2) == true) {
			$(".rttauthors").hide();
		}else{
			$(".rttauthors").show();
		}

		var topauthors = '';
		var rttauthors = '';
		var sum1 = 0;
		var sum2 = 0;
		for(var key in list1){
			var t = Math.floor( Number(list1[key]*100));
			sum1 += t ;
			topauthors+=key+','+ t+";"
		}

		for(var key in list2){
			var t = Math.floor( Number(list2[key]*100));
			sum2 += t ;
			rttauthors+=key+','+ t+";"
		}
		if(sum1 ==100){
			topauthors = topauthors.substring(0,(topauthors.length-1));
		}else{
			topauthors = topauthors +"其他,"+(100-sum1)+"";
		}
		if(sum2 == 100){
			rttauthors = rttauthors.substring(0,(rttauthors.length-1));
		}else{
			rttauthors = rttauthors +"其他,"+(100-sum2)+"";
		}
		//console.log(sum1)
		//console.log(sum2)
		//console.log(topauthors)
		//console.log(rttauthors)
		self.doauthors('原创博主及百分比<br/>', topauthors, 'div_topauthors');
		self.doauthors('转发博主及百分比<br/>', rttauthors, 'div_rttauthors');
	})

};
App.prototype.convertData = function(data){
	var lists1 =[],
		lists2 =[],
	    lists3 =[],
	    lists4 =[],
		self =this;
	window.num = 1;


	for(var i in data){
		var item = {};
		item.KEYWORDS = data[i].keywords;
		item.EVENTNAME = data[i].eventname;
		item.WEIGHTVALUE = data[i].weightvalue;
		item.id = data[i].id;
		item.eventId = data[i].event_id;
		if(0<=i&i<=4) {
			lists1.push(item);
		}else if(4<i&i<=9){
			lists2.push(item)
		}else if(9<i&i<=14){
			lists3.push(item)
		}else if(14<i&i<20){
			lists4.push(item)
		}

	}
	//console.log(data)
	//console.log(lists1)
	//console.log(lists2)
	//console.log(lists3)
	//console.log(lists4)
	self.render(lists1);
	$(".toggle-micro-list span").eq(num-1).addClass('itemActive').siblings().removeClass('itemActive');
	//self.toggleLists()    自动显示右侧下钻分析列表,暂时关闭
	setInterval(function(){
		num++;
		if(num ==2) self.render(lists2);
		if(num ==3) self.render(lists3);
		if(num ==4) self.render(lists4);
		if(num>=5) {
			window.num = 1;
			self.render(lists1);
		}
		//console.log(num)
		$(".toggle-micro-list span").eq(num-1).addClass('itemActive').siblings().removeClass('itemActive');
	},1000 * 30);
	$(".toggleMicroList").on('click',function(){
		$(this).addClass('itemActive').siblings().removeClass('itemActive');
		var Tid = $(this).attr("data-id");
		window.num = Tid;
		if(Tid == 0){
			if(num ==2) self.render(lists2);
			if(num ==3) self.render(lists3);
			if(num ==4) self.render(lists4);
			num++;
			if(num>=5) {
				num = 1;
				self.render(lists1);
			}
		}else if(Tid == 1){
			self.render(lists1);
		}else if(Tid == 2){
			self.render(lists2);
		}else if(Tid == 3){
			self.render(lists3);
		}else if(Tid == 4){
			self.render(lists4);
		}

	});
	$(".microblog-hot-list").on('click',function(){
		var tableList = '';
		//console.log(data);
		var fid,fKEYWORDS,fEVENTNAME,feventId;
		for(var j in data){
			fid = data[0].id;
			fKEYWORDS = data[0].keywords;
			fEVENTNAME = data[0].eventname;
			feventId = data[0].event_id;


			//self.getLists(d.id,d.KEYWORDS,d.EVENTNAME,d.eventId);
			tableList+="<div class=\"item-list clear\"  data-id=\""+data[j].id+"\" data-KEYWORDS=\""+data[j].keywords+"\" data-EVENTNAME=\""+data[j].eventname+"\" data-eventId=\""+data[j].event_id+"\">"+
							"<div class=\"titleNum\">"+(Number(j)+1)+"</div>"+
							"<div class=\"title\" title=\""+data[j].eventname+"\">"+data[j].eventname+"</div>"+
						"</div>"
		}
		self.getLists(fid,fKEYWORDS,fEVENTNAME,feventId,true);
		$(".micro-item-content-tabel-tbody").empty();
		$(".micro-item-content-tabel-tbody").append(tableList);
		var list = $('.micro-list');
			list.css('right','-900px');
		list.css('opacity','0');
		setTimeout(function(){
			list.css('right','3px');
			list.css('opacity','1');
		},500);
		$(".micro-item-content-tabel-tbody .item-list").on('click',function(){
			var that = $(this);
			var tid = that.attr('data-id'),
				tKEYWORDS  = that.attr('data-KEYWORDS'),
				tEVENTNAME  = that.attr('data-EVENTNAME'),
				teventId  = that.attr('data-eventId');
			//console.log(tid,tKEYWORDS,tEVENTNAME,teventId);
			self.getLists(tid,tKEYWORDS,tEVENTNAME,teventId,true);

		})
	})



};
App.prototype.render = function(data) {
	//console.log('render:' + JSON.stringify(data));
	this.renderIslandsGroup(data);
};
App.prototype.checkKey = function(id){
	var toopTip = {
			rank:'',
			hotMsg:'',
			keyWord:''
	};
	var	toolContent = '';
//console.log(microList.microList)
	for(var i in microList.microList){
		if(id == microList.microList[i].id){
			toopTip.rank = microList.microList[i].rank;
			toopTip.hotMsg = microList.microList[i].eventname;
			toopTip.keyWord = microList.microList[i].keywords;
		}
	}
	toolContent =   "<p>热点</p>"+
					"<p>NO."+toopTip.rank+"&nbsp;&nbsp;"+ toopTip.hotMsg +"</p>"+
					"<p>关键字</p>"+
					"<p>"+ toopTip.keyWord +"</p>";

	return toolContent;
};

App.prototype.doauthors = function(show_name, _authors, div_name){
	if(_authors != ''){
		document.getElementById(div_name).style.display = 'block';
		var authors = _authors.split(';');



		var legendData = [];
		var seriesData = [];
		for(var i=0;i<authors.length;i++){
			var legendDataArr = authors[i].split(",");

			show_name = show_name + legendDataArr[0] + "：" + legendDataArr[1] + "%<br/>";

			legendData.push(legendDataArr[0]);
			//console.log(legendDataArr)
			var data = {
				name:legendDataArr[0],
				type:'bar',
				stack: '总量',
				itemStyle : {
					normal: {
						label : {
							formatter:"{c}%",
							show: true,
							position: 'inside',
							textStyle:{
								fontSize:12
							}
						}
					}
				},

				data:[legendDataArr[1]]
			};

			seriesData.push(data);
		}

		option = {
			title:{
				text:''
			},
			tooltip : {
				trigger: 'axis',
				formatter: show_name,
				axisPointer : {            // 坐标轴指示器，坐标轴触发有效
					type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
				},
				textStyle:{
					fontSize:12
				}
			},
			legend: {
				//padding:[58,0,0,0],//上下左右
				x:'center',
				y:'bottom',
				bottom:0,
				itemGap:4,
				textStyle:{
					fontSize:12,
					color:'orange'
				},
				data: legendData //['潘石屹', '任志强','头条新闻','其他']
			},
			//坐标轴
			grid:{
				x:'-1',//离左边空格 左上角横坐标(以屏幕左上角为原点)
				y:'0',//离上面空格 左上角纵坐标
				x2:-1,//离右边空格 右下角横坐标（以屏幕右下角为原点）
				y2:'30',//离下面空格 右下角纵坐标
				borderWidth:0,
				borderColor:'none'
			},
			calculable : true,
			xAxis : [
				{
					axisLabel:false,
					axisLine:false,
					splitNumber: 1,
					type : 'value'
				}
			],
			yAxis : [
				{
					axisLabel:false,
					axisLine:false,
					splitNumber: 1,
					type : 'category',
					data : ['']
				}
			],
			series : seriesData
		};
//console.log(seriesData)
		var myCharts = echarts.init(document.getElementById(div_name),theme);//图表
		myCharts.setOption(option, true);
	}else{
		document.getElementById(div_name).style.display = 'none';
		document.getElementById(div_name+"2").style.display = 'none';
	}
};
App.prototype.drawTime = function(maxYValue,xDatas,yDatas){
	var yData = [];//时间轴的标签
	var yDataArr = yDatas.split(",");
	for(var i=0;i<yDataArr.length;i++){
		yData.push(yDataArr[i]);
	}
	var xData = [];//时间轴的标签
	var xDataArr = xDatas.split(",");
	for(var i=0;i<xDataArr.length;i++){
		xData.push(xDataArr[i]);
	}
	option = {
		title : {
			text: ''
		},
		tooltip : {
			trigger: 'axis',
			formatter:"传播时间趋势<br/>时间：{b}<br/>权值：{c}",
			textStyle:{
				fontSize:14
			}

		},
		//坐标轴
		grid:{
			x:'0',//离左边空格 左上角横坐标(以屏幕左上角为原点)
			y:'0',//离上面空格 左上角纵坐标
			x2:'-1',//离右边空格 右下角横坐标（以屏幕右下角为原点）
			y2:'30',//离下面空格 右下角纵坐标
			borderWidth:0,
			borderColor:'#000000'
		},
		legend: {
			x:'center',
			y:'bottom',
			//itemGap:1,
			textStyle:{
				fontSize:12,
				color:'orange'
			},
			data:[]
		},
		calculable : true,
		xAxis : [
			{
				type : 'category',
				power: 1,
				splitNumber: 4,
				splitLine:{
					show: false
				},
				splitArea:{
					show: false
				},
				axisLine:{
					show: false
				},
				axisLabel:{
					interval:xNum,
					textStyle:{
						color:'orange',
						fontSize:'14'
					}
				},

				data : xData//['周一','周二','周三','周四','周五','周六','周日']
			}
		],
		yAxis : [
			{
				type : 'value',
				max: Number(maxYValue) ,
				splitNumber: 1,
				splitLine:{
					show: true
				},
				splitArea:{
					show: false
				},
				axisLine:{
					show: false
				},
				axisLabel : {
					show: false
				}
			}
		],
		series : [
			{
				name:'权值',
				type:'line',
				symbol:'none',
				itemStyle: {
					normal: {
						areaStyle: {
							type: 'default'
						}
					}
				},
				data: yData //[11, 11, 15, 13, 12, 103, 10],
			}
		]
	};
	var myCharts = echarts.init(document.getElementById("showline"),theme);//图表
	myCharts.setOption(option, true);
};
App.prototype.renderIslandsGroup = function(data) {
	var self = this;
	var wrap = this.body.select('.wrap');
	var update = wrap.selectAll('div.islands-group').data(data);
	var enter = update.enter();
	var exit = update.exit();
	var toolTip = d3.select('.toolTip');
	exit.remove();
	enter.append('div').classed('islands-group', true)
		.each(function(d, i) {
			d3.select(this).classed('islands-group' + i, true);
			var content = d3.select(this).append('div').classed('content', true);
			var svg = d3.select(this).append('svg');
			content.text(d.EVENTNAME);
			content.attr('data-id', d.id);
			content.on('mouseenter',function(d,event){
				var top = $(this).offset().top;
				//var left = $(this).offset().left;
				var left = $(this).offset().left;
				var top = $(this).offset().top;
				var width = $(this).width();
				//console.log(top+','+left);
				top = top;
				left = left + width/2 -50;
				var c = self.checkKey(d.id);
				//console.log(c)
				toolTip.html(c);
				clearTimeout(window.microList.setLeave);
				toolTip.style({
					top:top+'px',
					left:left+'px',
					opacity:1
				});
				//toolTip.style({
				//	'top':(d3.event.pageX+30)+"px",
				//	'left':(d3.event.pageY+30)+"px"
				//})
			})
			.on('mouseleave',function(){
				//toolTip.style({
				//	top:0,
				//	left:0,
				//	opacity:0
				//})
				window.microList.setLeave = setTimeout(function(){
					toolTip.style({
						top:0,
						left:0,
						opacity:0
					})
				},400)

			});
			content.on('click',function(d){
				//console.log(d)
				//console.log(d.EVENTNAME+","+ d.id)

				self.getLists(d.id,d.KEYWORDS,d.EVENTNAME,d.eventId);

			});
			content.append('img')
				.attr('src', 'img/underline.png')
				.classed('underline', true);
			self.renderIslands(svg, d);
		});
	update.each(function(d) {
		var content = d3.select(this).select('div.content');
		var svg = d3.select(this).select('svg');
		content.text(d.EVENTNAME);
		content.attr('data-id', d.id);
		content.on('mouseenter',function(d){
			var top = $(this).offset().top;
			var left = $(this).offset().left;
			var width = $(this).width();

			//console.log(width)
			//console.log(top+','+left);
			top = top;
			left = left + width/2 - 50;
			var c = self.checkKey(d.id);
			//console.log(c)
			toolTip.html(c);
			//console.log(top)
			clearTimeout(window.microList.setLeave);
			toolTip.style({
				top:top +'px',
				left:left +'px',
				opacity:1
			})
		}).on('mouseleave',function(){
			//toolTip.style({
			//	top:0,
			//	left:0,
			//	opacity:0
			//})
			window.microList.setLeave = setTimeout(function(){
				toolTip.style({
					top:0,
					left:0,
					opacity:0
				})
			},400)
		});
		content.on('click',function(d){

			//console.log(d)
			//console.log(d.EVENTNAME+","+ d.id)
			//d3.select('.micro-content .head-title').text(d.EVENTNAME)
			self.getLists(d.id,d.KEYWORDS,d.EVENTNAME,d.eventId);
		});
		content.append('img')
			.attr('src', 'img/microline.png')
			.classed('underline', true);
		self.renderIslands(svg, d);
	});
};

App.prototype.renderIslands = function(svg, d) {
	var t = d;
	//console.log(t)
	var self = this;
	svg.selectAll('*').remove();
	var color = d3.scale.category10()
		.domain(d3.range(10));
	var keyword =  d.KEYWORDS.split(';');
	if (keyword.length < 10) {
		for (var i = 0, l = 10 - keyword.length; i < l; i++) {
			keyword.push('');
		}
	}

	var nodes = keyword.map(function(d, i) {
		var node = {};

		var dx = d3.random.normal(0, 60)();//正态分布获取关键字的位置
		node.context = d;
		node.id = t.id;
		node.keywords = d;
		node.eventname = t.EVENTNAME;
		node.eventid = t.eventId;
		node.radius = d !== '' ? 24 * Math.random() + 5 : 10 * Math.random() + 8;
		node.x = 427 / 2 + dx;
		node.y = 284 / 2;
		node.oy = 284 / 2 + Math.pow(-1, i) * (Math.random() * 30  + node.radius / 2);

		return node;
	});
	//添加中心点
	nodes.unshift({
		context: '',
		fixed: true,
		x: 160,
		y: 75,
		oy: 75,
		radius: 40,
		id: d.id,
		keywords: d.KEYWORDS,
		eventname: d.EVENTNAME,
		eventid: d.eventId
	});
	var node = svg.selectAll("g")
		.data(nodes)
		.enter().append("g");

	node
		.append('circle')
		.style("fill", function(d,i){
			return color(i)
		})
		.style("cursor","pointer")
		.on('click',function(d){
			console.log(d);
			self.getLists(d.id,d.keywords,d.eventname,d.eventid);
		})
		.transition()
		.duration(750)
		.delay(function(d, i) {
			return i * 5;
		})
		.attrTween("r", function(d) {
			var i = d3.interpolate(0, d.radius);
			return function(t) {
				return d.radius = i(t);
			};
		})		;
	node.append("text")
		.text(function(d) {
			return d.context;
		})
		.style({
			'font-size': '16px',
			//'text-shadow':'2px 2px 14px #0a0a0a,2px -1px 3px #9e9e9e',
			'font-family':"Microsoft yahei",
			'text-anchor': 'middle',
			'pointer-events': 'none',
			'fill': '#000',
			//'font-weight':'bold'
		})
		.attr("dy", ".45em")
		.transition()
		.duration(750)
		.delay(function(d, i) {
			return i * 5;
		})
		.styleTween("font-size", function(d) {
			var i = d3.interpolate(0, Math.min(2 * d.radius * 0.9, (2 * d.radius * 0.9 - 8) / this.getComputedTextLength() * 16));
			return function(t) {
				return i(t) + 'px';
			}
		});

	var force = d3.layout.force()
		.nodes([])
		.size([])
		.friction(1)
		.gravity(0.00)
		.charge(0)
		.on("tick", tick)
		.start();

	function tick(e) {
		node
			.each(cluster(10 * e.alpha * e.alpha))
			.each(collide(e.alpha))
			.each(function(d) {
				if (d.fixed) {
					d.x = 240;
					d.y = 140;
				}
			})
			.attr("transform", function(d) {
				return "translate(" + d.x + "," + d.y + ")";
			});
	}

	// Move d to be adjacent to the cluster node.
	function cluster(alpha) {
		return function(d) {
			if (d.fixed) {
				return;
			}
			d.y += (d.oy - d.y) * alpha
		};
	}

	var padding = 1.5, // separation between same-color nodes
		clusterPadding = 6, // separation between different-color nodes
		maxRadius = 12;
	// Resolves collisions between d and all other circles.
	function collide(alpha) {
		var quadtree = d3.geom.quadtree(nodes);
		return function(d) {
			var r = d.radius * 1.5 + maxRadius + Math.max(padding, clusterPadding),
				nx1 = d.x - r,
				nx2 = d.x + r,
				ny1 = d.y - r,
				ny2 = d.y + r;
			quadtree.visit(function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== d)) {
					var x = d.x - quad.point.x,
						y = d.y - quad.point.y,
						l = Math.sqrt(x * x + y * y),
						r = d.radius * 1.5 + quad.point.radius * 1.5 + (d.cluster === quad.point.cluster ? padding : clusterPadding);
					if (l < r) {
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
};

var app = new App();