/**
 * module 核心圈用户总量
 * createdBy he.zhikai
 * createdIn 2017-03-29
 */
"use strict";
(function() {
    var dataUrl = "/screen/productMonitor/mediadisplay",
        renderSwitchUrl = "/screen/productMonitor/getDateDisplayFlg", //页面渲染开关请求地址，后端告知是否有数据用于渲染前端页面
        initialValue = {
            totalInitialValue: 0, //用户总量初始值
            realtimeInitialValue: 0, //实时访问量初始值
            websiteInitialValue: 0, //网站初始值
            clientInitialValue: 0 //客户端初始值
        },
        updateValue = {
            totalUpdateValue: 0, //用户总量更新值
            realtimeUpdateValue: 0, //实时访问量更新值
            websiteUpdateValue: 0, //网站更新值
            clientUpdateValue: 0 //客户端更新值
        },
        duration = {
            updateDuration: 120000, //定时请求时间
            dataShowDuration: 120, //数据增长时间
            totalShowDuration: 0.4,
            firstUpdateDuration: 10000 //渲染完成后第一次更新的时间
        },
        speed = {
            DomShowSpeed: 800 //DOM元素显示时间
        },
        totalCountUp, //用户总量计数器
        realtimeCountUp, //实时访问量计数器
        websiteCountUp, //网站计数器
        clientCountUp, //客户端计数器

        initTimeout, //初始化后初次更新定时器
        showDomTimeout, //显示DOM元素的定时器
        dataDisplayTimeout, //无数据时请求定时器
        updateTimeout; //数据更新定时器

    init().then(function() {
        clearTimeout(initTimeout);
        initTimeout = setTimeout(function() {
            update();
        }, duration.firstUpdateDuration);
    });

    /**
     * [init description] 初始化
     * @return {[type]} [description]
     */
    function init() {
        var defer = $.Deferred();
        showDom(function() {
        	showTime();
        	setRealTimeTraffic();
        	getDateDisplay().then(function(isRender) {
        		if(isRender) {
        			httpServer(dataUrl).then(function(data) {
        				updateValue.totalUpdateValue = data.userScale.appUser + data.userScale.todayWeixinUserUV + data.userScale.todayWeiboUserUV;
        				updateValue.realtimeUpdateValue = data.accessScale.todayWebPV + data.accessScale.todayAppPV;
        				updateValue.websiteUpdateValue = data.accessScale.todayWebPV;
        				updateValue.clientUpdateValue = data.accessScale.todayAppPV;
                        setRealTimeTraffic();
        			},function() {
        				console.log("获取数据失败");
        				clearData();
        			});
        		}
        		defer.resolve();
        	});
        });
        return defer.promise();
    }

    /**
     * [showDom description] 显示DOM元素
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    function showDom(callback) {
        $(".coreCircleUserSum").fadeIn(speed.DomShowSpeed, function() {
        	callback();
        });
    }

    /**
     * [showTime description] 显示时间
     * @return {[type]} [description]
     */
    function showTime() {
    	var now = new Date();
    	var date = now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";
    	var time = (now.getHours().toString().length == 1 ? "0" + now.getHours() : now.getHours()) + ":" + (now.getMinutes().toString().length == 1 ? "0" + now.getMinutes() : now.getMinutes()) + ":" + (now.getSeconds().toString().length == 1 ? "0" + now.getSeconds() : now.getSeconds());
    	$('#currtime_date').html(date);
    	$('#currtime_time').html(time);
        clearTimeout(showDomTimeout);
    	showDomTimeout = setTimeout(function() {
    		showTime();
    	},100);
    }

    /**
     * [setRealTimeTraffic description] 设置实时访问量
     */
    function setRealTimeTraffic() {
        var isInitial = initialValue.realtimeInitialValue === 0; //判断是否是初始化，初始化时，直接已最快时间赋值
        initialValue.realtimeInitialValue = isInitial ? updateValue.realtimeUpdateValue : initialValue.realtimeInitialValue;
        initialValue.websiteInitialValue = isInitial ? updateValue.websiteUpdateValue : initialValue.websiteInitialValue;
        initialValue.clientInitialValue = isInitial ? updateValue.clientUpdateValue : initialValue.clientInitialValue;
    	if (updateValue.totalUpdateValue !== 0) {
            totalCountUp = new CountUp("corecircle_count", initialValue.totalInitialValue, updateValue.totalUpdateValue, 0, duration.totalShowDuration);
            initialValue.totalInitialValue = updateValue.totalUpdateValue;
            totalCountUp.start();
        }
        if (updateValue.realtimeUpdateValue !== 0) {
    	    realtimeCountUp = new MyCountup("realtime_count", initialValue.realtimeInitialValue, updateValue.realtimeUpdateValue, 0, (isInitial ? 0.1 : duration.dataShowDuration));
    	    initialValue.realtimeInitialValue = updateValue.realtimeUpdateValue;
    	    realtimeCountUp.start();
    	}
    	if (updateValue.websiteUpdateValue !== 0) {
    	    websiteCountUp = new MyCountup("website_count", initialValue.websiteInitialValue, updateValue.websiteUpdateValue, 0, (isInitial ? 0.1 : duration.dataShowDuration));
    	    initialValue.websiteInitialValue = updateValue.websiteUpdateValue;
    	    websiteCountUp.start();
    	}
    	if (updateValue.clientUpdateValue !== 0) {
    	    clientCountUp = new MyCountup("client_count", initialValue.clientInitialValue, updateValue.clientUpdateValue, 0, (isInitial ? 0.1 : duration.dataShowDuration));
    	    initialValue.clientInitialValue = updateValue.clientUpdateValue;
    	    clientCountUp.start();
    	}
    }

    /**
     * [getDateDisplay description] 根据后端返回值判断有无数据
     * @return {[type]} [description]
     */
    function getDateDisplay() {
        var deffer = $.Deferred();
        httpServer(renderSwitchUrl).then(function(data) {
            if (data === 1) {
                clearTimeout(dataDisplayTimeout);
                dataDisplayTimeout = setTimeout(function() {
                    clearData();
                    $('.coreCircleUserSum_modal').show();
                    deffer.resolve(data !== 1);
                }, 500);
            } else {
                $('.coreCircleUserSum_modal').hide();
                deffer.resolve(data !== 1);
            }
        }, function(data) {
            deffer.resolve(false);
        });
        return deffer.promise();
    }

    /**
     * [update description] 更新数据
     * @return {[type]} [description]
     */
    function update() {
    	getDateDisplay().then(function(isRender) {
    		if(isRender) {
    			return updateData();
    		}
    	}).then(function() {
    	    clearTimeout(updateTimeout);
    	    updateTimeout = setTimeout(function() {
    	        update();
    	    }, duration.updateDuration);
    	});
    }

    /**
     * [updateData description] 更新数据时再次进行渲染
     * @return {[type]} [description]
     */
    function updateData() {
    	var deffer = $.Deferred();
    	httpServer(dataUrl).then(function(data) {
    		updateValue.totalUpdateValue = data.userScale.appUser + data.userScale.todayWeixinUserUV + data.userScale.todayWeiboUserUV;
    		updateValue.realtimeUpdateValue = data.accessScale.todayWebPV + data.accessScale.todayAppPV;
    		updateValue.websiteUpdateValue = data.accessScale.todayWebPV;
    		updateValue.clientUpdateValue = data.accessScale.todayAppPV;
    		setRealTimeTraffic();
    		deffer.resolve();
    	},function() {
    		console.log("获取数据失败");
    		deffer.resolve();
    	});
    	return deffer.promise();
    }

    /**
     * [clearData description] 清除数据
     * @return {[type]} [description]
     */
    function clearData() {
    	totalCountUp!=undefined ? totalCountUp.reset() : "";
    	$("#corecircle_count").html("--");
    	realtimeCountUp!=undefined ? realtimeCountUp.reset() : "";
    	$("#realtime_count").html("--");
    	websiteCountUp!=undefined ? websiteCountUp.reset() : "";
    	$("#website_count").html("--");
    	clientCountUp!=undefined ? clientCountUp.reset() : "";
    	$("#client_count").html("--");
    	initialValue.totalInitialValue = 0;
    	initialValue.realtimeInitialValue = 0;
    	initialValue.websiteInitialValue = 0;
    	initialValue.clientInitialValue = 0;
    }

    /**
     * [httpServer description] http请求
     * @param  {[type]} url      [description]
     * @param  {[type]} params   [description]
     * @param  {[type]} dataType [description]
     * @return {[type]}          [description]
     */
    function httpServer(url, params, dataType) {
        var deffer = $.Deferred();
        $.ajax({
            url: url,
            data: (params !== undefined ? params : null),
            dataType: dataType || "json",
            method: "get",
            timeout: 20000,
            success: function(data) {
                deffer.resolve(data);
            },
            error: function(data) {
                deffer.reject(data);
            }
        });
        return deffer.promise();
    }

})();
