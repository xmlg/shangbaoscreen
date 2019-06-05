var app = angular.module('myApp', []);
    
app.controller('myCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: "../new/js/person.json"
    }).then(function successCallback(response) {
            $scope.person=response.data;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    $http({
        method: 'GET',
        url: "../new/js/org.json"
    }).then(function successCallback(response) {
            $scope.org=response.data;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    $http({
        method: 'GET',
        url: "../new/js/place.json"
    }).then(function successCallback(response) {
            $scope.place=response.data;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    $http({
        method: 'GET',
        url: "/wcm/bigdata.do?id=4&keyword=%E5%8C%97%E4%BA%AC&modelid=entitydetail&pagesize=15&serviceid=eventdetail&startpage=0&type=3&typeid=widget"
    }).then(function successCallback(response) {
            console.log(response);
            $scope.page=response.data;
            $scope.DetailsListData=response.data.PAGEITEMS;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    $scope.getData=function(item,type){
        console.log(item);
        $scope.cur=item.STRVALUE;
       $http({
            method: 'GET',
            url: "/wcm/bigdata.do?id=4&keyword="+item.STRVALUE+"&modelid=entitydetail&pagesize=15&serviceid=eventdetail&startpage=0&type="+type+"&typeid=widget"
        }).then(function successCallback(response) {
                console.log(response);
                $scope.page=response.data;
                $scope.DetailsListData=response.data.PAGEITEMS;
            }, function errorCallback(response) {
                // 请求失败执行代码
        }); 
    }
    var page=1;
    $scope.getPre=function(){
        page=page-1;
        $http({
            method: 'GET',
            url: "/wcm/bigdata.do?id=4&keyword=%E5%85%A8%E5%9B%BD%E6%94%BF%E5%8D%8F&modelid=entitydetail&pagesize=12&serviceid=eventdetail&startpage="+page+"&type=1&typeid=widget"
        }).then(function successCallback(response) {
                console.log(response);
                $scope.page=response.data;
                $scope.DetailsListData=response.data.PAGEITEMS;
            }, function errorCallback(response) {
                // 请求失败执行代码
        });
    }
    $scope.getNext=function(){
        page=page+1;
        $http({
            method: 'GET',
            url: "/wcm/bigdata.do?id=4&keyword=%E5%85%A8%E5%9B%BD%E6%94%BF%E5%8D%8F&modelid=entitydetail&pagesize=12&serviceid=eventdetail&startpage="+page+"&type=1&typeid=widget"
        }).then(function successCallback(response) {
                console.log(response);
                $scope.page=response.data;
                $scope.DetailsListData=response.data.PAGEITEMS;
            }, function errorCallback(response) {
                // 请求失败执行代码
        });
    }
  
});