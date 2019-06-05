/**
 * 客户端日访问总量
 */
function getClientVisitTotleBar(categoryArry, khdfwArry, title) {
    var khdfwfzVal = Math.max.apply(null, khdfwArry);
    khdfwfzVal = khdfwfzVal / 10 * 4 + khdfwfzVal;
    return {
        title: {
            text: toThousandsForChart(title),
            textStyle: {
                color: '#1ac7cf',
                fontWeight: 'bold',
                fontSize: 32,
                fontFamily: 'Quartz Regular',
                align: 'center',
                verticalAlign: 'center',
            },
            left: 'center',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            // top: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                show: false,
                color: "#69cde2",
                formatter: function(value, index) {
                    return value;
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#1d3b5a"]
                }
            },
            axisLine: {
                show: false,
                lineStyle: { color: "#69cde2" }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    type: 'solid',
                    width: 3
                },
                length: 2
            }
        },
        yAxis: {
            type: 'category',
            // boundaryGap: ['20%', '20%'],
            data: categoryArry,
            axisLabel: {
                color: "#69cde2",
                fontSize: 16
            },
            axisLine: {
                show: false,
                lineStyle: { color: "#69cde2" }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    type: 'solid',
                    width: 3
                },
                length: 2
            }
        },
        series: [{
                name: '客户端日访问总量',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        distance: -370,
                        color: '#fff',
                        fontFamily: 'Quartz Regular',
                        fontSize: 16,
                        // formatter: '{c}'
                        formatter: function(params) {
                            return toThousandsForChart(params);
                        }
                    }
                },
                barWidth: '80%',
                itemStyle: {
                    normal: {
                        barBorderRadius: [0, 30, 30, 0],
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1, [{
                                    offset: 0,
                                    color: '#00feff'
                                        // color: '#37add3'
                                },
                                {
                                    offset: 0.5,
                                    color: '#027eff'
                                        // color: '#37add3'
                                },
                                {
                                    offset: 1,
                                    color: '#0286ff'
                                        // color: '#0599c8'
                                }
                            ]
                        )
                    }
                },
                data: khdfwArry,
                zlevel: 11

            },
            {
                name: '辅助系列',
                type: 'bar',
                barWidth: '80%',
                barGap: '-100%',
                data: [khdfwfzVal, khdfwfzVal, khdfwfzVal, khdfwfzVal, khdfwfzVal],
                itemStyle: {
                    normal: {
                        barBorderRadius: [0, 30, 30, 0],
                        color: '#0d121a'
                    }
                },
                zlevel: 9
            },

        ]
    }
}
/**
 * 客户端用户总量
 * @param {*} categoryArry 
 * @param {*} khdyhArry 
 * @param {*} khdyhfzArry 
 */
function getClientUserTotleBar(categoryArry, khdyhArry, khdyhfzArry) {
    return {
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'shadow'
        //     }
        // },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '1%',
            top: '1%',
            containLabel: true
        },
        xAxis: {
            // max: 300,
            splitLine: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            axisTick: {
                show: false
            }
        },
        yAxis: [{
            type: 'category',
            inverse: false,
            data: categoryArry,
            axisLabel: { //坐标轴刻度标签的相关设置
                color: "#7eb2d5",
                fontSize: 16
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            }
        }],
        series: [{
                name: '客户端用户总量',
                type: 'pictorialBar',
                // barWidth: 100,
                symbol: 'rect',
                symbolSize: ['20%', 20],
                symbolPosition: 'start',
                symbolOffset: [5, 0], //偏移量
                // symbolMargin: '20!',
                symbolRepeat: true,
                // barCategoryGap: 22,
                // symbolBoundingData: 700000,
                label: {
                    normal: {
                        show: true,
                        position: 'left', //标签的位置
                        distance: -320,
                        color: '#1df1f9',
                        fontSize: 16,
                        fontFamily: 'Quartz Regular',
                        // formatter: '{c}'
                        formatter: function(params) {
                            return toThousandsForChart(params);
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#45A0CF',
                        // borderColor: '#45A0CF'
                    }
                },
                // z: 20,
                data: khdyhArry
            },
            {
                name: '辅助系列',
                type: 'bar',
                barWidth: 30,
                barCategoryGap: '10%', //22,
                data: khdyhfzArry,
                itemStyle: {
                    normal: {
                        color: 'rgba(255,255,255,0.1)',
                        borderColor: '#09687e', //['#09687e','#f19802','#09687e','#09687e','#09687e'],
                        borderWidth: 3,
                        barBorderRadius: [0, 20, 20, 0]
                    }
                },
                z: 9
            },

        ]
    };
}
/**
 * 官方微博用户总量
 * @param {*} categoryArry 
 * @param {*} gfwoyhArry 
 */
