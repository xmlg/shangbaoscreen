//描述：编前选题
//时间：2017-3-16
//作者：Bai.Zhiming
'use strict';
angular.module("preSelectedTopicsModule", ["ngAnimate", "mgcrea.ngStrap", "httpServiceModule", "dataManagerModule", "scrollBarModule", "switchDraftModule", "videoPlayerModule"])
    .controller("preSelectedTopicsCtrl", ["$scope", "$q", "$sce", "$timeout", "dataManagerService", function($scope, $q, $sce, $timeout, dataManagerService) {
        initStatus();

        var keepConnectionTimeout, //定时请求后端服务的定时器
            keepConnectionTime = 1000 * 60 * 5; //定时请求后端服务的设定时间
        keepConnection();
        /**
         * [keepConnection description] 定时请求后端服务，防止后端服务会话超时无响应
         * @return {[type]} [description]
         */
        function keepConnection() {
            var id = getUrlParams("id");
            var scene_level = getUrlParams("scene_level");
            $.ajax({
                url: "/screen/areahotpoint/getDate?id=" + id + '&scene_level=' + scene_level,
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
         * [getUrlParams description] 获取路由参数
         * @param  {[type]} params [description] 要获取的参数名
         * @return {[type]}        [description]
         */
        function getUrlParams(params) {
            var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
            var paramsData = window.location.search.substr(1).match(reg);
            return !!paramsData ? paramsData[2] : "0";
        }
        /**
         * [getSelectedTopic description] 获取选题列表
         * @param {[string]} [groupid] [description] 分组id
         * @return {[array]} selectedTopicsList [description] 选题列表
         */
        $scope.getSelectedTopic = function(group) {
            dataManagerService.getTopicsByGroupId(group.NEWGROUPID, $scope.status.selectedDatePost).then(function(data) {
                group.topicList = data;
                $timeout(function() {
                    changeLoadWatch("topicListLoadWatch");
                }, 500);
            });
        };
        /**
         * [getSelectedTopicTitle description] 过滤选题列表的标题
         * @param  {[type]} item [description]
         * @return {[type]}      [description]
         */
        $scope.getSelectedTopicTitle = function(item) {
            var title = "";
            if (item.REPORTTYPE == '2' || item.REPORTTYPE == '3' || item.REPORTTYPE == '4') {
                title = item.TITLE.length > 38 ? item.TITLE.substring(0, 38) + '...' : item.TITLE;
            } else {
                title = item.TITLE.length > 45 ? item.TITLE.substring(0, 45) + '...' : item.TITLE;
            }
            return title;
        };
        /**
         * [handleContent description] 处理稿件正文
         */
        $scope.handleContent = function() {
            dataManagerService.handleHtmlContent($scope.status.relatedDrafts[$scope.status.selectedIndex].CONTENT, 3090, function(content) {
                $timeout(function() {
                    $scope.status.relatedDrafts[$scope.status.selectedIndex].CONTENT = content;
                    changeLoadWatch("draftDetail");
                });
            });
        };
        /**
         * [handleExecutor description] 处理执行人信息
         * @return {[array]} selectedTopicsList [description] 选题列表
         */
        $scope.handleExecutor = function() {
            var executor = [];
            if (typeof $scope.status.curTopic.EXECUTOR === "string") return;
            for (var i = 0; i < $scope.status.curTopic.EXECUTOR.length; i++) {
                executor.push($scope.status.curTopic.EXECUTOR[i].USERNAME);
            }
            $timeout(function() {
                $scope.status.curTopic.EXECUTOR = executor.join("、");
            });
        };
        /**
         * [closeDetail description] 关闭稿件详情页
         */
        $scope.closeDetail = function() {
            $scope.status.draftDetail = false;
        };
        /**
         * [handleHtmlContent description] 处理html正文
         * @param {[string]} [attribute] [description] 稿件渠道
         */
        $scope.handleHtmlContent = function() {
            addContent().then(function() {
                dataManagerService.handleHtmlContent($scope.status.curTopic.CONTENT, 1569, function(data) {
                    $timeout(function() {
                        $scope.status.curTopic.CONTENT = data;
                        changeLoadWatch("contentLoadWatch");
                    });
                });
            });
        };
        /**
         * [addContent description] 补充正文
         */
        function addContent() {
            var deffer = $q.defer();
            if ($scope.status.curTopic.REPLIESINFO.length > 0 && !$scope.status.curTopic.hasAdded) {
                $scope.status.curTopic.CONTENT += "<br/><p></p>补充：";
                $scope.status.curTopic.CONTENT += (function() {
                    var REPLIESINFO = "";
                    for (var i = 0; i < $scope.status.curTopic.REPLIESINFO.length; i++) {
                        var singleRepliesinfo = $scope.status.curTopic.REPLIESINFO[i];
                        REPLIESINFO += "<p>" + singleRepliesinfo.ADDCONTENT + "</p>";
                    }
                    // 加br 是处理滑动到最下侧被遮挡
                    return REPLIESINFO + "<br/>";
                })();
                $scope.status.curTopic.hasAdded = true;
            }
            deffer.resolve();
            return deffer.promise;
        }
        /**
         * [description] 监控日期控件
         */
        var promise;
        $scope.$watch("status.selectedDate", function(newV, oldV) {
            if (promise) {
                $timeout.cancel(promise);
                promise = null;
            }
            promise = $timeout(function() {
                delete $scope.status.curTopic;
                var date = new Date(Date.parse(newV));
                $scope.status.selectedDatePost = dataManagerService.switchDateToString(date);
                $scope.status.selectedDateCN = dataManagerService.switchDateToStringCN(date);
                $scope.status.week = dataManagerService.getWeekDay(date.getDay());
                if(angular.isDefined($scope.data.id)) {
                    setSpecificTopicsGroup();
                } else {
                    setTopicsGroup();
                }
            }, 10);
            return promise;
        });
        /**
         * [dealWithArrangeMentData description] 发稿安排数据转换
         * @param {[string]} [attribute] [description] 稿件渠道
         */
        $scope.dealWithArrangeMentData = function(attribute) {
            var map = {
                "1": "文字",
                "2": "图片",
                "3": "视频",
                "4": "直播",
                "5": "可视化",
                "6": "H5",
                "7": "VR",

            };
            try {
                // 在$scope.status.curTopic.METATYPEINFO[0][attribute]定义下,才会显示map内容
                if (angular.isDefined($scope.status.curTopic.METATYPEINFO[0][attribute])) {
                    var array = $scope.status.curTopic.METATYPEINFO[0][attribute].split(",");
                    var textArray = [];
                    for (var i = 0; i < array.length; i++) {
                        textArray.push(map[array[i]]);
                    }
                    // 把其他内容显示在发稿安排里
                    if (angular.isDefined($scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"])) {
                        // 如果$scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"]为空,则不显示其他内容
                        if ($scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"] === "") {
                            return textArray.join("、");
                        } else if ($scope.status.curTopic.METATYPEINFO[0][attribute] === "") {
                            // 如果稿件安排为"",直接返回其他
                            return $scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"];
                        } else {
                            return textArray.join("、") + "、" + $scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"];
                        }
                    } else {
                        return textArray.join("、");
                    }
                } else if (angular.isDefined($scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"])) {
                    // 在$scope.status.curTopic.METATYPEINFO[0][attribute+ "OTHER"]定义下,直接显示其他内容
                    return $scope.status.curTopic.METATYPEINFO[0][attribute + "OTHER"];
                }

            } catch (e) {
                console.log(e);
            }

        };
        /**
         * [getIndex description] 获取列表一级循环和二级循环的index，用于初始化选中
         * @param {[string]} [index] [description] 子循环index
         * @param {[string]} [parentIndex] [description] 父循环index
         * @param {[obj]} [item] [description] 选中选题
         */
        $scope.getIndex = function(index, parentIndex, item) {
            if (index === 0 && parentIndex === 0) {
                $scope.clickTopic(item);
            }
        };
        /**
         * [operateAppendix description] 操作附件
         * @param {[obj]} [item] [description] 附件对象
         */
        $scope.operateAppendix = function(item) {
            if (item.oper === "下载") {
                var dom = document.createElement("a");
                $(dom).attr({
                    "href": item.REPORTAPPFILE,
                    "download": item.REPORTAPPDESC,
                });
                $(dom)[0].click();
            } else {
                previewAppendix(item);
            }
        };
        /**
         * [previewAppendix description] 预览附件
         * @param {[obj]} [item] [description] 附件对象
         */
        function previewAppendix(item) {
            $scope.status.showMaterial = true;
            $scope.status.curPlay = angular.copy(item);
            /*$scope.status.curPlay.url = $sce.trustAsResourceUrl("http://115.231.179.105/youku/69757C80FC84083A9307112D1E/030008020058CF2431096B315660058A24042B-52B8-8F93-AF85-D183DCE2C3B2.mp4?sid=049001105487312bf80c3_00&sign=03fa6d2f225ecd70403c488b3393c871&ctype=12");*/
        }
        $scope.closeVideo = function() {
            $scope.status.showMaterial = false;
        };
        /**
         * [handleImage description] 处理图片尺寸
         */
        $scope.handleImage = function() { //4160  2430
            var img = new Image();
            img.src = $scope.status.curPlay.REPORTAPPFILE;
            var aspectRatio = 4160 / 2430;
            var needWidth;
            var needHeight;
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                var imgAspectRatio = width / height;
                if (aspectRatio > imgAspectRatio) {
                    needHeight = 2430;
                    needWidth = 2430 * imgAspectRatio;
                } else {
                    needWidth = 4160;
                    needHeight = 4160 / imgAspectRatio;
                }
                $timeout(function() {
                    $scope.status.imgStyle = {
                        width: needWidth + "px",
                        height: needHeight + "px"
                    };
                });
            };
        };
        /**
         * [queryOper description] 查询操作类型
         * @param {[obj]} [item] [description] 附件对象
         */
        $scope.queryOper = function(item) {
            item.oper = "下载";
            if (item.REPORTFILEEXT.toLowerCase() === "mp4" || item.REPORTFILEEXT.toLowerCase() === "mp3" || item.REPORTFILEEXT.toLowerCase() === "image" || item.REPORTFILEEXT.toLowerCase() == "jpg" || item.REPORTFILEEXT.toLowerCase() == "png" || item.REPORTFILEEXT.toLowerCase() == "gif") {
                item.oper = "查看";
            }
        };
        /**
         * [clickTopic description] 点击选题
         * @param {[obj]} [item] [description] 选中选题
         */
        $scope.clickTopic = function(item) {
            $timeout(function() {
                delete $scope.status.curTopic;
            });
            $timeout(function() {
                $scope.status.curTopic = item;
                if (item.METADATAINFO.length !== 0)
                    getRelatedDraft(item.NEWREPORTID);
                else
                    delete $scope.status.relatedDrafts;
                changeLoadWatch("contentLoadWatch");
                $timeout(function() {
                    $timeout(function() {
                        changeLoadWatch("btxtXgxxWatch");
                    }, 200);
                }, 200);
            }, 100);
        };
        /**
         * [getRelatedDraft description] 获取相关稿件
         * @param {string} [reportId] [description] 选题id
         */
        function getRelatedDraft(reportId) {
            dataManagerService.getRelatedDraft(reportId).then(function(data) {
                $scope.status.relatedDrafts = data;
            });

        }
        /**
         * [initStatus description] 初始化状态
         */
        function initStatus() {
            var idParams = getUrlParams("id");
            $scope.status = {
                selectedDate: dataManagerService.switchDateToString(new Date()),
                datepickerShow: false,
                isFromPlanningCenter:  idParams !="0" ? true : false
            };
            $scope.data = {
                id: $scope.status.isFromPlanningCenter ? idParams : undefined
            };
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
         * [setTopicsGroup description] 设置选题分组数据
         */
        function setTopicsGroup() {
            dataManagerService.queryTopicsGroup($scope.status.selectedDatePost).then(function(data) {
                $scope.data.topicsGroup = data;
            });
        }
        /**
         * [setSpecificTopicsGroup description] 设置特定的选题分组数据
         */
        function setSpecificTopicsGroup() {
            dataManagerService.querySpecificTopicsGroup($scope.data.id).then(function(data) {
                $scope.data.topicsGroup = data;
            });
        }
    }]);
