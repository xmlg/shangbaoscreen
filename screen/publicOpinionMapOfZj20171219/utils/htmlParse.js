/**
 * 描述：对后台的wcm进行处理
 * 日期：2017-7-24
 */
"use strict";
angular.module("htmlParseModule", []).factory("htmlParseService", ["$q", "httpService", "$timeout", function($q, httpService, $timeout) {
    return {
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
                	$iframe.eq(iframeIndex).parent("p").attr("style","text-align: center");
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