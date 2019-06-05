var app = angular.module('myApp', []);
    
app.controller('myCtrl', function($scope, $http) {
    var date = new Date();
    var y=date.getFullYear(); //获取完整的年份(4位)
    var m=date.getMonth()+1; //获取当前月份(0-11,0代表1月)
    var d=date.getDate();
    $http({
        method: 'GET',
        url:"/lhjk/getJson?name=lhview"
    }).then(function successCallback(response) {
            console.log(response);
            $scope.items=response.data.CONTENT;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    $http({
        method: 'GET',
        url:"/lhjk/getJson?name=proposal"
    }).then(function successCallback(response) {
            console.log(response);
            $scope.itemstwo=response.data.PAGEITEMS;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
});