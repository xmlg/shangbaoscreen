/*
    description:工具
    author:Bzm
 */
"use strict";
(function() {
    window.HttpService = {};
    HttpService = function() {};
    HttpService.prototype.httpServer = function(requestUrl, params, type, dataType) {
        var promise = $.ajax({
            url: serverDomain + requestUrl,
            type: type,
            data: params,
            timeout: 10000,
            dataType: dataType || "json",
            success: function(data) {},
            error: function() {}
        });
        return promise;
    };
})();
(function() {
    window.ANI = {};
    var params = {
        page_no: 0,
        page_size: 10
    };
    var HS = new HttpService();
    ANI = function(id, url) {
        this.globalSpeedRate = 1; //全局速率
        this.stopTime = 1000 / this.globalSpeedRate; //停留时间
        this.slidSpeed = 10000 / this.globalSpeedRate; //滚动速度
        this.slidTopRate = 0.0005 * this.globalSpeedRate; //上下翻动速率
        this.fadeInSpeed = 500 / this.globalSpeedRate; //fadeIn速度
        this.fadeOutSpeed = 500 / this.globalSpeedRate; //fadeOut速度
        this.stopBeforeTime = 2000 / this.globalSpeedRate; //向上滚动前的停留时间
        this.fadeOutBeforeTime = 2000 / this.globalSpeedRate; //文字展示的停留时间
        this.id = id;
        this.curr_idx = 0; //当前显示的item的下标
        this.url = url;
        this.getOrgTemplate = function() {
            this.orgTemplate = this.orgTemplate ? this.orgTemplate : $("#" + this.id).find("ul").find("li").eq(0).clone();
            return this.orgTemplate;
        };
    };
    ANI.prototype.appendList = function() {
        var deffer = $.Deferred();
        var myObj = this;
        HS.httpServer(myObj.url, params, "get").done(function(theData) {
            var data = [];
            if (theData.RESULTMAP !== undefined) {
                var items = theData.RESULTMAP;
                for (var i in items) {
                    var itme = items[i];
                    var content = itme.join("<br/>");
                    data.push({
                        CHANNEL: i,
                        URLTITLE: content
                    });
                }
            } else if(theData.PAGEDLIST!== undefined){
                var items = theData.PAGEDLIST.PAGEITEMS;
                for (var i in items) {
                    var itme = items[i];
                    var content = itme.CONTENT;
                    data.push({
                        CHANNEL: itme.YEAR,
                        URLTITLE: content
                    });
                }
            }else {
                data = theData.PAGEITEMS;
            }
            //this.getList(function(data) {
            var pageItems = data;
            var templateOrg = myObj.getOrgTemplate();
            var templateArray = [];
            for (var i = 0; i < pageItems.length; i++) {
                var _data = pageItems[i];
                var template = templateOrg.clone();
                template.find(".td1").html(_data.CHANNEL);
                template.find(".td2").find("span").html(_data.URLTITLE);
                templateArray.push(template);
            }
            $("#" + myObj.id).find("ul").html(templateArray).find("li").eq(0).addClass("curr_" + myObj.id).show();
            $("#" + myObj.id).find("ul").fadeIn("slow");
            $("#" + myObj.id).find("ul").width(pageItems.length * 1469);
            $("#" + myObj.id).find(".title").find("span").html(pageItems.length);
            /*console.log(data);*/
            //success(myObj);
            //});
            deffer.resolve();
        });
        return deffer;
    };
    ANI.prototype.slideLeft = function() {
        var deffer = $.Deferred();
        var myObj = this;
        setTimeout(function() {
            var $dom = $("#" + myObj.id).find("ul");
            var len = $dom.find("li").length;
            var cls = "curr_" + myObj.id;
            /*if (myObj.curr_idx == len) {
                $dom.fadeOut(myObj.fadeOutSpeed, function() {
                    setTimeout(function() {
                        finish();
                        myObj.appendList();
                        deffer.resolve();
                    }, myObj.stopTime);
                });
            } else {*/
            var CurIndex = $dom.find("." + cls).index();
            privateShowLi($dom, cls, CurIndex, function() {
                CurIndex++;
                setTimeout(function() {
                    $dom.find("." + cls).fadeOut(myObj.fadeOutSpeed, function() {
                        if ($(this).next()[0] === undefined) {
                            myObj.curr_idx = 0;
                            myObj.appendList().then(function() {
                                privateShowLi($dom, cls, CurIndex, function() {
                                    CurIndex = 0;
                                    deffer.resolve();
                                });
                            });
                        } else {
                            $(this).removeClass(cls).next().addClass(cls);
                            privateShowLi($dom, cls, CurIndex, function() {
                                myObj.curr_idx++;
                                //myObj.slideLeft(finish);
                                deffer.resolve();
                            });
                        }
                    });
                }, myObj.fadeOutBeforeTime);
            });
            //}
        }, myObj.stopTime);

        function privateShowLi($dom, cls, CurIndex, finish) {
            privateWetherShow($dom, cls).then(function() {
                var contentParentH = $dom.find(".td2").eq(CurIndex).height();
                var contentParentS = $dom.find(".td2").eq(CurIndex).find("span").height();
                var drop = contentParentS - 130;
                if (drop > 0) {
                    privateWetherScroll($dom, drop, CurIndex).then(function() {
                        if (finish !== undefined) finish();
                    });
                } else {
                    if (finish !== undefined) finish();
                }
            });
            //是否淡入，私有方法
            function privateWetherShow($dom, cls) {
                var deffer = $.Deferred();
                var flag = ($dom.find("." + cls).css("display") !== "none");
                if (flag) {
                    deffer.resolve();
                } else {
                    $dom.find("." + cls).fadeIn(myObj.fadeInSpeed, function() {
                        deffer.resolve();
                    });
                }
                return deffer;
            }
            //是否滚动，私有方法
            function privateWetherScroll($dom, drop, CurIndex) {
                var deffer = $.Deferred();
                if ($dom.find(".td2").find("span").eq(CurIndex).css("top") === "0px") {
                    setTimeout(function() {
                        $dom.find(".td2").find("span").eq(CurIndex).animate({ top: -(drop) + "px" }, (drop / 100) / myObj.slidTopRate, "linear", function() {
                            deffer.resolve();
                        });
                    }, myObj.stopBeforeTime);
                } else {
                    deffer.resolve();
                }
                return deffer;
            }
        }
        return deffer;
    };
    ANI.prototype.start = function() {
        this.appendList(function(myObj) {
            /*myObj.slideLeft(function() {
                myObj.curr_idx = 0;
                myObj.start();
            });*/
        });
    };
})();
