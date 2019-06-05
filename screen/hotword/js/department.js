var app = angular.module('hotwordApp', []);
    
app.controller('hotwordCtrl', function($scope, $http) {
    function createRandomItemStyle() {
        return {
            normal: {
                color: 'rgb(' + [
                    Math.round(Math.random() * 700),
                    Math.round(Math.random() * 700),
                    Math.round(Math.random() * 700)
                ].join(',') + ')'
            }
        };
    }

        $http({
        method: 'GET',
        url: "/wcm/bigdata.do?typeid=event&eventid=4&serviceid=eventtrace&modelid=folkAndOfficialHotwords&mediatype=official"
    }).then(function successCallback(response) {
        $scope.itemArr=[];
        $scope.item={
            name: "",
            value: 0,
            itemStyle: createRandomItemStyle()
        }
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            $scope.item.name=response.data[i].STRVALUE;
            $scope.item.value=response.data[i].IRECORDNUM;
            $scope.itemArr.push($scope.item);
            $scope.item={
                name: "",
                value: 0,
                itemStyle: createRandomItemStyle()
            }
        }
        console.log($scope.itemArr);
        require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});

// 使用
require(
    [
        'echarts',
        
        'echarts/chart/wordCloud',    //字符云
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('officialCloud')); 

        function createRandomItemStyle() {
            return {
                normal: {
                    color: 'rgb(' + [
                        Math.round(Math.random() * 700),
                        Math.round(Math.random() * 700),
                        Math.round(Math.random() * 700)
                    ].join(',') + ')'
                }
            };
        }

        option = {
            title: {
                text: '',
                link: 'http://www.google.com/trends/hottrends'
            },
            tooltip: {
                show: true
            },
            series: [{
                name: '官方媒体',
                type: 'wordCloud',
                size: ['100%', '100%'],
                textRotation : [0, 45, 90, -45],
                textPadding: 0,
                autoSize: {
                    enable: true,
                    minSize: 40
                },
                data:$scope.itemArr
            }]
        };

        // 为echarts对象加载数据 
        myChart.setOption(option); 
    }
);
        }, function errorCallback(response) {
            // 请求失败执行代码
    });




        $http({
        method: 'GET',
        url: "/wcm/bigdata.do?typeid=event&eventid=4&serviceid=eventtrace&modelid=folkAndOfficialHotwords&mediatype=folk"
    }).then(function successCallback(response) {
        $scope.itemArr=[];
        $scope.item={
            name: "",
            value: 0,
            itemStyle: createRandomItemStyle()
        }
        console.log(response);
        for (var i = 0; i < response.data.length; i++) {
            $scope.item.name=response.data[i].STRVALUE;
            $scope.item.value=response.data[i].IRECORDNUM;
            $scope.itemArr.push($scope.item);
            $scope.item={
                name: "",
                value: 0,
                itemStyle: createRandomItemStyle()
            }
        }
        console.log($scope.itemArr);
        require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});

// 使用
require(
    [
        'echarts',
        
        'echarts/chart/wordCloud',    //字符云
    ],
    function (ec) {
        // 基于准备好的dom，初始化echarts图表
        var myChart = ec.init(document.getElementById('folkCloud')); 

        function createRandomItemStyle() {
            return {
                normal: {
                    color: 'rgb(' + [
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160),
                        Math.round(Math.random() * 160)
                    ].join(',') + ')'
                }
            };
        }

        option = {
            title: {
                text: '',
                link: 'http://www.google.com/trends/hottrends'
            },
            tooltip: {
                show: true
            },
            series: [{
                name: '外部媒体',
                type: 'wordCloud',
                size: ['100%', '100%'],
                textRotation : [0, 45, 90, -45],
                textPadding: 0,
                autoSize: {
                    enable: true,
                    minSize: 40
                },
                data:$scope.itemArr
            }]
        };

        // 为echarts对象加载数据 
        myChart.setOption(option); 
    }
);
        }, function errorCallback(response) {
            // 请求失败执行代码
    });


    
});