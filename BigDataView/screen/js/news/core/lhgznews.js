zbdp.initNews = function(time) {
    var myDate = new Date();
	var today = myDate.format("yyyy-MM-dd");
    var XHSUrl = '/wcm/bigdata.do?date='+today+'&modelid=foreign&page_no=0&page_size=5&serviceid=hotWords&typeid=widget';
    var nationData = '/lhjk/getJson?name=focus';
    var todayTimeout = zbdp.configData.todayUpdateInterval || 120;
    var groupTimeout = zbdp.configData.groupUpdateInterval || 120;

    drawXhsNews(nationData);
    drawNationNews(XHSUrl);
    //drawZJNews(zjUrl);
    //drawGroupNews(groupUlr);
    function drawXhsNews(nationData) {
        var label = 'XHS';
        $.ajax({
            url: nationData,
            /* url: wcmUrl,
            data: {
              url:nationData
            }, */

            type: "get",
            dataType: "json",
            success: function(datastr){

                //var data = datastr.DATA;
                var data = datastr.PAGEITEMS;

                //console.log(data)
                zbdp.drawNews(data, label);
                setTimeout(function() {
                    drawXhsNews(XHSUrl);
                }, todayTimeout * 1000);
            }
        })

    }
    function drawNationNews(url) {
        var label = 'nation';
        $.ajax({
            url: url,
            data: {},
            type: "get",
            dataType: "json",
            success: function(datastr){
                var data = datastr.PAGEITEMS;
                //console.log(data)
                zbdp.drawNews(data, label);
                setTimeout(function() {
                    drawNationNews(nationUrl);
                }, groupTimeout * 1000);
            }
        })

    }


}

zbdp.drawNews = function(data, label) {

    // function draw(data, label) {
    var dataArr,
        element,
        elementTop,
        elementBottom,
        markEle, //页面显示数据量
        moveThread, //垂直滚动需要有的条目数量
        moveVSelector, //垂直滚动的选择符
        moveHSelector, //水平滚动的选择符
        moveTitle;//水平滚动title

    if (label == 'XHS') {
        dataArr = data;
        if (!dataArr) {
            return;
        }
        element = $('.news-today-xhs');
        markEle = $('.news-today-xhs-maker span');
        moveVSelector = 'news-item-wrapper';
        moveHSelector = 'news-item-detail-wrapper';
        moveTitle = 'news-item-site-wrapper';
        moveThread = 4;

        element.empty();
    }else if(label == 'nation'){
        dataArr = data;
        console.log(dataArr);
        if (!dataArr) {
            return;
        }
        element = $('.news-today-nation');
        markEle = $('.news-today-nation-maker span');
        moveVSelector = 'news-item-wrapper';
        moveHSelector = 'news-item-detail-wrapper';
        moveTitle = 'news-item-site-wrapper';
        moveThread = 4;

        element.empty();
    }
    //显示数量
    if (markEle && markEle.length > 0) {
        markEle.text(data.length);
    }

    //
    //循环增加信息条目


    for (var i = 0; i < dataArr.length; i++) {
        var item = dataArr[i];

        var itemWrapper = document.createElement('div');
        itemWrapper.classList.add('news-item-wrapper');

        var itemSite = document.createElement('div');
        itemSite.classList.add('news-item-site-wrapper');
        //itemSite.innerHTML = '<div class="news-item-site">'+item.IR_AUTHORS+"&nbsp;&nbsp;"+item.IR_URLTIME+"&nbsp;&nbsp;<i class='prcount'></i>"+item.IR_PRCOUNT+'</div>';
        itemWrapper.appendChild(itemSite);

        var itemDetailWrapper = document.createElement('div');
        itemDetailWrapper.classList.add('news-item-detail-wrapper');
        //itemDetailWrapper.innerHTML = '<div class="news-item-detail"><a href="'+item.IR_URLNAME+'" target="_blank">' + item.IR_URLTITLE + '</a></div>'
        if(label == 'nation'){
            itemSite.innerHTML = '<div class="news-item-site">'+item.TITLE+"&nbsp;&nbsp;"+format(item.URLTIME)+'</div>';
            itemDetailWrapper.innerHTML = '<div class="news-item-detail"><a href="'+item.ir_urlname+'" target="_blank">' + item.CONTENT + '</a></div>'

        }else{
            itemSite.innerHTML = '<div class="news-item-site">'+format(item.URLTIME)+'</div>';
            itemDetailWrapper.innerHTML = '<div class="news-item-detail"><a href="'+item.URLNAME+'" target="_blank">' + item.TITLE + '</a></div>'

        }
        itemWrapper.appendChild(itemDetailWrapper);


        element.append(itemWrapper);
    }

    zbdp.moveVerticalCancel(label);
    if (dataArr.length >= moveThread) {
        zbdp.moveVertical(element, moveVSelector, label);
    }


    if (element) {
        zbdp.moveHorizental(element, moveHSelector, label);
        zbdp.moveHorizental(element, moveTitle, label);

    }
    //if (elementTop) {
    // zbdp.moveHorizental(elementTop, moveHSelector, label);
    //}
    //if (elementBottom) {
    // zbdp.moveHorizental(elementBottom, moveHSelector, label);
    //}

    function add0(m){return m<10?'0'+m:m }
    function format(shijianchuo)
    {
//shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth()+1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
    }


};



