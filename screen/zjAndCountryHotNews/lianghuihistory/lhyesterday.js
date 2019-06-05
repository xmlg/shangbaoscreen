function App() {


    var self = this;
    this.total = 0;
    this.svg0 = d3.select('#svg0');
    this.mainG = d3.select('#svg0').append('g').classed('mainG', true);
    this.onFocusLineG = d3.select('#svg0').append('g').classed('onFocusLineG', true);
    this.onFocusChildG = d3.select('#svg0').append('g').classed('onFocusChildG', true);
    this.onFocusMainG = d3.select('#svg0').append('g').classed('onFocusMainG', true);

    this.list1 = d3.select('#list1');

    this.projection = d3.geo.conicConformal()
        .scale(12100)
        .translate([385, 470])
        .rotate([-120, -29, 4.5]);

    this.pathGenerator = d3.geo.path()
        .projection(this.projection);

    this.onfocusIndex = 0;
    this.focusNextRecordTask = new TimedTask(function() {
        var nextRecord = self.focusNextRecord();
        if (nextRecord && nextRecord.LNG && nextRecord.LAT && nextRecord.CHILDERNS) {
            return 20000 + nextRecord.CHILDERNS.length * 1000;
        }
        return 21000;
    }, 0);
    this.requestDataTask = new TimedTask(function() {
        self.requestData();
        return 60000;
    }, 0);
    this.focusNextRecordTask.start();
    this.requestDataTask.start();
};

App.prototype.focusNextRecord = function() {
    if (this.data) {
        // console.log(this.onfocusIndex);
        this.onfocusIndex++;
        // console.log(this.data);
        if (this.onfocusIndex >= this.data.PAGEITEMS.length) {
            this.onfocusIndex = 0;
        }
        this.render(this.data);
        return this.data[this.onfocusIndex];
    }
}

App.prototype.requestData = function() {
    var self = this;
    //var url  =  '../mlfdp/js/areahotpoint/zj.json'
    var id = self.getUrlParams("id");
    var scene_level = self.getUrlParams("scene_level");
    var myDate = new Date();
    var today = myDate.format("yyyy-MM-dd");
    var url =  '/lhjk/getJson?name=comparehotpoint'

    d3.json(url, function(error, data) {
        if (error || $.isEmptyObject(data) == true) {
            console.warn('error:');
            console.warn(error);
            return;
        }
        self.data = data;
        self.render(data);
    });
};

/**
 * [getUrlParams description] 获取路由参数
 * @param  {[type]} params [description] 要获取的参数名
 * @return {[type]}        [description]
 */
App.prototype.getUrlParams = function(params) {
    var self = this;
    var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
    var paramsData = window.location.search.substr(1).match(reg);
    return !!paramsData ? paramsData[2] : "0";
};

App.prototype.render = function(data) {
    data = data;
    this.total = 0;
    data.forEach(element => {
        this.total += parseInt(element.REPORTNUM);
});
    data.forEach(element => {
        element.percent =  parseInt(element.REPORTNUM)/this.total*100;
});
    this.renderList(data);
    this.renderLandMark(data);
    this.renderOnFocusLandMark(data[this.onfocusIndex]);
    this.renderOnFocusPath(data[this.onfocusIndex]);
    this.renderOnFocusChildren(data[this.onfocusIndex]);
};

