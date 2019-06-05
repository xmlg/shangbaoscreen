zbdp.initSentiment = function() {
    var sentimentUrl = 'js/sentimenttest/core/szyq.json'
	
   // var sentimentUrl = serverDomain + '/screen/globalsen/sentiment?page_no=1&page_size=' + zbdp.configData.pageSize;
    $.get(sentimentUrl, function(data, state) {
        if (state == 'success') {
            console.log('获取数据<全球涉浙舆情>成功');
          //  var data = JSON.parse(datastr);
            // var data = zbdp.getSentimentData(true);

            zbdp.initDrawMap(zbdp.getMapData(data.SENTIMENTS));

            zbdp.updateSentimentCount(data.POSITIVENUM, data.NEUTRALNUM, data.NEGATIVENUM, true);

            zbdp.appendSentimentItmes(data.SENTIMENTS);

            zbdp.moveHorizental('sentiment-items-wrapper', 'content', 'all');

        } else {
            console.log('获取数据<全球涉浙舆情>失败');
        }

        setTimeout(function() {
            zbdp.updateSentiment();
        }, zbdp.configData.updateSentimentDelay * 1000);
    });
}

zbdp.updateSentiment = function() {
    var sentimentUrl = connectUrl(serverDomain + '/screen/globalsen/sentiment?page_no=1&page_size=' + zbdp.configData.pageSize);
    $.get(sentimentUrl, function(datastr, state) {
        if (state == 'success') {
            console.log('获取数据<全球涉浙舆情>成功');
            var data = JSON.parse(datastr);
            // var data = zbdp.getSentimentData();

            zbdp.updateMap(zbdp.getMapData(data.SENTIMENTS));

            zbdp.updateSentimentCount(data.POSITIVENUM, data.NEUTRALNUM, data.NEGATIVENUM);

            zbdp.insertSentimentItmes(data.SENTIMENTS);
        } else {
            console.log('获取数据<全球涉浙舆情>失败');
        }
        setTimeout(function() {
            zbdp.updateSentiment();
        }, zbdp.configData.updateSentimentDelay * 1000);
    });
}

/**
 * 根据获得的信息条目得到地图需要的数据
 */
zbdp.getMapData = function(data) {
    var result = [];
    var geoCoord = zbdp.getGeoCoordData();
    for (var i = 0; i < data.length; i++) {
        var item = {};
        if (!data[i].AREA || data[i].AREA.indexOf(';') > 0) {
            continue;
        }
        item.name = data[i].AREA;
        item.value = parseInt(data[i].FEELNUM);
        item.geo = geoCoord[item.name] || [];
        result.push(item);
    }
    return result;
}

zbdp.updateSentimentCount = function(pos, neu, neg, init) {
    if (init) {
        $('.sentiment-count-item.positive .item-value.old').text(pos);
        $('.sentiment-count-item.neutral .item-value').text(neu);
        $('.sentiment-count-item.negative .item-value').text(neg);
    } else {
        var orgPos = $('.sentiment-count-item.positive .item-value.old').text();
        var orgNeu = $('.sentiment-count-item.neutral .item-value.old').text();
        var orgNeg = $('.sentiment-count-item.negative .item-value.old').text();
        if (parseInt(pos) != parseInt(orgPos)) {
            updateCount('.positive .inner-ring', pos);
        }
        if (parseInt(neu) != parseInt(orgNeu)) {
            updateCount('.neutral .inner-ring', neu);
        }
        if (parseInt(neg) != parseInt(orgNeg)) {
            updateCount('.negative .inner-ring', neg);
        }
    }

    function updateCount(selector, count) {
        var wrapper = $(selector);
        var oldD = wrapper.find('.item-value.old');
        var newD = wrapper.find('.item-value.new');
        newD.text(count);
        oldD.animate({
            marginTop: '-80px'
        }, 2000, function() { //通过取负margin值，隐藏第一行
            oldD.css('marginTop', 0).appendTo(wrapper); //隐藏后，将该行的margin值置零，并插入到最后，实现无缝滚动
            oldD.toggleClass('old new');
            newD.toggleClass('old new');
        });
    }

}

/**
 * flag是否是初次加载
 * true-已加载；false-未加载
 * 初次加载直接放入就可以
 * 单独添加需要执行进入效果，且只剩余三条
 */
