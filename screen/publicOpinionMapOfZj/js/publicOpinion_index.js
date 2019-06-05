"use strict";
(function() {
    var myScroll = new window.myScroll();
    /**
     * [Pomoz description] 浙江舆情地图构造
     * @param {[dom]} null  [description] 
     * @return {[null]} [description] 
     */
    var Pomoz = function() {
        this.playIndex = 0;
        this.inIndex = true; //是否在首页
        this.inList = false; //是否在列表页
        this.listTimeOut; //列表页分页的计时器
        this.turnoverSpeed = "fast"; //地区翻转速度
        this.turnoverStopTime = 2000; //首轮翻转间隔时间
        this.isPlayAudio = false; //是否播放音效
        this.setDataType = -1; //数据设置：默认显示全部
        this.turnoverStopTimeAfterFirst = 5000; //首轮过后的翻转间隔时间
        this.firstRun = true; //是否是首轮播放
        // this.getDocDetatilByAreaIdUrl = "/screen/globalsen/sentimentmapareadetail"; //通过地区ID获取稿件详情接口地址
        this.getDocDetatilByAreaIdUrl = "json/getTitle.json"; //通过地区ID获取稿件详情接口地址
        // this.getListByAreaId = "/screen/globalsen/sentimentmaparealist"; //通过地区ID来获取稿件类表接口地址
        this.getListByAreaId = "json/listData.json"; //读取本地json
        this.chart = echarts.init($('.c_map')[0]); //echarts对象、
        this.popoverTemplate = $(".float_aperture").clone(); //小浮窗模板
        this.listTemplate = $(".publicOpinion_list.left").find("li").eq(0).clone(); //列表模板
        this.leftArrowTemplate = $(".arrow_line_left").clone(); //向左地图箭头模板
        $(".arrow_line_left").remove();
        this.verticalLineTemplate = $(".vertical_line").clone(); //首页轮播箭头竖线模板
        $(".vertical_line").remove();
        this.rightArrowTemplate = $(".arrow_line_right").clone(); //向右地图箭头模板
        $(".arrow_line_right").remove();
        this.playSwitch = true; //轮播开关
        $(".float_aperture").remove();
        this.pageOptions = {
            pageIndex: 0, //当前页码
            pageSize: 0, //每页显示数量
            itemCount: 0, //显示项的总数量
            maxButtonCount: 7, //除去第一页和最后一页的最大按钮数量
            prevText: "<< 上一页",
            nextText: "下一页 >>",
            buildPageUrl: null,
            onPageChanged: null //页码修改后的回调函数，包含一个pageIndex参数
        };
        var self = this;
        $.ajax({
            url: "json/mapData.json?v=0.1",
            method: "get",
            dataType: "json",
            success: function(data) {
                self.mapData = data; //获取地区坐标
            },
            error: function(data) {
                console.log("获取地图地区坐标数据失败");
            }
        });
        //将用户设置存在浏览器
        (function() {
            self.storage = localStorage.getItem("publicOpinionOption");
            if (self.storage === null) {
                localStorage.setItem("publicOpinionOption", JSON.stringify({ turnoverStopTime: self.turnoverStopTime, turnoverStopTimeAfterFirst: self.turnoverStopTimeAfterFirst, isPlayAudio: self.isPlayAudio, setDataType: self.setDataType }));
            } else {
                self.storage = JSON.parse(self.storage);
                self.turnoverStopTime = parseInt(self.storage.turnoverStopTime);
                self.isPlayAudio = self.storage.isPlayAudio;
                self.turnoverStopTimeAfterFirst = parseInt(self.storage.turnoverStopTimeAfterFirst);
                self.setDataType = self.storage.setDataType;
            }
        })();
        // document.onkeydown = function(e) {
        //     if (e.keyCode === 27) {
        //         if (!self.optionSwitch) {
        //             $(".setOption").show();
        //             $(".setOptionModal").show();
        //             self.initOption();
        //             self.optionSwitch = true;
        //         } else {
        //             $(".setOption").hide();
        //             $(".setOptionModal").hide();
        //             self.optionSwitch = false;
        //         }
        //     }
        // };
    };
    /**
     * [initOption description] 初始化设置界面
     */
    Pomoz.prototype.initOption = function() {
        var self = this;
        var input1 = $(".setOption").find(".row").eq(0).find("input");
        var input2 = $(".setOption").find(".row").eq(1).find("input");
        var input3 = $(".setOption").find(".row").eq(2).find("input");
        input1.val(self.turnoverStopTime);
        $(".setOption")[0].turnoverStopTime = self.turnoverStopTime;
        input2.val(self.turnoverStopTimeAfterFirst);
        $(".setOption")[0].turnoverStopTimeAfterFirst = self.turnoverStopTimeAfterFirst;
        input3.attr("checked", self.isPlayAudio);
        $(".setOption")[0].isPlayAudio = self.isPlayAudio;

        self.storage = localStorage.getItem("publicOpinionOption");
        if (self.storage != null) {
            self.storage = JSON.parse(self.storage);
            self.setDataType = parseInt(self.storage.setDataType);
            if (self.setDataType != null) {
                $("#setDataType_js").find("input").each(function(i) {
                    if ($(this).val() == self.setDataType) {
                        $(this).attr("checked", true);
                    }
                });
            }
        }
        //alert(input3.is(':checked'));
        $(".setOption").find("button").eq(1).unbind("click").bind("click", function() { //重置
            input1.val($(".setOption")[0].turnoverStopTime);
            input2.val($(".setOption")[0].turnoverStopTimeAfterFirst);
            /*input3.attr("checked", self.isPlayAudio);*/
            input3.attr("checked", false);
            self.setDataType = -1;
            $("#setDataType_js").find("input").eq(0).prop("checked", true);
        });
        $(".setOption").find("button").eq(0).unbind("click").bind("click", function() { //确定
            self.turnoverStopTime = input1.val();
            self.turnoverStopTimeAfterFirst = input2.val();
            self.isPlayAudio = input3.is(':checked');
            $(".setOption").hide();
            $(".setOptionModal").hide();
            localStorage.setItem("publicOpinionOption", JSON.stringify({ turnoverStopTime: self.turnoverStopTime, turnoverStopTimeAfterFirst: self.turnoverStopTimeAfterFirst, isPlayAudio: self.isPlayAudio, setDataType: self.setDataType }));
            self.optionSwitch = false;
            window.location.reload();
        });
        $("#setDataType_js").find("input").each(function(i) {
            $(this).click(function() {
                self.setDataType = $(this).val();
                localStorage.setItem("publicOpinionOption", JSON.stringify({ turnoverStopTime: self.turnoverStopTime, turnoverStopTimeAfterFirst: self.turnoverStopTimeAfterFirst, isPlayAudio: self.isPlayAudio, setDataType: self.setDataType }));
            });
        });
    };
    /**
     * [HttpServer description] ajax请求工具方法
     * @param {[string]} url  [description] 接口请求地址
     * @param {[params]} obj  [description] 接口请求参数
     * @return {[obj]} [description] 接口返回数据
     */
    Pomoz.prototype.HttpServer = function(url, params) {
        var deffer = $.Deferred();
        $.ajax({
            data: (params === undefined ? "" : params),
            dataType: "json",
            timeOut: 20000,
            method: "get",
            url: url + "?v=" + Math.random(),
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
     * [play description] 浙江舆情地图首页轮播开始
     * @param {[dom]} null  [description] 
     * @return {[null]} [description] 
     */
    Pomoz.prototype.play = function() {
        var self = this;
        /**
         * [turnover description] 翻转地区牌
         * @return {[null]} [description] 
         */
        function turnOver(self) {
            if (!self.playSwitch) return;
            var turnOverTime = self.firstRun ? self.turnoverStopTime : self.turnoverStopTimeAfterFirst;
            self.player = setTimeout(function() {
                var horizontalOpts = [{
                    'height': 0,
                    'top': '240px'
                }, {
                    'height': '240px',
                    'top': 0
                }];
                /*self.HttpServer(self.getDocDetatilByAreaIdUrl, { areanm: self.mapData[self.playIndex].n }).then(function(data) {*/
                var params = {
                    areanm: self.mapData[self.playIndex].n,
                    id: self.getUrlParams("id"),
                    scene_level: self.getUrlParams("scene_level")
                };
                self.storage = localStorage.getItem("publicOpinionOption");
                if (self.storage != null) {
                    self.storage = JSON.parse(self.storage);
                    self.setDataType = self.storage.setDataType;
                    if (self.setDataType != -1) { //选择了数据设置类型，不是默认的全部则传参type
                        params.type = self.setDataType;
                    }
                }
                self.HttpServer(self.getDocDetatilByAreaIdUrl, params).then(function(data) {
                    self.indexArrow(data.DATAEMPTY !== true);
                    self.setFlashCoordinates(data.DATAEMPTY !== true);
                    self.setMapPopover(data);
                    var $li = $("#li_" + self.playIndex);
                    if (!$li[0].turned && data.DATAEMPTY === true) { //如果牌子没有翻过，并且该区域没有数据，则不展示翻牌子的动画
                        if (self.playIndex === 21) self.firstRun = false; //首轮播放完毕
                        self.playIndex = (self.playIndex === 21 ? 0 : self.playIndex + 1);
                        turnOver(self);
                        return;
                    }
                    var areaData = self.mapData[self.playIndex];
                    var needTurn = $li[0].turned ? $("#li_" + self.playIndex).find(".item_show") : $("#li_" + self.playIndex).find(".item");
                    var turnFinsh;
                    if (data.DATAEMPTY === true) {
                        turnFinsh = $("#li_" + self.playIndex).find(".item"); //如果牌子已经翻过，但是该区域没有最近数据，则翻回区域名称面
                        $li[0].turned = false; //当新数据不存在是，将该牌子的状态再设置为未翻
                    } else {
                        turnFinsh = $("#li_" + self.playIndex).find(".item_show");
                        $li[0].turned = true;
                    }
                    needTurn.stop(true).animate(horizontalOpts[0], self.turnoverSpeed, function() {
                        needTurn.hide();
                        self.setCardData(data, $("#li_" + self.playIndex), false, areaData).then(function() {
                            turnFinsh.show().stop(true).animate(horizontalOpts[1], self.turnoverSpeed, function() {
                                if (self.playIndex === 21) self.firstRun = false; //首轮播放完毕
                                self.playIndex = (self.playIndex === 21 ? 0 : self.playIndex + 1);
                                turnOver(self);
                            });
                        });
                    });
                }, function() {
                    if (self.playIndex === 21) self.firstRun = false; //首轮播放完毕
                    self.playIndex = (self.playIndex === 21 ? 0 : self.playIndex + 1);
                    turnOver(self);
                });
            }, turnOverTime);
        }
        turnOver(self);
    };
    /**
     * [getUrlParams description] 获取路由参数
     * @param  {[type]} params [description] 要获取的参数名
     * @return {[type]}        [description]
     */
    Pomoz.prototype.getUrlParams = function(params) {
        var self = this;
        var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
        var paramsData = window.location.search.substr(1).match(reg);
        return !!paramsData ? paramsData[2] : "0";
    };
    /**
     * [indexArrow description] 首页轮播箭头渲染
     * @param {[boolean]} whetherPoint  [description]  是否指向牌子
     * @return {[null]} [description] 
     */
    Pomoz.prototype.indexArrow = function(whetherPoint) {
        var self = this;
        if (self.playIndex === 0 || !self.inIndex) return;
        var scale = window.minScale;
        var areaData = self.mapData[self.playIndex];
        var areaTop = parseInt(areaData.g1.top.replace(/px/, ""));
        var playDirective = self.playIndex % 2 === 0 ? "left" : "right";
        var realTop = ($("#li_" + self.playIndex).offset().top / scale);
        $(".line_position").remove();
        $(".vertical_line").remove();
        if (!whetherPoint) {
            return;
        }
        var template = self[playDirective + "ArrowTemplate"].clone();
        template.css({
            top: realTop + "px",
            //width: (playDirective === "left" ? areaData.g1.left : ($(".content_main").width() - parseInt(areaData.g1.left.replace(/px/, ""))))
        });
        template.addClass("forIndex");
        var verticalTemplate = self.verticalLineTemplate.clone();
        var left = parseInt(areaData.g1.left.replace(/px/, "")) + 25;
        verticalTemplate.css("left", left + 'px');
        $(".content_main").append(verticalTemplate);
        verticalGrowUp().then(function() {
            horizontalGrowUp();
        });
        /**
         * [verticalGrowUp description] 垂直竖线延伸
         * @return {[null]} [description] 
         */
        function verticalGrowUp() {
            var deffer = $.Deferred();
            var containerHeight = $(".content_main").height();
            if (areaTop > realTop) {
                verticalTemplate.css("bottom", containerHeight - areaTop);
                verticalTemplate.stop(true).animate({
                        height: Math.abs(realTop - areaTop) + 20
                    },
                    "slow",
                    function() {
                        deffer.resolve();
                    });
            } else {
                verticalTemplate.css("top", (areaTop + 44) + "px");
                verticalTemplate.stop(true).animate({
                        "height": Math.abs(realTop - areaTop) + "px"
                    },
                    "slow",
                    function() {
                        deffer.resolve();
                    });
            }
            return deffer.promise();
        }
        /**
         * [horizontalGrowUp description] 水平箭头延伸
         * @return {[null]} [description] 
         */
        function horizontalGrowUp() {
            var deffer = $.Deferred();
            var anObj;
            var Arealeft = parseInt(areaData.g1.left.replace(/px/, ""));
            var containerWidth = $(".content_main").width();
            $(".content_main").append(template);
            if (playDirective === "left") {
                template.css({ right: (containerWidth - Arealeft + 20) });
                anObj = {
                    width: Arealeft
                };
            } else {
                template.css({ left: Arealeft + 20 });
                anObj = {
                    width: containerWidth - Arealeft
                };
            }
            template.stop(true).stop(true).animate(anObj,
                "slow",
                function() {
                    deffer.resolve();
                });
            return deffer.promise();
        }
    };
    /**
     * [areaClickInit description] 首页左右两边区域牌子正面的点击事件
     * @return {[null]} [description] 
     */
    Pomoz.prototype.areaClickInit = function() {
        var self = this;
        $(".content_parent").find(".item").each(function(index) {
            index = index <= 10 ? index * 2 : (index - 10) * 2 - 1;
            $(this).unbind("click").bind("click", function() {
                var dom = document.createElement("div");
                dom.docData = { index: index };
                dom.areaData = self.mapData[index];
                self.getMore($(dom));
            });
        });
    };
    /**
     * [listPageArrow description] 列表页面小箭头渲染
     * @param {[obj]} areaData  [description] 区域数据
     * @return {[null]} [description] 
     */
    Pomoz.prototype.listPageArrow = function(areaData) {
        var self = this;
        $(".line_position").remove();
        $(".vertical_line").remove();
        if (areaData.g1 === undefined) return;
        var template = self[self.directive + "ArrowTemplate"].clone();
        template.css({
            top: areaData.g1.top,
            width: (self.directive === "left" ? areaData.g1.left : ($(".content_main").width() - parseInt(areaData.g1.left.replace(/px/, ""))))
        });
        $(".content_main").append(template);
    };
    /**
     * [setCardData description] 设置卡片数据
     * @param {[obj]} data  [description] 获取到的文档数据
     * @param {[$dom]} null  [description] 卡片的$dom
     * @param {[isAnimate]} null  [description] 是否有淡入淡出动画
     * @return {[null]} [description] 
     */
    Pomoz.prototype.setCardData = function(data, $dom, isAnimate, areaData) {
        var self = this;
        var deffer = $.Deferred();

        function setData(data) {
            var content = data.WEIBONORMALYPE === 1 ? "【微博】" + data.CONTENT : data.URLTITLE; //微博稿件显示微博正文，普通稿件显示稿件标题
            $dom.find(".item_show").find(".info").html(self.getTextContent(content));
            $dom[0].docData = data;
            $dom[0].areaData = areaData;
            $dom[0].docData.index = self.playIndex;
            $dom.find(".info").unbind("click").bind("click", function() {
                self.showDetail($(this).parent().parent()[0].docData);
            });
            $dom.find(".item_show").find("span").eq(1).unbind("click").bind("click", function() {
                /*console.log($(this).parent().parent().parent()[0].doc);*/
                self.getMore($(this).parent().parent().parent());
            });
        }
        if (isAnimate) {
            $dom.find(".item_show").fadeOut('slow', function() {
                setData(data);
                $dom.find(".item_show").fadeIn('slow', function() {
                    deffer.resolve();
                });
            });
        } else {
            setData(data);
            deffer.resolve();
        }
        return deffer.promise();
    };
    /**
     * [showDetail description] 展现稿件详情
     * @param {[obj]} data  [description] 获取到的文档数据
     * @return {[null]} [description] 
     */
    Pomoz.prototype.showDetail = function(data) {
        var self = this;
        var detail_outer = $("#c_detail_js").find(".detail_outer");
        detail_outer.attr("style", "");
        $("#c_detail_js").find("h2").html(data.WEIBONORMALYPE === 1 ? data.UNAME : data.URLTITLE);
        $("#c_detail_js").find(".head_info").find("span").eq(0)[data.WEIBONORMALYPE === 1 ? "show" : "hide"](); //微博类型稿件显示头像，非微博类型不显示
        $("#c_detail_js").find(".head_info").find("span").eq(1)[data.WEIBONORMALYPE === 1 ? "hide" : "show"]().html(data.SITENAME); //微博类型稿件不显示来源
        $("#c_detail_js").find(".head_info").find("span").eq(2).html(data.URLTIME); //普通类型稿件显示标题，微博类型稿件显示微博用户名称
        self.handleHtml(data.CONTENT).then(function(htmlcontent) {
            $("#c_detail_js").find(".docContent").html(htmlcontent);
            //添加点击查看原文事件
            /*$("#c_detail_js").find(".view_original_btn_js").bind("click", function() {
                $("#originalText_iframe_js").attr("src", data.URLNAME);
                $("#originalText_detail_js").fadeIn("fast", function() {
                    $(".iframe").animate({scrollTop:0},10);
                });
            });*/
            $("#c_detail_js").find(".view_original_btn_js").find("a").attr("href", data.URLNAME);
            $("#c_detail_js").fadeIn("fast", function() {
                var title_h = $("#c_detail_js").find("h2").height(); //标题的高度
                if (title_h > 100) { //大于一行的时候，需要对正文高度做调整
                    var detail_outer_newHeight = 1930 - (title_h - 100); //detail_outer.height() - (title_h - 100);
                    detail_outer.attr("style", "height:" + detail_outer_newHeight + "px;");
                }
                myScroll.scroll("wrapper1");
            });
        });
    };
    /**
     * [playAudio description] 播放音效
     */
    Pomoz.prototype.playAudio = function() {
        var self = this;
        if (self.isPlayAudio)
            $("#audio")[0].play();
    };
    /**
     * [setMapPopover description] 设置地图浮层
     * @param {[obj]} data  [description] 获取到的文档数据
     * @return {[null]} [description] 
     */
    Pomoz.prototype.setMapPopover = function(data) {
        // console.log(data);
        var self = this;
        if (data.DATAEMPTY === true) {
            $("#popover_" + self.playIndex).fadeOut('slow', function() {
                $(this).remove();
            });
            return;
        }
        //container.mapContainer.chart.map.getPosByGeo(option.mapType, tmpGeo.g.split(",")) || [];
        if (self.playIndex === 0) return;
        var cityName = self.mapData[self.playIndex].n; //城市名称
        var cityPos = self.mapData[self.playIndex].g; //城市坐标
        /*var positionArray = self.chart.convertToPixel({ geoIndex: 0 }, cityPos.split(","));
        var positionArray_ = self.chart.convertToPixel({ geoIndex: 0 }, cityPos_.split(","));*/

        //添加小浮窗方法开始
        var popoverTemplate = self.popoverTemplate.clone();
        /*popoverTemplate.css({
            "left": positionArray[0] + "px",
            "top": positionArray[1] + "px"
        });*/
        popoverTemplate.css({
            "left": cityPos.left,
            "top": cityPos.top
        });
        var content = data.WEIBONORMALYPE === 1 ? "【微博】" + data.CONTENT : data.URLTITLE; //微博稿件显示微博正文，普通稿件显示稿件标题
        popoverTemplate.find("div.abstr").html(self.getTextContent(content));
        popoverTemplate.attr("id", "popover_" + self.playIndex);
        popoverTemplate[0].docDetail = data;
        popoverTemplate.unbind("click").bind("click", function() {
            self.showDetail($(this)[0].docDetail);
        });
        popoverTemplate.unbind("mouseenter").bind("mouseenter", function() {
            $(this)[0].oldIndex = $(this).css("z-index");
            $(this).css("z-index", 15);
        });
        popoverTemplate.unbind("mouseleave").bind("mouseleave", function() {
            $(this).css("z-index", $(this)[0].oldIndex);
        });
        if ($("#popover_" + self.playIndex)[0]) {
            $("#popover_" + self.playIndex).fadeOut('slow', function() {
                $(this).remove();
                slowShowPopover();
            });
        } else {
            slowShowPopover();
        }
        self.playAudio();

        function slowShowPopover() {
            popoverTemplate.hide();
            $(".content_main").append(popoverTemplate);
            popoverTemplate.fadeIn("slow",function () {
                var thisTimer = setTimeout(function () {
                    popoverTemplate.fadeOut("slow")
                    clearTimeout(thisTimer)
                },10000)
            });
        }
        var option = self.chart.getOption();
        var geo = option.geo;
        for (var i = 0; i < geo[0].regions.length; i++) {
            var cityOption = geo[0].regions[i];
            if (cityOption.name === cityName) {
                geo[0].regions[i] = {
                    name: cityOption.name,
                    label: {
                        normal: {
                            show: true,
                            textStyle: {
                                color: "#00D0F4",
                                fontWeight: "bold"
                            }
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                color: "#00D0F4",
                                fontWeight: "bold"
                            }
                        }
                    }
                };
            } else {
                geo[0].regions[i] = {
                    name: cityOption.name,
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    }
                };
            }
        }
        option.geo = geo;
        self.chart.setOption(option);
    };
    /**
     * [setFlashCoordinates description] 设置闪光坐标
     * @param {[boolean} wetherPointer  [description] 是否指向
     * @return {[null]} [description] 
     */
    Pomoz.prototype.setFlashCoordinates = function(wetherPointer) {
        var self = this;
        if (self.playIndex === 0) return;
        if (!wetherPointer) {
            $(".triange_top").hide();
            return;
        }
        var cityPos_ = self.mapData[self.playIndex].g1; //三角坐标
        //添加小三角方法开始
        /*$(".triange_top").css({
            left: positionArray_[0] + 'px',
            top: positionArray_[1] + 'px'
        });*/
        $(".triange_top").css({
            left: parseInt(cityPos_.left.replace(/px/, "")) - 30,
            top: cityPos_.top,
            display: "block"
        });
        //添加小三角方法结束
    };
    /**
     * [initMap description] 浙江舆情地图初始化
     * @param {[dom]} null  [description] 
     * @return {[null]} [description] 
     */
    Pomoz.prototype.initMap = function() {
        var self = this;
        self.chart.setOption({
            series: [{
                type: 'map',
                map: "广东"
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
                map: '广东',
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
        });
    };
    /**
     * [handleHtml description] 处理html正文
     * @param {[string]} htmlContent  [description] 
     * @return {[null]} [description] 
     */
    Pomoz.prototype.handleHtml = function(htmlContent) {
        var deffer = $.Deferred();
        var containWidth = 1690;
        var dom = document.createElement("div");
        var index = 0;
        htmlContent = htmlContent.replace(/style="[^"]*"/g, "").replace(/width="[^"]*"/g, "").replace(/height="[^"]*"/g, "").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
        dom.innerHTML = htmlContent;
        var $imgs = $(dom).find("img");
        handleImage($imgs, function() {
            deffer.resolve($(dom).html());
        });

        function handleImage($imgs, success) {
            if (index < $imgs.length) {
                var img = new Image();
                img.src = $imgs.eq(index).attr("src");
                img.onload = function() {
                    var imgWidth = img.width;
                    var imgHeight = img.height;
                    if (imgWidth * 3 < (containWidth - 40)) {
                        $imgs.eq(index).attr("width", imgWidth * 3);
                    } else {
                        $imgs.eq(index).attr("width", containWidth - 40);
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
        return deffer.promise();
    };
    /**
     * [getTextContent description] 获取纯文本正文
     * @param {[dom]} null  [description] 
     * @return {[null]} [description] 
     */
    Pomoz.prototype.getTextContent = function(content) {
        var dom = document.createElement("div");
        dom.innerHTML = content;
        return dom.innerText.replace(/ /g, "");
    };
    /**
     * [getMore description] 获取地区更多
     * @param {[$dom]} $dom  [description] 区域卡dom
     * @return {[null]} [description] 
     */
    Pomoz.prototype.getMore = function($dom) {
        var index = $dom[0].docData.index;
        var self = this;
        self.inIndex = false;
        self.inList = false;
        self.renderList($dom[0].areaData, 0);
        //self.stopPlay();
        self.directive = index % 2 === 0 ? "left" : "right"; //展开方向
        $(".go_back_btn").addClass(self.directive).bind("click", function() {
            self.goBackIndex();
        });
        $(".content_parent").stop(true).animate({ width: "0px" }, 500, function() {
            $(this).hide();
        });
        /*$(".content_r").stop(true).animate({ width: "0px" }, 500, function() {
            $(this).hide();
        });*/
        $(".publicOpinion_list." + self.directive).parent().show().stop(true).animate({ width: "2590px" }, 500);
    };
    /**
     * [goBackIndex description] 返回首页
     * @return {[null]} [description] 
     */
    Pomoz.prototype.goBackIndex = function() {
        var self = this;
        self.inIndex = true;
        $(".line_position").remove(); //去掉列表页小箭头
        $(".go_back_btn").removeClass(self.directive);
        $(".content_parent").show().stop(true).animate({ width: "1290px" }, 500);
        $(".publicOpinion_list." + self.directive).parent().stop(true).animate({ width: "0px" }, 500, function() {
            $(this).hide();
        });
    };
    /**
     * [renderList description] 获取数据并且渲染列表
     * @param {[obj]} areaData  [description] 区域数据
     * @return {[null]} [description] 
     */
    Pomoz.prototype.renderList = function(areaData, pageIndex) {
        console.log(areaData);
        var deffer = $.Deferred();
        var self = this;
        clearTimeout(self.listTimeOut);
        $(".list_content").find("ul").fadeIn("slow");

        /*self.HttpServer(self.getListByAreaId, { areanm: areaData.n, page_no: pageIndex, page_size: 14 }).then(function(data) {*/
        var params = {
            areanm: areaData.n,
            page_no: pageIndex,
            page_size: 14,
            id: self.getUrlParams("id"),
            scene_level: self.getUrlParams("scene_level")
        };
        self.storage = localStorage.getItem("publicOpinionOption");
        if (self.storage != null) {
            self.storage = JSON.parse(self.storage);
            self.setDataType = self.storage.setDataType;
            if (self.setDataType != -1) { //选择了数据设置类型，不是默认的全部则传参type
                params.type = self.setDataType;
            }
        }
        self.HttpServer(self.getListByAreaId, params).then(function(data) {
            console.log(data);
            self.listPageArrow(areaData);
            self.pageOptions.pageIndex = data.PAGEINDEX;
            self.pageOptions.pageSize = data.PAGESIZE;
            self.pageOptions.itemCount = data.TOTALITEMCOUNT;
            self.pageOptions.prevText = data.PAGEITEMS.length === 0 ? "" : "<< 上一页";
            self.pageOptions.nextText = data.PAGEITEMS.length === 0 ? "" : "下一页 >>";
            self.pageOptions.onPageChanged = function(pageIndex) {
                $(".list_content").find("ul").fadeOut("slow");
                self.listTimeOut = setTimeout(function() {
                    self.renderList(areaData, pageIndex);
                }, 600);
            };
            if (self.inList === false) {
                delete self.pager;
                self.pager = $(".publicOpinion_list." + self.directive).find(".pager").pager(self.pageOptions);
            }
            self.inList = true;
            var listArray = [];
            for (var i = 0; i < data.PAGEITEMS.length; i++) {
                var listTemplate = self.listTemplate.clone();
                var item = data.PAGEITEMS[i];
                var isWeibo = item.WEIBONORMALYPE === 1;
                var listTime = {};
                listTime.time = new Date(Date.parse(item.URLTIME));
                listTime.hours = listTime.time.getHours().toString().length == 1 ? "0" + listTime.time.getHours().toString() : listTime.time.getHours().toString();
                listTime.minutes = listTime.time.getMinutes().toString().length == 1 ? "0" + listTime.time.getMinutes().toString() : listTime.time.getMinutes().toString();
                listTime.seconds = listTime.time.getSeconds().toString().length == 1 ? "0" + listTime.time.getSeconds().toString() : listTime.time.getSeconds().toString();
                listTime.time = listTime.hours + ":" + listTime.minutes + ":" + listTime.seconds;
                listTemplate.find("div").eq(0).html(((data.PAGEINDEX*data.PAGESIZE)+i + 1) + "." + (isWeibo ? ("【微博】" + self.getTextContent(item.CONTENT)) : item.URLTITLE));
                listTemplate.find("div").eq(1).html(isWeibo ? item.UNAME : item.SITENAME);
                listTemplate.find("div").eq(2).html(listTime.time);
                listTemplate[0].docData = item;
                listTemplate.unbind("click").bind("click", function() {
                    self.showDetail(this.docData);
                    self.curSelectedDoc = $(this); //当前选中稿件
                    self.curSelectedDoc.css("color", "white").siblings().css("color", "#43d5ff");
                });
                listArray.push(listTemplate);
            }
            $(".publicOpinion_list." + self.directive).find("ul").eq(0).html(listArray);
            $(".publicOpinion_list." + self.directive).find("span").eq(0).html((areaData.n === "全国" ? areaData.n : areaData.n));
            deffer.resolve();
        });
        return deffer.promise();
    };
    /**
     * [clearPopover description] 清除地图浮窗
     * @return {[null]} [description] 
     */
    Pomoz.prototype.clearPopover = function() {
        $(".float_aperture").fadeOut("slow");
    };
    /**
     * [stopPlay description] 停止轮播
     * @return {[null]} [description] 
     */
    Pomoz.prototype.stopPlay = function() {
        var self = this;
        this.playSwitch = false;
        clearTimeout(self.player);
    };
    /**
     * [start description] 程序启动
     * @param {[dom]} null  [description] 
     * @return {[null]} [description] 
     */
    Pomoz.prototype.start = function() {
        var self = this;
        self.initMap();
        self.areaClickInit();
        self.initMapClick();
        self.play();
    };
    /**
     * [initMapClikc description] 初始化地图点击事件
     * @return {[null]} [description] 
     */
    Pomoz.prototype.initMapClick = function() {
        var self = this;
        this.chart.on("click", function(params) {

            var areaName = params.name;
            var index;
            var areaData;
            for (var i = 0; i < self.mapData.length; i++) {
                var data = self.mapData[i];
                if (areaName === data.n) {
                    index = i;
                    areaData = data;
                    break;
                }
            }
            var dom = document.createElement("div");
            dom.docData = { index: index };
            dom.areaData = areaData;
            if (self.inIndex) {
                self.getMore($(dom));
            } else {
                $(".publicOpinion_list." + self.directive).find(".list_center").fadeOut('slow', function() {
                    self.inList = false;
                    self.renderList(dom.areaData, 0).then(function() {
                        $(".publicOpinion_list." + self.directive).find(".list_center").fadeIn("slow");
                    });
                });
            }
        });
    };
    var pomoz = new Pomoz();
    pomoz.start();

    //弹出的详情页关闭按钮
    $("#close_detail_js").click(function() {
        $("#c_detail_js").fadeOut("fast", function() {
            if (pomoz.curSelectedDoc !== undefined) pomoz.curSelectedDoc.css("color", "inherit");
        });
        $("#originalText_iframe_js").attr("src", "");
    });
    //弹出的查看原文关闭按钮
    $("#text_details_close_js").click(function() {
        $("#originalText_detail_js").fadeOut("fast", function() {
            $("#originalText_iframe_js").attr("src", "");
            /*if (pomoz.curSelectedDoc !== undefined) pomoz.curSelectedDoc.css("color", "inherit");*/
        });
    });

})();
