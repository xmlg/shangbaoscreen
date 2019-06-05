define(function(require) {
        var BorderType2 = require('components/BorderType1');
    var util = require('tool/util');
    var dataManager = require('tool/dataManager');
    
    function TopRelease(parent, w, h) {
        BorderType2.call(this, parent, w, h);
        var self = this;

        this.renderIndex = true;
        this.lastRenderIndex = true;

        window.setInterval(function() {
            self.renderIndex = !self.renderIndex;
        }, 15 * 1000)
    }
    TopRelease.prototype = Object.create(BorderType2.prototype);
    TopRelease.constructor = TopRelease;
    TopRelease.prototype.init = function() {
        var self = this;
        this.d3g = d3.select(this.snapElement.g().attr({
            transform: 'matrix(1,0,0,1,-123,-108)'
        }).node);
        BorderType2.prototype.init.call(this, function() {
            //console.log(self.d3g);
            self.setTitle('原创稿件部门排行榜');
            self.render();
        });
    };
    TopRelease.prototype.update = function() {
        this.render();
    }
    TopRelease.prototype.render = function() {
        var self = this;
        if(self.renderIndex != self.latRenderIndex) {
            self.latRenderIndex = self.renderIndex;
            if(self.renderIndex) {
                self.setTitle('原创稿件部门排行榜');
            } else {
                self.setTitle('原创稿件分社排行榜');
            }
        }
        if(self.renderIndex) {
            var data = util.clone(dataManager.getData().TOPRELEASE.DEPTS).sort(function(a, b) {
                return b.COUNT - a.COUNT;
            });
        } else {
            var data = util.clone(dataManager.getData().TOPRELEASE.SUBS).sort(function(a, b) {
                return b.COUNT - a.COUNT;
            });
        }

        var wScale = d3.scale.linear().domain(d3.extent(data, function(d) {
            return d.COUNT
        })).range([10, 80]);

        var update = self.d3g.selectAll('g').data(data, function(d) {
            return d.DEPARTMENTNAME;
        });
        var enter = update.enter();
        var exit = update.exit();

        exit.remove();
        enter.append('g')
            .each(function(d, i) {
                var g = d3.select(this).attr('transform', 'translate(0,' + i * 25 + ')');
                var name = g.append('text').classed('name', true)
                    .attr({
                        fill: '#ffffff'
                    })
                    .style({
                        'font-size': '13px',
                        'font-family': 'SimHei'
                    });;
                var value = g.append('text').classed('value', true)
                    .attr({
                        x: 215,
                        fill: '#ffffff',
                        'text-anchor': 'start',
                    })
                    .style({
                        'font-size': '14px',
                        'font-family': 'SimHei'
                    });
                var rect = g.append('rect');

                name.text(d.DEPARTMENTNAME);
                value.text(d.COUNT);
                rect.attr({
                    x: 120,
                    y: -10,
                    width: 0,
                    height: 10,
                    fill: '#31A0D1',
                    opacity: 0.5
                })
            });
        update.each(function(d, i) {
            var g = d3.select(this);
            var name = g.select('text.name');
            var value = g.select('text.value');
            var rect = g.select('rect');

            g.transition().attr('transform', 'translate(0,' + i * 25 + ')');

            name.text(d.DEPARTMENTNAME);
            value.text(d.COUNT);
            rect.transition().attr({
                width: wScale(d.COUNT)
            });

        })
    }
    return TopRelease;
});