/**
 * Created by shang on 2019/1/17.
 */
  Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
/*                "h+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒*/
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    var day = new Date();
    day.setTime(day.getTime()-24*60*60*1000*7*1);
    var num = day.getDay()-1;
    day.setDate(day.getDate() - num); //本周第一天
    var startTime = day.format("yyyyMMdd");
    day.setDate(day.getDate() + 6);//本周最后一天
    var endTime = day.format("yyyyMMdd");
     
var app = angular.module('app', ['ui.bootstrap']);
app.controller('jingmeiController',
    function ($rootScope, $scope, $http, $timeout, $interval, $filter,$modal) {
        $scope.vc = {
    toDetail:function(obj){
            $scope.detailId=obj.sid;
            var modalInstance = $modal.open({
                    templateUrl: './zzdetail.html',
                    controller: "zzdetailController",
                    size: 'lg',
                    scope: $scope,
                    backdrop: 'static',
                    keyboard: false
                });
        },
}
          function login(){
        $http.get("/datas/api/login?username=szxinwenwang&password=szxinwenwang1226").success(function(data){
           getData(startTime,endTime);
        });
    }
     login()
     function getData(start,end){
         $http.get("/datas/api/cas/transmission/searchList?infoType=&pageSize=10&sortOrder=DESC&mediaUnitName=%E6%B7%B1%E5%9C%B3%E6%8A%A5%E4%B8%9A%E9%9B%86%E5%9B%A2"+"&startTime="+start+"&endTime="+end).success(function(data){
           $scope.jtzhcbl=data.data.content;
        });
          $http.get("/datas/api/cas/transmission/searchList?infoType=5&pageSize=10&sortOrder=DESC&siteName=%E5%8C%97%E4%BA%AC%E6%97%A5%E6%8A%A5;%E6%96%B0%E4%BA%AC%E6%8A%A5;%E6%B5%99%E6%B1%9F%E6%97%A5%E6%8A%A5;%E9%92%B1%E6%B1%9F%E6%99%9A%E6%8A%A5;%E6%B2%B3%E5%8D%97%E6%97%A5%E6%8A%A5;%E6%B9%96%E5%8D%97%E6%97%A5%E6%8A%A5;%E9%87%8D%E5%BA%86%E6%99%A8%E6%8A%A5;%E8%A7%A3%E6%94%BE%E6%97%A5%E6%8A%A5;%E5%8D%97%E4%BA%AC%E6%97%A5%E6%8A%A5;%E5%8D%97%E6%96%B9%E6%97%A5%E6%8A%A5;%E5%B9%BF%E5%B7%9E%E6%97%A5%E6%8A%A5;%E7%BE%8A%E5%9F%8E%E6%99%9A%E6%8A%A5;%E5%8D%97%E6%96%B9%E9%83%BD%E5%B8%82%E6%8A%A5"+"&startTime="+start+"&endTime="+end).success(function(data){
           $scope.jmcbl=data.data.content;
        });
     }
   });
app.controller('guanmeiController',
    function ($rootScope, $scope, $http, $timeout, $interval, $filter,$modal) {
         $scope.vc = {
    toDetail:function(obj){
            $scope.detailId=obj.sid;
            var modalInstance = $modal.open({
                    templateUrl: './zzdetail.html',
                    controller: "zzdetailController",
                    size: 'lg',
                    scope: $scope,
                    backdrop: 'static',
                    keyboard: false
                });
        },
}
       function login(){
        $http.get("/datas/api/login?username=szxinwenwang&password=szxinwenwang1226").success(function(data){
           getData(startTime,endTime);
        });
    }
     login();
     function getData(start,end){
         $http.get("/datas/api/cas/transmission/searchList?categories=1&pageSize=10"+"&startTime="+start+"&endTime="+end).success(function(data){
           $scope.zycbl=data.data.content;
        });
          $http.get("/datas/api/cas/transmission/searchList?endtime=20190118&pageSize=10&siteName=%E5%8D%97%E6%96%B9%E6%97%A5%E6%8A%A5;%E5%B9%BF%E5%B7%9E%E6%97%A5%E6%8A%A5;%E7%BE%8A%E5%9F%8E%E6%99%9A%E6%8A%A5;%E7%8F%A0%E6%B5%B7%E7%89%B9%E5%8C%BA%E6%8A%A5"+"&startTime="+start+"&endTime="+end).success(function(data){
           $scope.bscbl=data.data.content;
        });
     }

   });
