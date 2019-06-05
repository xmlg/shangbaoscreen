var scrollSpeed = 0.05; //滚动速度
var myScroll = new window.myScroll();

function App() {
    var self = this;
    this.radarG = d3.select('.radar-map svg g.radar');
    this.relationG = d3.select('.relation-map g');
    this.selectedRecordIndex = 0;
    this.dataAreaIndex = 2;
    this.newsRecordIndex = 0;
    this.newsIndex = 0;
    this.intervalFlag = true; //左侧列表定时任务开关
    this.curMaterialappendixid = 0; //当前正在播放的素材id
    this.listboxcontent2 = $("#js_listboxcontent2");
    this.allData = [];
    this.allDataNews = [];
    this.requestData();
    this.requestNews();
    this.startTimingTask();
    this.requestListData();
    this.requestAllNewMaterials();
    this.reportlist = $("#js_reportlist");
    this.detailsBox = $("#js_details-box");
    this.scroll = 0;
    this.interval;
    this.interval1;
    this.interval2;
    this.interval3;
    this.delayToHide; //延迟执行隐藏弹窗
    this.delayHideTime = 5000; //延迟执行隐藏弹窗的时间
    this.reportidList = []; //左侧列表信息id集合
    /*this.reportidListIndex = 0;*/
    this.materialByReportidArr = []; //某一个报题对应的新的未播放的素材，（当前报题对应的需要播放的素材数组）
    this.materialByReportidArrIndex = -1;
    this.materialByReportidCurIndex = 0; //当前报题对应的正在播放的素材数组下标
    this.delayToGetUrl = "";
    this.delayToGetUrl1 = "";
    this.SucaiPlaying = false; //是否有素材正在播放
    this.delayToShowDetail; //延迟执行报题详情滚动效果
    this.keepConnectionTimeout; //定时请求后端服务的定时器
    this.keepConnectionTime = 1000 * 60 * 5; //定时请求后端服务的设定时间
    this.keepConnection();
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

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestData();
    }, 150 * 1000);

    var interval1 = window.setInterval(function() {
        self.selectedRecordIndex++;
        if (self.selectedRecordIndex >= 5) {
            self.selectedRecordIndex = 0;
            self.dataAreaIndex++;
            if (self.dataAreaIndex >= self.allData.length) {
                self.dataAreaIndex = 0;
            }
        }
        self.render();
    }, 5 * 1000);
}

App.prototype.requestListData = function() {
    var self = this;
    if (self.intervalFlag) {
        self.interval2 = setInterval(function() {
            self.newsRecordIndex++;
            if (self.newsRecordIndex >= self.newsIndex) {
                self.newsRecordIndex = 0;
                self.newsIndex = 0;
                $('#js_reportlist').scrollTop(0);
                this.scroll = 0;
                /*self.reportidList = [];
                self.reportidListIndex = 0;*/
                self.requestNews();
            } else {
                /*if (hasNewReports(self)) {
                    self.newsRecordIndex = 0;
                    self.newsIndex = 0;
                    $('#js_reportlist').scrollTop(0);
                    this.scroll = 0;
                    self.requestNews();
                } else {*/
                self.renderNews();
                /*}*/
            }
            $(".details-content").css("margin-top", 0);
        }, 12 * 1000);
    }
};

/**
 * [hasNewReports description] 若有新报题，则直接刷新页面
 * @return {[type]} [description]
 */
function hasNewReports(self) {
    var hasNewReports = false;
    var allNewMaterials = JSON.parse(localStorage.getItem("cRight_allNewMaterials"));
    $("#js_reportlist").find(".reporttitle").each(function() {
        var reportid = $(this).attr("reportid");
        self.reportidList.push(reportid);
    });
    for (var i = 0; i < allNewMaterials.length; i++) {
        var result = $.inArray(allNewMaterials[i].REPORTID, self.reportidList);
        if (result != -1) {
            hasNewReports = true;
            break;
        }
    }
    return hasNewReports;
}

/**
 * [requestAllNewMaterials description]定时请求所有未播放的新素材信息,并存储到本地（cRight_allNewMaterials）
 * @return {[type]} [description]
 */
App.prototype.requestAllNewMaterials = function() {
    var self = this;
    self.interval3 = setInterval(function() {
        if (!self.SucaiPlaying) {
            getAllMaterials();
        }
    }, 5 * 1000);
};

function getAllMaterials() {
    $.get('/screen/pretheme/materialDetail', {
        flag: 0
    }, function(data) {
        data = JSON.parse(data);
        var cRight_allNewMaterials = JSON.stringify(data);
        localStorage.setItem("cRight_allNewMaterials", cRight_allNewMaterials);
    });
}

/**
 * [requestNews description]获取左侧列表所有信息接口，包括报题详情和素材列表
 * @return {[type]} [description]
 */
