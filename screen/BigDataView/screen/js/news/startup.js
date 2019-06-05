$(function() {
    zbdp.resizePage();
    window.onresize = function() {
        throttle(zbdp.resizePage);
    }

    function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
            method.call(context);
        }, 100);
    }

    zbdp.initNews(timeDate);

    //zbdp.loadEmergency();
});

var cluster_name='country_1';
var timeDate=laydate.now();

laydate({
	elem: '#J-xl',max:laydate.now()
});
//设置input 默 认时间
$('#J-xl').attr('value',laydate.now());
$("#Timedate").html(timeDate);

function getData(time,cluster_name){
    $("#Timedate").html(time);
    zbdp.initNews(time);


	
}
