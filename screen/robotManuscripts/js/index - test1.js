$(function(){
	var h = $(window).height();
	var banner_h = $('.banner').height();
	var row_h = h-banner_h;
	$('.summary').height(row_h);
	$('.detail_list').height(row_h);
	$('.detail_info').height(row_h);

	$('.summary a').click(function(){
		$('.summary a').removeClass("active");
		$(this).addClass("active");
		var sum_name = $(this).attr("id");
		select(sum_name);
	});
	$('.detail_list a').click(function(){
		$('.detail_list a').removeClass("active_list");
		$(this).addClass("active_list");
	});
	// 加载数据
	// var dataObj={};
	// var vm = new Vue({
	// 	el:'#lists',
	// 	// template:'<a href="javascript:;" class="every_list active_list"><h4>{{title_article}}</h4><p>{{time_article}}</p></a>',
	// 	data:{
	// 		list:[]
	// 	}
	// });
	function data_op(sum_name){
		$.ajax({
			url:'./robotnews/rs/news/summary',
			data:{category:sum_name},
			dataType:'json',
			success:function(data){
				if(data.message=='success'){
					var lists = data.content;
					for (var i = 0; i < lists.length; i++) {
						var item = lists[i];
						var title_article = item.DOCTITLE;
						var time_article = item.updatetime;
						var a_list = '<a href="javascript:;" class="every_list"><h4>'+title_article+'</h4><p>'+time_article+'</p></a>';
						$('.detail_list').append(a_list);
					}
					// var list =data.content,dataObj={};
					// for(var i=0,len=list.length;i<len;i++){
					// 	var item=list[i];
					// 	if(!dataObj[item.modName]){
					// 		dataObj[item.modName]=[];
					// 	}
					// 	dataObj[item.modName].push(item);
					// 	// console.log(item.DOCTITLE);//获得标题
					// 	// console.log(item.updatetime)//获得时间
					// }
					// console.log(dataObj);
					// console.log(sum_name)
					// for (var i = 0; i < dataObj.NBA.length; i++) {
					// 	var title_article = dataObj.NBA[i].DOCTITLE;
					// 	var time_article = dataObj.NBA[i].updatetime;
					// 	var a_list = '<a href="javascript:;" class="every_list"><h4>'+title_article+'</h4><p>'+time_article+'</p></a>';
					// 	$('.detail_list').append(a_list);
					// }
					// console.log(dataObj.NBA[0].DOCTITLE);//获得标题
					// console.log(dataObj.NBA[0].updatetime);//获得稿件时间
					// console.log(dataObj.NBA[0].CONTENT);//获得文章内容
					// vm.$data.list=dataObj;
					// console.log(vm.$data.list.NBA);
				}
			},
			error:function(error){

			}
		});	
	}

	function select(summary_name){//判断是点击哪一类
		switch(summary_name){
			case "1":
				china_name = "NBA快讯";
				data_op(china_name);
				break;
			case "2":
				china_name = "足球快讯";
				data_op(china_name);
				break;
			case "3":
				china_name = "台风快讯";
				data_op(china_name);
				break;
			case "4":
				china_name = "地震快讯";
				data_op(china_name);
				break;
			case "5":
				china_name = "财经快讯";
				data_op(china_name);
				break;
			case "6":
				china_name = "数据解读";
				data_op(china_name);
				break;
			default : console.log("default");
		}
	}
	var china_name = "NBA快讯";
	data_op(china_name);
});