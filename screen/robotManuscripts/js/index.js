$(function(){
	// 时间格式化
Date.prototype.Format = function(formatStr){
        var str = formatStr;
        var Week = ['日','一','二','三','四','五','六'];

        str=str.replace(/yyyy|YYYY/,this.getFullYear());
        str=str.replace(/yy|YY/,(this.getYear() % 100)>9?(this.getYear() % 100).toString():'0' + (this.getYear() % 100));

        str=str.replace(/MM/,this.getMonth()>9?this.getMonth().toString():'0' + this.getMonth());
        str=str.replace(/M/g,this.getMonth());

        str=str.replace(/w|W/g,Week[this.getDay()]);

        str=str.replace(/dd|DD/,this.getDate()>9?this.getDate().toString():'0' + this.getDate());
        str=str.replace(/d|D/g,this.getDate());

        str=str.replace(/hh|HH/,this.getHours()>9?this.getHours().toString():'0' + this.getHours());
        str=str.replace(/h|H/g,this.getHours());
        str=str.replace(/mm/,this.getMinutes()>9?this.getMinutes().toString():'0' + this.getMinutes());
        str=str.replace(/m/g,this.getMinutes());

        str=str.replace(/ss|SS/,this.getSeconds()>9?this.getSeconds().toString():'0' + this.getSeconds());
        str=str.replace(/s|S/g,this.getSeconds());

        return str;
    }
    // var date = new Date(); 
    // var now_time = date.Format("hh:mm");
    // var now_date = date.Format("MM月dd日 星期W");
    // $('.now_time').html(now_time);
    // $('.now_date').html(now_date);


	var h = $(window).height();
	var banner_h = $('.banner').height();
	var row_h = h-banner_h;
	$('.summary').height(row_h);
	$('.detail_list').height(row_h);
	$('.detail_info').height(row_h);

	$('.summary a').click(function(e){
		var aitems=$(this).parent().find('a');
		aitems.each(function(){
			var _this=$(this),
				name=_this.find('img').attr('data-val');
			$(this).find('img').eq(0).attr('src','images/'+name+'.png');
			$(this).removeClass('active');
		});
		var img_e = $(this).children("img").get(0);
		var img_url = $(img_e).attr('src');
		var url_name = img_url.substring(7,9);
		var new_img = 'images/'+url_name+'_select.png'
		$(img_e).attr('src',new_img);
		$('#lists').empty();
		$('.detail_list')[0].scrollTop=0;
		$('.detail_info').empty();
		$(this).addClass("active");
		var sum_name = $(this).attr("id");
		select(sum_name);
		e.stopPropagation();
	});

	$('#hasDate').click(function(){
		window.location.reload();
		$('#hasDate').hide();
		$('#static').show();
	});
	$('body').on('click','.every_list',function(e){
		e.stopPropagation();
				$('.every_list').removeClass("active_list");
					$(this).addClass("active_list");
					var art_id = $(this).attr("id");
					$('.detail_info').empty();
					detail_op(art_id);
	});

	

	//更新数据条数
	function update_num(sum_name){
		$.ajax({
			url:'/robotnews/rs/news/summary',
			data:{category:sum_name},
			dataType:'json',
			success:function(data){
				if(data.message=='success'){
					var lists = data.content;
					var summary_num = data.summary_info;
					var now_num = summary_num.recordCount;
					var differ = now_num-info_num;
					if (differ>0) {
						$('.num').text(differ);
						$('#static').hide();
						$('#hasDate').show();
					}else{
						$('#hasDate').hide();
						$('#static').show();
					}
				}
			},
			error:function(error){
				alert("数据加载错误");
			}
		});	
	}
	// 加载数据
	function data_op(sum_name,page_num){
		$.ajax({
			url:'/robotnews/rs/news/summary',
			data:{category:sum_name,page:page_num,pageSize:20},
			dataType:'json',	
			success:function(data){
				if(data.message=='success'){
					var lists = data.content;
					var article_id;
					var p_c = data.summary_info;
					info_num = p_c.recordCount;
					var pageCount = p_c.pageCount;//记录页数;
					// console.log("info_num:"+info_num);
					for (var i = 0; i < lists.length; i++) {
						var item = lists[i];

						var title_article = item.DOCTITLE;
						var time_article = item.updatetime;
						var time = new Date(time_article);
						var month = time.getMonth();
						var f_time = time.Format("YYYY-"+(month+1)+"-dd hh:mm");
						var f_time_1 = time.Format("YYYY年"+(month+1)+"月dd日 hh:mm");
						var content_article = item.CONTENT;
						article_id = item.nid;
						if (i==0&&page_num==1) {
							var a_list_1 = '<a href="javascript:;" class="every_list active_list" id="'+article_id+'"><h4 class="clamp">'+title_article+'</h4><p>'+f_time+'</p></a>';
							var a_list_content = '<div class="article_tip"><h4>'+title_article+'</h4><div class="fu_title"><span>发布时间：</span><span>'+f_time_1+'</span></div></div><div class="article_txt">'+content_article+'</div>'
							$('#lists').append(a_list_1);
							$('.detail_info').append(a_list_content);
						}else{
							var a_list = '<a href="javascript:;" class="every_list" id="'+article_id+'"><h4 class="clamp">'+title_article+'</h4><p>'+f_time+'</p></a>';
							$('#lists').append(a_list);
						}
					}
					tag=true;
				}
			},
			error:function(error){
				alert("数据加载错误");
			}
		});	
	}
	function detail_op(artNid){//文章详细内容
		$.ajax({
			url:'/robotnews/rs/news/detail',
			data:{nid:artNid},
			dataType:'json',
			success:function(data){
				if(data.message=='success'){
					var list = data.content;
					for (var i = 0; i < list.length; i++){
						var item = list[i];
						var title_detail = item.DOCTITLE;
						var time_detail = item.updatetime;
						var content_detail = item.CONTENT;
						var time = new Date(time_detail);
						var month = time.getMonth();
						var f_time = time.Format("YYYY年"+(month+1)+"月dd日 hh:mm");
						var a_list_detail = '<div class="article_tip"><h4>'+title_detail+'</h4><div class="fu_title"><span>发布时间：</span><span>'+f_time+'</span></div></div><div class="article_txt">'+content_detail+'</div>';
						$('.detail_info').append(a_list_detail);
						if (item.modName=="台风新闻") {
							var taifen = '<div id="chart-typhoon" style="height: 650px; margin-top: 20px;"></div>'
							$('.detail_info').append(taifen);
							// typhoonChart(artNid);
							mlfTyphoonChart(artNid);
							
						}
					}
				}
			},
			error:function(error){
				alert("数据加载错误");
			}
		});
	}

	function select(summary_name){//判断是点击哪一类
		switch(summary_name){
			case "1":
				china_name = "NBA快讯";
				page_num=1;
				data_op(china_name,page_num);
				break;
			case "2":
				china_name = "足球快讯";
				page_num=1;
				data_op(china_name,page_num);
				break;
			case "3":
				china_name = "台风快讯";
				page_num=1;
				data_op(china_name,page_num);
				break;
			case "4":
				china_name = "地震快讯";
				page_num=1;
				data_op(china_name,page_num);
				break;
			case "5":
				china_name = "财经快讯";
				page_num=1;
				data_op(china_name,page_num);
				break;
			case "6":
				china_name = "数据解读";
				page_num=1;
				data_op(china_name,page_num);
				break;
			default : console.log("default");
		}
	}

	var china_name = "NBA快讯";
	var info_num;//记录已经加载的数据数
	// var differ;//记录新稿件数
	var page_num=1;//记录获取稿件的页数
	var tag=true;
	data_op(china_name,page_num);

	var control_t = setInterval(function(){
		update_num(china_name);
	},600000);//10分钟==600000秒

	
	$('.detail_list').scroll(function(e){
		var list_h = $('#lists').height()
		var par = $('.detail_list').height();
		var par_t = $(this).scrollTop();
		if (par_t>=list_h-par&&tag&&par_t!=0) {
			page_num++;
			tag = false;
			data_op(china_name,page_num);
		}
	});

// 台风地图
function mlfTyphoonChart(artNid) {
var chart = echarts.init(document.getElementById('chart-typhoon'), 'roma');
chart.showLoading();
$.post('/robotnews/rs/news/typhoon', { nid : artNid }, function(data, textStatus, jqXHR) {
	if (jqXHR.status != 200) {
	alert ('服务异常，请稍候再试！');
	chart.hideLoading();
	$('#chart-typhoon').hide();
	return;
	}
	if (data == null || data == '') {
	chart.hideLoading();
	$('#chart-typhoon').hide();
	return;
	}
	var data = data[0].points.map(function(element, index) {
	return [element.longitude, element.latitude];
	});
	chart.hideLoading();
	chart.setOption({
	title : {
	text: '台风轨迹',
	left: 'center',
	textStyle : {
	color: 'black'
	}
	},
	tooltip : {
	trigger: 'item'
	},
	toolbox: {
	show: true,
	feature: {
	dataZoom: {
	yAxisIndex: 'none'
	},
	dataView: {readOnly: false},
	magicType: {type: ['line', 'bar']},
	restore: {},
	saveAsImage: {}
	}
	},
	geo: {
	map: 'world',
	label: {
	emphasis: {
	show: false
	}
	},
	roam: true,
	center: [114.3896,30.6628],
	zoom: 4,
	nameMap: {
	'China' : '中国'
	},
	label: {
	normal: {
	show: true
	},
	emphasis: {
	show: true
	}
	},regions: [{
	name: '中国',
	itemStyle: {
	normal: {
	areaColor: '#FFE680',
	borderColor: '#404a59'
	},
	emphasis: {
	areaColor: '#2a333d'
	}
	}
	}]
	},
	series: [{
	name: '台风轨迹',
	type: 'lines',
	polyline: true, // 连续坐标
	zlevel: 1,
	effect: {
	show: true,
	constantSpeed : 80,
	symbol : 'circle',
	symbolSize: 5,
	color: 'red',
	trailLength: 0.7
	},
	lineStyle: {
	normal: {
	color: '#a6c84c',
	width: 0,
	curveness: 0.2
	}
	},
	data: [{coords:data}],
	animation: true
	}, {
	type: 'effectScatter',
	coordinateSystem: 'geo',
	zlevel: 2,
	rippleEffect: {
	brushType: 'stroke'
	},
	label: {
	normal: {
	show: true,
	position: 'right',
	formatter: '{b}'
	}
	},
	symbolSize: 5,
	itemStyle: {
	normal: {
	color: '#0066B2'
	}
	},
	data: [
	{name:'北京', value:[116.4551,40.2539]},
	{name:'上海', value:[121.4648,31.2891]},
	{name:'广州', value:[113.5107,23.2196]},
	{name:'深圳', value:[114.5435,22.5439]},
	{name:'南宁', value:[108.479,23.1152]},
	{name:'海口', value:[110.3893,19.8516]},
	{name:'福州', value:[119.4543,25.9222]},
	{name:'厦门', value:[118.1689,24.6478]},
	{name:'南昌', value:[116.0046,28.6633]},
	{name:'长沙', value:[113.0823,28.2568]},
	{name:'武汉', value:[114.3896,30.6628]},
	{name:'杭州', value:[119.5313,29.8773]},
	{name:'温州', value:[120.498,27.8119]},
	{name:'台北', value:[121.5365,25.0192]}
	]
	}]
});    
}, 'json');
}
});