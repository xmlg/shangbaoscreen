(function(){
    /**
     * @param   饼状图 lc
     * @param data
     * @returns {{series: *[]}}
     */
    function getDateProportion(proData){
        return {//http://112.74.58.152:9999/statistic/overview?date=2018-06-04&signature=8dd8337d44e49b51ef48215e9ba0c48f
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: ['58%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data: proData,
                color: ["#f9986b", "#fff8d7", "#2d567d", "#de9896", "#6acee5"]
            }]
        };
    }

    //折线图
    function getDateTrend(legends,series){
        return {
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: legends,
                axisLabel: {
                    color: "#69cde2"
                },
                axisLine: {
                    lineStyle: { color: "#69cde2"}
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        width: 3
                    },
                    length: 2
                }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    color: "#69cde2",
                    formatter: function(value, index){
                        return value;
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: ["#1d3b5a"]
                    }
                },
                axisLine: {
                    lineStyle: { color: "#69cde2" }
                },
                axisTick: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        width: 3
                    },
                    length: 2
                }
            },
            series: series
        };
    }

angular.module("myApp").controller("myMsReleCtrl",['$rootScope','$scope','$http','$timeout','$interval','$filter',function($rootScope,$scope,$http,$timeout,$interval,$filter){
    var nowTime = dataHandle.getDateTime();
    var oldForeTime = dataHandle.GetDateStr(-4);
    //两库接口	
    var formUrl = "/isearch/front/szpgdata/getszpatrend.jhtml",
        //纸媒接口
        zmUrl = '/isearch/front/search.jhtml?code=551b1ff558194a0eb61d171ef40f3085&pageNumber=1&pageSize=0&&type=2,4,6,8,11,23,24,25&fastTime=',
        //微博接口
        wbUrl = '/szpg_weibo/weibo_statistics/getData?beginDate='+oldForeTime+'&endDate='+nowTime,
        //app接口
        appUrl = '/szdp/app/find?date='+oldForeTime+','+nowTime,
		formDateUrl="/isearch/front/szpgdata/getszpadata.jhtml";
	
	generalMethod();
    function generalMethod(){
		getzmTotal();
        getApp();
		getSzpgWeibo(); 
	    getAppFormDate();
		$timeout(function(){getData()},500);

	}

    //总接口数据整合
    function getData(){
		$http.get(formUrl).then(function(data){
            var dataArryList = data.data;
            // $scope.appGjTotal = dataArryList[0].appGjTotal;
            // $scope.$on('recall', function (e, newValue) {
            //     if(newValue){
            //         $scope.appGjTotal = newValue;
            //     }
            // });
            $scope.appGjTotal = $scope.dcAppTotal[0]+$scope.aszAppTotal[0]+$scope.AppForm+$scope.dtAppTotal[0];    //app
            $scope.weixinGjTotal = $scope.WeixinForm+$scope.dcWeixinTotal[0]+$scope.dtWeixinTotal[0]+$scope.aszWeixinTotal[0];  //微信0 dataArryList[0].weixinGjTotal+
            $scope.weiboGjTotal=$scope.weiboArrList[0]; //微博 modify by liu.jianghong
            $scope.webGjTotal = dataArryList[0].webGjTotal+$scope.aszWebGjTotal[0];    //网站
			//纸媒
            $scope.zmDayTotal =parseInt($scope.zmTotal[0]); 
            $scope.totalList = $scope.appGjTotal+$scope.weixinGjTotal+$scope.weiboGjTotal+$scope.webGjTotal+$scope.zmDayTotal;
            //今日数据量
            $scope.dateArr = [$scope.zmDayTotal,$scope.webGjTotal,$scope.weixinGjTotal,$scope.weiboGjTotal,$scope.appGjTotal];
            //柱状图方法
            var appQuanDate = $scope.dateArr;
            d3.select("#bar").selectAll("svg").remove();
            dateQuantity(appQuanDate);
            //今日数据比重
			$scope.appPercentage = ($scope.appGjTotal/$scope.totalList)*100;    //app比重
            $scope.weixinPercentage = ($scope.weixinGjTotal/$scope.totalList)*100;    //微信比重
            $scope.weiboPercentage = ($scope.weiboGjTotal/$scope.totalList)*100;    //微信比重
            $scope.webPercentage = ($scope.webGjTotal/$scope.totalList)*100;    //网站比重
            $scope.zmPercentage = ($scope.zmDayTotal/$scope.totalList)*100;    //纸媒比重
            var proData = [
                {value:$scope.weixinPercentage,name:"微信"},
                {value:$scope.webPercentage,name:"网站"},
                {value:$scope.zmPercentage,name:"纸媒"},
                {value:$scope.appPercentage,name:"app"},
                {value:$scope.weiboPercentage,name:"微博"}
                ]
            $scope.dataProportion = getDateProportion(proData);    
            //数据量趋势图
            var zmArrList = [$scope.zmTotal[0],$scope.zmTotal[1],$scope.zmTotal[2],$scope.zmTotal[3],$scope.zmTotal[4]],
                webArrList =$scope.aszWebGjTotal,
                weixinArrList = getWeixinDataTrend(dataArryList),
                // weiboArrList = [],// modify by liu.jianghong
                appArrList = [$scope.appGjTotal],
                appArrTotalList = [],
                weiboArrTotalList =$scope.weiboArrList.reverse();// modify by liu.jianghong
            dataArryList.forEach(function (obj) {
            //  zmArrList.push(obj.zmTotal);
            // webArrList.push(obj.webGjTotal);
            // weixinArrList.push(obj.weixinGjTotal);
                // weiboArrList.push(obj.weiboGjTotal);// modify by liu.jianghong
                appArrList.push(obj.appGjTotal);
            });
			appArrTotalList = [$scope.interfaceAppTotal[4]+dataArryList[4].appGjTotal,$scope.interfaceAppTotal[3]+dataArryList[3].appGjTotal,$scope.interfaceAppTotal[2]+dataArryList[2].appGjTotal,$scope.interfaceAppTotal[1]+dataArryList[1].appGjTotal,$scope.appGjTotal];
            //将数组数据反转
            zmArrList = zmArrList.reverse();
            webArrList = webArrList.reverse();
            weixinArrList = weixinArrList.reverse();
            //weiboArrList = weiboArrList.reverse();// modify by liu.jianghong
            appArrList = appArrList.reverse();
            //循环取出appArrList数组数据累加
            for(var i = 0;i<appArrList.length;i++){
                appArrList[i] = appArrList[i] === null ? 0 : appArrList[i];
                appArrTotalList.push(appArrList[i]+$scope.dcAppTotal[i]+$scope.dtList+1373);
            }
            // modify by liu.jianghong
            // for(var i = 0;i<weiboArrList.length;i++){
            //     weiboArrList[i] = weiboArrList[i] === null ? 0 : weiboArrList[i];
            //     // weiboArrTotalList.push(weiboArrList[i]+$scope.sbweibo[i]+124);
            //     weiboArrTotalList.push(124);
            // }
            //遍历json数组 取出当天时间对象
            var legends = [];
            dataArryList.forEach(function(obj){
                obj.xDate = obj.date+24*60*60*1000;
                legends.push(obj.xDate);
            });
            //取出接口时间戳转换成MM-dd
            for(var i=0;i<5;i++){
                legends.push($filter('date')(legends[i],'MM-dd'));
            }
            //将数组前五个截取掉
            legends.splice(0,5);
            // console.log(legends);
            //将数组时间进行排序
            legends.sort(function(a, b){
                return a.day > b.day ? -1 : 1
            });
            // weiboArrTotalList.pus
            $scope.oldtime = legends[0];
            $scope.nowtime = legends[4];
            var series = [
                {name: '纸媒', type: 'line', data: zmArrList, symbol: "circle", color:['#2e557e']},
                {name: '网站', type: 'line', data: webArrList, symbol: "circle", color:['#fff8d7']},
                {name: '微信', type: 'line', data: weixinArrList, symbol: "circle", color:['#f9966c']},
                {name: '微博', type: 'line', data: weiboArrTotalList, symbol: "circle", color:['#6acce4']},
                {name: 'app', type: 'line', data: appArrTotalList, symbol: "circle", color:['#d69093']}
            ];
            $scope.dateTrend = getDateTrend(legends,series);
		 
    });
    }
    //微信趋势图数据
    function getWeixinDataTrend(obj){
		var dataList=[];
		for(var i in $scope.dcWeixinTotal){
			dataList.push(filterNull($scope.dcWeixinTotal[i])+filterNull($scope.aszWeixinTotal[i])
			+filterNull(obj[i].weixinGjTotal)+filterNull($scope.dtWeixinTotal[i])+9)
		}
		return dataList;
	}
     
	function filterNull(obj){
		return obj==undefined?0:obj;
	} 
	
	function getzmTotal(){//纸媒
	    $scope.zmTotal=[];
			$http.get(zmUrl+dataHandle.GetDateStr(0)).then(
				function (data){
					$scope.zmTotal[0]=data.data.page.total;
			});	
			$http.get(zmUrl+dataHandle.GetDateStr(-1)).then(
				function (data){
					$scope.zmTotal[1]=data.data.page.total;
			});	
			$http.get(zmUrl+dataHandle.GetDateStr(-2)).then(
				function (data){
					$scope.zmTotal[2]=data.data.page.total;
			});	
			$http.get(zmUrl+dataHandle.GetDateStr(-3)).then(
				function (data){
					$scope.zmTotal[3]=data.data.page.total;
			});	
			$http.get(zmUrl+dataHandle.GetDateStr(-4)).then(
				function (data){
					$scope.zmTotal[4]=data.data.page.total;
			});				
	}
	function getSzpgWeibo(){//微博数据接口
		$http.get(wbUrl).then(function(data){
			$scope.weiboArrList=[];
			var obj=data.data,num=0;
			for(var i in obj){
				i=parseInt(i);
				num+=(obj[i].ARTICLE_TODAY!=undefined&&obj[i].ARTICLE_TODAY>0)?obj[i].ARTICLE_TODAY:0;
				if(parseInt(i==obj.length-1?0:obj[i+1].LOADTIME/100000)!=parseInt(obj[i].LOADTIME/100000)){
					$scope.weiboArrList.push(num);
					num=0;
				}
			}
		});
    }

	 function getAppFormDate(){
		$scope.AppForm=0;
		$scope.WeiboForm=0;
		$scope.WeixinForm=0;
		$http.get(formDateUrl).then(function(data){
			data.data.forEach(function(obj){
                $scope.AppForm=$scope.AppForm+(obj.appGjTotal!=undefined?obj.appGjTotal:0);
				$scope.WeiboForm=$scope.AppForm+(obj.appGjTotal!=undefined?obj.appGjTotal:0); 
				$scope.WeixinForm=$scope.WeixinForm+(obj.weixinGjTotal!=undefined?obj.weixinGjTotal:0); 				
            });
		})
	}

    //app
    function getApp(){//五日数据量
        $scope.dcAppTotal=[0,0,0,0,0];
		$scope.aszAppTotal = [0,0,0,0,0];
		$scope.dtAppTotal=[0,0,0,0,0];
		$scope.dcWeixinTotal=[0,0,0,0,0];
		$scope.aszWeixinTotal = [0,0,0,0,0];
		$scope.dtWeixinTotal=[0,0,0,0,0];
		$scope.aszWebGjTotal=[0,0,0,0,0];
        $scope.interfaceAppTotal=[];
		var dateNum=0;
        var num=0;
        $http.get(appUrl).then(function(data){
			var obj=data.data;
            for(var i=obj.length-1;i>=0;i--){
				var dateStr=dataHandle.getDateTime(obj[i].date);
				if(dataHandle.GetDateStr(0)===dateStr){
					dateNum=0;
				}else if(dataHandle.GetDateStr(-1)===dateStr){
					dateNum=1;
				}else if(dataHandle.GetDateStr(-2)===dateStr){
					dateNum=2;
				}else if(dataHandle.GetDateStr(-3)===dateStr){
					dateNum=3;
				}else if(dataHandle.GetDateStr(-4)===dateStr){
					dateNum=4;
				}
				if(obj[i].appName=="读创"){
					 $scope.dcAppTotal.splice(dateNum,1,obj[i].gjDateTotal);	
					$scope.dcWeixinTotal.splice(dateNum,1,obj[i].weixinArticleDateTotal);
				}else if(obj[i].appName=="@深圳"){
					$scope.aszAppTotal.splice(dateNum,1,obj[i].gjDateTotal);
					$scope.aszWeixinTotal.splice(dateNum,1,obj[i].weixinArticleDateTotal);
					$scope.aszWebGjTotal.splice(dateNum,1,obj[i].webArticleDateTotal);
				}else if(obj[i].appName=="读特"){
					$scope.dtWeixinTotal.splice(dateNum,1,obj[i].weixinArticleDateTotal);
                    $scope.dtAppTotal.splice(dateNum,1,obj[i].gjDateTotal);
                }
                num=obj[i].gjDateTotal+num;
                if(i-1>=0&&obj[i].date==obj[i-1].date){         
                }else{
                    $scope.interfaceAppTotal.push(num);
                    num=0;
                }

		    } 	
		});
		
    }

	//实时更新数据
    var intervalTime = $interval(function(){
	    generalMethod();
		//重新渲染柱状图
		d3.select("#bar").selectAll("svg").remove();
		var appQuanDate = $scope.dateArr;
		dateQuantity(appQuanDate);
 
    },1000*60*15,-1);

          
    // 清除定时器
    $scope.$on('$destroy',function(){
        $interval.cancel(intervalTime);
    });
}]);

//将数字按三位逗号隔开
angular.module("myApp").filter("toThousands",function(){
    return function(num){
        var num = (num || 0).toString(), result = '';
        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        return result;
    }
});

})();