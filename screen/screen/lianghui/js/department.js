var app = angular.module('myApp', []);
    
app.controller('myCtrl', function($scope, $http) {
    var date = new Date();
    var y=date.getFullYear(); //获取完整的年份(4位)
    var m=date.getMonth()+1; //获取当前月份(0-11,0代表1月)
    var d=date.getDate();
    $http({
        method: 'GET',
        url: "/wcm/bigdata.do?loadtime="+y+"-"+m+"-"+d+"&modelid=getnewslistForLH&serviceid=portallist2"
    }).then(function successCallback(response) {
            $scope.items=response.data.PAGEITEMS;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });

    $http({
        method: 'GET',
        url: "/wcm/bigdata.do?date="+y+"-"+m+"-"+d+"&modelid=foreign&page_no=0&page_size=5&serviceid=hotWords&typeid=widget"
    }).then(function successCallback(response) {
            console.log(response);
            $scope.gwitems=response.data.PAGEITEMS;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    var page=0;
    $scope.getPre=function(){
        page=page-1;
        $http({
            method: 'GET',
            url: "/wcm/bigdata.do?date="+y+"-"+m+"-"+d+"&modelid=foreign&page_no="+page+"&page_size=5&serviceid=hotWords&typeid=widget"
        }).then(function successCallback(response) {
                console.log(response);
                $scope.gwitems=response.data.PAGEITEMS;
            }, function errorCallback(response) {
                // 请求失败执行代码
        });
    }
    $scope.getNext=function(){
        page=page+1;
        $http({
            method: 'GET',
            url: "/wcm/bigdata.do?date="+y+"-"+m+"-"+d+"&modelid=foreign&page_no="+page+"&page_size=5&serviceid=hotWords&typeid=widget"
        }).then(function successCallback(response) {
                console.log(response);
                $scope.gwitems=response.data.PAGEITEMS;
            }, function errorCallback(response) {
                // 请求失败执行代码
        });
    }
});