App.prototype.requestNews = function() {
    var self = this;
    var urlNews = serverDomain + '/screen/pretheme/reportNew';
    d3.json(urlNews, function(error, data1) {
        if (error) {
            return;
        }
        self.allDataNews = data1;
        self.renderNews();
    });
};

/**
 * [renderNews description]绘制左侧整体列表信息，并根据retoptId获取报题详情以及对应的素材
 * @return {[type]} [description]
 */
App.prototype.renderNews = function() {
    var self = this;
    self.dataNews = self.allDataNews;
    var newsArr = [];
    var activeIndex = 0;
    /* var reportidLists = [];*/

    for (var i = 0; i < self.dataNews.length; i++) {
        var item = self.dataNews[i];
        newsArr.push('<div class="listbox">');
        newsArr.push('    <div class="listheader" z-index="99">');
        newsArr.push('        <div class="font_title">' + item.DEPARTNAME + '</div><img src="img/middle-title-left.png" class="headertitle-left"><img src="img/middle-title-right.png" class="headertitle-right"></div>');
        newsArr.push('    <div class="listboxcontent yellowbg">');
        for (var j = 0; j < item.REPORTS_INFO.length; j++) {
            var news = item.REPORTS_INFO[j];
            newsArr.push('        <div class="reporttitle list-border-bottom" id="0" reportid="' + news.REPORTID + '">');
            var classStr = "";
            /*reportidLists[self.reportidListIndex++] = news.REPORTID;*/
            if (activeIndex === self.newsRecordIndex) {
                if (j == 0) {
                    var root = $("#js_reportlist").find(".active").closest('.listbox');
                    if (root != null && 0 != self.newsRecordIndex) {
                        var scrollt = 60 * self.newsRecordIndex;
                        self.scroll += root.height();
                        $('#js_reportlist').animate({ scrollTop: self.scroll }, 700);
                    }
                }
                classStr = ' class="active"';

                //展示报题详情
                showDetail(news, self);

                //展示素材列表
                showSucaiList(news, self);

            }
            if (news.FLAG == 0) {
                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p>');
            } else if (news.FLAG == 1) {
                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_5.png" class="flagicon">');
            } else if (news.FLAG == 2) {
                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_6.png" class="flagicon">');
            } else if (news.FLAG == 3) {
                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_7.png" class="flagicon">');
            }
            newsArr.push('        </div>');
            activeIndex++;
            if (self.newsRecordIndex == 0) {
                this.newsIndex++;
            }

        };
        newsArr.push('        <img src="img2/bmx_8.png" style="width:97%" class="blueborderup">');
        newsArr.push('        <img src="img2/bmx_10.png" style="width:97%" class="blueborderdown">');
        newsArr.push('    </div>');
        newsArr.push('</div>');
    };
    /*self.reportidList = reportidLists;*/
    this.reportlist.html(newsArr.join(""));
    if (0 == self.newsRecordIndex) {
        $('#js_reportlist').animate({ scrollTop: 0 }, 700);
        self.scroll = 0;
    }
    if (self.dataNews.length == undefined) {
        //this.reportlist.html("");

        self.detailsBox.find("#details-title").html("");
        self.detailsBox.find(".details-content").html("");

        js_Rmain_back.html("");
    }
};
/**
 * [showDetail description] 展示报题详情
 * @param  {[type]} news [description]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
function showDetail(news, self) {
    var titarr = [];
    titarr.push('<div class="details-content-title" id="details-title">');
    // titarr.push('    <img class="flagicon2" src="img2/bmx_3.png">');

    if (news.FLAG == 0) {
        // titarr.push('    <img class="flagicon3" src="img2/bmx_2.png">');
    } else if (news.FLAG == 1) {
        titarr.push('    <img class="flagicon2" src="img2/bmx_5.png">');
    } else if (news.FLAG == 2) {
        titarr.push('    <img class="flagicon2" src="img2/bmx_6.png">');
    } else if (news.FLAG == 3) {
        titarr.push('    <img class="flagicon2" src="img2/bmx_7.png">');
    }

    titarr.push('    <p class="tit1">' + news.STATEMENT + '</p>');
    titarr.push('</div>');
    self.detailsBox.find("#details-title").html(titarr.join(""));

    var content = news.SELECTEDCONTENT !== "" ? news.SELECTEDCONTENT : news.CONTENT;
    var retoptId = news.REPORTID;
    $.get('/screen/pretheme/onlyReportMessage', { //获取详细内容
        report_id: retoptId
    }, function(data) {
        //精敏重急
        data = JSON.parse(data);
        var reportDetailJson = data;
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
        if (addContent !== "") {
            content += "<br/><br/><br/><p>补充内容：</p>" + addContent;
        }
        content = content === undefined ? "" : content.replace(/style="[^"]*"/g, "").replace(/<h1/g, "<p").replace(/\/h1>/g, "/p>").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
        self.detailsBox.find(".details-content").html(content);
    });



    self.delayToShowDetail = setTimeout(function() {
        var detailsContent = $(".details-content");
        var detailsContentParent = detailsContent.parent().parent();
        if ((detailsContent.height() + 50) > detailsContentParent.height()) {
            if (self.interval2) { //转码时暂停请求左侧列表
                clearInterval(self.interval2); //暂停请求左侧列表
                self.intervalFlag = false;
            }
            var ani = (detailsContent.height() + 150 - detailsContentParent.height());
            $(".details-content").animate({ "margin-top": -ani }, ani / scrollSpeed, function() {
                if ((!self.SucaiPlaying) && (!(self.materialByReportidCurIndex < self.materialByReportidArr.length))) {
                    self.intervalFlag = true;
                    self.requestListData();
                }
            });
        }
    }, 1000);


}
/**
 * [showSucaiList description] 展示素材列表
 * @param  {[type]} news [description]
 * @param  {[type]} self [description]
 * @return {[type]}      [description]
 */
