$(function() {

    function queryResourceFetch(obj) {
        //已取用
        var yq = Snap("#yg_count").node.textContent = obj.totalcount;

        var length = obj.data.length;
        for (var i = 0; i < length; i++) {
            var o = obj.data[i];
            switch (o.name) {
                case '新华社':
                    Snap("#xhs").node.innerHTML = o.count;
                    break;
                case '互联网稿件':
                    Snap("#hlw").node.innerHTML = o.count;
                    break;
                case '集团原创共享':
                    Snap("#jtyc").node.innerHTML = o.count;
                    break;
                case '集团成品库':
                    Snap("#jtcp").node.innerHTML = o.count;
                    break;
            }
        }
    }

    function getHistogram(obj) {

        //已共享稿件数
        Snap("#shareCounts").node.textContent = obj.totalcount;

        //画布大小
        var width = 165;
        var height = 205;

        //在 body 里添加一个 SVG 画布
        $("#columnar_cotent").empty();
        var svg = d3.select("#columnar_cotent");

        //画布周边的空白
        var padding = { left: -6, right: 0, top: 35, bottom: 28 };

        var dataset = obj.data;

        var datValue = [];
        var totalNum = 0;
        for (var i = 0; i < dataset.length; i++) {
            dataset[i].name = dataset[i].name.substring(dataset[i].name.length - 4, dataset[i].name.length);
            datValue.push(dataset[i].value);
            totalNum += dataset[i].value;
        }
        $('.total-num').html(totalNum);
        //x轴的比例尺
        var xScale = d3.scale.ordinal()
            .domain(d3.range(dataset.length))
            .rangeRoundBands([0, width - padding.left - padding.right]);

        //y轴的比例尺
        var yScale = d3.scale.linear()
            .domain([0, d3.max(datValue)])
            .range([height - padding.top - padding.bottom, 0]);

        //定义x轴
        var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("bottom");

        //定义y轴
        var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left");

        //矩形之间的空白
        var rectPadding = 20;

        //添加矩形元素
        var rects = svg.selectAll(".MyRectBg")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "MyRectBg")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d, i) {
                return xScale(i) + rectPadding / 2;
            })
            .attr("width", xScale.rangeBand() - rectPadding)
            .attr("rx", (xScale.rangeBand() - rectPadding) / 2)
            .attr("ry", (xScale.rangeBand() - rectPadding) / 2)
            .attr("height", function(d) {
                return height - padding.bottom - padding.top;
            })
            .attr("fill", "#178da7")
            .attr("fill-opacity", "0.1");

        //添加矩形元素
        var rects = svg.selectAll(".MyRect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "MyRect")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d, i) {
                return xScale(i) + rectPadding / 2;
            })
            .attr("width", xScale.rangeBand() - rectPadding)
            .attr("rx", (xScale.rangeBand() - rectPadding) / 2)
            .attr("ry", (xScale.rangeBand() - rectPadding) / 2)
            .attr("y", function(d) {
                var min = yScale.domain()[0];
                return yScale(min);
            })
            .attr("height", function(d) {
                return 0;
            })
            .attr("fill", "#178da7")
            .transition()
            .delay(function(d, i) {
                return i * 200;
            })
            .duration(2000)
            //.ease("bounce")
            .attr("y", function(d) {
                return yScale(d.value);
            })
            .attr("height", function(d) {
                return height - padding.top - padding.bottom - yScale(d.value);
            });

        //添加文字元素
        var texts = svg.selectAll(".MyText")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "MyText")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d, i) {
                return xScale(i) + rectPadding / 2;
            })
            .attr("dx", function() {
                return (xScale.rangeBand() - rectPadding) / 2;
            })
            .attr("dy", function(d) {
                return 20;
            })
            .text(function(d) {
                return d.value;
            })
            .attr("y", function(d) {
                var min = yScale.domain()[0];
                return yScale(min);
            })
            .attr("fill", "#1cf1f9")
            .attr("font-weight", "bold")
            .attr("font-size", "14px")
            .transition()
            .delay(function(d, i) {
                return i * 200;
            })
            .duration(2000)
            //.ease("bounce")
            .attr("y", function(d) {
                return yScale(d.value) - 30;
            });

        //添加文字元素
        var texts = svg.selectAll(".MyTextx")
            .data(dataset)
            .enter()
            .append("text")
            .attr("class", "MyTextx")
            .attr("transform", "translate(" + padding.left + "," + padding.top + ")")
            .attr("x", function(d, i) {
                return xScale(i) + rectPadding / 2;
            })
            .attr("dx", function() {
                return (xScale.rangeBand() - rectPadding) / 2;
            })
            .attr("dy", function(d) {
                return 20;
            })
            .text(function(d) {
                return d.name;
            })
            .attr("y", function(d) {
                return 135;
            })
            .attr("fill", "#78abcd")
            // .attr("font-weight","bold")
            .attr("font-size", "8px");

        svg.selectAll("MyRect3")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "MyRect3")
            .attr("cy", height - 40)
            .attr("cx", function(d, i) {
                return (xScale(i) + rectPadding / 2) + (xScale.rangeBand() - rectPadding) / 2 + padding.left;
            })
            .attr("r", (xScale.rangeBand() - rectPadding) / 2 - 2)
            .attr("fill", "#131a24");

        svg.selectAll("MyRect4")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("class", "MyRect4")
            .attr("cy", height - 40)
            .attr("cx", function(d, i) {
                return (xScale(i) + rectPadding / 2) + (xScale.rangeBand() - rectPadding) / 2 + padding.left;
            })
            .attr("r", (xScale.rangeBand() - rectPadding) / 2 - 7)
            .attr("fill", "#178da7");
    }

    //稿件审核
    function articleCheck(obj) {
        var daibian = obj.daibian;
        var daishen = obj.daishen

        //待审
        var ds_total = Snap("#ds_total_count").node.textContent = daishen.count;
        $("#ds_wb_cotent").empty();
        $("#ds_wz_cotent").empty();
        $("#ds_wx_cotent").empty();
        $("#ds_app_cotent").empty();
        $("#ds_zm_cotent").empty();
        draw("ds_wb_cotent", daishen.weibo, daishen.count);
        draw("ds_wz_cotent", daishen.website, daishen.count);
        draw("ds_wx_cotent", daishen.weixin, daishen.count);
        draw("ds_app_cotent", daishen.app, daishen.count);
        draw("ds_zm_cotent", daishen.baozi, daishen.count);

        //待编
        var ds_total = Snap("#db_total_count").node.textContent = daibian.count;
        //if(daibian.count > sessionStorage.pagecount){
        run("leftBelow_line", "leftBelow_spaceship", "M0,0 13,0 13,124 23,134 628,134 638,124 638,-237 668,-267 1248,-267 1258,-277 1258,-324 1248,-334 981,-334");
        //}
        //M602,507 615,507 615,631 625,641 1230,641 1240,631 1240,270 1270,240 1850,240 1860,230 1860,183 1850,173 1583,173 M602,507
        //把待编数存入换成，方便判断是否值发生变化
        sessionStorage.pagecount = daibian.count;

        $("#db_wb_cotent").empty();
        $("#db_wz_cotent").empty();
        $("#db_wx_cotent").empty();
        $("#db_app_cotent").empty();
        $("#db_zm_cotent").empty();
        draw("db_wb_cotent", daibian.weibo, daibian.count);
        draw("db_wz_cotent", daibian.website, daibian.count);
        draw("db_wx_cotent", daibian.weixin, daibian.count);
        draw("db_app_cotent", daibian.app, daibian.count);
        draw("db_zm_cotent", daibian.baozi, daibian.count);

        function draw(id, value, count) {
            var r = 20; //外圆半径
            var svg = Snap("#" + id);
            //画圆
            if (value / count == 1) {
                var p = svg.paper.circle(0, 0, r).attr({
                    transform: "translate(50 5)",
                    strokeDasharray: "2,1",
                    stroke: "#24b8db",
                    strokeWidth: 2,
                    fill: "none"
                });
            } else {
                if (count === 0) {
                    progress = 0;
                } else {
                    progress = value / count;
                }
                var circularArc = new CircularArc(r, progress);
                var path = circularArc.drawPath();
                var p = svg.paper.path(path).attr({
                    transform: "translate(50 5)",
                    strokeDasharray: "2,1",
                    stroke: "#24b8db",
                    strokeWidth: 2,
                    fill: "none"
                });
            }
            //画文本
            var text = svg.paper.text(50, 10, value + "").attr({
                fill: "#24b8db",
                textAnchor: "middle",
                fontSize: "12px"

            });
            svg.append(text);
            svg.append(p);
        }
    }

    //编
    function queryHasEdited(obj) {
        //var g = Snap("#bian_count").node.textContent = obj.totalcount;
        if (!sessionStorage.bian_count) {
            sessionStorage.bian_count = 0;
        }
        var demo = new CountUp("bian_count", sessionStorage.bian_count, obj.totalcount, 0, 2.5, options);
        if ((obj.totalcount + "").length > 5) {
            $("#bian_count").css("fontSize", 40);
            $("#bian_count").attr("y", 42);
        }
        demo.start();
        sessionStorage.bian_count = obj.totalcount;

        //移动动画 暂时没做判断
        run("bian_line", "leftBelow_spaceship", "M1561,-210 1561,-128 1555,-120 1395,-120 1385,-110 1385,100 1375,110 1255,110 1245,100 1245,-10 1225,-30 620,-30 600,-10 600,35");
    }

    //发
    function queryHasSigned(obj) {
        //var g = Snap("#edit_count").node.textContent = obj.totalcount;
        if (!sessionStorage.edit_count) {
            sessionStorage.edit_count = 0;
        }
        var demo = new CountUp("edit_count", sessionStorage.edit_count, obj.totalcount, 0, 2.5, options);
        if ((obj.totalcount + "").length > 5) {
            $("#edit_count").css("fontSize", 40);
            $("#edit_count").attr("y", 43);
        }
        demo.start();
        sessionStorage.edit_count = obj.totalcount;
    }

    //资源中心稿件取用情况
    getResquestUrl(domain + "/data/index/resourceFetch.json", queryResourceFetch);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/resourceFetch.json", queryResourceFetch);
    }, millisec);

    //已共享稿件柱状图
    getResquestUrl(domain + "/data/index/histogram.json", getHistogram);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/histogram.json", getHistogram);
    }, millisec);

    //待审已审
    getResquestUrl(domain + "/data/index/articleCheck.json", articleCheck);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/articleCheck.json", articleCheck);
    }, millisec);

    //编
    getResquestUrl(domain + "/data/index/edited.json", queryHasEdited);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/edited.json", queryHasEdited);
    }, millisec);

    //发
    getResquestUrl(domain + "/data/index/signed.json", queryHasSigned);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/signed.json", queryHasSigned);
    }, millisec);
});