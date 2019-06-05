App.prototype.renderSection2 = function() {
	var i = 0;
	var self = this;
	var sectionData = self.sectionData_2;
	var data = sectionData;
	var newspaper = data[i].ENTITY;
	var mewspaper_date = data[i].PUBTIME;
	var newspaper_content = data[i].DOCABSTRACT.slice(0, 60);
	var $news = $('.newspaper-content').eq(0);
	var $people = $('.news_people').eq(0);
	var $news_date = $('.news_pubtime').eq(0);
	$news_date.text(mewspaper_date);
	$people.text(newspaper);
	$news.text(newspaper_content)
	var newspaper = data[2].ENTITY;
	var mewspaper_date = data[2].PUBTIME;
	var newspaper_content = data[2].DOCABSTRACT.slice(0, 60);
	var $news1 = $('.newspaper-content').eq(1);
	var $people1 = $('.news_people').eq(1);
	var $news_date1 = $('.news_pubtime').eq(1);
	$news_date1.text(mewspaper_date);
	$people1.text(newspaper);
	$news1.text(newspaper_content)

	function scroll_news() {

		var data_length = data.length;
		//i < data_length ? i = i : i = 0
		if(i < data_length) {
			console.log(i);
			newspaper = data[i].ENTITY;
			mewspaper_date = data[i].PUBTIME;
			newspaper_content = data[i].DOCABSTRACT.slice(0, 60);
			$news = $('.newspaper-content').eq(0);
			$people = $('.news_people').eq(0);
			$news_date = $('.news_pubtime').eq(0);
			$news_date.text(mewspaper_date);
			$people.text(newspaper);
			$news.text(newspaper_content)
			i++;
			
		}else{
			i = 0
		}
		$(function() {
			$('.related-Newspaper').eq(0).fadeOut('slow', function() {
				//   alert($(this).clone().html());
				//克隆:不用克隆的话，remove()就没了。
				$(this).clone().appendTo($(this).parent()).fadeIn('slow');
				$(this).remove();
			});
		});
	}
	setInterval(function() {
		scroll_news();
	}, 3000);
}