function showSucaiList(news, self) {
    var retoptId = news.REPORTID;
    $.get('/screen/pretheme/reporttask', {
        report_id: retoptId
    }, function(data) {
        var data = JSON.parse(data);
        /*var js_Rmain_back = $("#js_Rmain_back");*/
        if ($.isEmptyObject(data) == true) {
            js_Rmain_back.html("<img src='img2/bmx_no.jpg' class='bmx_no' />");
            return;
        } else {
            var PlanTaskLogs = data.PlanTaskLogs;
            var Materials = data.Materials;
            // console.log(data);
            var materialArr = [];
            for (var i = 0; i < Materials.length; i++) {
                var material = Materials[i];
                //1是文字 2是图片 3是音频 4是视频
                var cssStr = 'style="top: 0px;"';
                if (i % 2 == 0) {
                    if (material.MATERIALTYPE == 1) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="text_class1 click" ' + cssStr + '>');
                        materialArr.push('    <div class="text_source1">');
                        materialArr.push('        <div class="text_time1">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('        <div class="text_content1" id="text_1">' + material.MATERIALAPPFILE + '</div>');
                        materialArr.push('    </div>');
                        materialArr.push('    <div class="text_line1"></div>');
                        materialArr.push('    <div class="text_circle1"></div>');
                        materialArr.push('    <div class="text_report1">' + material.USERNAME + '</div>');
                        materialArr.push('</div>');
                    } else if (material.MATERIALTYPE == 2) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="img_class click" ' + cssStr + '>');
                        materialArr.push('    <div class="img_source">');
                        materialArr.push('    <div class="img_time">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('    <div class=""></div>');
                        materialArr.push('    <div class="img_video"><img class="img_sou" id="img_1" src="' + material.MATERIALAPPFILE + '"></div></div>');
                        materialArr.push('    <div class="img_line"></div>');
                        materialArr.push('    <div class="img_circle"></div>');
                        materialArr.push('    <div class="img_author">' + material.USERNAME + '</div>');
                        materialArr.push('</div>');
                    } else if (material.MATERIALTYPE == 3) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="autio_class1 click" ' + cssStr + '>');
                        materialArr.push('    <div class="autio_source1">');
                        materialArr.push('        <div class="autio_time1">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('        <div class="autio_autio1">');

                        var videoId = material.MATERIALAPPFILE;
                        var videoUrl = getmediaurl(videoId);
                        if (videoUrl == undefined) {
                            //显示转码中
                            materialArr.push('            <div class="waitgif" _videoId="' + videoId + '" _type="' + material.MATERIALTYPE + '"><img src="img/wait.gif" alt=""></div>');
                        } else {
                            //显示这是一条音频
                            materialArr.push('            <div id="audio_a" class="audio_a">');
                            materialArr.push('                <audio id="AudioIdb0" class="audio_b" controls="" src="' + videoUrl + '"></audio>');
                            materialArr.push('                <div class="audio_logo">');
                            materialArr.push('                    <img src="img2/bmx_11.png" alt="">');
                            materialArr.push('                </div>');
                            materialArr.push('                <div class="audio_content">这是一条音频</div>');
                            materialArr.push('                <div id="AudioIdc0" class="audio_c"></div>');
                            materialArr.push('            </div>');
                        }

                        materialArr.push('        </div>');
                        materialArr.push('    </div>');
                        materialArr.push('    <div class="autio_line1"></div>');
                        materialArr.push('    <div class="autio_circle1"></div>');
                        materialArr.push('    <div class="autio_report1">' + material.USERNAME + '</div>');
                        materialArr.push('</div>');
                    } else if (material.MATERIALTYPE == 4) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="video_class click" ' + cssStr + '>');
                        materialArr.push('    <div class="video_source">');
                        materialArr.push('        <div class="video_time1">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('        <div class=""></div>');

                        var videoId = material.MATERIALAPPFILE;
                        var videoUrl = getmediaurl(videoId);
                        if (videoUrl == undefined) {
                            //显示转码中
                            materialArr.push('            <div class="waitgif" _videoId="' + videoId + '" _type="' + material.MATERIALTYPE + '"><img src="img/wait.gif" alt=""></div>');
                        } else {
                            //显示视频小图
                            materialArr.push('        <video id="video_7" class="video_video1"  ><source src="' + videoUrl + '"></video>');
                        }

                        materialArr.push('    </div>');
                        materialArr.push('    <div class="video_line"></div>');
                        materialArr.push('    <div class="source_circle"></div>');
                        materialArr.push('    <div class="report_author">' + material.USERNAME + '</div>');
                        materialArr.push('</div>');
                    }
                } else {
                    if (material.MATERIALTYPE == 1) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="text_class click" ' + cssStr + '>');
                        materialArr.push('    <div class="text_report">' + material.USERNAME + '</div>');
                        materialArr.push('    <div class="text_circle"></div>');
                        materialArr.push('    <div class="text_line"></div>');
                        materialArr.push('    <div class="text_source">');
                        materialArr.push('        <div class="text_time">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('        <div class="text_content" id="text_1">' + material.MATERIALAPPFILE + '</div>');
                        materialArr.push('    </div>');
                        materialArr.push('</div>');
                    } else if (material.MATERIALTYPE == 2) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="img_class1 click" ' + cssStr + '>');
                        materialArr.push('    <div class="img_author1">' + material.USERNAME + '</div>');
                        materialArr.push('    <div class="img_circle1"></div>');
                        materialArr.push('    <div class="img_line1"></div>');
                        materialArr.push('    <div class="img_source1">');
                        materialArr.push('    <div class="img_time1">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('    <div class=""></div>');
                        materialArr.push('    <div class="img_video1"><img class="img_sou" id="img_1" src="' + material.MATERIALAPPFILE + '"></div></div>');
                        materialArr.push('</div>');
                    } else if (material.MATERIALTYPE == 3) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="autio_class click" ' + cssStr + '>');
                        materialArr.push('    <div class="autio_report">' + material.USERNAME + '</div>');
                        materialArr.push('    <div class="autio_circle"></div>');
                        materialArr.push('    <div class="autio_line"></div>');
                        materialArr.push('    <div class="autio_source">');
                        materialArr.push('        <div class="autio_time">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('        <div class="autio_autio">');
                        var videoId = material.MATERIALAPPFILE;
                        var videoUrl = getmediaurl(videoId);
                        if (videoUrl == undefined) {
                            //显示转码中
                            materialArr.push('            <div class="waitgif" _videoId="' + videoId + '" _type="' + material.MATERIALTYPE + '"><img src="img/wait.gif" alt=""></div>');
                        } else {
                            //显示这是一条音频
                            materialArr.push('            <div id="audio_a" class="audio_a">');
                            materialArr.push('                <audio id="AudioIdb0" class="audio_b" controls="" src="' + videoUrl + '"></audio>');
                            materialArr.push('                <div class="audio_logo">');
                            materialArr.push('                    <img src="img2/bmx_11.png" alt="">');
                            materialArr.push('                </div>');
                            materialArr.push('                <div class="audio_content">这是一条音频</div>');
                            materialArr.push('                <div id="AudioIdc0" class="audio_c"></div>');
                            materialArr.push('            </div>');
                        }
                        materialArr.push('        </div>');
                        materialArr.push('    </div>');
                        materialArr.push('</div>');
                    } else if (material.MATERIALTYPE == 4) {
                        materialArr.push('<div rel="' + material.MATERIALTYPE + '" class="video_class1 click" ' + cssStr + '>');
                        materialArr.push('    <div class="report_author1">' + material.USERNAME + '</div>');
                        materialArr.push('    <div class="source_circle1"></div>');
                        materialArr.push('    <div class="video_line1"></div>');
                        materialArr.push('    <div class="video_source1">');
                        materialArr.push('        <div class="video_time1">' + d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME)) + '</div>');
                        materialArr.push('        <div class=""></div>');
                        var videoId = material.MATERIALAPPFILE;
                        var videoUrl = getmediaurl(videoId);
                        if (videoUrl == undefined) {
                            //显示转码中
                            materialArr.push('            <div class="waitgif" _videoId="' + videoId + '" _type="' + material.MATERIALTYPE + '"><img src="img/wait.gif" alt=""></div>');
                        } else {
                            //显示视频小图
                            materialArr.push('        <video id="video_7" class="video_video1"  ><source src="' + videoUrl + '"></video>');
                        }
                        materialArr.push('    </div>');
                        materialArr.push('</div>');
                    }
                }
            }
            js_Rmain_back.html(materialArr.join(""));
            if ($.trim(js_Rmain_back.html()) == "") {
                js_Rmain_back.html("<img src='img2/bmx_no.jpg' class='bmx_no' />");
            } else {
                var materialByReportidArr = hasNewMaterials(retoptId, self);
                if (js_Rmain_back.find(".waitgif").length > 0) {
                    self.zhuanma();
                } else {
                    if ((!self.SucaiPlaying) && (self.materialByReportidCurIndex < self.materialByReportidArr.length)) {
                        self.showSuCai();
                    }
                }

            }
            myScroll.scroll("wrapper1");
        }
    });
}
/**
 * [zhuanma description]将正在转码的音视频图片替换为转码完成之后的效果
 * @return {[type]} [description]
 */
