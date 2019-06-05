"use strict";
angular.module("zhejiangHotnewsModule", ["ngAnimate", "httpServerModule"])
    .controller("zhejiangHotnewsCtrl", ["$scope", "$q", "$sce", "http", "$timeout", function($scope, $q, $sce, http, $timeout) {
        initStatus();
        initData();
        /**
         * [initStatus description] 初始化状态
         * @return {[type]} [description]
         */
        function initStatus() {
            $scope.status = {
                contentContainWidth: $(".hotNews_right").width()
            };
            $scope.data = {};
        }
        /**
         * [initData description] 初始化数据
         * @return {[type]} [description]
         */
        function initData() {
            getNow();
            getTabs().then(function() {
                getMainTitle();
                return getAreaList();
            }).then(function() {
                $scope.selectProvince();
            });
        }
        /**
         * [showTags description] 标签是否展示
         * @param {[object]} [varname] [description] 
         * @return {[type]} [description]
         */
        function showTags(data) {
            var time1 = new Date($scope.status.today + " " + data.pointTo1);
            var time2 = new Date($scope.status.today + " " + data.pointTo2);
            var time3 = new Date($scope.status.today + " " + data.pointTo3);
            var now = new Date();
            if (now > time1)
                $scope.status.showMorning = true;
            if (now > time2)
                $scope.status.showNoon = true;
            if (now > time3)
                $scope.status.showNight = true;
        }
        /**
         * [selectProvince description] 选择全省区域
         * @return {[type]} [description]
         */
        $scope.selectProvince = function() {
            $scope.status.selectedArea = $scope.status.areaData[0];
            $scope.getDefaultList();
        };
        /**
         * [selectCity description] 选择城市
         * @param  {[type]} item [description] 城市数据
         * @return {[type]}      [description]
         */
        $scope.selectCity = function(item) {
            $scope.status.selectedArea = item;
            $scope.getDefaultList();
        };
        /**
         * [getCityList description] 获取城市热点数据列表
         * @return {[type]} [description]
         */
        $scope.getCityList = function() {
            //delete $scope.data.list;
            $scope.data.list = [];//清空数组
            var deffer = $q.defer();
            var params = {
                area: $scope.status.selectedArea.dictNum,
                pointDate: $scope.status.today,
                subjectarea: 1,
                field: '000',
                clustername: 'provice_1'
            };
            http.getData("/screen/areahotpoint/zjhotpoint", params).then(function(data) {
                for (var i = 0; i < data.length; i++) {
                    data[i].docTitle = data[i].TITLE;
                    data[i].signGuid = data[i].GUID;
                    //data[i].weighted_nums = data[i].WEIGHTEDNUMS == 0 ? '' : data[i].WEIGHTEDNUMS;//返回0则不显示
                    data[i].detonateMedia = data[i].DETONATEMEDIA;
                    data[i].mainMedia = data[i].MAINMEDIA;
                    if (data[i].WEIGHTEDNUMS > 0) { //热度值返回大于0才显示该条数据
                        data[i].weighted_nums = data[i].WEIGHTEDNUMS;
                        $scope.data.list.push(data[i]);
                    }
                }
                //$scope.data.list = data;
                $scope.selectDoc($scope.data.list[0]);
                deffer.resolve();
            });
            return deffer.promise;
        };
        /**
         * [getCityList description] 获取区域列表
         * @return {[type]} [description]
         */
        function getAreaList() {
            var deffer = $q.defer();
            http.getData("/screen/areahotpoint/getMenu", {}).then(function(data) {
                $scope.status.areaData = data;
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
            $scope.status.mainTitle = "浙江热点新闻";
        }
        /**
         * [getTabs description] 获取顶部标签
         * @return {[type]} [description]
         */
        function getTabs() {
            var deffer = $q.defer();
            getToday().then(function() {
                return getCustomHotPointArea();
            }).then(function() {
                deffer.resolve();
            });
            return deffer.promise;
        }
        /**
         * [selectDoc description] 选中稿件
         * @param {[object]} [item] [description] 稿件数据
         * @return {[type]} [description]
         */
        $scope.selectDoc = function(item) {
            $scope.status.selectedDoc = item;
            getDetail();
        };
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

        function getNow() {
            $scope.status.now = new Date().getHours();
        }
        /**
         * [getCustomHotPointArea description] 获取自定义地域热点新闻相关信息
         * @return {[type]} [description]
         */
        function getCustomHotPointArea() {
            var deffer = $q.defer();
            http.getData("/screen/areaHotPointFuncMgr/getCustomHotPointArea").then(function(data) {
                $scope.status.customHotPointArea = data;
                showTags(data);
                deffer.resolve();
            });
            return deffer.promise;
        }
        /**
         * [getDefaultList description] 获取默认列表数据
         * @return {[type]} [description]
         */
        $scope.getDefaultList = function() {
            $scope.status.selectedTab = "today";
            if ($scope.status.selectedArea !== $scope.status.areaData[0]) {
                $scope.getCityList();
                return;
            }
            var deffer = $q.defer();
            getHotPointList($scope.status.today, $scope.status.now).then(function(data) {
                $scope.selectDoc($scope.data.list[0]);
                deffer.resolve();
            });
            return deffer.promise;
        };
        /**
         * [morning description] 早会
         * @return {[type]} [description]
         */
        $scope.morning = function() {
            $scope.status.selectedTab = "morning";
            getHotPointList($scope.status.today, 97, $scope.status.customHotPointArea.pointdayFr1, $scope.status.customHotPointArea.pointdayTo1, $scope.status.customHotPointArea.pointFr1, $scope.status.customHotPointArea.pointTo1).then(function() {
                $scope.selectDoc($scope.data.list[0]);
            });
        };
        /**
         * [morning description] 中会
         * @return {[type]} [description]
         */
        $scope.noon = function() {
            $scope.status.selectedTab = "noon";
            getHotPointList($scope.status.today, 98, $scope.status.customHotPointArea.pointdayFr2, $scope.status.customHotPointArea.pointdayTo2, $scope.status.customHotPointArea.pointFr2, $scope.status.customHotPointArea.pointTo2).then(function() {
                $scope.selectDoc($scope.data.list[0]);
            });
        };
        /**
         * [getDetail description] 获取文章详情
         * @return {[type]} [description]
         */
        function getDetail() {
            delete $scope.data.detail;
            var params = {
                guid: $scope.status.selectedDoc.signGuid
            };
            http.getData("/screen/areahotpoint/pointDetail", params).then(function(data) {
                $scope.data.detail = data[0];
                if (!data[0]) {
                    return;
                }
                $scope.status.selectedDoc.detonateMedia = !!$scope.status.selectedDoc.detonateMedia ? $scope.status.selectedDoc.detonateMedia.replace(/;/g, " ") : $scope.status.selectedDoc.detonateMedia;
                $scope.status.selectedDoc.mainMedia = !!$scope.status.selectedDoc.mainMedia ? $scope.status.selectedDoc.mainMedia.replace(/;/g, " ") : $scope.status.selectedDoc.mainMedia;
                handleHtmlContent(data[0].CONTENT, function(html) {
                    $scope.status.htmlContent = $sce.trustAsHtml(html);
                    console.log($scope.status.htmlContent);
                    $timeout(function() {
                        document.getElementsByClassName("hotNews_right_media")[0].style.height = '0px';
                        var detonateHeight = document.getElementsByClassName("hotNews_right_detonate_media")[0].offsetHeight == 0 ? 0 : document.getElementsByClassName("hotNews_right_detonate_media")[0].offsetHeight + 50;
                        var mainHeight = document.getElementsByClassName("hotNews_right_main_media")[0].offsetHeight == 0 ? 0 : document.getElementsByClassName("hotNews_right_main_media")[0].offsetHeight + 50;
                        document.getElementsByClassName("detonate_group")[0].style.height = detonateHeight + 'px';
                        document.getElementsByClassName("main_group")[0].style.height = mainHeight + 'px';
                        $(".hotNews_right_media").css({ "height": detonateHeight + mainHeight + 'px' });
                    });
                });
            });
        }
        /**
         * [handleHtmlContent description] 处理html正文
         * @return {[type]} [description]
         */
        function handleHtmlContent(htmlContent, success) {
            var dom = document.createElement("div");
            var index = 0;
            var iframeIndex = 0;
            var videoIndex = 0;
            var audioIndex = 0;
            htmlContent = htmlContent.replace(/style="[^"]*"/g, "").replace(/width="[^"]*"/g, "").replace(/height="[^"]*"/g, "").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
            dom.innerHTML = htmlContent;
            var $imgs = $(dom).find("img");
            var $iframe = $(dom).find("iframe");
            var $video = $(dom).find("video");
            var $audio = $(dom).find("audio");
            handleImage($imgs, function() {
                handleIframe($iframe, function() {
                    handleVideo($video, function() {
                        handleAudio($audio, function() {
                            success($(dom).html());
                        });
                    });
                });
            });

            function handleIframe($iframe, success) {
                if (iframeIndex < $iframe.length) {
                    $iframe.eq(iframeIndex).attr("width", $scope.status.contentContainWidth - 320);
                    $iframe.eq(iframeIndex).attr("height", ($scope.status.contentContainWidth - 320) * 9 / 16);
                    iframeIndex++;
                    handleIframe($iframe, success);
                } else {
                    success();
                }
            }

            function handleVideo($video, success) {
                if (videoIndex < $video.length) {
                    $video.eq(videoIndex).attr("width", $scope.status.contentContainWidth - 320);
                    videoIndex++;
                    handleVideo($video, success);
                } else {
                    success();
                }
            }

            function handleAudio($audio, success) {
                if (audioIndex < $audio.length) {
                    $audio.eq(audioIndex).attr("width", $scope.status.contentContainWidth - 320);
                    audioIndex++;
                    handleAudio($audio, success);
                } else {
                    success();
                }
            }

            function handleImage($imgs, success, reload) {
                if (index < $imgs.length) {
                    var img = new Image();
                    img.src = $imgs.eq(index).attr("src");
                    img.onload = function() {
                        var imgWidth = img.width;
                        var imgHeight = img.height;
                        if (imgWidth * 3 < ($scope.status.contentContainWidth - 320)) {
                            $imgs.eq(index).attr("width", imgWidth * 3);
                        } else {
                            $imgs.eq(index).attr("width", $scope.status.contentContainWidth - 320);
                        }
                        index++;
                        handleImage($imgs, success);
                    };
                    img.onerror = function() {
                        if (reload) index++;
                        handleImage($imgs, success, reload ? null : true);
                    };
                } else {
                    success();
                }
            }
        }
        /**
         * [morning description] 晚会
         * @return {[type]} [description]
         */
        $scope.night = function() {
            $scope.status.selectedTab = "night";
            getHotPointList($scope.status.today, 99, $scope.status.customHotPointArea.pointdayFr3, $scope.status.customHotPointArea.pointdayTo3, $scope.status.customHotPointArea.pointFr3, $scope.status.customHotPointArea.pointTo3).then(function() {
                $scope.selectDoc($scope.data.list[0]);
            });
        };
        /**
         * [getPercent description] 
         * @param {[object]} [item] [description] 稿件数据
         * @return {[type]} [description]
         */
        $scope.getPercent = function(item) {
            if (item.weighted_nums != undefined && item.weighted_nums > 0) {
                item.percent = "width:" + (Number(item.weighted_nums) / Number($scope.data.list[0].weighted_nums)) * 100 + "%";
            }
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
                page_size: 100,
                page_no: 0,
                hot_type: "001020",
                day_flag_from: dayFlagFrom,
                day_flag_to: dayFlagTo,
                day_time_from: dayTimeFrom,
                day_time_to: dayTimeTo,
                search_hour: searchHour,
                area_id: "001020",
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
