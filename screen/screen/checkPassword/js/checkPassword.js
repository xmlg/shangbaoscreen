/**
 * description 从策划中心分享页面的校验密码页面
 * created by he.zhikai
 * created on 2017-08-29
 */
"use strict";
angular.module("checkPasswordApp", [])
    .controller("checkPasswordCtrl", ["$scope", "httpService", function($scope, httpService) {
        initStatus();
        initData();

        /**
         * [initStatus description] 初始化状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.status = {
                showModal: true, //是否显示弹窗
                invalidUrl: false, //是否为失效的链接
                passwordError: false //是否显示密码错误提示
            };
            $scope.data = {
                title: "请输入查看密码", //标题
                showPassword: "查看密码",
                password: "",
                scene_level: getUrlParams("scene_level"),
                id: getUrlParams("id"),
                is_one_screen: getUrlParams("is_one_screen")
            };
        }

        /**
         * [getUrlParams description] 获取路由参数
         * @param  {[type]} params [description] 要获取的参数名
         * @return {[type]}        [description]
         */
        function getUrlParams(params) {
            var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
            var paramsData = window.location.search.substr(1).match(reg);
            return !!paramsData ? paramsData[2] : "";
        }

        /**
         * [initData description] 初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            checkLogin();
        }

        /**
         * [checkLogin description] 校验登录状态和密码
         * @return {[type]} [description]
         */
        function checkLogin() {
            var params = {
                "password": $scope.data.password,
                "id": $scope.data.id,
                "scene_level": $scope.data.scene_level,
                "is_one_screen": $scope.data.is_one_screen
            };
            httpService.httpServer("/screen/openUrl/check", params, 'get').then(function(data) {
                if (data.mapResult.status == "SUCCESS") {
                    window.location.href = data.mapResult.content.scene_url_md5;
                } else if (data.mapResult.status == "FAILED" && data.mapResult.content == "该条件下检索不到数据") {
                    $scope.status.invalidUrl = true;
                    $scope.data.title = "链接失效提示";
                } else if (data.mapResult.status == "FAILED" && data.mapResult.content == "密码不匹配") {
                    $scope.status.passwordError = true;
                }
            });
        }

        /**
         * [confirm description] 确定
         * @return {[type]} [description]
         */
        $scope.confirm = function() {
            checkLogin();
        };

        /**
         * [cancel description] 取消
         * @return {[type]} [description]
         */
        $scope.cancel = function() {
            $scope.status.showModal = false;
        };
    }])
    .factory('httpService', ["$http", "$q", function($http, $q) {
        return {
            /**
             * [httpServer description] http请求
             * @param  {[type]} url    [description] 请求地址
             * @param  {[type]} params [description] 请求参数
             * @param  {[type]} type   [description] 请求方式
             * @return {[type]}        [description]
             */
            httpServer: function(url, params, type) {
                var deffer = $q.defer();
                $http({
                    method: type,
                    url: url,
                    headers: {
                        'formdata': "1",
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: type == 'POST' ? params : "",
                    params: type == 'POST' ? "" : params
                }).success(function(data) {
                    deffer.resolve(data);
                }).error(function(data) {
                    deffer.reject(data);
                });
                return deffer.promise;
            }
        };
    }]);