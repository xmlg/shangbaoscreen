﻿zbdp.initNews = function(time) {

    var XHSUrl = '/lhjk/getJson?name=twitterNew';
    // var nationData = bigDataUrl+XNbigUrl+'?catalogid=0&modelid=wechatrankdoc&pagecode=1&serviceid=wechatranklist1&typeid=widget';
    var todayTimeout = zbdp.configData.todayUpdateInterval || 120;
    var groupTimeout = zbdp.configData.groupUpdateInterval || 120;

    // drawXhsNews(nationData);
    drawNationNews(XHSUrl);
    //drawZJNews(zjUrl);
    //drawGroupNews(groupUlr);
    // function drawXhsNews(nationData) {
    //     console.log(wcmUrl);
    //     var label = 'XHS';
    //     $.ajax({
    //         url: nationData,
    //         /* url: wcmUrl,
    //         data: {
    //           url:nationData
    //         }, */
    //
    //         type: "get",
    //         dataType: "json",
    //         success: function(datastr){
    //             console.log(datastr);
    //
    //             //var data = datastr.DATA;
    //             var data = datastr;
    //
    //             //console.log(data)
    //             zbdp.drawNews(data, label);
    //             setTimeout(function() {
    //                 drawXhsNews(XHSUrl);
    //             }, todayTimeout * 1000);
    //         }
    //     })
    //
    // }
    function drawNationNews(url) {
        var label = 'nation';
        console.log(url);
        $.ajax({
            url: url,
            data: {},
            type: "get",
            dataType: "json",
            success: function(datastr){
                console.log(datastr);
                var data = datastr;
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
        dataArr = data.PAGEITEMS;
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
        dataArr = data.PAGEITEMS;
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
        markEle.text(data.PAGEITEMS.length);
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
        itemSite.innerHTML = '<div class="news-item-site">'+item.IRAUTHORS+"&nbsp;&nbsp;"+item.IRURLDATE+"&nbsp;&nbsp;"+'</div>';
        itemWrapper.appendChild(itemSite);

        var itemDetailWrapper = document.createElement('div');
        itemDetailWrapper.classList.add('news-item-detail-wrapper');
        //itemDetailWrapper.innerHTML = '<div class="news-item-detail"><a href="'+item.IR_URLNAME+'" target="_blank">' + item.IR_URLTITLE + '</a></div>'
        itemDetailWrapper.innerHTML = '<div class="news-item-detail"><a href="'+item.ir_urlname+'" target="_blank">' + item.IRCONTENT + '</a></div>'
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

};



