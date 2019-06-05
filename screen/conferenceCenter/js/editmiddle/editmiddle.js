(function() {
    var myScroll = new window.myScroll();

    function App() {
        App.prototype.flagImgMap = {
            "1": "bqh/flag-1.png",
            "2": "bqh/flag-2.png",
            "3": "bqh/flag-3.png",
            "4": "bqh/flag-4.png"
        };

        App.prototype.selected_js = $("#selected_js"); //下拉时间
        App.prototype.today = new Date(); //当天时间
        App.prototype.oneday = 1000 * 60 * 60 * 24; //一天的时间间隔
        App.prototype.weekList = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'); //星期数组
        App.prototype.selectedDate;

        App.prototype.orgTraceTemplate = $("#report_main").children().clone();
        App.prototype.orgTraceTemplate_taskMain = $("#task_main").children().clone();
        App.prototype.orgTraceTemplate_mainMiddle = $("#main_middle").children().clone();

        App.prototype.keepConnectionTimeout; //定时请求后端服务的定时器
        App.prototype.keepConnectionTime = 1000 * 60 * 5; //定时请求后端服务的设定时间

        App.prototype.initDateLists();
        App.prototype.getReportData();
        App.prototype.keepConnection();

    }
    /**
     * [keepConnection description] 定时请求后端服务，防止后端服务会话超时无响应
     * @return {[type]} [description]
     */
    App.prototype.keepConnection = function() {
        var self = this;
        $.ajax({
            url: "/screen/areahotpoint/getDate",
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

    //初始化当天时间
    App.prototype.initDateLists = function() {
        var self = this;
        var oneDate, oneDateFormat, dateVal, week;
        var ul_content = "";
        self.selectedDate = self.today.getFullYear() + "-" + (self.today.getMonth() + 1) + "-" + self.today.getDate(); //默认传参，选中今天
        for (var i = 0; i <= 6; i++) {
            oneDate = new Date(self.today - self.oneday * i);
            oneDateFormat = oneDate.getFullYear() + "." + (oneDate.getMonth() + 1) + "." + oneDate.getDate();
            dateVal = oneDate.getFullYear() + "-" + (oneDate.getMonth() + 1) + "-" + oneDate.getDate();
            week = self.weekList[oneDate.getDay()];
            ul_content += '<li class="tag_option_li" value="' + dateVal + '">' + oneDateFormat + '（' + week + '）</li>';
        }
        self.selected_js.find(".tag_options").html(ul_content);
        self.selected_js.find(".tag_options").find("li:first").addClass("curr");

        TRS.my_select({
            param: self.selected_js //选择器
        });
        //时间选中事件
        $(".tag_option_li").click(function() {
            $("#report_main").html(self.orgTraceTemplate.clone());
            $("#task_main").html(self.orgTraceTemplate_taskMain.clone());
            $("#main_middle").html(self.orgTraceTemplate_mainMiddle.clone());


            self.centerTabDisable("main_top_BT", true);
            self.centerTabDisable("main_top_GJ", true);
            self.centerTabDisable("main_top_SC", true);

            $(this).parent().prev().find("span.val").text($(this).text());
            $(this).parent().hide();
            $(this).addClass("curr").siblings().removeClass("curr");
            self.selectedDate = $(this).attr("value");
            self.getReportData();
            self.centerContentHide();
        });
    };

    App.prototype.getReportData = function() {
        var self = this;
        $.get("/screen/pretheme/report", {
            time: self.selectedDate
        }, function(data) {
            //      $.get("report.json", function(data) {
            data = JSON.parse(data);
            if (data.length == undefined) {
                self.centerTabDisable("main_top_BT", true);
                self.centerTabDisable("main_top_GJ", true);
                self.centerTabDisable("main_top_SC", true);
            }
            App.prototype.drewReportList(data);
            App.prototype.getListMessage();
        });
    };
    //绘制稿件列表
    App.prototype.drewReportList = function(data) {
        var self = this;
        $(".main_left").html("");
        var main_left = d3.select('.main_left').selectAll('div').data(data);
        var main_enter = main_left.enter();
        var flagicon1 = "<img class='Dreport_img' src='bqh/flag-1.png'>";
        var flagicon2 = "<img class='Dreport_img' src='bqh/flag-2.png'>";
        var flagicon3 = "<img class='Dreport_img' src='bqh/flag-3.png'>";
        var flagicon4 = "<img class='Dreport_img' src='bqh/flag-4.png'>";
        main_enter.append('div').classed('deparment', true).each(function(d, i) {
            d3.select(this).append('div').classed('DTop', true).each(function() {
                d3.select(this).append('img').classed('Tleft', true).attr('src', 'bqh/bqhright_03.jpg');
                d3.select(this).append('div').classed('Dname', true).text(d.DEPARTNAME);
                d3.select(this).append('img').classed('Tright', true).attr('src', 'bqh/bqhleft_03.jpg');
                var textWidth = d3.select(this).select('.Dname').style('width');
                var imgWidth = (600 - textWidth.substring(0, textWidth.indexOf("px"))) / 2 - 35 + 'px';
                d3.select(this).select('.Tleft').style('width', imgWidth);
                d3.select(this).select('.Tright').style('width', imgWidth);
            });
            d3.select(this).append('div').classed('Dmain', true).each(function(d, i) {
                var Dmain = d3.select(this).selectAll('div').data(d.REPORTS_INFO);
                var enter = Dmain.enter();
                enter.append('div').classed('aaaaa', true).each(function(dd, i) {
                    if (dd.FLAG !== "0" && dd.FLAG !== undefined) d3.select(this).append('img').classed("Dreport_img", true).attr("src", self.flagImgMap[dd.FLAG]);
                    d3.select(this).append('div').classed('Dreport', true).text(dd.STATEMENT);
                    d3.select(this).append('span').classed('Dmone', true).text(dd.REPORTID);
                    d3.select(this)[0][0].reportContent = dd.CONTENT;
                    d3.select(this)[0][0].imgFlag = dd.FLAG;
                });
            });
        });
        myScroll.scroll("wrapper3");
        $(".aaaaa").click(function() {
            $('#GJXQ_text').empty();
            $('.aaaaa').children().css({
                'color': '#73E0FF'
            });
            self.curReport = $(this);
            self.centerContentHide();
            App.prototype.getReportMessage($(this));
            App.prototype.getTraceData($(this));
            App.prototype.getTaskData($(this));
            var title = $(this).find(".Dreport").html();
            var ele = $("#main_top_BT");
            /*switchToBT(self, this.reportContent, title, ele);*/
        });
    };
    //页面中部代码
    //绘制报题详情
    App.prototype.audio_play = function(a) {

        var aper = $(a).parent().parent().parent();
        var perfirst = $(aper).children().first();
        var perlast = $(aper).children().last();
        var b = $(perfirst);
        var Audio = b[0];
        var time = Audio.duration;
        if (Audio.paused) {
            /*window.startAgain();*/
            Audio.play();
            var timer = setInterval(currentpage, 50);
        } else {
            clearInterval(window.setine);
            Audio.pause();
            $(perlast).css('width', 0);
            var timer = setInterval(currentpage, 50);
        }

        function currentpage() {
            var percentage = (Audio.currentTime * 100 / Audio.duration) + '%';
            if (percentage == "NaN%") {
                percentage = 0 + '%';
            }
            var styles = {
                "width": percentage,
            };
            $(perlast).css(styles);
        }

    };
    //稿件详情
    App.prototype.getListMessage = function() {
        var self = this;
        var reportList = $('.aaaaa');
        var listLenth = reportList.length;
        var n = 0;
        self.startSet = function() {
            if (n < listLenth) {
                $('.aaaaa').children().css({
                    'color': '#73E0FF'
                });
                var ele = reportList[n];
                self.curReport = $(ele);
                App.prototype.getReportMessage($(ele));
                App.prototype.getTraceData($(ele));
                App.prototype.getTaskData($(ele));
                /*var title = self.curReport.find(".Dreport").html();
                switchToBT(self, self.curReport[0].reportContent, title, $("#main_top_BT"));*/
                n++;
            } else {
                n = 0;
            }
        };
        self.startSet();
        /*window.setine = window.setInterval(self.startSet, 15000);
        window.startAgain = function() {
            window.setine = window.setInterval(self.startSet, 15000);
        }*/
    };
    //tab绑定报题事件
    App.prototype.BTtabevent = function(content, title, addContent) {
        var self = this;
        var ele = $("#main_top_BT");
        ele.unbind("click").bind('click', function() {
            $('#GJXQ_text').empty();
            switchToBT(self, content, title, ele, addContent);
        });
    };
    //切换到报题详情
    function switchToBT(self, content, title, ele, addContent) {
        var elesibiling = $(ele).siblings();
        var flagImgSrc = self.curReport.find(".Dreport_img").attr("src");
        $('#main_img').attr('src', flagImgSrc);
        $('#main_title').text(title);
        $('#middle_text').empty();
        if (addContent !== "") {
            content += "<br/><br/><br/><p>补充内容：</p>" + addContent;
        }
        content = content === undefined ? "" : content.replace(/style="[^"]*"/g, "").replace(/<h1/g, "<p").replace(/\/h2>/g, "/p>");
        handleHtmlcontent(content, function(data) {
            $('#middle_text').html(data);
            var iasd = $('#main_img');
            var flagImg = self.curReport.find(".Dreport_img");
            iasd.attr("src", flagImg.attr("src"));
            iasd.hide();
            if (flagImg.length > 0) iasd.fadeIn("slow");
            $('#main_middle_GJXQ').css('display', 'none');
            $('#middle_main_SC').css('display', 'none');
            $('#main_middle_BTXQ').css('display', '');
            ele.css({
                'background-image': 'url(bqh/tab_one_03.jpg)'
            });
            $(elesibiling).each(function() {
                var flag = self[$(this).attr("id")] === "disabled";
                self.centerTabDisable($(this).attr("id"), flag);
            });
            self.centerContentShow();
            myScroll.scroll("wrapper1");
        });
    }
    //tab绑定稿件事件
    App.prototype.GJtabevent = function(content, title) {
        var self = this;
        var ele = $("#main_top_GJ");
        var elesibiling = $(ele).siblings();
        ele.unbind("click").bind('click', function() {
            if (self.main_top_GJ === undefined || self.main_top_GJ === "disabled") return;
            //$('#GJXQ_img').attr('src',src);
            $('#GJXQ_title').text(title);
            $('#GJXQ_text').empty();
            content = content === undefined ? "" : content.replace(/style="[^"]*"/g, "").replace(/<h1/g, "<p").replace(/\/h2>/g, "/p>");
            handleHtmlcontent(content, function(data) {
                $('#GJXQ_text').html(data);
                $('#main_middle_BTXQ').css('display', 'none');
                $('#middle_main_SC').css('display', 'none');
                $('#main_middle_GJXQ').css('display', '');
                ele.css({
                    'background-image': 'url(bqh/tab_one_03.jpg)'
                });
                $(elesibiling).each(function(index) {
                    var flag = self[$(this).attr("id")] === "disabled";
                    self.centerTabDisable($(this).attr("id"), flag);
                });
                myScroll.scroll("wrapper2");
                /*$(elesibiling).css({
                    'background-image': 'url(bqh/tab_two_03.jpg)'
                });*/
            });
        });
    };
    //tab绑定素材事件
    App.prototype.SCtabevent = function(data) {
        var self = this;
        var ele = $("#main_top_SC");
        var elesibiling = $(ele).siblings();
        ele.unbind("click").bind('click', function() {
            if (self.main_top_SC === "disabled") return;
            $('#GJXQ_text').empty();
            ele.css({
                'background-image': 'url(bqh/tab_one_03.jpg)'
            });
            $(elesibiling).each(function() {
                var flag = self[$(this).attr("id")] === "disabled";
                self.centerTabDisable($(this).attr("id"), flag);
            });
            $('#main_middle_BTXQ').css('display', 'none');
            $('#middle_main_SC').css('display', '');
            $('#main_middle_GJXQ').css('display', 'none');
            myScroll.scroll("wrapper4");
            //绘制素材回传

            //绘制素材回传
        });
    };
    //获取精重敏急等信息
    App.prototype.getReportMessage = function(ele) {
        var self = this;
        self.centerTabDisable("main_top_BT", false);
        var elelength = $(ele).children().length;
        $(ele).children('.Dreport').css({
            'color': 'white'
        });
        var eleValue = $(ele).children().last();
        var eleTitle = $(ele).children('div');
        var eleTitleval = $(eleTitle).text();
        var eletext = $('#middle_text');
        $(eletext).empty();
        var retoptId = $(eleValue).text();
        $.get('/screen/pretheme/onlyReportMessage', {
            //$.get('message.json', {
            report_id: retoptId
        }, function(data) {
            //精敏重急
            data = JSON.parse(data);
            var reportDetailJson = data;
            //reportDetailJson = JSON.parse(reportDetailJson);
            var flag = reportDetailJson.FLAG;
            var content = reportDetailJson.SELECTEDCONTENT !== "" ? reportDetailJson.SELECTEDCONTENT : reportDetailJson.CONTENT;
            var addContent = reportDetailJson.report_repliesinfo[0] === undefined ? "" : (function() {
                var tempAddContent = "";
                for (var i = 0; i < reportDetailJson.report_repliesinfo.length; i++) {
                    if (reportDetailJson.report_repliesinfo[i].VALUE !== undefined && reportDetailJson.report_repliesinfo[i].VALUE !== "") {
                        tempAddContent += "<p>" + reportDetailJson.report_repliesinfo[i].VALUE + "</p><br/>";
                    }
                }
                return tempAddContent;
            })();
            var title = reportDetailJson.STATEMENT;
            content = content === undefined ? "" : content.replace(/style="[^"]*"/g, "").replace(/<h1/g, "<p").replace(/\/h2>/g, "/p>");
            var ele = $("#main_top_BT");
            switchToBT(self, content, title, ele, addContent);
            App.prototype.BTtabevent(content, eleTitleval, addContent);
            //绘制报题详情

        });
    };
    //稿件追踪
    App.prototype.getTraceData = function(ele) {
        var self = this;
        var eleValue = $(ele).children().last();
        var retoptId = $(eleValue).text();
        var eleTitle = $(ele).children('div');
        var eleTitleval = $(eleTitle).text();

        $.get('/screen/pretheme/reporttrace', {
            //$.get('qg.json', {
            report_id: retoptId
        }, function(data) {
            if ($.isEmptyObject(data) == true) {
                return
            } else {
                var data = JSON.parse(data);
                $("#report_main").html(self.orgTraceTemplate.clone());
                if (data.Data === 0) {
                    self.centerTabDisable("main_top_GJ", true);
                    return;
                }
                self.centerTabDisable("main_top_GJ", false);
                var metalogdata = data.Data;
                var content = data.content;
                var title = data.title;
                App.prototype.GJtabevent(content, title);
                var metastatus = [];
                var metastatusStr = '';
                self.renderDataLog(metalogdata);
            }

        });
    };
    //渲染稿件操作日志
    App.prototype.renderDataLog = function(metalogdata) {
        var detail = $('.metalog-detail');
        var detail1 = $('.metalog-detail1');
        var detail2 = $('.metalog-detail2');
        if (metalogdata.start) {
            detail.css({ //新建灯亮
                'display': 'block'
            });
            $('.metalog-start').attr('src', 'bqh/GJ_KD_03.jpg');
            detail.find(".metalog-span").html(metalogdata.start.username);
        }
        if (metalogdata.approval) {
            detail1.css({
                'display': 'block'
            });
            $('.metalog-process:eq(0)').attr('src', 'bqh/GJ_LINE_03.jpg');
            detail1.find(".metalog-span").html(metalogdata.approval.username);
        }
        if (metalogdata.share) {
            detail2.css({
                'display': 'block'
            });
            $('.metalog-process:eq(1)').attr('src', 'bqh/GJ_LINE_03.jpg');
            detail2.find(".metalog-span").html(metalogdata.share.username);
        }

        /*if (metalogdata.use) {
            $('#QY_line').css({
                'background': 'rgb(24,225,243)'
            });
            $('#QY_circle').css({
                'background-image': 'url(bqh/QY_CIRCLE2_03.jpg)'
            });
            for (var i = 0; i < metalogdata.use.length; i++) {
                if (metalogdata.use[i].website) {
                    $('#QY_WZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (metalogdata.use[i].newspaper) {
                    $('#QY_BZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (metalogdata.use[i].app) {
                    $('#QY_KHD').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
            }
        }*/
        if (metalogdata.usebypaper || metalogdata.usebywebsite || metalogdata.usebyapp) {
            $('#QY_line').css({
                'background': 'rgb(24,225,243)'
            });
            $('#QY_circle').css({
                'background-image': 'url(bqh/QY_CIRCLE2_03.jpg)'
            });
            if (metalogdata.usebywebsite && metalogdata.usebywebsite.website) {
                $('#QY_WZ').css({
                    'background': 'rgb(24,225,243)'
                });
            }
            if (metalogdata.usebypaper && metalogdata.usebypaper.newspaper) {
                $('#QY_BZ').css({
                    'background': 'rgb(24,225,243)'
                });
            }
            if (metalogdata.usebyapp && metalogdata.usebyapp.app) {
                $('#QY_KHD').css({
                    'background': 'rgb(24,225,243)'
                });
            }
        }
        /*if (metalogdata.publish) {
            $('#JS_line').css({
                'background': 'rgb(24,225,243)'
            });
            $('#JS_circle').css({
                'background': 'rgb(24,225,243)',
                "color": "#195567"
            });
            for (var j = 0; j < metalogdata.publish.length; j++) {
                if (metalogdata.publish[j].app) {
                    $('#JS_KHD').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (metalogdata.publish[j].website) {
                    $('#JS_WZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (metalogdata.publish[j].newspaper) {
                    $('#JS_BZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
            }
        }*/
        if (metalogdata.publishbypaper || metalogdata.publishbywebsite || metalogdata.publishbyapp) {
            $('#JS_line').css({
                'background': 'rgb(24,225,243)'
            });
            $('#JS_circle').css({
                'background': 'rgb(24,225,243)',
                "color": "#195567"
            });
            if (metalogdata.publishbypaper && metalogdata.publishbypaper.newspaper) {
                $('#JS_BZ').css({
                    'background': 'rgb(24,225,243)'
                });
            }
            if (metalogdata.publishbywebsite && metalogdata.publishbywebsite.website) {
                $('#JS_WZ').css({
                    'background': 'rgb(24,225,243)'
                });
            }
            if (metalogdata.publishbyapp && metalogdata.publishbyapp.app) {
                $('#JS_KHD').css({
                    'background': 'rgb(24,225,243)'
                });
            }
        }
        /*var myLogData = {
            create: {
                finish: false
            }, //新建
            sharePriorApproval: {
                finish: false
            }, //共享之前的审批
            alreadyShared: {
                finish: false
            }, //, //已经共享
            usedWithinTheSite: {
                finish: false
            }, //, //已经被网站取用用
            usedWithinThePaper: {
                finish: false
            }, //, //已经被报纸取用用
            usedWithinTheApp: {
                finish: false
            }, //, //已经被客户端取用用
            postedOnTheWebsite: {
                finish: false
            }, //, //已经被网站发布
            postedOnThePaper: {
                finish: false
            }, //, //已经被报纸发布
            postedOnTheApp: {
                finish: false
            }, // //已经被客户端发布
        };
        dealData(metalogdata);
        console.log(myLogData);
        //处理日志数据
        function dealData(metalogdata) {
            var detail = $('.metalog-detail');
            var detail1 = $('.metalog-detail1');
            var detail2 = $('.metalog-detail2');
            for (var i = 0; i < metalogdata.length; i++) {
                var data = metalogdata[i];
                var operation = data.OPERATION;
                var mediaType = data.MEDIATYPE;
                if (operation === "新建" || operation === "编辑发稿单") {
                    myLogData.create.finish = true;
                    myLogData.create.username = "aaa";
                } else if (operation === "传稿") {
                    myLogData.sharePriorApproval.finish = true;
                } else if (operation === "共享") {
                    myLogData.sharePriorApproval.finish = true;
                    myLogData.alreadyShared.finish = true;
                }
                //else if (operation === "管理员删除") {
                //                   myLogData.alreadyShared.finish = false;
                //               }
                else if (operation === "取稿" || operation === "提交") {
                    if (mediaType === "1") myLogData.usedWithinTheApp.finish = true;
                    else if (mediaType === "2") myLogData.usedWithinTheSite.finish = true;
                    else if (mediaType === "3") myLogData.usedWithinThePaper.finish = true;
                } else if (operation === "退稿") {
                    if (mediaType === "1") myLogData.usedWithinTheApp.finish = false;
                    else if (mediaType === "2") myLogData.usedWithinTheSite.finish = false;
                    else if (mediaType === "3") myLogData.usedWithinThePaper.finish = false;
                } else if (operation === "签发" || operation === "签发照排") {
                    if (mediaType === "1") myLogData.postedOnTheApp.finish = true;
                    else if (mediaType === "2") myLogData.postedOnTheWebsite.finish = true;
                    else if (mediaType === "3") myLogData.postedOnThePaper.finish = true;
                } else if (operation === "取消签发") {
                    if (mediaType === "1") myLogData.postedOnTheApp.finish = false;
                    else if (mediaType === "2") myLogData.postedOnTheWebsite.finish = false;
                    else if (mediaType === "3") myLogData.postedOnThePaper.finish = false;
                }
            }
            if (myLogData.create.finish) {
                detail.css({ //新建灯亮
                    'display': 'block'
                });
                $('.metalog-start').attr('src', 'bqh/GJ_KD_03.jpg');
            }
            if (myLogData.sharePriorApproval.finish) {
                detail1.css({
                    'display': 'block'
                });
                $('.metalog-process:eq(0)').attr('src', 'bqh/GJ_LINE_03.jpg');
            }
            if (myLogData.alreadyShared.finish) { //共享成功
                detail2.css({
                    'display': 'block'
                });
                $('.metalog-process:eq(1)').attr('src', 'bqh/GJ_LINE_03.jpg');
            }
            if (!myLogData.alreadyShared.finish) { //取消共享
                detail2.css({
                    'display': 'none'
                });
                $('.metalog-process:eq(1)').attr('src', 'bqh/GJ_WD_03.jpg');
            }
            if (myLogData.usedWithinTheSite.finish || myLogData.usedWithinThePaper.finish || myLogData.usedWithinTheApp.finish) {
                $('#QY_line').css({
                    'background': 'rgb(24,225,243)'
                });
                $('#QY_circle').css({
                    'background-image': 'url(bqh/QY_CIRCLE2_03.jpg)'
                });
                if (myLogData.usedWithinTheSite.finish) {
                    $('#QY_WZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (myLogData.usedWithinThePaper.finish) {
                    $('#QY_BZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (myLogData.usedWithinTheApp.finish) {
                    $('#QY_KHD').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
            }
            if (!myLogData.usedWithinTheSite.finish || !myLogData.usedWithinThePaper.finish || !myLogData.usedWithinTheApp.finish) {
                if (!myLogData.usedWithinTheSite.finish && !myLogData.usedWithinThePaper.finish && !myLogData.usedWithinTheApp.finish) {
                    $('#QY_line').css({
                        'background': 'rgb(19, 172, 185)'
                    });
                    $('#QY_circle').css({
                        'background-image': 'url(bqh/QY_CIRCLE_03.jpg)'
                    });
                }
                if (!myLogData.usedWithinTheSite.finish) {
                    $('#QY_WZ').css({
                        'background': 'rgb(22, 126, 139)'
                    });
                }
                if (!myLogData.usedWithinThePaper.finish) {
                    $('#QY_BZ').css({
                        'background': 'rgb(22, 126, 139)'
                    });
                }
                if (!myLogData.usedWithinTheApp.finish) {
                    $('#QY_KHD').css({
                        'background': 'rgb(22, 126, 139)'
                    });
                }
            }
            if (myLogData.postedOnTheApp.finish || myLogData.postedOnTheWebsite.finish || myLogData.postedOnThePaper.finish) {
                $('#JS_line').css({
                    'background': 'rgb(24,225,243)'
                });
                $('#JS_circle').css({
                    'background': 'rgb(24,225,243)',
                    "color": "#195567"
                });
                if (myLogData.postedOnTheApp.finish) {
                    $('#JS_KHD').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (myLogData.postedOnTheWebsite.finish) {
                    $('#JS_WZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
                if (myLogData.postedOnThePaper.finish) {
                    $('#JS_BZ').css({
                        'background': 'rgb(24,225,243)'
                    });
                }
            }
            if (!myLogData.postedOnTheApp.finish || !myLogData.postedOnTheWebsite.finish || !myLogData.postedOnThePaper.finish) {
                if (!myLogData.postedOnTheApp.finish && !myLogData.postedOnTheWebsite.finish && !myLogData.postedOnThePaper.finish) {
                    $('#JS_line').css({
                        'background': 'rgb(19, 172, 185)'
                    });
                    $('#JS_circle').css({
                        'background': 'rgb(24, 81, 98)',
                        "color": "#195567"
                    });
                }
                if (!myLogData.postedOnTheApp.finish) {
                    $('#JS_KHD').css({
                        'background': 'rgb(22, 126, 139)'
                    });
                }
                if (!myLogData.postedOnTheWebsite.finish) {
                    $('#JS_WZ').css({
                        'background': 'rgb(22, 126, 139)'
                    });
                }
                if (!myLogData.postedOnThePaper.finish) {
                    $('#JS_BZ').css({
                        'background': 'rgb(22, 126, 139)'
                    });
                }
            }
        }*/
    };
    //获取任务追踪
    App.prototype.getTaskData = function(ele) {
            $("#SC_counts").text('( 0 )');
            $('#middle_main_SC').empty();
            var self = this;
            var eleValue = $(ele).children().last();
            var retoptId = $(eleValue).text();
            $("#track_none").removeClass('Dmone');
            $("#MR4").addClass('Dmone');
            $("#MR3").addClass('Dmone');
            $("#MR2").addClass('Dmone');
            $('#MR1').addClass('Dmone');
            $.get('/screen/pretheme/reporttask', {
                //          $.get('task.json', {
                report_id: retoptId
            }, function(data) {
                var data = JSON.parse(data);
                if ($.isEmptyObject(data) == true) {
                    self.centerTabDisable("main_top_SC", true);
                    return;
                } else {
                    $("#track_none").addClass('Dmone');
                    window.data1 = data;
                    App.prototype.drawSource(data);
                    App.prototype.SCtabevent(data);
                    var task_got = data.PlanTaskLogs[0].TASKUSER;
                    var create_name = data.PlanTaskLogs[0].OPERUSER;
                    $('.task_got').text(task_got);
                    $('.create_name').text(create_name);
                    var PlanTaskLogs = data.PlanTaskLogs;
                    var Materials = data.Materials;
                    //任务追踪开始
                    var Planstatus = [];
                    $.each(PlanTaskLogs, function(i) {
                        Planstatus.push(PlanTaskLogs[i].OPERSTATUS)
                    });
                    self.centerTabDisable("main_top_SC", Materials.length === 0 ? true : false);
                    if (Materials.length == 0) {
                        $("#track_none").removeClass('Dmone');
                        if (Planstatus.indexOf('10') != -1) {
                            $("#track_none").addClass('Dmone');
                            $("#MR4").addClass('Dmone');
                            $("#MR3").addClass('Dmone');
                            $("#MR2").addClass('Dmone');
                            $('#MR1').removeClass('Dmone');
                        }
                        if (Planstatus.indexOf('1') != -1) {
                            $("#track_none").addClass('Dmone');
                            $("#MR4").addClass('Dmone');
                            $("#MR3").addClass('Dmone');
                            $("#MR1").addClass('Dmone');
                            $('#MR2').removeClass('Dmone');
                        }
                        if (Planstatus.indexOf('11') != -1) {
                            $("#track_none").addClass('Dmone');
                            $("#MR4").addClass('Dmone');
                            $("#MR2").addClass('Dmone');
                            $("#MR1").addClass('Dmone');
                            $('#MR3').removeClass('Dmone');
                        }
                    } else {
                        $("#track_none").addClass('Dmone');
                        $("#MR3").addClass('Dmone');
                        $("#MR2").addClass('Dmone');
                        $("#MR1").addClass('Dmone');
                        $('#MR4').removeClass('Dmone');
                    }
                }

            })
        }
        //绘制回传素材

    App.prototype.drawSource = function(data) {
        var self = this;
        var Materials = data.Materials;
        var middle_main_SC = $('#middle_main_SC');
        middle_main_SC.empty();
        var SC_main = '<div id="SC_main"></div>';
        middle_main_SC.append(SC_main);

        if ($.isEmptyObject(Materials) == false) {
            var mark_code = '<div id="SC_axis"></div>';
            middle_main_SC.append(mark_code);
            //遍历回传素材数组
            var SC_counts = Materials.length;
            $("#SC_counts").text('(' + SC_counts + ')');
            self.centerTabDisable("main_top_SC", SC_counts > 0 ? false : true);
            var left = true; //定义左右开关门
            $.each(Materials, function(d, i) {
                left = !left;
                if (i.MATERIALTYPE == 1) {
                    TextSource(i, left, 'SC_main');
                }
                if (i.MATERIALTYPE == 2) {
                    pictureSource(i, left, 'SC_main');
                }
                if (i.MATERIALTYPE == 3) {
                    audioSource(i, left, 'SC_main');
                }
                if (i.MATERIALTYPE == 4) {
                    VideoSource(i, left, 'SC_main');
                }
            });
            //判断素材种类

        } else {
            //暂无回传素材代码区域
        }
        //      })
    };
    //参数1:标签ID
    App.prototype.centerTabDisable = function(id, boolean) {
        $("#" + id).css({ "color": boolean ? "grey" : "white", "cursor": boolean ? "not-allowed" : "pointer", "background-image": boolean ? "url(bqh/tab_two_03-1.jpg)" : "url(bqh/tab_two_03.jpg)" });
        this[id] = boolean ? "disabled" : "abled";
    };
    //中部数据淡出
    App.prototype.centerContentHide = function() {
        $(".middle_title").find("span").html("");
        $(".middle_title").hide();
        $("#middle_text").html("");
        $("#middle_text").hide();
        $(".text_mark").html("");
        $(".text_mark").hide();
    };
    //中部数据淡入
    App.prototype.centerContentShow = function() {
        $(".middle_title").fadeIn("slow");
        $("#middle_text").fadeIn("slow");
        $(".text_mark").fadeIn("slow");
    };
    //获取音视频地址
    function getmediaurl(id) {
        var params = {
            json: {
                masId: id,
                isLive: "false",
                player: "HTML5"
            }
        };
        var masurl = "/mas/openapi/pages.do?method=prePlay&appKey=TRSWCM4"
        var videourl;
        $.ajax({
            type: "get",
            headers: {
                "formdata": "1",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            url: masurl,
            async: false,
            data: {
                json: JSON.stringify(params.json)
            },
            success: function(data) {
                data = JSON.parse(data);
                videourl = data.streamsMap.l.httpURL;
            }
        });
        return videourl;
    }
    //绘制视频
    function VideoSource(data, L, mainele) {
        var Scele = $('#' + mainele);
        var data_ctime = data.CRTIME.substring(5, 20);
        var videoId = data.MATERIALAPPFILE;
        var videoUrl = getmediaurl(videoId);
        var videoName = data.USERNAME;
        if (L) {
            var L_code1 = '<div class="SC_video_left"><div class="video_left_video"><div class="video_left_date">' + data_ctime + '</div><div class="video_left_source"><video class="video_left_video" src=' + videoUrl + ' onclick="overlay(this)"></video></div>';
            var L_code2 = '</div><div class="video_left_line"></div><div class="video_left_circle"></div><div class="video_left_name">' + videoName + '</div></div>';
            Scele.append(L_code1 + L_code2);
        } else {
            var R_code1 = '<div class="SC_video_right"><div class="video_right_name">' + videoName + '</div><div class="video_right_circle"></div><div class="video_right_line"></div><div class="video_right_video"><div class="video_right_date">' + data_ctime + '</div>';
            var R_code2 = '<div class="video_right_source"><video class="video_left_video" src=' + videoUrl + ' onclick="overlay(this)"></video></div></div></div>';
            Scele.append(R_code1 + R_code2);
        }
    }
    //绘制图片
    function pictureSource(data, L, mainele) {
        var Scele = $('#' + mainele);
        var data_ctime = data.CRTIME.substring(5, 20);
        var pictureName = data.USERNAME;
        var img_src = data.MATERIALAPPFILE;
        var img = new Image();
        img.src = img_src;
        var width, height, top, left;
        img.onload = function() {
            var aspectRatio = 210 / 160;
            var myAspectRatio = img.width / img.height;
            if (aspectRatio > myAspectRatio) {
                height = "140px";
                width = 140 * myAspectRatio;
                left = ((190 - width) / 2) + "px";
                width = width + "px";
            } else {
                width = "190px";
                height = 190 / myAspectRatio;
                top = ((140 - height) / 2) + "px";
                height = height + "px";
            }
            if (!L) {
                var R_code1 = '<div class="SC_picture_right"><div class="picture_right_name">' + pictureName + '</div><div class="picture_right_circle"></div><div class="picture_right_line"></div><div class="picture_right_video"><div class="picture_right_date">' + data_ctime + '</div>';
                var R_code2 = '<div class="picture_right_source"><img class="picture_left_video" style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';" src=' + img_src + ' onclick="overlay(this)"></img></div></div></div>';
                Scele.append(R_code1 + R_code2);
            } else {
                var L_code1 = '<div class="SC_picture_left"><div class="picture_left_video"><div class="picture_left_date">' + data_ctime + '</div><div class="picture_left_source"><img class="picture_left_video" style="width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';"  src=' + img_src + ' onclick="overlay(this)"></img></div>';
                var L_code2 = '</div><div class="picture_left_line"></div><div class="picture_left_circle"></div><div class="picture_left_name">' + pictureName + '</div></div>';
                Scele.append(L_code1 + L_code2);

            }
        };
    }
    //绘制文本
    function TextSource(data, L, mainele) {
        var Scele = $('#' + mainele);
        var data_ctime = data.CRTIME.substring(5, 20);
        var textName = data.USERNAME;
        var text_short_title = data.MATERIALAPPFILE;
        if (L) {
            var L_code1 = '<div class="SC_text_left"><div class="text_left_video"><div class="text_left_date">' + data_ctime + '</div><div class="text_left_source"><div class="text_left_text" onclick="overlay(this)">' + text_short_title + '</div></div></div>';
            var L_code2 = '<div class="text_left_line"></div><div class="text_left_circle"></div><div class="text_left_name  a_name">' + textName + '</div></div>';
            Scele.append(L_code1 + L_code2);
        } else {
            var R_code1 = '<div class="SC_text_right"><div class="text_right_name a_name">' + textName + '</div><div class="text_right_circle"></div><div class="text_right_line"></div><div class="text_right_audio"><div class="text_right_date">' + data_ctime + '</div>';
            var R_code2 = '<div class="text_right_source"><div class="text_right_text" onclick="overlay(this)">' + text_short_title + '</div></div></div></div>';
            Scele.append(R_code1 + R_code2);
        }
    }
    //绘制音频
    //  window.audio_play = function(a){
    //          var aper = $(a).parent().parent().parent();
    //                  var perfirst = $(aper).children().first();
    //                  var perlast = $(aper).children().last();
    //              var b = $(perfirst);
    //              var Audio = b[0];
    //              var time = Audio.duration;
    //              if(Audio.paused) {
    //                  window.startAgain();
    //                  Audio.play();
    //                  var timer = setInterval(currentpage, 50);
    //              } else {
    //                  clearInterval(window.setine);
    //                  Audio.pause();
    //                  $(perlast).css('width', 0);
    //                  var timer = setInterval(currentpage, 50);
    //              }
    //      
    //              function currentpage() {
    //                  var percentage = (Audio.currentTime * 100 / Audio.duration) + '%';
    //                  if(percentage == "NaN%") {
    //                      percentage = 0 + '%';
    //                  }
    //                  var styles = {
    //                      "width": percentage,
    //                  };
    //                  $(perlast).css(styles);
    //              }
    //      
    //  }
    function audioSource(data, L, mainele) {

        var Scele = $('#' + mainele);
        var data_ctime = data.CRTIME.substring(5, 20);
        var audioid = data.MATERIALAPPFILE;
        var audioUrl = getmediaurl(audioid);
        var audioName = data.USERNAME;
        if (L) {
            var L_code1 = '<div class="SC_audio_left"><div class="audio_left_video"><div class="audio_left_date">' + data_ctime + '</div><div class="audio_left_source"><audio class="audio_left_video1" src=' + audioUrl + '></audio><div class="audio_d"><div class="play_logo"><img src="bqh/aaa.png" class="playlogo" onclick="overlay(this)"/></div>';
            var L_code2 = '<div class="audio_text">这是一条音频</div></div><div class="audio_progress"></div></div></div><div class="audio_left_line"></div><div class="audio_left_circle"></div><div class="audio_left_name">' + audioName + '</div></div>';
            Scele.append(L_code1 + L_code2);
        } else {
            var R_code1 = '<div class="SC_audio_right"><div class="audio_right_name">' + audioName + '</div><div class="audio_right_circle"></div><div class="audio_right_line"></div><div class="audio_right_audio"><div class="audio_right_date">' + data_ctime + '</div><div class="audio_right_source"><audio class="audio_right_video1" src=' + audioUrl + '></audio><div class="audio_d"><div class="play_logo"><img src="bqh/aaa.png" class="playlogo"  onclick="overlay(this)"/></div>';
            var R_code2 = '<div class="audio_text">这是一条音频</div></div><div class="audio_progress"></div></div></div></div>';
            Scele.append(R_code1 + R_code2);
        }

    }
    /**
     * [handleHtmlcontent description]处理html正文
     */
    function handleHtmlcontent(htmlContent, success) {
        var dom = document.createElement("div");
        var index = 0;
        var iframeIndex = 0;
        htmlContent = htmlContent.replace(/style="[^"]*"/g, "").replace(/width="[^"]*"/g, "").replace(/height="[^"]*"/g, "").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
        dom.innerHTML = htmlContent;
        $(dom).find("style").remove();
        var $a = $(dom).find("a");
        $a.each(function(index) {
            $(this).attr("target", "_blank");
        });
        var $imgs = $(dom).find("img");
        var $iframe = $(dom).find("iframe");
        handleImage($imgs, function() {
            handleIframe($iframe, function() {
                success($(dom).html());
            });
        });

        function handleIframe($iframe, success) {
            if (iframeIndex < $iframe.length) {
                $iframe.eq(iframeIndex).attr("width", "550");
                $iframe.eq(iframeIndex).attr("height", "310");
                iframeIndex++;
                handleIframe($iframe, success);
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
                    if (imgWidth * 3 < (560 - 10)) {
                        $imgs.eq(index).attr("width", imgWidth * 3);
                    } else {
                        $imgs.eq(index).attr("width", 550);
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
    //屏幕中部标签，禁止选中方法
    var app = new App();
})();
