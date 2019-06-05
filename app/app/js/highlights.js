var ld_index = 1;
var qk_index = 1;
var medianameDW="";//单位
var mediaTypeDW="";//类型
var ld_time = "6";
var zx_time = "0";
window.domain = "http://" + document.domain +":" +window.location.port +"/cb";
$(function(){
	screen();
	/*
	文章传播力排行榜更多加载
	 */
	$('.ld_more').click(function(){
		ld_index++;
		getIntensity(mediaTypeDW,ld_index,getTime(ld_time),getTime(0),medianameDW);
	});
	$('.qk_more').click(function(){
		qk_index++;
		getSituation(mediaTypeDW,qk_index,getTime(zx_time),getTime(0),'');
	});
	/*
	文章传播力排行榜时间选择加载
	 */
	$('.selete').click(function(){
		ld_time = $(this).children('a').attr('selectid');
		$('.ld-wz-ul li').remove();
		ld_index = 1;
		getIntensity(mediaTypeDW,ld_index,getTime(ld_time),getTime(0),medianameDW);
	});
	/*
	一级菜单选择
	 */
	$('.ld-nav-fr').click(function(){
		$(this).addClass('nav-fr-cur').siblings().removeClass('nav-fr-cur');
	});
	
	// getSituation(1,"","",'1');	
	// //getIntensity(1,"","","7");
	// getIntensity('',1,getTime(6),getTime(0),'');
	getMenuHtml('propagate.web','网站');
})
/*
单位列表获取
 */
