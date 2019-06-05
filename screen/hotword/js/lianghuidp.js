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

    console.log(getNowFormatDate());

    $http({
        method: 'GET',
        url: "/lhjk/getJson?name=person"
    }).then(function successCallback(response) {
        var data = $.parseJSON(response.data)[getNowFormatDate()];
        // console.log(data);
        $scope.itemArr=[];
        $scope.item={
            name: "",
            value: 0,
            itemStyle: createRandomItemStyle()
        }
        // console.log(response);
        for (var i = 0; i < data.length; i++) {
            $scope.item.name=data[i].wordName;
            $scope.item.value=data[i].wordHeat;
            $scope.itemArr.push($scope.item);
            $scope.item={
                name: "",
                value: 0,
                itemStyle: createRandomItemStyle()
            }
        }
        // console.log($scope.itemArr);
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
        url: "/lhjk/getJson?name=jigou"
    }).then(function successCallback(response) {
        var data = $.parseJSON(response.data)[getNowFormatDate()];
        $scope.itemArr2=[];
        $scope.item2={
            name: "",
            value: 0,
            itemStyle: createRandomItemStyle()
        }
        // console.log(response);
        for (var i = 0; i < data.length; i++) {
            $scope.item2.name=data[i].wordName;
            $scope.item2.value=data[i].wordHeat;
            $scope.itemArr2.push($scope.item2);
            $scope.item2={
                name: "",
                value: 0,
                itemStyle: createRandomItemStyle()
            }
        }
        // console.log($scope.itemArr);
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
                        data:$scope.itemArr2
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
        url: "/lhjk/getJson?name=place"
    }).then(function successCallback(response) {
        console.log(response);
        var data = $.parseJSON(response.data)[getNowFormatDate()];
        console.log(data);
        $scope.itemArr3=[];
        $scope.item3={
            name: "",
            value: 0,
            itemStyle: createRandomItemStyle()
        }
        // console.log(response);
        for (var i = 0; i < data.length; i++) {
            $scope.item3.name=data[i].wordName;
            $scope.item3.value=data[i].wordHeat;
            $scope.itemArr3.push($scope.item3);
            $scope.item3={
                name: "",
                value: 0,
                itemStyle: createRandomItemStyle()
            }
        }
        // console.log($scope.itemArr);
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
                var myChart = ec.init(document.getElementById('addressCloud'));

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
                        data:$scope.itemArr3
                    }]
                };

                // 为echarts对象加载数据
                myChart.setOption(option);
            }
        );
    }, function errorCallback(response) {
        // 请求失败执行代码
    });

    function getNowFormatDate() {
        var date = new Date();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + month + strDate
        return currentdate;
    }

});