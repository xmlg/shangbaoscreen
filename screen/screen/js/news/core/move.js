zbdp.moveVerticalCancel = function(label) {
	clearInterval(zbdp['moveVerticalInterval' + label.substring(0, 1).toUpperCase() + label.substring(1)]);
}

zbdp.moveVertical = function(container, selector, label) {
	//	var intervalName = 'moveVerticalInterval' + label.substring(0, 1).toUpperCase() + label.substring(1);
	//	zbdp[intervalName] = setInterval(function() {
	//		var item = container.find('.' + selector + ':first'); //此变量不可放置于函数起始处，li:first取值是变化的
	//		var _h = item.height(); //取得每次滚动高度
	//		item.animate({
	//			marginTop: -_h + 'px'
	//		}, 600, function() { //通过取负margin值，隐藏第一行
	//			item.css('marginTop', 0).appendTo(container); //隐藏后，将该行的margin值置零，并插入到最后，实现无缝滚动
	//		})
	//	}, zbdp.configData.moveVerticalDelay);
}

zbdp.moveHorizental = function(container, selector, label) {
	var wrappers = container.find('.' + selector);
	var wrapperWidth = $(wrappers[0]).width();
	var wrappers_length = wrappers.length;
	var n = 0;
	doMove(wrappers, n, wrappers_length, wrapperWidth);
	function doMove(wrappers, n, wrappers_length, wrapperWidth) {
		//if(wrappers_length > 3) {
			if(n < wrappers_length) {
				var wrapper = $(wrappers[n]);
				var wrapper_parent = wrapper.parent();
				var content = wrapper.children()[0];
				var contentWidth = $(content).width()
				var contentSibling = $(content).siblings();
				if(contentSibling.length == 0) {
					$(content).css('padding-right', '100px');
					contentSibling = $(content).clone();
					wrapper.append(contentSibling);
				}
				var moveLength = contentWidth + 100;
				//var moveDur = 3000;
				//news-item-wrapper
				var moveDur = parseInt(moveLength / zbdp.configData.moveHorizontalSpeed) * 1000;
				$(content).animate({
					marginLeft: -moveLength + 'px'
				}, {
					duration: moveDur,
					queue: false,
					complete: function() {
						
						$(wrapper_parent).animate({
							marginTop: -126
						}, {
							duration: 1000,
							queue: false,
							complete: function() {
								$(content).css('marginLeft',0);
								$(this).css('marginTop', 0).appendTo(container)
								n++;
								setTimeout(function(){
									doMove(wrappers, n, wrappers_length, wrapperWidth)
								},2000)
								
							}
						})
					}
				})

			} else {
				zbdp.moveHorizental(container, selector, label)
			}
//		} else {
//			if(n < wrappers_length) {
//				var wrapper = $(wrappers[n]);
//				var wrapper_parent = wrapper.parent();
//				var content = wrapper.children()[0];
//				var contentWidth = $(content).width()
//				var contentSibling = $(content).siblings();
//				if(contentSibling.length == 0) {
//					$(content).css('padding-right', '100px');
//					contentSibling = $(content).clone();
//					wrapper.append(contentSibling);
//				}
//				var moveLength = contentWidth + 100;
//				//var moveDur = 3000;
//				//news-item-wrapper
//				var moveDur = parseInt(moveLength / zbdp.configData.moveHorizontalSpeed) * 1000;
//				$(content).animate({
//					marginLeft: -moveLength + 'px'
//				}, {
//					duration: moveDur,
//					queue: false,
//					complete: function() {
//						n++;
//						doMove(wrappers, n, wrappers_length, wrapperWidth)
//					}
//				})
//
//			} else {
//				zbdp.moveHorizental(container, selector, label)
//			}
//		}

	}
}