App.prototype.zhuanma = function() {
    var self = this;
    if (js_Rmain_back.find(".waitgif").length > 0) {
        if (self.interval2) { //转码时暂停请求左侧列表
            clearInterval(self.interval2); //暂停请求左侧列表
            self.intervalFlag = false;
        }
        self.delayToGetUrl1 = setTimeout(function() {
            js_Rmain_back.find(".waitgif").each(function() {
                var videoId = $(this).attr("_videoId");
                var videoUrl = getmediaurl(videoId);
                if (videoUrl != undefined) {
                    //替换图片为音视频
                    var _type = $(this).attr("_type");
                    var replaceContent = "";
                    if (_type == 3) { //音频
                        replaceContent += '            <div id="audio_a" class="audio_a">';
                        replaceContent += '                <audio id="AudioIdb0" class="audio_b" controls="" src="' + videoUrl + '"></audio>';
                        replaceContent += '                <div class="audio_logo">';
                        replaceContent += '                    <img src="img2/bmx_11.png" alt="">';
                        replaceContent += '                </div>';
                        replaceContent += '                <div class="audio_content">这是一条音频</div>';
                        replaceContent += '                <div id="AudioIdc0" class="audio_c"></div>';
                        replaceContent += '            </div>';
                        $(this).replaceWith(replaceContent);
                        return true;
                    } else { //_type==4视频
                        replaceContent += '        <video id="video_7" class="video_video1"><source src="' + videoUrl + '"></video>';
                        $(this).replaceWith(replaceContent);
                        return true;
                    }
                } else {
                    self.zhuanma();
                }
            });
            if ((!self.SucaiPlaying) && (self.materialByReportidCurIndex < self.materialByReportidArr.length)) {
                self.showSuCai();
            }
        }, 1000);
    } else {
        if ((!self.SucaiPlaying) && (self.materialByReportidCurIndex < self.materialByReportidArr.length)) {
            self.showSuCai();
        }
        if (self.delayToGetUrl != "") {
            clearTimeout(self.delayToGetUrl);
        }
    }
};

