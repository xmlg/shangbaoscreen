/**
 * *描述：共享稿件取用率
 * 作者：bai.zhiming
 * 日期：2017-6-21
 */
define(function(require) {
    var dataManager = require('tool/dataManager');
    var DashBoard = require('plugIn/dashBoard');
    var Component = require('components/Component');

    function ShareRate(parent, top, left) {
        Component.call(this, parent, 1000, 2400);
        this.chartG = this.snapElement.g();
        this.$element = $("#dashBoard");
        this.$element.css({
            top: top,
            left: left
        });
    }
    ShareRate.prototype = Object.create(Component.prototype);
    ShareRate.prototype.init = function() {
        var self = this;
        var g = self.chartG.g();
        self.$element = $("#dashBoard");
        self.dashBoard = new DashBoard("dashBoard");
        self.dashBoard.start(0);
        self.$element.fadeIn("slow");
        var path1 = g.path('M0,0,88,0,171,82').attr({
            stroke: '#36C6D8',
            class: 'myPath',
            fill: 'none',
            'troke-width': "2",
            opacity: 1
        });
        var path2 = g.path('M0,2,21,1').attr({
            stroke: '#36C6D8',
            class: "myPath",
            fill: 'none',
            'troke-width': "4",
            opacity: 1
        });
    };
    ShareRate.prototype.update = function() {
        var self = this;
        var ORGINALSHARE = dataManager.getData().JSONEDIT.ORGINALSHARE;
        var SHAREMANU = dataManager.getData().JSONEDIT.SHAREMANU.TOTAL;
        var newValue = ORGINALSHARE / SHAREMANU;
        newValue = isNaN(newValue) ? 0 : newValue;
        /*newValue = newValue >= 1 ? 0.91 : newValue;*/
        newValue = newValue >= 1 ? 1 : newValue;
        self.dashBoard.start(newValue);
    };
    ShareRate.constructor = ShareRate;
    return ShareRate;
});
