var app = angular.module('volumeApp', []);
    
app.controller('volumeCtrl', function($scope, $http) {
	
    var appArr=[];
    var szb=[];
    var website=[];
    var weixin=[];
    var haiwai=[];
	var today = new Date().format("yyyy-MM-dd");
    $http({
        method: 'GET',
        //url: "/xhs/wcm/bigdata.do?modelid=chart&serviceid=volume&start_date="+today+"&type=0&typeid=widget"
		url: "/lhjk/getJson?name=report"
    }).then(function successCallback(response) {
            for (var i = 0; i < response.data.app.length; i++) {
                appArr.push(response.data.app[i].IRECORDNUM);
            }
            for (var i = 0; i < response.data.szb.length; i++) {
                szb.push(response.data.szb[i].IRECORDNUM);
            }
            for (var i = 0; i < response.data.website.length; i++) {
                website.push(response.data.website[i].IRECORDNUM);
            }
            for (var i = 0; i < response.data.weixin.length; i++) {
                weixin.push(response.data.weixin[i].IRECORDNUM);
            }
            for (var i = 0; i < response.data.haiwai.length; i++) {
                haiwai.push(response.data.haiwai[i].IRECORDNUM);
            }

        console.log(appArr);
        console.log(szb);
        console.log(website);
        console.log(weixin);
        console.log(haiwai);


        // 基于准备好的dom，初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));

            // 指定图表的配置项和数据
            option = {
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    // data:['app','数字报','网站','微信','海外'],
                    data:[
                        {
                            name:"app",
                            textStyle:{
                                color:"#c23531"
                            }
                        },
                        {
                            name:"数字报",
                            textStyle:{
                                color:"#2f4554"
                            }
                        },
                        {
                            name:"网站",
                            textStyle:{
                                color:"#61a0a8"
                            }
                        },
                        {
                            name:"微信",
                            textStyle:{
                                color:"#d48265"
                            }
                        },
                        {
                            name:"海外",
                            textStyle:{
                                color:"#4ca41a"
                            }
                        },
                    ],
                    textStyle:{
                        show:true,
                        fontSize:40,
                        color: function (data) {
                            console.log(data);
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['01','02','03','04','05','06','07','09','10','11','12','13','14','15','16'],
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#fff',
                            fontSize:30
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLabel : {
                        formatter: '{value}',
                        textStyle: {
                            color: '#fff',
                            fontSize:30
                        }
                    }
                },
                series: [
                    {
                        name:'app',
                        type:'line',
                        data:appArr,
                        itemStyle: {
                            normal:{
                                lineStyle:{
                                    width: 5 //default value:2
                                }
                            }
                        }

                    },
                    {
                        name:'数字报',
                        type:'line',
                        data:szb,
                        itemStyle: {
                            normal:{
                                lineStyle:{
                                    width: 5 //default value:2
                                }
                            }
                        }
                    },
                    {
                        name:'网站',
                        type:'line',
                        data:website,
                        itemStyle: {
                            normal:{
                                lineStyle:{
                                    width: 5 //default value:2
                                }
                            }
                        }
                    },
                    {
                        name:'微信',
                        type:'line',
                        data:weixin,
                        itemStyle: {
                            normal:{
                                lineStyle:{
                                    width: 5 //default value:2
                                }
                            }
                        }
                    },
                    {
                        name:'海外',
                        type:'line',
                        data:haiwai,
                        itemStyle: {
                            normal:{
                                lineStyle:{
                                    width: 5, //default value:2
                                    color:"#4ca41a"
                                }
                            }
                        }
                    }
                ]
            };


            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    
});