App.prototype.renderList = function(data) {
    var self = this;
    var domain = d3.extent(data, function(d) {
        return d.WEIGHTEDNUMS;
    });
    var scale = d3.scale.linear()
        .domain(domain)
        .range([25, 80]);

    var update = this.list1.selectAll('li').data(data);
    var enter = update.enter();
    var exit = update.exit();

    console.log(data);
    exit.remove();
    enter.append('li').each(function() {
        d3.select(this).append('div').classed('mark', true);
        d3.select(this).append('div').classed('content', true)
            .append('div').classed('content-inner', true);
        d3.select(this).append('div').classed('REPORTNUM', true)
        d3.select(this).append('div').classed('EVENTTIPPING', true)
        // d3.select(this).append('div').classed('FIRSTMEDIA', true)
        d3.select(this).append('div').classed('FIRSTTIME', true)


        // var bar = d3.select(this).append('div').classed('bar', true);
        // bar.append('div').classed('value', true);
        // bar.append('div').classed('bar-outer', true)
        // 	.append('div').classed('bar-inner', true);

    });

    update.each(function(d, i) {
        console.log(d);
        // console.log(d);
        // console.log(d);
        var contentInner = d3.select(this).select('.content-inner').text(d.title);
        d3.select(this).select('.REPORTNUM').text(d.clusternum17);
        d3.select(this).select('.EVENTTIPPING').text(d.clusternum18);
        d3.select(this).select('.content').attr("sid",d.clusterid18);
        // d3.select(this).select('.FIRSTMEDIA').text(d.DOCAUTHOR);
        d3.select(this).select('.FIRSTTIME').text(d.loadtime);
        // d3.select(this).select('.bar-inner').style('width', d.percent + '%');

        if (i === self.onfocusIndex) {
            d3.select(this).classed('focus', true);
            var bar1 = d3.select(this)[0];
            var bar2 = $(bar1).children();
            var bar3 = $(bar2)[2];
            var bar_children = $(bar3).children()[1];
            $(bar_children).addClass('focus2');
            self.scrolleOnFocusText(contentInner[0][0]);
        } else {
            d3.select(this).classed('focus', false);
            var bar1 = d3.select(this)[0];
            var bar2 = $(bar1).children();
            var bar3 = $(bar2)[2];
            var bar_children = $(bar3).children()[1];
            $(bar_children).removeClass('focus2');
        }
    })

    $("#list1 .content").off('click').on('click',function () {
        var html = '<iframe scrolling="no" src="../../ManuscriptDetail/lianghuiDetail.html?type=all&clusterid='+$(this).attr("sid")+'" frameborder="0" width="100%" height="100%"></iframe>'
        layer.open({
            title: "稿件详情",
//            skin: 'layui-layer-lan',
            type: 1,
            skin: 'layui-layer-demo', //样式类名
            //closeBtn: 0, //不显示关闭按钮
            maxmin: true, //开启最大化最小化按钮
            anim: 2,
            scrollbar:false,
            area: ['1347px', '800px'],
            shadeClose: false, //开启遮罩关闭
            content: html
        });
    })
};

App.prototype.renderLandMark = function(data) {
    var self = this;
    // console.log(data)
    var domain = d3.extent(data, function(d) {
        return d.WEIGHTEDNUMS;
    });
    this.scale = d3.scale.linear()
        .domain(domain)
        .range([50, 100]);

    var update = this.mainG.selectAll('g').data(
        data.filter(function(d) {
            return  d.LAT && d.LNG;
        }));
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append("g").each(function(d, i) {
        var mark = d3.select(this);
        var onFocus = (i === self.onfocusIndex);
        var pro = self.projection([d.LNG, d.LAT]);

        var size = self.scale(d.WEIGHTEDNUMS);

        mark
            .attr('transform', 'translate(' + pro[0] + ',' + pro[1] + ')')
            .transition()
            .duration(1000)
            .tween('', function() {
                return function(t) {
                    mark.call(d3.dynamicSymbol.mark(size, 'rgba(255,255,0,0.5)', t, d.FLAGFORZB));
                }
            });
    });
    update.each(function(d, i) {
        var mark = d3.select(this);
        var onFocus = (i === self.onfocusIndex);
        var pro = self.projection([d.LNG, d.LAT]);

        var size = self.scale(d.WEIGHTEDNUMS);

        mark.call(d3.dynamicSymbol.mark(size, 'rgba(255,255,0,0.5)', 1, d.FLAGFORZB));
    });
}

App.prototype.renderOnFocusLandMark = function(data) {
    var self = this;

    var size = 150;
    var update = this.onFocusMainG.selectAll('g.main').data(data.LNG && data.LAT ? [data] : []);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append("g").classed('main', true);
    update.each(function(d, i) {
        var mark = d3.select(this);
        var pro = self.projection([d.LNG, d.LAT]);

        mark
            .attr('transform', 'translate(' + pro[0] + ',' + pro[1] + ')')
            .transition()
            .duration(1000)
            .tween('', function() {
                return function(t) {
                    mark.call(d3.dynamicSymbol.mark01(size, 'rgba(255,255,0,0.8)', t, d.FLAGFORZB));
                }
            });

    });
}

