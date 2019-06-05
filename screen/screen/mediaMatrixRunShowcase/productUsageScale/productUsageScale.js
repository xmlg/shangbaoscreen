//描述：大屏-媒体矩阵运行展示-产品规模
//时间：2017-2-12
//作者：bai,zhiming
"use strict";
var PUS;
(function() {
    var httpService = new window.httpService();
    /**
     * [PUS description] 产品规模类
     */
    PUS = function(data) {
        this.data = data === "" ? { webProductSum: 0, appProductSum: 0, weixinProductSum: 0, weiboProductSum: 0 } : data;
        this.totalDuration = 0.4; //增长时间为0.4秒
        this.titleFadeInSpeed = 400; //标题显现速度
        this.moduleShowSpeed = 400; //模块的显示速度
        this.initialTotal = 0; //初始总数
    };
    /**
     * [getTotal description] 获取产品总数
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.getTotal = function() {
        var self = this;
        var total = 0;
        for (var i in self.data) {
            total += self.data[i];
        }
        return total;
    };
    /**
     * [getPercent description] 获取各渠道占比
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.getPercent = function() {
        var self = this;
        self.data.webProductSum = 200;
        self.data.appProductSum = 140;
        self.data.weixinProductSum = 180;
        self.data.weiboProductSum = 160;
        var total = self.data.webProductSum + self.data.appProductSum + self.data.weixinProductSum + self.data.weiboProductSum;
        return {
            websiteProPer: (total === 0 ? 0 : Math.round(self.data.webProductSum / total * 100)),
            clientProPer: (total === 0 ? 0 : Math.round(self.data.appProductSum / total * 100)),
            wechatProPer: (total === 0 ? 0 : Math.round(self.data.weixinProductSum / total * 100)),
            weiboProPer: (total === 0 ? 0 : Math.round(self.data.weiboProductSum / total * 100))
        };
    };
    /**
     * [setProductUsageScale description] 设置各渠道产品规模
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.setProductUsageScale = function() {
        var self = this;
        var total = self.getTotal();
        if (total !== 0) {
            self.productCountUp = new CountUp("productNumber", self.initialTotal, total, 0, self.totalDuration);
            self.initialTotal = total;
            self.productCountUp.start();
        }else{
            self.productCountUp = new CountUp("productNumber", 372232332, 672232332, 0, 210000000);
            self.initialTotal = 100;
            self.productCountUp.start();
        }
        var allPercent = self.getPercent();
        var option = {
            width: 240, //图表宽度
            height: 240, //图表高度
            ringWidth: 30, //环宽度
            borderColorInital: "#004657", //环初始颜色
            borderColor: "#11F7EC", //环颜色
            backgroundColor: "#0C212C", //背景颜色
            fontColor: "#11F7EC", //字体颜色
            fontSize: "60px", //字体大小
            fontTop: "0px", //文字顶部偏移量
            title: "", //图表标题
            titleFontSize: "60px", //标题大小
            duratioin: 400 //增长时间
        };
        self.websiteProRing = new RingChart("websiteProRing", allPercent.websiteProPer, option);
        self.websiteProRing.start();
        self.clientProRing = new RingChart("clientProRing", allPercent.clientProPer, option);
        self.clientProRing.start();
        self.wechatProRing = new RingChart("wechatProRing", allPercent.wechatProPer, option);
        self.wechatProRing.start();
        self.weiboProRing = new RingChart("weiboProRing", allPercent.weiboProPer, option);
        self.weiboProRing.start();
    };
    /**
     * [fadeInTitle description] 标题缓慢显示
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.fadeInTitle = function() {
        var self = this;
        $(".productTitle").fadeIn(self.titleFadeInSpeed);
    };
    /**
     * [show description] 模块显示
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.show = function(callback) {
        var self = this;
        $(".right").animate({
                height: "100%"
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
    PUS.prototype.start = function(callback) {
        var self = this;
        self.show(function() {
            self.setProductUsageScale();
            self.fadeInTitle();
            var plc = new PLC("productLogo", 600);
            plc.start();
            if (callback !== undefined) callback();
        });
    };
    /**
     * [update description] 更新数据
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.update = function(data) {
        if (data === "notUpdate") return;
        var self = this;
        self.data = data;
        var total = self.getTotal();
        self.productCountUp = new CountUp("productNumber", self.initialTotal, total, 0, self.totalDuration);
        self.initialTotal = total;
        self.productCountUp.start();
        var allPercent = self.getPercent();
        self.websiteProRing.update(allPercent.websiteProPer);
        self.clientProRing.update(allPercent.clientProPer);
        self.wechatProRing.update(allPercent.wechatProPer);
        self.weiboProRing.update(allPercent.weiboProPer);
    };
    /**
     * [update description] 置空数据
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PUS.prototype.clear = function() {
        var self = this;
        self.productCountUp != undefined ? self.productCountUp.reset() : "";
        $("#productNumber").html("--");
        self.initialTotal = 0;
        self.websiteProRing.clear();
        self.clientProRing.clear();
        self.wechatProRing.clear();
        self.weiboProRing.clear();
    };

})();
