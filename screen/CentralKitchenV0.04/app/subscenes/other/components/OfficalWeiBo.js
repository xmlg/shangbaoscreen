define(function(require) {
    var BorderType1 = require('components/BorderType1');
    var dataManager = require('tool/dataManager');
    var util = require('tool/util');

    function OfficalWeiBo(parent, w, h) {
        var self = this;
        BorderType1.call(this, parent, w, h);

        //      self.newsIndex = 0;
        //      self.newsList = util.clone(dataManager.getData().OFFICALWEIBO.WEIBOMESS);
        //
        //      self.policyIndex = 0;
        //      self.policyList = util.clone(dataManager.getData().OFFICALWEIBO.POLICYS);

        //微博
        self.draftIndex = 0;
        self.playTime = 5000; //轮播时间为5秒
        self.moveSpeed = 0.02; //标题移动速度
        self.beforePlayTime = 1000; //阅读前停留时间
        self.circle = '<div class="circle-container">' +
            '<div class="circle-outer"></div>' +
            '<div class="circle-inner"></div>' +
            '</div>'; //高亮小圆环
        self.newsG = self.snapElement.g().attr({
            opacity: 0
        });
        self.newsPath1 = self.newsG.path('M-115 -115  112 -115 125 -102 125 25 -115 25 Z');
        self.newsPath2 = self.newsG.path('M-115 -95  125 -95');

        self.newsTitle = self.newsG.text(0, 2, '').attr({
            fill: '#9BD4D7',
            fontFamily: 'SimHei',
            letterSpacing: '2.5px',
            fontSize: '14px',
            transform: 'matrix(1, 0, 0, 1, -105, -102)'
        });

        self.newsTime1 = self.newsG.text(-100, 7, '').attr({
            fill: '#9BD4D7',
            fontFamily: 'SimHei',
            fontSize: '12px'
        });
        self.newsTime2 = self.newsG.text(110, 7, '').attr({
            fill: '#9BD4D7',
            fontFamily: 'SimHei',
            fontSize: '12px',
            textAnchor: 'end'
        });

        var foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        var $foreignObject = $(foreignObject);
        self.newsG.append(foreignObject);
        var foreignObject = self.newsG.select('foreignObject');
        var $div = $('<div></div>');
        $div.css({
            margin: '0px',
            height: '170%',
            width: '100%',
            overflow: 'hidden',
            'font-size': '16px',
            'line-height': '24px',
            color: '#FFFFFF',
            textIndent: '2em',
            border: 'solid 1px #0d7e9e',
            padding: '5px'
        });
        $foreignObject.append($div);
        self.newsForeignObject = foreignObject;
        foreignObject.attr({
            width: '231px',
            height: '110px',
            x: -110,
            y: -50
        });
        setDiv(function() {
            self.getWBdata();
        });

        function setDiv(callback) {
            var boarddiv = "<div id='Alldiv' style='width:258px;height:260px;z-index:999;position:absolute;left:657px;top:-43px;margin-top:100px;'>";
            boarddiv += "<div id='divlist1' ></div><div id='ZX' class='divList'><div class='circleParent'></div><span id='zxz'>撰写中</span></div><div id='GXQ' class='divList'><div class='circleParent'></div><span class='GXQ_text'>共享前审批</span></div><div id='GX' class='divList'><div class='circleParent'></div><span class='GX_text'>已共享</span></div><div id='QY' class='divList'><div class='circleParent'></div><span class='CG_text'>已取用</span></div><div id='YQ' class='divList'><div class='circleParent'></div><span class='YQ_text'>已发</span></div></div>";
            $(document.body).append(boarddiv);
            //头部开始
            var divlist1 = $('#divlist1');
            divlist1.css({
                'margin-left': '20px',
                'height': '36px',
                'width': '218px',
                'font-size': '21px',
                'text-align': 'center',
                'line-height': '34px',
                'color': 'white',
                'margin-bottom': '10px'

            });
            //头部结束
            var divlist = $('.divList');
            divlist.css({
                'float': 'left',
                'margin-left': '70px',
                'width': '75%',
                'font-size': '20px',
                'margin-top': '5px',
                'height': '40px',
                'color': 'white'
            });
            setTimeout(function() {
                $('#Alldiv').css({
                    'opacity': 1,
                });
                callback();
            }, 5000);
        }
    }
    OfficalWeiBo.prototype = Object.create(BorderType1.prototype);
    OfficalWeiBo.constructor = OfficalWeiBo;
    OfficalWeiBo.prototype.init = function() {
        var self = this;
        BorderType1.prototype.init.call(this, function() {
            self.setTitle('选题稿件追踪');
        });
    };
    OfficalWeiBo.prototype.getWBdata = function() {
        var self = this;
        var defer = $.Deferred();
        $.ajax({
            type: "get",
            url: "/screen/centeralldataapp/todayreport",
            async: true,
            dataType: "json",
            success: function(data) {
                self.draftList = data;
                self.getDraftDetail();
                defer.resolve(data);
            }

        });
        return defer.promise();
    };
    OfficalWeiBo.prototype.getDraftDetail = function() {
        var self = this;
        if ($.isEmptyObject(self.draftList)) {
            setTimeout(function() {
                self.getWBdata();
            }, self.playTime);
            return;
        }
        var data = self.draftList[self.draftIndex];//JSON.parse(self.draftList[self.draftIndex].REPORTS_INFO);
        var metalogdata = data.DATA;
        $("#divlist1").html("<span style='display:none;position:relative'>" + data.TITLE + "</span>");
        /*$("#ZX").find(".circleParent").html(self.circle);*/
        $(".circle-container").remove();
        if (metalogdata.start) {
            $("#ZX").find(".circleParent").html(self.circle);
        }
        if (metalogdata.approval) {
            $("#GXQ").find(".circleParent").html(self.circle);
        }
        if (metalogdata.share) {
            $("#GX").find(".circleParent").html(self.circle);
        }
        var QYflag1 = metalogdata.usebywebsite && metalogdata.usebywebsite.website;
        var QYflag2 = metalogdata.usebypaper && metalogdata.usebypaper.newspaper;
        var QYflag3 = metalogdata.usebyapp && metalogdata.usebyapp.app;
        if (QYflag1 || QYflag2 || QYflag3) {
            $("#QY").find(".circleParent").html(self.circle);
        }
        var YQflag1 = metalogdata.publishbywebsite && metalogdata.publishbywebsite.website;
        var YQflag2 = metalogdata.publishbypaper && metalogdata.publishbypaper.newspaper;
        var YQflag3 = metalogdata.publishbyapp && metalogdata.publishbyapp.app;
        if (YQflag1 || YQflag2 || YQflag3) {
            $("#YQ").find(".circleParent").html(self.circle);
        }
        $("#divlist1").find("span").fadeIn("400", function() {
            var movingDistance = $("#divlist1").find("span").width() - $("#divlist1").width();
            movingDistance = movingDistance <= 0 ? 0 : movingDistance;
            setTimeout(function() {
                $("#divlist1").find("span").animate({
                    left: -movingDistance
                }, movingDistance / self.moveSpeed, 'linear', function() {
                    self.draftIndex++;
                    if (self.draftList.length === self.draftIndex) {
                        self.draftIndex = 0;
                        setTimeout(function() {
                            self.getWBdata();
                        }, self.playTime);
                    } else {
                        setTimeout(function() {
                            self.getDraftDetail();
                        }, self.playTime);
                    }
                });
            }, self.beforePlayTime);
        });
    };
    OfficalWeiBo.prototype.update = function() {
        var self = this;
        /*if (!$.isEmptyObject(self.draftList)) {
            self.getDraftDetail(self.draftList[self.draftIndex].reportid);
        }*/
        //getWBdata();
        //self.newsList = util.clone(dataManager.getData().OFFICALWEIBO.WEIBOMESS);
    };
    return OfficalWeiBo;
});
