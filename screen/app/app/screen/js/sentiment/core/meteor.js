var Meteor = (function() {
    var twinkleOption = {
        'effect': 'drops',
        'effectOptions': {
            radius: zbdp.configData.twinkle.radius || 50,
            duration: zbdp.configData.twinkle.duration || 1000,
            width: zbdp.configData.twinkle.width || 4,
            count: zbdp.configData.twinkle.count || 2,
            delay: zbdp.configData.twinkle.delay || 400
        }
    };

    function getDistance(p1, p2) {
        var result = 0;
        result = Math.sqrt(Math.pow(Math.abs(p1.x - p2.x), 2) + Math.pow(Math.abs(p1.y - p2.y), 2));
        return result.toFixed(2);
    }

    function getRotate(p1, p2) {
        var result = 0;
        if (p1.x == p2.x) {
            if (p1.y < p2.y) {
                result = 90
            }
            if (p1.y > p2.y) {
                result = 270;
            }
        } else if (p1.y == p2.y) {
            if (p1.x < p2.x) {
                result = 0;
            }
            if (p1.x > p2.x) {
                result = 180;
            }
        } else if (p1.x < p2.x) {
            if (p1.y > p2.y) {
                result = Math.atan((p2.y - p1.y) / (p2.x - p1.x)) / Math.PI * 180 + 360;
            } else {
                result = Math.atan((p2.y - p1.y) / (p2.x - p1.x)) / Math.PI * 180;
            }
        } else if (p1.x > p2.x) {
            result = Math.atan((p2.y - p1.y) / (p2.x - p1.x)) / Math.PI * 180 + 180;
        }
        return result.toFixed(2);
    }

    /**
     * 固定右侧-在接触终点时固定
     */
    function fixRight(element, container, point) {
        // var element = this._meteor;
        var width = container.width();
        var left = element.css('left');
        // var right = container.width() - element.width() - parseInt(left);
        var right = container.width() - point.x;
        // var bottom = container.height() - point.y;
        element.css({
            left: '',
            right: right + 'px',
            transformOrigin: 'right center',
            top: point.y,
            // bottom: bottom + 'px'
        });
    }

    function Meteor(config) {
        this._startPoint = config.startPoint;
        this._endPoint = config.endPoint;
        this._color = config.color;
        this._container = config.container;
        this._speed = config.speed || 200;
        this._width = '100'; //流星的长度
        this._rotate = getRotate(this._startPoint, this._endPoint);
        this._scale = config.scale;
    }

    /**
     * 准备
     * 1.构造元素并设置相关属性
     * @return {[type]} [description]
     */
    Meteor.prototype.prepare = function() {
        this._startPointNode = $('<div class="meteor-point"></div>');
        this._startPointNode.css({
            top: this._startPoint.y + 'px',
            left: this._startPoint.x + 'px',
            backgroundColor: this._color,
        });
        this._endPointNode = $('<div class="meteor-point"></div>');
        this._endPointNode.css({
            top: this._endPoint.y + 'px',
            left: this._endPoint.x + 'px',
            // backgroundColor: this._color,
        });
        this._meteor = $('<div class="runner"><img src="images/' + this._color + '.gif"></div>');
        var rotate = this._rotate;
        this._meteor.css({
            width: this._width + 'px',
            top: this._startPoint.y + 'px',
            left: this._startPoint.x + 'px',
            transform: 'rotate(' + rotate + 'deg)',
            opacity: 0,
        });
        this._container.append(this._startPointNode);
        this._container.append(this._endPointNode);
        this._container.append(this._meteor);

        /**
         * 提前计算
         */
        var meteor = this;
        var distance = Math.round(getDistance(this._startPoint, this._endPoint) - this._width);
        this._relativeData = {
            distance: distance,
            distanceDur: (distance / meteor._speed).toFixed(4) * 1000,
            transformEnd: this.transformEndPoint(),
        }
        if (distance < 0) {
            this._meteor.css({
                width: (distance + parseInt(this._width)) + 'px'
            });
            this._meteor.find('img').css({
                width: (distance + parseInt(this._width)) + 'px'
            })
        }
    }

    /**
     * 初始阶段--增长width
     * @return {[type]} [description]
     */
    Meteor.prototype.grow = function() {
        var optionCopy = $.extend(true, {}, twinkleOption);
        optionCopy.effectOptions.color = this._color;
        optionCopy.scale = this._scale;
        this._startPointNode.twinkle(optionCopy);
        var meteor = this;
        this._meteor.animate({

        }, 'fast', function() {
            meteor.run();
        });
    }

    /**
     * 缩小阶段--缩小width
     * @return {[type]} [description]
     */
    Meteor.prototype.shrink = function() {
        var meteor = this;
        var dur = (this._width / this._speed).toFixed(4) * 1000;
        this._meteor.animate({
            width: '0px'
        }, dur, function() {
            var optionCopy = $.extend(true, {}, twinkleOption);
            optionCopy.effectOptions.color = meteor._color;
            optionCopy.scale = meteor._scale;
            optionCopy.callback = function() {
                meteor.destory();
            }
            meteor._endPointNode.twinkle(optionCopy);
        });
    }

    /**
     * 缩小阶段--缩小width
     * @return {[type]} [description]
     */
    Meteor.prototype.destory = function() {
        // console.log('destory');
        this._meteor.remove();
        this._startPointNode.remove();
        this._endPointNode.remove();
    }

    /**
     * 运行阶段
     * @return {[type]} [description]
     */
    Meteor.prototype.run = function() {
        var meteor = this;
        // var distance = Math.round(getDistance(this._startPoint, this._endPoint) - this._width); // 
        var distance = meteor._relativeData.distance;
        // if (distance > 0) {
        var dur = meteor._relativeData.distanceDur;
        var end = meteor._relativeData.transformEnd;
        this._meteor.animate({
            opacity: 1,
        }, 'fast');
        this._meteor.animate({
            top: end.y + 'px',
            left: end.x + 'px',
        }, dur, function() {
            fixRight(meteor._meteor, meteor._container, meteor._endPoint);
            meteor.shrink();
        });
        // }
    }

    /**
     * 终点转换 从左侧的top-left转换到右侧的top-right
     * @return {[type]} [description]
     */
    Meteor.prototype.transformEndPoint = function() {
        var result = {};
        if (this._rotate >= 0 && this._rotate <= 360) {
            result.x = this._endPoint.x - this._width * Math.cos(this._rotate * Math.PI / 180);
            result.y = this._endPoint.y - this._width * Math.sin(this._rotate * Math.PI / 180);
        }
        return result;
    }



    Meteor.prototype.fire = function() {
        this.prepare();
        this.grow();
    }


    return Meteor;
})();

