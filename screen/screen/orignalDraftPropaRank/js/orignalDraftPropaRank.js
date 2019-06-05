/**
 * 描述：原创稿件传播力排行
 * 日期：2017-7-playIndexplayIndex
 * 作者：yu.zhipeng
 */
"use strict";
var app = angular.module("origApp", ["ngAnimate", "httpServiceModule", "htmlParseModule", "scrollBarModule", "manuscriptModule", "radarModule"]);
app.controller("origCtrl", ["$scope", "httpService", "$q", "$filter", "$sce", "htmlParseService", "$timeout", "$interval", function($scope, httpService, $q, $filter, $sce, htmlParseService, $timeout, $interval) {
    /**
     * [initStatus description]根据guid来获取稿件详情
     */
    $scope.getManuscriptDetail = function(guid) {
        $scope.status.selectedItemId = guid;
        var deffer = $q.defer();
        $scope.article = {};
        // httpService.httpServer("/screen/manuscriptdetail/detail?zbguid=" + guid + "&dateflag=" + $scope.dateflag, "").then(function(data) {
        httpService.httpServer("/cas/xhs/articleDetail/main.do?method=getArticleDetailForScreen&zbGuid=" + guid + "&dateflag=" + $scope.dateflag, "").then(function(data) {
            //更新左侧列表的传播力指数
            for (var i = 0; i < $scope.dateinfo.length; i++) {
                if ($scope.dateinfo[i].zbGuid == guid) {
                    $scope.dateinfo[i].ceiIndex = data.ARTICLE.CEIINDEX;
                }
            }
            $scope.mediaArr =data.ARTICLE.EXMEDIAS;
            for (var i = 0; i < $scope.mediaArr.length; i++) {
                console.log($scope.mediaArr[i]);

                $scope.mediaArr[i].pubTime = getMyDate($scope.mediaArr[i].pubTime)
            }
            $scope.article = data;
            $scope.gettableinfo();
            //处理时间
            $scope.article.ARTICLE.PUBTIME = $filter('date')($scope.article.ARTICLE.PUBTIME, 'yyyy/MM/dd HH:mm:ss');
            for (var i = 0; i < $scope.article.IMPS.length; i++) {
                $scope.article.IMPS[i].PUBTIME = $filter('date')($scope.article.IMPS[i].PUBTIME, 'yyyy-MM-dd HH:mm:ss');
            }
            //处理列表
            $scope.article.tablelength = [];
            $scope.article.tablelength.length = Math.ceil($scope.article.IMPS.length / 5);
            if ($scope.article.IMPS.length > 5) {
                $scope.article.table = $scope.article.IMPS.slice(0, 5);
            } else {
                $scope.article.table = $scope.article.IMPS.slice(0, $scope.article.IMPS.length);
            }
            //处理次数
            $scope.article.ARTICLE.alltimes = parseInt($scope.article.ARTICLE.EXCOREMEDIATOPS) + parseInt($scope.article.ARTICLE.EXCOREMEDIAS) + parseInt($scope.article.ARTICLE.EXLV1MEDIAS) + parseInt($scope.article.ARTICLE.EXLV2MEDIAS);
            deffer.resolve();
        });
        return deffer.promise;
    }

    /**
     * [getOtherDateInfo description]获取其他日期的稿件信息
     */
    $scope.getOtherDateInfo = function(date) {
        $scope.isSelected = date;
        var myDate = new Date();
        var today = myDate.format("yyyy-MM-dd");
        switch (date) {
            case 0:
                $scope.dateflag = 1;
                myDate.setDate(myDate.getDate());
                break;
            case 1:
                $scope.dateflag = 3;
                myDate.setDate(myDate.getDate()-1);
                break;
            case 3:
                $scope.dateflag = 7;
                myDate.setDate(myDate.getDate()-3);
                break;
            case 7:
                $scope.dateflag = 1;
                myDate.setDate(myDate.getDate()-7);
                break;
            
        }
        var deffer = $q.defer();
        var startDate = myDate.format("yyyy-MM-dd");
        var url = '/cas/xhs/articleDetail/main.do?method=searchCeiToOutService&interfaceType=2&model=DESC&orderBy=ceiIndex&pageNo=1&pageSize=10'+
        '&startTime='+startDate+'+00:00:00&&endTime='+today+'+23:59:59';
        // httpService.httpServer("/screen/manuscript/yesterdayoriginal", "").then(function(data) {
        httpService.httpServer(url, "").then(function(data) {
            if(data.Records.length<=0){
                return;
            }
            $scope.dateinfo = data.Records;
            $scope.currguid = data.Records[0].zbGuid;
            $scope.currceiIndex = data.Records[0].ceiIndex;
            if ($scope.status.selectedItemId) {
                var flag = 0;
                for (var i = 0; i < $scope.dateinfo.length; i++) {
                    if ($scope.dateinfo[i].zbGuid == $scope.status.selectedItemId) {
                        flag = 1;
                    }
                }
                //如果新闻掉出了top10,则默认显示第一个
                if (flag == 0) {
                    $scope.status.selectedItemId = $scope.dateinfo[0].zbGuid;
                }
                $scope.getManuscriptDetail($scope.status.selectedItemId);
            } else {
                $scope.getManuscriptDetail(data.Records[0].zbGuid);
            }
            deffer.resolve();
        });
        return deffer.promise;
    }

    /**
     * [initStatus description]获取今日稿件信息
     */
    $scope.getTodayInfo = function() {
        $scope.isSelected = "today";
        $scope.dateflag = 0;
        var deffer = $q.defer();
        // httpService.httpServer("/screen/manuscript/todayoriginal", "").then(function(data) {
        httpService.httpServer("../json/manuscript/todayoriginal.json", "").then(function(data) {
            $scope.dateinfo = data.Records;
            $scope.currguid = data.Records[0].zbGuid;
            $scope.currceiIndex = data.Records[0].ceiIndex;
            if ($scope.status.selectedItemId) {
                var flag = 0;
                for (var i = 0; i < $scope.dateinfo.length; i++) {
                    if ($scope.dateinfo[i].zbGuid == $scope.status.selectedItemId) {
                        flag = 1;
                    }
                }
                //如果新闻掉出了top10,则默认显示第一个
                if (flag == 0) {
                    $scope.status.selectedItemId = $scope.dateinfo[0].zbGuid;
                }
                $scope.getManuscriptDetail($scope.status.selectedItemId);
            } else {
                $scope.getManuscriptDetail(data.Records[0].zbGuid);
            }
            deffer.resolve();
        });
        return deffer.promise;
    }

    initStatus();
    initData();
    /**
     * 初始化数据
     */
    function initData() {
        if (angular.isDefined($scope.data.id)) {
            getSpecificInfo(0);
        } else {
            $scope.getOtherDateInfo(1);
        }
    }
    /**
     * [initStatus description]初始化状态
     */
    function initStatus() {
        var reg = new RegExp("(^|&)id=([^&]*)(&|$)");
        var idParams = window.location.search.substr(1).match(reg);
        $scope.page = {
            pageIndex: 0, //当前页码
            pageSize: 10, //每页显示数量
            itemCount: 0, //显示项的总数量
            maxButtonCount: 6, //除去第一页和最后一页的最大按钮数量
            prevText: "<< 上一页",
            nextText: "下一页 >>",
            buildPageUrl: null,
            onPageChanged: null //页码修改后的回调函数，包含一个pageIndex参数
        };
        $scope.status = {
            time: {
                "yesterday": 0,
                "threeday": 1,
                "week": 2
            },
            currguid: "",
            dataArrs: [],
            idx: 0,
            tableItemsWidth: 1920,
            tableNum: 1,
            offsetWidth: 1920,
            index: 0,
            isFromPlanningCenter: !!idParams ? true : false, //是否从策划中心跳转而来
            initPager: false
        };
        $scope.dateflag = 0;
        $scope.data = {
            title: "原创稿件传播力排行榜",
            id: $scope.status.isFromPlanningCenter ? idParams[2] : undefined
        };
    }

    /**
     * [getSpecificInfo description] 获取特定id的稿件信息
     * @return {[type]} [description]
     */
    function getSpecificInfo(pageIndex) {
        $(".newsList").fadeIn("slow");
        var params = {
            manuscripts_title_id: $scope.data.id,
            page_no: pageIndex,
            page_size: 10
        };
        httpService.httpServer("/screen/manuScriptsFuncAdd/look", params).then(function(data) {
            $scope.data.title = data.mapResult.content.title;
            $scope.page.pageIndex = pageIndex;
            $scope.page.itemCount = data.mapResult.content.total_elements;
            $scope.page.prevText = data.mapResult.content.records.length === 0 ? "" : "<< 上一页";
            $scope.page.nextText = data.mapResult.content.records.length === 0 ? "" : "下一页 >>";
            $scope.page.onPageChanged = function(pageIndex) {
                $(".newsList").fadeOut("slow");
                $timeout(function() {
                    getSpecificInfo(pageIndex);
                }, 600);
            };
            if (!$scope.status.initPager) {
                delete $scope.pager;
                $scope.pager = $(".list_page").find(".pager").pager($scope.page);
            }
            $scope.status.initPager = true;
            var tempArray = [];
            for (var i = 0; i < 10; i++) {
                if (angular.isDefined(data.mapResult.content.records[i])) {
                    tempArray.push(data.mapResult.content.records[i]);
                } else {
                    break;
                }
            }
            data.mapResult.content.records = tempArray;
            $scope.dateinfo = data.mapResult.content.records;
            $scope.currguid = data.mapResult.content.records[0].zbGuid;
            $scope.currceiIndex = data.mapResult.content.records[0].ceiIndex;
            for (var j = 0; j < 10; j++) {
                if (angular.isDefined(data.mapResult.content.records[j]) && $scope.currceiIndex < data.mapResult.content.records[j].ceiIndex) {
                    $scope.currceiIndex = data.mapResult.content.records[j].ceiIndex;
                }
            }
            if ($scope.status.selectedItemId) {
                var flag = 0;
                for (var i = 0; i < $scope.dateinfo.length; i++) {
                    if ($scope.dateinfo[i].zbGuid == $scope.status.selectedItemId) {
                        flag = 1;
                    }
                }
                //如果新闻掉出了top10,则默认显示第一个
                if (flag == 0) {
                    $scope.status.selectedItemId = $scope.dateinfo[0].zbGuid;
                }
                $scope.getManuscriptDetail($scope.status.selectedItemId);
            } else {
                $scope.getManuscriptDetail(data.mapResult.content.records[0].zbGuid);
            }
        });
    }

    

    /**
     *  格式化html
     */
    $scope.handleHtmlContent = function() {
        // $scope.article.ARTICLE.CONTENT = $scope.article.ARTICLE.CONTENT.replace((/&amp;/g, '&');
        // console.log($scope.article.ARTICLE.CONTENT.indexOf('↵'));
        $scope.article.ARTICLE.CONTENT = HTMLDecode($scope.article.ARTICLE.CONTENT);
        // console.log($scope.article.ARTICLE.CONTENT);
        // console.log($scope.article.ARTICLE.CONTENT.indexOf('/enpproperty--&gt;'),44);
        // if($scope.article.ARTICLE.CONTENT.indexOf('/enpproperty--&gt;')!=-1){
        $scope.article.ARTICLE.CONTENT = $scope.article.ARTICLE.CONTENT.replace(/enpproperty--/," ")
        $scope.article.ARTICLE.CONTENT = $scope.article.ARTICLE.CONTENT.replace(/\d*c\d*.html/," ")
        $scope.article.ARTICLE.CONTENT = $scope.article.ARTICLE.CONTENT+"..."
        $scope.article.ARTICLE.CONTENT = $scope.article.ARTICLE.CONTENT.replace(/&nbsp;*/g," ")
        console.log($scope.article.ARTICLE.CONTENT = $scope.article.ARTICLE.CONTENT + "...");
        // }
        htmlParseService.handleHtmlContent($scope.article.ARTICLE.CONTENT, 1920, function(data) {
            // console.log($scope.article.ARTICLE.CONTENT);
            // console.log(data);
            // console.log(data);
            $timeout(function() {
                $scope.article.ARTICLE.CONTENTTRUST = data;
                changeLoadWatch("contentLoadWatch");
            });
        });
    };

    function HTMLDecode(text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
    /**
     * [changeLoadWatch description] 改变滚动条对应监控变量
     * @param {string} [varname] [description] 变量名称
     */
    function changeLoadWatch(varname) {
        if (angular.isDefined($scope.status[varname])) $scope.status[varname]++;
        else($scope.status[varname] = 0);
    }

    /**
     * 定时刷新
     */
    $interval(function() {
        if ($scope.isSelected == 'today' || $scope.status.isFromPlanningCenter) {
            $scope.status.initPager = false;
            initData();
        } else {
            $scope.getOtherDateInfo($scope.isSelected);
        }
    }, 10 * 60 * 1000);

}]);

//时间戳

function add0(m){return m<10?'0'+m:m };

function getMyDate(shijianchuo) {
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(shijianchuo*1);
    var y = time.getFullYear();
    var m = time.getMonth()+1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm)+':'+add0(s);
};

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}