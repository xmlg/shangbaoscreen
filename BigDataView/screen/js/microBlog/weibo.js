var cluster_name = 'country_1';

function App() {
    var self = this;
    window.microList = {};
    this.body = d3.select('body');
    this.time = laydate.now() || time;
    this.requestJson(this.time);
    this.startTimingTask();
}
$("body").delegate('.jsList', "click", function() {
    var _this = this;
    var id = $(_this).attr("data-id");
    var eventId = $(_this).attr("data-eventid");
    var eventname = $(_this).attr("data-eventname");
    var tableList = '';
    var microTbody = $(".micro-item-content-tabel-tbody");
    var headTitle = $(".head-title1");
    headTitle.html(eventname);
    //交互
    // var data = bigDataUrl + XNbigUrl + '?&modelid=getWeibohotmessagebyevent&serviceid=weibohotpointmgr&typeid=widget&batch=' + id + "&id=" + eventId;
    var data = '/bigScreen/relatedWeibo?id=' + eventId;
    var htmls = $.ajax({
        type: "get",
        url: data,
        async: false,
    }).responseText;
    htmls = eval("(" + htmls + ")");
    //prams=htmls.DATA.PAGEITEMS;
    prams = htmls;
    if (prams.length > 0) {
        for (var j in prams) {
            tableList += "<a  target=\"value\" href=\"" + prams[j].url + "\"><div class=\"item-list clear\" >" +
                "<div class=\"titleNum1\"></div>" +
                "<div class=\"title\" title=\"" + prams[j].content + "\">" + prams[j].content + "</div>" +
                "</div></a>"
        }
        microTbody.empty();
        microTbody.append(tableList);
    }
})


laydate({
    elem: '#J-xl',
    min: '2017-09-22',
    max: laydate.now()
});
//设置input 默 认时间
$('#J-xl').attr('value', laydate.now());

function getData(time, cluster_name) {
    app.requestJson(time);
}

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestJson();
    }, 60 * 60 * 1000);
}

App.prototype.requestJson = function(time) {
    var self = this;
    // var datas = bigDataUrl + XNbigUrl + "?modelid=getWeibohotPointBykeyid&serviceid=weibohotpointmgr&loadtime=" + time + "&keyid=000";
    var datas = '/bigScreen/hotspot/weibo?time=' + time;
    var url = datas;
    d3.json(url, function(error, data) {
        if (error) {
            console.warn('error:');
            console.warn(error);
            return;
        }

        microList.microList = data;
        self.convertData(data);
    });
}


App.prototype.getLists = function(id, keywords, hotname, eventId) {
    var list = $('.micro-list'),
        microC = $('.micro-item-content'),
        keywords = keywords,
        headtitle = $(".head-title1"),
        tableList = '',
        microTbody = $(".micro-item-content-tabel-tbody"),
        prams = '';
    var fid, fKEYWORDS, fEVENTNAME, feventId;
    microTbody.empty();

    microC.empty();
    var self = this;
    headtitle.html(hotname);
    d3.select('.micro-content .head-title').text(hotname);
    $(".micro-content").css("display", "none");
    var keyword = keywords.split(';');
    setTimeout(function() {
            list.css('right', '3px');
            list.css('opacity', '1');
        }, 500)
        //交互
        // var data = bigDataUrl + XNbigUrl + '?&modelid=getWeibohotmessagebyevent&serviceid=weibohotpointmgr&typeid=widget&batch=' + id + "&id=" + eventId;
    var data = '/bigScreen/relatedWeibo?id=' + eventId;
    var htmls = $.ajax({
        type: "get",
        url: data,
        async: false,
    }).responseText;
    htmls = eval("(" + htmls + ")");
    // prams = htmls.PAGEITEMS;
    prams = htmls;
    if (prams.length > 0) {
        for (var j in prams) {
            tableList += "<a  target=\"value\" href=\"" + prams[j].url + "\"><div class=\"item-list clear\" >" +
                "<div class=\"titleNum1\"></div>" +
                "<div class=\"title\" title=\"" + prams[j].content + "\">" + prams[j].content + "</div>" +
                "</div></a>"
        }
        microTbody.empty();
        microTbody.append(tableList);
    }
}