/**
 * [hasNewMaterials description]根据reportId判断当前报题是否有新素材
 * @param  {[type]}  reportId [description]
 * @param  {[type]}  self     [description]
 * @return {Boolean}          [description]
 */
function hasNewMaterials(reportId, self) {
    getAllMaterials();
    var allNewMaterials = JSON.parse(localStorage.getItem("cRight_allNewMaterials"));
    //将retoptId对应的新的素材存入数组，若存在则播放素材
    self.materialByReportidArr = [];
    self.materialByReportidArrIndex = -1;
    self.materialByReportidCurIndex = 0;
    for (var i = 0; i < allNewMaterials.length; i++) {
        var oneMaterial = allNewMaterials[i];
        if (oneMaterial.REPORTID == reportId) {
            clearInterval(self.interval2); //暂停请求左侧列表
            self.intervalFlag = false;
            self.materialByReportidArr[++self.materialByReportidArrIndex] = allNewMaterials[i];
        }
    }
    return self.materialByReportidArr;
}

/**
 * [showSuCai description]2屏：大图展示素材
 * @return {[type]} [description]
 */
App.prototype.showSuCai = function() {
    var self = this;
    var curSucai = self.materialByReportidArr[self.materialByReportidCurIndex];
    if (curSucai != null) {
        //1是文字 2是图片 3是音频 4是视频
        var rel = curSucai.MATERIALTYPE;
        var materialappendixid = curSucai.MATERIALAPPENDIXID;
        self.curMaterialappendixid = materialappendixid;
        if (rel == 1) {
            var textArr = [];
            var text_report = curSucai.USERNAME,
                text_time = curSucai.CRTIME,
                text_content = curSucai.MATERIALAPPFILE;
            textArr.push('<div id="modal_text">');
            textArr.push('    <div id="modaltext_message">');
            textArr.push('    <div id="modaltext_name">' + text_report + '</div>');
            textArr.push('    <div id="modaltext_time">' + d3.time.format('%m-%d %H:%M')(new Date(text_time)) + '</div></div><div id="modaltext_text">');
            textArr.push(text_content);
            textArr.push('    </div>');
            textArr.push('</div>');
            $modalOverlay.find(".modal-main").html(textArr.join(""));

            autoShowCurMaterial();

            autoCloseCurMaterial(materialappendixid, self);
        } else if (rel == 2) {
            $modalOverlay.find(".modal-main").html("<img id='modal_picture_video' src='" + curSucai.MATERIALAPPFILE + "' />");

            autoShowCurMaterial();
            autoCloseCurMaterial(materialappendixid, self);
        } else if (rel == 3) {
            var audioUrl = getmediaurl(curSucai.MATERIALAPPFILE);
            if (audioUrl != null) {
                $modalOverlay.find(".modal-main").html('<div id="modal_aiduo" class="modal_aiduo"><audio controls="" id="modal_audio_source" src="' + audioUrl + '"></audio><img src="img2/aaa.png" style="position: relative;left: -465px;"><div class="modal_aiduo_message"><div id="modal_aiduo_player"></div><div id="modal_audio_content">这是一条音频</div></div></div>');
                var audio = $modalOverlay.find('audio')[0];
                if (audio.paused) {
                    audio.play(); //audio.play();// 这个就是播放
                } else {
                    audio.pause(); // 这个就是暂停
                }
                autoShowCurMaterial();
                audio.addEventListener('ended', function() {
                    autoCloseCurMaterial(materialappendixid, self);
                }, false);
            } else {

            }
        }
        if (rel == 4) {
            var videoUrl = getmediaurl(curSucai.MATERIALAPPFILE);
            if (videoUrl != null) {
                $modalOverlay.find(".modal-main").html('<video id="modal_video" class="modal_video" src="' + videoUrl + '" controls=""></video>');
                var myVideo = $modalOverlay.find('video')[0];
                if (myVideo.paused) {
                    myVideo.play();
                } else {
                    myVideo.pause();
                }

                autoShowCurMaterial();
                myVideo.addEventListener('ended', function() {
                    autoCloseCurMaterial(materialappendixid, self);
                }, false);
            }

        }
    } else {
        self.intervalFlag = true;
    }
    /**
     * [autoShowCurMaterial description]延迟一秒展示素材
     * @return {[type]} [description]
     */
    function autoShowCurMaterial() {
        var delayToShow = setTimeout(function() {
            self.SucaiPlaying = true;
            $modalOverlay.show("slow"); //展示
        }, 1000);
    }

    /**
     * [showOrPlayCurMaterial description]在展示完成之后关闭弹窗(delayHideTime秒钟后隐藏)
     * @return {[type]} [description]
     */
    function autoCloseCurMaterial(materialappendixid, self) {
        delnewtaskmessage(materialappendixid);
        self.materialByReportidCurIndex++;
        self.delayToHide = setTimeout(function() {
            $modalOverlay.hide();
            self.SucaiPlaying = false;
            self.showSuCai();
            var curSucai = self.materialByReportidArr[self.materialByReportidCurIndex];
            if (curSucai == null) {
                /*if (hasNewReports()) { //若有新报题，则直接刷新页面
                    self.newsRecordIndex = 0;
                    self.newsIndex = 0;
                    $('#js_reportlist').scrollTop(0);
                    this.scroll = 0;
                    self.requestNews();
                } else {*/
                self.requestListData();
                /*}*/
            }
        }, self.delayHideTime);
    }
};

