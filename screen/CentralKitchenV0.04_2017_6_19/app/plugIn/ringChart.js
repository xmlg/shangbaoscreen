define(function(require) {
    /**
     * [RingChart description] 环形图
     */
    RingChart = function(id, value, option) {
        var $parentDom = $("#" + id);
        this.value = value;
        this.option = option;
        this.ringChart = $('<div class="ringchart-wrap"><div class="ringchart-circle">' +
            '<div class="ringchart-percent ringchart-left"></div>' +
            '<div class="ringchart-percent ringchart-right ringchart-wth0"></div>' +
            '</div>' +
            '<div class="ringchart-num"><p class="num"><span>0</span><span>%</span></p><p class="text"></p></div></div>');
        this.ringChart.css({ width: option.width, height: option.height, "background-color": option.borderColorInital });
        this.ringChart.find(".ringchart-circle").css({ width: option.width, height: option.height, "clip": "rect(0," + option.width + "px," + option.height + "px," + option.width / 2 + "px)", "border-color": option.borderColorInital });
        this.ringChart.find(".ringchart-percent").css({ width: option.width, height: option.height });
        this.ringChart.find(".ringchart-num").css({
            width: option.width - (option.ringWidth * 2),
            height: option.height - (option.ringWidth * 2),
            top: option.ringWidth,
            left: option.ringWidth
        });
        //self.ringChart.find(".ringchart-circle").css("clip", "rect(0," + option.width + "," + option.height + "," + option.width / 2 + ")");
        this.ringChart.find(".ringchart-left").css({ "clip": "rect(0," + option.width / 2 + "px," + option.height + "px,0)", "border": option.ringWidth + "px solid " + option.borderColor });
        this.ringChart.find(".ringchart-right").css({ "clip": "rect(0," + option.width + "px," + option.height + "px," + option.width / 2 + "px)", "border": option.ringWidth + "px solid " + option.borderColor });
        this.ringChart.find(".ringchart-num").css({ "background-color": option.backgroundColor, "color": option.fontColor, "font-size": option.fontSize, "padding-top": option.fontTop });
        this.ringChart.find(".ringchart-num").find("p").eq(1).text(option.title).css({ "font-size": option.titleFontSize, "line-height": "45px" });
        $parentDom.css("position", "relative").append(this.ringChart);
    };
    RingChart.prototype.start = function() {
        var self = this;
        if (self.value === 0) return;
        var percent = 0;
        var speed = self.option.duratioin / self.value;
        var loading = setInterval(function() {
            self.ringUpdate(percent);
            if (percent === self.value) {
                clearInterval(loading);
            }
            percent++;
        }, speed);
    };
    //环图改变效果判断
    RingChart.prototype.ringUpdate = function(percent) {
        var self = this;
        if (percent > 100 || percent === 0) {
            percent = 0;
            self.ringChart.find('.ringchart-circle').removeClass('ringchart-clip-auto');
            self.ringChart.find('.ringchart-right').addClass('ringchart-wth0');
        } else if (percent > 50) {
            self.ringChart.find('.ringchart-circle').addClass('ringchart-clip-auto');
            self.ringChart.find('.ringchart-right').removeClass('ringchart-wth0');
        }
        self.ringChart.find('.ringchart-left').css("-webkit-transform", "rotate(" + (18 / 5) * percent + "deg)");
        self.ringChart.find('.ringchart-num>p>span').eq(0).text(percent);
        self.ringChart.find('.ringchart-num>p>span').eq(1).text("%");
    };
    //环图数据清空
    RingChart.prototype.clear = function(percent) {
        var self = this;
        self.ringUpdate(0);
        self.ringChart.find('.ringchart-num>p>span').eq(0).text("-");
        self.ringChart.find('.ringchart-num>p>span').eq(1).text("-");
    };
    //图表更新
    RingChart.prototype.update = function(updateValue) {
        var self = this;
        self.value = updateValue;
        if (self.value === 0) return;
        var speed = self.option.duratioin / self.value;
        var loading = setInterval(function() {
            self.ringUpdate(self.value);
            if (self.value === updateValue) {
                clearInterval(loading);
            }
            if (self.value > updateValue) self.value--;
            else if (self.value < updateValue) self.value++;
        }, speed);
    };
    RingChart.constructor = RingChart;
    var option = {
        width: 430, //图表宽度
        height: 430, //图表高度
        ringWidth: 30, //环宽度
        borderColorInital: "#004657", //环初始颜色
        borderColor: "#00B7F8", //环颜色
        backgroundColor: "#0C212C", //背景颜色
        fontColor: "#00FBEE", //字体颜色
        fontSize: "109px", //字体大小
        fontTop: "62px", //文字顶部偏移量
        title: "网站", //图表标题
        titleFontSize: "60px", //标题大小
        duratioin: 4000 //增长时间
    };
    /*var ringChart = new RingChart("yesterdayWebsite", 0.9, option);
    ringChart.start();*/
    return RingChart;
});
