IABS.getWeiboData = function(fn) {
    var data = {
        "result": "success",
        "CONTENT": [{           
            "score": "776",
            "belongto": "重庆日报", //所属报业
            "medianame": "重庆日报网", //具体来源
        }, {           
            "score": "976",
            "belongto": "重庆晨报", //所属报业
            "medianame": "重庆晨报网", //具体来源
        }, {           
            "score": "1055",
            "belongto": "重庆晚报", //所属报业
            "medianame": "重庆晚报网", //具体来源
        }, {           
            "score": "1453",
            "belongto": "重庆商报", //所属报业
            "medianame": "重庆商报网", //具体来源
        }, {           
            "score": "1985",
            "belongto": "华龙网", //所属报业
            "medianame": "华龙网", //具体来源
        }, {           
            "score": "1535",
            "belongto": "今日重庆", //所属报业
            "medianame": "今日重庆网", //具体来源
        }]
    };

    $.ajax({
        type: "post",
        url: IABS.domain + "/zyzx/BigScreen/propagation",
        data: "type=weibo&timeRange=0",
        success: function(data) {
            try {
                fn(JSON.parse(data));
            } catch (e) {
                console.error(e.message);
            }
        }
    });
};
IABS.getWeChatData = function(fn) {
    var data = {
        "result": "success",
        "CONTENT": [{           
            "score": "568",
            "belongto": "重庆日报", //所属报业
            "medianame": "重庆日报网", //具体来源
        }, {           
            "score": "1776",
            "belongto": "重庆晨报", //所属报业
            "medianame": "重庆晨报网", //具体来源
        }, {           
            "score": "1255",
            "belongto": "重庆晚报", //所属报业
            "medianame": "重庆晚报网", //具体来源
        }, {           
            "score": "1653",
            "belongto": "重庆商报", //所属报业
            "medianame": "重庆商报网", //具体来源
        }, {           
            "score": "1885",
            "belongto": "华龙网", //所属报业
            "medianame": "华龙网", //具体来源
        }, {           
            "score": "1335",
            "belongto": "今日重庆", //所属报业
            "medianame": "今日重庆网", //具体来源
        }]
    };

    $.ajax({
        type: "post",
        url: IABS.domain + "/zyzx/BigScreen/propagation",
        data: "type=weixin&timeRange=0",
        success: function(data) {
            try {
                fn(JSON.parse(data));
            } catch (e) {
                console.error(e.message);
            }
        }
    });
};
IABS.getRoseData = function(fn) {
    var result = {    
        "result": "success",
        "CONTENT": [{           
            "score": "3120.84", //传播力指数
            "belongto": "重庆晨报", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "2120.84", //传播力指数
            "belongto": "重庆晨报1", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "3020.84", //传播力指数
            "belongto": "重庆晨报2", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "3520.84", //传播力指数
            "belongto": "重庆晨报3", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "3320.84", //传播力指数
            "belongto": "重庆晨报4", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "2220.84", //传播力指数
            "belongto": "重庆晨报5", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "2820.84", //传播力指数
            "belongto": "重庆晨报6", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "2920.84", //传播力指数
            "belongto": "重庆晨报7", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "2720.84", //传播力指数
            "belongto": "重庆晨报8", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }, {           
            "score": "3120.84", //传播力指数
            "belongto": "重庆晨报9", //所属报业
            "medianame": "重庆晨报网", //具体来源
             
        }]
    };

    $.ajax({
        type: "post",
        url: IABS.domain + "/zyzx/BigScreen/propagation",
        data: "type=news&timeRange=0",
        success: function(data) {
            try {
                fn(JSON.parse(data));
            } catch (e) {
                console.error(e.message);
            }
        }
    });
};