/**
 * [aaa description] 素材标识为已展示
 * @return {[type]} [description]
 */
function delnewtaskmessage(materialappendixid) {
    $.get('/screen/pretheme/delnewtaskmessage', {
        materialappendixid: materialappendixid
    }, function(data) {

    });
}

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
            if (isEmptyObject(data.streamsMap)) {
                self.delayToGetUrl = setTimeout(function() {
                    getmediaurl(id);
                }, 1000);
                return;
            } else {
                videourl = data.streamsMap.l.httpURL;
            }
        }
    });
    if (self.delayToGetUrl != "") {
        clearTimeout(self.delayToGetUrl);
    }
    return videourl;
}

function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}


/**
 * [requestData description]昨日传播力分析
 * @return {[type]} [description]
 */
App.prototype.requestData = function() {
    var self = this;
    // var url = 'js/zuorigaojian.txt'
    var url = serverDomain + '/screen/manuscript/yesterdayoriginal';
    d3.json(url, function(error, data) {
        if (error) {
            return;
        }
        // console.log(data);

        var dataArea1 = null;
        var dataArea3 = null;
        var dataArea7 = null;

        data.Records.forEach(function(d, i) {
            if (d.timeArea === 1) {
                dataArea1 = formatData(d.data);
            } else if (d.timeArea === 3) {
                dataArea3 = formatData(d.data);
            } else if (d.timeArea === 7) {
                dataArea7 = formatData(d.data);
            }
        });
        self.allData = [dataArea1, dataArea3, dataArea7];
        self.render();
    });


    function formatData(data) {
        var result = data.map(function(d, i) {
            var dd = {};
            dd.name = d.title;
            dd.time = d3.time.format('%H:%M:%S')(new Date(d.pubTime));
            dd.radarValues = [d.contribOfRead, d.contribOfInteract, d.contribOfReprint];
            dd.value = ~~Number(d.ceiIndex);
            dd.children = [];

            dd.coreMedia = [];
            dd.author = d.author;
            dd.department = d.department;

            dd.exCoreMedias = d.exCoreMedias;
            dd.exLv1Medias = d.exLv1Medias;
            dd.exLv2Medias = d.exLv2Medias;

            dd.mediaName = d.mediaName;
            dd.inMedias = d.inMedias;

            var allMedias = [].concat(d.exmedias);

            var set = {};
            allMedias.forEach(function(d, i) {
                if (d.mediaLevel === '核心' && dd.coreMedia.indexOf(d.mediaName) < 0) {
                    dd.coreMedia.push(d.mediaName);
                }
                var node = {
                    name: d.mediaName,
                    parent: d.srcname && d.srcname !== '' ? d.srcname : null,
                    children: []
                };
                set[d.mediaName] = node;
            });
            allMedias.forEach(function(d, i) {
                if (d.srcname && d.srcname !== '' && !set[d.srcname]) {
                    set[d.srcname] = {
                        name: d.srcname,
                        children: []
                    };
                }
            });
            var setArr = [];
            for (key in set) {
                setArr.push(set[key]);
            }

            var children = setArr.filter(function(d) {
                return !d.parent;
            });

            setArr.forEach(function(d, i) {
                if (d.parent) {
                    set[d.parent].children.push(d);
                }
            });
            dd.children = children;
            return dd;
        });
        return result;
    }
};

