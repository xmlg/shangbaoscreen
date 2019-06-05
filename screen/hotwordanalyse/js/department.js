var app = angular.module('myApp', []);
    
app.controller('myCtrl', function($scope, $http) {
    var date = new Date();
    var y=date.getFullYear(); //获取完整的年份(4位)
    var m=date.getMonth()+1; //获取当前月份(0-11,0代表1月)
    var d=date.getDate();
    $http({
        method: 'GET',
        url: "/lhjk/getJson?name=person"
    }).then(function successCallback(response) {
            $scope.cur='person';
            console.log(response);
            var str=response.data;      //这是一个json字符串''
            var ob=JSON.parse(str) ;  //返回一个新对象
            console.log(ob);
            //获取key/value
            $scope.personArr=[];
            $scope.personItem={
                arr:[]
            }
            for(var k in ob) {
                //遍历对象，k即为key，obj[k]为当前k对应的值
                console.log(k);
                console.log(ob[k]);
                $scope.personItem.arr=ob[k];
                $scope.personItem.mon=k.slice(5,6);
                $scope.personItem.date=k.slice(6,8);
                $scope.personArr.push($scope.personItem);
                $scope.personItem={
                    arr:[]
                }
            }
            console.log($scope.personArr);
            $scope.personArrOne=$scope.personArr[$scope.personArr.length-4];
            $scope.personArrTwo=$scope.personArr[$scope.personArr.length-3];
            $scope.personArrThree=$scope.personArr[$scope.personArr.length-2];
            $scope.personArrFour=$scope.personArr[$scope.personArr.length-1];
        }, function errorCallback(response) {
            // 请求失败执行代码
    });
    $scope.getData=function(type){
        console.log(type);
        $scope.cur=type;
        $http({
            method: 'GET',
            url: "/lhjk/getJson?name="+type
        }).then(function successCallback(response) {
                console.log(response);
            var str=response.data;      //这是一个json字符串''
            var ob=JSON.parse(str) ;  //返回一个新对象
            console.log(ob);
            //获取key/value
            $scope.personArr=[];
            $scope.personItem={
                arr:[]
            }
            for(var k in ob) {
                //遍历对象，k即为key，obj[k]为当前k对应的值
                console.log(k);
                console.log(ob[k]);
                $scope.personItem.arr=ob[k];
                $scope.personItem.mon=k.slice(5,6);
                $scope.personItem.date=k.slice(6,8);
                $scope.personArr.push($scope.personItem);
                $scope.personItem={
                    arr:[]
                }
            }
            console.log($scope.personArr);
            $scope.personArrOne=$scope.personArr[$scope.personArr.length-4];
            $scope.personArrTwo=$scope.personArr[$scope.personArr.length-3];
            $scope.personArrThree=$scope.personArr[$scope.personArr.length-2];
            $scope.personArrFour=$scope.personArr[$scope.personArr.length-1];
            }, function errorCallback(response) {
                // 请求失败执行代码
        }); 
    }
});