App.prototype.convertData = function(data) {
    $(".toggleMicroList").css("display", 'none');
    $(".toggleMicroList").slice(0, Math.ceil(data.length / 5)).css("display", "inline")
    var lists1 = [],
        lists2 = [],
        lists3 = [],
        lists4 = [],
        self = this;
    window.num = 1;
    for (var i in data) {
        var item = {};
        item.KEYWORDS = data[i].keyWords;
        item.EVENTNAME = data[i].title;
        item.WEIGHTVALUE = data[i].weightValue;
        item.id = data[i].id;
        item.eventId = data[i].id;
        if (0 <= i & i <= 4) {
            lists1.push(item);
        } else if (4 < i & i <= 9) {
            lists2.push(item)
        } else if (9 < i & i <= 14) {
            lists3.push(item)
        } else if (14 < i & i < 20) {
            lists4.push(item)
        }

    }

    self.render(lists1);
    $(".toggle-micro-list span").eq(num - 1).addClass('itemActive').siblings().removeClass('itemActive')
    setInterval(function() {
        num++;
        if (num == 2) self.render(lists2);
        if (num == 3) self.render(lists3);
        if (num == 4) self.render(lists4);
        if (num > data.length / 5 || num > 5) {
            window.num = 1;
            self.render(lists1);
        }
        $(".toggle-micro-list span").eq(num - 1).addClass('itemActive').siblings().removeClass('itemActive');
    }, 1000 * 30);

    $(".toggleMicroList").on('click', function() {
        console.log("我点击了2")
        $(this).addClass('itemActive').siblings().removeClass('itemActive');
        var Tid = $(this).attr("data-id");
        window.num = Tid;
        if (Tid == 0) {
            if (num == 2) self.render(lists2);
            if (num == 3) self.render(lists3);
            if (num == 4) self.render(lists4);
            num++;
            if (num > 5) {
                num = 1;
                self.render(lists1);
            }
        } else if (Tid == 1) {
            self.render(lists1);
        } else if (Tid == 2) {
            self.render(lists2);
        } else if (Tid == 3) {
            self.render(lists3);
        } else if (Tid == 4) {
            self.render(lists4);
        }

    });
    $(".microblog-hot-list").on('click', function() {
        console.log("我点击了3")
        $(".head-title1").html("微博热点");
        var tableList = '';
        var fid, fKEYWORDS, fEVENTNAME, feventId;

        for (var j in data) {
            fid = data[0].id;
            fKEYWORDS = data[0].keywords;
            fEVENTNAME = data[0].eventname;
            feventId = data[0].event_id;
            tableList += "<div class=\"item-list clear jsList\"  data-id=\"" + data[j].id + "\" data-KEYWORDS=\"" + data[j].keyWords + "\" data-EVENTNAME=\"" + data[j].title + "\" data-eventId=\"" + data[j].id + "\">" +
                "<div class=\"titleNum1\"></div>" +
                "<div class=\"title\" title=\"" + data[j].title + "\">" + data[j].title + "</div>" +
                "</div>"
        }
        $(".micro-item-content-tabel-tbody").empty();
        $(".micro-item-content-tabel-tbody").append(tableList);
        $(".micro-all-list").css("display", "block");
        $(".micro-list").css("width", "700px");

        var list = $('.micro-list');
        list.css('right', '-1500px');
        list.css('opacity', '0');
        setTimeout(function() {
            list.css('right', '3px');
            list.css('opacity', '1');
        }, 500);
    })

}
App.prototype.render = function(data) {
    this.renderIslandsGroup(data);
}
App.prototype.checkKey = function(id) {
    var toopTip = {
        rank: '',
        hotMsg: '',
        keyWord: ''
    };
    var toolContent = '';
    for (var i in microList.microList) {
        if (id == microList.microList[i].id) {
            // toopTip.rank = microList.microList[i].rank;
            toopTip.hotMsg = microList.microList[i].title;
            toopTip.keyWord = microList.microList[i].keyWords;
        }
    };
    toolContent = "<p>热点</p>" +
        "<p>" + toopTip.hotMsg + "</p>" +
        "<p>关键字</p>" +
        "<p>" + toopTip.keyWord + "</p>"

    return toolContent;
}


App.prototype.renderIslandsGroup = function(data) {
    console.log(data, "是我啊")
    var self = this;
    var update = this.body.selectAll('div.islands-group').data(data);
    var enter = update.enter();
    var exit = update.exit();
    var toolTip = d3.select('.toolTip');
    exit.remove();
    enter.append('div').classed('islands-group', true)
        .each(function(d, i) {
            d3.select(this).classed('islands-group' + i, true);
            var content = d3.select(this).append('div').classed('content', true);
            var svg = d3.select(this).append('svg');
            content.text(d.EVENTNAME);
            content.attr('data-id', d.id);
            content.on('mouseenter', function(d, event) {
                    var top = $(this).offset().top;
                    var left = $(this).offset().left;
                    var top = $(this).offset().top;
                    var width = $(this).width();
                    top = top - 70;
                    left = left + width / 2 + 20;
                    var c = self.checkKey(d.id);
                    toolTip.html(c);
                    clearTimeout(window.microList.setLeave);
                    toolTip.style({
                        top: top + 'px',
                        left: left + 'px',
                        opacity: 1
                    })
                })
                .on('mouseleave', function() {
                    window.microList.setLeave = setTimeout(function() {
                        toolTip.style({
                            top: 0,
                            left: 0,
                            opacity: 0
                        })
                    }, 400)

                });
            content.on('click', function(d) {
                console.log("我点击了4", d)
                self.getLists(d.id, d.KEYWORDS, d.EVENTNAME, d.eventId);
            });
            content.append('img')
                .attr('src', 'img/underline.png')
                .classed('underline', true);
            self.renderIslands(svg, d);
        });
    update.each(function(d) {
        var content = d3.select(this).select('div.content');
        var svg = d3.select(this).select('svg');
        content.text(d.EVENTNAME);
        content.attr('data-id', d.id);
        content.on('mouseenter', function(d) {
            var top = $(this).offset().top;
            var left = $(this).offset().left;
            var width = $(this).width();
            top = top - 70;
            left = left + width / 2 + 20;
            var c = self.checkKey(d.id);
            //console.log(c)
            toolTip.html(c);
            //console.log(top)
            clearTimeout(window.microList.setLeave);
            toolTip.style({
                top: top + 'px',
                left: left + 'px',
                opacity: 1
            })
        }).on('mouseleave', function() {
            window.microList.setLeave = setTimeout(function() {
                toolTip.style({
                    top: 0,
                    left: 0,
                    opacity: 0
                })
            }, 400)
        });
        content.on('click', function(d) {
            self.getLists(d.id, d.KEYWORDS, d.EVENTNAME, d.eventId);
        })
        content.append('img')
            .attr('src', 'img/underline.png')
            .classed('underline', true);
        self.renderIslands(svg, d);
    });
}

