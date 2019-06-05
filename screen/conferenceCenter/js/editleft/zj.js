(function() {
	function App() {
		var self = this;
		self.zj_news = $(".ssxs_content");

		App.getJsonData();

	}
	App.getJsonData = function() {
		var self = this;
		$.get('zj.json', function(data) {
			if($.isEmptyObject(data) == true) return;
			$("#zjnews_count").text(data.TOTALITEMCOUNT);
			self.dat = data;

		})
	}

	App.drawZjItem = function(data, ele) {
		var ele = $("." + ele);
		var text = '<div class="ssxs_main"><div class="news_from">' + data.CHANNEL + '</div><div class="news_content">'
		data.URLTITLE '</div></div>';
		ele.append(text);
	}
	App.doMove = function(ele) {
		var ele = $('.ssxs_content');
		var elechild = ele.children().first();
		var content = $(elechild).children().last();
		var contentSibling = $(content).siblings();
		if(contentSibling.length == 0) {
			$(content).css('padding-right', '100px');
			contentSibling = $(content).clone();
			wrapper.append(contentSibling);
		}
	}
	var app = new App();
})()