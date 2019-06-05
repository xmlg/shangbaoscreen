//描述：大屏-媒体矩阵运行展示-访问规模
//时间：2017-2-11
//作者：bai,zhiming
"use strict";
var TS;
(function() {
    var httpService = new window.httpService();
    /**
     * [TS description] 访问规模类
     */
    TS = function(data, url) {
        this.data = data === "" ? { todayWebPV: 0, todayAppPV: 0, yesterdayWebPV: 0, yestodayAppPV: 0, yestodayWeixinPV: 0 } : data;
        this.url = url;
        this.totalInitialValue = 0; //合计初始值
        this.websiteInitialValue = 0; //网站初始值
        this.clientInitialValue = 0; //客户端初始值
        this.yesterdayWebPVInitial = 0; //昨日桌面场景初始值
        this.yestodayAppPVInitial = 0; //昨日移动场景初始值
        this.yestodayWeixinPVInitial = 0; //昨日微信客户端初始值
        this.duration = httpService.config.duration / 1000; //增长时间为两分钟
        this.titleFadeInSpeed = 400; //标题显出速度
        this.yesterdayTrafficDuration = 0.4; //昨日访问量增长时间
        this.moduleShowSpeed = 400; //模块的显示速度
    };


    /**
     * [setRealTimeTraffic description] 设置实时访问量
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.setRealTimeTraffic = function(finish) {
        var self = this;
        var isInitial = self.websiteInitialValue === 0; //判断是否是初始化，初始化时，直接已最快时间赋值
        self.websiteInitialValue = isInitial ? self.data.todayWebPV : self.websiteInitialValue;
        self.clientInitialValue = isInitial ? self.data.todayAppPV : self.clientInitialValue;
        self.totalInitialValue = isInitial ? (self.data.todayWebPV + self.data.todayAppPV) : self.totalInitialValue;
        if (self.data.todayWebPV !== 0) {
            self.websiteCountUp = new MyCountup("trafficWebsite", self.websiteInitialValue, self.data.todayWebPV, 0, (isInitial ? 0.1 : self.duration));
            self.websiteInitialValue = self.data.todayWebPV;
            self.websiteCountUp.start();
        }
        if (self.data.todayAppPV !== 0) {
            self.clientCountUp = new MyCountup("trafficClient", self.clientInitialValue, self.data.todayAppPV, 0, (isInitial ? 0.1 : self.duration));
            self.clientInitialValue = self.data.todayAppPV;
            self.clientCountUp.start();
        }
        var total = self.data.todayWebPV + self.data.todayAppPV;
        if (total !== 0) {
            self.totalCountUp = new MyCountup("trafficTotal", self.totalInitialValue, total, 0, (isInitial ? 0.1 : self.duration));
            self.totalInitialValue = total;
            self.totalCountUp.start(
                function() {
                    if (typeof finish === "function") finish();
                }
            );
        } else {
            if (typeof finish === "function") finish();
        }

    };
    /**
     * [requestData description] 重新请求数据U
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.requestData = function() {
        var self = this;
        var defer = $.Deferred();
        httpService.httpServer(self.url).then(function(data) {
            self.data = data.accessScale === undefined ? { todayWebPV: 0, todayAppPV: 0, yesterdayWebPV: 0, yestodayAppPV: 0, yestodayWeixinPV: 0 } : data.accessScale;
            defer.resolve();
        });
        return defer.promise();
    };
    /**
     * [fadeInTitle description] 标题缓慢显示
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.fadeInTitle = function() {
        var self = this;
        $(".trafficHeader").fadeIn(self.titleFadeInSpeed);
    };
    /**
     * [setYesterdayTraffic description] 昨日访问量设置
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.setYesterdayTraffic = function() {
        var self = this;
        self.trafficTotal = new CountUp("trafficTotal", 372232332, 672232332, 0, 210000000);
        self.trafficTotal.start();
        self.totalUser = new CountUp("totalUser", 100200200, 200200200, 0, 2100000000);
        self.totalUser.start();
        // self.trafficTotal = new CountUp("trafficTotal", 0, 672232332, 0, 21000);
        // self.trafficTotal.start();
        var total = self.data.yesterdayWebPV + self.data.yestodayAppPV + self.data.yestodayWeixinPV;
        self.yesterdayWebPVInitial = self.data.yesterdayWebPV;
        self.yestodayAppPVInitial = self.data.yestodayAppPV;
        self.yestodayWeixinPVInitial = self.data.yestodayWeixinPV;
        if (total !== 0) {
            self.yesterdayTotalCountUp = new CountUp("yesterdayTrafficTotal", 132798, 232798, 0, 2100000);
            self.yesterdayTotalCountUp.start();
        }else{
            self.yesterdayTotalCountUp = new CountUp("yesterdayTrafficTotal", 132789, 232789, 0, 2100000);
            self.yesterdayTotalCountUp.start();
        }
        var websitePercentage = 100 === 0 ? 0 : Math.round((70 / 100) * 100);
        var mobilePercentage = 100 === 0 ? 0 : Math.round(((30) / 100) * 100);
        var option = {
            width: 430, //图表宽度
            height: 430, //图表高度
            ringWidth: 30, //环宽度
            borderColorInital: "#004657", //环初始颜色
            borderColor: "#11F7EC", //环颜色
            backgroundColor: "#0C212C", //背景颜色
            fontColor: "#11F7EC", //字体颜色
            fontSize: "109px", //字体大小
            fontTop: "62px", //文字顶部偏移量
            title: "安卓", //图表标题
            titleFontSize: "60px", //标题大小
            duratioin: 400 //增长时间
        };
        // self.websiteRing = new RingChart("yesterdayWebsite", 80, option);
        // self.websiteRing.start();
        option.title = "IOS";
        self.mobileRing = new RingChart("yesterdayMobile", 20, option);
        self.mobileRing.start();
    };
    /**
     * [setYesterdayTraffic description] 更新昨日访问量设置
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.updateYesterdayTraffic = function() {
        var self = this;
        var totalInitial = self.yesterdayWebPVInitial + self.yestodayAppPVInitial + self.yestodayWeixinPVInitial;
        var total = self.data.yesterdayWebPV + self.data.yestodayAppPV + self.data.yestodayWeixinPV;
        self.yesterdayWebPVInitial = self.data.yesterdayWebPV;
        self.yestodayAppPVInitial = self.data.yestodayAppPV;
        self.yestodayWeixinPVInitial = self.data.yestodayWeixinPV;
        self.yesterdayTotalCountUp = new CountUp("yesterdayTrafficTotal", 10, 232789, 12, 21);
        self.yesterdayTotalCountUp.start();
        var websitePercentage = total === 0 ? 0 : Math.round((self.data.yesterdayWebPV / total) * 100);
        self.websiteRing.update(websitePercentage);
        var mobilePercentage = total === 0 ? 0 : Math.round(((self.data.yestodayAppPV + self.data.yestodayWeixinPV) / total) * 100);
        self.mobileRing.update(mobilePercentage);
    };
    /**
     * [show description] 显示模块
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.show = function(callback) {
        var self = this;
        $(".mainModule_right_parent").animate({ //右边模块
                width: 1240
            },
            self.moduleShowSpeed);
        $(".mainModule_parent").animate({ //左边模块
                width: 1240
            },
            self.moduleShowSpeed);
        $(".header_parent").animate({ //顶部标题
                width: 2440
            },
            self.moduleShowSpeed,
            function() {
                callback();
            });
    };
    /**
     * [start description] 启动
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.start = function(callback) {
        var self = this;
        self.show(function() {
            self.fadeInTitle();
            self.setRealTimeTraffic(function() {});
            self.setYesterdayTraffic();
            if (callback !== undefined) callback();
        });
    };
    /**
     * [update description] 更新数据
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.update = function(data) {
        if (data === "notUpdate") return;
        var self = this;
        self.data = data;
        self.setRealTimeTraffic();
        self.updateYesterdayTraffic();
    };
    /**
     * [clear description] 置空数据
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    TS.prototype.clear = function(data) {
        var self = this;
        self.totalCountUp != undefined ? self.totalCountUp.reset() : "";
        $("#trafficTotal").html("--");
        self.websiteCountUp != undefined ? self.websiteCountUp.reset() : "";
        $("#trafficWebsite").html("--");
        self.clientCountUp != undefined ? self.clientCountUp.reset() : "";
        $("#trafficClient").html("--");
        self.yesterdayTotalCountUp != undefined ? self.yesterdayTotalCountUp.reset() : "";
        $("#yesterdayTrafficTotal").html("--");
        self.totalInitialValue = 0; //合计初始值
        self.websiteInitialValue = 0; //网站初始值
        self.clientInitialValue = 0; //客户端初始值
        self.yesterdayWebPVInitial = 0; //昨日桌面场景初始值
        self.yestodayAppPVInitial = 0; //昨日移动场景初始值
        self.yestodayWeixinPVInitial = 0; //昨日微信客户端初始值
        self.websiteRing.clear();
        self.mobileRing.clear();
    };
})();