function getMenuHtml(OprType,mediaType){

		$('.rw-wz-ul li').remove();
		$('.ld-wz-ul li').remove();	

		mediaTypeDW  = mediaType;
		ld_index = 1;
		qk_index = 1;

		if(mediaType == '网站'){
			ld_time = "6";
		 	zx_time = "0";
		 	$('#cbl-phb').html('文章传播力月排行榜');
		 	$('#zx-wzqk').html('文章传播力周排行榜');
		}else if(mediaType == '报纸'){
			ld_time = "30";
		 	zx_time = "6";
		 	$('#cbl-phb').html('文章传播力月排行榜');
		 	$('#zx-wzqk').html('文章传播力周排行榜');
		}
		getIntensity(mediaTypeDW,ld_index,getTime(ld_time),getTime(0),'');
		getSituation(mediaTypeDW,qk_index,getTime(zx_time),getTime(0),'');	
}
//文章传播情况
function getSituation(mediaType,startPage,startpubday,endpubday,medianame){
	var params = {
        userId:'1',
        startPage:startPage,//页数
        pageSize:10,//分页大小
        startpubday:startpubday,//查询日期（开始日期）
        endpubday:endpubday,//查询截止日期
        mediaType: mediaType,
	};
	
	var url = domain + "/data/3/article.json";
	if(mediaType=='报纸'){
		url = domain + "/data/3/paperWeek.json";
	}
	$.ajax({
		type: "get",
		dataType :'json',
		url: url,
		data: params,
		success: function(data) {
			for(var i = 0 ; i< data.CONTENT.length;i++){
				var rankClass=""
				if(i<3&&params.startPage==1){
					rankClass="no";
				}
				var ran = (params.startPage-1)*10+(i+1);
				var INDEX = data.CONTENT[i].CEIINDEX;
				if(mediaType=='微信'){
					INDEX = data.CONTENT[i].NEWCEIINDEX;
				}
				var createobj = $(
					'<li class="'+rankClass+'"><div class="wz-dt"><span>'+data.CONTENT[i].DATAPUBTIME+'</span></div>'+
					'<a target="_blank" href="http://172.16.23.57:8090/view.html?_id='+data.CONTENT[i].ID+'" class="wz-bt">'+data.CONTENT[i].TITLE+'</a>'+
					'<span class="wz-ly">'+data.CONTENT[i].MEDIANAME+'</span>'+
					'<span class="wz-cbz">'+INDEX+'</span>'+
					'</li>'
				);
				
				$(".rw-wz-ul").append(createobj);
			}
			

		},
		error:function(msg){
             console.log(msg);//$(".rw-wz-ul").append(createobj);
		}
	});
}
//文章传播力排行榜
function getIntensity(mediaType,startPage,startpubday,endpubday,medianame){
	var params = {
        userId:'1',
        startPage:startPage,//页数
        pageSize:10,//分页大小
        startpubday:startpubday,//查询日期（开始日期）
        endpubday:endpubday,//查询截止日期
        mediaType: mediaType,
	};
	var url = domain + "/data/3/articleWeek.json";
	if(mediaType=='报纸'){
		url = domain + "/data/3/paperMonth.json";
	}
	$.ajax({
		type: "get",
		dataType :'json',
		url: '../cb/js/hover.json',
		data: params,
		success: function(data) {
			console.log(data);
			for(var i = 0 ; i< data.CONTENT.length;i++){
				var rankClass=""
				if(i<3&&params.startPage==1){
					rankClass="no";
				}
				var ran = (params.startPage-1)*10+(i+1);
				var INDEX = data.CONTENT[i].CEIINDEX;
				if(mediaType=='微信'){
					INDEX = data.CONTENT[i].NEWCEIINDEX;
				}

				var createobj = $(
					'<li class="'+rankClass+'">'+
					'<span class="wz-xh">'+ran+'</span>'+
					'<a target="_blank" href="http://172.16.23.57:8090/view.html?_id='+data.CONTENT[i].ID+'" class="wz-bt">'+data.CONTENT[i].TITLE+'</a>'+
					'<span class="wz-ly">'+data.CONTENT[i].MEDIANAME+'</span>'+
					'<span class="wz-cbz">'+INDEX+'</span>'+'<div><ul></ul></div>'+
					'</li>'
				);
				var html = '<div style="display:none"><ul><li><span>标题</span><span>网站</span></li>';
				for (var j = 0; j < data.CONTENT[i].HOVER.length; j++) {
					html += '<li><span><a href="'+data.CONTENT[i].HOVER[j].url+'" target="_blank">'+data.CONTENT[i].HOVER[j].title+'</a></span><span>'+data.CONTENT[i].HOVER[j].site+'</span></li>';
				}
				html += '</ul></div>';
				createobj.append($(html));

				$(".ld-wz-ul").append(createobj);

			}

			$('.ld-wz-ul li').hover(function() {
				$(this).children('div').show(400);
			}, function() {
				$(this).children('div').hide();
			});


			
		},
		error:function(msg){
             console.log(msg);
		}
	});

	



	
}
function getTime(index){
	var date = new Date((new Date()).getTime() - index * 24 * 3600 * 1000);
	return date.format('yyyyMMdd');
}
Date.prototype.format = function(format){
    var o = {
    "M+" : this.getMonth()+1, //month
    "d+" : this.getDate(),   //day
    "h+" : this.getHours(),  //hour
    "m+" : this.getMinutes(), //minute
    "s+" : this.getSeconds(), //second
    "q+" : Math.floor((this.getMonth()+3)/3), //quarter
    "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
    (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,
    RegExp.$1.length==1 ? o[k] :
    ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
//根据分辨率调整页面大小
function screen() {
    var width = $(window).width();
    var height = $(window).height();
    var location = {
        x: 0,
        y: 0
    };

    if (width / height < 1920 / 1080) {
        scale = width / 1920;
        location.y = (height - 1080 * scale) / 2;
    } else {
        scale = height / 1080;
        location.x = (width - 1920 * scale) / 2;
    }
    $("html").css({
        "height": 0,
    });
    $("html").css({
        "width": 1920+"px",
        "height": 1080+"px",
        "transform": "scale(" +  width / 1920+","+ height / 1080+ ")",
        "-ms-transform": "scale(" +  width / 1920+","+ height / 1080+ ")",
        "-moz-transform": "scale(" +  width / 1920+","+ height / 1080+ ")",
        "-webkit-transform": "scale(" +  width / 1920+","+ height / 1080+ ")",
        "-o-transform": "scale(" +  width / 1920+","+ height / 1080+ ")",
        "transform-origin": "left top",
        "-ms-transform-origin": "left top",
        "-webkit-transform-origin": "left top",
        "-moz-transform-origin": "left top",
        "-o-transform-origin": "left top",
        // "margin-left": location.x + "px",
        // "margin-top": location.y + "px"
    });

}