App.prototype.renderIslands = function(svg, d) {
    var t = d;
    var self = this;
    svg.selectAll('*').remove();
    var color = d3.scale.category10()
        .domain(d3.range(10));
    var keyword = d.KEYWORDS.split(';');
    if (keyword.length < 15) {
        for (var i = 0, l = 15 - keyword.length; i < l; i++) {
            keyword.push('');
        }
    }
    var nodes = keyword.map(function(d, i) {
        var node = {};
        var dx = d3.random.normal(0, 80)(); //正态分布获取关键字的位置
        node.context = d;
        node.id = t.id;
        node.keywords = d;
        node.eventname = t.EVENTNAME;
        node.eventid = t.eventId;
        node.radius = d !== '' ? 20 * Math.random() + 25 : 10 * Math.random() + 10;
        node.x = 600 / 2 + dx;
        node.y = 400 / 2;
        node.oy = 400 / 2 + Math.pow(-1, i) * (Math.random() * 50 + 30 + node.radius / 2);

        return node;
    });
    //添加中心点
    //console.log(d)
    nodes.unshift({
        //context: d.EVENTNAME,
        context: '',
        fixed: true,
        x: 320,
        y: 150,
        oy: 150,
        radius: 75,
        id: d.id,
        keywords: d.KEYWORDS,
        eventname: d.EVENTNAME,
        eventid: d.eventId
    });
    //console.log(nodes)
    var node = svg.selectAll("g")
        .data(nodes)
        .enter().append("g");

    node
        .append('circle')
        .style("fill", function(d, i) {
            return color(i)
        })
        .style("cursor", "pointer")
        .on('click', function(d) {
            self.getLists(d.id, d.keywords, d.eventname, d.eventid);
        })
        .transition()
        .duration(750)
        .delay(function(d, i) {
            return i * 5;
        })
        .attrTween("r", function(d) {
            var i = d3.interpolate(0, d.radius);
            return function(t) {
                return d.radius = i(t);
            };
        });
    node.append("text")
        .text(function(d) {
            return d.context;
        })
        .style({
            'font': '24px "Helvetica Neue", Helvetica, Arial, sans-serif',
            'font-family': 'SimHei',
            'text-anchor': 'middle',
            'pointer-events': 'none',
            'fill': '#ffffff',

        })
        .attr("dy", ".45em")
        .transition()
        .duration(750)
        .delay(function(d, i) {
            return i * 5;
        })
        .styleTween("font-size", function(d) {
            //console.log(d)
            var i = d3.interpolate(0, Math.min(2 * d.radius * 0.9, (2 * d.radius * 0.9 - 8) / this.getComputedTextLength() * 24));
            return function(t) {
                return i(t) + 'px';
            }
        });

    var force = d3.layout.force()
        .nodes([])
        .size([])
        .friction(1)
        .gravity(0.00)
        .charge(0)
        .on("tick", tick)
        .start();

    function tick(e) {
        node
            .each(cluster(10 * e.alpha * e.alpha))
            .each(collide(e.alpha))
            .each(function(d) {
                if (d.fixed) {
                    d.x = 320;
                    d.y = 150;
                }
            })
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function(d) {
            if (d.fixed) {
                return;
            }
            d.y += (d.oy - d.y) * alpha
        };
    }

    var padding = 1.5, // separation between same-color nodes
        clusterPadding = 6, // separation between different-color nodes
        maxRadius = 12;
    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function(d) {
            var r = d.radius * 1.5 + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius * 1.5 + quad.point.radius * 1.5 + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}

var app = new App();
$('.micro-all-list').niceScroll();
$('.micro-content').niceScroll();
$('.micro-list .exit').on('click', function() {
    $('.micro-list').css({
        'right': '-570px',
        'opacity': '0'
    });
})