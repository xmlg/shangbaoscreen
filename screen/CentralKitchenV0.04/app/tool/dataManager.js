define(function() {
    function DataManager() {
        this.data = {
            CURTIME: 0
        };
        this.isReady = false;
        this.readyFn = null;
    };

    DataManager.prototype.ready = function(fn) {
        if (this.isReady) {
            fn();
        } else {
            this.readyFn = fn;
        }
    }

    DataManager.prototype.getData = function() {
        if (this.data.CURTIME > 0) {
            return this.data;
        }
    };

    DataManager.prototype.ajax = function(cb) {
        var self = this;
        var url = '/screen/centeralldata/alldata?user_id=admin&department=aa';
        //  var url = 'http://127.0.0.1:3000/test';
        $.getJSON(url, function(data) {
            /*self.ccdata = self.ccdata === undefined ? { "CURTIME": 1487657991845, "JSONPLAN": { "TOTAL": 7707, "BOMB": { "TOTAL": 0, "ONE": 0, "TWO": 0 }, "POLICYNUM": { "TOTAL": 6, "ONE": 1, "TWO": 5 }, "RECENTDISASTERNUM": 16, "HISTORYINTODAY": { "NUM": 106, "CONTENT": "1921年——罗尔斯，美国哲学家、《正义论》作者。", "TYPENAME": "出生人物" }, "HOTREPORT": { "TOTAL": 7471, "ONE": 329, "TWO": 6172, "THREE": 970 }, "TODAYREPORTNUM": 58, "TODAYSELECT": 50, "TODAYTASK": 0, "TODAYNOTICE": 0 }, "JSONCOLLECT": { "TOTAL": 145358, "ORGINAL": { "TOTAL": 68, "ONE": 14, "TWO": 54, "THREE": 0 }, "MATERAILNUM": 0, "XHSNUM": 530, "EMAILNUM": 318, "WEBENTRY": { "TOTAL": 144442, "ONE": 27095, "TWO": 62881, "THREE": 18226, "FOUR": 1514, "FIVE": 34726 } }, "JSONEDIT": { "TOTAL": 1123, "SHAREMANU": { "TOTAL": 36, "ONE": 36, "TWO": 0, "THREE": 0, "FOUR": 0 }, "ORGINALSHARE": 38, "WEBNUM": 174, "XHSNUM": 4, "PRODUCTFINISHED": 87, "WAITAUDIT": { "TOTAL": 15, "ONE": 4, "TWO": 0, "THREE": 1, "FOUR": 0, "FIVE": 10 }, "AUDITED": { "TOTAL": 769, "ONE": 628, "TWO": 0, "THREE": 62, "FOUR": 0, "FIVE": 79 } }, "JSONDISTRIBUTE": { "ENTRYS": [], "TYPECOUNTS": [{ "MEDIANAME": "浙江在线网站", "MEDIATYPE": "网站", "QUANTYPE": "1", "MEDIAID": "176", "TOTAL": 432, "ONE": false }, { "MEDIANAME": "浙江24小时", "MEDIATYPE": "APP", "QUANTYPE": "2", "MEDIAID": "196", "TOTAL": 62, "ONE": true }, { "MEDIANAME": "共产党员杂志社", "MEDIATYPE": "报纸", "QUANTYPE": "2", "MEDIAID": "183", "TOTAL": 15, "ONE": false }, { "MEDIANAME": "浙江法制报", "MEDIATYPE": "网站", "QUANTYPE": "2", "MEDIAID": "186", "TOTAL": 40, "ONE": false }, { "MEDIANAME": "浙江法制报", "MEDIATYPE": "报纸", "QUANTYPE": "2", "MEDIAID": "187", "TOTAL": 0, "ONE": false }, { "MEDIANAME": "浙江日报", "MEDIATYPE": "报纸", "QUANTYPE": "1", "MEDIAID": "175", "TOTAL": 64, "ONE": false }, { "MEDIANAME": "浙江新闻APP", "MEDIATYPE": "APP", "QUANTYPE": "1", "MEDIAID": "179", "TOTAL": 0, "ONE": true }, { "MEDIANAME": "浙江党建网", "MEDIATYPE": "网站", "QUANTYPE": "2", "MEDIAID": "182", "TOTAL": 146, "ONE": true }] }, "LINE": { "LINE1CHANGE": 0, "LINE2CHANGE": 0, "LINE3CHANGE": 0, "LINE4CHANGE": 226 }, "TOPRELEASE": { "DEPTS": [{ "COUNT": 17, "DEPARTMENTID": 138, "DEPARTMENTNAME": "全媒体文化新闻部" }, { "COUNT": 6, "DEPARTMENTID": 136, "DEPARTMENTNAME": "全媒体政治新闻部" }, { "COUNT": 4, "DEPARTMENTID": 140, "DEPARTMENTNAME": "全媒体评论理论部" }, { "COUNT": 2, "DEPARTMENTID": 139, "DEPARTMENTNAME": "全媒体社会与生态新闻部" }, { "COUNT": 1, "DEPARTMENTID": 137, "DEPARTMENTNAME": "全媒体经济新闻部" }], "SUBS": [{ "COUNT": 4, "DEPARTMENTID": 32, "DEPARTMENTNAME": "集团嘉兴分社" }, { "COUNT": 3, "DEPARTMENTID": 28, "DEPARTMENTNAME": "集团杭州分社" }, { "COUNT": 1, "DEPARTMENTID": 37, "DEPARTMENTNAME": "集团衢州分社" }, { "COUNT": 1, "DEPARTMENTID": 29, "DEPARTMENTNAME": "集团宁波分社" }] }, "THREEDISTRIBUTE": { "CONTENT": { "TOTAL": 0, "ONE": 48, "TWO": 2, "THREE": 496, "FOUR": 263, "FIVE": 0 } }, "CENTER": { "CENTERDATAS": [] } } : self.data;
            self.ccdata.JSONPLAN.TODAYNOTICE += 5;
            self.ccdata.JSONPLAN.TODAYNOTICE = self.ccdata.JSONPLAN.TODAYNOTICE>15000000?15000000:self.ccdata.JSONPLAN.TODAYNOTICE;
            data = self.ccdata;*/
            centerAllDataApp().then(function(_data) {
                centerAllDataAppPublish().then(function(__data) {
                    data = self.handleToprelease(data);
                    if (data.CURTIME > self.data.CURTIME) {
                        self.data = data;
                    }
                    self.data.zjxwApp = _data.zjnewsAuditwaitCnt;
                    self.data.zjxwAppPub = __data.zjnewsPublishedCnt;
                    if (!self.isReady) {
                        self.isReady = true;
                        self.readyFn && self.readyFn();
                    }
                    cb && cb();
                });
            });
        });
        //获取浙江新闻客户端待编稿件量
        function centerAllDataApp() {
            var self = this;
            var defer = $.Deferred();
            $.ajax({
                url: "/screen/centeralldataapp/auditwait",
                method: "get",
                dataType: "json",
                success: function(data) {
                    defer.resolve(data);
                },
                error: function() {
                    defer.resolve({ zjnewsAuditwaitCnt: 0 });
                }
            });
            return defer.promise();
        }
        //获取浙江新闻客户端已发稿件量
        function centerAllDataAppPublish() {
            var self = this;
            var defer = $.Deferred();
            $.ajax({
                url: "/screen/centeralldataapp/published",
                method: "get",
                dataType: "json",
                success: function(data) {
                    defer.resolve(data);
                },
                error: function() {
                    defer.resolve({ zjnewsAuditwaitCnt: 0 });
                }
            });
            return defer.promise();
        }
    };

    //处理原创稿件分社排行榜数据显示
    DataManager.prototype.handleToprelease = function(data) {
        for (var i = 0; i < data.TOPRELEASE.DEPTS.length; i++) {
            var item = data.TOPRELEASE.DEPTS[i];
            if (item.DEPARTMENTNAME.length > 8) {
                item.DEPARTMENTNAME = item.DEPARTMENTNAME.substring(0, 8) + "…";
            }
        }
        for (var j = 0; j < data.TOPRELEASE.SUBS.length; j++) {
            var item_ = data.TOPRELEASE.SUBS[j];
            if (item_.DEPARTMENTNAME.length > 8) {
                item_.DEPARTMENTNAME = item_.DEPARTMENTNAME.substring(0, 8) + "…";
            }
        }
        return data;
    };
    DataManager.prototype.start = function() {
        var self = this;
        self.ajax();
        window.setInterval(function() {
            self.ajax();
        }, 3 * 1000)
    }
    var dataManager = new DataManager();
    dataManager.start();
    return dataManager;
})