app.controller('zzdetailController',
    function ($rootScope, $scope, $http, $timeout, $interval, $filter, $modalInstance) {
        function unique(arr){
    var res=[];
    for(var i=0,len=arr.length;i<len;i++){
        var obj = arr[i];
        for(var j=0,jlen = res.length;j<jlen;j++){
            if(res[j]===obj) break;            
        }
        if(jlen===j)res.push(obj);
    }
    return res;
}
        $http.get("/casindex/articleIndexSearch/SearchOne?user_id=admin&department=admin&sid="+$scope.detailId).success(function(data){
           $scope.detailData=data;
        });
     
        $http.get("/datas/api/cas/docdetail/getMediaReprintOut?mediaUnitName=深圳报业集团&searchType=1&docId="+$scope.detailId).success(function(data){
           $scope.detailZZMT={
            top:[],
            core:[],
            one:[],
            two:[],
            total:0
           };
           data.data.forEach(function(obj){
              if(obj.type==='core'){
                 var top=[];
                 if(obj.value.length>0){
                    obj.value.forEach(function(val){
                        var index=val.siteNameChannel.indexOf("-");
                        if(index>0){
                            top.push(val.siteNameChannel.substr(0,index));
                        }  
                    })
                 }
                 top=unique(top);   
                 $scope.detailZZMT.total=top.length+$scope.detailZZMT.total;
                 $scope.detailZZMT.core=top;
              }else if(obj.type==='onelevel'){
                  var top=[];
                 if(obj.value.length>0){
                    obj.value.forEach(function(val){
                        var index=val.siteNameChannel.indexOf("-");
                        if(index>0){
                            top.push(val.siteNameChannel.substr(0,index));
                        }  
                    })
                 }   
                 top=unique(top);   
                 $scope.detailZZMT.total=top.length+$scope.detailZZMT.total;
                 $scope.detailZZMT.one=top;
              }else if(obj.type==='twolevel'){
                 var top=[];
                 if(obj.value.length>0){
                    obj.value.forEach(function(val){
                    var index=val.siteNameChannel.indexOf("-");
                        if(index>0){
                            top.push(val.siteNameChannel.substr(0,index));
                        } 
                    })
                 } 
                 top=unique(top);     
                 $scope.detailZZMT.total=top.length+$scope.detailZZMT.total;
                $scope.detailZZMT.two=top;
              }else if(obj.type==='top'){
                  var top=[];
                 if(obj.value.length>0){
                    obj.value.forEach(function(val){
                    var index=val.siteNameChannel.indexOf("-");
                        if(index>0){
                            top.push(val.siteNameChannel.substr(0,index));
                        } 
                    })
                 }  
                 top=unique(top);    
                 $scope.detailZZMT.total=top.length+$scope.detailZZMT.total;
                $scope.detailZZMT.top=top;
              }
           })
        });
        
        $scope.cancel = function () {
        $modalInstance.dismiss('cancel'); // 点击取消后撤销模态框
    }
   });
app.filter("toformat",function(){
    return function(num){
        var num = (num || 0).toString(), result = '';
        result=num.substr(0,4)+"-"+num.substr(4,2)+"-"+num.substr(6,2)+" "+num.substr(8,2)+":"+num.substr(10,2)+":"+num.substr(12,2);
        return result;
    }
}); 