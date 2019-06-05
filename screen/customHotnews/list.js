/**
 * 热点新闻列表
 */
"use strict";
angular.module("listModule", ["ngAnimate", "httpServerModule", "autoPlayModule"])
    .controller("listCtrl", ["$scope", "$timeout", "http", "$q", function($scope, $timeout, http, $q) {
        initStatus();
        initData();
        /**
         * [initStatus description] 初始化状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.status = {};
            $scope.data = {};
        }
        /**
         * [getDefaultList description] 获取默认列表数据
         * @return {[type]} [description]
         */
        function getDefaultList() {
            var deffer = $q.defer();
            getHotPointList($scope.status.today, $scope.status.now).then(function(data) {
                deffer.resolve();
            });
            return deffer.promise;
        }
        /**
         * [getNow description] 获取当前小时
         * @return {[type]} [description]
         */
        function getNow() {
            $scope.status.now = new Date().getHours();
        }
        /**
         * [initData description] 初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            getNow();
            getToday().then(function() {
                return getCustomHotPointArea();
            }).then(function() {
                getDefaultList();
                getMainTitle();
            });
        }
        /**
         * [getCustomHotPointArea description] 获取自定义地域热点新闻相关信息
         * @return {[type]} [description]
         */
        function getCustomHotPointArea() {
            var deffer = $q.defer();
            http.getData("/screen/areaHotPointFuncMgr/getCustomHotPointArea").then(function(data) {
                $scope.status.customHotPointArea = data;
                $scope.status.customHotPointArea.province = $scope.status.customHotPointArea.province == null ? "" : $scope.status.customHotPointArea.province;
                $scope.status.customHotPointArea.city = $scope.status.customHotPointArea.city == null ? "" : $scope.status.customHotPointArea.city;
                $scope.status.customHotPointArea.town = $scope.status.customHotPointArea.town == null ? "" : $scope.status.customHotPointArea.town;
                deffer.resolve();
            });
            return deffer.promise;
        }
        /**
         * [getToday description] 获取当前日期
         * @return {[type]} [description]
         */
        function getToday() {
            var deffer = $q.defer();
            http.getData("/screen/areahotpoint/getDate?id=0&scene_level=0", {}, "text").then(function(data) {
                $scope.status.today = data;
                deffer.resolve();
            });
            return deffer.promise;
        }
        /**
         * [getMainTitle description] 获取主标题
         * @return {[type]} [description]
         */
        function getMainTitle() {
            var date = new Date();
            $scope.status.mainTitle = $scope.status.customHotPointArea.province + $scope.status.customHotPointArea.city + $scope.status.customHotPointArea.town + "热点新闻";
        }
        /**
         * [getPercent description] 
         * @param {[object]} [item] [description] 稿件数据
         * @return {[type]} [description]
         */
        $scope.getPercent = function(item) {
            if (!Number($scope.data.list[0].weighted_nums))
                item.percent = "width:0px";
            else
                item.percent = "width:" + (Number(item.weighted_nums) / Number($scope.data.list[0].weighted_nums)) * 100 + "%";
        };
        /**
         * [getHotPointList description] 获取列表
         * @param {[string]} [searchdate] [description] 搜索时间
         * @param {[dayFlagFrom]} [varname] [description] 起始日
         * @param {[dayFlagTo]} [varname] [description] 结束日
         * @param {[dayTimeFrom]} [varname] [description] 起始时间
         * @param {[dayTimeTo]} [varname] [description] 结束时间
         * @return {[type]} [description]
         */
        function getHotPointList(searchDate, searchHour, dayFlagFrom, dayFlagTo, dayTimeFrom, dayTimeTo) {
            delete $scope.data.list;
            var deffer = $q.defer();
            var params = {
                page_size: 10,
                page_no: 0,
                hot_type: 0,
                day_flag_from: dayFlagFrom,
                day_flag_to: dayFlagTo,
                day_time_from: dayTimeFrom,
                day_time_to: dayTimeTo,
                search_hour: searchHour,
                area_id: $scope.status.customHotPointArea.finalArea,
                search_date: searchDate,
                user_id: 'admin'
            };
            http.getData("/screen/customHotPointMgr/getHotPointList", params).then(function(data) {
                $scope.data.list = data.mapResult.content.record;
                deffer.resolve();
            });
            return deffer.promise;
        }
    }]);