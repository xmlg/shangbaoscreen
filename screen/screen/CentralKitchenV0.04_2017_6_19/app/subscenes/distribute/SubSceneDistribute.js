define(function(require) {
    var dataManager = require('tool/dataManager');
    var util = require('tool/util');

    var MainLabel = require('components/MainLabel');
    var PathWay = require('components/PathWay');

    var SubScene = require('subscenes/SubScene');

    var ThreeDistribute = require('./components/ThreeDistribute');
    var Galaxy = require('./components/Galaxy');

    function SubSceneDistribute(parent) {
        var self = this;
        SubScene.call(this, parent);
        this.snapElement.attr('name', 'SubSceneDistribute');
        this.value = dataManager.getData().JSONDISTRIBUTE.TYPECOUNTS.reduce(function(a, b) {
            return a + b.TOTAL;
        }, 0);
        self.mainLabel = new MainLabel(self, '发', self.value);
        self.mainLabel.setPosition(496.5, 480.5);
        this.pathWay = new PathWay(
            this,
            'M1400 930 1380 930 1370 920 1370 760 1360 747 770 747 756 733 756 693 744 683 573 683 561 673 561 525', {
                stroke: "#E24E2B ",
                strokeWidth: 1,
                fill: "none",
                opacity: 0.5
            }
        );

        this.threeDistribute = new ThreeDistribute(self, 305, 235);
        this.threeDistribute.setPosition(220, 515);

        this.galaxy = new Galaxy(self);
        this.galaxy.setPosition(378, 827);
        this.entrys = [];
        this.count = 0;
        this.mapHasPushed = {};

    }
    SubSceneDistribute.prototype = Object.create(SubScene.prototype);
    SubSceneDistribute.prototype.constructor = SubSceneDistribute;
    SubSceneDistribute.prototype.init = function() {
        var self = this;
        this.pathWay.init();
        delay(1000, function() {
            self.mainLabel.init();
        });
        delay(3000, function() {
            self.threeDistribute.init();
            self.galaxy.init();
            self.startTimeTask();
        });
        document.body.addEventListener('click', function() {
            self.threeDistribute.blink();
        });
    };
    //获取浙江新闻客户端的发稿数
    SubSceneDistribute.prototype.centerAllDataApp = function() {
        var self = this;
        var defer = $.Deferred();
        $.ajax({
            url: "/screen/centeralldataapp/auditwait",
            method: "get",
            dataType: "json",
            success: function(data) {
                defer.resolve(data);
            }
        });
        return defer.promise();
    };
    SubSceneDistribute.prototype.update = function() {
        var self = this;
        dataManager.getData().JSONDISTRIBUTE.ENTRYS.forEach(function(entry, i) {
            if (!self.mapHasPushed[entry.CONTENT + ':' + entry.MEDIATYPE]) {
                self.mapHasPushed[entry.CONTENT + ':' + entry.MEDIATYPE] = true;
                self.entrys.push(entry);
                self.count++;
                if (self.count > 1000) {
                    self.count = 0;
                    self.entrys = [];
                }
            }
        });
        var value = this.value;
        var newValue = dataManager.getData().JSONDISTRIBUTE.TYPECOUNTS.reduce(function(a, b) {
            return a + b.TOTAL;
        }, 0);
        this.value = newValue;
        this.threeDistribute.update();
        var diffValue = newValue - value;
        if (diffValue > 0) {
            util.sliceNumber(diffValue, 5).forEach(function(d, i) {
                delay(5000 * Math.random(), function() {
                    self.pathWay.run(null, function() {
                        if (self.mainLabel.value < self.value) {
                            if (d <= self.value - self.mainLabel.value) {
                                self.mainLabel.increase(d);
                            } else {
                                self.mainLabel.increase(self.value - self.mainLabel.value);
                            }
                        }
                    });
                });
            });
        } else {
            self.mainLabel.increase(diffValue);
        }
    };
    SubSceneDistribute.prototype.startTimeTask = function() {
        var self = this;
        window.setInterval(function() {
            var entry = self.entrys.pop();
            entry && self.pathWay.run(null, function() {
                if (self.mainLabel.value < self.value) {
                    self.mainLabel.increase();
                }
                self.galaxy.showGalaxyTitle(entry);
                if (entry.THREECIRCLE) {
                    self.threeDistribute.showThreeNew('三端环流', entry.CONTENT);
                } else if (entry.THREECLIENT) {
                    self.threeDistribute.showThreeNew('三端齐发', entry.CONTENT);
                }
            });
        }, 2000);
    }
    return SubSceneDistribute;
});