/**
 * 根据一组数据，飞线的执行
 */
var MeteorManager = (function() {
    function MeteorManager(config) {
        this._lines = config.lines;
        // console.log(this._lines);
        this._Meteors = [];
        this._container = config.container;
        this._speed = config.speed || 200;
        this._scale = config.scale || 1;
    }
    MeteorManager.prototype.update = function(config) {
        this._lines = config.lines;
        this._Meteors = [];
        this._container = config.container;
        this._speed = config.speed || 200;
        this._scale = config.scale || 1;
    }
    MeteorManager.prototype.run = function() {
        for (var i = 0; i < this._lines.length; i++) {
            var line = this._lines[i];
            var option = {};
            option.startPoint = line.startPoint;
            option.endPoint = line.endPoint;
            option.color = (function() {
                if (line.val > -50 && line.val < 50) {
                    return 'yellow';
                } else if (line.val <= -50) {
                    return 'red';
                } else if (line.val > 50) {
                    return 'green'
                }
            })();
            option.container = this._container;
            option.speed = this._speed;
            option.scale = this._scale;
            var meteor = new Meteor(option);
            this._Meteors.push(meteor);
        }
        /*for (var i = 0; i < this._Meteors.length; i++) {
            this._Meteors[i].fire();
        }*/
        chunk(this._Meteors, meteorRun);

        /**
         * 执行meteor对象的相关方法
         * 生成起点的DOM节点，并设置
         */
        function meteorRun(meteor) {
            meteor.fire();
        }
    }

    function chunk(array, process, context) {
        var interval = zbdp.configData.meteorShootInterval || 500;
        var item = array.shift();
        if (typeof item != 'undefined') {
            process.call(context, item);
        }
        if (array.length > 0) {
            setTimeout(function() {
                chunk(array, process, context);
            }, interval);
        }
    }
    return MeteorManager;
})();


