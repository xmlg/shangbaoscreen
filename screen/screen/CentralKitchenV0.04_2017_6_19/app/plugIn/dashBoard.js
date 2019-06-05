/**
 * 描述：仪表盘
 * 作者：bai.zhiming
 * 日期：2017-6-24
 */
"use strict";
define(function(require) {
    function DashBoard(id) {
        var self = this;
        self.template = ['<div class="dashBoard">',
            '<img class="circle1" src="img/dashboard1.png">',
            '<img class="semicircleMask" src="img/dashboard2.png">',
            '<img class="circle2" src="img/dashboard3.png">',
            '<img class="hand" src="img/dashboard4.png">',
            '</div>',
            '<div class="percentNum"><span id="percentNum">0</span>%</div>',
            '<div class="title">共享稿取用率</div>',
        ].join("");
        self.$element = $("#" + id);
        self.$element.append(self.template);
    }
    DashBoard.prototype.start = function(percent) {
        var self = this;
        if (percent === self.percent) return;
        self.percent = percent;
        self.rotate(self.$element.find(".circle1"), self.percent);
        self.rotate(self.$element.find(".circle2"), self.percent);
        self.rotate(self.$element.find(".hand"), self.percent);
        self.percentNum = new CountUp("percentNum", 0, Math.round(self.percent * 100), 0, 1);
        self.percentNum.start();
    };

    DashBoard.prototype.rotate = function($element) {
        var self = this;
        if (self.percent === 0) return;
        $element.css("transform", "rotate(0deg)");
        var totalRotate = Math.round(180 * self.percent);
        var myRotate = 0;
        var interVal = setInterval(function() {
            myRotate+=2;
            $element.css("transform", "rotate(" + myRotate + "deg)");
            if (myRotate >= totalRotate) {
                clearInterval(interVal);
            }
        });
    };
    DashBoard.constructor = DashBoard;
    return DashBoard;
});
