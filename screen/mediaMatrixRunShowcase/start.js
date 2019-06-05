//描述：大屏-媒体矩阵运行展示-启动程序
//时间：2017-2-14
//作者：bai,zhiming
"use strict";
(function() {
    window.httpService.prototype.config = {
        duration: 120000, //定时请求时间为两分钟
    };
    var httpService = new window.httpService();
    var url = "/screen/productMonitor/mediadisplay";
    var urlRenderSwitch = "/screen/productMonitor/getDateDisplayFlg"; //页面渲染开关请求地址，后端告知是否有数据用于渲染前端页面
    var ts, pus, nou;
    init().then(function() {
        setTimeout(function() {
            update();
        }, 10000);
        /*setTimeout(function() {
            update();
        }, window.httpService.prototype.config.duration);*/
    });
    //var myData;
    var updateTimeout;

    function update() {
        getDateDisplay().then(function(data) {
            if (data)
                return updateData();
            else {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(function() {
                    update();
                }, window.httpService.prototype.config.duration);
                return;
            }
        }).then(function() {
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(function() {
                update();
            }, window.httpService.prototype.config.duration);
        });
    }
    //由后端通知是否有新数据用于渲染页面
    var displayTimeout;

    function getDateDisplay() {
        var deffer = $.Deferred();
        httpService.httpServer(urlRenderSwitch).then(function(data) {
            if (data === 1) {
                clearTimeout(displayTimeout);
                displayTimeout = setTimeout(function() {
                    clearData();
                    $('.mediaMatrixRunShowcase_modal').show();
                    deffer.resolve(data !== 1);
                }, 500);
            } else {
                $('.mediaMatrixRunShowcase_modal').hide();
                deffer.resolve(data !== 1);
            }
        }, function() {
            deffer.resolve(true);
        });
        return deffer.promise();
    }
    //清除所有数据
    function clearData() {
        ts.clear();
        nou.clear();
        pus.clear();
    }

    function updateData() {
        var deffer = $.Deferred();
        httpService.httpServer(url).then(function(data) {
            /*myData = myData !== undefined ? myData : { "accessScale": { "todayWebPV": 2419469, "todayAppPV": 618, "yesterdayWebPV": 4594413, "yestodayAppPV": 2846, "yestodayWeixinPV": 1014051 }, "userScale": { "webUser7UV": 15453624, "yesterdayNUV": 0, "webUser7UVAdd": 2360151, "appUser": 11741064, "todayAppUserAdd": 2, "todayWeixinUserUV": 12124669, "todayWeixinUserAdd": -3737, "todayWeiboUserUV": 8543191, "todayWeiboUserAdd": 3151 }, "poductMonitorScale": { "webProductSum": 158, "appProductSum": 15, "weixinProductSum": 248, "weiboProductSum": 74 } };
            myData.accessScale.yesterdayWebPV += 1000000;
            myData.poductMonitorScale.appProductSum += 100;
            data = myData;*/
            ts.update(data.accessScale === undefined ? "" : data.accessScale);
            nou.update(data.userScale === undefined ? "" : data.userScale);
            pus.update(data.poductMonitorScale === undefined ? "" : data.poductMonitorScale);
            deffer.resolve();
            /*setTimeout(function() {
                update();
            }, window.httpService.prototype.config.duration);*/
        }, function(data) {
            ts.update("notUpdate");
            nou.update("notUpdate");
            pus.update("notUpdate");
            deffer.resolve();
            /*setTimeout(function() {
                update();
            }, window.httpService.prototype.config.duration);*/
        });
        return deffer.promise();
    }

    function init() {
        var defer = $.Deferred();
        ts = new TS("", url); //访问规模
        pus = new PUS(""); //产品规模
        nou = new NOU(""); //用户规模
        ts.start(function() {
            pus.start(function() {
                nou.start(function() {
                    getDateDisplay().then(function(isRender) {
                        if (isRender) {
                            httpService.httpServer(url).then(function(data) {
                                ts.update(data.accessScale === undefined ? "" : data.accessScale);
                                nou.update(data.userScale === undefined ? "" : data.userScale);
                                pus.update(data.poductMonitorScale === undefined ? "" : data.poductMonitorScale);
                            }, function() { //获取数据失败的情况
                                ts.update("notUpdate");
                                nou.update("notUpdate");
                                pus.update("notUpdate");
                            });
                        }
                        defer.resolve();
                    });
                });
            });
        });
        return defer.promise();
    }
})();
