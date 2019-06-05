(function($){
	/*
	Select v1.0.0
	=================================
	Readme:select 重写效果
	----------------------
	param:$(".select1"),		//选择器
	*/
	var my_select = function(obj){
		var $selected_js = obj.param;
		var $tag_select_js = $selected_js.find("div.tag_select");
		var $tag_options_js = $selected_js.find("ul.tag_options");
		$tag_select_js.click(function(){
			$(this).next().show();
		});
		$tag_options_js.bind("mouseleave",function(){
			$(this).hide();
		});
		//默认选中第一个
		$tag_select_js.find("span.val").text($tag_options_js.find("li:first-child").text());
	}

	window.TRS = {
		my_select : my_select //select重写效果
	};
})(jQuery);
