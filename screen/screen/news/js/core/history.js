// page_no = 0;
// var ele = $('.news');
// var elechild = 'news-content-content';
// window.onload = function () {
//     hiddenDiv();
//     showDic();
//     setTimeout(function () {
//         moveHistoryItem(ele);
//     }, 5000)
//
// //	setInterval(function() {
// //		hiddenDiv();
// //		showDic();
// //		setTimeout(function() {
// //			//doScroll(wrappers, n);
// //			moveHistoryItem(ele);
// //		}, 500)
// //	}, 5 * 60 * 1000)
// }
//
// function hiddenDiv() {
//     $('.news').slideUp("slow");
//     $('.news').html('');
//     drawHistoryNews();
//
// }
//
// function showDic() {
//     $('.news').slideDown("slow");
// }
//
// function drawHistoryNews() {
//     var id = getUrlParams("id");
//     var scene_level = getUrlParams("scene_level");
//     var myDate = new Date();
//     var today = myDate.getFullYear() + "-" + myDate.getMonth() + 1 + "-" + myDate.getDate();
//
//     // "/wcm/bigdata.do?day=6&groupname_type=4&modelid=get&month=02&page_no=0&page_size=10&serviceid=todayinhistory"
//
//     function getDay(params) {
//         return params < 10 ? "0" + params : params + "";
//     }
//
//     var month = getDay(myDate.getMonth() + 1);
//     var day = getDay(myDate.getDate());
//     myDate.getMonth()
//     $.ajax({
//         type: "get",
//         url: '/wcm/bigdata.do?day=' + day + '&groupname_type=4&modelid=get&month=' + month + '&page_no=0&page_size=10&serviceid=todayinhistory',
//         async: true,
//         dataType: "JSON",
//         success: function (data) {
//             // data = JSON.parse(data);
//             var TOTALPAGE = data.TOTALPAGE;
//             var data = data.PAGEDLIST.PAGEITEMS;
//             if (page_no < TOTALPAGE - 1) {
//                 page_no++;
//             } else {
//                 page_no = 0;
//             }
//             var keys = [];
//             var arr = [];
//             for (var key in data) {
//                 keys.push(data[key].YEAR);
//                 arr.push(data[key])
//             }
//
//             keys = keys.reverse();
//             arr = arr.reverse();
//             createYearDiv(keys, data);
//         }
//     });
// }
//
// /**
//  * [getUrlParams description] 获取路由参数
//  * @param  {[type]} params [description] 要获取的参数名
//  * @return {[type]}        [description]
//  */
// function getUrlParams(params) {
//     var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
//     var paramsData = window.location.search.substr(1).match(reg);
//     return !!paramsData ? paramsData[2] : "0";
// }
//
// function createYearDiv(keys, data) {
//     var div1 = d3.select('.news').selectAll('div').data(keys);
//     var divArr = div1.enter();
//     divArr.append('div').each(function (d, i) {
//         d3.select(this).classed('news-content-content', true);
//         d3.select(this).append('span').classed('historyYear', true);
//         d3.select(this).selectAll('.historyYear').text(d);
//         var wrapper = d3.select(this).append('div').classed('news-group-item-wrapper active', true);
//         wrapper.text(data[i].CONTENT)
//
//     })
// }
//
// function moveHistoryItem(container) {
//     var wrappers = container.find('.news-content');
//     var wrappers_length = wrappers.length;
//     var wrapperWidth = $(wrappers[0]).width();
//     var n = 0;
//     doScroll(wrappers, n, wrappers_length, wrapperWidth)
// }
//
// //1300 * contentWidth / speed
// function doScroll(wrappers, n, wrappers_length, wrapperWidth) {
//     if (n < wrappers_length) {
//         var speed = 110;
//         var wrappers1 = wrappers[n];
//         var wrapper = $(wrappers1);
//         var content = wrapper.children();
//         $.each(content, function (i, d) {
//             var conentchild = $(d);
//             var contentWidth = conentchild.width();
//             if (contentWidth < wrapperWidth) {
//                 var contentSibling = content.clone();
//                 //wrapper.append(contentSibling);
//                 wrapper.animate({
//                     scrollLeft: 0
//                 }, 1300 * contentWidth / speed, false, function () {
//                     wrapper.scrollLeft(0);
//                     window.setTimeout(function () {
//                         n++;
//                         doScroll(wrappers, n, wrappers_length, wrapperWidth);
//                     }, 5000);
//                 });
//             } else {
//                 var contentSibling = content.clone();
//                 wrapper.append(contentSibling);
//                 wrapper.animate({
//                     scrollLeft: contentWidth
//                 }, 1300 * contentWidth / speed, false, function () {
//                     wrapper.scrollLeft(0);
//                     n++;
//                     doScroll(wrappers, n, wrappers_length, wrapperWidth);
//
//                 });
//             }
//
//             speed = null;
//
//         });
//     } else {
//         //hiddenDiv();
//         showDic();
//         setTimeout(function () {
//             moveHistoryItem(ele);
//         }, 5000)
//     }
//
// }


//新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新新

