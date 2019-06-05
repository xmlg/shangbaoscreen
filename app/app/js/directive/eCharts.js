angular.module("myApp").directive("eCharts", function($window){
    return {
        restrict: "A",
        scope: true,
        link: function(scope, iElement, iAttrs, controller){
            var chart = echarts.init(iElement.get(0));
            var optionStr = iAttrs.eCharts; //获取echart参数属性值
            // var isAnimate = iAttrs.eChartsAnimate;
            // var action = iAttrs.eChartsEvents;
            // var addData = iAttrs.eChartsAdddata;
            // var refresh = iAttrs.eChartsRefresh;

            scope.$watch(optionStr, function(v){
                if(v){
                    // v.animation = eval(isAnimate);
                    chart.setOption(v);

                    // if (action) {
                    //     scope[action](chart, v)
                    // }
                }
            });

            // scope.$watch(addData, function (v) {
            //     if (v) {
            //         var data = parseFloat(v.split("-")[0]),
            //             xData = v.split("-")[1],
            //             preDataLength = chart._option.xAxis[0].data.length;
            //
            //         if (preDataLength > 5) {
            //             chart._option.xAxis[0].data.splice(0, 1);
            //             chart._option.series[0].data.splice(0, 1);
            //         }
            //
            //         chart._option.xAxis[0].data.push(xData);
            //         chart._option.series[0].data.push(data);
            //         chart.setOption(chart._option);
            //     }
            // });

            // scope.$watch(refresh, function (v) {
            //     if (v) {
            //         chart._option.series[0].data = v;
            //         chart.setOption(chart._option);
            //     }
            // });

            // iAttrs.$observe("eChartsTheme", function(v){
            //     if(v){
            //         chart.setTheme(v);
            //     }
            // });
        }
    }
});