function getGfwbUserTotleBar(categoryArry, gfwoyhArry, title) {
    var gfwoyhfzVal = Math.max.apply(null, gfwoyhArry);
    gfwoyhfzVal = gfwoyhfzVal % 10 + gfwoyhfzVal;
    var option = {
        title: {
            text: toThousandsForChart(title),
            textStyle: {
                color: '#1ac7cf',
                fontWeight: 'bold',
                fontSize: 32,
                align: 'center',
                verticalAlign: 'center',
                fontFamily: 'Quartz Regular',
            },
            left: 'center',
        },
        yAxis: {
            type: 'value', //数值轴
            axisLabel: {
                show: false,
                color: "#69cde2",
                formatter: function(value, index) {
                    return value;
                }
            },
            splitLine: {
                show: false,
                lineStyle: {
                    color: ["#1d3b5a"]
                }
            },
            axisLine: {
                show: false,
                lineStyle: { color: "#69cde2" }
            },
            axisTick: {
                show: false,
                lineStyle: {
                    type: 'solid',
                    width: 3
                },
                length: 2
            }
        },
        xAxis: {
            type: 'category', //'category' 类目轴，适用于离散的类目数据，为该类型时必须通过 data 设置类目数据。
            // boundaryGap: ['20%', '20%'],
            data: categoryArry,
            axisLabel: { //坐标轴刻度标签的相关设置
                color: "#7eb2d5",
                fontSize: 18,
                fontWeight: 'bold'
            },
            axisLine: { //坐标轴轴线相关设置
                lineStyle: { color: "#2c556d" }
            },
            axisTick: { //坐标轴刻度相关设置
                show: false,
                lineStyle: {
                    type: 'solid',
                    width: 3
                },
                length: 2
            }
        },
        series: [{
                name: '官方微博用户量',
                type: 'bar',
                label: {
                    normal: {
                        show: true,
                        position: 'top', //标签的位置
                        distance: 10,
                        // color: '#fff',
                        fontSize: 24,
                        fontFamily: 'Quartz Regular',
                        // formatter: '{c}'
                        formatter: function(params) {
                            return toThousandsForChart(params);
                        }
                    }
                },
                barWidth: 60,
                itemStyle: {
                    normal: {
                        barBorderRadius: [20, 20, 20, 20],
                        // color: '#0599c8',
                        // color: ['#e4007f','#00ff00','#00b7ee','#f39800'],
                    }
                },
                data: gfwoyhArry,
                zlevel: 11

            },
            {
                name: '辅助系列',
                type: 'bar',
                barWidth: 60,
                barGap: '-100%',
                barCategoryGap: 22,
                data: [gfwoyhfzVal, gfwoyhfzVal, gfwoyhfzVal, gfwoyhfzVal],
                itemStyle: {
                    normal: {
                        barBorderRadius: [20, 20, 20, 20],
                        color: '#ffffff' //'#172231'
                    }
                },
                zlevel: 9
            },

        ]
    };
    return option;
}

