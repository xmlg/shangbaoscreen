var app = angular.module('app', []);
app.controller('newMediaController', function ($rootScope,$scope, $http,$timeout,$interval,$location) {
   var navUrl = "/isearch/manager/individual/index.jhtml";
	$.ajax({
		url: navUrl,
		type: "GET",
		dataType: "json",
		async: false,
		 success:function(res){
			var i=0,menuDatas=res.authorityCategoryTree;
			var isPermission=false;		
			while (i < menuDatas.length){ //获取第一层菜单，放到treeData
						if(menuDatas[i].parent&&menuDatas[i].name=='大屏数据录入'){
							isPermission=true;
							break;
						}
								i++;
						}
                  if(isPermission){
                  	getData();
					//logout();
                  }else{
                  	window.location="./login.html"
                  }
                }
            ,
			error:function(){
				window.location="./login.html"
			}    
		
	});
   function logout(){
        var logoutUrl = "/isearch/manager/logout.jhtml";
        $http.get(logoutUrl);
		$.cookie("username","");
    };

    function GetDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期 
        var d = dd.getDate();
        return y + "-" + m + "-" + d;
    }

    function getData(){
    	var jkUrl="/szdp/app/find?date="+GetDateStr(0);
    	$http.get(jkUrl).success(function(data){
             for(var i in data){
             	if(data[i].appName==='读创'){
                   $scope.dcDownTotal=data[i].userTotal;
                   $scope.dcDayTotal=data[i].appDayActiveTotal;
                   $scope.sbweiboFansTotal=data[i].weiboUserTotal;
                   $scope.sbweiboReadTotal=data[i].weiboReadDay;
                   $scope.sbweixinFansTotal=data[i].weixinUserTotal;
                   $scope.sbweixinReadTotal=data[i].weixinReadDay;
                   $scope.ttFansTotal=data[i].ttFansTotal==0?170065:data[i].ttFansTotal;
                   $scope.ttReadTotal=data[i].ttReadDay==0?1225:data[i].ttReadDay;
             	}else if(data[i].appName==='读特'){
                   $scope.dtDownTotal=data[i].userTotal;
                   $scope.dtDayTotal=data[i].appDayActiveTotal;
                   $scope.tqbweiboFansTotal=data[i].weiboUserTotal;
                   $scope.tqbweiboReadTotal=data[i].weiboReadDay;
                   $scope.tqbweixinFansTotal=data[i].weixinUserTotal;
                   $scope.tqbweixinReadTotal=data[i].weixinReadDay;
             	}
             }
    	});
    	var tbUrl="/isearch/front/szpgdata/getszpadata.jhtml"
    	$http.get(tbUrl).success(function(data){
             for(var i in data){
             	if(data[i].source==='晶报'){    
                   $scope.jbweiboFansTotal=data[i].weiboFansTotal==null?0:data[i].weiboFansTotal;
                   $scope.jbweiboReadTotal=data[i].weiboReadDay==null?0:data[i].weiboReadDay;
                   $scope.jbweixinFansTotal=data[i].weixinUserTotal==null?0:data[i].weixinUserTotal;
                   $scope.jbweixinReadTotal=data[i].weixinReadDay==null?0:data[i].weixinReadDay;
             	}else if(data[i].source==='深圳晚报(深圳ZAKER)'){
                   $scope.ZAKERDownTotal=data[i].appUserTotal==null?0:data[i].appUserTotal;
                   $scope.ZAKERDayTotal=data[i].appDayActiveTotal==null?0:data[i].appDayActiveTotal;
                   $scope.wbweiboFansTotal=data[i].weiboFansTotal==null?0:data[i].weiboFansTotal;
                   $scope.wbweiboReadTotal=data[i].weiboReadDay==null?0:data[i].weiboReadDay;
                   $scope.wbweixinFansTotal=data[i].weixinUserTotal==null?0:data[i].weixinUserTotal;
                   $scope.wbweixinReadTotal=data[i].weixinReadDay==null?0:data[i].weixinReadDay;
             	}else if(data[i].source==='深圳晚报(深圳网易)'){
                   $scope.wyDownTotal=data[i].appUserTotal==null?0:data[i].appUserTotal;
                   $scope.wyDayTotal=data[i].appDayActiveTotal==null?0:data[i].appDayActiveTotal;
             	}
             }
    	});
    }
});