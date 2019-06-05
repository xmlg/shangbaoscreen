var target; //target:当前展示的item；
var len = 0; //len:每次请求获取的items长度；
var up = 0; //up:每次上移的距离；
var idx = 0; //idx:当前上移位置；
var totalNum = 0; //totalNum:单个item上移总次数；
var curr_idx = 0;

var slidUpSpeed = 4000; //slidUpSpeed:向上移动的速度
var fadeOutTime = 500; //淡出所需时间
var fadeInTime = 500; //淡入所需时间
var stopTime = 500; //停留时间

var stopBeforeTime = 2000; //向上滚动前的停留时间
var fadeOutBeforeTime = 2000; //文字展示的停留时间

var reloadTime; //reloadTime:请求数据失败的计时器
var reloadDelayTime = 3000; //请求数据失败延时3秒重新请求数据

var wrapper = $('.sentiment-items-wrapper');
var itemH = $(wrapper).height();

var params = { //请求参数
    page_no: 1,
    page_size: 10
};
var HS = new HttpService();
zbdp.initSentiment = function() { //初始化数据
    initS();
}

function initS() {
    clearTimeout(reloadTime);
    HS.httpServer(serverDomain + '/screen/globalsen/sentiment', params, "get").done(function(data) {
        console.log('init:获取数据<全球涉浙舆情>成功');
        //var data = JSON.parse(data);

        zbdp.initDrawMap(zbdp.getMapData(data.SENTIMENTS));

        zbdp.updateSentimentCount(data.POSITIVENUM, data.NEUTRALNUM, data.NEGATIVENUM, true);

        zbdp.appendSentimentItmes(data.SENTIMENTS);

        start();
    }).fail(function() {
        reloadTime = setTimeout(function() {
            initS();
        }, reloadDelayTime);
    });
}
zbdp.updateSentiment = function() { //更新数据
    updateS();
}

function updateS() {
    clearTimeout(reloadTime);
    HS.httpServer(serverDomain + '/screen/globalsen/sentiment', params, "get").done(function(data) {
        console.log('刷新：获取数据<全球涉浙舆情>成功');
        //var data = JSON.parse(data);

        zbdp.updateMap(zbdp.getMapData(data.SENTIMENTS));

        zbdp.updateSentimentCount(data.POSITIVENUM, data.NEUTRALNUM, data.NEGATIVENUM);

        zbdp.appendSentimentItmes(data.SENTIMENTS);

        start();
    }).fail(function() {
        reloadTime = setTimeout(function() {
            updateS();
        }, reloadDelayTime);
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
        //兼容地区名称数据不规范问题
        var tempArray = data[i].AREA.split(" ");
        for (var j = 0; j < tempArray.length; j++) {
            if (geoCoord[tempArray[j]] !== undefined) {
                item.name = tempArray[j];
                item.value = parseInt(data[i].FEELNUM);
                item.geo = geoCoord[tempArray[j]];
                result.push(item);
                break;
            }
        }
        /*item.name = data[i].AREA;
        item.value = parseInt(data[i].FEELNUM);
        item.geo = geoCoord[item.name] || [];
        result.push(item);*/
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
    if (wrapper.length == 0) {
        return;
    }

    wrapper.empty();
    len = items.length;
    for (var i = 0; i < len; i++) {
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
        wrapper.fadeIn("slow");
    }
    $(wrapper).children().eq(0).addClass("showCurItem").fadeIn(fadeInTime);
    $('time.timeago').timeago();
}


function start() {
    target = $(wrapper).find(".showCurItem");
    if (curr_idx == len) {
        curr_idx = 0;
        /*setTimeout(function() {*/
        zbdp.updateSentiment();
        /*}, zbdp.configData.updateSentimentDelay * 300);*/
    } else {
        target.fadeIn(fadeInTime, function() {
            var height = target.find(".content-detail").height();
            totalNum = Math.ceil(height / itemH);
            if (height > itemH) {
                doUpMove(target, totalNum);
            } else {
                doFadeOut(target);
            }
        });
    }
}
/**
 * [doUpMove description]item内容多于2行时，上移
 * @param  {[type]} target   [description]
 * @param  {[type]} totalNum [description]
 * @return {[type]}          [description]
 */
function doUpMove(target, totalNum) {
    if (idx < totalNum - 1) {
        up += 140;
        setTimeout(function() {
            target.find(".content-detail").animate({ marginTop: -(up) + "px" }, slidUpSpeed, "linear", function() {
                idx++;
                doUpMove(target, totalNum);
            });
        }, stopBeforeTime);
    } else {
        doFadeOut(target);
    }
}
/**
 * [doFadeOut description]列表淡出
 * @param  {[type]} target [description]
 * @return {[type]}        [description]
 */
function doFadeOut(target) {
    setTimeout(function() {
        target.fadeOut(fadeOutTime, function() {
            target.removeClass("showCurItem").next().addClass("showCurItem");
            totalNum = 0;
            idx = 0;
            up = 0;
            curr_idx += 1;
            start();
        });
    }, fadeOutBeforeTime);
}
