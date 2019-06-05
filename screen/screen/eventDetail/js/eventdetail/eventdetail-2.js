App.prototype.renderSection2 = function() {
	var e = 0;
	var self = this;
	var sectionData = self.sectionData_2;
	if($.isEmptyObject(sectionData) == false) {
		var data = sectionData;
		var newspaper = data[e].ENTITY;
		var mewspaper_date =  getLocalTime(data[e].PUBTIME);
		var newspaper_content = data[e].DOCABSTRACT.slice(0, 70);
		var $news = $('.newspaper-content').eq(0);
		var $people = $('.news_people').eq(0);
		var $news_date = $('.news_pubtime').eq(0);
		$news_date.text(mewspaper_date);
		$people.text(newspaper);
		$news.text(newspaper_content);
		var newspaper = data[2].ENTITY;
		var mewspaper_date = getLocalTime(data[2].PUBTIME);
		var newspaper_content = data[2].DOCABSTRACT.slice(0, 60);
		var $news1 = $('.newspaper-content').eq(1);
		var $people1 = $('.news_people').eq(1);
		var $news_date1 = $('.news_pubtime').eq(1);
		$news_date1.text(mewspaper_date);
		$people1.text(newspaper);
		$news1.text(newspaper_content)
		clearInterval(setitem);

		function getLocalTime(nS) {
			return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');  
		}

		function scroll_news() {
			var data_length = data.length;
			//i < data_length ? i = i : i = 0
			if(e < data_length) {

				newspaper = data[e].ENTITY;
				mewspaper_date =  getLocalTime(data[e].PUBTIME);
				newspaper_content = data[e].DOCABSTRACT.slice(0, 60);
				$news = $('.newspaper-content').eq(0);
				$people = $('.news_people').eq(0);
				$news_date = $('.news_pubtime').eq(0);
				$news_date.text(mewspaper_date);
				$people.text(newspaper);
				$news.text(newspaper_content)
				e++;

			} else {
				e = 0
			}
			//$(function() {
			$('.related-Newspaper').eq(0).fadeOut('slow', function() {
				$(this).clone().appendTo($(this).parent()).fadeIn('slow');
				$(this).remove();
			});
			//});
		}
		var setitem = setInterval(function() {
			scroll_news();
		}, 10000);
	} else {
		return;
	}

}