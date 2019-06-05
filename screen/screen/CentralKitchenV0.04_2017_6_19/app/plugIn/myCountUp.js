//描述：数字增长插件  
//时间：2017-4-13
//作者：bai,zhiming
"use strict";
define(function(require) {
    /**
     * [MyCountup description] 访问规模类
     * @param {string} [id] [description] 需要挂载数字增长的dom节点
     * @param {int} [startVal] [description] 起始数字
     * @param {int} [endVal] [description] 结束数字
     * @param {int} [decimals] [description] 小数
     * @param {int} [duration] [description] 数字增长所需要的时间区间,单位是秒
     * @param {object} [options] [description] 配置项 useEasing   useGrouping  separator  decimal  prefix  suffix 
     * @param {int} [splitNum] [description] 拆分数量
     */
    function MyCountup(id, startVal, endVal, decimals, duration, option, splitNum) {
        var self = this;
        this.id = id;
        this.startVal = startVal;
        this.endVal = endVal;
        this.decimals = decimals;
        this.duration = duration;
        this.option = option;
        this.splitNum = splitNum = 60;
        this.countupValueArray = self.equalization(startVal, endVal, splitNum);
        this.timeValueArray = self.equalization(0, duration * 1000, splitNum); //数字增长区间数组
        this.timeValueArray = (function() { //时间区间数组
            for (var i = 0; i < self.timeValueArray.length; i++) {
                self.timeValueArray[i] = self.timeValueArray[i] / 1000;
            }
            return self.timeValueArray;
        })();
    };
    MyCountup.prototype.start = function() {
        var self = this;
        var i = 0;
        if (self.countupValueArray.length !== 0) {
            myCountupFn();
        } else {
            self.countup = new CountUp(self.id, self.startVal, self.endVal, 0, self.duration * Math.random());
            self.countup.start();
        }

        function myCountupFn() {
            var countUpValue = self.countupValueArray[i];
            var duration = i === 0 ? self.timeValueArray[i] : (self.timeValueArray[i] - self.timeValueArray[i - 1]);
            if (countUpValue) {
                var startVal = i === 0 ? self.startVal : self.countupValueArray[i - 1];
                var endVal = countUpValue;
                if (startVal <= endVal) { //处理增长回退bug 允许极端情况下的微小误差
                    self.countup = new CountUp(self.id, startVal, endVal, 0, duration * Math.random());
                    self.countup.start();
                }
            }
            i++;
            if (i === self.timeValueArray.length) return;
            setTimeout(function() {
                myCountupFn();
            }, duration * 1000);
        }
    };
    MyCountup.prototype.reset = function() {
        var self = this;
        self.countup.reset();
    };
    /**
     * [randFloatAliq description] 随机浮动等分
     * @param {string} [id] [description] 需要挂载数字增长的dom节点
     * @param {int} [startVal] [description] 起始数字
     * @param {int} [endVal] [description] 结束数字
     * @param {int} [splitNum] [description] 拆分数量
     */
    MyCountup.prototype.randFloatAliq = function(startVal, endVal, splitNum) {
        var difference = endVal - startVal;
        var array = [],
            myValue = startVal; //数字增长队列
        if (splitNum >= difference) { //当拆分数量大于或等于差值时，等分，每份都是1.
            splitNum = difference;
            for (var i = 0; i < splitNum; i++) {
                array.push(++myValue);
            }
        } else { //当拆分数量小于差值时，随机等分，上下浮动本身的50%之内，分不完的全部分配给最后一个元素
            for (var i = 0; i < splitNum; i++) {
                if (i !== (splitNum - 1)) {
                    var percent = 1 / splitNum;
                    var randomPosandNeg = Math.floor(2 * Math.random()); //随机正负浮动 0代表负，1代表正
                    var floatValue = Math.ceil(51 * Math.random()) / 100;
                    var splitValue = difference * percent;
                    if (randomPosandNeg === 0)
                        splitValue -= (splitValue * floatValue);
                    else
                        splitValue += (splitValue * floatValue);
                    myValue += Math.round(splitValue);
                } else {
                    myValue = endVal;
                }
                array.push(myValue);
            }
        }
        return array;
    };
    /**
     * [equalization description] 数值均分
     * @param {string} [id] [description] 需要挂载数字增长的dom节点
     * @param {int} [startVal] [description] 起始数字
     * @param {int} [endVal] [description] 结束数字
     * @param {int} [splitNum] [description] 拆分数量
     */
    MyCountup.prototype.equalization = function(startVal, endVal, splitNum) {
        var difference = endVal - startVal;
        var array = [],
            myValue = startVal; //数字增长队列
        if (splitNum >= difference) { //当拆分数量大于或等于差值时，等分，每份都是1.
            splitNum = difference;
            for (var i = 0; i < splitNum; i++) {
                array.push(++myValue);
            }
        } else { //当拆分数量小于差值时，随机等分，上下浮动本身的50%之内，分不完的全部分配给最后一个元素
            for (var i = 0; i < splitNum; i++) {
                if (i !== (splitNum - 1)) {
                    var percent = 1 / splitNum;
                    var splitValue = difference * percent;
                    myValue += Math.round(splitValue);
                } else {
                    myValue = endVal;
                }
                array.push(myValue);
            }
        }
        return array;
    };
    MyCountup.constructor = MyCountup;
    return MyCountup;
});
