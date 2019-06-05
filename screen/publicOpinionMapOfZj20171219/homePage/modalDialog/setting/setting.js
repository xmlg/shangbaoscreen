/**
 * 设置
 * 2017-12-22
 */
"use strict";
angular.module("settingModule", []).
controller("settingCtri", ["$scope", "$q", "homePageService", "$timeout", "success", "cancel", "$element", function($scope, $q, homePageService, $timeout, success, cancel, $element) {
    var listEvent;
    initStatus();
    initData();
    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.status = {
            areaList: []
        };
        $scope.data = {};
        bindListEvent();
        bindEsc();
    }
    /**
     * [getAreaList description] 获取地域列表
     * @return {[type]} [description]
     */
    function getAreaList() {
        var deffer = $q.defer();
        homePageService.getAreaList().then(function(data) {
            $scope.status.areaList = data;
            deffer.resolve();
        });
        return deffer.promise;
    }
    /**
     * [bindListEvent description] 绑定列表事件
     * @return {[type]} [description]
     */
    function bindListEvent() {
        listEvent = function(e) {
            var $target = $(e.target);
            if ($target.parents(".dropTitle").length === 0) {
                $timeout(function() {
                    $scope.status.showList = false;
                });
            }
        };
        $("body").bind("click", listEvent);
        $scope.$on("$destroy", function() {
            $("body").unbind("click", listEvent);
        });
    }
    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        getAreaList().then(function(data) {
            getConfigInfo();
        });
    }
    /**
     * [bindEsc description] 绑定esc键
     * @return {[type]} [description]
     */
    function bindEsc() {
        $("body").unbind("keydown", setting);
        $("body").bind("keydown", cancelSetting);
    }
    /**
     * [closeSetting description] 保存并关闭
     * @return {[type]} [description]
     */
    $scope.closeSetting = function() {
        localStorage['pubOpin2018'] = JSON.stringify(angular.copy($scope.data));
        closeWindow();
        if (angular.isFunction(success)) success();
    };
    /**
     * [closeWindow description] 关闭窗口
     * @return {[type]} [description]
     */
    function closeWindow() {
        $scope.$destroy();
        $element.remove();
        $("body").unbind("keydown", cancelSetting);
        $("body").bind("keydown", setting);
    }
    /**
     * [cancelSetting description] 取消并关闭
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function cancelSetting(e) {
        if (!!e && e.keyCode !== 27) return;
        closeWindow();
        if (angular.isFunction(cancel)) cancel();
    }
    $scope.cancelSetting = cancelSetting;

    $scope.watchNum = function(e){
        console.log(e);
    }
    /**
     * [getConfigInfo description] 获取配置信息
     * @return {[type]} [description]
     */
    function getConfigInfo() {
        $scope.data = localStorage["pubOpin2018"];
        if (!$scope.data) {
            $scope.data = {
                showMode: "visitMode",
                visitMode: {
                    intervalTime: 5000,
                },
                dutyMode: {
                    initialWaitingTime: 3000,
                    afterEndWaitingTime: 3000,
                    slideSpeed: 300
                },
                area: $scope.status.areaList[0]
            };
        } else {
            $scope.data = JSON.parse($scope.data);
        }
    }
}]);