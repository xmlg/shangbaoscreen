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
            data = self.handleToprelease(data);
            if (data.CURTIME > self.data.CURTIME) {
                self.data = data;
            }
            if (!self.isReady) {
                self.isReady = true;
                self.readyFn && self.readyFn();
            }
            cb && cb();
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
