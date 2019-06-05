/**
 * 地图小弹框控制器
 */
"use strict";
angular.module("newTopicPopupModule", []).
controller("newTopicPopupCtrl", ["$scope", "$sce", "homePageService", "httpService", "sid", "$timeout", function($scope, $sce, homePageService, httpService, sid, $timeout) {
    initStatus();
    initData();
    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.status = {};
        $scope.data = {};
        $timeout(function() {
            $scope.status.show = true;
        });
    }
    /**
     * [getDetail description] 获取新闻详情
     * @return {[type]} [description]
     */
    function getDetail() {
        var params = {
            sid: sid
        };
        httpService.http("/screen/zjSentimentCommonMgr/details", params, "get").then(function(data) {
            $scope.data = data;
            $scope.data.content = $sce.trustAsHtml(homePageService.handleContent($scope.data.CONTENTDISPLAY));
        });
    }
    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        getDetail();
    }
    
    /**
     * 查看详情
     */
    $scope.showDetail = function(){
    	$scope.detail();
    }

}]);