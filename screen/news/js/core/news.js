zbdp.initNews = function () {
    var id = zbdp.getUrlParams("id");
    var scene_level = zbdp.getUrlParams("scene_level");
    var zjUrl = serverDomain + '/wcm/bigdata.do?group=%E5%B9%BF%E4%B8%9C&modelid=searchNew&page_no=0&page_size=20&serviceid=recentpolicy&type=0';
    var nationUrl = serverDomain + '/wcm/bigdata.do?group=&modelid=searchNew&page_no=0&page_size=20&serviceid=recentpolicy&type=0';

    var myDate = new Date();

    var month = getDay(myDate.getMonth() + 1);
    var day = getDay(myDate.getDate());
    var history = serverDomain + '/wcm/bigdata.do?day=' + day + '&groupname_type=4&modelid=get&month=' + month + '&page_no=0&page_size=10&serviceid=todayinhistory';


    function getDay(params) {
        return params < 10 ? "0" + params : params + "";
    }

//	var groupUlr = serverDomain + '/screen/Corp/get?id=' + id + '&scene_level=' + scene_level;
    //var zjUrl ='js/news/core/zhejiang.json';
    //var nationUrl = 'js/news/core/zhejiang.json';
    var todayTimeout = zbdp.configData.todayUpdateInterval || 120;
    var groupTimeout = zbdp.configData.groupUpdateInterval || 120;
    var historyTimeout = zbdp.configData.historyUpdateInterval || 120;

    drawNationNews(nationUrl);
    drawZJNews(zjUrl);
    drawhistorynews(history)

    //drawGroupNews(groupUlr);

    function drawNationNews(nationUrl) {
        var label = 'nation';
        $.ajax({
            type: "get",
            url: nationUrl,
            //async: true,
            dataType: "JSON",
            success: function (data) {
                //data = JSON.parse(data);
                zbdp.drawNews(data, label);
                //keys = keys.reverse();
                //arr = arr.reverse();
            },
            error: function (data) {
                alert("数据出错啦");
            }


        });
    }

    function drawZJNews(url) {
        var label = 'guangdong';
        $.ajax({
            type: "get",
            url: zjUrl,
            //async: true,
            dataType: "JSON",
            success: function (data) {
                //data = JSON.parse(data);
                zbdp.drawNews(data, label);
                //keys = keys.reverse();
                //arr = arr.reverse();
            },
            error: function (data) {
                alert("数据出错啦");
            }
            //setTimeout(function() {
            //	window.location.reload();
            //}, todayTimeout * 1000);
        });
    }

    function drawhistorynews(url) {
        var label = 'group';
        $.ajax({
            type: "get",
            url: url,
            //async: true,
            dataType: "JSON",
            success: function (data) {
                //data = JSON.parse(data);
                zbdp.drawNews(data, label);
                //keys = keys.reverse();
                //arr = arr.reverse();
            },
            error: function (data) {
                alert("数据出错啦");
            }


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

zbdp.drawNews = function (data, label) {

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
    } else if (label == 'guangdong') {
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
        dataArr = data.PAGEDLIST.PAGEITEMS;
        if (!dataArr) {
            return;
        }
        element = $('.news-group-content');
        markEle = null;
        moveVSelector = 'news-item-wrapper';
        moveHSelector = 'news-item-detail-wrapper';
        moveThread = 6;

        element.empty();
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
        for (var i = 0; i < dataArr.length; i++) {
            var item = dataArr[i];

            var itemWrapper = document.createElement('div');
            itemWrapper.classList.add('news-item-wrapper');

            var itemSite = document.createElement('div');
            itemSite.classList.add('news-item-site');
            itemSite.innerText = item.HISTORYDATE.slice(0,11);
            itemWrapper.appendChild(itemSite);

            var itemDetailWrapper = document.createElement('div');
            itemDetailWrapper.classList.add('news-item-detail-wrapper');
            itemDetailWrapper.innerHTML = '<div class="news-item-detail">' + item.CONTENT + '</div>'
            itemWrapper.appendChild(itemDetailWrapper);

            element.append(itemWrapper);

        }

        zbdp.moveVerticalCancel(label);
        if (dataArr.length >= moveThread) {
            // zbdp.moveVertical(element, moveVSelector, label);
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
        console.log(dataArr.length);
        if (dataArr.length >= moveThread) {
            // zbdp.moveVertical(element, moveVSelector, label);
        }

    }
    if (element) {
        setTimeout(function () {
            zbdp.moveHorizental(element, moveHSelector, label);
        }, 3000)

    }
    // if (elementTop) {
    //     setTimeout(function () {
    //         // zbdp.moveHorizental(elementTop, moveHSelector, label);
    //     }, 1000)
    //
    // }
    // if (elementBottom) {
    //     zbdp.moveHorizental(elementBottom, moveHSelector, label);
    // }

};

/**
 * [getUrlParams description] 获取路由参数
 * @param  {[type]} params [description] 要获取的参数名
 * @return {[type]}        [description]
 */
zbdp.getUrlParams = function (params) {
    var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
    var paramsData = window.location.search.substr(1).match(reg);
    return !!paramsData ? paramsData[2] : "0";
};