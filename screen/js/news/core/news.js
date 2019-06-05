zbdp.initNews = function() {
	var nationUrl = serverDomain + '/screen/recentpolicy/searchchina';
	var zjUrl = serverDomain + '/screen/recentpolicy/searchzj';
//	var groupUlr = serverDomain + '/screen/Corp/get/';
	//var zjUrl ='js/news/core/zhejiang.json';
	//var nationUrl = 'js/news/core/zhejiang.json';
	var todayTimeout = zbdp.configData.todayUpdateInterval || 120;
	var groupTimeout = zbdp.configData.groupUpdateInterval || 120;

	drawNationNews(nationUrl);
	drawZJNews(zjUrl);
	//drawGroupNews(groupUlr);

	function drawNationNews(url) {
		var label = 'nation';
		$.get(url, function(datastr, state) {
			if (state == 'success') {
				// zbdp.tip.info('获取数据<全国近期政策>成功');
				console.log('获取数据<全国近期政策>成功');
				var data = JSON.parse(datastr);
				//var data = datastr;
				zbdp.drawNews(data, label);
			} else {
				// zbdp.tip.info('获取数据<全国近期政策>失败');
				console.log('获取数据<全国近期政策>失败');
			}
//			setTimeout(function() {
//				drawNationNews(nationUrl);
//			}, todayTimeout * 1000);
		});
	}

	function drawZJNews(url) {
		var label = 'zhejiang';
		$.get(url, function(datastr, state) {
			if (state == 'success') {
				console.log('获取数据<浙江近期政策>成功');
				var data = JSON.parse(datastr);
				//var data  =  datastr;
				zbdp.drawNews(data, label);
			} else {
				console.log('获取数据<浙江近期政策>失败');
			}
			setTimeout(function() {
				window.location.reload();
			}, todayTimeout * 1000);
		});
	}

//	function drawGroupNews(url) {
//		var label = 'group';
//		$.get(url, function(datastr, state) {
//			if (state == 'success') {
//				console.log('获取数据<集团舆情>成功');
//				var data = JSON.parse(datastr);
//				// var data = zbdp.getNewsData('group');
//				zbdp.drawNews(data, label);
//			} else {
//				console.log('获取数据<集团舆情>失败');
//			}
//			setTimeout(function() {
//				drawGroupNews(groupUlr);
//			}, groupTimeout * 1000);
//		});
//	}
}

zbdp.drawNews = function(data, label) {

	// function draw(data, label) {
	var dataArr,
		element,
		elementTop,
		elementBottom,
		markEle, //页面显示数据量
		moveThread, //垂直滚动需要有的条目数量
		moveVSelector, //垂直滚动的选择符
		moveHSelector; //水平滚动的选择符

	if (label == 'nation') {
		dataArr = data.PAGEITEMS;
		if (!dataArr) {
			return;
		}
		element = $('.news-today-nation');
		markEle = $('.news-today-nation-maker span');
		moveVSelector = 'news-item-wrapper';
		moveHSelector = 'news-item-detail-wrapper';
		moveThread = 4;

		element.empty();
	} else if (label == 'zhejiang') {
		dataArr = data.PAGEITEMS;
		if (!dataArr) {
			return;
		}
		element = $('.news-today-zhejiang');
		markEle = $('.news-today-zhejiang-maker span');
		moveVSelector = 'news-item-wrapper';
		moveHSelector = 'news-item-detail-wrapper';
		moveThread = 4;

		element.empty();
	} else if (label == 'group') {
		var topLength = 0;
		if (typeof data.top == 'undefined') {
			data.top = [];
		}
		if (typeof data.bottom == 'undefined') {
			data.bottom = [];
		}
		if (data.top instanceof Array) {
			topLength = data.top.length;
		}
		elementTop = $('.news-group-content.top');
		elementBottom = $('.news-group-content.bottom');
		markEle = null;
		moveVSelector = 'news-group-item-wrapper';
		moveHSelector = 'news-group-item-detail-wrapper';
		moveThread = 9 - topLength;

		elementTop.empty();
		elementBottom.empty();
	}
	//显示数量
	if (markEle && markEle.length > 0) {
		markEle.text(data.PAGEITEMS.length);
	}

	function generateGroupItem(ele, item) {
		var itemWrapper = document.createElement('div');
		itemWrapper.classList.add('news-group-item-wrapper');
		if (item.MARK == 1) {
			itemWrapper.classList.add('active');
		}

		var itemDetailWrapper = document.createElement('div');
		itemDetailWrapper.classList.add('news-group-item-detail-wrapper');
		itemDetailWrapper.innerHTML = '<div class="news-group-item-detail ">' + item.URLTITLE + '</div>'
		itemWrapper.appendChild(itemDetailWrapper);

		var itemTime = document.createElement('div');
		itemTime.classList.add('news-group-item-time');
		// itemTime.innerText = item.time;
		// itemTime.innerText = '1分钟前';
		var formateDate = zbdp.formateDate(item.URLTIME);
		if (formateDate.isToday) {
			var ago = document.createElement('time');
			ago.classList.add('timeago');
			ago.setAttribute('datetime', item.URLTIME);
			itemTime.appendChild(ago);
		} else {
			itemTime.innerText = formateDate.date;
		}
		itemWrapper.appendChild(itemTime);

		ele.append(itemWrapper);
	}
	//循环增加信息条目
	if (label == 'group') {
		/*if (typeof dataArr == 'undefined') {
		    console.log('集团舆情初始化失败！')
		}*/
		for (var i = 0; i < data.top.length && i < zbdp.configData.topItemsThreshold; i++) {
			var item = data.top[i];
			generateGroupItem(elementTop, item);
		}
		for (var j = 0; j < data.bottom.length; j++) {
			var item = data.bottom[j];
			generateGroupItem(elementBottom, item);
		}

		var maxHeight = $('.news-group-content-wrapper').height() - $('.news-group-content.top').height();
		$('.news-group-content.bottom').css('height', maxHeight + "px");

		$('time.timeago').timeago();

		zbdp.moveVerticalCancel(label);
		if (data.bottom.length >= moveThread) {
			zbdp.moveVertical(elementBottom, moveVSelector, label);
		}
	} else {

		// var dataArr = data.PAGEITEMS;
		/*if (typeof dataArr == 'undefined') {
		    alert('今日政策初始化失败！')
		}*/
		for (var i = 0; i < dataArr.length; i++) {
			var item = dataArr[i];

			var itemWrapper = document.createElement('div');
			itemWrapper.classList.add('news-item-wrapper');

			var itemSite = document.createElement('div');
			itemSite.classList.add('news-item-site');
			itemSite.innerText = item.CHANNEL;
			itemWrapper.appendChild(itemSite);

			var itemDetailWrapper = document.createElement('div');
			itemDetailWrapper.classList.add('news-item-detail-wrapper');
			itemDetailWrapper.innerHTML = '<div class="news-item-detail">' + item.URLTITLE + '</div>'
			itemWrapper.appendChild(itemDetailWrapper);

			element.append(itemWrapper);
		}

		zbdp.moveVerticalCancel(label);
		if (dataArr.length >= moveThread) {
			zbdp.moveVertical(element, moveVSelector, label);
		}

	}
	if (element) {
		setTimeout(function(){
			zbdp.moveHorizental(element, moveHSelector, label);
		},3000)
		
	}
	if (elementTop) {
		setTimeout(function(){
			zbdp.moveHorizental(elementTop, moveHSelector, label);
		},1000)
		
	}
	if (elementBottom) {
		zbdp.moveHorizental(elementBottom, moveHSelector, label);
	}

};