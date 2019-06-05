function App() {
    var self = this;
    this.total = 0;
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
        this.onfocusIndex++;
        // if (this.onfocusIndex >= this.data.PAGEITEMS.length) {
        if (this.onfocusIndex >= this.data.length) {
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

    // var url = serverDomain + '/wcm/bigdata.do?area=001&cluster_name=country_1&field=000&loaddate=' + today + '&modelid=hotnewslist&pagesize=10&serviceid=areahotpoint&startpage=0&subjectarea=0&typeid=widget';
    var url = '/bigScreen/hotspot/area?areaCode=001';
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
    // data = data.PAGEITEMS;
    data = data;
    this.total = 0;
    data.forEach(element => {
        this.total += parseInt(element.reportNum);
    });
    data.forEach(element => {
        element.percent = parseInt(element.reportNum) / this.total * 100;
    });
    this.renderList(data);
    // this.renderLandMark(data);
    // this.renderOnFocusLandMark(data[this.onfocusIndex]);
    // this.renderOnFocusPath(data[this.onfocusIndex]);
    // this.renderOnFocusChildren(data[this.onfocusIndex]);
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

    console.log(data, "999");
    exit.remove();
    enter.append('li').each(function() {
        d3.select(this).append('div').classed('mark', true);
        d3.select(this).append('div').classed('content', true)
            .append('div').classed('content-inner', true);
        d3.select(this).append('div').classed('source', true)


        var bar = d3.select(this).append('div').classed('bar', true);
        bar.append('div').classed('value', true);
        bar.append('div').classed('bar-outer', true)
            .append('div').classed('bar-inner', true);

    });

    update.each(function(d, i) {
            // console.log(d);
            // console.log(d);
            var contentInner = d3.select(this).select('.content-inner').text(d.title);
            //稿件的点击事件接口没有这个字段先注释---2019.5.28
            // d3.select(this).select('.value').text(d.WEIGHTEDNUMS);
            // 稿件的点击事件接口有问题先注释---2019.5.28
            // d3.select(this).select('.content').attr("sid", d.CLUSTERID);
            d3.select(this).select('.source').text(d.tippingMedia);
            d3.select(this).select('.bar-inner').style('width', d.percent + '%');

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
        //稿件的点击事件接口有问题先注释---2019.5.28
        // $("#list1 .content").off('click').on('click', function() {
        //     var html = '<iframe scrolling="no" src="../../ManuscriptDetail/index.html?clusterid=' + $(this).attr("sid") + '" frameborder="0" width="100%" height="100%"></iframe>'
        //     layer.open({
        //         title: "稿件详情",
        //         //            skin: 'layui-layer-lan',
        //         type: 1,
        //         skin: 'layui-layer-demo', //样式类名
        //         //closeBtn: 0, //不显示关闭按钮
        //         maxmin: true, //开启最大化最小化按钮
        //         anim: 2,
        //         scrollbar: false,
        //         area: ['1347px', '800px'],
        //         shadeClose: false, //开启遮罩关闭
        //         content: html
        //     });
        // })
};


App.prototype.scrolleOnFocusText = function(text) {
    console.log(text)
    window.setTimeout(function() {
        var $text = $(text);
        var containerWidth = $text.width();
        var textWidth = $text[0].scrollWidth;
        console.log($text, containerWidth, $text[0], textWidth)
        if (containerWidth < textWidth) {
            $text.animate({
                left: textWidth - containerWidth + 875 + 'px'
            }, {
                step: function(now, fx) {
                    $(this).css('transform', 'translate(-' + now + 'px,0px)');
                },
                duration: (textWidth / containerWidth) * 8500,
                easing: 'linear',
                complete: function() {
                    $text.css('left', containerWidth + 'px');
                    $text.animate({
                        left: '0px'
                    }, {
                        step: function(now, fx) {
                            $(this).css('transform', 'translate(' + now + 'px,0px)');
                        },
                        duration: 8500,
                        easing: 'linear',
                    });
                }
            });
        }
    }, 500);
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