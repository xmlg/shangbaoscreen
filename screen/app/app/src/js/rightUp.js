$(function() {

    function queryOrigin(obj) {
        //采集总数
        var totalcount = obj.totalcount;

        //采
        //var yc_count = Snap("#yc_cai").node.textContent = totalcount;
        if (!sessionStorage.yc_cai) {
            sessionStorage.yc_cai = 0;
        }
        var demo = new CountUp("yc_cai", sessionStorage.yc_cai, totalcount, 0, 2.5, options);
        if ((totalcount + "").length > 5) {
            $("#yc_cai").css("fontSize", 40);
            $("#yc_cai").attr("y", 93);
        }
        demo.start();
        sessionStorage.yc_cai = totalcount;

        //if (totalcount > sessionStorage.daibianCount) {
        run("middleUp_line", "spaceship", "M0,0 0,95 -20,113 -713,113 -732,91 -732,-1");
        //}
        //把采集总数存入换成，方便判断是否值发生变化
        sessionStorage.daibianCount = totalcount;

        //原创稿件总数
        $("#original_content").empty();
        drawOriginal(totalcount);

        //新闻，图片，视频稿件
        var len = obj.data.length;
        for (var i = 0; i < len; i++) {
            var o = obj.data[i];
            switch (o.name) {
                case '文字稿件':
                    drawNew(o, totalcount);
                    break;
                case '图片稿件':
                    drawImage(o, totalcount);
                    break;
                case '视频稿件':
                    drawVideo(o, totalcount);
                    break;
            }
        }
    }

    //原创稿件总数
    function drawOriginal(totalcount) {
        var svg = Snap("#original_content");
        var g = svg.paper.g().attr({
            transform: "matrix(1 0 0 1 215 315)"
        });
        var text1 = g.paper.text(20, 0, totalcount).attr({
            fill: "#00b5ea",
            fontSize: "14px",
            textAnchor: "middle",
            stroke: "none"
        });

        var text2 = g.paper.text(0, 11, "原创稿件").attr({
            fill: "#6897b4",
            stroke: "none",
            fontSize: "10px"
        });
        g.add(text1, text2);
        svg.append(g);
    }
    //新闻稿件
    function drawNew(obj, totalcount) {
        var svg = Snap("#original_content");
        var g = svg.paper.g().attr({
            transform: "matrix(1 0 0 1 270 430.5)"
        });

        if (obj.count / totalcount) {
            var progress = obj.count / totalcount;
        } else {
            var progress = 0;
        }
        if (progress == 1) {
            var path = svg.paper.circle(0, 0, 32).attr({
                stroke: "#c5536c",
                strokeWidth: 2,
                strokeDasharray: "3,2",
                fill: "none"
            });
        } else {
            var circularArc = new CircularArc(32, progress);
            var path = g.paper.path(circularArc.drawPath()).attr({
                stroke: "#c5536c",
                strokeWidth: 2,
                strokeDasharray: "3,2",
                fill: "none"
            });
        }
        var text1 = g.paper.text(-135, 3, obj.name).attr({
            fontSize: "10px",
            stroke: "none",
            fill: "#0ba5c6"
        });
        var text2 = g.paper.text(-70, 20, obj.count + "").attr({
            fontSize: "10px",
            stroke: "none",
            fill: "white",
            textAnchor: "middle"
        });
        var text3 = g.paper.text(0, 8, obj.count + "").attr({
            fontSize: "20.22px",
            stroke: "none",
            fill: "#1df1f9",
            textAnchor: "middle"
        });
        g.add(path, text1, text2, text3);
        svg.append(g);

    }
    //图片稿件
    function drawImage(obj, totalcount) {
        var svg = Snap("#original_content");
        var g = svg.paper.g().attr({
            transform: "matrix(1 0 0 1 117 512)"
        });
        if (obj.count / totalcount) {
            var progress = obj.count / totalcount;
        } else {
            var progress = 0;
        }

        if (progress == 1) {
            var path = svg.paper.circle(0, 0, 32).attr({
                stroke: "#c5536c",
                strokeWidth: 2,
                strokeDasharray: "3,2",
                fill: "none"
            });
        } else {
            var circularArc = new CircularArc(24, progress);
            var path = g.paper.path(circularArc.drawPath()).attr({
                stroke: "#c5536c",
                strokeWidth: 2,
                strokeDasharray: "3,2",
                fill: "none"
            });
        }
        var text1 = g.paper.text(86, 3, obj.name).attr({
            fontSize: "10px",
            stroke: "none",
            fill: "#0ba5c6"
        });
        var text2 = g.paper.text(59, 20, obj.count + "").attr({
            fontSize: "10px",
            stroke: "none",
            fill: "white",
            textAnchor: "middle"
        });
        var text3 = g.paper.text(0, 8, obj.count + "").attr({
            fontSize: "20.22px",
            stroke: "none",
            fill: "#1df1f9",
            textAnchor: "middle"
        });
        g.add(path, text1, text2, text3);
        svg.append(g);

    }
    //视频稿件
    function drawVideo(obj, totalcount) {
        var svg = Snap("#original_content");
        var g = svg.paper.g().attr({
            transform: "matrix(1 0 0 1 404 493)"
        });
        if (obj.count / totalcount) {
            var progress = obj.count / totalcount;
        } else {
            var progress = 0;
        }

        if (progress == 1) {
            var path = svg.paper.circle(0, 0, 32).attr({
                stroke: "#c5536c",
                strokeWidth: 2,
                strokeDasharray: "3,2",
                fill: "none"
            });
        } else {
            var circularArc = new CircularArc(28, progress);
            var path = g.paper.path(circularArc.drawPath()).attr({
                stroke: "#c5536c",
                strokeWidth: 2,
                strokeDasharray: "3,2",
                fill: "none"
            });
        }
        var text1 = g.paper.text(-130, 8, obj.name).attr({
            fontSize: "10px",
            stroke: "none",
            fill: "#0ba5c6"
        });
        var text2 = g.paper.text(-62, 26, obj.count + "").attr({
            fontSize: "10px",
            stroke: "none",
            fill: "white",
            textAnchor: "middle"
        });
        var text3 = g.paper.text(0, 8, obj.count + "").attr({
            fontSize: "20.22px",
            stroke: "none",
            fill: "#1df1f9",
            textAnchor: "middle"
        });
        g.add(path, text1, text2, text3);
        svg.append(g);
    }

    //互联网稿件
    function queryInternet(obj) {
        var content = obj.content;
        //源
        //var yc = Snap("#yc_yuan").node.textContent = content.TOTAL;

        if (!sessionStorage.yc_yuan) {
            sessionStorage.yc_yuan = 0;
        }
        var demo = new CountUp("yc_yuan", sessionStorage.yc_yuan, content.TOTAL, 0, 2.5, options);
        if ((content.TOTAL + "").length > 2) {
            $("#yc_yuan").css("fontSize", 40);
            $("#yc_yuan").attr("y", 42);
        }
        demo.start();
        sessionStorage.yc_yuan = content.TOTAL;

        //动画 暂时没做判断 
        run("yuan_line", "leftBelow_spaceship", "M816,186 816,78 796,58 130,58 110,78 110,185");

        //互联网总数
        var hlwgj = Snap("#hlwgj_count").node.textContent = content.TOTAL;
        //邮件稿
        var yjg = Snap("#yjg_count").node.textContent = content.EMAIL;
        //新华社稿件
        var xhsgj = Snap("#xhsgj_count").node.textContent = content.XHS;
        //互联网稿件子集
        for (i in content) {
            switch (i) {
                case 'SZB':
                    $("#szb_cotent").empty();
                    drawInternet("szb_cotent", content.SZB, content.SZB / content.TOTAL);
                    break;
                case 'APP':
                    $("#app_cotent").empty();
                    drawInternet("app_cotent", content.APP, content.APP / content.TOTAL);
                    break;
                case 'WEIBO':
                    $("#wb_cotent").empty();
                    drawInternet("wb_cotent", content.WEIBO, content.WEIBO / content.TOTAL);
                    break;
                case 'WEIXIN':
                    $("#wx_cotent").empty();
                    drawInternet("wx_cotent", content.WEIXIN, content.WEIXIN / content.TOTAL);
                    break;
                case 'WEBSITE':
                    $("#website_cotent").empty();
                    drawInternet("website_cotent", content.WEBSITE, content.WEBSITE / content.TOTAL);
                    break;
            }
        }
    }

    function drawInternet(id, value, percent) {
        var svg = Snap("#" + id);
        var g = svg.paper.g().attr({
            fill: "#21a3c0",
            stroke: "none"
        });
        var rect1 = g.paper.rect(40, 0, 93, 15, 8, 8).attr({
            stroke: "#09687d",
            strokeWidth: 1,
            fill: "none"
        });
        var length = 15 * percent;
        var x = 48;
        for (var i = 0; i < length; i++) {
            if (i === 0) {
                g.add(g.paper.path("M47,2 A5 5 90 10 47 12"));
            } else if (i === 14) {
                g.add(g.paper.path("M126,2 A5 5 90 1 1 126 12"));
            } else {
                g.add(g.paper.rect(x, 2, 5, 10));
                x += 6;
            }
        }
        g.add(rect1);

        var text = svg.paper.text(140, 10, value).attr({
            fontSize: 10.11,
            fill: "#1bf2f8",
            stroke: "none"
        });

        svg.add(g);
        svg.add(text);
    }

    //原创稿件
    getResquestUrl(domain + "/data/index/right/data5.json", queryOrigin);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/right/data5.json", queryOrigin);
    }, millisec);

    //互联网稿件
    getResquestUrl(domain + "/data/index/right/data7.json", queryInternet);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/right/data7.json", queryInternet);
    }, millisec);

});