zbdp.drawHeadline = function() {
    // var paperHeadlineUrl = 'js/headline/core/zhimei.json';
    // var networkHeadlineUrl = 'js/headline/core/wangmei.json';
    var paperHeadlineUrl = "/wcm/bigdata.do?modelid=get&serviceid=papermediahistogram&time_range=1&typeid=widget&user_id=admin&department=140518";
    var networkHeadlineUrl = "/wcm/bigdata.do?dict_num=000&modelid=get&serviceid=networkmediahistogram&time_range=3&user_id=admin&department=140518";
    var abroadUrl="/wcm/bigdata.do?modelid=get&page_no=0&page_size=6&serviceid=abroad_clue&typeid=widget&user_id=admin&department=140518";
    var chinaUrl="/wcm/bigdata.do?modelid=getranklist&serviceid=wechatranklist&typeid=widget&wxbd_id=wxbd_001001&user_id=admin&department=140518";
    zbdp.drawPageHeadline(paperHeadlineUrl);
    zbdp.drawNetworkHeadline(networkHeadlineUrl);
    zbdp.drawAbroad(abroadUrl);
    zbdp.drawChina(chinaUrl);
}

/**
 * 来源于国外
 * @param url
 */
zbdp.drawAbroad = function(url) {
    $.ajax({
        type: "GET",
        url:url,
        dataType: "json",
        success: function(data){
            var item=data.CONTENT;
            if (item.length > 0) {
                //国外线索
                var element = $('.headline-abroad .content-items-wrapper');
                element.empty();
                item.forEach(function(_data,index,array){
                    var itemDiv = document.createElement('div');
                    itemDiv.classList.add('content-item');
                    var itemDesc = document.createElement('div');
                    itemDesc.classList.add('content-item-desc');
                    var itemDescSpan = document.createElement('span');
                    itemDescSpan.innerHTML = (index + 1) + '.' +"<font color='#fff600'>"+_data.URL_DOMAIN+"</font>      "+ _data.CONTENT;
                    itemDesc.appendChild(itemDescSpan);
                    itemDiv.appendChild(itemDesc);
                    itemDescSpan.style.color='rgb(23, 225, 243)';
                    element.append(itemDiv);
                })
                titleScroll();
            }
        }
    });
}
/**
 * 来源于国内
 * @param url
 */
zbdp.drawChina = function(url) {
    //微信
    $.ajax({
        type: "GET",
        url:url,
        dataType: "json",
        success: function(data){
            var item=data;
            if (item.length > 0) {
                //国内线索
                var element = $('.headline-china .content-items-wrapper');
                element.empty();
                item.forEach(function(_data,index,array){
                    var itemDiv = document.createElement('div');
                    itemDiv.classList.add('content-item');
                    var itemDesc = document.createElement('div');
                    itemDesc.classList.add('content-item-desc');
                    var itemDescSpan = document.createElement('span');
                    itemDescSpan.innerHTML ="<img src='./images/ico_1.png' height='25px' /> " +(index + 1) + '.' + _data.TITLE;
                    itemDesc.appendChild(itemDescSpan);
                    itemDiv.appendChild(itemDesc);
                    itemDescSpan.style.color='rgb(23, 225, 243)';
                    if(index>1)
                        return false;
                    element.append(itemDiv);
                });
            }
            getZC();
        }
    });
    function getZC(){
        //政策
        $.ajax({
            type: "GET",
            url:"/wcm/bigdata.do?modelid=search&page_no=0&page_size=20&region=china&search_word=&serviceid=recentpolicy&typeid=widget&user_id=admin&department=140518",
            dataType: "json",
            success: function(data){
                var item=data.PAGEDLIST.PAGEITEMS;
                if (item.length > 0) {
                    //国内线索
                    var element = $('.headline-china .content-items-wrapper');
                    item.forEach(function(_data,index,array){
                        var itemDiv = document.createElement('div');
                        itemDiv.classList.add('content-item');
                        var itemDesc = document.createElement('div');
                        itemDesc.classList.add('content-item-desc');
                        var itemDescSpan = document.createElement('span');
                        itemDescSpan.innerHTML ="<img src='./images/ico_2.png' height='25px' /> " + (index + 3) + '.' + _data.URLTITLE.replace(/\r\n/g,"");
                        itemDesc.appendChild(itemDescSpan);
                        itemDiv.appendChild(itemDesc);
                        itemDescSpan.style.color='rgb(23, 225, 243)';
                        if(index>1)
                            return false;
                        element.append(itemDiv);
                    });
                    // titleScroll();
                }
                weibo();
            }
        });
    }
function weibo(){
    //微博
    var element = $('.headline-china .content-items-wrapper');
    var item=new Array();
    var data1={"URLTITLE":"央视批支付宝\"圈子\":要有底线意识 别学百度"};
    var data2={"URLTITLE":"社评：在中国，骂卡斯特罗的是些什么人"};
    item.push(data1);
    item.push(data2);
    item.forEach(function(_data,index,array){

        var itemDiv = document.createElement('div');
        itemDiv.classList.add('content-item');
        var itemDesc = document.createElement('div');
        itemDesc.classList.add('content-item-desc');
        var itemDescSpan = document.createElement('span');
        itemDescSpan.innerHTML ="<img src='./images/ico_3.png' height='25px' /> " + (index + 5) + '.' + _data.URLTITLE.replace(/\r\n/g,"");
        itemDesc.appendChild(itemDescSpan);
        itemDiv.appendChild(itemDesc);
        itemDescSpan.style.color='rgb(23, 225, 243)';
        if(index>1)
            return false;
        element.append(itemDiv);
    });
    titleScroll();
}

}
/**
 * 纸媒头版
 * @param url
 */
