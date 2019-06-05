define(function(require) {
    var Numbers2 = require('components/Numbers2'); //获取数字组件
    var svgRepository = require('tool/svgRepository'); //获取svg素材库
    function MainLabelDouble(parent, name1, value1, name2, value2) {
        Numbers2.call(this, parent, value1, value2);
        this.name1 = name1;
        this.name2 = name2;
    }
    MainLabelDouble.prototype = Object.create(Numbers2.prototype);
    MainLabelDouble.constructor = MainLabelDouble;
    MainLabelDouble.prototype.init = function(cb) {
        var self = this;
        this.borderG = this.snapElement.g();
        this.borderG.append(svgRepository.getSvg('numberBorderDoubleSvg'));
        this.borderG.attr({
            transform: 'matrix(0.5,0,0,0.5,-89,-59)' //边框的偏移为-89，-59  缩放为 0.5
        });
        var borderSubGSet = this.borderG.selectAll('g'); //获取bordersvg中的所有g元素
        borderSubGSet[0].attr({
            transform: 'translate(0,80)' //先将上边框向下偏移40像素，用于后面，初始化时，上下两个边框处于闭合状态
        });
        borderSubGSet[1].attr({
            transform: 'matrix(0,0,0,1,307,0)' //先将透明数字显示部放置为：x轴缩放为0；并且x轴起始位置向右偏移307，以便后面的初始化动画渲染
        });
        borderSubGSet[2].attr({
            transform: 'matrix(0,0,0,1,307,0)' //先将透明数字显示部放置为：x轴缩放为0；并且x轴起始位置向右偏移307，以便后面的初始化动画渲染
        });
        borderSubGSet[3].attr({
            transform: 'translate(0,0)' //先将下边框向上偏移-40像素，用于后面，初始化时，上下两个边框处于闭合状态
        });
        var g = this.snapElement.g().attr({ //左侧文字渲染开始了
            transform: 'translate(-44.5,-5.5)'
        });

        var pattern = this.snapElement.path("M0 5 L10 5 M5 0 L5 10").attr({ //文字背景小十字架
            fill: "none",
            stroke: "rgba(13,126,158,0.2)",
            strokeWidth: 1,
        }).pattern(0, 0, 10, 10);

        var rect01 = g.rect(21, 21, 0, 0).attr({ //文字背景底色渲染模板 ，初始化时不显示，后面会展开
            rx: 4,
            ry: 4,
            fill: 'rgba(41,138,161,0.1)'
        });
        var rect02 = g.rect(21, 21, 0, 0).attr({ //将之前的pattern十字架背景填充入文字的背景中
            rx: 4,
            ry: 4,
            fill: pattern
        });
        var rect03 = g.rect(21, 21, 0, 0).attr({ //文字区域边框
            rx: 4,
            ry: 4,
            fill: 'none',
            'stroke-width': 2,
            'stroke': 'rgba(41,138,161,0.5)'
        });
        var rect04 = g.rect(1, 1, 40, 0).attr({ //装饰文字特效，向下划过一道光束
            rx: 4,
            ry: 4,
            fill: 'l(0,0,0,1)rgba(13, 126, 158,0)-rgba(13, 126, 158,0.25)',
            'stroke-width': 'none',
        });
        var text1 = g.text(6, 31, this.name1).attr({ //文字 ,初始化时是隐藏状态，后面动画会让它显示出来
            'fill': '#29A6D2',
            'font-family': 'SimHei',
            'font-size': '28px',
            opacity: 0
        });
        var text2 = g.text(6, 78, this.name2).attr({ //文字 ,初始化时是隐藏状态，后面动画会让它显示出来
            'fill': '#29A6D2',
            'font-family': 'SimHei',
            'font-size': '28px',
            opacity: 0
        });
        var queue = new Queue();
        queue.runActions([
            /*function() { //没用，调试残留代码
                maskRect.animate({
                    width: 0
                }, 500, queue.run);
            },*/
            function() {
                borderSubGSet[0].animate({ //打开上下两边框
                    transform: 'translate(0,0)'
                }, 250);
                borderSubGSet[3].animate({
                    transform: 'translate(0,93)'
                }, 250, queue.run);

            },
            function() {
                borderSubGSet[1].animate({
                    transform: 'matrix(1,0,0,1,0,0)'
                }, 250, Numbers2.prototype.init.bind(self, cb));
                borderSubGSet[2].animate({
                    transform: 'translate(0,93)'
                }, 250);
                // Snap.animate(0, 1, function(val) {}, 100, queue.run);
                rect03.animate({
                    x: -3,
                    y: -3,
                    width: 48,
                    height: 96
                }, 500, queue.run);
            },
            function() {
                rect01.animate({
                    x: 0,
                    y: 0,
                    width: 42,
                    height: 90
                }, 500, queue.run);
            },
            function() {
                rect02.animate({
                    x: 1,
                    y: 1,
                    width: 40,
                    height: 90
                }, 250, queue.run);
            },
            function() {
                text1.attr({
                    opacity: 1
                });
                text2.attr({
                    opacity: 1
                });
                var innerQueue = new Queue(true, true);
                innerQueue.runActions([
                    function() {
                        rect04.attr({
                            y: 1,
                            height: 0
                        });
                        rect04.animate({
                            y: 1,
                            height: 90
                        }, 1500, innerQueue.run);
                    },
                    function() {
                        rect04.animate({
                            y: 90,
                            height: 0
                        }, 1500);
                        Snap.animate(0, 1, function(val) {}, 3000, innerQueue.run);
                    }
                ]);
            }
        ]);
    };
    MainLabelDouble.prototype.increase = function(increment, increment2) {
        //  if (increment>0) {
        this.value += increment != null ? increment : 1;
        this.setValueInner(this.value);
        if (typeof(increment2) === "number") {
            this.value2 += increment2 != null ? increment2 : 1;
            this.setValueInner2(this.value2);
        }
        //}else{
        //   this.value -= increment != null ? increment : 1;
        //       this.setValueInner(this.value);
        //  }
    };
    return MainLabelDouble;
});
