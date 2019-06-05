$(function() {
	var h = $(window).height();
	$('.mlf_intro').hide();
	// var banner_h = $('.banner').height();
	// var row_h = h - banner_h;
	var row_h = h*0.98;
	console.log(row_h);
	var iframe_url = '../robotManuscripts/index.html'; //换成机器人稿件地址
	var iframe_html;
	$('.right_iframe').append(iframe_html);

	// $('.summary').height(row_h);
	$('.get_height').height(row_h);
	// $('.right_iframe').height(row_h);
	
	// var right_w = $('.right_iframe').width();
	// var slide_h = (1080*right_w)/1920;console.log(slide_h);
	var slide_h = row_h*0.87;
	var scorll_pic_b = row_h - slide_h;
	$('.swiper-slide').height(slide_h);
	// $('.swiper-slide').css('line-height', row_h * 0.9+'px');
	$('.swiper-slide').css('text-align', 'center');
	var pad_top = scorll_pic_b/2;
	$('.swiper-pagination.swiper-pagination-fraction').css('padding-top',pad_top);
	$('.swiper-button-next, .swiper-button-prev').css('margin-top',pad_top);
	$('.swiper-pagination').height(scorll_pic_b);
	// $('.swiper-pagination.swiper-pagination-fraction').css('line-height',scorll_pic_b);

	$('.summary a').click(function(e) {
		$('.summary a').removeClass("active");
		$(this).addClass("active");
		var url_id = $(this).attr('id');
		$('.mlf_intro').css("display", "block");
		select(url_id);
	});

	function select(id) { //判断是点击哪一类
		switch (id) {
			case "robot":
				$('iframe').remove();
				$('.mlf_intro').hide();
				iframe_url = '../robotManuscripts/index.html'; //换成机器人稿件地址
				iframe_html = '<iframe frameborder=0 width="100%" height="100%" marginheight=0 marginwidth=0 src="' + iframe_url + '"></iframe>';
				$('.right_iframe').append(iframe_html);
				break;
			case "mlf_intr":
				$('iframe').remove();
				$('.mlf_intro').show();
				break;
			case "mlf":
				$('iframe').remove();
				$('.mlf_intro').hide();
				iframe_url = 'http://csmlf.8531.cn';
				iframe_html = '<iframe frameborder=0 width="100%" height="100%" marginheight=0 marginwidth=0 src="' + iframe_url + '"></iframe>';
				$('.right_iframe').append(iframe_html);
				break;
			default:
				console.log("default");
		}
	}
});