function toThousandsForChart(params) {
    var num = (params.value || params || 0).toString(),
        result = '';
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result;
}
//集团稿件总数情况 -- 稿件占比echarts
function ycData(TitleContent, Data) {
    // var chartyc = echarts.init(document.getElementById('chartyc'));
    var option = {
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{b}: {c} ({d}%)"
        },
        title: {
            // text: '原创占比',
            text: TitleContent,
            x: 'center',
            y: '47%',
            textStyle: {
                color: 'rgba(30,144,255,0.8)',
                fontFamily: '微软雅黑',
                fontSize: 20,
            }
        },
        color: ['#507bee', '#ffbb56', '#07de65', '#f05396', '#0f9ad3'],
        calculable: false,
        series: [{
            name: '',
            type: 'pie',
            radius: ['38%', '52%'],
            center: ['50%', '55%'],
            // for funnel
            x: '50%',
            width: '35%',
            funnelAlign: 'left',
            max: 1048,
            label: {
                normal: {
                    // formatter: '{b|{b}:}{c}',
                    formatter: function(params) {
                        var percent = 0;
                        var total = 0;
                        for (var i = 0; i < Data.length; i++) {
                            total += Data[i].value;
                        }
                        percent = ((params.value / total) * 100).toFixed(0);
                        if (params.name !== '') {
                            return params.name + '' + percent + '%';
                        } else {
                            return '';
                        }
                    },
                    padding: [-20, -16, -2, -26],
                    fontSize: 18,
                    rich: {
                        per: {
                            color: '#eee',
                            backgroundColor: '',
                            padding: [3, 4],
                            borderRadius: 2,
                            fontSize: 18
                        }
                    }
                }
            },
            // data: [{
            //         value: Data.paper.originalNum,
            //         name: '电子报'
            //     },
            //     {
            //         value: Data.web.originalNum,
            //         name: '网站'
            //     },
            //     {
            //         value: Data.weixin.originalNum,
            //         name: '微信'
            //     },
            //     {
            //         value: Data.app.originalNum,
            //         name: 'APP'
            //     },
            //     {
            //         value: Data.weibo.originalNum,
            //         name: '微博'
            //     }
            // ]
            data: Data
        }]
    };
    return option;
}
//集团稿件总数情况 -- 稿件占比柱状图echarts
function bar1Data(Data, gjChecked, ycChecked) {
    var Data = Data;
    var showData = [];
    var data1 = {
        name: '稿件总数',
        type: 'bar',
        show: false,
        barWidth: 30,
        label: {
            normal: {
                show: true,
                position: 'top',
                color: '#ffffff',
                fontSize: 20
            }
        },
        itemStyle: {
            emphasis: {
                barBorderRadius: 30
            },
            normal: {
                barBorderRadius: [15, 15, 15, 15],
                color: '#00f1f2',
                label: {
                    show: true
                }
            }
        },
        data: [Data.paper.allNum, Data.weibo.allNum, Data.app.allNum, Data.web.allNum, Data.weixin.allNum]
    };
    var data2 = {
        name: '原创稿件',
        type: 'bar',
        show: false,
        barWidth: 30,
        label: {
            normal: {
                show: true,
                position: 'top',
                color: '#ffffff',
                fontSize: 20,
            }
        },
        itemStyle: {
            emphasis: {
                barBorderRadius: 30
            },
            normal: {
                barBorderRadius: [15, 15, 15, 15],
                color: '#507bee7d',
                label: {
                    show: true,
                    // formatter: function(p) {
                    //     return p.value > 0 ? (p.value + '\n') : '';
                    // }
                }
            }
        },
        data: [Data.paper.originalNum, Data.weibo.originalNum, Data.app.originalNum, Data.web.originalNum, Data.weixin.originalNum]

    };

    if (gjChecked) {
        showData.push(data1)
    }
    if (ycChecked) {
        showData.push(data2)
    }

    var chartbar1 = echarts.init(document.getElementById('chartbar1'));
    var option = {
        tooltip: {
            trigger: 'item'
        },
        calculable: true,
        grid: {
            left: "2%",
            borderWidth: 0,
            y: '10%',
            y2: 0

        },
        xAxis: [{
                type: 'category',
                show: false
            },
            {
                type: 'category',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [{
            type: 'value',
            show: false
        }],

        series: showData
    };
    if (option && typeof option === "object") {
        chartbar1.setOption(option, true);
    }
    // console.log(option)
    // return option;

}
var app = angular.module('myApp', []);
app.controller('myCtrl', function($rootScope, $scope, $http, $timeout, $interval, $filter) {
    $scope.gjChecked = true;
    $scope.ycChecked = true;
    $scope.fullData = {};
    //格式化当前日期
    var nowTime = dataHandle.getDateTime();
    var oldForeTime = dataHandle.GetDateStr(0);

    function generalMethod() {
        getSzpgWeibo();
        getSzpgApp();
        getData();
        getGJZB()
    }
    generalMethod();
    //纸板头条
    function getData() {
        $http.get('/isearch/front/szpgdata/getszpadata.jhtml').then(function(data) {
            $scope.dealData(data.data);
        });
    }

    $scope.dealData = function(data) {
        var webVisitTotal = 0,
            webGjTotal = 0,
            iosInstallTotal = 0,
            /*appInstallProp =48,*/
            appInstallTotal = 0,
            appGjTotal = 0,
            appVisitTotal = 0,
            appUserTotal = 0,
            weixinGjTotal = 0,
            weixinUserTotal = 0,
            weiboGjTotal = 0,
            weiboFansTotal = 0,
            zjNum = 0,
            daiyunying = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i].source.indexOf("深圳特区报") >= 0) { //特区报，读特app
                //$scope.fullData.gfwbsztqb = data[i].weiboFansTotal;
                /*$scope.fullData.gfwxsztqb = data[i].weixinUserTotal;
                $scope.fullData.khdfwdt = data[i].appVisitTotal;
                $scope.fullData.khdyhdt=data[i].appUserTotal;*/
                continue;
            }
            if (data[i].source.indexOf("深圳商报") >= 0) { //商报，读创app
                continue;
                /*//$scope.fullData.gfwbszsb = data[i].weiboFansTotal;
                $scope.fullData.gfwxszsb = data[i].weixinUserTotal;
                $scope.fullData.khdfwdc = data[i].appVisitTotal;
                $scope.fullData.khdyhdc=data[i].appUserTotal;*/
            }
            if (data[i].source.indexOf("深圳新闻网") >= 0) { //深圳新闻网。@深圳
                continue;
                /*$scope.fullData.khdfwasz = data[i].appVisitTotal;
                $scope.fullData.khdyhasz=data[i].appUserTotal;*/
            }
            if (data[i].source.indexOf("晶报") >= 0) {
                // $scope.fullData.gfwbszjb = data[i].weiboFansTotal;
                $scope.fullData.gfwxszjb = data[i].weixinUserTotal;
            }
            if (data[i].source.indexOf("深圳ZAKER") >= 0) { //晚报
                //$scope.fullData.gfwbszwb = data[i].weiboFansTotal;
                $scope.fullData.gfwxszwb = data[i].weixinUserTotal;
                $scope.fullData.khdfwzaker = data[i].appVisitTotal;
                $scope.fullData.khdyhzaker = data[i].appUserTotal;
            }
            if (data[i].source.indexOf("深圳网易") >= 0) {
                $scope.fullData.khdyhwy = data[i].appUserTotal;
                $scope.fullData.khdfwszwy = data[i].appVisitTotal;
            }


            if (data[i].source.indexOf("深圳网易") < 0) {
                webVisitTotal = filterNull(data[i].webVisitTotal) + webVisitTotal;
                webGjTotal = filterNull(data[i].webGjTotal) + webGjTotal;
                weixinGjTotal = filterNull(data[i].weixinGjTotal) + weixinGjTotal;
                weixinUserTotal = filterNull(data[i].weixinUserTotal) + weixinUserTotal;
                weiboGjTotal = filterNull(data[i].weiboGjTotal) + weiboGjTotal;
                weiboFansTotal = filterNull(data[i].weiboFansTotal) + weiboFansTotal;
                daiyunying = filterNull(data[i].dyyUserTotal) + daiyunying;
            }
            if (data[i].appInstallProp != 0 && data[i].appInstallProp != undefined) {
                appInstallTotal = filterNull(data[i].appInstallTotal) + appInstallTotal;
                iosInstallTotal = parseInt(data[i].appInstallProp / 100 * filterNull(data[i].appInstallTotal)) + iosInstallTotal;
                $scope.appGjTotal = appGjTotal = filterNull(data[i].appGjTotal) + appGjTotal;
                zjNum++;
            }

            $scope.recall = function() {
                $scope.$broadcast('recall', $scope.appGjTotal);
            }
            appVisitTotal = filterNull(data[i].appVisitTotal) + appVisitTotal;
            appUserTotal = filterNull(data[i].appUserTotal) + appUserTotal;
        }


        $timeout(function() {
            //数据暂无，填入历史数据----------------------------
            $scope.fullData.gfwbsztqb = $scope.fullData.gfwbsztqb ? $scope.fullData.gfwbsztqb : 8075060;
            $scope.fullData.gfwxsztqb = $scope.fullData.gfwxsztqb ? $scope.fullData.gfwxsztqb : 190089;
            $scope.fullData.khdfwdt = $scope.fullData.khdfwdt ? $scope.fullData.khdfwdt : 650863;
            $scope.fullData.khdyhdt = $scope.fullData.khdyhdt ? $scope.fullData.khdyhdt : 1150886;
            $scope.fullData.gfwxszsb = $scope.fullData.gfwxszsb ? $scope.fullData.gfwxszsb : 161531;
            $scope.fullData.khdfwdc = $scope.fullData.khdfwdc ? $scope.fullData.khdfwdc : 8370;
            $scope.fullData.khdyhdc = $scope.fullData.khdyhdc ? $scope.fullData.khdyhdc : 394200;
            $scope.fullData.khdfwasz = $scope.fullData.khdfwasz ? $scope.fullData.khdfwasz : 4130000;
            $scope.fullData.khdyhasz = $scope.fullData.khdyhasz ? $scope.fullData.khdyhasz : 503901;
            $scope.fullData.gfwxszjb = $scope.fullData.gfwxszjb ? $scope.fullData.gfwxszjb : 82525;
            $scope.fullData.gfwbszjb = $scope.fullData.gfwbszjb ? $scope.fullData.gfwbszjb : 9032182
            $scope.fullData.gfwxszwb = $scope.fullData.gfwxszwb ? $scope.fullData.gfwxszwb : 256457;
            $scope.fullData.gfwbszwb = $scope.fullData.gfwbszwb ? $scope.fullData.gfwbszwb : 7509549;
            $scope.fullData.khdfwzaker = $scope.fullData.khdfwzaker ? $scope.fullData.khdfwzaker : 474589;
            $scope.fullData.khdyhzaker = $scope.fullData.khdyhzaker ? $scope.fullData.khdyhzaker : 5000000;
            $scope.fullData.khdyhwy = $scope.fullData.khdyhwy ? $scope.fullData.khdyhwy : 9481428;
            $scope.fullData.khdfwszwy = $scope.fullData.khdfwszwy ? $scope.fullData.khdfwszwy : 32014890;
            weixinUserTotal = filterNull($scope.fullData.gfwxszjb) + filterNull($scope.fullData.gfwxszsb) + filterNull($scope.fullData.gfwxsztqb) + filterNull($scope.fullData.gfwxszwb)
            appUserTotal = $scope.fullData.khdyhdt + $scope.fullData.khdyhwy + $scope.fullData.khdyhzaker + $scope.fullData.khdyhasz + $scope.fullData.khdyhdc;
            daiyunying = 21230000;
            weiboFansTotal = filterNull($scope.fullData.gfwbszjb) + filterNull($scope.fullData.gfwbszsb) + filterNull($scope.fullData.gfwbsztqb) + filterNull($scope.fullData.gfwbszwb) + filterNull($scope.fullData.gfwbszxww);
            appVisitTotal = $scope.fullData.khdfwdt + $scope.fullData.khdfwszwy + $scope.fullData.khdfwzaker + $scope.fullData.khdfwasz + $scope.fullData.khdfwdc;
            webVisitTotal = $scope.webVisitTotal ? $scope.webVisitTotal : 8690000;
            appInstallTotal = appInstallTotal ? appInstallTotal : 16654787;
            // appInstallProp=56.5;zjNum=1;
            //----------------------------------------------

            //集团用户总量
            $scope.fullData.jtyhszxgfwb = weiboFansTotal;
            $scope.fullData.jtyhszxgfwx = weixinUserTotal;
            $scope.fullData.jtyhkhd = appUserTotal;
            $scope.fullData.daiyunying = daiyunying;
            $scope.fullData.jituanyonghuzongliang = weiboFansTotal + weixinUserTotal + appUserTotal + daiyunying + 23000000;
            //微博，微信用户总量
            $scope.fullData.gfwbyhzl = weiboFansTotal;
            $scope.fullData.gfwxyhzl = weixinUserTotal;
            //集团访问总量
            $scope.fullData.jtfwkhd = appVisitTotal;
            $scope.fullData.jtfwwz = webVisitTotal;
            $scope.fullData.jtfwzl = appVisitTotal + webVisitTotal;
            //客户端用户,访问总量
            $scope.fullData.khdyhzl = appUserTotal;
            $scope.fullData.khdfwzl = appVisitTotal;
            //客户端装机总量
            $scope.fullData.khdzjzl = appInstallTotal + $scope.fullData.khdyhdc + $scope.fullData.khdyhasz + $scope.fullData.khdyhdt;
            //fullData.khdyhdc读创用户量，读创ios，appInstallProp ios装机和，zjNum数据条数
            //（ios装机比--四条数据相加而来 + 读创ios装机比）/（app类型数加1，值为5）
            iosInstallTotal = iosInstallTotal + parseInt(filterNull($scope.iosdc)) + parseInt(filterNull($scope.iosasz)) + parseInt(filterNull($scope.iosdt));
            $scope.fullData.khdzjios = parseInt(iosInstallTotal / $scope.fullData.khdzjzl * 100); //
            $scope.fullData.khdzjandroid = 100 - $scope.fullData.khdzjios;
            var optionAndroid = {
                width: 430, //图表宽度
                height: 430, //图表高度
                ringWidth: 30, //环宽度
                borderColorInital: "#004657", //环初始颜色
                borderColor: "#11F7EC", //环颜色
                backgroundColor: "#0C212C", //背景颜色
                fontColor: "#11F7EC", //字体颜色
                fontSize: "109px", //字体大小
                fontTop: "62px", //文字顶部偏移量
                title: "安卓", //图表标题
                titleFontSize: "60px", //标题大小
                duratioin: 400 //增长时间
            };
            var circleAndroid = new RingChart("circleLeft", $scope.fullData.khdzjandroid, optionAndroid);
            circleAndroid.start();

            var optionIos = {
                width: 430, //图表宽度
                height: 430, //图表高度
                ringWidth: 30, //环宽度
                borderColorInital: "#004657", //环初始颜色
                borderColor: "#11F7EC", //环颜色
                backgroundColor: "#0C212C", //背景颜色
                fontColor: "#11F7EC", //字体颜色
                fontSize: "109px", //字体大小
                fontTop: "62px", //文字顶部偏移量
                title: "IOS", //图表标题
                titleFontSize: "60px", //标题大小
                duratioin: 400 //增长时间
            };

            var circleIos = new RingChart("circleRight", $scope.fullData.khdzjios, optionIos);
            $scope.fullData.khdzjiosWidth = {
                width: $scope.fullData.khdzjios + '%'
            };
            circleIos.start();
            //客户端用户总量
            var itemStyle = {
                normal: {
                    color: '#f5a950',
                    // color:new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    //         offset: 0,
                    //         color: '#01b3eb'
                    //     }, {
                    //         offset: 1,
                    //         color: '#f5a950'
                    //     }]),
                    // color: {
                    //     type: 'linear',
                    //     x: 0,
                    //     y: 0,
                    //     x2: 1,
                    //     y2: 0,
                    //     colorStops: [{
                    //         offset: 0, color: 'red' // 0% 处的颜色
                    //     }, {
                    //         offset: 1, color: 'blue' // 100% 处的颜色
                    //     }],
                    //     globalCoord: false // 缺省为 false
                    // }
                }
            };
            var khdyCategoryArry = ['深圳ZAKER', '深圳网易', '@深圳', '读创', '读特'];
            var khdyhMax = Math.max.apply(null, [$scope.fullData.khdyhzaker, $scope.fullData.khdyhwy, $scope.fullData.khdyhasz, $scope.fullData.khdyhdc, $scope.fullData.khdyhdt]);
            var khdyhArry = [
                { name: '深圳ZAKER', value: $scope.fullData.khdyhzaker },
                { name: '深圳网易', value: $scope.fullData.khdyhwy },
                { name: '@深圳', value: $scope.fullData.khdyhasz },
                { name: '读创', value: $scope.fullData.khdyhdc },
                { name: '读特', value: $scope.fullData.khdyhdt },
            ];
            var khdyhfzVal = 1.6 * khdyhMax;
            var khdyhfzArry = [
                { name: '深圳ZAKER', value: khdyhfzVal },
                { name: '深圳网易', value: khdyhfzVal },
                { name: '@深圳', value: khdyhfzVal },
                { name: '读创', value: khdyhfzVal },
                { name: '读特', value: khdyhfzVal },
            ];
            for (var i = 0; i < khdyhArry.length; i++) {
                if (khdyhArry[i].value == khdyhMax) {
                    khdyhArry[i]['itemStyle'] = itemStyle;
                    khdyhfzArry[i]['itemStyle'] = {
                        normal: {
                            borderColor: '#f19802'
                        }
                    };
                }
            }
            $scope.clientUserTotleBar = getClientUserTotleBar(khdyCategoryArry, khdyhArry, khdyhfzArry);
            //客户端日访问总量
            var categoryArry = ['深圳ZAKER', '深圳网易', '@深圳', '读创', '读特'];
            var khdfwArry = [$scope.fullData.khdfwzaker, $scope.fullData.khdfwszwy, $scope.fullData.khdfwasz, $scope.fullData.khdfwdc, $scope.fullData.khdfwdt];
            $scope.clientVisitTotleBar = getClientVisitTotleBar(categoryArry, khdfwArry, $scope.fullData.khdfwzl);
        });

    }





    //过滤空值
    function filterNull(data) {
        return data == undefined ? 0 : data;
    }

    function getSzpgWeibo() { //微博数据接口
        $http.get("/szpg_weibo/weibo_statistics/getData?beginDate=" + nowTime).then(function(data) {
            getDealWeibo(data.data)
        });
    }

    function getSzpgApp() { //app数据接口，读创
        $http.get("/szdp/app/find?date=" + oldForeTime).then(function(data) { //读创取今天的数据
            // $scope.fullData.khdyhdc=data.data[0].userTotal;
            // $scope.iosdc=data.data[0].iosTotal;
            // $scope.androiddc=data.data[0].androidTotal;
            // $scope.fullData.khdfwdc=data.data[0].visitDateTotal;
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].appName == "读创") {
                    $scope.fullData.khdyhdc = data.data[i].userTotal;
                    $scope.iosdc = data.data[i].iosTotal;
                    $scope.androiddc = data.data[i].androidTotal;
                    $scope.fullData.khdfwdc = data.data[i].visitDateTotal;
                    $scope.fullData.gfwxszsb = data.data[i].weixinUserTotal;
                }
            }
        });
        $http.get("/szdp/app/find?date=" + nowTime).then(function(data) { //@深圳取今天数据
            // $scope.fullData.khdyhdc=data.data[0].userTotal;
            // $scope.iosdc=data.data[0].iosTotal;
            // $scope.androiddc=data.data[0].androidTotal;
            // $scope.fullData.khdfwdc=data.data[0].visitDateTotal;
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].appName == "@深圳") {
                    $scope.iosasz = data.data[i].iosTotal;
                    $scope.androidasz = data.data[i].androidTotal;
                    $scope.fullData.khdyhasz = $scope.iosasz + $scope.androidasz;
                    $scope.fullData.khdfwasz = data.data[i].visitDateTotal;
                    $scope.webVisitTotal = data.data[i].webVisitDateTotal;
                } else if (data.data[i].appName == "读特") {
                    $scope.iosdt = data.data[i].iosTotal;
                    $scope.androiddt = data.data[i].androidTotal;
                    $scope.fullData.khdyhdt = $scope.iosdt + $scope.androiddt;
                    $scope.fullData.khdfwdt = data.data[i].visitDateTotal;
                    $scope.fullData.gfwxsztqb = data.data[i].weixinUserTotal;
                }
            }
        });
    }

    function getDealWeibo(data) {
        $scope.fullData.gfwbyhzl = 0;
        $scope.weiboGjTotal = 0; //add by liu,jianghong
        var gfwoyhArry = [],
            gfwoyCategoryArry = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].SCREEN_NAME.indexOf("深圳商报") >= 0) { //商报，读创app
                $scope.fullData.gfwbszsb = parseInt(data[i].FOLLOWERS_COUNT);
                gfwoyCategoryArry[1] = data[i].SCREEN_NAME;
                gfwoyhArry[1] = { name: '深圳商报', value: parseInt(data[i].FOLLOWERS_COUNT), itemStyle: { normal: { color: '#00ff00' } } };
            } else if (data[i].SCREEN_NAME.indexOf("深圳特区报") >= 0) {
                $scope.fullData.gfwbsztqb = parseInt(data[i].FOLLOWERS_COUNT);
                gfwoyCategoryArry[0] = (data[i].SCREEN_NAME);
                gfwoyhArry[0] = ({ name: '深圳特区报', value: parseInt(data[i].FOLLOWERS_COUNT), itemStyle: { normal: { color: '#e4007f' } } });
            } else if (data[i].SCREEN_NAME.indexOf("晶报") >= 0) {
                $scope.fullData.gfwbszjb = parseInt(data[i].FOLLOWERS_COUNT);
                gfwoyCategoryArry[3] = (data[i].SCREEN_NAME);
                gfwoyhArry[3] = ({ name: '晶报', value: parseInt(data[i].FOLLOWERS_COUNT), itemStyle: { normal: { color: '#f39800' } } });
            } else if (data[i].SCREEN_NAME.indexOf("深圳晚报") >= 0) {
                $scope.fullData.gfwbszwb = parseInt(data[i].FOLLOWERS_COUNT);
                gfwoyCategoryArry[2] = (data[i].SCREEN_NAME);
                gfwoyhArry[2] = ({ name: '深圳晚报', value: parseInt(data[i].FOLLOWERS_COUNT), itemStyle: { normal: { color: '#00b7ee' } } });
            } else if (data[i].SCREEN_NAME.indexOf("深圳新闻网") >= 0) {
                //$scope.fullData.gfwbszxww =parseInt(data[i].FOLLOWERS_COUNT);//暂时去掉
            }
            // $scope.weiboGjTotal+=(data[i].ARTICLE_TODAY!=undefined&&data[i].ARTICLE_TODAY>0)?data[i].ARTICLE_TODAY:0;//add by liu,jianghong
            if (data[i].SCREEN_NAME.indexOf("深圳新闻网") < 0) {
                $scope.fullData.gfwbyhzl = $scope.fullData.gfwbyhzl + parseInt(data[i].FOLLOWERS_COUNT);
            }
            // fullData.jtyhszxgfwb
        }
        // $scope.fullData.gfwbyhzl = $scope.fullData.gfwbszsb + $scope.fullData.gfwbsztqb + $scope.fullData.gfwbszj + $scope.fullData.gfwbszwb;   

        //官方微博用户总量
        $scope.gfwbUserTotleBar = getGfwbUserTotleBar(gfwoyCategoryArry, gfwoyhArry, $scope.fullData.gfwbyhzl);

    }


    //集团稿件总数情况 -- 稿件占比echarts
    function getGJZB() {
        var day = new Date();
        day.setTime(day.getTime() - 24 * 60 * 60 * 1000 * 7 * 1);
        console.log(day)
        $http.get("/szdp/gaojiantotal/find?date=" + nowTime).success(function(data) {
            $scope.gjzb = {};
            data.forEach(function(obj) {
                if (obj.type === '1') {
                    $scope.gjzb.web = obj;
                } else if (obj.type === '4') {
                    $scope.gjzb.weibo = obj;
                } else if (obj.type === '5') {
                    $scope.gjzb.paper = obj;
                } else if (obj.type === '7') {
                    $scope.gjzb.app = obj;
                } else if (obj.type === '8') {
                    $scope.gjzb.weixin = obj;
                }
            });
            var OriginalNumList = [{
                    value: $scope.gjzb.paper.originalNum,
                    name: '电子报'
                },
                {
                    value: $scope.gjzb.weibo.originalNum,
                    name: '微博'
                },

                {
                    value: $scope.gjzb.app.originalNum,
                    name: 'APP'
                },
                {
                    value: $scope.gjzb.web.originalNum,
                    name: '网站'
                },

                {
                    value: $scope.gjzb.weixin.originalNum,
                    name: '微信'
                },


            ];
            var TotalNumList = [
                    { value: $scope.gjzb.paper.allNum, name: '电子报' },
                    { value: $scope.gjzb.weibo.allNum, name: '微博' },
                    { value: $scope.gjzb.app.allNum, name: 'APP' },
                    { value: $scope.gjzb.web.allNum, name: '网站' },
                    { value: $scope.gjzb.weixin.allNum, name: '微信' }
                ]
                //当日原创稿件总数
            $scope.OriginalNum = $scope.gjzb.paper.originalNum + $scope.gjzb.web.originalNum + $scope.gjzb.weixin.originalNum + $scope.gjzb.app.originalNum + $scope.gjzb.weibo.originalNum;
            //当日稿件总数
            $scope.TotalNum = $scope.gjzb.paper.allNum + $scope.gjzb.web.allNum + $scope.gjzb.weixin.allNum + $scope.gjzb.app.allNum + $scope.gjzb.weibo.allNum;
            //当日原创稿件总数echarts
            $scope.getGJZBList = ycData('原创占比', OriginalNumList);
            //当日稿件总数echarts
            $scope.getGJZBListss = ycData('总占比', TotalNumList);
            //稿件柱状tu
            bar1Data($scope.gjzb, $scope.gjChecked, $scope.ycChecked);
        });


    }
    $scope.changegj = function(val) {
        console.log("我点击了呀")
        if (val == 1) {
            $scope.gjChecked = !$scope.gjChecked;
            bar1Data($scope.gjzb, $scope.gjChecked, $scope.ycChecked);

        } else if (val == 2) {
            $scope.ycChecked = !$scope.ycChecked;
            bar1Data($scope.gjzb, $scope.gjChecked, $scope.ycChecked);
        }
    }

    //实时更新数据
    var intervalTime = $interval(function() {
        generalMethod();
    }, 1000 * 60 * 15, -1);
    // 清除定时器
    $scope.$on('$destroy', function() {
        $interval.cancel(intervalTime);
    });

});
//将数字按三位逗号隔开数字格式化
app.filter("toThousands", function() {
    return function(num) {
        var num = (num || 0).toString(),
            result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    }
});