zbdp.drawPageHeadline = function(url) {
    $.get(url, function(data, state) {
        if (state == 'success') {
            // console.log('获取数据<纸媒头版>成功');
            var data = JSON.parse(data);
            //对标题进行过滤  去除所有空格后长度小于6的不进行展示
            var removeData=new Array();

            for(var i in data){
                // console.log(data[i].SHORTTITLE);
                if(data[i].SHORTTITLE.replace(/\s+/g,"").length<6)
                    removeData.push(data[i]);
                if(data[i].SHORTTITLE=="中共中央举行"){
                    removeData.push(data[i]);
                }
            }
            data=arrayRemove(data,removeData);
            //数组排序   便于展示
            data.sort(function(value1, value2) {
                var num1 = parseInt(value1.TOTALNUMBER);
                var num2 = parseInt(value2.TOTALNUMBER);
                return num2 - num1;
            });
            if (data.length > 0) {
                var maxValue = parseInt(data[0].TOTALNUMBER || 1);
                //纸媒头版
                var element = $('.headline-paper .content-items-wrapper');
                element.empty();
                appendHeadline(element, data, maxValue, true,true);
            }
        } else {
            // zbdp.tip.info('获取数据<纸媒头版>失败');
            console.log('获取数据<纸媒头版>失败');
        }
    });
}
/**
 * 网媒头版
 * @param url
 */
zbdp.drawNetworkHeadline = function(url) {
    $.get(url, function(data, state) {
        if (state == 'success') {
            // console.log('获取数据<网媒头条>成功');

            var data = JSON.parse(data);
            //对标题进行过滤  去除所有空格后长度小于6的不进行展示
            var removeData=new Array();
            for(var i in data){
                if(data[i].SHORTTITLE.replace(/\s+/g,"").length<6)
                    removeData.push(data[i]);
            }
            data=arrayRemove(data,removeData);
            //数组排序   便于展示
            data.sort(function(value1, value2) {
                var num1 = parseInt(value1.TOTALNUMBER);
                var num2 = parseInt(value2.TOTALNUMBER);
                return num2 - num1;
            });
            if (data.length > 0) {
                var maxValue = parseInt(data[0].TOTALNUMBER || 1);
                //网媒头版
                var element = $('.headline-network .content-items-wrapper');
                element.empty();
                appendHeadline(element, data, maxValue, false,true);
            }

        } else {
            // zbdp.tip.info('获取数据<网媒头条>失败');
            console.log('获取数据<网媒头条>失败');
        }
    });
}

/**
 * 两个头版
 * @param container
 * @param data
 * @param maxValue
 * @param isPaper
 */
function appendHeadline(container, data, maxValue, isPaper) {

    for (var i = 0; i < data.length&&i<6; i++) {
        // console.log(data)
        var item = data[i];
        //判断标题长度  小于5则跳过
        var value;
        if (isPaper) {
            value = item.TOTALNUMBER; //转载数
        } else {
            value = item.TOTALNUMBER; //转载数
        }
        var itemDiv = document.createElement('div');
        itemDiv.classList.add('content-item');
        //右侧柱状图
        var itemBarWrapper = document.createElement('div');
        itemBarWrapper.classList.add('content-item-bar-wrapper');
        var itemBar = document.createElement('div');
        itemBar.classList.add('content-item-bar');
        itemBar.style.backgroundColor = zbdp.configColors[i][0];
        itemBar.style.width = (((parseInt(value) / maxValue).toFixed(2)) * 100) + '%';
        itemBarWrapper.appendChild(itemBar);
        itemDiv.appendChild(itemBarWrapper);
        var itemDesc = document.createElement('div');
        itemDesc.classList.add('content-item-desc');
        var itemDescSpan = document.createElement('span');
        itemDescSpan.innerText = (i+1) + '.' + item.SHORTTITLE;
        itemDesc.appendChild(itemDescSpan);
        itemDiv.appendChild(itemDesc);
        //右侧数值
        var itemValue = document.createElement('div');
        itemValue.classList.add('content-item-value');
        itemValue.style.color = zbdp.configColors[i][1];
        itemValue.innerText = value;
        itemDiv.appendChild(itemValue);
        itemDescSpan.style.color = zbdp.configColors[i][0];
        container.append(itemDiv);
    }
    titleScroll();

}
/**
 * 标题滚动
 * @param timeerID
 * @param text
 */
function titleScroll() {
    var t;
    $(".content-item-desc span").mouseenter(function(){
        var _this=$(this);
        var offl=$(_this).offset().left;
        var offt=$(_this).offset().top;
        function Scroll(span){
            offl--;
            $(span).offset({left:offl,top:offt});
        }
        t=setInterval(function () { Scroll(_this); },10);
    }).mouseleave(function(){
        clearInterval(t);
        $(this).css("left","0");
    });
}
/**
 * 数组相减
 * @param arr1
 * @param arr2
 * @returns {*}
 */
function arrayRemove(arr1,arr2){
    for (var i = arr1.length - 1; i >= 0; i--) {
        a = arr1[i];
        for (var j = arr2.length - 1; j >= 0; j--) {
            b = arr2[j];
            if (a == b) {
                arr1.splice(i, 1);
                arr2.splice(j, 1);
                break;
            }
        }
    }
    return arr1;
}