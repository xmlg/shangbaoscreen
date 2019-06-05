//描述:全国热点启动
//日期:2017/1/4
//作者:bai.zhiming
"use strict";
(function() {
    var options = {
        morningTagUrl: "/screen/areahotpoint/getMorningData",
        middleTagUrl: "/screen/areahotpoint/getMiddleData",
        eveningTagUrl: "/screen/areahotpoint/getEveningData",
        draftListUrl: "/screen/areahotpoint/allhotpoint",
        draftDetailUrl: "/screen/areahotpoint/pointDetail"
    };
    var params = {
        area: "001",
        pointDate: "",
        field: "000",
        clustername: "country_1",
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
    var countryNews = new window.hotNews(options);
    countryNews.init(params);
})();
