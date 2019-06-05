zbdp.moveVerticalCancel = function(label) {
    clearInterval(zbdp['moveVerticalInterval' + label.substring(0, 1).toUpperCase() + label.substring(1)]);
}

zbdp.moveVertical = function(container, selector, label) {
    var intervalName = 'moveVerticalInterval' + label.substring(0, 1).toUpperCase() + label.substring(1);
    // console.log(intervalName);
    zbdp[intervalName] = setInterval(function() {
        var item = container.find('.' + selector + ':first'); //此变量不可放置于函数起始处，li:first取值是变化的
        var _h = item.height(); //取得每次滚动高度
        item.animate({
            marginTop: -_h + 'px'
        }, 600, function() { //通过取负margin值，隐藏第一行
            item.css('marginTop', 0).appendTo(container); //隐藏后，将该行的margin值置零，并插入到最后，实现无缝滚动
        })
    }, zbdp.configData.moveVerticalDelay);
}

zbdp.moveHorizental = function(container, selector, label) {
    var wrappers = container.find('.' + selector);
    var wrapperWidth = $(wrappers[0]).width();
    // console.log(wrapperWidth);
    for (var i = 0; i < wrappers.length; i++) {
        var wrapper = $(wrappers[i]);
        var content = wrapper.children();
        var contentWidth = content.width();
        // console.log(contentWidth);
        if (contentWidth > wrapperWidth) {
            doMove(wrapper, content, contentWidth);
        }
    }

    function doMove(wrapper, content, contentWidth) {
        var contentSibling = content.siblings();
        if (contentSibling.length == 0) {
            content.css('padding-right', '100px');
            contentSibling = content.clone();
            wrapper.append(contentSibling);
        }
        var moveLength = contentWidth + 100;
        var moveDur = parseInt(moveLength / zbdp.configData.moveHorizontalSpeed) * 1000;
        content.animate({
            marginLeft: -moveLength + 'px'
        }, moveDur, function() {
            content.css('margin-left', '0px').appendTo(wrapper);
            setTimeout(function() {
                doMove(wrapper, contentSibling, contentWidth);
            }, 2000);
        });
    }
}
