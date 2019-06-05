//描述:热点新闻类
//日期:2017/1/3
//作者:bai.zhiming
"use strict";
(function() {
    var myScroll = new window.myScroll();
    var presentTime;
    window.hotNews = function(params) {
        this.morningTagUrl = params.morningTagUrl; //早会接口地址
        this.middleTagUrl = params.middleTagUrl; //中会接口地址
        this.eveningTagUrl = params.eveningTagUrl; //晚会接口地址
        this.draftListUrl = params.draftListUrl; //稿件列表接口地址
        this.draftDetailUrl = params.draftDetailUrl; //稿件详情接口地址
        this.cityAndCountyUrl = params.cityAndCountyUrl; //市县标签接口地址
        this.listTemplate = $(".list1").find("li").clone(); //稿件列表模板
        this.cityAndCountyTag = $(".content_l").find("li").clone(); //市县标签模板
        this.contentContainWidth = $(".hotNews_right").width();
        this.keepConnectionTimeout; //定时请求后端服务的定时器
        this.keepConnectionTime = 1000 * 60 * 5; //定时请求后端服务的设定时间
        this.keepConnection();
        // this.cityAndCountyDraftListUrl = params.cityAndCountyDraftListUrl; //市县新闻列表接口地址
    };
    /**
     * [keepConnection description] 定时请求后端服务，防止后端服务会话超时无响应
     * @return {[type]} [description]
     */
    hotNews.prototype.keepConnection = function() {
        var self = this;
        var id = self.getUrlParams("id");
        var scene_level = self.getUrlParams("scene_level");
        $.ajax({
            url: "/screen/areahotpoint/getDate?id=" + id + '&scene_level=' + scene_level,
            type: "get",
            dataType: "text",
            success: function() {
                clearTimeout(self.keepConnectionTimeout);
                self.keepConnectionTimeout = setTimeout(function() {
                    self.keepConnection();
                }, self.keepConnectionTime);
            },
            error: function() {
                clearTimeout(self.keepConnectionTimeout);
                self.keepConnectionTimeout = setTimeout(function() {
                    self.keepConnection();
                }, self.keepConnectionTime);
            }
        });
    };
    /**
     * [getUrlParams description] 获取路由参数
     * @param  {[type]} params [description] 要获取的参数名
     * @return {[type]}        [description]
     */
    hotNews.prototype.getUrlParams = function(params) {
        var self = this;
        var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
        var paramsData = window.location.search.substr(1).match(reg);
        return !!paramsData ? paramsData[2] : "0";
    };
    hotNews.prototype.HttpServer = function(url, params, dataType) {
        var deffer = $.Deferred();
        $.ajax({
            url: url,
            data: (params !== undefined ? params : null),
            dataType: dataType || "json",
            method: "get",
            timeout: 20000,
            success: function(data) {
                deffer.resolve(data);
            },
            error: function(data) {
                deffer.reject(data);
            }
        });
        return deffer.promise();
    };
    /**
     * [getDate description] 获取当前日期
     * @return {[string]} [description] 返回当前日期
     */
    hotNews.prototype.getDate = function() {
        //var date = new Date();
        //return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        var deffer = $.Deferred();
        var self = this;
        var params = {
            id: self.getUrlParams("id"),
            scene_level: self.getUrlParams("scene_level")
        };
        this.HttpServer("/screen/areahotpoint/getDate", params, "text").then(function(data) {
            deffer.resolve(data);
        });
        return deffer.promise();
    };
    /**
     * [selectTagTop description] 选中顶部标签
     * @param {[dom]} selectedDom  [description] 选中标签
     * @return {[null]} [description] 
     */
    hotNews.prototype.selectTagTop = function(selectedDom, url, params) {
        var deffer = $.Deferred();
        var self = this;
        $(selectedDom).addClass("active").siblings().removeClass("active");
        var tagTopParams = params;
        self.getList(url, tagTopParams).then(function() {
            self.selectDraft($(".list1").find("li").eq(0));
            deffer.resolve();
        });
        return deffer.promise();
    };
    /**
     * [selectDraft description] 选中稿件
     * @param {[$dom]} selectedDom  [description] 稿件所在dom
     * @return {[null]} [description] 
     */
    hotNews.prototype.selectDraft = function($dom) {
        var deffer = $.Deferred();
        var self = this;
        $dom.addClass("focus").siblings().removeClass('focus');
        self.getDraftDetail($dom[0]).then(function(data) {
            deffer.resolve();
        });
        return deffer.promise();
    };
    /**
     * [getDraftDetail description] 获取稿件详情
     * @param {[string]} GUID  [description] 稿件ID
     * @return {[null]} [description] 
     */
    hotNews.prototype.getDraftDetail = function($dom) {
        var deffer = $.Deferred();
        var self = this;
        var body = $(".hotNews_right_body");
        var params = {
            guid: $dom.GUID,
            id: self.getUrlParams("id"),
            scene_level: self.getUrlParams("scene_level")
        };
        var detonateMedia = "",
            mainMedia = "";
        if ($dom.DETONATEMEDIA != undefined && $dom.DETONATEMEDIA != null) {
            detonateMedia = $dom.DETONATEMEDIA.replace(/;/g, " ");
        }
        if ($dom.MAINMEDIA != undefined && $dom.MAINMEDIA != null) {
            mainMedia = $dom.MAINMEDIA.replace(/;/g, " ");
        }
        body.hide();
        body.find(".shadow").show();
        body.find(".hotNews_right_media").hide();
        //若存在来源媒体，则展示，不然则不展示
        detonateMedia === "" ? body.find(".detonate_group").hide() : body.find(".detonate_group").show();
        mainMedia === "" ? body.find(".main_group").hide() : body.find(".main_group").show();
        self.HttpServer(self.draftDetailUrl, params).then(function(data) {
            body.find(".hotNews_right_titile").html(data[0].DOCTITLE);
            body.find(".hotNews_right_resource").html(data[0].ZB_SOURCE_SITE);
            body.find(".hotNews_right_date").html(data[0].DOCPUBTIME);
            body.find(".hotNews_right_detonate_media").html(detonateMedia);
            body.find(".hotNews_right_main_media").html(mainMedia);
            self.handleHtmlcontent(data[0].IR_CONTENT, function(content) {
                content = content + "<br /><br /><br />"; //为底部留空间，反之底部文字被阴影遮挡
                body.find(".hotNews_right_text").html(content);
                //初始化来源媒体的高度
                document.getElementsByClassName("hotNews_right_media")[0].style.height = '0px';
                // document.getElementsByClassName("hotNews_right_content")[0].style.height = '0px';
                body.show();
                //根据来源媒体的数据量，使来源媒体的高度自适应
                body.find(".hotNews_right_media").show();
                var detonateHeight = document.getElementsByClassName("hotNews_right_detonate_media")[0].offsetHeight == 0 ? 0 : document.getElementsByClassName("hotNews_right_detonate_media")[0].offsetHeight + 50;
                var mainHeight = document.getElementsByClassName("hotNews_right_main_media")[0].offsetHeight == 0 ? 0 : document.getElementsByClassName("hotNews_right_main_media")[0].offsetHeight + 50;
                document.getElementsByClassName("detonate_group")[0].style.height = detonateHeight + 'px';
                document.getElementsByClassName("main_group")[0].style.height = mainHeight + 'px';
                $(".hotNews_right_media").css({ "height": detonateHeight + mainHeight + 'px' });
                // var titleHeight = document.getElementsByClassName("hotNews_right_titile")[0].offsetHeight;
                // $(".hotNews_right_content").css({ "height": 2450 - detonateHeight - mainHeight - titleHeight + 'px' });
                myScroll.scroll("wrapper2");
                deffer.resolve();
            });
        }, function() {
            /*var href = location.pathname.split("/");
            if(href[3]=="zhejiang") {
                self.getDraftDetail($dom);
            }*/
        });
        return deffer.promise();
    };
    /**
     * [getList description] 获取稿件列表
     * @return {[string]} [description] 返回稿件列表
     */
    hotNews.prototype.getList = function(url, params) {
        var deffer = $.Deferred();
        var self = this;
        $(".list1").stop(true).fadeOut('slow', function() {
            self.HttpServer(url, params).then(function(data) {
                var templateArray = [];
                for (var i = 0; i < data.length; i++) {
                    var template = self.listTemplate.clone();
                    var dom = document.createElement("div");
                    dom.innerHTML = data[i].TITLE;
                    template.find(".content-inner").find("span").eq(0).html((1 + i) + ".");
                    template.find(".content-inner").find("span").eq(1).html(dom.innerText);
                    template[0].GUID = data[i].GUID;
                    template[0].DETONATEMEDIA = data[i].DETONATEMEDIA;
                    template[0].MAINMEDIA = data[i].MAINMEDIA;
                    template.find(".bar-inner").animate({ width: self.clusterNumsScale(data, data[i].CLUSTERNUMS) }, "slow");
                    self.digitalGrowth(template.find(".value"), data[i].CLUSTERNUMS);
                    template.bind("click", function() {
                        self.selectDraft($(this));
                    });
                    templateArray.push(template);
                }
                $(".list1").html(templateArray).stop(true).fadeIn("slow", function() {
                    myScroll.scroll("wrapper1");
                    deffer.resolve();
                });
            });
        });
        return deffer.promise();
    };
    /**
     * [getDate description] 获取会早、会中、会后标签
     * @return {[string]} [description] 返回当前日期
     */
    hotNews.prototype.timeTags = function(params) {
        var deffer = $.Deferred();
        var self = this;
        var timeTags = {
            "morningConference": false,
            "noonConference": false,
            "eveningConference": false
        };
        self.HttpServer(self.morningTagUrl, params).then(function(data) {
            if (data.length !== 0) {
                timeTags.morningConference = true;
            }
            self.HttpServer(self.middleTagUrl, params).then(function(data) {
                if (data.length !== 0) {
                    timeTags.noonConference = true;
                }
                self.HttpServer(self.eveningTagUrl, params).then(function(data) {
                    if (data.length !== 0) {
                        timeTags.eveningConference = true;
                    }
                    var myUl = $(".content_c_top_l").find("li");
                    if (timeTags.morningConference) {
                        myUl.eq(1).show().unbind("click").bind("click", function() {
                            self.selectTagTop($(this), self.morningTagUrl, params);
                        });
                    }
                    if (timeTags.noonConference) {
                        myUl.eq(2).show().unbind("click").bind("click", function() {
                            self.selectTagTop($(this), self.middleTagUrl, params);
                        });
                    }
                    if (timeTags.eveningConference) {
                        myUl.eq(3).show().unbind("click").bind("click", function() {
                            self.selectTagTop($(this), self.eveningTagUrl, params);
                        });
                    }
                    deffer.resolve();
                });
            });
        });
        /*self.HttpServer(self.timeTagsUrl).then(function(data) {
            var myUl = $(".content_c_top_l").find("li");
            if (data.morningConference) {
                myUl.eq(1).show().unbind("click").bind("click", function() {
                    self.selectTagTop($(this));
                });
            }
            if (data.noonConference) {
                myUl.eq(2).show().unbind("click").bind("click", function() {
                    self.selectTagTop($(this));
                });
            }
            if (data.eveningConference) {
                myUl.eq(3).show().unbind("click").bind("click", function() {
                    self.selectTagTop($(this));
                });
            }
            deffer.resolve();
        });*/
        return deffer;
    };
    /**
     * [init description] 普通初始化
     */
    hotNews.prototype.init = function(params) {

        var self = this;
        //var deffer = $.Deferred();
        //设置时间标签旁边的日期显示
        self.getDate().then(function(data) {
            params.pointDate = data;
            presentTime = data;
            $(".content_c_top_l").find(".time").html(data).unbind("click").bind("click", function() {
                self.selectTagTop($(this), self.draftListUrl, params);
            });
            self.selectTagTop($(".content_c_top_l").find(".time"), self.draftListUrl, params); //默认选中日期标签
            self.timeTags(params).then(function(data) {

            });
        });
    };
    /**
     * [digitalGrowth description] 数字增长效果
     */
    hotNews.prototype.digitalGrowth = function($dom, digital) {
        var i = 1;
        var speed = 10 / digital;
        growth();

        function growth() {
            setTimeout(function() {
                if (i < digital) {
                    if (digital - i >= 10) i += 10;
                    else i = digital;
                    $dom.html(i);
                    growth();
                }
            }, speed);
        }
        if (digital == 1) { //值为1
            $dom.html(digital);
        }
    };
    /**
     * [clusterNumsScale description] 获取热度比
     * @param {[array]} array  [description] 完整列表
     * @param {[string]} CLUSTERNUMS  [description] 热度值
     * @return {[null]} [description] 
     */
    hotNews.prototype.clusterNumsScale = function(array, CLUSTERNUMS) {
        var max = parseInt(array[0].CLUSTERNUMS);
        for (var i = 0; i < array.length; i++) {
            var _CLUSTERNUMS = parseInt(array[i].CLUSTERNUMS);
            if (_CLUSTERNUMS > max) max = _CLUSTERNUMS;
        }
        return (CLUSTERNUMS / max) * 100 + "%";
    };
    /**
     * [handleHtmlcontent description] 处理HTML正文
     * @param {[string]} htmlContent  [description] html正文
     * @param {[fn]} success  [description] 处理成功后的回调
     * @return {[null]} [description] 
     */
    hotNews.prototype.handleHtmlcontent = function(htmlContent, success) {
        var self = this;
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
                $iframe.eq(iframeIndex).attr("width", self.contentContainWidth - 320);
                $iframe.eq(iframeIndex).attr("height", (self.contentContainWidth - 320) * 9 / 16);
                iframeIndex++;
                handleIframe($iframe, success);
            } else {
                success();
            }
        }

        function handleVideo($video, success) {
            if (videoIndex < $video.length) {
                $video.eq(videoIndex).attr("width", self.contentContainWidth - 320);
                videoIndex++;
                handleVideo($video, success);
            } else {
                success();
            }
        }

        function handleAudio($audio, success) {
            if (audioIndex < $audio.length) {
                $audio.eq(audioIndex).attr("width", self.contentContainWidth - 320);
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
                    if (imgWidth * 3 < (self.contentContainWidth - 320)) {
                        $imgs.eq(index).attr("width", imgWidth * 3);
                    } else {
                        $imgs.eq(index).attr("width", self.contentContainWidth - 320);
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
    };
    /**
     * [handleHtmlcontent description] 获取市县标签 （浙江热点专用）
     */
    hotNews.prototype.getCityAndCounty = function(params) {
        var deffer = $.Deferred();
        var self = this;
        var theParams = {
            id: self.getUrlParams("id"),
            scene_level: self.getUrlParams("scene_level")
        };
        self.HttpServer(self.cityAndCountyUrl, theParams).then(function(data) {
            var templateArray = [];
            for (var i = 0; i < data.length; i++) {
                var template = self.cityAndCountyTag.clone();
                template.html(data[i].dictName).bind("click", function() {
                    self.selectCACTag($(this), params);
                });
                template[0].tagId = data[i].dictNum;
                templateArray.push(template);
            }
            $(".content_l").find("ul").html(templateArray);
            deffer.resolve(data);
        });
        return deffer.promise();
    };
    /**
     * [init description] 浙江热点初始化
     */
    hotNews.prototype.initZj = function(params) {
        var self = this;
        self.getCityAndCounty(params).then(function(data) {
            self.selectCACTag($(".content_l").find("li").eq(0), params);
        });
    };
    /**
     * [selectCACTag description] 选中市县标签事件
     * @param {[$dom]} $li  [description] 选中标签
     * @return {[null]} [description] 
     */
    hotNews.prototype.selectCACTag = function($li, params) {
        var deffer = $.Deferred();
        $li.addClass("curr");
        var self = this;
        $li.siblings().removeClass('curr');
        params.area = $li[0].tagId;
        if ($li[0].tagId === "001020") {
            $(".content_c_top_l").find("ul").fadeIn("slow");
            self.init(params);
        } else {
            //$(".content_c_top_l").find("ul").fadeOut("slow");
            var myUl = $(".content_c_top_l").find("li");
            myUl.eq(1).fadeOut("slow");
            myUl.eq(2).fadeOut("slow");
            myUl.eq(3).fadeOut("slow");
            $(".list1").stop(true).fadeOut('slow', function() {
                $(".content_c_top_l").find(".time").addClass("active").siblings().removeClass("active");
                params.pointDate = presentTime;
                self.HttpServer(self.draftListUrl, params).then(function(data) {
                    var templateArray = [];
                    for (var i = 0; i < data.length; i++) {
                        var template = self.listTemplate.clone();
                        template.find(".content-inner").find("span").eq(0).html((1 + i) + ".");
                        template.find(".content-inner").find("span").eq(1).html(data[i].TITLE);
                        template[0].GUID = data[i].GUID;
                        template[0].DETONATEMEDIA = data[i].DETONATEMEDIA;
                        template[0].MAINMEDIA = data[i].MAINMEDIA;
                        template.find(".bar-inner").animate({ width: self.clusterNumsScale(data, data[i].CLUSTERNUMS) }, "slow");
                        self.digitalGrowth(template.find(".value"), data[i].CLUSTERNUMS);
                        template.bind("click", function() {
                            self.selectDraft($(this));
                        });
                        templateArray.push(template);
                    }
                    $(".list1").html(templateArray).stop(true).fadeIn("slow", function() {
                        myScroll.scroll("wrapper1");
                        self.selectDraft($(this).children().eq(0));
                        deffer.resolve();
                    });
                });
            });
        }
        return deffer.promise();
    };
})();