App.prototype.render = function() {
    var self = this;
    self.data = self.allData[0];
    this.renderTitle();
    this.renderList();
    this.renderRadarMap();
    this.renderRelationMap();
    this.renderInfo();
};

App.prototype.renderTitle = function() {
    var self = this;
    d3.select('h1.right').text('昨日原创稿件排行TOP10');
    //  switch(self.dataAreaIndex) {
    //      case 1:
    //          d3.select('h1.right').text('三日原创稿件排行TOP10');
    //          break;
    //      case 2:
    //          d3.select('h1.right').text('七日原创稿件排行TOP10');
    //          break;
    //      default:
    //          d3.select('h1.right').text('昨日原创稿件排行TOP10');
    //          break;
    //  }
};

App.prototype.renderList = function() {
    var self = this;
    var sortData = this.data.sort(function(a, b) {
        return b.value - a.value;
    });
    if (sortData.length == 0) {
        return false;
    }
    var createTable = [];
    for (var i = 0; i < 5; i++) {
        var d = sortData[i];
        if (i === self.selectedRecordIndex) {
            createTable.push('<tr class="active">');
        } else {
            createTable.push('<tr>');
        }
        createTable.push('    <td>' + (i + 1) + '</td>');
        createTable.push('    <td class="tdleft"><div class="titles">' + d.name + '</div></td>');
        createTable.push('    <td>' + d.time + '</td>');
        createTable.push('    <td>' + d.value + '</td>');
        createTable.push('</tr>');
    };
    this.listboxcontent2.html(createTable.join(""));
};

App.prototype.renderRadarMap = function() {
    var self = this;
    if (this.data.length == 0) {
        return false;
    }
    var scale = d3.scale.linear().domain([0, 1]).range([25, 55]).clamp(true);

    var line0 = d3.svg.line()
        .x(function(d, i) {
            return 0;
        })
        .y(function(d, i) {
            return 0;
        });

    var line1 = d3.svg.line()
        .x(function(d, i) {
            return scale(d) * Math.sin(i * 2 * Math.PI / 3);
        })
        .y(function(d, i) {
            return -scale(d) * Math.cos(i * 2 * Math.PI / 3);
        });

    var radarValues = this.data[self.selectedRecordIndex].radarValues;

    var update = this.radarG.selectAll('path.line').data([radarValues]);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append("path")
        .classed('line', true)
        .attr({
            'fill': 'rgba(45, 160, 150, 0.5)',
            'stroke': '#269797',
            'stroke-width': 1
        })
        .attr("d", function(d) {
            return line0(d) + ' Z';
        });
    update
        .transition()
        .duration(500)
        .attr("d", function(d) {
            return line1(d) + ' Z';
        });

    /*d3.select('.radarValues-1').text(~~(radarValues[0] * 100));
    d3.select('.radarValues-2').text(~~(radarValues[1] * 100));
    d3.select('.radarValues-3').text(~~(radarValues[2] * 100));*/
    d3.select('.radarValues-1').text(~~(radarValues[0] * 100) + "%");
    d3.select('.radarValues-2').text(~~(radarValues[1] * 100) + "%");
    d3.select('.radarValues-3').text(~~(radarValues[2] * 100) + "%");
};

