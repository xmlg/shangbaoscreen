/**
 * 首页公用服务
 */
"use strict";
angular.module("homePageServiceModule", []).
factory("homePageService", ["$q", "httpService", function($q, httpService) {
    return {
        mapData: {
            "嘉兴市": {
                "g": {
                    "left": "1752.38px",
                    "top": "391.337px"
                },
                "g1": { "left": "1599.5px", "top": "699.001px" }
            },
            "杭州市": {
                "g": {
                    "left": "1100px",
                    "top": "880.52px"
                },
                "g1": { "left": "970.78px", "top": "1120.518px" }
            },
            "湖州市": {
                "g": {
                    "left": "1375.31px",
                    "top": "328.055px"
                },
                "g1": { "left": "1233.78px", "top": "618.055px" }
            },
            "绍兴市": {
                "g": {
                    "left": "538.62px",
                    "top": "943.28px"
                },
                "g1": { "left": "1560.38px", "top": "1230px" }
            },
            "舟山市": {
                "g": {
                    "left": "1200.86px",
                    "top": "704.18px"
                },
                "g1": { "left": "2237.86px", "top": "992.02px" }
            },
            "金华市": {
                "g": {
                    "left": "1399.5px",
                    "top": "1302.22px"
                },
                "g1": { "left": "1219.5px", "top": "1610.22px" }
            },
            "宁波市": {
                "g": {
                    "left": "1563.72px",
                    "top": "1314.22px"
                },
                "g1": { "left": "1978.5px", "top": "1165.22px" }
            },
            "衢州市": {
                "g": {
                    "left": "880.77px",
                    "top": "1334.13px"
                },
                "g1": { "left": "700.5px", "top": "1738.13px" }
            },
            "台州市": {
                "g": {
                    "left": "1978.53px",
                    "top": "1399.75px"
                },
                "g1": { "left": "1798.53px", "top": "1800.75px" }
            },
            "丽水市": {
                "g": {
                    "left": "22.38px",
                    "top": "1830.02px"
                },
                "g1": { "left": "1035.38px", "top": "2165.02px" }
            },
            "温州市": {
                "g": {
                    "left": "1568.99px",
                    "top": "2069.94px"
                },
                "g1": { "left": "1427.78px", "top": "2398.94px" }
            },
            "浙江": {
                "g": {},
                "g1": {}
            }
        },
        /**
         * [getAreaList description] 获取地区列表
         * @return {[type]} [description]
         */
        getAreaList: function() {
            var deffer = $q.defer();
            httpService.http("/screen/areahotpoint/getMenu", "", "get").then(function(data) {
                var tempEle = data;
                tempEle[0].dictName = "浙江";
                deffer.resolve(data);
            });
            return deffer.promise;
        },
        getMapOption: function() {
            return {
                series: [{
                    type: 'map',
                    map: "浙江"
                }],
                backgroundColor: "#0d141d",
                visualMap: {
                    show: false,
                    left: 'right',
                    min: 0,
                    max: 0,
                    inRange: {
                        color: ['#101A24']
                    },
                    //text: ['High', 'Low'], // 文本，默认为数值文本
                    calculable: false,
                },
                tooltip: {
                    show: false,
                    trigger: 'item',
                    showContent: true,
                    showDelay: 0,
                    triggerOn: 'click',
                    transitionDuration: 0.2,
                    formatter: function(params) {
                        /*var value = (params.value + '').split('.');
                        value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
                        return params.seriesName + '<br/>' + params.name + ': ' + value;*/
                        return "asdfad";
                    }
                },
                geo: {
                    show: true,
                    map: '浙江',
                    zlevel: 3,
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                "color": "white",
                                "fontStyle": "normal",
                                "fontWeight": "bold",
                                "fontFamily": "simhei",
                                "fontSize": 72
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                "color": "white",
                                "fontStyle": "normal",
                                "fontWeight": "bold",
                                "fontFamily": "simhei",
                                "fontSize": 72
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: '#101A24',
                            borderColor: "#77A4A9",
                            shadowColor: "#009297",
                            shadowBlur: 40,
                            borderWidth: 3,
                            shadowOffsetX: 10,
                            shadowOffsetY: 10
                        },
                        emphasis: {
                            areaColor: '#101A24',
                            borderColor: "#77A4A9",
                            shadowColor: "#009297",
                            shadowBlur: 40,
                            borderWidth: 3,
                            shadowOffsetX: 10,
                            shadowOffsetY: 10
                        }
                    },
                }
            };
        },
        /**
         * [handleHtmlContent description] 处理html正文
         * @param  {[type]} htmlContent [description]
         * @return {[type]}             [description]
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
         * [handleContent description] 处理纯文本正文
         * @param {string} [htmlcontent] [description] htmlcontent
         * @return {[type]} [description]
         */
        handleContent: function(htmlContent) {
            /*htmlContent = htmlContent.replace(/<\/p>/g, '<br>')
                .replace(/<\/div>/g, '\n')
                .replace(/<(p|div)[^>]*>/ig, '<br>')
                //.replace(/<br\/?>/gi, '\n')
                .replace(/<[^>]+>/g, '<br>')
                .replace(/&nbsp;/g, '\u3000')
                .replace(/><br>/g, ">")
                .replace(/><br></g, "><");
            var dom = document.createElement("div");
            dom.innerHTML = htmlContent;
            $(dom).find("br").eq(0).remove();
            return $(dom).html();*/
            var dom = document.createElement("div");
            dom.innerHTML = htmlContent;
            return $(dom).text();
        }
    };
}]);