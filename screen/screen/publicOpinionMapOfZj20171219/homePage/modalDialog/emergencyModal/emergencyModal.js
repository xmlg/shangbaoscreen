/**
 * 突发新闻弹窗
 */
"use strict";
angular.module("emergencyModalModule", []).
controller("emergencyModalCtrl", ["$scope", "articleInfo", "scrollEnd", "$element", "$sce", "httpService", "homePageService", "$timeout", "config", function($scope, articleInfo, scrollEnd, $element, $sce, httpService, homePageService, $timeout, config) {
    initStatus();
    initData();
    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.status = {
            config: config,
            articleInfo: articleInfo
        };
        $scope.data = {};
        $timeout(function() {
            $scope.status.show = true;
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
     * [getDetail description] 获取新闻详情
     * @return {[type]} [description]
     */
    function getDetail() {
        var params = {
            sid: articleInfo.SID
        };
        httpService.http("/screen/zjSentimentCommonMgr/details", params, "get").then(function(data) {
            $scope.data = data;
            var htmlContent = homePageService.handleHtmlContent($scope.data.CONTENTDISPLAY, 2620, function(data) {
                $timeout(function() {
                    $scope.data.HTMLCONTENT = $sce.trustAsHtml(data);
                });
            });
            $scope.data.URL = $sce.trustAsUrl($scope.data.PUBURL);
        });
    }
    /**
     * [close description] 关闭弹窗
     * @return {[type]} [description]
     */
    $scope.close = function() {
        $element.remove();
        $scope.$destroy();
        scrollEnd();
        $scope.closeModal();
    };
    /**
     * [scrollEnd description] 滚动停止
     * @return {[type]} [description]
     */
    $scope.scrollEnd = function() {
        scrollEnd();
    };
}]);