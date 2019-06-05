/**
 * 描述：媒体矩阵运行计算启动类
 * 作者：bai.zhiming
 * 日期：2017-6-21
 */
'use strict';
define(function(require) {
    function startMM() {
        var self = this;
        var httpService = require('plugIn/httpService');
        var NOU = require('plugIn/numberOfUsers');
        var TS = require('plugIn/trafficScale');
        httpService.prototype.config = {
            duration: 120000, //定时请求时间为两分钟
        };
        self.httpService = new httpService();
        var url = "/screen/productMonitor/mediadisplay";
        var urlRenderSwitch = "/screen/productMonitor/getDateDisplayFlg"; //页面渲染开关请求地址，后端告知是否有数据用于渲染前端页面
        var ts, nou;
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
                    }, self.httpService.config.duration);
                    return;
                }
            }).then(function() {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(function() {
                    update();
                }, self.httpService.config.duration);
            });
        }
        //由后端通知是否有新数据用于渲染页面
        var displayTimeout;

        function getDateDisplay() {
            var deffer = $.Deferred();
            self.httpService.httpServer(urlRenderSwitch).then(function(data) {
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
        }

        function updateData() {
            var deffer = $.Deferred();
            self.httpService.httpServer(url).then(function(data) {
                /*myData = myData !== undefined ? myData : { "accessScale": { "todayWebPV": 2419469, "todayAppPV": 618, "yesterdayWebPV": 4594413, "yestodayAppPV": 2846, "yestodayWeixinPV": 1014051 }, "userScale": { "webUser7UV": 15453624, "yesterdayNUV": 0, "webUser7UVAdd": 2360151, "appUser": 11741064, "todayAppUserAdd": 2, "todayWeixinUserUV": 12124669, "todayWeixinUserAdd": -3737, "todayWeiboUserUV": 8543191, "todayWeiboUserAdd": 3151 }, "poductMonitorScale": { "webProductSum": 158, "appProductSum": 15, "weixinProductSum": 248, "weiboProductSum": 74 } };
                myData.accessScale.yesterdayWebPV += 1000000;
                myData.poductMonitorScale.appProductSum += 100;
                data = myData;*/
                ts.update(data.accessScale === undefined ? "" : data.accessScale);
                nou.update(data.userScale === undefined ? "" : data.userScale);
                deffer.resolve();
                /*setTimeout(function() {
                    update();
                }, window.httpService.prototype.config.duration);*/
            }, function(data) {
                ts.update("notUpdate");
                nou.update("notUpdate");
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
            nou = new NOU(""); //用户规模
            ts.start(function() {
                nou.start(function() {
                    getDateDisplay().then(function(isRender) {
                        if (isRender) {
                            self.httpService.httpServer(url).then(function(data) {
                                ts.update(data.accessScale === undefined ? "" : data.accessScale);
                                nou.update(data.userScale === undefined ? "" : data.userScale);
                            }, function() { //获取数据失败的情况
                                ts.update("notUpdate");
                                nou.update("notUpdate");
                            });
                        }
                        defer.resolve();
                    });
                });
            });
            return defer.promise();
        }
    }
    startMM.constructor = startMM;
    return startMM;
});
