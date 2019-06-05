$(document).ready(function() {
    var domain = "http://" + document.domain +":" +window.location.port + "/cb";
    //var domain = "http://192.168.110.100/bbs.do?";

    function init() {
        transact();
        transactCount();
        transactRanking();
        currentTransact1();
        currentTransact2();
        screen(1920, 1080);
    }
    init();

    /**
     * [transact 办理情况]
     * @return {[type]} [description]
     */
    function transact() {
       // var url = domain + "format=json&id=singcere_netwz&mod=apis&action=search&status=10&page=1&perpage=8";
        var url = domain + "/data/5/data9.json";
        /*var param = {
            strhandledateline: dataHandle.GetDateStr(-14),
            endhandledateline: new Date().Format("yyyy-MM-dd")
        };*/
        sendRequest("get", url, {}).then(function(data) {
            var html = "";
            for (var i = 0; i < data.data.length; i++) {
                var obj = data.data[i];
                html += template(obj);
            }
            $("#transactList").append(html);
        });
    }

    function template(obj) {
        var status1 = obj.wz_dateline ? "已受理" : "未受理";
        var status2 = obj.wz_accept_timeout == 1 ? "超时" : "未超时";
        var evaluate;
        switch (obj.wz_satisfaction_status) {
            case "0":
                evaluate = "未评论";
                break;
            case "1":
                evaluate = "满意";
                break;
            case "2":
                evaluate = "满意";
                break;
            case "-1":
                evaluate = "不满意";
                break;
            case "-2":
                evaluate = "不满意";
                break;
            default:
                evaluate = '';
                break;
        }

        return "<tr>" +
            "  <td class=\"table3-word1 table3-td1\" >" + obj.subject + "</td>" +
            "  <td class=\"table3-word2 table3-td2\">" + obj.dateline + "</td>" +
            "  <td class=\"table3-word3 table3-td3\" >" + obj.wz_tousername + "</td>" +
            "  <td class=\"table3-word2 table3-td4\">" + obj.wz_dateline + "</td>" +
            "  <td class=\"table3-word4 table3-td5\" >" + status2 + "</td>" +
            "  <td class=\"table3-word1 table3-td6\">" + status1 + "</td>" +
            "  <td class=\"table3-td7\">" + evaluate + "</td>" +
            "  <td class=\"table3-word2 table3-td8\"><span class=\"content-3-border\">" + obj.views + "</span></td>" +
            "</tr>";
    }

    /**
     * [transactCount 办理统计]
     * @return {[type]} [description]
     */
    function transactCount() {
        //var url = domain + "format=json&id=singcere_netwz&mod=apis&action=yearstat&page=1&perpage=8";
    	var url = domain + "/data/5/data8.json";
        /*var param = {
            year: new Date().getFullYear()
        };*/
        sendRequest("get", url, {}).then(function(data) {
            statistics(data.data); //柱状图
            bjRatio(data.data); //办结率
        });
    }

    function statistics(data) {
        var x = [];
        var y_count = []; //总量
        var y_bj = []; //办结
        var y_bl = []; //办理
        for (var i in data) {
            x.push(i);
            y_count.push(data[i].allCount);
            y_bj.push(data[i].reCount);
            y_bl.push(parseInt(data[i].allCount) -parseInt(data[i].reCount));
        }
        var option = {
            grid: {
                show: true,
                left: 30,
                right: 1,
                top: 40,
                bottom: '10%',
                borderColor: "#124662"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [{ name: '发帖总量(条)', icon: 'circle' }, { name: '办结(条)', icon: 'circle' }, { name: '正在办理(条)', icon: 'circle' }],
                algin: "left",
                right: 20,
                textStyle: {
                    color: "#fff",
                    fontSize: '14px'
                }
            },
            calculable: true,
            xAxis: [{
                type: 'category',
                data: x,
                axisLabel: {
                    color: "#357ea5",
                    fontSize: 14
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ["#124662"]
                    }
                },
                axisLine: {
                    lineStyle: { color: "#124662" }
                },
                axisTick: {
                    show: false
                }
            }],
            yAxis: [{
                type: 'value',
                axisLabel: {
                    color: "#357ea5"
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ["#124662"]
                    }
                },
                axisLine: {
                    lineStyle: { color: "#124662" }
                },
                axisTick: {
                    show: false
                }
            }],
            series: [{
                    name: '发帖总量(条)',
                    type: 'bar',
                    data: y_count,
                    itemStyle: {
                        normal: {
                            color: "#2c6e91 "
                        }
                    },
                    barGap: '5%',
                    barWidth: '15px'
                },
                {
                    name: '办结(条)',
                    type: 'bar',
                    data: y_bj,
                    itemStyle: {
                        normal: {
                            color: "#489497 "
                        }
                    },
                    barGap: '5%',
                    barWidth: '15px'
                },
                {
                    name: '正在办理(条)',
                    type: 'bar',
                    data: y_bl,
                    itemStyle: {
                        normal: {
                            color: "#f09469 "
                        }
                    },
                    barGap: '5%',
                    barWidth: '15px'
                }
            ]
        };

        var myChart = echarts.init(document.getElementById('transactCount'));
        myChart.setOption(option);
    }

    function bjRatio(obj) {
        var bjl = $("#bjl");
        for (var i in obj) {
            var result = Math.round((obj[i].reCount / obj[i].allCount) * 100) + "%";
            bjl.append("<li>" + result + "</li>");
        }
    }
    /**
     * [transactRanking 总受理排行榜]
     * @return {[type]} [description]
     */
    function transactRanking() {
       // var url = domain + "format=json&id=singcere_netwz&mod=apis&action=unityearstat&page=1&perpage=8";
    	var url = domain + "/data/5/data7.json";
        var param = {
            year: "all"
        };
        sendRequest("get", url, param).then(function(data) {
            var ranking = $("#ranking");
            var j = 0;
            for (var i in data.data) {
                if (j >= 8) { return; }
                ranking.append(rankingTem(data.data[i], j));
                j++;
            }
        });
    }

    function rankingTem(obj, i) {
        return "<tr>" +
            "<td class=\"table5-td1\">" + obj.name + "</td>" +
            "<td class=\"table5-td2\">" + obj.acceptCount + "</td>" +
            "<td class=\"table5-td3\">" + obj.reCount + "</td>" +
            "<td class=\"table5-td4\">" + obj.reProportion + "</td>" +
            "</tr>";
    }

    /**
     * [currentTransact 问政总体办理情况1]
     * @return {[type]} [description]
     */
    function currentTransact1() {
        //var url = domain + "format=json&id=singcere_netwz&mod=apis&action=intro&type=obj";
    	var url = domain + "/data/5/data6.json";
        /*var param = {
            gid: '',
            strdateline: dataHandle.GetDateStr(-(new Date().getDate() - 1)),
            enddateline: new Date().Format("yyyy-MM-dd")
        };*/
        sendRequest("get", url, {}).then(function(data) {
            $("#month").html(new Date().getMonth() + 1);
            $("#ftzl").html(data.threadlistCount); //网民发帖总量
            $("#jztw").html(data.acceptCount); //价值贴文
            $("#bj").html(data.reCount); //办结
            $("#ybjl").html(data.reProportion); //办结率
            $("#zzbl").html(data.handleCount); //正在办理
            $("#yrzdw").html(data.userNew); //月入住
        });

    }

    /**
     * [currentTransact 问政总体办理情况2]
     * @return {[type]} [description]
     */
    function currentTransact2() {
        var url = domain + "/data/5/data5.json";
        sendRequest("get", url, {}).then(function(data) {
            $("#rzbm").html(data.userCount); //总入住部门
            $("#djl").html(data.viewsCountNumber); //总点击量
        });
    	/*var content = obj.content;
    	$("#rzbm").html(content.userCount); //总入住部门
        $("#djl").html(content.viewsCountNumber); //总点击量
*/    }
    	/*getResquestUrl(domain + "/data/5/data5.json", currentTransact2);
    	setInterval(function() {
            getResquestUrl(domain + "/data/5/data5.json", currentTransact2);
        }, millisec);*/

    

});