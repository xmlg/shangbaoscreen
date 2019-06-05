(function() {
    window.zbdp = {};
    zbdp.getScaleAndLocation = function() {
        // 用于"transform": "scale(" + scale + ")",
        var scale = 1;
        // 缩放后居中的位置,
        var location = {
            x: 0,
            y: 0
        }
        var width = $(".pub-sentiment-main-container_new").width(); //document.body.clientWidth;
        var height = $(".pub-sentiment-main-container_new").height() + 20; //document.body.clientHeight;
        if (width / height < 1920 / 1080) {
            scale = width / 1920;
            location.y = (height - 1080 * scale) / 2;
        } else {
            scale = height / 1080;
            location.x = (width - 1920 * scale) / 2;
        }
        return {
            scale: scale,
            location: location
        };
    }

    zbdp.formateDate = function(arg) {
        var result = {};
        var now = new Date();
        var ago = new Date(arg);
        var nowTime = {
            year: now.getFullYear(),
            month: now.getMonth() + 1,
            day: now.getDate()
        }
        var agoTime = {
            year: ago.getFullYear(),
            month: ago.getMonth() + 1,
            day: ago.getDate()
        }
        if (nowTime.day == agoTime.day && nowTime.month == agoTime.month && nowTime.year == agoTime.year) {
            result.isToday = true;
        } else if (nowTime.day != agoTime.day && nowTime.year == agoTime.year) {
            result.isToday = false;
            var nowTimeDate = new Date(nowTime.year + '-' + nowTime.month + '-' + nowTime.day);
            var ageTimeDate = new Date(agoTime.year + '-' + agoTime.month + '-' + agoTime.day);
            if (nowTimeDate - ageTimeDate == 86400000) {
                result.date = '昨天';
            } else {
                result.date = agoTime.month + '月' + agoTime.day + '日';
            }
        } else if (nowTime.year != agoTime.year) {
            result.isToday = false;
            result.date = agoTime.year + '月' + agoTime.month + '月' + agoTime.day + '日';
        }
        return result;
    }

    zbdp.resizePage = function() {
        var scaleAndLocation = zbdp.getScaleAndLocation();
        if (scaleAndLocation.scale != 1) {
            $(".pub-sentiment-main-container").css({
                "transform-origin": "left top",
                "-webkit-transform-origin": "left top",
                "transform": "scale(" + scaleAndLocation.scale + ")",
                "-webkit-transform": "scale(" + scaleAndLocation.scale + ")",
                "transform-origin": "left top",
                "-webkit-transform-origin": "left top",
                "margin-left": scaleAndLocation.location.x + "px",
                "margin-top": scaleAndLocation.location.y + "px"
            });
        }
    }

    zbdp.configData = {
        'pageSize': 10,//取数据的条数

        'moveHorizontalSpeed': 100, //水平滚动速度，单位（像素/s）
        'updateSentimentDelay': 30, //更新数据时间间隔，单位（s）

        //飞线配置项
        'speed': 200,//飞线速度，数值越大速度越快
        'meteorShootInterval': 800,//箭头依次发射的时间间隔，注意在箭头发射时圆环就会闪烁。
                            // 多条数据的地点相同：如果该值比较小(如100)，会出现圆环比较密集的情况
                            //                     如果该值非常小，（如0，所有箭头一起发射），密集的圆环会重合，就像只有一个箭头从该地区发射
        
        // 环形闪烁配置项
        'twinkle': {
            'interval': 10,//单位（s），环形闪烁间隔时间（飞线完成之后环形隔一段时间闪烁一次）

            'radius': 50,//单位（像素），环形大小
            'duration': 1500,//单位（ms）,闪烁用时，数值越大闪烁越慢
            'width': 4,//单位（像素）,圆环的边框宽度
            'count':2,//单位（个），闪烁时圆环的个数
            'delay': 400,//单位（ms），两个圆环之间的间隔，如第一个在0ms时出现，第二个在400ms时出现，注意和duration的搭配
        }
    }

})();
