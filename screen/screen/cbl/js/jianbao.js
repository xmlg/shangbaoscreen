/**
 * Created by shang on 2019/1/17.
 */
var app = angular.module('app', []);
app.controller('jianbaoController',
    function ($rootScope, $scope, $http, $timeout, $interval, $filter) {
        $scope.gjChecked=true;
        $scope.ycChecked=true;
        $scope.thisWeekChecked=true;
        $scope.lastWeekChecked=true;

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
    $scope.startTimeShow=day.format("yyyy.MM.dd");
    day.setDate(day.getDate() + 6);//本周最后一天
    var endTime = day.format("yyyyMMdd");
     $scope.endTimeShow=day.format("yyyy.MM.dd");
       function login(){
        $http.get("/datas/api/login?username=szxinwenwang&password=szxinwenwang1226").success(function(data){
           getGJ(startTime,endTime);
           getGJZB(startTime,endTime)
        });
    }
     login()
    function getGJ(start,end){
        $http.get("/datas/api/cas/docstatistic/total?mediaUnitName=深圳报业集团"+"&startTime="+start+"&endTime="+end).success(function(data){
           data.data.forEach(function(obj){
              if(obj.type==='total'){
                 $scope.gjTotal=obj.value;
              }else if(obj.type==='original'){
                 $scope.gjycTotal=obj.value;
              }
           })
        });
         $http.get("/datas/api/cas/transmission/searchList?infoType=&pageSize=1&mediaUnitName=%E6%B7%B1%E5%9C%B3%E6%8A%A5%E4%B8%9A%E9%9B%86%E5%9B%A2"+"&startTime="+start+"&endTime="+end).success(function(data){
          $scope.bestNews=data.data.content[0];
          $http.get("/datas/api/cas/docdetail/getMediaReprintOut?mediaUnitName=深圳报业集团&searchType=1&docId="+data.data.content[0].sid).success(function(data){
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
        });
         var day = new Date();
        day.setTime(day.getTime()-24*60*60*1000*7*2);
        var num = day.getDay()-1;
        day.setDate(day.getDate() - num); //本周第一天
        var startTime = day.format("yyyyMMdd");
        day.setDate(day.getDate() + 6);//本周最后一天
        var endTime = day.format("yyyyMMdd");
        $http.get("/datas/api/cas/docstatistic/total?mediaUnitName=深圳报业集团"+"&startTime="+startTime+"&endTime="+endTime).success(function(data){
           data.data.forEach(function(obj){
              if(obj.type==='total'){
                 $scope.lastgjTotal=obj.value;
              }else if(obj.type==='original'){
                 $scope.lastgjycTotal=obj.value;
              }
           })
        });
    }
    var objectArraySort = function (keyName) {
         return function (objectN, objectM) {
          var valueN = objectN[keyName]
          var valueM = objectM[keyName]
          if (valueN < valueM) return 1
          else if (valueN > valueM) return -1
          else return 0
         }
        }
   function getTOP3(obj){
       var array=[];
       for(var val in obj){
         array.push(obj[val])
       }
       var array1 = array.concat([]);
       $scope.psTop=array.sort(objectArraySort('ps'));
       $scope.zsTop=array1.sort(objectArraySort('zs')); 
    }
    function getGJZB(start,end){
        $http.get("/datas/api/cas/docstatistic/channelList?mediaUnitName=深圳报业集团&pageSize=5"+"&startTime="+start+"&endTime="+end).success(function(data){
            $scope.gjzb={};
            data.data.forEach(function(obj){
                if(obj.type==='1'){
                 $scope.gjzb.web=obj;
                }else if(obj.type==='4'){
                 $scope.gjzb.weibo=obj;
                }else if(obj.type==='5'){
                 $scope.gjzb.paper=obj;
                }else if(obj.type==='7'){
                 $scope.gjzb.app=obj;
                }else if(obj.type==='8'){
                 $scope.gjzb.weixin=obj;
                }
            });
            ycData();
            gjData();
            bar1Data();
        });
        $http.get("/datas/api/cas/docstatistic/reprintsCounts?mediaUnitName=深圳报业集团"+"&startTime="+start+"&endTime="+end).success(function(data){
            $scope.ycTotalThisWeek={
                news:0,tqb:0,sb:0,wb:0,jb:0,barb:0,dt:0,dc:0,jz:0,total:0
            }
            $scope.ycReprintsThisWeek={
                news:{ps:0,zs:0},tqb:{ps:0,zs:0},sb:{ps:0,zs:0},wb:{ps:0,zs:0},jb:{ps:0,zs:0},barb:{ps:0,zs:0},dt:{ps:0,zs:0},dc:{ps:0,zs:0},jz:{ps:0,zs:0},total:{ps:0,zs:0}
            }
            data.data.total.forEach(function(obj){
                 $scope.ycTotalThisWeek.total=$scope.ycTotalThisWeek.total+obj.numberOfArticles;
                if(obj.siteName==='深圳新闻网'){
                  $scope.ycTotalThisWeek.news=obj.numberOfArticles+$scope.ycTotalThisWeek.news;
                }else if(obj.siteName==='深圳特区报'){
                  $scope.ycTotalThisWeek.tqb=obj.numberOfArticles+$scope.ycTotalThisWeek.tqb;
                }else if(obj.siteName==='深圳商报'){
                 $scope.ycTotalThisWeek.sb=obj.numberOfArticles+$scope.ycTotalThisWeek.sb;
                }else if(obj.siteName==='深圳晚报'){
                 $scope.ycTotalThisWeek.wb=obj.numberOfArticles+$scope.ycTotalThisWeek.wb;
                }else if(obj.siteName==='晶报'){
                 $scope.ycTotalThisWeek.jb=obj.numberOfArticles+$scope.ycTotalThisWeek.jb;
                }else if(obj.siteName==='宝安日报'){
                 $scope.ycTotalThisWeek.barb=obj.numberOfArticles+$scope.ycTotalThisWeek.barb;
                }else if(obj.siteName==='读特客户端'){
                 $scope.ycTotalThisWeek.dt=obj.numberOfArticles+$scope.ycTotalThisWeek.dt;
                }else if(obj.siteName==='读创客户端'){
                 $scope.ycTotalThisWeek.dc=obj.numberOfArticles+$scope.ycTotalThisWeek.dc;
                }else if(obj.siteName==='见圳客户端'){
                 $scope.ycTotalThisWeek.jz=obj.numberOfArticles+$scope.ycTotalThisWeek.jz;
                }
            });
            data.data.totalReprints.forEach(function(obj){
                $scope.ycReprintsThisWeek.total.ps=$scope.ycReprintsThisWeek.total.ps+obj.numberOfArticles;
                $scope.ycReprintsThisWeek.total.zs=$scope.ycReprintsThisWeek.total.zs+obj.numberOfTimes;
                if(obj.siteName==='深圳新闻网'){
                  $scope.ycReprintsThisWeek.news.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.news.ps;
                  $scope.ycReprintsThisWeek.news.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.news.zs;
                  $scope.ycReprintsThisWeek.news.siteName=obj.siteName;
                }else if(obj.siteName==='深圳特区报'){
                  $scope.ycReprintsThisWeek.tqb.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.tqb.ps;
                  $scope.ycReprintsThisWeek.tqb.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.tqb.zs;
                  $scope.ycReprintsThisWeek.tqb.siteName=obj.siteName;
                }else if(obj.siteName==='深圳商报'){
                 $scope.ycReprintsThisWeek.sb.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.sb.ps;
                 $scope.ycReprintsThisWeek.sb.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.sb.zs;
                 $scope.ycReprintsThisWeek.sb.siteName=obj.siteName;
                }else if(obj.siteName==='深圳晚报'){
                 $scope.ycReprintsThisWeek.wb.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.wb.ps;
                 $scope.ycReprintsThisWeek.wb.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.wb.zs;
                 $scope.ycReprintsThisWeek.wb.siteName=obj.siteName;
                }else if(obj.siteName==='晶报'){
                 $scope.ycReprintsThisWeek.jb.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.jb.ps;
                 $scope.ycReprintsThisWeek.jb.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.jb.zs;
                 $scope.ycReprintsThisWeek.jb.siteName=obj.siteName;
                }else if(obj.siteName==='宝安日报'){
                 $scope.ycReprintsThisWeek.barb.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.barb.ps;
                 $scope.ycReprintsThisWeek.barb.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.barb.zs;
                 $scope.ycReprintsThisWeek.barb.siteName=obj.siteName;
                }else if(obj.siteName==='读特客户端'){
                 $scope.ycReprintsThisWeek.dt.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.dt.ps;
                 $scope.ycReprintsThisWeek.dt.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.dt.zs;
                 $scope.ycReprintsThisWeek.dt.siteName=obj.siteName;
                }else if(obj.siteName==='读创客户端'){
                 $scope.ycReprintsThisWeek.dc.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.dc.ps;
                 $scope.ycReprintsThisWeek.dc.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.dc.zs;
                 $scope.ycReprintsThisWeek.dc.siteName=obj.siteName;
                }else if(obj.siteName==='见圳客户端'){
                 $scope.ycReprintsThisWeek.jz.ps=obj.numberOfArticles+$scope.ycReprintsThisWeek.jz.ps;
                 $scope.ycReprintsThisWeek.jz.zs=obj.numberOfTimes+$scope.ycReprintsThisWeek.jz.zs;
                 $scope.ycReprintsThisWeek.jz.siteName=obj.siteName;
                }
            });
            $scope.ycReprintsThisWeek.jz.ps='-';
            $scope.ycReprintsThisWeek.jz.zs='-';
            getTOP3($scope.ycReprintsThisWeek);
            bar2Data();  
            bar3Data();
        });
      /*  var day = new Date();
        day.setTime(day.getTime()-24*60*60*1000*7*2);
        var num = day.getDay()-1;
        day.setDate(day.getDate() - num); //本周第一天
        var startTime = day.format("yyyyMMdd");
        day.setDate(day.getDate() + 6);//本周最后一天
        var endTime = day.format("yyyyMMdd");
        $http.get("/datas/api/cas/docstatistic/total?mediaUnitName=深圳报业集团"+"&startTime="+startTime+"&endTime="+endTime).success(function(data){
           data.data.forEach(function(obj){
              if(obj.type==='total'){
                 $scope.lastgjTotal=obj.value;
              }else if(obj.type==='original'){
                 $scope.lastgjycTotal=obj.value;
              }
           })
        });
         $http.get("/datas/api/cas/docstatistic/reprintsCounts?mediaUnitName=深圳报业集团"+"&startTime="+startTime+"&endTime="+endTime).success(function(data){
            $scope.ycTotalLastWeek={
                news:0,tqb:0,sb:0,wb:0,jb:0,barb:0,dt:0,dc:0,jz:0,total:0
            }
            $scope.ycReprintsLastWeek={
                news:{ps:0,zs:0},tqb:{ps:0,zs:0},sb:{ps:0,zs:0},wb:{ps:0,zs:0},jb:{ps:0,zs:0},barb:{ps:0,zs:0},dt:{ps:0,zs:0},dc:{ps:0,zs:0},jz:{ps:0,zs:0},total:{ps:0,zs:0}
            }
            data.data.total.forEach(function(obj){
                $scope.ycTotalLastWeek.total=$scope.ycTotalLastWeek.total+obj.numberOfArticles;
                if(obj.siteName==='深圳新闻网'){
                  $scope.ycTotalLastWeek.news=obj.numberOfArticles+$scope.ycTotalLastWeek.news;
                  $scope.ycTotalLastWeek.total=$scope.ycTotalLastWeek.total+obj.numberOfArticles;
                }else if(obj.siteName==='深圳特区报'){
                  $scope.ycTotalLastWeek.tqb=obj.numberOfArticles+$scope.ycTotalLastWeek.tqb;
                }else if(obj.siteName==='深圳商报'){
                 $scope.ycTotalLastWeek.sb=obj.numberOfArticles+$scope.ycTotalLastWeek.sb;
                }else if(obj.siteName==='深圳晚报'){
                 $scope.ycTotalLastWeek.wb=obj.numberOfArticles+$scope.ycTotalLastWeek.wb;
                }else if(obj.siteName==='晶报'){
                 $scope.ycTotalLastWeek.jb=obj.numberOfArticles+$scope.ycTotalLastWeek.jb;
                }else if(obj.siteName==='宝安日报'){
                 $scope.ycTotalLastWeek.barb=obj.numberOfArticles+$scope.ycTotalLastWeek.barb;
                }else if(obj.siteName==='读特客户端'){
                 $scope.ycTotalLastWeek.dt=obj.numberOfArticles+$scope.ycTotalLastWeek.dt;
                }else if(obj.siteName==='读创客户端'){
                 $scope.ycTotalLastWeek.dc=obj.numberOfArticles+$scope.ycTotalLastWeek.dc;
                }else if(obj.siteName==='见圳客户端'){
                 $scope.ycTotalLastWeek.jz=obj.numberOfArticles+$scope.ycTotalLastWeek.jz;
                }
            });
             data.data.totalReprints.forEach(function(obj){
                $scope.ycReprintsLastWeek.total.ps=$scope.ycReprintsLastWeek.total.ps+obj.numberOfArticles;
                $scope.ycReprintsLastWeek.total.zs=$scope.ycReprintsLastWeek.total.zs+obj.numberOfTimes;
                if(obj.siteName==='深圳新闻网'){
                  $scope.ycReprintsLastWeek.news.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.news.ps;
                  $scope.ycReprintsLastWeek.news.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.news.zs;
                }else if(obj.siteName==='深圳特区报'){
                  $scope.ycReprintsLastWeek.tqb.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.tqb.ps;
                  $scope.ycReprintsLastWeek.tqb.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.tqb.zs;
                }else if(obj.siteName==='深圳商报'){
                 $scope.ycReprintsLastWeek.sb.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.sb.ps;
                 $scope.ycReprintsLastWeek.sb.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.sb.zs
                }else if(obj.siteName==='深圳晚报'){
                 $scope.ycReprintsLastWeek.wb.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.wb.ps;
                 $scope.ycReprintsLastWeek.wb.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.wb.zs
                }else if(obj.siteName==='晶报'){
                 $scope.ycReprintsLastWeek.jb.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.jb.ps;
                 $scope.ycReprintsLastWeek.jb.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.jb.zs
                }else if(obj.siteName==='宝安日报'){
                 $scope.ycReprintsLastWeek.barb.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.barb.ps;
                 $scope.ycReprintsLastWeek.barb.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.barb.zs
                }else if(obj.siteName==='读特客户端'){
                 $scope.ycReprintsLastWeek.dt.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.dt.ps;
                 $scope.ycReprintsLastWeek.dt.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.dt.zs
                }else if(obj.siteName==='读创客户端'){
                 $scope.ycReprintsLastWeek.dc.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.dc.ps;
                 $scope.ycReprintsLastWeek.dc.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.dc.zs
                }else if(obj.siteName==='见圳客户端'){
                 $scope.ycReprintsLastWeek.jz.ps=obj.numberOfArticles+$scope.ycReprintsLastWeek.jz.ps;
                 $scope.ycReprintsLastWeek.jz.zs=obj.numberOfTimes+$scope.ycReprintsLastWeek.jz.zs
                }
            });
            $timeout(function(){
              console.log($scope.ycReprintsLastWeek)
            console.log($scope.ycReprintsThisWeek)
            bar2Data();  
        },500)
             
        });*/
    }
  
    $scope.changegj=function(val){
       if(val==1){
          $scope.gjChecked=!$scope.gjChecked;
          bar1Data();
       }else if(val==2){
         $scope.ycChecked=!$scope.ycChecked;
          bar1Data();
       }
    }
    $scope.changeDate=function(val){
       if(val==1){
          $scope.thisWeekChecked=!$scope.thisWeekChecked;
          bar2Data();
       }else if(val==2){
         $scope.lastWeekChecked=!$scope.lastWeekChecked;
          bar2Data();
       }
    }
    function ycData(){
     var data=$scope.gjzb;
    	var chartyc = echarts.init(document.getElementById('chartyc'));	
    var option = {
     tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
     title: {
        text: '原创占比',
        x: 'center',
        y: '47%',
        textStyle : {
            color : 'rgba(30,144,255,0.8)',
            fontFamily : '微软雅黑',
            fontSize : 24,   
         }
    },
    color: ['#507bee', '#ffbb56', '#07de65', '#f05396', '#0f9ad3'],
    calculable : false,
    series : [
        {
            name:'',
            type:'pie',
            radius: ['46%', '70%'],
            center: ['50%', '55%'],
            // for funnel
            x: '60%',
            width: '35%',
            funnelAlign: 'left',
            max: 1048,
            label: {
                normal: {
                    formatter: '{b|{b}:}{c}',
                    padding: [0,-6,2,-15],
                     fontSize : 20,
                    rich: {
                        per: {
                            color: '#eee',
                            backgroundColor: '',
                            padding: [3, 4],
                            borderRadius: 2,
                            fontSize : 20
                        }
                    }
                }
            },
            data:[
                {value:data.paper.originalNum, name:'数字报'},
                {value:data.web.originalNum, name:'网站'},
                {value:data.weixin.originalNum, name:'微信'},
                {value:data.app.originalNum, name:'APP'},
                {value:data.weibo.originalNum, name:'微博'}
            ]
         }
       ]
    };
    if (option && typeof option === "object") {
          chartyc.setOption(option, true);
        }
    }
    function gjData(){
        var data=$scope.gjzb;
    	var chartyc = echarts.init(document.getElementById('chartgj'));	
    var option = {
        tooltip: {
        trigger: 'item',
        formatter: "{b}: {c} ({d}%)"
    },
     title: {
        text: '总稿件占比',
        x: 'center',
        y: '47%',
        textStyle : {
            color : 'rgba(30,144,255,0.8)',
            fontFamily : '微软雅黑',
            fontSize : 24,   
         }
    },
    color: ['#00f1f2', '#ffbb56', '#07de65', '#f05396', '#0f9ad3'],
    calculable : false,
    series : [
        {
            name:'',
            type:'pie',
            radius: ['45%', '70%'],
            center: ['50%', '55%'],
            // for funnel
            x: '60%',
            width: '35%',
            funnelAlign: 'left',
            max: 1048, 
            label: {
                normal: {
                    formatter: '{b|{b}:}{c}',
                    padding: [0,-10,0,-8],
                    fontSize : 20,
                    rich: {
                        per: {
                            color: '#eee',
                            backgroundColor: '',
                            padding: [2, 4],
                            borderRadius: 2,
                            fontSize : 20
                        }
                    }
                }
            }, 
            data:[
                {value:data.paper.noriginalNum+data.paper.originalNum, name:'数字报'},
                {value:data.web.noriginalNum+data.web.originalNum, name:'网站'},
                {value:data.weixin.noriginalNum+data.weixin.originalNum, name:'微信'},
                {value:data.app.noriginalNum+data.app.originalNum, name:'APP'},
                {value:data.weibo.noriginalNum+data.weibo.originalNum, name:'微博'}
            ]
         }
       ]
    };
    if (option && typeof option === "object") {
          chartyc.setOption(option, true);
        }
    }
    function bar1Data(){
    var data=$scope.gjzb;
    var show=[];
    var data1={
            name:'稿件总数',
            type:'bar',
            show:false,
            barWidth: 45,
             label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 24
                }
            },
            itemStyle: {emphasis: {
                            barBorderRadius: 30
                        },normal: {barBorderRadius:[15, 15, 15, 15],color:'#00f1f2', label:{show:true}}},
            data:[data.paper.originalNum+data.paper.noriginalNum,data.web.originalNum+data.web.noriginalNum,data.app.originalNum+data.app.noriginalNum,data.weibo.originalNum+data.weibo.noriginalNum, data.weixin.originalNum+data.weixin.noriginalNum]
        };
      var data2={
            name:'原创稿件',
            type:'bar',
            barWidth: 45,
             label: {
                normal: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 24
                }
            },
            itemStyle: {emphasis: {
                            barBorderRadius: 30
                        },normal: {barBorderRadius:[15, 15, 15, 15],color:'#507bee7d', label:{show:true,formatter:function(p){return p.value > 0 ? (p.value +'\n'):'';}}}},
            data:[data.paper.originalNum,data.web.originalNum,data.app.originalNum,data.weibo.originalNum, data.weixin.originalNum]
          
        };  
    if($scope.gjChecked){
       show.push(data1)
    }
    if($scope.ycChecked){
      show.push(data2)
    }
	var chartbar1 = echarts.init(document.getElementById('chartbar1'));	
    var option = {
    tooltip: {
        trigger: 'item'
    },
    calculable: true,
    grid: {
        borderWidth: 0,
        y: '10%',
        y2: 0
    },
    xAxis: [
        {
            type: 'category',
            show: false
        },
        {
            type : 'category',
            axisLine: {show:false},
            axisTick: {show:false},
            axisLabel: {show:false},
            splitArea: {show:false},
            splitLine: {show:false}
        }
    ],
    yAxis: [
        {
            type: 'value',
            show: false
        }
    ],
    series: show
    };
    if (option && typeof option === "object") {
          chartbar1.setOption(option, true);
        }
    }
    function bar2Data(){
    var show=[];
    var data1={
            name:'本周数据',
            type:'bar',
            barWidth: '40%',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#ffffff',
                    fontSize: 24
                }
            },
            itemStyle : {emphasis: {
                            barBorderRadius: 20
                        },normal: {barBorderRadius:[10, 10, 10, 10],color:'#00f1f2',label : {show: true, position: 'insideRight'}}},
            data: [$scope.ycTotalThisWeek.barb,0,$scope.ycTotalThisWeek.jb, $scope.ycTotalThisWeek.wb, $scope.ycTotalThisWeek.sb, $scope.ycTotalThisWeek.tqb]
        };
 /*   var data2={
            name:'上周数据',
            type:'bar',
            barWidth: '40%',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#ffffff',
                    fontSize: 15
                }
            },
            itemStyle : {emphasis: {
                            barBorderRadius: 20
                        },normal: {barBorderRadius:[10, 10, 10, 10],color:'#507bee7d',label : {show: true, position: 'insideRight'}}},
            data:[$scope.ycTotalLastWeek.jz, $scope.ycTotalLastWeek.dc, $scope.ycTotalLastWeek.dt, $scope.ycTotalLastWeek.news, $scope.ycTotalLastWeek.barb, $scope.ycTotalLastWeek.jb, $scope.ycTotalLastWeek.wb, $scope.ycTotalLastWeek.sb, $scope.ycTotalLastWeek.tqb]
        };*/
     if($scope.thisWeekChecked){
        show.push(data1)
     } 
  /*   if($scope.lastWeekChecked){
        show.push(data2)
     }   */     
    var chartbar1 = echarts.init(document.getElementById('chartpapertype'));	
    var option = {
       calculable : true,
    xAxis : [
        {
            type : 'value',
            show: false
        }
    ],
    grid: {
        borderWidth: 0,
        y: 2,
        y2:0,
        x: 140
    },
    yAxis : [
        {
            type : 'category',
            data : ['宝安日报','英文报','晶报','深圳晚报','深圳商报','深圳特区报'],
            axisLine: {
            	show: false
            },
            axisTick:{
            	show: false
            },
            axisLabel: {
            	textStyle: {
            		color: '#ffffff',
            		fontSize: 24
            	},
            	show: true
            }
        }
    ],
    series : show
    };
    if (option && typeof option === "object") {
          chartbar1.setOption(option, true);
        }
    }
     function bar3Data(){
    var show=[];
    var data1={
            name:'本周数据',
            type:'bar',
            barWidth: '40%',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#ffffff',
                    fontSize: 24
                }
            },
            itemStyle : {emphasis: {
                            barBorderRadius: 20
                        },normal: {barBorderRadius:[10, 10, 10, 10],color:'#00f1f2',label : {show: true, position: 'insideRight'}}},
            data:[0,0,$scope.ycTotalThisWeek.news,0, $scope.ycTotalThisWeek.dc, $scope.ycTotalThisWeek.dt,0,$scope.ycTotalThisWeek.news]
        };
 /*   var data2={
            name:'上周数据',
            type:'bar',
            barWidth: '40%',
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    color: '#ffffff',
                    fontSize: 15
                }
            },
            itemStyle : {emphasis: {
                            barBorderRadius: 20
                        },normal: {barBorderRadius:[10, 10, 10, 10],color:'#507bee7d',label : {show: true, position: 'insideRight'}}},
            data:[$scope.ycTotalLastWeek.jz, $scope.ycTotalLastWeek.dc, $scope.ycTotalLastWeek.dt, $scope.ycTotalLastWeek.news, $scope.ycTotalLastWeek.barb, $scope.ycTotalLastWeek.jb, $scope.ycTotalLastWeek.wb, $scope.ycTotalLastWeek.sb, $scope.ycTotalLastWeek.tqb]
        };*/
     if($scope.thisWeekChecked){
        show.push(data1)
     } 
  /*   if($scope.lastWeekChecked){
        show.push(data2)
     }   */     
    var chartbar1 = echarts.init(document.getElementById('chartothertype'));   
    var option = {
       calculable : true,
    xAxis : [
        {
            type : 'value',
            show: false
        }
    ],
    grid: {
        borderWidth: 0,
        y: 2,
        y2:0,
        x: 180
    },
    yAxis : [
        {
            type : 'category',
            data : ['深圳ZAKER','深圳网易','见圳客户端','晶报客户端','读创客户端','读特客户端','EYESHENZHEN','深圳新闻网'],
            axisLine: {
                show: false
            },
            axisTick:{
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: 24
                },
                show: true
            }
        }
    ],
    series : show
    };
    if (option && typeof option === "object") {
          chartbar1.setOption(option, true);
        }
    }    
   });
//将数字按三位逗号隔开数字格式化
app.filter("toThousands",function(){
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