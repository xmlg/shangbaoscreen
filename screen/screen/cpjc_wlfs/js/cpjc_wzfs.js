$(function () {
	var mainSlides = $('.main .slides');
	var footSlides = $('.footer .slides');

	//获取iframe的地址和网页名称
	$.get('js/link.json', function (data) {
		var linkItem = data.item;
		var length = linkItem.length;
		var html = '';
		var sliderHtml = '';
		for (var i = 0; i < length; i ++) {
			sliderHtml += `
				<li>
                	<iframe src="${linkItem[i].address}"></iframe>
                </li>
			`;
			if (i == 0) {
				html += `
					<li class='active'>
						<div class='link-name'>${linkItem[i].name}</div>
						<iframe src="${linkItem[i].address}"></iframe>
					</li>
				`
			} else {
				html += `
					<li>
						<div class='link-name'>${linkItem[i].name}</div>
						<iframe src="${linkItem[i].address}"></iframe>
					</li>
				`
			}
		}
		footSlides.html(html);
		mainSlides.html(sliderHtml);

		/**
		 * [before 每次开始轮播时的回调函数]
		 * @param  {[type]} value) {	                  	var nextIndex [滚动到哪一个下标]
		 */
		$('#slider').flexslider({
	        animation: "slide",//动画模式slide/滑动 ： fade/渐变
	        controlNav: true,//打开控制按钮：校园蒂娜
	        animationLoop: true,//是否循环播放
	        slideshow: true,//自动播放轮播
	        sliderShowSpeed: 10000,//轮播切换时间
	        animationSpeed: 1000,//过度动画时间
	        directionNav: false,//方向按钮
	        pauseOnHover: true,//鼠标移入时暂停
	        pauseOnAction: false,//鼠标点击的时候暂停
	        manualControls: '.banner-control .slides li',//自定义控制按钮，小圆点
	        before: function (value) {
	        	var nextIndex = value.animatingTo;
	        	var iframeItem = $('iframe')
	        	var size = iframeItem.length;
	        	//如果下一个是第一个图片，那么将所有的iframe刷新
	        	if (nextIndex == 0) {
	        		$.each(iframeItem, function (i, dom) {
	        			$(dom).attr('src', $(dom).attr('src'));
	        		})
	        	}
	        	$('.footer .slides li').eq(nextIndex).addClass('active').siblings().removeClass('active');
	        }
	    });

	});
});