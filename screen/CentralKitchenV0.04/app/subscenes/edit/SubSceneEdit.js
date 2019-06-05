define(function(require) {
    var dataManager = require('tool/dataManager');
    var util = require('tool/util');

    var MainLabel = require('components/MainLabel');
    var PathWay = require('components/PathWay');

    var SubScene = require('subscenes/SubScene');

    var Classifier = require('./components/Classifier');
    var AuditInfoPanel = require('./components/AuditInfoPanel');
    var ShareReprot = require('./components/ShareReprot');

    function SubSceneEdit(parent) {
        var self = this;
        SubScene.call(this, parent);
        this.snapElement.attr('name', 'SubSceneEdit');

        var data = this.data = util.clone(dataManager.getData().JSONEDIT);
        this.zjxwApp = dataManager.getData().zjxwApp;
        this.zjxwAppP = dataManager.getData().zjxwAppPub;
        this.lineChange = dataManager.getData().LINE.LINE3CHANGE;

        this.mainLabel = new MainLabel(this, '编', data.TOTAL + this.zjxwApp + this.zjxwAppP);
        this.mainLabel.setPosition(1295.5, 480.5);

        //1 ORGINALSHARE
        //2 XHSNUM
        //3 WEBNUM
        //4 PRODUCTFINISHED
        this.classifier = new Classifier(this, [data.ORGINALSHARE, data.XHSNUM, data.WEBNUM, data.PRODUCTFINISHED]);
        this.classifier.setPosition(470 + 1295.5, 460 + 480.5);

        this.auditInfoPanel = new AuditInfoPanel(this, [
            [data.WAITAUDIT.ONE, data.WAITAUDIT.TWO, data.WAITAUDIT.THREE + self.zjxwApp, data.WAITAUDIT.FOUR, data.WAITAUDIT.FIVE],
            [data.AUDITED.ONE, data.AUDITED.TWO, data.AUDITED.THREE + self.zjxwAppP, data.AUDITED.FOUR, data.AUDITED.FIVE]
        ]);
        this.auditInfoPanel.setPosition(1515, 925);

        this.shareReprot = new ShareReprot(this, [data.SHAREMANU.ONE, data.SHAREMANU.TWO, data.SHAREMANU.THREE, data.SHAREMANU.FOUR]);
        this.shareReprot.setPosition(1768, 655);

        var pathWayStyle = {
            stroke: "#E24E2B ",
            strokeWidth: 1,
            fill: "none",
            opacity: 0.5
        };
        //红色飞线
        this.pathWay0 = new PathWay(this, 'M1592 150 1592 245 1582 255 1392 255 1375 270 1375 470', pathWayStyle, '#CC4433');

        pathWayStyle = {
            stroke: "#1B8A8B ",
            strokeWidth: 1,
            fill: "none",
            opacity: 1
        };
        //集团共享稿件
        this.pathWay1 = new PathWay(this, 'M1365 525 1365 540 1380 555 1680 555', pathWayStyle, '#1B8A8B');
        this.pathWay11 = new PathWay(this, 'M1850 535 1900 535 1900 1030 1800 1030 1795 975', pathWayStyle, '#1B8A8B');
        //新华社
        this.pathWay2 = new PathWay(this, 'M1340 525 1340 675 1355 690 1455 690  1470 705 1470 780 1485 795 1655  795 1675 815 1770 815 1785 830 1785 850 1845 850 1795 910', pathWayStyle, '#1B8A8B');
        //互联网稿件
        this.pathWay3 = new PathWay(this, 'M1330 525 1330 685 1345 700 1440 700 1455 715 1455 790 1470 805 1650 805  1665 820 1665 860  1720 860  1735 910', pathWayStyle, '#1B8A8B');

        //集团成品
        this.pathWay4 = new PathWay(this, 'M1320 525 1320 700  1335 715 1425 715 1440 730 1440 800 1455 815 1640 815 1655 830 1655 1020 1670 1035 1710 1035  1735 970', pathWayStyle, '#1B8A8B');
        //待审
        this.pathWay5 = new PathWay(this, 'M1765 980 1765 1055 1750 1070 1660 1070 1645 1055 1645 940 1640 930 1625 930', pathWayStyle, '#1B8A8B');
    }
    SubSceneEdit.prototype = Object.create(SubScene.prototype);
    SubSceneEdit.prototype.constructor = SubSceneEdit;
    SubSceneEdit.prototype.init = function() {
        var self = this;

        self.pathWay0.init();

        delay(1000, function() {
            self.mainLabel.init();
            self.shareReprot.init();
        });

        delay(1500, function() {
            self.pathWay1.init();
            self.pathWay11.init();
            self.pathWay2.init();
            self.pathWay3.init();
            self.pathWay4.init();
        });

        delay(2000, function() {
            self.classifier.init();
        });

        delay(2500, function() {
            self.pathWay5.init();
        });

        delay(3000, function() {
            self.auditInfoPanel.init();
        });
    };

    SubSceneEdit.prototype.update = function() {
        var data = this.data;
        var newData = util.clone(dataManager.getData().JSONEDIT);
        this.data = newData;

        this.runPathWay(data, newData);

        //演示用
        var self = this;

        var lineChange = this.lineChange;
        var newLineChange = dataManager.getData().LINE.LINE3CHANGE;
        this.lineChange = newLineChange;

        for (var i = 0; i < newLineChange - lineChange; i++) {
            delay(Math.random() * 5000, function() {
                self.pathWay0.run();
            });
        }
    };

    SubSceneEdit.prototype.runPathWay = function(data, newData, ms) {
        var self = this;
        var rayInfos = [];
        var zjxwApp = dataManager.getData().zjxwApp;
        var zjxwAppP = dataManager.getData().zjxwAppPub;
        //浙江新闻客户端
        if (zjxwApp > self.zjxwApp || zjxwAppP > self.zjxwAppP) {
            self.mainLabel.increase(zjxwApp - self.zjxwApp);
            self.mainLabel.increase(zjxwAppP - self.zjxwAppP);
        }
        //垂直领域
        if (newData.SHAREMANU.ONE - data.SHAREMANU.ONE > 0) {
            util.sliceNumber(newData.SHAREMANU.ONE - data.SHAREMANU.ONE, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay1.run(null, function() {
                        self.shareReprot.increase(1, mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.SHAREMANU.ONE - data.SHAREMANU.ONE < 0) {
            self.shareReprot.increase(1, newData.SHAREMANU.ONE - data.SHAREMANU.ONE);
        }

        //专题稿件
        if (newData.SHAREMANU.TWO - data.SHAREMANU.TWO > 0) {
            util.sliceNumber(newData.SHAREMANU.TWO - data.SHAREMANU.TWO, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay1.run(null, function() {
                        self.shareReprot.increase(2, mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.SHAREMANU.TWO - data.SHAREMANU.TWO < 0) {
            self.shareReprot.increase(2, newData.SHAREMANU.TWO - data.SHAREMANU.TWO);

        }

        //图片新闻
        if (newData.SHAREMANU.THREE - data.SHAREMANU.THREE > 0) {
            util.sliceNumber(newData.SHAREMANU.THREE - data.SHAREMANU.THREE, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay1.run(null, function() {
                        self.shareReprot.increase(3, mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.SHAREMANU.THREE - data.SHAREMANU.THREE < 0) {

        }

        //视频新闻
        if (newData.SHAREMANU.FOUR - data.SHAREMANU.FOUR > 0) {
            util.sliceNumber(newData.SHAREMANU.FOUR - data.SHAREMANU.FOUR, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay1.run(null, function() {
                        self.shareReprot.increase(4, mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.SHAREMANU.FOUR - data.SHAREMANU.FOUR < 0) {
            self.shareReprot.increase(4, newData.SHAREMANU.FOUR - data.SHAREMANU.FOUR);
        }

        //1 ORGINALSHARE
        //2 XHSNUM
        //3 WEBNUM
        //4 PRODUCTFINISHED
        //集团原创共享
        if (newData.ORGINALSHARE - data.ORGINALSHARE > 0) {
            util.sliceNumber(newData.ORGINALSHARE - data.ORGINALSHARE, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay11.run(null, function() {
                        self.classifier.increase(1, mySelf.value);
                        self.mainLabel.increase(mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });

        } else if (newData.ORGINALSHARE - data.ORGINALSHARE < 0) {
            self.classifier.increase(1, newData.ORGINALSHARE - data.ORGINALSHARE);
            self.mainLabel.increase(newData.ORGINALSHARE - data.ORGINALSHARE);
        }
        //新华社
        if (newData.XHSNUM - data.XHSNUM > 0) {
            util.sliceNumber(newData.XHSNUM - data.XHSNUM, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay2.run(null, function() {
                        self.classifier.increase(2, mySelf.value);
                        self.mainLabel.increase(mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.XHSNUM - data.XHSNUM < 0) {
            self.classifier.increase(2, newData.XHSNUM - data.XHSNUM);
            self.mainLabel.increase(newData.XHSNUM - data.XHSNUM);
        }

        //互联网稿件
        if (newData.WEBNUM - data.WEBNUM > 0) {
            util.sliceNumber(newData.WEBNUM - data.WEBNUM, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay3.run(null, function() {
                        self.classifier.increase(3, mySelf.value);
                        self.mainLabel.increase(mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.WEBNUM - data.WEBNUM < 0) {
            self.classifier.increase(3, newData.WEBNUM - data.WEBNUM);
            self.mainLabel.increase(newData.WEBNUM - data.WEBNUM);
        }

        //集团成品
        if (newData.PRODUCTFINISHED - data.PRODUCTFINISHED > 0) {
            util.sliceNumber(newData.PRODUCTFINISHED - data.PRODUCTFINISHED, 5).forEach(function(d, i) {
                var rayInfo = {
                    value: d
                };
                rayInfo.run = function() {
                    var mySelf = this;
                    var q = new Queue();
                    self.pathWay4.run(null, function() {
                        self.classifier.increase(4, mySelf.value);
                        self.mainLabel.increase(mySelf.value);
                    })
                }
                rayInfos.push(rayInfo);
                rayInfo = null;
            });
        } else if (newData.PRODUCTFINISHED - data.PRODUCTFINISHED < 0) {
            self.classifier.increase(4, newData.PRODUCTFINISHED - data.PRODUCTFINISHED);
            self.mainLabel.increase(newData.PRODUCTFINISHED - data.PRODUCTFINISHED);
        }

        var names = ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'];
        for (var i = 0; i < names.length; i++) {
            var name = names[i];
            var incrementA;
            var incrementW;
            if (i === 2) {
                incrementA = (newData.AUDITED[name] + zjxwAppP) - (data.AUDITED[name] + self.zjxwAppP);
                incrementW = (newData.WAITAUDIT[name] + zjxwApp) - (data.WAITAUDIT[name] + self.zjxwApp) + incrementA;
                self.zjxwApp = zjxwApp;
                self.zjxwAppP = zjxwAppP;
            } else {
                incrementA = newData.AUDITED[name] - data.AUDITED[name];
                incrementW = newData.WAITAUDIT[name] - data.WAITAUDIT[name] + incrementA;
            }
            //var incrementW = newData.WAITAUDIT[name] - data.WAITAUDIT[name] + incrementA;
            if (incrementW > 0) {
                util.sliceNumber(incrementW, 5).forEach(function(d) {
                    var rayInfo = {
                        index: i,
                        value: d
                    };
                    rayInfo.run = function() {
                        var mySelf = this;
                        self.pathWay5.run(null, function() {
                            self.auditInfoPanel.increase(mySelf.index + 1, mySelf.value);
                        });
                    }
                    rayInfos.push(rayInfo);
                });
            } else if (incrementW < 0) {
                self.auditInfoPanel.increase(5, incrementW);
            }
            if (incrementA > 0) {
                util.sliceNumber(incrementA, 5).forEach(function(d) {
                    var rayInfo = {
                        index: i,
                        value: d
                    };
                    rayInfo.run = function() {
                        var mySelf = this;
                        self.auditInfoPanel.audit(mySelf.index + 1, mySelf.value);
                    }
                    rayInfos.push(rayInfo);
                });

            } else if (incrementA < 0) {
                self.auditInfoPanel.audit(5, incrementA);
            }

        }

        //RUN
        rayInfos.forEach(function(rayInfo) {
            delay((ms || 5000) * Math.random(), function() {
                rayInfo.run();
            });
        });
    };
    return SubSceneEdit;
});