zbdp.appendSentimentItmes = function(items) {
    if (!items) {
        return;
    }
    var wrapper = $('.sentiment-items-wrapper');
    if (wrapper.length == 0) {
        return;
    }

    wrapper.empty();

    for (var i = 0; i < items.length; i++) {
        var item = items[i];

        var itemWrapper = document.createElement('div');
        itemWrapper.classList.add('sentiment-item');
        var value = item.FEELNUM;
        if (parseInt(value) < 0) {
            itemWrapper.classList.add('negative');
        }

        var index = document.createElement('div');
        index.classList.add('index');
        index.innerText = value;

        var content = document.createElement('div');
        content.classList.add('content');
        var detail = document.createElement('div');
        detail.classList.add('content-detail');
        detail.innerText = item.TITLE;
        content.appendChild(detail);

        var source = document.createElement('div');
        source.classList.add('source');
        source.innerText = item.SOURCE;

        var time = document.createElement('div');
        time.classList.add('time');
        var formateDate = zbdp.formateDate(item.TIME);
        if (formateDate.isToday) {
            var ago = document.createElement('time');
            ago.classList.add('timeago');
            ago.setAttribute('datetime', item.TIME);
            time.appendChild(ago);
        } else {
            time.innerText = formateDate.date;
        }

        itemWrapper.appendChild(index);
        itemWrapper.appendChild(content);
        itemWrapper.appendChild(source);
        itemWrapper.appendChild(time);
        wrapper.append(itemWrapper);
    }
    $('time.timeago').timeago();
}
zbdp.insertSentimentItmes = function(items) {
    var wrapper = $('.sentiment-items-wrapper');
    if (wrapper.length == 0) {
        return;
    }
    if (!items && items.length == 0) {
        return;
    }

    var delay = 2500;

    chunk(items, insertSingleItem);

    function chunk(array, process, context) {
        setTimeout(function() {
            var item = array.shift();
            if (typeof item != 'undefined') {
                process.call(context, item);
                deleteItems();
            }
            if (array.length > 0) {
                setTimeout(arguments.callee, delay);
            }
        }, delay);
    }

    function deleteItems() {
        var itemsDom = $('.sentiment-items .sentiment-item');
        for (var i = itemsDom.length - 1; i > 3; i--) {
            var item = itemsDom[i];
            $(item).remove();
        }
    }

    function insertSingleItem(item) {
        var itemWrapper = document.createElement('div');
        itemWrapper.classList.add('sentiment-item');
        var value = item.FEELNUM;
        if (parseInt(value) < 0) {
            itemWrapper.classList.add('negative');
        }

        var index = document.createElement('div');
        index.classList.add('index');
        index.innerText = value;

        var content = document.createElement('div');
        content.classList.add('content');
        var detail = document.createElement('div');
        detail.classList.add('content-detail');
        detail.innerText = item.TITLE;
        content.appendChild(detail);

        var source = document.createElement('div');
        source.classList.add('source');
        source.innerText = item.SOURCE;

        var time = document.createElement('div');
        time.classList.add('time');
        /*var ago = document.createElement('time');
        ago.classList.add('timeago');
        ago.setAttribute('datetime', item.TIME);
        time.appendChild(ago);*/
        var formateDate = zbdp.formateDate(item.TIME);
        var ago;
        if (formateDate.isToday) {
            ago = document.createElement('time');
            ago.classList.add('timeago');
            ago.setAttribute('datetime', item.TIME);
            time.appendChild(ago);
        } else {
            time.innerText = formateDate.date;
        }

        itemWrapper.appendChild(index);
        itemWrapper.appendChild(content);
        itemWrapper.appendChild(source);
        itemWrapper.appendChild(time);

        itemWrapper.style.marginTop = '-70px';
        wrapper.prepend(itemWrapper);

        if (ago) {
            $(ago).timeago();
        }

        $(itemWrapper).animate({
            marginTop: '0px'
        }, 2000, function() {
            zbdp.moveHorizental($(content));
        });
    }
}


/**
 * 水平滚动,容器内的所有
 * 
 * @param  {[type]} container 内容的容器
 * @param  {[type]} selector  内容
 *
 * flag==all表示滚动容器内的所有selector下的内容
 * flag不穿时，表示滚动单个，需要传递一个节点node
 */
zbdp.moveHorizental = function(container, selector, flag) {
    if (flag && flag == 'all') {
        if (typeof container == 'string') {
            container = $('.' + container);
        }
        var wrappers = container.find('.' + selector);
        var wrapperWidth = $(wrappers[0]).width();
        for (var i = 0; i < wrappers.length; i++) {
            var wrapper = $(wrappers[i]);
            var content = wrapper.children();
            var contentWidth = content.width();
            if (contentWidth > wrapperWidth) {
                doMove(wrapper, content, contentWidth);
            }
        }
    } else {
        var wrapper = container; //此时需要是个节点
        var content = wrapper.children();
        var contentWidth = content.width();
        var wrapperWidth = wrapper.width();
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
