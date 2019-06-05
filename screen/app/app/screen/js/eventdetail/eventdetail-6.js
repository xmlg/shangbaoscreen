/**
 * Created by Administrator on 2016/7/29.
 */
App.prototype.renderSection6 = function() {
    var self = this;
    if($.isEmptyObject(self.sectionData_6) == false) {
    	///////////////////////feelinghistogramData
        var feelinghistogramData = self.sectionData_6.feelinghistogramData.slice(0,7);
        /////////////////////////////feelingfallsData
        var feelingfallsData = self.sectionData_6.feelingfallsData;
       // console.log(feelingfallsData);
        var fallsarray = [];
        for(var i in feelingfallsData.FEELINGFALLS){
            fallsarray.push(feelingfallsData.FEELINGFALLS[i])
        }
        var svg = d3.select('.section-6 svg');
        var h1 = d3.select('.section-6 h1');
        var texttitle = d3.select('.y-explain');

        function nexttooltippro(m) {
            /*渲染tooltip start*/
            var tooltipG = svg.select('g.tooltip');

            tooltipG.selectAll('line').remove();
            var update = tooltipG.selectAll('line').data(['Z'], function (d, i) {
                return d
            });
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('line');
            update
                .attr({
                    'stroke': '#d0cfcf',
                    'stroke-width': 1,
                    'x1': self.xScale(m),
                    'y1': 0,
                    'x2': self.xScale(m),
                    'y2': -215
                });
            /*渲染tooltip end*/

            /*渲染tooltip start*/
            var tooltipTopG = svg.select('g.tooltip-top');

            tooltipTopG.selectAll('g').remove();
            var update = tooltipTopG.selectAll('g').data([{}]);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('g').each(function () {
                var g = d3.select(this);
                self.img_emotion_bar = g.append('image');
                var text1 = g.append('text').classed('text1', true);
                var text2 = g.append('text').classed('text2', true);

                text1.attr({
                    'stroke-width': 0,
                    'fill': '#00fcff',
                    x: 30,
                    y: -15
                }).text('正面：' + sectionData[m].POSITIVE);
                text2.attr({
                    'stroke-width': 0,
                    'fill': '#00fcff',
                    x: 30,
                    y: 25
                }).text('负面：' + sectionData[m].NEGATIVE);
            });
            update
                .each(function () {
                    var g = d3.select(this);
                    var text1 = g.select('text.text1').attr({x:40});
                    var text2 = g.select('text.text2').attr({x:40});
                    if (m < sectionData.length - 1) {
                        g.attr('transform', 'translate(' + self.xScale(m) + ',-215)');
                        self.img_emotion_bar
                            .attr({
                                	width:118,
                                   height:110,
                                   'xlink:href':'../../../666/img/emotion_03.jpg',
                                   x:22 ,
                                   y:-55,
                            });
                    }
                    else if (m == sectionData.length - 1) {
                        g.attr('transform', 'translate(314,-215)');
                        self.img_emotion_bar
                            .attr(
                                {
                                	//反向更换图片为04
                                   width:123,
                                   height:110,
                                   'xlink:href':'../../../666/img/emotion_04.jpg',
                                   x:5 ,
                                   y:-57,
                                }
                            );
                    }

                    text1.text('正面：' + sectionData[m].POSITIVE);
                    text2.text('负面：' + sectionData[m].NEGATIVE);
                });
            /*渲染tooltip end*/
        }

        function nextfallstooltip(m) {
            /*渲染tooltip start*/
            var tooltipG = svg.select('g.tooltip');
            tooltipG.selectAll('line').remove();
            var update = tooltipG.selectAll('line').data(['p'], function (d, i) {
                return d
            });
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('line');
            update
                .attr({
                    'stroke': '#d0cfcf',
                    'stroke-width': 1,
                    'x1': self.xScale(m),
                    'y1': 0,
                    'x2': self.xScale(m),
                    'y2': -215
                });
            /*渲染tooltip end*/

            /*渲染tooltip start*/
            var tooltipTopG = svg.select('g.tooltip-top');

            tooltipTopG.selectAll('g').remove();
            var update = tooltipTopG.selectAll('g').data([{}]);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('g').each(function () {
                var g = d3.select(this);
                self.img_emotion_bar2 = g.append('image');
                var text1 = g.append('text').classed('text1', true);
                var text2 = g.append('text').classed('text2', true);
                var text3 = g.append('text').classed('text3', true);
                var text4 = g.append('text').classed('text4', true);
                var img1 = g.append('image').classed('img1', true);


                text1.attr({
                    'stroke-width': 0,
                    'fill': '#00fcff',
                    x: 30,
                    y: -15
                }).text('今日：' + '' + '' + sectionData[m].TODAYVALUE);
                text2.attr({
                    'stroke-width': 0,
                    'fill': '#00fcff',
                    x: 30,
                    y: 5
                }).text('昨日：' + '' + '' + sectionData[m].YESTERDAYVALUE);
                text3.attr({
                    'stroke-width': 0,
                    'fill': '#00fcff',
                    x: 30,
                    y: 25
                }).text("变化：")
                text4.attr({
                    'stroke-width': 0,
                    'fill': '#00fcff',
                    x: 90,
                    y: 25
                }).text(sectionData[m].CHANGE);
                img1.attr({
                    'stroke-width': 0,
                    x: 65,
                    y: 10,
                    'height': 18,
                    'width': 25

                })


            });
            update
                .each(function () {
                    var g = d3.select(this);
                    var text1 = g.select('text.text1');
                    var text2 = g.select('text.text2');
                    var text3 = g.select('text.text3');
                    var text4 = g.select('text.text4');
                    var img1 = g.select('image.img1');
                    if (m < sectionData.length - 1) {
                        g.attr('transform', 'translate(' + self.xScale(m) + ',-215)');
                        self.img_emotion_bar2
                            .attr({
                               width:118,
                                   height:110,
                                   'xlink:href':'../../../666/img/emotion_03.jpg',
                                   x:22 ,
                                   y:-55,
                            });
                    }
                    else if (m == sectionData.length - 1) {
                        g.attr('transform', 'translate(314,-215)');
                         self.img_emotion_bar2
                            .attr({
                               width:118,
                                   height:110,
                                   'xlink:href':'../../../666/img/emotion_04.jpg',
                                   x:22 ,
                                   y:-55,
                            });
                    }

                    text1.text('今日：' + sectionData[m].TODAYVALUE);
                    text2.text('昨日：' + sectionData[m].YESTERDAYVALUE);
                    text3.text('变化：');
                    text4.text(sectionData[m].CHANGE);
                    if (sectionData[m].CHANGE > 0) {
                        img1.attr({
                            'xlink:href': 'img/change-up.png'
                        })
                    }
                    else {
                        img1.attr({
                            'xlink:href': 'img/change-down.png'
                        })
                    }
                });
            /*渲染tooltip end*/
        }
        if (self.carouselIndexSection6 == 0) {
            var sectionData = feelinghistogramData;
        	//console.log(sectionData)
            h1.text("情感柱状图");
            texttitle.text('文章数');
			//var feelinghistogramData = feelinghistogramData.slice(0,7);
            var endtime = new Date(feelinghistogramData[0].DATE);
            var maxValue = d3.max(sectionData, function (d, i) {
                return Math.max(d.POSITIVE, d.NEGATIVE);
            });

            renderxy(sectionData, endtime, maxValue);

            /*渲染rect start*/
            var main = svg.select('g.main');
            main.selectAll('g').remove();
            var update = main.selectAll('g').data(sectionData);
            var enter = update.enter();
            var exit = update.exit();
		//	console.log(sectionData);
            exit.remove();
            enter
                .append('g')
                .attr('transform', function (d, i) {
                    return 'translate(' + self.xScale(i) + ',0)';
                })
                .each(function (d, i) {
                    var g = d3.select(this);
                    var rect0 = g.append('rect').classed('rect0', true);
                    var rect1 = g.append('rect').classed('rect1', true);

                    rect0.attr({
                        'x': -10,
                        'y': -100,
                        'width': 20,
                        'height': 0,
                        'fill': '#e34153',
                        'stroke-width': 0
                    });

                    rect1.attr({
                        'x': -10,
                        'y': -100,
                        'width': 20,
                        'height': 0,
                        'fill': '#00fcff',
                        'stroke-width': 0
                    })
                });

            update
                .each(function (d, i) {
                    var g = d3.select(this);
                    var rect0 = g.select('rect.rect0', true);
                    var rect1 = g.select('rect.rect1', true);

                    rect0
                        .transition()
                        .duration(3000)
                        .attr({
                            'y': -self.yScale(d.POSITIVE),
                            'height':self.yScale(d.POSITIVE)-100
                        });
				//	console.log(self.yScale(d.POSITIVE));
                    rect1
                        .transition()
                        .duration(3000)
                        .attr({
                            'y': -100,
                            'height': 100-self.yScale(-d.NEGATIVE)
                        });
                    /*渲染rect end*/
                });

        }
        /////////////////////////
        /////////////////////////////
        
        else if (self.carouselIndexSection6 == 1) {
            var sectionData = fallsarray.reverse();

            h1.text("情感瀑布");
            texttitle.text("情感值");

            var endtime = new Date(feelingfallsData.CURDATESTR);
          //  console.log(feelingfallsData);
          //  console.log(endtime);
            
            var maxCout = d3.max(sectionData, function (d, i) {
                return Math.max(d.YESTERDAYVALUE, d.TODAYVALUE);
            });
			var maxChange = d3.max(sectionData,function(d,i){
				return Math.max(d.CHANGE);
			})
			var maxValue = Math.max(maxChange,maxCout);
			
            renderxy(sectionData, endtime, maxValue);

            /*渲染rect start*/
            var main = svg.select('g.main');

            main.selectAll('g').remove();

            var update = main.selectAll('g').data(sectionData);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter
                .append('g')
                .attr('transform', function (d, i) {
                    return 'translate(' + self.xScale(i) + ',0)';
                })
                .each(function (d, i) {
                    var g = d3.select(this);
                    var rect0 = g.append('rect').classed('rect0', true);

                    rect0.attr({
                        'x': -10,
                        'y': -100,
                        'width': 20,
                        'height': 0,
                        'stroke-width': 0
                    });
                    if (d.CHANGE > 0) {
                        rect0.attr({
                            'fill': '#e34153'
                        })
                    }
                    else if (d.CHANGE <= 0) {
                        rect0.attr({
                            'fill': '#00fcff'
                        })
                    }
                });

            update
                .each(function (d, i) {
                    var g = d3.select(this);
                    var rect0 = g.select('rect.rect0', true);

                    
                        rect0.transition()
                        .duration(3000)
                    if (d.CHANGE > 0) {
                    	//console.log(-self.yScale(3));
                    //	console.log(d.CHANGE)
                        rect0.attr({
                            'y': -self.yScale1(d.TODAYVALUE),
                            'height': self.yScale(d.CHANGE) - 100
                        });
                    }
                    else if (d.CHANGE <= 0) {
                        rect0.attr({
                            'y': -self.yScale1(d.YESTERDAYVALUE),
                            'height': self.yScale(-d.CHANGE) - 100
                        });
                    }

                    /*渲染rect end*/
                });


        }
        self.nextindex && self.nextindex.stop();
        self.nextindex = new TimedTask(function () {
            self.nexttoolindex();
            return 2000
        }, 0)
        self.nexttoolindex = function () {
            if (self.carouselIndexSection6 == 0) {
                nexttooltippro(self.tooltipindex);
            }
            else if (self.carouselIndexSection6 == 1) {
                nextfallstooltip(self.tooltipindex);
            }
            self.tooltipindex++;
            if (self.tooltipindex >= 7) {
                self.tooltipindex = 0;
            }
        };
        self.tooltipindex = 0;
        self.nexttoolindex();
        self.nextindex.start();
        function renderxy(sectionData, endtime, maxValue) {
            //渲染X Y轴
            var starttime = endtime - 7 * 24 * 60 * 60 * 1000;
            var startDate = new Date(starttime);
            var endDate = new Date(endtime);

            self.xScale = d3.time.scale()
                .domain([0, sectionData.length - 1])
                .range([50, 475]);

            self.yTicks = d3.scale.linear()
                .domain([-maxValue, maxValue])
                .ticks(3);

            if (self.yTicks[self.yTicks.length - 1] < maxValue && self.yTicks.length >= 2) {
                var step = self.yTicks[1] - self.yTicks[0];
                self.yTicks.unshift(self.yTicks[0] - step);
                self.yTicks.push(self.yTicks[self.yTicks.length - 1] + step);
            }

            self.yScale = d3.scale.linear()
                .domain([self.yTicks[0], self.yTicks[self.yTicks.length - 1]])
                .range([0, 200]);

            /*渲染x-axis start*/
            var xTickScale = d3.time.scale()
                .domain([0, sectionData.length - 1])
                .range([startDate, endDate]);

            var xTicks = d3.range(0, sectionData.length).map(function (d, i) {
                return xTickScale(d);
            });

            var xAxis = svg.select('g.x-axis');

            var update = xAxis.selectAll('text').data(xTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('text');
            update.text(function (d, i) {
                    var date = new Date(d);
                    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
                })
                .attr({
                    x: function (d, i) {
                        return self.xScale(i);
                    },
                    y: 20,
                    'font-size': '12px',
                    'stroke': 'none',
                    'fill': '#278FAA',
                    'text-anchor': 'middle'
                });

            var update = xAxis.selectAll('line').data(xTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('line');
            update
                .attr({
                    'x1': function (d, i) {
                        return self.xScale(i);
                    },
                    'y1': 0,
                    'x2': function (d, i) {
                        return self.xScale(i);
                    },
                    'y2': -7,
                    'stroke': "#2f98d3",
                    'stroke-width': 2
                });

            /*渲染x-axis end*/

            /*渲染y-axis start*/
            var yAxis = svg.select('g.y-axis');

            var update = yAxis.selectAll('text').data(self.yTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('text');
            update.text(function (d, i) {
                    return d;
                })
                .attr({
                    'y': function (d, i) {
                        return -self.yScale(d) + 5;
                    },
                    'x': '-10',
                    'font-size': '12px',
                    'stroke': 'none',
                    'fill': '#278FAA',
                    'text-anchor': 'end'
                });

            var update = yAxis.selectAll('line').data(self.yTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('line');
            update
                .attr({
                    'x1': 0,
                    'y1': function (d, i) {
                        return -self.yScale(d);
                    },
                    'x2': -7,
                    'y2': function (d, i) {
                        return -self.yScale(d);
                    },
                    'stroke': "#2f98d3",
                    'stroke-width': 2
                });
            /*渲染y-axis end*/

        }
        //渲染情感值
        function renderxyqg(sectionData, endtime, maxValue) {
            //渲染X Y轴
            var starttime = endtime - 7 * 24 * 60 * 60 * 1000;
            var startDate = new Date(starttime);
            var endDate = new Date(endtime);

            self.xScale = d3.time.scale()
                .domain([0, sectionData.length - 1])
                .range([50, 475]);

            self.yTicks = d3.scale.linear()
                .domain([-maxValue, maxValue])
                .ticks(3);

            if (self.yTicks[self.yTicks.length - 1] < maxValue && self.yTicks.length >= 2) {
                var step = self.yTicks[1] - self.yTicks[0];
                self.yTicks.unshift(self.yTicks[0] - step);
                self.yTicks.push(self.yTicks[self.yTicks.length - 1] + step);
            }

            self.yScale = d3.scale.linear()
                .domain([self.yTicks[0], self.yTicks[self.yTicks.length - 1]])
                .range([0, 200]);
			self.yScale1 = d3.scale.linear()
                .domain([self.yTicks[0], self.yTicks[self.yTicks.length - 2]])
                .range([0, 200]);
            /*渲染x-axis start*/
            var xTickScale = d3.time.scale()
                .domain([0, sectionData.length - 1])
                .range([startDate, endDate]);

            var xTicks = d3.range(0, sectionData.length).map(function (d, i) {
                return xTickScale(d);
            });

            var xAxis = svg.select('g.x-axis');

            var update = xAxis.selectAll('text').data(xTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('text');
            update.text(function (d, i) {
                    var date = new Date(d);
                    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
                })
                .attr({
                    x: function (d, i) {
                        return self.xScale(i);
                    },
                    y: 20,
                    'font-size': '12px',
                    'stroke': 'none',
                    'fill': '#278FAA',
                    'text-anchor': 'middle'
                });

            var update = xAxis.selectAll('line').data(xTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('line');
            update
                .attr({
                    'x1': function (d, i) {
                        return self.xScale(i);
                    },
                    'y1': 0,
                    'x2': function (d, i) {
                        return self.xScale(i);
                    },
                    'y2': -7,
                    'stroke': "#2f98d3",
                    'stroke-width': 2
                });

            /*渲染x-axis end*/

            /*渲染y-axis start*/
            var yAxis = svg.select('g.y-axis');

            var update = yAxis.selectAll('text').data(self.yTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('text');
            update.text(function (d, i) {
                    return d;
                })
                .attr({
                    'y': function (d, i) {
                        return -self.yScale(d) + 5;
                    },
                    'x': '-10',
                    'font-size': '12px',
                    'stroke': 'none',
                    'fill': '#278FAA',
                    'text-anchor': 'end'
                });

            var update = yAxis.selectAll('line').data(self.yTicks);
            var enter = update.enter();
            var exit = update.exit();

            exit.remove();
            enter.append('line');
            update
                .attr({
                    'x1': 0,
                    'y1': function (d, i) {
                        return -self.yScale(d);
                    },
                    'x2': -7,
                    'y2': function (d, i) {
                        return -self.yScale(d);
                    },
                    'stroke': "#2f98d3",
                    'stroke-width': 2
                });
            /*渲染y-axis end*/

        }
    }
}
