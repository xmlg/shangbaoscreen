//描述：大屏-媒体矩阵运行展示-用户规模
//时间：2017-2-11
//作者：bai,zhiming
"use strict";
var NOU;
(function() {
    var httpService = new window.httpService();
    /**
     * [TS description] 用户规模类
     */
    NOU = function(data) {
        this.data = data === "" ? { webUser7UV: 0, webUser7UVAdd: 0, appUser: 0, todayAppUserAdd: 0, todayWeixinUserUV: 0, todayWeixinUserAdd: 0, todayWeiboUserUV: 0, todayWeiboUserAdd: 0 } : data;
        this.duration = 0.4;
        this.appUserInitial = 0;
        this.todayWeiboUserUVInitial = 0;
        this.todayWeixinUserUVInitial = 0;
        this.todayAppUserAddInitial = 0;
        this.todayWeixinUserAddInitial = 0;
        this.todayWeiboUserAddInitial = 0;
        this.titleFadeInSpeed = 400;
        this.moduleShowSpeed = 600;
    };
    /**
     * [setNumberOfUser description] 设置用户规模模块各项数值
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    NOU.prototype.setNumberOfUsers = function() {
        var self = this;
        var total = self.data.appUser + self.data.todayWeiboUserUV + self.data.todayWeixinUserUV;
        var totalInitial = self.appUserInitial + self.todayWeiboUserUVInitial + self.todayWeixinUserUVInitial;
        if (total !== 0) {
            self.totalCountUp = new CountUp("totalUser", totalInitial, total, 0, self.duration);
            self.totalCountUp.start();
        }
        // 用户总量-网站 数据注释
        // self.websiteCountUp = new CountUp("websiteUser", 0, self.data.webUser7UV, 0, self.duration);
        // self.websiteCountUp.start();

        // self.websiteAddCountUp = new CountUp("websiteUserAdd", 0, self.data.webUser7UVAdd, 0, self.duration);
        // self.websiteAddCountUp.start();
        if (self.data.appUser !== 0) {
            self.clientCountUp = new CountUp("clientUser", self.appUserInitial, self.data.appUser, 0, self.duration);
            self.appUserInitial = self.data.appUser;
            self.clientCountUp.start();
        }

        if (self.data.todayAppUserAdd !== 0) {
            self.clientAddCountUp = new CountUp("clientUserAdd", self.todayAppUserAddInitial, self.data.todayAppUserAdd, 0, self.duration);
            self.todayAppUserAddInitial = self.data.todayAppUserAdd;
            self.clientAddCountUp.start();
        }

        if (self.data.todayWeixinUserUV !== 0) {
            self.wechatCountUp = new CountUp("wechatUser", self.todayWeixinUserUVInitial, self.data.todayWeixinUserUV, 0, self.duration);
            self.todayWeixinUserUVInitial = self.data.todayWeixinUserUV;
            self.wechatCountUp.start();
        }

        if (self.data.todayWeixinUserAdd !== 0) {
            self.wechatAddCountUp = new CountUp("wechatUserAdd", self.todayWeixinUserAddInitial, self.data.todayWeixinUserAdd, 0, self.duration);
            self.todayWeixinUserAddInitial = self.data.todayWeixinUserAdd;
            self.wechatAddCountUp.start();
        }

        if (self.data.todayWeiboUserUV !== 0) {
            self.weiboCountUp = new CountUp("weiboUser", self.todayWeiboUserUVInitial, self.data.todayWeiboUserUV, 0, self.duration);
            self.todayWeiboUserUVInitial = self.data.todayWeiboUserUV;
            self.weiboCountUp.start();
        }
        if (self.data.todayWeiboUserAdd !== 0) {
            self.weiboAddCountUp = new CountUp("weiboUserAdd", self.todayWeiboUserAddInitial, self.data.todayWeiboUserAdd, 0, self.duration);
            self.todayWeiboUserAddInitial = self.data.todayWeiboUserAdd;
            self.weiboAddCountUp.start();
        }
    };
    NOU.prototype.fadeInTitle = function() {
        var self = this;
        $(".userTitle").fadeIn(self.titleFadeInSpeed);
    };
    /**
     * [show description] 模块显示
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    NOU.prototype.show = function(callback) {
        var self = this;
        $(".left-buttom").animate({
                width: 2485
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
    NOU.prototype.start = function(callback) {
        var self = this;
        self.show(function() {
            self.fadeInTitle();
            self.setNumberOfUsers();
            if (callback !== undefined) callback();
        });
    };
    /**
     * [update description] 数据更新
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    NOU.prototype.update = function(data) {
        if (data === "notUpdate") return;
        var self = this;
        self.data = data;
        self.setNumberOfUsers();
    };
    /**
     * [clear description] 数据置空
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    NOU.prototype.clear = function() {
        var self = this;
        self.clientCountUp != undefined ? self.clientCountUp.reset() : "";
        $("#clientUser").html("--");
        self.clientAddCountUp != undefined ? self.clientAddCountUp.reset() : "";
        $("#clientUserAdd").html("--");
        self.wechatCountUp != undefined ? self.wechatCountUp.reset() : "";
        $("#wechatUser").html("--");
        self.wechatAddCountUp != undefined ? self.wechatAddCountUp.reset() : "";
        $("#wechatUserAdd").html("--");
        self.weiboCountUp != undefined ? self.weiboCountUp.reset() : "";
        $("#weiboUser").html("--");
        self.weiboAddCountUp != undefined ? self.weiboAddCountUp.reset() : "";
        $("#weiboUserAdd").html("--");
        self.totalCountUp != undefined ? self.totalCountUp.reset() : "";
        $("#totalUser").html("--");
        this.appUserInitial = 0;
        this.todayWeiboUserUVInitial = 0;
        this.todayWeixinUserUVInitial = 0;
        this.todayAppUserAddInitial = 0;
        this.todayWeixinUserAddInitial = 0;
        this.todayWeiboUserAddInitial = 0;
    };
})();