App.prototype.renderRelationMap = function() {
    var self = this;

    this.relationG.selectAll('*').remove();
    if (this.data.length == 0) {
        return false;
    }
    var tree = d3.layout.tree()
        .size([360, 150])
        .separation(function(a, b) {
            return (a.parent == b.parent ? 1 : 2) / a.depth;
        });

    var nodes = tree.nodes(this.data[self.selectedRecordIndex]),
        links = tree.links(nodes);
    var link = this.relationG.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#0D7074")
        .style("stroke-width", 1)
        .each(function(d) {
            var x1 = (d.source.depth * 20 + Math.min(d.source.depth, 1) * 25) * Math.cos(Math.PI * (d.source.x - 90) / 175) || 0;
            var y1 = (d.source.depth * 20 + Math.min(d.source.depth, 1) * 25) * Math.sin(Math.PI * (d.source.x - 90) / 175) || 0;

            var x2 = (d.target.depth * 20 + Math.min(d.target.depth, 1) * 25) * Math.cos(Math.PI * (d.target.x - 90) / 175) || 0;
            var y2 = (d.target.depth * 20 + Math.min(d.target.depth, 1) * 25) * Math.sin(Math.PI * (d.target.x - 90) / 175) || 0;

            d3.select(this).attr({
                    x1: x1,
                    y1: y1,
                    x2: x1,
                    y2: y1
                })
                .transition()
                .ease('linear ')
                .duration(500)
                .delay(function(d, i) {
                    return d.target.depth * 500 || 0;
                })
                .attr({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
        });

    var node = this.relationG.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("transform", function(d) {
            if (d.parent) {
                var x = (d.parent.depth * 20 + Math.min(d.parent.depth, 1) * 25) * Math.cos(Math.PI * (d.parent.x - 90) / 175) || 0;
                var y = (d.parent.depth * 20 + Math.min(d.parent.depth, 1) * 25) * Math.sin(Math.PI * (d.parent.x - 90) / 175) || 0;
            } else {
                var x = (d.depth * 20 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
                var y = (d.depth * 20 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            }
            return "translate(" + x + "," + y + ")";
        })
        .attr("r", 0)
        .style("fill", '#0ECAC9')
        .transition()
        .ease('linear ')
        .duration(500)
        .delay(function(d, i) {
            return d.depth * 500;
        })
        .attr("r", function(d, i) {
            return (2 + 2 * Math.random() - 0.5 * d.depth);
        })
        .attr("transform", function(d) {
            var x = (d.depth * 20 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
            var y = (d.depth * 20 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            return "translate(" + x + "," + y + ")";
        });
};

App.prototype.renderInfo = function() {
    if (this.data.length == 0) {
        return false;
    }
    var selectData = this.data[this.selectedRecordIndex];
    d3.select('.main-right2 h2').text(selectData.name);
    var mediaNum = (function() {
        if (selectData.inMedias !== undefined) {
            var num = 0;
            for (var i = 0; i < selectData.inMedias.length; i++) {
                var mediaName = selectData.inMedias[i].mediaName;
                if (mediaName !== selectData.mediaName) num++;
            }
            return num + 1;
        } else {
            return 1;
        }
    })();
    var isMoreThanOne = mediaNum === 1 ? "" : "等" + mediaNum + "家媒体";
    d3.select('.department').text(selectData.mediaName + isMoreThanOne);

    d3.select('.author').text(selectData.author);

    d3.select('.exCoreMedias').text(selectData.exCoreMedias);
    d3.select('.exLv1Medias').text(selectData.exLv1Medias);
    d3.select('.exLv2Medias').text(selectData.exLv2Medias);

    var update = d3.select('.core-list-body').selectAll('div.item').data(selectData.coreMedia);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('div').classed('item', true);
    update.text(function(d) {
        return d
    });
};

var app = new App();
var $modalOverlay = $("#modal-overlay"); //素材大图展示模块
var js_Rmain_back = $("#js_Rmain_back"); //素材列表模块
