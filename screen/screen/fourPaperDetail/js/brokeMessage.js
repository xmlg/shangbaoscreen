/**
 * description: 左侧爆料信息详情
 * author: he.zhikai
 * date: 2016/12/16
 */
'use strict';
(function() {
	var scrollSpeed = 0.2, //滚动速度
		stayTime = 6000, //每条数据的停留时间
		itemHeight = [], //每条数据的高度
		thisHeight, //每一次的滚动位移
		containHeight, //容器高度
		//isLongSection = false, //是否为长数据（高度大于容器的数据）
		startTime, //开始第一次滚动的计时器
		continueTime, //持续滚动的计时器
		endTime, //结束滚动的计时器
        reloadTime; //请求数据失败的计时器
    
    initData();

    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
    	clearTimeout(endTime);
        clearTimeout(reloadTime);
    	var params = {};
    	var requestData = new HttpService();
    	requestData.httpServer("/isearch/front/storme_news.jhtml?pageSize=10", params, "get").done(function(data_news) {
            var data = [];
                for(var j=0; j<data_news.length; j++) {
                    switch(data_news[j].FROM) {
                        case '': 
                        data_news[j].TYPE = "";
                        data.push(data_news[j]);
                        break;
                        case '新浪客户端':
                        data_news[j].TYPE = 'xl';
                        data.push(data_news[j]);
                        break;
                        case '新华社客户端':
                        data_news[j].TYPE = 'xhs';
                        data.push(data_news[j]);
                        break;
                        // case '城市通客户端':
                        // data[j].TYPE = 'chenshitong';
                        // break;
                        // case '甬派客户端':
                        // data[j].TYPE = 'yongpai';
                        // break;
                        // case '爱湖州客户端':
                        // data[j].TYPE = 'aihuzhou';
                        // break;
                        case '浙江24小时客户端':
                        data_news[j].TYPE = 'zj24';
                        data.push(data_news[j]);
                        break;
                        case '澎湃客户端':
                        data_news[j].TYPE = 'pengpai';
                        data.push(data_news[j]);
                        break;  
                        default:
                        data_news[j].TYPE = "";
                        data.push(data_news[j]);               
                    }
                }
    		var html = "";
    		for (var i = 0; i < data.length; i++) {
                data[i].code = data[i].code != null ? data[i].code : "";
                var title = data[i].TYPE == "" ? '<div class="item_id">'+data[i].source+'</div>' : '<div class="item_id client clientlogo"><img src="images/' + data[i].TYPE + '.png"></div>';
    		    var itemId = "item" + i;
                var itemTextId = "item_text" + i;
                var date = new Date();  
                date.setTime(Number(data[i].time));  
                data[i].time = date.Format("yyyy-MM-dd HH:mm:ss");  
    		    html = '<div class="item" id="' + itemId + '">' 
    		    		+ title 
    		    		+ '<div class="item_content">' 
    		    			+ '<div class="item_details">' 
    		    				+ '<span class="item_time">' + data[i].time + '</span>' 
    		    				+ '<span class="item_name">' + data[i].name + '</span>' 
    		    				+ '<span class="item_from">' + data[i].code + '</span>' 
    		    			+ '</div>' 
    		    			+ '<div class="item_text" id="' + itemTextId + '">' + data[i].content.substring(0,50) + '</div>' 
    		    		+ '</div>'
    		    	 + '</div>';
    		    $('#brokeMessage').append(html);
    		    $("#brokeMessage").fadeIn(1000);
    		    var textHeight = document.getElementById(itemTextId).offsetHeight; //获取文本高度
    		    document.getElementById(itemId).style.height = textHeight + 70 + 'px'; //根据文本高度填充最外层div高度
    		    itemHeight.push(textHeight + 185);  //数组中添加每条数据的高度
    		    if(i>0 && i+1==data.length) { //为最后一条数据下方留空，空间为倒数第二条数据的高度
    		    	var preItemTextId = "item_text" + (i-1);
    		    	var preTextHeight = document.getElementById(preItemTextId).offsetHeight + 70 + 'px';
    		    	$('#brokeMessage').css('padding-bottom', preTextHeight);
    		    }                  
    		}
    		containHeight = $('#brokeContent').height(); //获得容器高度
            //释放内存，防止浏览器崩溃
            params = null;
            requestData = null;
            data = null;
            j = null;
            html = null;
            i = null;
            title = null;
            itemId = null;
            itemTextId = null;
            textHeight = null;
            preItemTextId = null;
            preTextHeight = null;
    		startTime = setTimeout(function() { //开始第一次滚动前先停留12秒
    			messageScroll();
    		}, stayTime);
    	}).fail(function() {
            reloadTime = setTimeout(function() {
                //释放内存，防止浏览器崩溃
                params = null;
                requestData = null;
                initData();
            }, 3000)
        });
    }

    Date.prototype.Format = function (fmt) { //author: meizz   
        var o = {  
            "M+": this.getMonth() + 1, //月份   
            "d+": this.getDate(), //日   
            "H+": this.getHours(), //小时   
            "m+": this.getMinutes(), //分   
            "s+": this.getSeconds(), //秒   
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
            "S": this.getMilliseconds() //毫秒   
        };  
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));  
        for (var k in o)  
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));  
        return fmt;  
    }  

    /**
     * [messageScroll description] 数据滚动效果
     * @param  {[type]} i             [description]
     * @param  {[type]} allItemHeight [description]
     * @return {[type]}               [description]
     */
    function messageScroll(i, allItemHeight) {
    	clearTimeout(startTime);
        if(typeof(i) == "undefined") {
            var i = 0;
        }
    	if(typeof(itemHeight[i+1]) == "undefined" || i == 49) { //最后一条数据不再滚动，刷新数据
    		clearTimeout(continueTime);
    		$("#brokeMessage").fadeOut(1000);
    		endTime = setTimeout(function() {
    			$('#brokeMessage').html("");
    			itemHeight = [];
    			initData();
    		}, 1000);
    	} else {
            //滚动的总高度
            if(typeof(allItemHeight) == "undefined") {
                var allItemHeight = 0;
            }
    		// if(itemHeight[i] - 115 > containHeight && isLongSection === false) { //如果是长数据则分批滚动
    		// 	thisHeight = itemHeight[i] - containHeight - 20;
    		// 	allItemHeight += thisHeight;
    		// 	isLongSection = true;
    		// } else if(itemHeight[i]>containHeight && isLongSection === true) {
    		// 	thisHeight = containHeight + 20
    		// 	allItemHeight += thisHeight;
    		// 	isLongSection = false;
    		// } else { //滚动的高度为当前数据的自身高度
    		// 	thisHeight = itemHeight[i];
    		// 	allItemHeight += itemHeight[i];
    		// }
            thisHeight = itemHeight[i];
            allItemHeight += itemHeight[i];
    		$('#brokeContent').animate({
    			"scrollTop": allItemHeight + "px"
    		}, 
    		thisHeight / scrollSpeed, //保持滚动速度一致
    		'linear',
    		function() {
    			continueTime = setTimeout(function() {
    				//i = isLongSection===true ? i : i+1;
                    i++;
    				messageScroll(i, allItemHeight);
    			}, stayTime);
    		});
    	}
    }

})();
