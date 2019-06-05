(function() {
	function App() {};

	App.prototype.start = function() {
		getAdress();
	}

	function getAdress() {
		$.get('js/wangzhi.json', function(data) {
			var item = data.item,
				itemLength = item.length,
				itemImg = data.imgs;
			DrawItem(item);
			var arressId = 0;
			var setInter = window.setInterval(function() {
				if(arressId < itemLength - 1) {
					itemClone(item, arressId, itemLength);
				} else if(arressId == itemLength - 1) {
					itemClone(item, -1, itemLength);
					arressId = -1;
				}
				arressId++
			}, 15000)

		})
	}

	function DrawItem(data) {
		var div1 = d3.select('#aaa').selectAll('div').data(data);
		var divArr = div1.enter();
		divArr.append('div').classed('footer_item', true).each(function(d, i) {
			d3.select(this).append('div').classed('foot_name', true).text(d.name);
//			d3.select(this).append('img').classed('foot_img', true).classed('img_none', true).attr('src',  data[i].address);
			d3.select(this).append('iframe').classed('footer_item1', true).classed('img_class', true).attr('src', data[i].address);

		});

	}

	function xia(ele, Xsum, Ysum) {
		var obj = document.getElementsByClassName(ele);
		obj.style.transition = "-webkit-transform 500ms ease-out";
		obj.style.webkitTransform = "translate(" + Xsum + "px," + Ysum + "px) scale(0.2) translateX(100px)";
	}

	function itemClone(data, arressId, itemLength) {
		var Ele = $('#aaa .footer_item');
		var foor_item = $(Ele[arressId + 1]);
		foor_item.find('iframe').addClass('img_none');
		var foot_sibling = foor_item.siblings();
		foot_sibling.find('iframe').removeClass('img_none');
		var ele = $('#main').children()[0];
		var eleParent = $(ele).parent();
		var eleClone = $(ele).clone();
		var eleClonechild = $(eleClone).children()[1]
		var eleName = $(eleClone).children().children()[1];
		$(eleName).text(data[arressId+1].name);
		var elechild = $(ele).children()[0];
		$(eleClonechild).attr('src', data[arressId + 1].address)
		$(eleParent).append(eleClone);
		if(data[arressId + 1].type=="img"){
			$("#frame").width("708px");
		}else{
			$("#frame").width("1920px");
		}
		$(ele).animate({
			'margin-left': "-1920px"
		}, {
			duration: 3000,
			queue: false,
			complete: function() {
				$(ele).remove();
				if(data[arressId + 1].type=="img"){
					$("#frame").width("708px");
				}else{
					$("#frame").width("1920px");
				}
			}
		});
	}

	var app = new App();
	app.start();
})()