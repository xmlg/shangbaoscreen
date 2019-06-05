//描述:世界热点启动
//日期:2017/1/3
//作者:bai.zhiming
"use strict";
(function() {
    var options = {
        morningTagUrl: "/screen/areahotpoint/getMorningData",
        middleTagUrl: "/screen/areahotpoint/getMiddleData",
        eveningTagUrl: "/screen/areahotpoint/getEveningData",
        draftListUrl: "/screen/areahotpoint/Internationalpoint",
        draftDetailUrl: "/screen/areahotpoint/pointDetail"
    };
    var params = {
        area: "999",
        pointDate: "",
        subjectarea: "0",
        field: "000",
        clustername: "",
        id: getUrlParams("id"),
        scene_level: getUrlParams("scene_level")
    };
    /**
     * [getUrlParams description] 获取路由参数
     * @param  {[type]} params [description] 要获取的参数名
     * @return {[type]}        [description]
     */
    function getUrlParams(params) {
        var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
        var paramsData = window.location.search.substr(1).match(reg);
        return !!paramsData ? paramsData[2] : "0";
    };
    var wordNews = new window.hotNews(options);
    wordNews.init(params);
})();