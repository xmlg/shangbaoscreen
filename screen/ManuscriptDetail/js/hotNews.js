/*
    description:会左，中、右 浙江热点新闻、全国热点新闻、国际热点新闻及 右侧新闻详情
    author:Bzm
 */
'use strict';
(function() {
    var goThroughArrray,
        curReadDoc,
        goThroughIndex,
        isAuto,
        startWaitTime, //文章开始滚动前等待时间 30秒
        breakOffOperationRefreshTime, //脱离人工操作后定时刷新页面时间
        breakOffOperation, //脱离人工操作后定时器
        zjNews, //浙江新闻
        countryNews, //全国新闻
        worldNews, //世界新闻
        endWaitTime, //文章结束滚动后等待时间 15秒
        goThrough, //遍历定时器
        finishGoThroughTime, //结束遍历后刷新时间
        scrollSpeed, //滚动速度
        globalSpeedRate = 1, //全局速率
        keepConnectionTimeout, //定时请求后端服务的定时器
        keepConnectionTime = 1000 * 60 * 5, //定时请求后端服务的设定时间
        containWidth = $(".manuscript_body").width();
    var HS = new HttpService();

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    //keepConnection();
    /**
     * [keepConnection description] 定时请求后端服务，防止后端服务会话超时无响应
     * @return {[type]} [description]
     */
    function keepConnection() {
        HS.httpServer("/screen/areahotpoint/getDate", null, "get", "text").done(function() {
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
        $('.manuscript_content').stop(true).scrollTop(0);
        $('#hotnews_zj').stop(true).css("top", "0px");
        $('#hotnews_country').stop(true).css("top", "0px");
        $('#hotnews_world').stop(true).css("top", "0px");
        setTime();
    }
    /**
     * [Hotnews description]热点新闻类
     * @param  {[string]} type [description]热点新闻类型  全国、国际、浙江
     * @return {[type]}      [description]
     */
    function Hotnews(name, type, page) {
        this.name = name;
        this.type = type;
        this.page = page;
        this.setOrgTemplate = function(orgTemplate) {
            this.orgTemplate = orgTemplate;
        };
        this.getOrgTemplate = function(orgTemplate) {
            return this.orgTemplate;
        };
    }
    /**
     * [getHotnews description]获取热点新闻
     * @param  {[string]} type [description]热点新闻类型  全国、国际、浙江
     * @return {[type]}  promise    [description]
     */
    Hotnews.prototype.getHotnews = function(success) {
        var deffer = $.Deferred();
        var name = this.name;
        var obj = this;
        var myDate = new Date();
        var today = myDate.format("yyyy-MM-dd");
        var params = {
            loaddate:today
        };
        var url = "/wcm/bigdata.do?clusterid="+GetQueryString('clusterid')+"&entityfield=MAXMEDIAREPORT&modelid=hotArtticleList&page_no=0&page_size=10&serviceid=areahotpointevent&typeid=widget";
        console.log(GetQueryString('type'));
        if(GetQueryString('type') == 'all'){
            url = "/wcm/bigdata.do?clusterid="+GetQueryString('clusterid')+"&entityfield=MAXMEDIAREPORT&modelid=hotArtticleList&page_no=0&page_size=10&serviceid=hotpointevent&typeid=widget";
        }
        HS.httpServer(url, params, "get").done(function(data) {
            appendList(obj, data.PAGEITEMS, name);
            //释放内存，防止浏览器崩溃
            name = null;
            obj = null;
            params = null;
            deffer.resolve("success");
        }).fail(function() {
            //释放内存，防止浏览器崩溃
            name = null;
            obj = null;
            params = null;
            deffer.resolve("error");
        });
        return deffer;
    };

    initBoundary();
    start();
    getDataByPage();
    /**
     * [start description]开始执行
     */
    function start() {
        zjNews = zjNews === undefined ? new Hotnews("zj", "001013013", 1) : zjNews;
        countryNews = countryNews === undefined ? new Hotnews("country", "001013", 1) : countryNews;
        worldNews = worldNews === undefined ? new Hotnews("world", "001", 1) : worldNews;
        zjNews.getHotnews().then(function() {
            // return countryNews.getHotnews();
        }).then(function() {
            // return worldNews.getHotnews();
        }).then(function() {
            selectDoc(goThroughArrray[goThroughIndex], function() {
                goThrough = setTimeout(function() {
                    goThroughIndex++;
                    goThroughDoc();
                }, endWaitTime);
            });
        });
    }
    /**
     * [appendList description]添加列表
     * @param  {[array]} data [description]列表数据
     * @param  {[string]} name [description]热点名称
     * @return {[type]}      [description]
     */
    function appendList(obj, data, name) {
        var template = obj.getOrgTemplate() === undefined ? $("#hotnews_" + name).children(0).clone() : obj.getOrgTemplate();
        obj.setOrgTemplate(template);
        $("#hotnews_" + name).html("");
        var array = [];
        for (var i = 0; i < data.length; i++) {
            var templateCopy = template.clone();
            templateCopy[0].DOCINDEX = i + 1;
            templateCopy.attr("hotnews", true);
            var _data = data[i];
            templateCopy[0].GUID = _data.GUID; //data[i].ID;
            templateCopy[0].DETONATEMEDIA = _data.DETONATEMEDIA;
            templateCopy[0].MAINMEDIA = _data.MAINMEDIA;
            _data.TITLE = _data.TITLE.replace(/\s*(.*?)/, "$1");
            var dom = document.createElement("div");
            dom.innerHTML = _data.TITLE;
            templateCopy.find(".content-inner").html((i + 1) + "." + dom.innerText);
            templateCopy.find(".source-inner").html(_data.SITENAME);
            //templateCopy.find(".value").html(_data.CLUSTERNUMS);
            digitalGrowth(templateCopy.find(".value"), parseInt(_data.WEIGHTEDNUMS));
            templateCopy.find(".bar-inner").animate({ "width": weightedNumsScale(data, _data.WEIGHTEDNUMS) }, "slow");
            templateCopy.hide();
            templateCopy.bind("click", function() {
                isAuto = false; //取消自动播放
                var $this = $(this);
                selectDoc($this);
                breakOffOperationFn();
                //释放内存，防止浏览器崩溃
                $this = null;
            });
            array.push(templateCopy);
            goThroughArrray.push(templateCopy);
        }
        $("#hotnews_" + name).html(array);
        for (var j = 0; j < array.length; j++) {
            array[j].fadeIn("slow");
        }
        //释放内存，防止浏览器崩溃
        template = null;
        array = null;
        i = null;
        templateCopy = null;
        _data = null;
        dom = null;
        j = null;
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
                if (goThroughArrray[goThroughIndex][0].DOCINDEX === 6) {
                    goThroughArrray[goThroughIndex].parent().animate({ "top": "-700px" }, "slow");
                    if (goThroughIndex == 5) {
                        $('#scroll_zj .prePage').attr('src', 'images/prePage.png');
                        $('#scroll_zj .nextPage').attr('src', 'images/nextPage-gray.png');
                    } else if (goThroughIndex == 15) {
                        $('#scroll_country .prePage').attr('src', 'images/prePage.png');
                        $('#scroll_country .nextPage').attr('src', 'images/nextPage-gray.png');
                    } else if (goThroughIndex == 25) {
                        $('#scroll_world .prePage').attr('src', 'images/prePage.png');
                        $('#scroll_world .nextPage').attr('src', 'images/nextPage-gray.png');
                    }
                }
                goThroughDoc();
            }, endWaitTime);
        });
    }
    /**
     * [selectDoc description]选中文章
     * @param  {[obj]} $liDom [description]将被选中的文章节点
     * @return {[type]}      [description]
     */
    function selectDoc($liDom, success) {
        $('.manuscript_content').stop(true).scrollTop(0);
        unSelectDoc(curReadDoc);
        curReadDoc = $liDom;
        $liDom.addClass("focus");
        getDocDetail($liDom[0]).then(function(data) {
            if (data === "success") {
                setTimeout(function() {
                    detailScroll(function() {
                        if ($.isFunction(success)) success();
                    });
                }, startWaitTime);
            } else {
                if ($.isFunction(success)) success();
            }
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
        var def = $.Deferred();
        var detailDom = $("#docDetail");
        var params = {
            zbguid: $liDom.GUID
        };
        var detonateMedia = "",
            mainMedia = "";
        if ($liDom.DETONATEMEDIA != undefined && $liDom.DETONATEMEDIA != null) {
            detonateMedia = $liDom.DETONATEMEDIA.replace(/;/g, " ");
        }
        if ($liDom.MAINMEDIA != undefined && $liDom.MAINMEDIA != null) {
            mainMedia = $liDom.MAINMEDIA.replace(/;/g, " ");
        }
        detailDom.find(".manuscript_media").hide();
        //若存在来源媒体，则展示，不然则不展示
        detonateMedia === "" ? detailDom.find(".detonate_group").hide() : detailDom.find(".detonate_group").show();
        mainMedia === "" ? detailDom.find(".main_group").hide() : detailDom.find(".main_group").show();
        HS.httpServer("/wcm/bigdata.do?modelid=hotPonitEventDetail&serviceid=hotpointevent1&typeid=widget", params, "get").done(function(data) {
            /*if (data.content[0].IR_SRCNAME != null && data.content[0].IR_SRCNAME.length > 19) {
                data.content[0].IR_SRCNAME = data.content[0].IR_SRCNAME.substring(0, 19) + "...";
            }*/
            detailDom.find(".manuscript_titile").html(data.TITLE);
            detailDom.find(".manuscript_resource").html(data.SOURCESITE);
            detailDom.find(".manuscript_date").html(data.PUBTIME.substring(11));
            detailDom.find(".manuscript_detonate_media").html(detonateMedia);
            detailDom.find(".manuscript_main_media").html(mainMedia);
            handleHtmlcontent(data.CONTENT, function(data) {
                detailDom.find(".manuscript_text").html(data);
                //初始化来源媒体的高度
                document.getElementsByClassName("manuscript_media")[0].style.height = '0px';
                // document.getElementsByClassName("manuscript_content")[0].style.height = '0px';
                // $(".manuscript_content").css("paddingBottom", "0px");
                $("#docDetail").show();
                //根据来源媒体的数据量，使来源媒体的高度自适应
                detailDom.find(".manuscript_media").show();
                var detonateHeight = document.getElementsByClassName("manuscript_detonate_media")[0].offsetHeight == 0 ? 0 : document.getElementsByClassName("manuscript_detonate_media")[0].offsetHeight + 50;
                var mainHeight = document.getElementsByClassName("manuscript_main_media")[0].offsetHeight == 0 ? 0 : document.getElementsByClassName("manuscript_main_media")[0].offsetHeight + 50;
                document.getElementsByClassName("detonate_group")[0].style.height = detonateHeight + 'px';
                document.getElementsByClassName("main_group")[0].style.height = mainHeight + 'px';
                $(".manuscript_media").css({ "height": detonateHeight + mainHeight + 'px' });
                // var titleHeight = document.getElementsByClassName("manuscript_titile")[0].offsetHeight;
                // $(".manuscript_content").css({ "height": 2450 - detonateHeight - mainHeight - titleHeight + 'px' });
                // $(".manuscript_content").css("paddingBottom", "200px");
                //释放内存，防止浏览器崩溃
                detonateHeight = null;
                mainHeight = null;
                detailDom = null;
                params = null;
                detonateMedia = null;
                mainMedia = null;
                def.resolve("success");
            });
        }).fail(function() {
            //释放内存，防止浏览器崩溃
            detailDom = null;
            params = null;
            detonateMedia = null;
            mainMedia = null;
            def.resolve("error");
        });
        return def;
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
                        //释放内存，防止浏览器崩溃
                        dom = null;
                        index = null;
                        iframeIndex = null;
                        videoIndex = null;
                        audioIndex = null;
                        $imgs = null;
                        $iframe = null;
                        $video = null;
                        $audio = null;
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
                    //释放内存，防止浏览器崩溃
                    img = null;
                    imgWidth = null;
                    imgHeight = null;
                    handleImage($imgs, success);
                };
                img.onerror = function() {
                    index++;
                    //释放内存，防止浏览器崩溃
                    img = null;
                    handleImage($imgs, success);
                };
            } else {
                success();
            }
        }
    }
    /**
     * [breakOffOperationFn description]脱离人工操作计时
     */
    function breakOffOperationFn() {
        clearTimeout(goThrough);
        clearTimeout(breakOffOperation);
        /*breakOffOperation = setTimeout(function() {
            reload();
        }, breakOffOperationRefreshTime);*/
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
        reloadPage();
    }
    /**
     * [detailScroll description]详情滚动
     */
    function detailScroll(finish) {
        var textHeight = $('.manuscript_content').find(".manuscript_media").height() + $('.manuscript_content').find(".manuscript_text").height(); //文章高度
        var container = $('.manuscript_content').height(); //容器高度
        var drop = textHeight - container; //落差
        if (drop > 0) {
            $('.manuscript_content').animate({
                    "scrollTop": drop + 100 + "px"
                },
                (drop + 100) / scrollSpeed, 'linear',
                function() {
                    if (finish !== undefined) finish();
                });
        } else {
            finish();
        }
        //释放内存，防止浏览器崩溃
        textHeight = null;
        container = null;
        drop = null;
    }
    /**
     * [setTime description]获取客户端当前日期
     */
    function setTime() {
        var str = '';
        var date = new Date();

        var month = date.getMonth() + 1;
        str += date.getFullYear() + '-';
        str += date.getMonth() + 1 + '-';
        str += date.getDate() + '';
        $(".hotnewsDate").each(function() {
            $(this).html(str);
        });
        //释放内存，防止浏览器崩溃
        str = null;
        date = null;
        month = null;
    }
    /**
     * [weightedNumsScale description]热度比
     */
    function weightedNumsScale(array, weightedNums) {
        var max = parseInt(array[0].WEIGHTEDNUMS);
        for (var i = 0; i < array.length; i++) {
            var _weightedNums = parseInt(array[i].WEIGHTEDNUMS);
            if (_weightedNums > max) max = _weightedNums;
        }
        //释放内存，防止浏览器崩溃
        i = null;
        _weightedNums = null;
        return (weightedNums / max) * 100 + "%";
    }
    /**
     * [digitalGrowth description]数字增长效果
     */
    function digitalGrowth(dom, digital) {
        var i = 1;
        var speed = 10 / digital;
        growth();

        function growth() {
            setTimeout(function() {
                if (i <= digital) {
                    if (digital - i >= 10) i += 10;
                    else i = digital;
                    dom.html(i);
                    growth();
                } else {
                    //释放内存，防止浏览器崩溃
                    i = null;
                    speed = null;
                }
            }, speed);
        }
    }
    /**
     * [getDataByPage description] 上翻、下翻
     * @return {[type]} [description]
     */
    function getDataByPage() {
        $('#scroll_zj .prePage').click(function() {
            goThroughArrray[0].parent().animate({ "top": "0px" }, "slow");
            $('#scroll_zj .prePage').attr('src', 'images/prePage-gray.png');
            $('#scroll_zj .nextPage').attr('src', 'images/nextPage.png');
        });
        $('#scroll_zj .nextPage').click(function() {
            goThroughArrray[5].parent().animate({ "top": "-700px" }, "slow");
            $('#scroll_zj .prePage').attr('src', 'images/prePage.png');
            $('#scroll_zj .nextPage').attr('src', 'images/nextPage-gray.png');
        });
        $('#scroll_country .prePage').click(function() {
            goThroughArrray[10].parent().animate({ "top": "0px" }, "slow");
            $('#scroll_country .prePage').attr('src', 'images/prePage-gray.png');
            $('#scroll_country .nextPage').attr('src', 'images/nextPage.png');
        });
        $('#scroll_country .nextPage').click(function() {
            goThroughArrray[15].parent().animate({ "top": "-700px" }, "slow");
            $('#scroll_country .prePage').attr('src', 'images/prePage.png');
            $('#scroll_country .nextPage').attr('src', 'images/nextPage-gray.png');
        });
        $('#scroll_world .prePage').click(function() {
            goThroughArrray[20].parent().animate({ "top": "0px" }, "slow");
            $('#scroll_world .prePage').attr('src', 'images/prePage-gray.png');
            $('#scroll_world .nextPage').attr('src', 'images/nextPage.png');
        });
        $('#scroll_world .nextPage').click(function() {
            goThroughArrray[25].parent().animate({ "top": "-700px" }, "slow");
            $('#scroll_world .prePage').attr('src', 'images/prePage.png');
            $('#scroll_world .nextPage').attr('src', 'images/nextPage-gray.png');
        });
    }
    /**
     * [reloadPage description] 初始化数据按钮恢复原状
     * @return {[type]} [description]
     */
    function reloadPage() {
        $('#scroll_zj .prePage').attr('src', 'images/prePage-gray.png');
        $('#scroll_zj .nextPage').attr('src', 'images/nextPage.png');
        $('#scroll_country .prePage').attr('src', 'images/prePage-gray.png');
        $('#scroll_country .nextPage').attr('src', 'images/nextPage.png');
        $('#scroll_world .prePage').attr('src', 'images/prePage-gray.png');
        $('#scroll_world .nextPage').attr('src', 'images/nextPage.png');
    }
    $('.manuscript_content').bind("mousewheel", function() {
        $(this).stop(true);
        isAuto = false; //取消自动播放
        breakOffOperationFn();
    });

    //获取地址栏参数
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }



})();