App.prototype.renderOnFocusPath = function(data) {
    var self = this;

    var update = this.onFocusLineG.selectAll('g.path').data(data.LNG && data.LAT ? data.CHILDERNS : []);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('g').classed('path', true)
        .each(function(d, i) {
            var linearGradient = d3.select(this).append('linearGradient').attr('id', 'linearGradient' + i);
            linearGradient.append('stop')
                .attr({
                    offset: "0%",
                    style: 'stop-color:rgb(255,255,0);stop-opacity:0.1'
                });
            linearGradient.append('stop')
                .attr({
                    offset: "50%",
                    style: 'stop-color:rgb(255,255,0);stop-opacity:1'
                });
            linearGradient.append('stop')
                .attr({
                    offset: "100%",
                    style: 'stop-color:rgb(255,255,0);stop-opacity:0.1'
                });
            d3.select(this).append('path').classed('main', true);
            d3.select(this).append('path').classed('bg', true);;
        });
    update.each(function(d, i) {
        var x0 = self.projection([data.LNG, data.LAT])[0];
        var y0 = self.projection([data.LNG, data.LAT])[1];
        var x1 = self.projection([d.LNG, d.LAT])[0];
        var y1 = self.projection([d.LNG, d.LAT])[1];

        var mx = (x0 + x1) / 2;
        var my = (y0 + y1) / 2;

        var dx = 100;
        var dy = 0;
        if (y1 - y0 == 0) {
            dy = 100;
            dx = 0;
        } else {
            dy = -((dx) * (x1 - x0)) / (y1 - y0);
        }
        var s = 0.2 * Math.pow((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0), 0.5) / Math.pow(dy * dy + dx * dx, 0.5);

        if (y1 < y0) {
            dx = -dx;
            dy = -dy;
        }

        var linearGradient = d3.select(this).select('linearGradient');
        if ((x1 - x0) >= 0 && (y1 - y0) >= 0) {
            linearGradient.attr({
                x1: '0%',
                y1: '0%',
                x2: '100%',
                y2: '100%'
            });
        } else if ((x1 - x0) >= 0 && (y1 - y0) <= 0) {
            linearGradient.attr({
                x1: '0%',
                y1: '100%',
                x2: '100%',
                y2: '0%'
            });
        } else if ((x1 - x0) <= 0 && (y1 - y0) <= 0) {
            linearGradient.attr({
                x1: '100%',
                y1: '100%',
                x2: '0%',
                y2: '0%'
            });
        } else if ((x1 - x0) <= 0 && (y1 - y0) >= 0) {
            linearGradient.attr({
                x1: '100%',
                y1: '0%',
                x2: '0%',
                y2: '100%'
            });
        }

        var path = d3.select(this).select('path.main');
        var pathBg = d3.select(this).select('path.bg');

        pathBg.attr({
            stroke: 'none',
            'stroke-width': 0,
            fill: 'url(#linearGradient' + i + ')',
            style: 'filter:url(#glow)'
        })
            .transition()
            .delay(i * 100)
            .duration(5000)
            .attrTween('d', function() {
                return function(t) {
                    if (t < 0.5) {
                        return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], 0, t * 2, 100, 3);
                    } else {
                        return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], (t - 0.5) * 2, 1, 100, 3);
                    }
                }
            });

        path.attr({
            stroke: 'none',
            'stroke-width': 0,
            fill: 'url(#linearGradient' + i + ')'
        })
            .transition()
            .delay(i * 100)
            .duration(5000)
            .attrTween('d', function() {
                return function(t) {
                    if (t < 0.5) {
                        return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], 0, t * 2, 100, 2);
                    } else {
                        return getBesselSegmentD([x0, y0], [mx + dx * s, my + dy * s], [x1, y1], (t - 0.5) * 2, 1, 100, 2);
                    }
                }
            });
    })
}

App.prototype.renderOnFocusChildren = function(data) {
    var self = this;

    var update = this.onFocusChildG.selectAll('g.child').data(data.LNG && data.LAT ? data.CHILDERNS : []);
    var enter = update.enter();
    var exit = update.exit();

    var size = 50;

    exit.remove();
    enter.append('g').classed('child', true);
    update.each(function(d, i) {
        var mark = d3.select(this);
        var pro = self.projection([d.LNG, d.LAT]);
        mark.call(d3.dynamicSymbol.mark02(0, '#74E0FF', '#F4F075', 0));
        mark.attr('transform', 'translate(' + pro[0] + ',' + pro[1] + ')')
            .transition()
            .delay(2500 + i * 100)
            .duration(2500)
            .tween('', function() {
                return function(t) {
                    mark.call(d3.dynamicSymbol.mark02(size, '#74E0FF', '#F4F075', t, d.FLAGFORZB));
                }
            });
    });
}

App.prototype.scrolleOnFocusText = function(text) {
    window.setTimeout(function() {
        var $text = $(text);
        var containerWidth = $text.width();
        var textWidth = $text[0].scrollWidth;
        if (containerWidth < textWidth) {
            $text.animate({
                left: textWidth - containerWidth + 875 + 'px'
            }, {
                step: function(now, fx) {
                    $(this).css('transform', 'translate(-' + now + 'px,0px)');
                },
                duration: (textWidth / containerWidth) *8500,
                easing: 'linear',
                complete: function() {
                    $text.css('left', containerWidth + 'px');
                    $text.animate({
                        left: '0px'
                    }, {
                        step: function(now, fx) {
                            $(this).css('transform', 'translate(' + now + 'px,0px)');
                        },
                        duration:8500,
                        easing: 'linear',
                    });
                }
            });
        }
    }, 500);
}

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

var app = new App();

function setTime() {
    var str = '';
    var date = new Date();

    var month = date.getMonth() + 1;
    str += date.getFullYear() + '-';
    str += date.getMonth() + 1 + '-';
    str += date.getDate() + '';

    d3.select('#timer').text(str);
    d3.select('.col1-span').text(str)
}
setTime();

window.setInterval(setTime, 1000);