/**
 * 描述：http请求服务
 * 日期：2017-6-13
 * 作者：bai.zhiming
 */
"use strict";
angular.module("httpServiceModule", [])
    .factory("httpService", ["$http", "$q", function($http, $q) {
        return {
            notLogin: false,
            http: function(url, params, type, forbiddenModal, showError) {
                var self = this;
                var deffer = $q.defer();
                $http({
                    method: !!type ? type : 'get',
                    url: url,
                    headers: {
                        'formdata': "1",
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                    data: type == 'post' ? params : "",
                    params: type == 'post' ? "" : params
                }).then(function(response) {
                    deffer.resolve(response.data);
                    /*if (data.success === false) {
                        if (self.notLogin) return;
                        if (data.noLogin) {
                            self.notLogin = true;
                            $state.go("login", { orgurl: $state.current.name, orgparams: JSON.stringify($stateParams) });
                            modalDialog.alertType("错误", data.message, "warning", false);
                            return;
                        }
                        if (!forbiddenModal) {
                            if (data.message.indexOf("无") >= 0 && data.message.indexOf("权限") >= 0) {
                                var url = $state.current.name.split(".")[0];
                                $state.go(url, {}, { reload: url });
                            } else {
                                modalDialog.alertType("错误", data.message, "error", false);
                            }
                        }
                        if (showError) {
                            deffer.resolve(data);
                        } else {
                            deffer.reject(data);
                        }
                    } else if (data.status === 0) {
                        if (!forbiddenModal) modalDialog.alertType("成功", data.content, "success", false);
                        deffer.resolve(data);
                    } else if (data.status === 2) {
                        modalDialog.alertType("警告", "您尚未登录该系统", "warning", false, function() {});
                    } else {
                        deffer.resolve(data);
                    }*/
                }, function(response) {
                    deffer.reject();
                });
                return deffer.promise;
            },
            httpServer: function(url, params, type, forbiddenModal, showError) {
                var self = this;
                var deffer = $q.defer();
                $http({
                    method: !!type ? type : 'get',
                    url: url,
                    headers: {
                        'formdata': "1",
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                    },
                    data: type == 'post' ? params : "",
                    params: type == 'post' ? "" : params
                }).then(function(response) {
                    deffer.resolve(response.data);
                    
                }, function(response) {
                    deffer.reject();
                });
                return deffer.promise;
            },
        };
    }]).config(['$httpProvider', function($httpProvider) {

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        function toFormData(obj) {
            var query = '';
            var name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name; //name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += toFormData(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += toFormData(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        }
        // 浏览器缓存设置
        // if (!$httpProvider.defaults.headers.get) {
        //     $httpProvider.defaults.headers.get = {};
        // }
        // $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        // $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? toFormData(data) : data;
        }];
    }]);