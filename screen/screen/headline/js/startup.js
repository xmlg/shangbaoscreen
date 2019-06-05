$(function() {
    zbdp.resizePage();
    window.onresize = function(){
        throttle(zbdp.resizePage);
    }
    function throttle(method, context){
        clearTimeout(method.tId);
        method.tId = setTimeout(function(){
            method.call(context);
        }, 100);
    }

    //显示头条信息
    zbdp.drawHeadline();
    setInterval(function(){
    	
    	window.location.reload()
    },60*60*1000)
});
