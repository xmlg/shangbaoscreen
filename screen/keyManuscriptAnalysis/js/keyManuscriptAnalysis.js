//描述：稿件传播力分析
//时间：2017-5-22
//作者：fang.lijuan
'use strict';
angular.module("keyManuscriptAnalysisModule", ["ngAnimate", "mgcrea.ngStrap", "httpServiceModule", "dataManagerModule", "scrollBarModule", "radarModule","switchTableModule"])
    .controller("keyManuscriptAnalysisCtrl", ["$scope", "$q", "$sce", "$timeout", "dataManagerService",
        function($scope, $q, $sce, $timeout, dataManagerService) {
            initStatus();
            initData();

            var keepConnectionTimeout, //定时请求后端服务的定时器
                keepConnectionTime = 1000 * 60 * 5; //定时请求后端服务的设定时间
            keepConnection();
            /**
             * [keepConnection description] 定时请求后端服务，防止后端服务会话超时无响应
             * @return {[type]} [description]
             */
            function keepConnection() {
                $.ajax({
                    // url: "/screen/areahotpoint/getDate",
                    url: "../json/areahotpoint/getDate.json",
                    type: "get",
                    dataType: "text",
                    success: function() {
                        $timeout.cancel(keepConnectionTimeout);
                        keepConnectionTimeout = $timeout(function() {
                            keepConnection();
                        }, keepConnectionTime);
                    },
                    error: function() {
                        $timeout.cancel(keepConnectionTimeout);
                        keepConnectionTimeout = $timeout(function() {
                            keepConnection();
                        }, keepConnectionTime);
                    }
                });
            }

            /**
             * [initStatus description] 初始化状态
             */
            function initStatus() {
                $scope.data = {
                    currArticle: {}, //稿件基本信息
                    exAll: 0, //外部媒体转载总数
                };
                $scope.status = {
                    guid: 0
                }
            }
            /**
             * [initData description] 初始化数据
             */
            function initData() {
                $scope.status.guid = getUrlInfo("guid");
                getDocInfo();
                $timeout(function() { //延时初始化正文内容（滚动效果）
                    handleHtmlContent();
                }, 500);

            }
            /**
             * [getDocInfo description] 获取稿件信息
             * @param {[string]} [groupid] [description] guid
             * @return {[array]} selectedTopicsList [description] 稿件信息
             */
            function getDocInfo() {
                dataManagerService.getDocByGuId($scope.status.guid).then(function(data) {
                    $scope.data.currArticle = data.ARTICLE;
                    $scope.data.currImps = data.IMPS;
                    $scope.data.exAll = parseInt($scope.data.currArticle.EXCOREMEDIATOPS) + parseInt($scope.data.currArticle.EXCOREMEDIAS) + parseInt($scope.data.currArticle.EXLV1MEDIAS) + parseInt($scope.data.currArticle.EXLV2MEDIAS);
                });
            };
            /**
             * [getUrlInfo description] 获取地址栏url参数
             * @param  {[type]} name [description]
             * @return {[type]}      [description]
             */
            function getUrlInfo(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) return unescape(r[2]);
                return null;
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
             * [handleHtmlContent description] 处理html正文
             * @param {[string]} [attribute] [description] 稿件渠道
             */
            function handleHtmlContent() {
                dataManagerService.handleHtmlContent($scope.data.currArticle.CONTENT, 3710, function(data) {
                    $timeout(function() {
                        $scope.data.currArticle.CONTENT = data;
                        changeLoadWatch("contentLoadWatch");
                    });
                });
            };
        }
    ]);
