 page_no=0;
var ele = $('.news');
var elechild = 'news-content-content';
window.onload = function() {
		hiddenDiv();
		showDic();
		setTimeout(function(){
			moveHistoryItem(ele);
		},2000)

	setInterval(function() {
		hiddenDiv();
		showDic();
		setTimeout(function(){
			moveHistoryItem(ele);
		},2000)
	}, 10*60*1000)
}

function hiddenDiv() {
	$('.news').slideUp("slow");
	$('.news').html('');
	drawHistoryNews();
	
}
function showDic() {
		$('.news').slideDown("slow");
}

function drawHistoryNews() {
	$.ajax({
		type: "get",
		//url:'/screen/todayinhistory/getpage/?page_no='+page_no+'&page_size=7',
		url: 'js/news/core/lishijintian.json',
		async: true,
		success: function(data) {
			//data = JSON.parse(data);
			var TOTALPAGE = data.TOTALPAGE;
			console.log(TOTALPAGE);
			var data = data.RESULTMAP;
			if (page_no<TOTALPAGE-1) {
				page_no++;
			}else{
				page_no=0;
			}
			console.log(page_no);
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
function removeNewsChildren(){
	
}
function moveHistoryItem(container) {
	var wrappers = container.find('.news-content');
	var wrapperWidth = $(wrappers[0]).width();

	wrappers.each(function(i,wrapperDiv) {
		var wrapper = $(wrapperDiv);
		var content = wrapper.children();
		$.each(content, function(i, d) {
			var conentchild = $(d);
			var contentWidth = conentchild.width();
			if(contentWidth > wrapperWidth) {
				var contentSibling = content.clone();
				wrapper.append(contentSibling);
				doScroll(wrapper,contentWidth);
			}
		});
	});
}

function doScroll(wrapper,scrollWidth){
	var speed = 130;
	wrapper.animate({scrollLeft:scrollWidth},1300 * scrollWidth/speed,function(){
		wrapper.scrollLeft(0);
		window.setTimeout(function(){
				doScroll(wrapper,scrollWidth);	
		},2000);
	});
	speed = null;
}

