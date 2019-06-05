$(function(argument) {
    //今日爆料
    function weiboBomb(obj) {
        var jrbl_wb = Snap("#jrbl_wb").node.textContent = obj.content.WEIBO; //微博
        var jrbl_phone = Snap("#jrbl_phone").node.textContent = obj.content.PHONE; //电话
        var jrbl_total = Snap("#jrbl_total").node.textContent = obj.content.TOTAL; //总和
    }

    //今日政策
    function recentpolicy(obj) {
        var jrzc_provice = Snap("#jrzc_provice").node.textContent = obj.content.PROVICE; //全国政策
        var jrzc_country = Snap("#jrzc_country").node.textContent = obj.content.COUNTRY; //宁夏政策
        var jrzc_todaytotal = Snap("#jrzc_total").node.textContent = obj.content.TODAYTOTAL; //总和
        //var jrzc_total = Snap("#ce").node.textContent = obj.content.TOTAL; //总和
        if (!sessionStorage.ce) {
            sessionStorage.ce = 0;
        }
        var demo = new CountUp("ce", sessionStorage.ce, obj.content.TOTAL, 0, 2.5);
        if ((obj.content.TOTAL + "").length > 5) {
            $("#ce").css("fontSize", 40);
            $("#ce").attr("y", 276);
        }
        demo.start();
        sessionStorage.ce = obj.content.TOTAL;
    }

    //今日灾害
    function recentdisaster(obj) {
        var g = Snap("#jrzh_count").node.textContent = obj.content.TOTAL;
    }

    //今日热点
    function statisticInfo(obj) {
        //聚类总数
        //var ju = Snap("#ju").node.textContent = obj.content.TOTALCOUNT;
        if (!sessionStorage.ju) {
            sessionStorage.ju = 0;
        }
        var demo = new CountUp("ju", sessionStorage.ju, obj.content.TOTALCOUNT, 0, 2.5, options);
        if ((obj.content.TOTALCOUNT + '').length > 5) {
            $("#ju").css("fontSize", 40);
            $("#ju").attr("y", 225);
        }
        demo.start();
        sessionStorage.ju = obj.content.TOTALCOUNT;
        //今日热点总数
        var g = Snap("#jrrd_count").node.textContent = obj.content.CURRENTTOTOAL;

        //重新获取数据之前删除所有子节点
        $("#jrrd_child").empty();

        draw("1 0 0 1 130 350", obj.content.NETWORK, obj.content.CURRENTTOTOAL, "一类新闻网站热点");
        draw("1 0 0 1 130 370", obj.content.HOTPOINT, obj.content.CURRENTTOTOAL, "按行业分类热点");
        draw("1 0 0 1 130 390", obj.content.AREATOTAL, obj.content.CURRENTTOTOAL, "按地域分类热点");
        
    }
    /**
     * [draw description]
     * @param  {[type]} coordinate [坐标]
     * @param  {[type]} value      [某个条热点值]
     * @param  {[type]} total      [总数]
     * @param  {[type]} name       [热点名称]
     * @return {[type]}            [null]
     */
    function draw(coordinate, value, total, name, svg) {

        var svg = Snap("#jrrd_child");

        var g1 = svg.paper.g().attr({
            transform: "matrix(" + coordinate + ")"
        });
        var text1 = g1.paper.text(0, 8, name).attr({
            textAnchor: "end",
            fontSize: 7.08
        });
        var text2 = g1.paper.text(93, 11, value).attr({
            textAnchor: "end",
            fontSize: 10.11,
            fill: "#1df1f9"
        });

        var rect1 = g1.paper.rect(8, 0, 87, 14, 8, 8).attr({
            fill: "none",
            stroke: "#09687d"
        });

        var g2 = g1.paper.g().attr({
            fill: "#21a3c0",
            stroke: "none"
        });
        var number = 14 * (value / total);
        var n = 16;
        for (var i = 0; i < number; i++) {
            //n += 6;
            if (i === 0) {
                g2.add(g2.paper.path("M15,2 A5 5 90 10 15 12"));
            } else if (i === 13) {
                g2.add(g2.paper.path("M88,2 A5 5 90 1 1 88 12"));
            } else {
                g2.add(g2.paper.rect(n, 2, 5, 10));
                n += 6;
            }
        }
        g1.add(g2, text1, text2, rect1);
        svg.add(g1);
    }

    //选题稿件
    function topicManuscript(obj) {
        var len = 0;
        if (obj.data) {
            len = obj.data.length;
        }

        for (var i = 0; i < len; i++) {
            var data = obj.data[i];
            switch (data.name) {
                case '今日报题':
                    var jrbt = Snap("#jrbt_count").node.textContent = data.value;
                    break;
                case '今日选题':
                    var jrxt = Snap("#jrxt_count").node.textContent = data.value;
                    break;
                case '今日任务':
                    var jrrw = Snap("#jrrw_count").node.textContent = data.value;
                    break;
                case '今日审批':
                    var jrsp = Snap("#jrsp_count").node.textContent = data.value;
                    break;
            }
        }
    }

    //今日历史事件
    function todayInHistory(obj) {
        var counts = obj.summary_info.ITEMCOUNT;
        var jrlssj = Snap("#jrlssj");

        //总数
        jrlssj.append(jrlssj.paper.text(435, 205, counts).attr({
            class: "today_num"
        }));

        //文章列表
        var len = obj.content.length;
        var i = 0;
        var t;
        function lbyl() {
            if (i >= len) {
                i = 0;
            }
             var content = obj.content[i].CONTENT;
            $("p").lbyl({
                content: content.substring(0, 30),
                speed: 100,
                type: 'show',
                fadeSpeed: 1000
            });
            t = setTimeout(function() {
                lbyl();
            }, 10000);
            i++;
        }
        lbyl();
    }

    //今日爆料   
    getResquestUrl(domain + "/data/index/leftUp/data8.json", weiboBomb);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/leftUp/data8.json", weiboBomb);
    }, millisec);

    //今日政策
    getResquestUrl(domain + "/data/index/leftUp/data9.json", recentpolicy);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/leftUp/data9.json", recentpolicy);
    }, millisec);

    //今日灾害
    getResquestUrl(domain + "/data/index/leftUp/data10.json", recentdisaster);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/leftUp/data10.json", recentdisaster);
    }, millisec);

    //今日热点
    getResquestUrl(domain + "/data/index/leftUp/data11.json", statisticInfo);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/leftUp/data11.json", statisticInfo);
    }, millisec);

    //选题稿件
    getResquestUrl(domain + "/data/index/leftUp/data12.json", topicManuscript);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/leftUp/data12.json", topicManuscript);
    }, millisec);

    //今日历史事件
    getResquestUrl(domain + "/data/index/leftUp/data13.json", todayInHistory);
    // setInterval(function() {
    //     getResquestUrl(domain + "/wcm/bigdata.do?typeid=zyzx&serviceid=BigScreen&modelid=todayInHistory", todayInHistory, "post");
    // }, millisec);
});