var TwinkleManager = (function() {
    var twinkleOption = {
        'effect': 'drops',
        'effectOptions': {
            radius: zbdp.configData.twinkle.radius || 50,
            duration: zbdp.configData.twinkle.duration || 1000,
            width: zbdp.configData.twinkle.width || 4,
            count: zbdp.configData.twinkle.count || 2,
            delay: zbdp.configData.twinkle.delay || 400
        }
    }

    function TwinkleManager(config) {
        this._twinkles = {};
        this._container = config.container;
        this._interval = parseInt(config.interval) * 1000;
        this._scale = config.scale;
    }

    TwinkleManager.prototype.update = function(dataArr) {
        var tm = this;
        clearTimeout(this.timeoutId);
        for (var i = 0; i < dataArr.length; i++) {
            var dataItem = dataArr[i];
            var config = {};
            config.name = dataItem.name;
            config.pos = dataItem.startPoint;
            config.container = this._container;

            config.option = $.extend(true, {}, twinkleOption);
            config.option.scale = this._scale;
            config.option.effectOptions.color = (function() {
                if (dataItem.val > -50 && dataItem.val < 50) {
                    return 'yellow';
                } else if (dataItem.val <= -50) {
                    return 'red';
                } else if (dataItem.val > 50) {
                    return 'green'
                }
            })();
            if (typeof this._twinkles[dataItem.name] == 'undefined') {
                this._twinkles[dataItem.name] = new Twinkle(config);
            } else {
                this._twinkles[dataItem.name].update(config);
            }
        }
        tm.timeoutId = setTimeout(function() {
            tm.runTwinkles();
        }, this._interval);
    }

    TwinkleManager.prototype.runTwinkles = function() {
        var tm = this;
        var names = [];
        for (var name in tm._twinkles) {
            names.push(name);
            // tm._twinkles[name].runTwinkle();
            // process(tm._twinkles[name]);
        }
        chunkTwinkles(tm._twinkles, names, process);

        function process(twinkle) {
            twinkle.runTwinkle();
        }

        tm.timeoutId = setTimeout(function() {
            tm.runTwinkles();
        }, tm._interval + names.length * 300);
    }

    function chunkTwinkles(obj, array, process, context) {
        var name = array.shift();
        if (typeof name != 'undefined') {
            process.call(context, obj[name]);
        }
        if (array.length > 0) {
            setTimeout(function() {
                chunkTwinkles(obj, array, process, context);
            }, 300);
        }
    }

    var Twinkle = (function() {
        function Twinkle(config) {
            this._name = config.name;
            this._ele = $('<div class="meteor-point"></div>');
            this._ele.css({
                top: config.pos.y + 'px',
                left: config.pos.x + 'px',
                backgroundColor: config.option.effectOptions.color,
            });
            config.container.append(this._ele);
            this.twinkleOption = config.option;
        }
        Twinkle.prototype.update = function(config) {
            this._ele.css({
                backgroundColor: config.option.effectOptions.color,
            });
        }
        Twinkle.prototype.runTwinkle = function() {
            // console.log('run');
            this._ele.twinkle(this.twinkleOption);
        }
        return Twinkle;
    })()

    return TwinkleManager;
})();