// zbdp.initNews = function () {
//
//     var myDate = new Date();
//
//     function getDay(params) {
//         return params < 10 ? "0" + params : params + "";
//     }
//
//     var month = getDay(myDate.getMonth() + 1);
//     var day = getDay(myDate.getDate());
//
//     var zjUrl = '/wcm/bigdata.do?day=' + day + '&groupname_type=4&modelid=get&month=' + month + '&page_no=0&page_size=10&serviceid=todayinhistory';
//
//
//     //drawGroupNews(groupUlr);
//
//     function drawZJNews(url) {
//         var label = 'guangdong';
//         $.ajax({
//             type: "get",
//             url: url,
//             //async: true,
//             dataType: "JSON",
//             success: function (data) {
//                 //data = JSON.parse(data);
//                 // zbdp.drawNews(data, label);
//                 //keys = keys.reverse();
//                 //arr = arr.reverse();
//             },
//             error: function (data) {
//                 alert("11111");
//             }
//             //setTimeout(function() {
//             //	window.location.reload();
//             //}, todayTimeout * 1000);
//         });
//     }
//
//     // drawZJNews(zjUrl);
//
//
// }

// zbdp.drawNews = function (data, label) {
//     console.log(data);
//     console.log(label);
//
//     // function draw(data, label) {
//     var dataArr,
//         element,
//         elementTop,
//         elementBottom,
//         markEle, //页面显示数据量
//         moveThread, //垂直滚动需要有的条目数量
//         moveVSelector, //垂直滚动的选择符
//         moveHSelector; //水平滚动的选择符
//
//     // console.log(data);
//     dataArr = data.PAGEITEMS;
//     if (!dataArr) {
//         return;
//     }
//     element = $('.news-group-content');
//     moveVSelector = 'news-item-wrapper';
//     moveHSelector = 'news-group-item-wrapper';
//     moveThread = 6;
//
//     element.empty();
//
//     //显示数量
//     if (markEle && markEle.length > 0) {
//         markEle.text(data.PAGEITEMS.length);
//     }
//
//     function generateGroupItem(ele, item) {
//         var itemWrapper = document.createElement('div');
//         itemWrapper.classList.add('news-group-item-wrapper');
//         if (item.MARK == 1) {
//             itemWrapper.classList.add('active');
//         }
//
//         var itemDetailWrapper = document.createElement('div');
//         itemDetailWrapper.classList.add('news-group-item-detail-wrapper');
//         itemDetailWrapper.innerHTML = '<div class="news-group-item-detail ">' + item.URLTITLE + '</div>'
//         itemWrapper.appendChild(itemDetailWrapper);
//
//         var itemTime = document.createElement('div');
//         itemTime.classList.add('news-group-item-time');
//         // itemTime.innerText = item.time;
//         // itemTime.innerText = '1分钟前';
//         var formateDate = zbdp.formateDate(item.URLTIME);
//         if (formateDate.isToday) {
//             var ago = document.createElement('time');
//             ago.classList.add('timeago');
//             ago.setAttribute('datetime', item.URLTIME);
//             itemTime.appendChild(ago);
//         } else {
//             itemTime.innerText = formateDate.date;
//         }
//         itemWrapper.appendChild(itemTime);
//
//         ele.append(itemWrapper);
//     }
//
//     //循环增加信息条目
//     if (label == 'group') {
//         /*if (typeof dataArr == 'undefined') {
//             console.log('集团舆情初始化失败！')
//         }*/
//         for (var i = 0; i < data.top.length && i < zbdp.configData.topItemsThreshold; i++) {
//             var item = data.top[i];
//             generateGroupItem(elementTop, item);
//         }
//         for (var j = 0; j < data.bottom.length; j++) {
//             var item = data.bottom[j];
//             generateGroupItem(elementBottom, item);
//         }
//
//         var maxHeight = $('.news-group-content-wrapper').height() - $('.news-group-content.top').height();
//         $('.news-group-content.bottom').css('height', maxHeight + "px");
//
//         $('time.timeago').timeago();
//
//         zbdp.moveVerticalCancel(label);
//         if (data.bottom.length >= moveThread) {
//             zbdp.moveVertical(elementBottom, moveVSelector, label);
//         }
//     } else {
//
//         // var dataArr = data.PAGEITEMS;
//         /*if (typeof dataArr == 'undefined') {
//             alert('今日政策初始化失败！')
//         }*/
//         for (var i = 0; i < dataArr.length; i++) {
//             var item = dataArr[i];
//
//             var itemWrapper = document.createElement('div');
//             itemWrapper.classList.add('news-item-wrapper');
//
//             var itemSite = document.createElement('div');
//             itemSite.classList.add('news-item-site');
//             itemSite.innerText = item.CHANNEL;
//             itemWrapper.appendChild(itemSite);
//
//             var itemDetailWrapper = document.createElement('div');
//             itemDetailWrapper.classList.add('news-item-detail-wrapper');
//             itemDetailWrapper.innerHTML = '<div class="news-item-detail">' + item.URLTITLE + '</div>'
//             itemWrapper.appendChild(itemDetailWrapper);
//
//             element.append(itemWrapper);
//         }
//
//         zbdp.moveVerticalCancel(label);
//         if (dataArr.length >= moveThread) {
//             zbdp.moveVertical(element, moveVSelector, label);
//         }
//
//     }
//     if (element) {
//         setTimeout(function () {
//             zbdp.moveHorizental(element, moveHSelector, label);
//         }, 3000)
//
//     }
//     if (elementTop) {
//         setTimeout(function () {
//             zbdp.moveHorizental(elementTop, moveHSelector, label);
//         }, 1000)
//
//     }
//     if (elementBottom) {
//         zbdp.moveHorizental(elementBottom, moveHSelector, label);
//     }
//
// };

/**
 * [getUrlParams description] 获取路由参数
 * @param  {[type]} params [description] 要获取的参数名
 * @return {[type]}        [description]
 */
// zbdp.getUrlParams = function (params) {
//     var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
//     var paramsData = window.location.search.substr(1).match(reg);
//     return !!paramsData ? paramsData[2] : "0";
// };
