//描述：大屏-媒体矩阵运行展示-logo云
//时间：2017-2-15
//作者：bai,zhiming
"use strict";
var PLC;
(function() {
    /**
     * [PLC description] logo云类
     */
    PLC = function(domId, scatteringTime) {
        this.$parentDom = $("#" + domId);
        this.scatteringTime = scatteringTime;
        this.$zjrb = $("<img src='images/szdsb.jpg' style='z-index:8;position:absolute;top:400px;left:450px'>").data("position", { top: 190, left: 509 });
        this.$zjxw = $("<img src='images/szsb.png' style='z-index:7;position:absolute;top:400px;left:450px'>").data("position", { top: 401, left: 121 });
        this.$zjzx = $("<img src='images/sztqb.jpg' style='z-index:6;position:absolute;top:400px;left:450px'>").data("position", { top: 556, left: 497 });
        this.$zjsp = $("<img src='images/szwb.jpg' style='z-index:5;position:absolute;top:400px;left:450px'>").data("position", { top: 444, left: 875 });
        this.$zjsjb = $("<img src='images/szxww.jpg' style='z-index:4;position:absolute;top:400px;left:450px'>").data("position", { top: 709, left: 239 });
        this.$wx = $("<img src='images/wx.png' style='z-index:3;position:absolute;top:400px;left:450px'>").data("position", { top: 274, left: 292 });
        this.$wb = $("<img src='images/wb.png' style='z-index:2;position:absolute;top:400px;left:450px'>").data("position", { top: 718, left: 931 });
        this.imgArray = [this.$zjrb, this.$zjxw, this.$zjzx, this.$zjsp, this.$zjsjb, this.$wx, this.$wb];
        this.$parentDom.append(this.imgArray);
        //this.$parentDom.append("<div style='position:absolute;opacity:1;z-index:1;width:1288px;height:120px;top:0px;background-color:linear-gradient(#0D212B, #060C18)'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:1;z-index:1;width:1288px;height:360px;top:98px;background-image: linear-gradient(to top, rgba(13,33,43,0), rgba(13,33,43,1));'></div>");
        /*this.$parentDom.append("<div style='position:absolute;opacity:0.9;z-index:1;width:1288px;height:40px;top:120px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.8;z-index:1;width:1288px;height:40px;top:160px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.7;z-index:1;width:1288px;height:40px;top:200px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.6;z-index:1;width:1288px;height:40px;top:240px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.5;z-index:1;width:1288px;height:40px;top:280px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.4;z-index:1;width:1288px;height:40px;top:320px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.3;z-index:1;width:1288px;height:40px;top:360px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.2;z-index:1;width:1288px;height:40px;top:400px;background-color:#060C18;'></div>");
        this.$parentDom.append("<div style='position:absolute;opacity:0.1;z-index:1;width:1288px;height:40px;top:440px;background-color:#060C18;'></div>");*/
        this.$parentDom.append("<video src='images/galaxy.mov' loop muted autoplay style='z-index:0;position:absolute;top:100px;width:2508px;border-bottom-left-radius: 20px;opacity:0.5;'></video>");
        this.shakeingMaxOffset = 40;
        this.maxSingleShakeTime = 4000;
        this.minSingleShakeTime = 3000;
    };
    /**
     * [scattering description] 发射Logo;
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PLC.prototype.scattering = function() {
        var self = this;
        var defer = $.Deferred();
        var flag = true;
        for (var i = 0; i < self.imgArray.length; i++) {
            self.imgArray[i].animate({
                top: self.imgArray[i].data("position").top,
                left: self.imgArray[i].data("position").left
            }, self.scatteringTime, function() {
                if (flag) {
                    flag = false;
                    defer.resolve();
                }
            });
        }
        return defer.promise();
    };
    /**
     * [start description] 启动
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PLC.prototype.start = function() {
        var self = this;
        self.scattering().then(function() {
            for (var i = 0; i < self.imgArray.length; i++) {
                self.shaking(self.imgArray[i]);
            }
        });
    };
    /**
     * [shaking description] logo晃动
     * @param {[]}   [description] 
     * @return {[null]} [description] 
     */
    PLC.prototype.shaking = function($dom) {
        var self = this;
        var index = Math.floor((Math.random() * self.moveWay().length));
        var position = self.moveWay()[index];
        var top1 = parseInt($dom.css("top").replace("px", "")) + position.top;
        var left1 = parseInt($dom.css("left").replace("px", "")) + position.left;
        var speed = Math.floor(self.maxSingleShakeTime * Math.random()) / 2;
        speed = speed < self.minSingleShakeTime ? self.minSingleShakeTime : speed;
        $dom.animate({
                top: top1,
                left: left1
            },
            speed,
            function() {
                $dom.animate({
                        top: $dom.data("position").top,
                        left: $dom.data("position").left
                    },
                    speed,
                    function() {
                        self.shaking($dom);
                    });
            });
    };
    /**
     * [horizontal description] 移动方式
     */
    PLC.prototype.moveWay = function() {
        var self = this;
        var shakeOffset = Math.floor(Math.random() * self.shakeingMaxOffset);
        return [{ //左移
            left: -shakeOffset,
            top: 0
        }, { //右移
            left: shakeOffset,
            top: 0
        }, { //上移
            left: 0,
            top: -shakeOffset
        }, { //下移
            left: 0,
            top: shakeOffset
        }, { //左上
            left: -Math.sqrt(Math.pow(shakeOffset, 2) / 2),
            top: -Math.sqrt(Math.pow(shakeOffset, 2) / 2)
        }, { //右上
            left: Math.sqrt(Math.pow(shakeOffset, 2) / 2),
            top: -Math.sqrt(Math.pow(shakeOffset, 2) / 2)
        }, { //左下
            left: -Math.sqrt(Math.pow(shakeOffset, 2) / 2),
            top: Math.sqrt(Math.pow(shakeOffset, 2) / 2)
        }, { //右下
            left: Math.sqrt(Math.pow(shakeOffset, 2) / 2),
            top: Math.sqrt(Math.pow(shakeOffset, 2) / 2)
        }];
    };
})();
