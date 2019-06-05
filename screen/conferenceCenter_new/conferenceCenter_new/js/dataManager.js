//描述：编前选题
//时间：2017-3-16
//作者：Bai.Zhiming
"use strict";
angular.module("dataManagerModule", []).factory("dataManagerService", ["$q", "httpService", "$timeout", function($q, httpService, $timeout) {
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
    return {
        /**
         * [queryTopicsGroup description] 获取选题分组
         * @param {string} [date] [description] 选中日期
         */
        queryTopicsGroup: function(date) {
            var deffer = $q.defer();
            var params = {
                time: date,
                id: getUrlParams("id"),
                scene_level: getUrlParams("scene_level")
            };
            httpService.httpServer("/screen/pretheme/allgroups", params).then(function(data) {
                deffer.resolve(data);
            });
            return deffer.promise;
        },
        /**
         * [querySpecificTopicsGroup description] 获取特定的选题分组
         * @param {string} [id] [description] 该编前选题的id
         */
        querySpecificTopicsGroup: function(id) {
            var deffer = $q.defer();
            var params = {
                preselected_title_id: id,
                id: getUrlParams("id"),
                scene_level: getUrlParams("scene_level")
            };
            httpService.httpServer("/screen/preSelectedMgr/getSelectedGroups", params).then(function(data) {
                deffer.resolve(data);
            });
            return deffer.promise;
        },
        /**
         * [getTopicsByGroupId description] 通过分组ID获取选题列表
         * @param {string} [groupid] [description] 分组id
         * @param {string} [date] [description] 选中日期
         * @return {array} [description] 选题列表
         */
        getTopicsByGroupId: function(groupid, date) {
            var deffer = $q.defer();
            var params = {
                groupid: groupid,
                time: date,
                id: getUrlParams("id"),
                scene_level: getUrlParams("scene_level")
            };
            httpService.httpServer("/screen/pretheme/allreports", params).then(function(data) {
                deffer.resolve(data);
            });
            return deffer.promise;
        },
        /**
         * [getRelatedDraft description] 获取相关稿件
         * @param {string} [reportId] [description] 选题ID
         */
        getRelatedDraft: function(reportId) {
            var deffer = $q.defer();
            var params = {
                reportid: reportId,
                id: getUrlParams("id"),
                scene_level: getUrlParams("scene_level")
            };
            httpService.httpServer("/screen/pretheme/metadataLogs", params).then(function(data) {
                deffer.resolve(data);
            });
            return deffer.promise;
        },
        /**
         * [getWeekDay description] 获取星期
         * @param {int} [weekDay] [description] 星期参数
         * @return {array} [description] 选题列表
         */
        getWeekDay: function(weekDay) {
            var curWeekDay;
            switch (weekDay) {
                case 1:
                    curWeekDay = "星期一";
                    break;
                case 2:
                    curWeekDay = "星期二";
                    break;
                case 3:
                    curWeekDay = "星期三";
                    break;
                case 4:
                    curWeekDay = "星期四";
                    break;
                case 5:
                    curWeekDay = "星期五";
                    break;
                case 6:
                    curWeekDay = "星期六";
                    break;
                case 0:
                    curWeekDay = "星期日";
                    break;

            }
            return curWeekDay;
        },
        /**
         * [switchDateToString description] 处理HTML正文
         * @param {} [date] [description] date
         * @return {string} [htmlContent] 处理好的html正文
         */
        switchDateToString: function(date) {
            date = new Date(Date.parse(date));
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        },
        /**
         * [switchDateToString description] 处理HTML正文
         * @param {} [date] [description] date
         * @return {string} [htmlContent] 处理好的html正文
         */
        switchDateToStringCN: function(date) {
            date = new Date(Date.parse(date));
            return date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日";
        },
        /**
         * [handleHtmlContent description] 处理HTML正文
         * @param {string} [htmlContent] [description] html正文
         * @param {string} [contentContainWidth] [description] 正文容器宽度
         * @return {string} [htmlContent] 处理好的html正文
         */
        handleHtmlContent: function(htmlContent, contentContainWidth, success) {
            var self = this;
            var dom = document.createElement("div");
            var index = 0;
            var iframeIndex = 0;
            var videoIndex = 0;
            var audioIndex = 0;
            htmlContent = htmlContent.replace(/style="[^"]*"/g, "").replace(/width="[^"]*"/g, "").replace(/height="[^"]*"/g, "").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
            dom.innerHTML = htmlContent;
            $(dom).find("style").remove();
            //若正文尾部没有<p><br/><p>标签 则添加<p><br/><p>
            var hasBr = $(dom).find("p:last-child").text();
            if (hasBr != "") {
                $(dom).append("<p><br></p>");
            }
            var $imgs = $(dom).find("img");
            var $iframe = $(dom).find("iframe");
            var $video = $(dom).find("video");
            var $audio = $(dom).find("audio");
            handleImage($imgs, function() {
                handleIframe($iframe, function() {
                    handleVideo($video, function() {
                        handleAudio($audio, function() {
                            var contentHtml = $(dom).html();
                            contentHtml = contentHtml.replace(/(<(?:p|div)[^>]*>(?:<(?:span|strong|b)[^>]*>)*)(?:&nbsp;| |　)*/ig, "$1　　");
                            contentHtml = contentHtml.replace(/(<br[^>]*>)(?:&nbsp;| |　)*/ig, "$1　　");
                            contentHtml = contentHtml.replace(/>　　</g, "\>\<");
                            success(contentHtml);
                        });
                    });
                });
            });

            function handleIframe($iframe, success) {
                if (iframeIndex < $iframe.length) {
                    $iframe.eq(iframeIndex).attr("width", contentContainWidth - 320);
                    $iframe.eq(iframeIndex).attr("height", (contentContainWidth - 320) * 9 / 16);
                    iframeIndex++;
                    handleIframe($iframe, success);
                } else {
                    success();
                }
            }

            function handleVideo($video, success) {
                if (videoIndex < $video.length) {
                    $video.eq(videoIndex).attr("width", contentContainWidth - 320);
                    videoIndex++;
                    handleVideo($video, success);
                } else {
                    success();
                }
            }

            function handleAudio($audio, success) {
                if (audioIndex < $audio.length) {
                    $audio.eq(audioIndex).attr("width", contentContainWidth - 320);
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
                        if (imgWidth * 3 < (contentContainWidth - 320)) {
                            $imgs.eq(index).attr("width", imgWidth * 3);
                        } else {
                            $imgs.eq(index).attr("width", contentContainWidth - 320);
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
        },
        /**
         * [getVideoUrl description] 获取视频地址
         * @param {string} [videoId] [description] 视频ID
         * @param {obj} [scope] [description] 调用方法作用域的scope
         * @return {string} [htmlContent] 处理好的html正文
         */
        getVideoUrl: function(videoId, scope) {
            var timeout;
            var deffer = $q.defer();
            getStatus(function() {
                var params_ = {
                    pwd: videoId + "5rWZ5rGf6KeG55WM5aqS56uL5pa5",
                };
                httpService.httpServer("/screen/pretheme/encode", params_).then(function(token) {
                    var params__ = {
                        id: videoId,
                        token: token.key
                    };
                    httpService.httpServer("/screen/pretheme/downloadvideo", params__).then(function(data) {
                        deffer.resolve(data);
                    });
                });
            });
            scope.$on('$destroy', function() { //销毁定时器
                $timeout.cancel(timeout);
            });

            function getStatus(callback) {
                var params = {
                    id: videoId
                };
                httpService.httpServer("/screen/pretheme/getvideostatus", params).then(function(status) {
                    if (status.code === 0) {
                        scope.transcoding = false;
                        callback();
                    } else {
                        scope.transcoding = true;
                        timeout = $timeout(function() {
                            getStatus(callback);
                        }, 1000);
                    }
                });
            }
            return deffer.promise;

        }
    };
}]).filter("trsSce", ['$sce', function($sce) {
    return function(input) {
        if (angular.isDefined(input)) {
            input = $sce.trustAsHtml(input);
        }
        return input;
    };
}]).filter("trsSceUrl", ["$sce", function($sce) {
    return function(input) {
        if (angular.isDefined(input)) {
            input = $sce.trustAsResourceUrl(input);
        }
        return input;
    }
}]);
