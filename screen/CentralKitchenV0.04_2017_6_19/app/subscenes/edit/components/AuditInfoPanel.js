define(function(require) {
    var Component = require('components/Component');
    var svgRepository = require('tool/svgRepository');
    
    function AuditInfoPanel(parent, values) {
        Component.call(this, parent);
        this.values = values || [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ];
    }
    AuditInfoPanel.prototype = Object.create(Component.prototype);
    AuditInfoPanel.constructor = AuditInfoPanel;
    AuditInfoPanel.prototype.init = function(cb) {
        this.mainG = this.snapElement.g();
        this.mainG.attr({
            transform: 'translate(-159,-113) scale(0.5,0.5)'
        });
        this.mainG.append(svgRepository.getSvg('auditInfoPanel'));

        this.wt = this.mainG.select('#wt').attr({
            text: this.values[0].reduce(function(a, b) {
                return a + b;
            }, 0)
        });
        this.w1 = this.mainG.select('#w1').attr({
            text: this.values[0][0]
        });
        this.w2 = this.mainG.select('#w2').attr({
            text: this.values[0][1]
        });
        this.w3 = this.mainG.select('#w3').attr({
            text: this.values[0][2]
        });
        this.w4 = this.mainG.select('#w4').attr({
            text: this.values[0][3]
        });
        this.w5 = this.mainG.select('#w5').attr({
            text: this.values[0][4]
        });

        this.at = this.mainG.select('#at').attr({
            text: this.values[1].reduce(function(a, b) {
                return a + b;
            }, 0)
        });
        this.a1 = this.mainG.select('#a1').attr({
            text: this.values[1][0]
        });
        this.a2 = this.mainG.select('#a2').attr({
            text: this.values[1][1]
        });
        this.a3 = this.mainG.select('#a3').attr({
            text: this.values[1][2]
        });
        this.a4 = this.mainG.select('#a4').attr({
            text: this.values[1][3]
        });
        this.a5 = this.mainG.select('#a5').attr({
            text: this.values[1][4]
        });

        var borderG = this.mainG.select('g.border');
        var maskG = this.mainG.g();
        var maskRect1 = maskG.rect(205, 54, 225, 22).attr({
            fill: '#fff'
        });
        var maskRect2 = maskG.rect(205, 404, 225, 22).attr({
            fill: '#fff'
        });
        borderG.attr({
            mask: maskG
        });

        var infoG = this.mainG.select('g.info');
        var maskRect3 = infoG.rect(105, 25, 430, 0).attr({
            fill: '#fff'
        });
        infoG.attr({
            mask: maskRect3
        });
        var queue = new Queue();
        queue.runActions([
            function() {
                maskRect1.animate({
                    x: 140,
                    y: 54,
                    width: 354,
                    height: 22
                }, 250);
                maskRect2.animate({
                    x: 140,
                    y: 404,
                    width: 354,
                    height: 22
                }, 250, queue.run);
            },
            function() {
                maskRect1.animate({
                    x: 140,
                    y: 54,
                    width: 354,
                    height: 142
                }, 250);
                maskRect2.animate({
                    x: 140,
                    y: 265,
                    width: 354,
                    height: 165
                }, 250, queue.run);
            },
            function() {
                maskRect3.attr({
                    height: 86
                });
                delay(100, function() {
                    maskRect3.attr({
                        height: 86 * 2
                    });
                })
                delay(200, function() {
                    maskRect3.attr({
                        height: 86 * 3
                    });
                })
                delay(300, function() {
                    maskRect3.attr({
                        height: 86 * 4
                    });
                })
                delay(400, function() {
                    maskRect3.attr({
                        height: 86 * 5
                    });
                    infoG.attr({
                        mask:null
                    })
                })
            }
        ])
    }
    AuditInfoPanel.prototype.increase = function(index, increment) {
        this.values[0][index - 1] += increment || 1;
        this.update();
    };
    AuditInfoPanel.prototype.audit = function(index, increment) {
        this.values[0][index - 1] -= increment || 1;
        this.values[1][index - 1] += increment || 1;
        this.update();
    };
    AuditInfoPanel.prototype.update = function() {
        this.wt.attr({
            text: this.values[0].reduce(function(a, b) {
                return a + b;
            }, 0)
        });
        this.w1.attr({
            text: this.values[0][0]
        });
        this.w2.attr({
            text: this.values[0][1]
        });
        this.w3.attr({
            text: this.values[0][2]
        });
        this.w4.attr({
            text: this.values[0][3]
        });
        this.w5.attr({
            text: this.values[0][4]
        });

        this.at.attr({
            text: this.values[1].reduce(function(a, b) {
                return a + b;
            }, 0)
        });
        this.a1.attr({
            text: this.values[1][0]
        });
        this.a2.attr({
            text: this.values[1][1]
        });
        this.a3.attr({
            text: this.values[1][2]
        });
        this.a4.attr({
            text: this.values[1][3]
        });
        this.a5.attr({
            text: this.values[1][4]
        });
    };
    return AuditInfoPanel;
})