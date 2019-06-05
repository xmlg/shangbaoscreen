define(function(require) {
    var PathWay = require('components/PathWay');
    var MainLabelDouble = require('components/MainLabelDouble');

    var ClassifyLabel = require('./components/ClassifyLabel');
    var ClassifyLabelOfBomb = require('./components/ClassifyLabelOfBomb');
    var ClassifyLabelOfPolicynum = require('./components/ClassifyLabelOfPolicynum');
    var ClassifyLabelOfHistoryToday = require('./components/ClassifyLabelOfHistoryToday');
    var ClassifyLabelOfTodayHot = require('./components/ClassifyLabelOfTodayHot');

    var SubScene = require('subscenes/SubScene');
    var dataManager = require('tool/dataManager');
    var util = require('tool/util');

    function SubScenePlan(parent) {
        SubScene.call(this, parent);
        this.snapElement.attr('name', 'SubScenePlan');

        var d = 'M39 70 39 175 25 200 -795 200 -814 176 -814 69';
        var pathWayStyle = {
            stroke: "#E24E2B ",
            strokeWidth: 1,
            fill: "none",
            opacity: 0.5
        };

        this.lineChange = dataManager.getData().LINE.LINE2CHANGE;

        var data = util.clone(dataManager.getData().JSONPLAN);
        this.data = data;
        /**
         * 策
         * @type {PathWay}
         */
        var ceTotal = data.TODAYSELECT;
        var juTotal = data.BOMB.TOTAL + data.POLICYNUM.TOTAL + data.RECENTDISASTERNUM + data.HISTORYINTODAY.NUM + data.HOTREPORT.TOTAL;
        this.mainLabelDouble = new MainLabelDouble(this, '聚', juTotal, '策', ceTotal);
        this.mainLabelDouble.setPosition(496.5, 137.5);

        /**
         * 红色飞线
         * @type {PathWay}
         */
        this.pathWay = new PathWay(this, d, pathWayStyle);
        this.pathWay.setPosition(1290, 157);

        //BOMB
        this.classifyLabel1 = new ClassifyLabelOfBomb(this, '今日爆料', data.BOMB.TOTAL, [data.BOMB.ONE, data.BOMB.TWO], [445, 159]);
        this.classifyLabel1.setPosition(295.5, 25 + 37 * 0);
        //POLICYNUM
        this.classifyLabel2 = new ClassifyLabelOfPolicynum(this, '今日政策', data.POLICYNUM.TOTAL, [data.POLICYNUM.ONE, data.POLICYNUM.TWO], [445, 159 + 4]);
        this.classifyLabel2.setPosition(295.5, 25 + 37 * 1);
        //RECENTDISASTERNUM
        this.classifyLabel3 = new ClassifyLabel(this, '今日灾害', data.RECENTDISASTERNUM, [445, 159 + 4 * 2]);
        this.classifyLabel3.setPosition(295.5, 25 + 37 * 2);
        //HISTORYINTODAY
        this.classifyLabel4 = new ClassifyLabelOfHistoryToday(this, '今日历史事件', data.HISTORYINTODAY.NUM, '历史今天内容', [445, 159 + 4 * 3]);
        this.classifyLabel4.setPosition(295.5, 25 + 37 * 3);
        //HOTREPORT
        this.classifyLabel5 = new ClassifyLabelOfTodayHot(this, '今日热点', data.HOTREPORT.TOTAL, [data.HOTREPORT.ONE, data.HOTREPORT.TWO, data.HOTREPORT.THREE], [445, 159 + 4 * 4]);
        this.classifyLabel5.setPosition(295.5, 25 + 37 * 4);
        //TODAYREPORTNUM
        this.classifyLabel6 = new ClassifyLabel(this, '今日报题', data.TODAYREPORTNUM, [445, 159 + 4 * 5]);
        this.classifyLabel6.setPosition(295.5, 25 + 37 * 5);
        //TODAYSELECT
        this.classifyLabel7 = new ClassifyLabel(this, '今日选题', data.TODAYSELECT, [445, 159 + 4 * 6]);
        this.classifyLabel7.setPosition(295.5, 25 + 37 * 6);
        //TODAYTASK
        this.classifyLabel8 = new ClassifyLabel(this, '今日任务', data.TODAYTASK, [445, 159 + 4 * 7]);
        this.classifyLabel8.setPosition(295.5, 25 + 37 * 7);
        //TODAYNOTICE
        this.classifyLabel9 = new ClassifyLabel(this, '今日公告信息', data.TODAYNOTICE, [445, 159 + 4 * 8]);
        this.classifyLabel9.setPosition(295.5, 25 + 37 * 8);
    }
    SubScenePlan.prototype = Object.create(SubScene.prototype);
    SubScenePlan.prototype.constructor = SubScenePlan;
    SubScenePlan.prototype.init = function() {
        var self = this;
        delay(1500, function() {
            self.mainLabelDouble.init();
        });
        delay(2000, function() {
            self.pathWay.init();
        });
        delay(50 * 0, function() {
            self.classifyLabel1.init();
        });
        delay(50 * 1, function() {
            self.classifyLabel2.init();
        });
        delay(50 * 2, function() {
            self.classifyLabel3.init();
        });
        delay(50 * 3, function() {
            self.classifyLabel4.init();
        });
        delay(50 * 4, function() {
            self.classifyLabel5.init();
        });
        delay(50 * 5, function() {
            self.classifyLabel6.init();
        });
        delay(50 * 6, function() {
            self.classifyLabel7.init();
        });
        delay(50 * 7, function() {
            self.classifyLabel8.init();
        });
        delay(50 * 8, function() {
            self.classifyLabel9.init();
        });
    }
    SubScenePlan.prototype.update = function() {
        var self = this;

        var data = this.data;
        var newData = util.clone(dataManager.getData().JSONPLAN);

        this.data = newData;

        this.runPathWay(data, newData);

        var lineChange = this.lineChange;
        var newLineChange = dataManager.getData().LINE.LINE2CHANGE;
        this.lineChange = newLineChange;

        for (var i = 0; i < newLineChange - lineChange; i++) {
            delay(Math.random() * 5000, function() {
                self.pathWay.run();
            });
        }
    }

    SubScenePlan.prototype.runPathWay = function(data, newData, ms) {
        var self = this;
        var rayInfos = [];

        util.sliceNumber(newData.BOMB.ONE - data.BOMB.ONE, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel1.increase(this.value, function() {
                    self.mainLabelDouble.increase(increaseNum);
                }, 1);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.BOMB.TWO - data.BOMB.TWO, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel1.increase(this.value, function() {
                    self.mainLabelDouble.increase(increaseNum);
                }, 2);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.POLICYNUM.ONE - data.POLICYNUM.ONE, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel2.increase(this.value, function() {
                    self.mainLabelDouble.increase(increaseNum);
                }, 1);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.POLICYNUM.TWO - data.POLICYNUM.TWO, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel2.increase(this.value, function() {
                    self.mainLabelDouble.increase(increaseNum);
                }, 2);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.RECENTDISASTERNUM - data.RECENTDISASTERNUM, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel3.increase(this.value, function() {
                    self.mainLabelDouble.increase(increaseNum);
                });
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.HISTORYINTODAY.NUM - data.HISTORYINTODAY.NUM, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel4.increase(this.value, function() {
                    self.mainLabelDouble.increase(increaseNum);
                });
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.HOTREPORT.ONE - data.HOTREPORT.ONE, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel5.increase(this.value, 1, function() {
                    self.mainLabelDouble.increase(increaseNum);
                });
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.HOTREPORT.TWO - data.HOTREPORT.TWO, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel5.increase(this.value, 2, function() {
                    self.mainLabelDouble.increase(increaseNum);
                });
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.HOTREPORT.THREE - data.HOTREPORT.THREE, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel5.increase(this.value, 3, function() {
                    self.mainLabelDouble.increase(increaseNum);
                });
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.TODAYREPORTNUM - data.TODAYREPORTNUM, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel6.increase(this.value, function() {
                    //self.mainLabelDouble.increase(increaseNum);
                }, false);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.TODAYSELECT - data.TODAYSELECT, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel7.increase(this.value, function() {
                    self.mainLabelDouble.increase(0, increaseNum);
                });
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.TODAYTASK - data.TODAYTASK, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel8.increase(this.value, function() {
                    //self.mainLabelDouble.increase(increaseNum);
                },false);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        util.sliceNumber(newData.TODAYNOTICE - data.TODAYNOTICE, 5).forEach(function(d, i) {
            var rayInfo = {
                value: d
            };
            rayInfo.run = function() {
                var increaseNum = this.value;
                self.classifyLabel9.increase(this.value, function() {
                    //self.mainLabelDouble.increase(increaseNum);
                },false);
            }
            rayInfos.push(rayInfo);
            rayInfo = null;
        });

        rayInfos.forEach(function(rayInfo) {
            delay((ms || 5000) * Math.random(), function() {
                rayInfo.run();
            });
        });
    }
    return SubScenePlan;
});
