"use strict";
(function() {
    // var myScroll = new window.myScroll();
    var variable = {
        geturl: "/screen/publicsentiment/getMeetinglist",
        getDetailUrl: "/screen/publicsentiment/getMeetingDetail",
        location: window.location.search,
        listTimeOut: "",
        pager: ""
    };
    var pageOptions = {
        pageIndex: 0, //当前页码
        pageSize: 14, //每页显示数量
        itemCount: 0, //显示项的总数量
        maxButtonCount: 7, //除去第一页和最后一页的最大按钮数量
        prevText: "<< 上一页",
        nextText: "下一页 >>",
        buildPageUrl: null,
        onPageChanged: null //页码修改后的回调函数，包含一个pageIndex参数
    };
    var template = $("#list").children(0).clone(),
        goThroughArrray,
        curReadDoc,
        goThroughIndex,
        isAuto,
        startWaitTime, //文章开始滚动前等待时间 30秒
        breakOffOperationRefreshTime, //脱离人工操作后定时刷新页面时间
        breakOffOperation, //脱离人工操作后定时器
        endWaitTime, //文章结束滚动后等待时间 15秒
        goThrough, //遍历定时器
        scrollTimeout, //文章滚动定时器
        finishGoThroughTime, //结束遍历后刷新时间
        scrollSpeed, //滚动速度
        globalSpeedRate = 1, //全局速率
        keepConnectionTimeout, //定时请求后端服务的定时器
        keepConnectionTime = 1000 * 60 * 5, //定时请求后端服务的设定时间
        noDataTimeout, //暂无数据时定时重载定时器
        noDataWaitTime = 1000 * 60 * 2, //暂无数据时定时重载
        containWidth = $(".todayHotHeadLine_right_body").width();
    /**
     * [HttpServer description] ajax请求工具方法
     * @param {[string]} url  [description] 接口请求地址
     * @param {[params]} obj  [description] 接口请求参数
     * @return {[obj]} [description] 接口返回数据
     */
    var HttpServer = function(url, params, dataType) {
        var deffer = $.Deferred();
        $.ajax({
            data: (params === undefined ? "" : params),
            dataType: dataType || "json",
            timeOut: 20000,
            method: "get",
            url: url,
            success: function(data) {
                deffer.resolve(data);
            },
            error: function(data) {
                deffer.reject(data);
            }
        });
        return deffer.promise();
    };

    keepConnection();
    /**
     * [keepConnection description] 定时请求后端服务，防止后端服务会话超时无响应
     * @return {[type]} [description]
     */
    function keepConnection() {
        var params = {
            id: getUrlParams("id"),
            scene_level: getUrlParams("scene_level")
        };
        HttpServer("/screen/areahotpoint/getDate", params, "text").done(function() {
            clearTimeout(keepConnectionTimeout);
            keepConnectionTimeout = setTimeout(function() {
                keepConnection();
            }, keepConnectionTime);
        }).fail(function() {
            clearTimeout(keepConnectionTimeout);
            keepConnectionTimeout = setTimeout(function() {
                keepConnection();
            }, keepConnectionTime);
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

    initBoundary();
    start();

    /**
     * [initBoundary description]初始化界面
     * @return {[type]}  promise  [description]
     */
    function initBoundary() {
        goThroughArrray = [];
        curReadDoc = undefined;
        goThroughIndex = 0;
        isAuto = true;
        startWaitTime = 5000 / globalSpeedRate;
        endWaitTime = 5000 / globalSpeedRate;
        breakOffOperationRefreshTime = 150000 / globalSpeedRate;
        finishGoThroughTime = 15000 / globalSpeedRate;
        scrollSpeed = 0.2 * globalSpeedRate;
        clearTimeout(goThrough);
        clearTimeout(breakOffOperation);
        $('.todayHotHeadLine_manuscript_content').stop(true).scrollTop(0);
        $('#list').stop(true).css("top", "0px");
    }

    function start() {
        queryListData(0);
    }

    /**
     * [queryListData description] 请求列表数据
     * @param  {[type]} pageIndex [description] 当前页码
     * @return {[type]}           [description]
     */
    function queryListData(pageIndex) {
        var params = {
            id: getUrlParams("id"),
            scene_level: getUrlParams("scene_level"),
            pagesize: pageOptions.pageSize,
            startpage: pageIndex
        };
        HttpServer(variable.geturl, params).then(function(data) {
            $('#header_title').html(data.SENTIMENT_INDEX); //显示头部大标题
            $(document).attr("title", data.SENTIMENT_INDEX); //修改title值
            if (data.ITEMS.PAGEITEMS.length === 0) {
                $('.noData').show();
                $('.content').hide();

                //暂无数据时，定时去请求页面
                clearTimeout(noDataTimeout);
                noDataTimeout = setTimeout(function() {
                    reload();
                }, noDataWaitTime);
            } else {
                $('.noData').hide();
                $('.content').show();
                /*$('#header_title').html(data.SENTIMENT_INDEX);//显示头部大标题*/
                getlist(data);
                selectDoc(goThroughArrray[goThroughIndex], function() {
                    if (goThroughArrray.length > 1) {
                        goThrough = setTimeout(function() {
                            goThroughIndex++;
                            goThroughDoc();
                        }, endWaitTime);
                    } else {
                        finishGoThrough();
                    }
                });
            }
        });
    }
    /*
     [getlist] 获取列表 处理
    */
    function getlist(data) {
        var _data = data.ITEMS.PAGEITEMS;
        $("#list").html("");
        var array = [];
        goThroughArrray = [];
        goThroughIndex = 0;
        for (var i = 0; i < _data.length; i++) {
            // _data[i].SERIALNUMBER = i + 1;
            var templateCopy = template.clone();
            templateCopy[0].DOCTITLE = _data[i].DOCTITLE;
            templateCopy[0].DOCPUBTIME = _data[i].DOCPUBTIME;
            templateCopy[0].SOURCESITE = _data[i].SOURCESITE;
            templateCopy[0].CONTENT = _data[i].CONTENT;
            templateCopy[0].TABLENAME = _data[i].TABLENAME;
            templateCopy[0].ZB_GUID_CHAR = _data[i].ZB_GUID_CHAR;
            templateCopy.find(".list-serial-number").html(i + 1);
            templateCopy.find(".list-title").html(_data[i].DOCTITLE);
            templateCopy.find(".list-new").html(_data[i].NEWFLG);
            templateCopy.find(".list-publishing-media").html(_data[i].SOURCESITE);
            templateCopy.find(".list-release-time").html(_data[i].DOCPUBTIME.substring(10));
            templateCopy.bind("click", function() {
                isAuto = false; //取消自动播放
                var $this = $(this);
                selectDoc($this);
                breakOffOperationFn();
            });
            array.push(templateCopy);
            goThroughArrray.push(templateCopy);
        }
        $("#list").html(array);
        $("#list").fadeIn("slow");
        for (var j = 0; j < array.length; j++) {
            array[j].fadeIn("slow");
        }
        pageOptions.itemCount = data.ITEMS.TOTALITEMCOUNT;
        pageOptions.pageIndex = data.ITEMS.PAGEINDEX;
        pageOptions.onPageChanged = function(pageIndex) {
            $("#list").find("ul").fadeOut("slow");
            $(".todayHotHeadLine_right_body").fadeOut("slow");
            clearTimeout(variable.listTimeOut);
            variable.listTimeOut = setTimeout(function() {
                initBoundary();
                queryListData(pageIndex);
            }, 600);
        };
        delete variable.pager;
        variable.pager = $(".content-llower").find(".pager").pager(pageOptions);
    }

    /**
     * [selectDoc description]选中文章
     * @param  {[obj]} $liDom [description]将被选中的文章节点
     * @return {[type]}      [description]
     */
    function selectDoc($liDom, success) {
        $('.todayHotHeadLine_manuscript_content').stop(true).scrollTop(0);
        unSelectDoc(curReadDoc);
        curReadDoc = $liDom;
        $liDom.addClass("focus");
        $('.todayHotHeadLine_right_body').fadeOut("fast", function() {
            getDocDetail($liDom[0]).then(function(data) {
                if (data === "success") {
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(function() {
                        detailScroll(function() {
                            if ($.isFunction(success)) success();
                        });
                    }, startWaitTime);
                } else {
                    if ($.isFunction(success)) success();
                }
            });
        });
    }

    /**
     * [unSelectDoc description]取消选中文章
     * @param  {[obj]} $liDom [description]将被取消选中的文章节点
     * @return {[type]}      [description]
     */
    function unSelectDoc($liDom) {
        if ($liDom !== undefined) {
            curReadDoc = undefined;
            $liDom.removeClass("focus");
        }
        $("#docDetail").hide();
    }

    /**
     * [getDocDetail description]获取稿件详情
     * @param  {[string]} docid [description]稿件ID
     * @return {[type]}  promise  [description]
     */
    function getDocDetail($liDom) {
        var defer = $.Deferred();
        var params = {
            guid: $liDom.ZB_GUID_CHAR,
            tablename: $liDom.TABLENAME,
            id: getUrlParams("id"),
            scene_level: getUrlParams("scene_level")
        };
        HttpServer(variable.getDetailUrl, params).then(function(data) {
            $('.todayHotHeadLine_right_body').fadeIn();
            var detailDom = $("#todayHotHeadLine_right_body");
            detailDom.find(".todayHotHeadLine_right_title").html($liDom.DOCTITLE);
            detailDom.find(".todayHotHeadLines_right_resource").html($liDom.SOURCESITE);
            detailDom.find(".todayHotHeadLine_right_date").html($liDom.DOCPUBTIME);
            handleHtmlcontent(data.content, function(_data) {
                detailDom.find(".todayHotHeadLine_right_text").html(_data);
                defer.resolve("success");
            });
        }, function(data) {
            defer.resolve("error");
        });
        return defer.promise();
    }

    /**
     * [handleHtmlcontent description]处理html正文
     */
    function handleHtmlcontent(htmlContent, success) {
        var dom = document.createElement("div");
        var index = 0;
        var iframeIndex = 0;
        var videoIndex = 0;
        var audioIndex = 0;
        htmlContent = htmlContent.replace(/style="[^"]*"/g, "").replace(/width="[^"]*"/g, "").replace(/height="[^"]*"/g, "").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
        dom.innerHTML = htmlContent + "<p> </p>";
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
                $iframe.eq(iframeIndex).attr("width", containWidth - 90);
                $iframe.eq(iframeIndex).attr("height", (containWidth - 90) * 9 / 16);
                iframeIndex++;
                handleIframe($iframe, success);
            } else {
                success();
            }
        }

        function handleVideo($video, success) {
            if (videoIndex < $video.length) {
                $video.eq(videoIndex).attr("width", containWidth - 90);
                videoIndex++;
                handleVideo($video, success);
            } else {
                success();
            }
        }

        function handleAudio($audio, success) {
            if (audioIndex < $audio.length) {
                $audio.eq(audioIndex).attr("width", containWidth - 90);
                audioIndex++;
                handleAudio($audio, success);
            } else {
                success();
            }
        }

        function handleImage($imgs, success) {
            if (index < $imgs.length) {
                var img = new Image();
                img.src = $imgs.eq(index).attr("src");
                img.onload = function() {
                    var imgWidth = img.width;
                    var imgHeight = img.height;
                    if (imgWidth * 3 < (containWidth - 90)) {
                        $imgs.eq(index).attr("width", imgWidth * 3);
                    } else {
                        $imgs.eq(index).attr("width", containWidth - 90);
                    }
                    index++;
                    handleImage($imgs, success);
                };
                img.onerror = function() {
                    index++;
                    handleImage($imgs, success);
                };
            } else {
                success();
            }
        }
    }

    /**
     * [detailScroll description]详情滚动
     */
    function detailScroll(finish) {
        var textHeight = $('.todayHotHeadLine_manuscript_content').find(".todayHotHeadLine_right_text").height(); //文章高度
        var container = $('.todayHotHeadLine_manuscript_content').height(); //容器高度
        var drop = textHeight - container; //落差
        if (drop > 0) {
            $('.todayHotHeadLine_manuscript_content').animate({
                    "scrollTop": drop + 100 + "px"
                },
                (drop + 100) / scrollSpeed, 'linear',
                function() {
                    if (finish !== undefined) finish();
                });
        } else {
            finish();
        }
    }

    /**
     * [goThroughDoc description]遍历文章
     */
    function goThroughDoc() {
        if (!isAuto) return;
        selectDoc(goThroughArrray[goThroughIndex], function() {
            goThrough = setTimeout(function() {
                goThroughIndex++;
                if (goThroughIndex >= goThroughArrray.length) {
                    finishGoThrough();
                    return;
                }
                goThroughDoc();
            }, endWaitTime);
        });
    }

    /**
     * [finishGoThrough description]结束遍历后刷新
     */
    function finishGoThrough() {
        goThrough = setTimeout(function() {
            reload();
        }, finishGoThroughTime);
    }

    /**
     * [reload description]局部重载
     */
    function reload() {
        initBoundary();
        start();
    }

    /**
     * [breakOffOperationFn description]脱离人工操作计时
     */
    function breakOffOperationFn() {
        clearTimeout(goThrough);
        clearTimeout(breakOffOperation);
        breakOffOperation = setTimeout(function() {
            reload();
        }, breakOffOperationRefreshTime);
    }

    /*$('.todayHotHeadLine_manuscript_content').bind("mousewheel", function() {
        $(this).stop();
        isAuto = false; //取消自动播放
        breakOffOperationFn();
    });*/


})();
