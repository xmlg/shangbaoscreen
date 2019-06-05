page_no = 0;
var ele = $('.news');
var elechild = 'news-content-content';
window.onload = function() {
	hiddenDiv();
	showDic();
	setTimeout(function() {
		moveHistoryItem(ele);
	}, 5000)

//	setInterval(function() {
//		hiddenDiv();
//		showDic();
//		setTimeout(function() {
//			//doScroll(wrappers, n);
//			moveHistoryItem(ele);
//		}, 500)
//	}, 5 * 60 * 1000)
}

function hiddenDiv() {
	$('.news').slideUp("slow");
	$('.news').html('');
	drawHistoryNews();

}

function showDic() {
	$('.news').slideDown("slow");
}
var bigDataUrl="http://172.16.23.53";
var XNbigUrl ='/wcm/bigdata.do';
function drawHistoryNews() {
	$.ajax({
		type: "get",
		url:bigDataUrl+XNbigUrl+'day=07&groupname_type=0&modelid=get&month=02&page_no=0&page_size=10&serviceid=todayinhistory',
		async: true,
		success: function(data) {
			data = JSON.parse(data);
			var TOTALPAGE = data.TOTALPAGE;
			var data = data.RESULTMAP;
			if(page_no < TOTALPAGE - 1) {
				page_no++;
			} else {
				page_no = 0;
			}
			var keys = [];
			var arr = [];
			for(var key in data) {
				keys.push(key);
				arr.push(data[key])
			}

			keys = keys.reverse();
			arr = arr.reverse();
			createYearDiv(keys, data);
		}
	});
}

function createYearDiv(keys, data) {
	var div1 = d3.select('.news').selectAll('div').data(keys);
	var divArr = div1.enter();
	divArr.append('div').each(function(d, i) {
		d3.select(this).classed('news-content-content', true);
		d3.select(this).append('span').classed('historyYear', true);
		d3.select(this).selectAll('.historyYear').text(d);
		var wrapper = d3.select(this).append('div').classed('news-group-item-wrapper active', true);
		wrapper.selectAll('div').data(data[d]).enter()
			.append('div').classed('news-content', true).append('div').classed('aaa', true)
			.text(function(d, i) {
				return d;
			})

	})
}

function moveHistoryItem(container) {
	var wrappers = container.find('.news-content');
	var wrappers_length = wrappers.length;
	var wrapperWidth = $(wrappers[0]).width();
	var n = 0;
	doScroll(wrappers, n,wrappers_length,wrapperWidth)
}

//1300 * contentWidth / speed
function doScroll(wrappers, n,wrappers_length,wrapperWidth) {
	if(n < wrappers_length) {
		var speed = 110;
		var wrappers1 = wrappers[n];
		var wrapper = $(wrappers1);
		var content = wrapper.children();
		$.each(content, function(i, d) {
			var conentchild = $(d);
			var contentWidth = conentchild.width();
			if(contentWidth < wrapperWidth) {
				var contentSibling = content.clone();
				//wrapper.append(contentSibling);
				wrapper.animate({
					scrollLeft: 0
				}, 1300 * contentWidth / speed, false, function() {
					wrapper.scrollLeft(0);
					window.setTimeout(function() {
						n++;
						doScroll(wrappers,n,wrappers_length,wrapperWidth);
					}, 5000);
				});
			}else{
				var contentSibling = content.clone();
				wrapper.append(contentSibling);
				wrapper.animate({
					scrollLeft: contentWidth
				}, 1300 * contentWidth / speed, false, function() {
					wrapper.scrollLeft(0);
						n++;
						doScroll(wrappers,n,wrappers_length,wrapperWidth);
					
				});
			}
				
				speed = null;
			
		});
	}else {
			hiddenDiv();
	showDic();
	setTimeout(function() {
		moveHistoryItem(ele);
	}, 5000)
	}

}