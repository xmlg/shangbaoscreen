$(document).ready(function() {
    var domain = "http://" + document.domain +":" +window.location.port + "/bbs.do?";

    function init() {
        screen(2100, 1180);
        // todayData();
        // dataSize();
    }
    init();

    /**
     * [todayData 今日数据量对比]
     * @return {[type]} [null]
     */
    // function todayData() {
    //
    //     option = {
    //         series: [{
    //             name: '访问来源',
    //             type: 'pie',
    //             radius: ['58%', '70%'],
    //             avoidLabelOverlap: false,
    //             label: {
    //                 normal: {
    //                     show: false,
    //                     position: 'center'
    //                 },
    //                 emphasis: {
    //                     // show: true,
    //                     // textStyle: {
    //                     //     fontSize: '30',
    //                     //     fontWeight: 'bold'
    //                     // }
    //                 }
    //             },
    //             labelLine: {
    //                 normal: {
    //                     show: false
    //                 }
    //             },
    //             data: [
    //                 { value: 657, name: '纸媒' },
    //                 { value: 117, name: '微博' },
    //                 { value: 20, name: '微信' },
    //                 { value: 1020, name: '网站' },
    //                 { value: 200, name: 'app' }
    //             ],
    //             color: ["#f9986b", "#fff8d7", "#2d567d", "#de9896", "#6acee5"]
    //         }]
    //     };
    //     var myChart = echarts.init(document.getElementById('todayData'));
    //     myChart.setOption(option);
    // }

    // /**
    //  * [dataSize 数据量趋势图]
    //  * @return {[type]} [null]
    //  */
    // function dataSize() {
    //     option = {
    //         xAxis: {
    //             type: 'category',
    //             boundaryGap: false,
    //             data: ['01', '02', '03', '04', '05'],
    //             axisLabel: {
    //                 color: "#69cde2"
    //             },
    //             axisLine: {
    //                 lineStyle: { color: "#69cde2" }
    //             },
    //             axisTick: {
    //                 show: true,
    //                 lineStyle: {
    //                     type: 'solid',
    //                     width: 3
    //                 },
    //                 length: 2
    //             }
    //         },
    //         yAxis: {
    //             type: 'value',
    //             axisLabel: {
    //                 color: "#69cde2",
    //                 formatter: function(value, index){
    //                      return value;
    //                 }
    //             },
    //             splitLine: {
    //                 show: true,
    //                 lineStyle: {
    //                     color: ["#1d3b5a"]
    //                 }
    //             },
    //             axisLine: {
    //                 lineStyle: { color: "#69cde2" }
    //             },
    //             axisTick: {
    //                 show: true,
    //                 lineStyle: {
    //                     type: 'solid',
    //                     width: 3
    //                 },
    //                 length: 2
    //             }
    //         },
    //         series: [{
    //                 name: '最高气温',
    //                 type: 'line',
    //                 data: [11, 11, 15, 13, 12],
    //                 symbol: "circle"
    //             },
    //             {
    //                 name: '最低气温',
    //                 type: 'line',
    //                 data: [1, 6, 2, 5, 3],
    //                 lineStyle: {
    //                     normal: {
    //                         // type: 'dashed',
    //                         width: 1,
    //                         color:'yellow'
    //                     }
    //                 }
    //             },
    //             {
    //                 name: '气温',
    //                 type: 'line',
    //                 data: [8, 4, 6, 9, 7],
    //                 lineStyle: {
    //                     normal: {
    //                         // type: 'dashed',
    //                         width: 1,
    //                         color:'green'
    //                     }
    //                 }
    //             }
    //         ]
    //     };
    //     var myChart = echarts.init(document.getElementById('dataSize'));
    //     myChart.setOption(option);
    // }

    /**
     * [resourceData d]
     * @return {[type]} [description]
     */
    function resourceData() {
        // var url = domain + '';
        // var param = {

        // };
        // sendRequest("get", url, param).then(function(data) {

        // });
        rotate(obj);
    }

    //旋转轮盘
    function rotate(obj) {
        var angle = 70;
        setInterval(function() {
            $("#turntable").css("-webkit-transform", "rotate(" + angle + "deg)");
            switch (angle) {
                case 0:
                    //微博
                    toggle("weibo");
                    break;
                case 70:
                    // 论坛
                    toggle("forum");
                    break;
                case 140:
                    // 新闻
                    toggle("new");
                    break;
                case 210:
                    // 微信
                    toggle("weixin");
                    break;
                case 280:
                    // app客户端
                    toggle("app");
                    break;
            }
            angle += 70;
            if (angle > 280) {
                angle = 0;
            }

        }, 50000);

        function toggle(id) {
            $("#" + id).parent().siblings().removeClass("middle-row-on").addClass("middle-row");
            $("#" + id).parent().removeClass("middle-row").addClass("middle-row-on");
            $("#typeData").children("p").text('');
            $("#typeData").children("span").text('');
        }
    }
});