zbdp.loadEmergency = function() {
    var emergencyUrl = serverDomain + '/screen/disasterEmergency/get/';

    isShow(emergencyUrl);

    function isShow(url) {
        $.get(url, function(datastr, state) {
            if (state == 'success') {
                console.log('获取数据<突发事件>成功');
                var data = JSON.parse(datastr);
                // var data = zbdp.getEmergencyData();
                if (hasEmergencyData(data)) { //hasEmergencyData(data) 如果显示，则延迟需要增加(显示、隐藏的用时)
                    zbdp.showEmergency(data);
                } else {
                    console.log('无突发事件');
                    // console.log('load again');
                    setTimeout(zbdp.loadEmergency, zbdp.configData.checkEmergencyInterval * 1000);
                }
            } else {
                console.log('获取数据<突发事件>失败');
            }
        });
    }

    function hasEmergencyData(eData) {
        var result = false;
        if (!eData) {
            return false;
        }
        for (var index in eData) {
            if (eData[index] instanceof Array && eData[index].length > 0) {
                result = true;
                break;
            }
        }
        return result;
    }
}

zbdp.showEmergency = function(emergencyData) {
    var showDur = (3 + zbdp.configData.showEmergencyDur + 1 + zbdp.configData.toggleEmergencyInterval) * 1000;
    //显示一次突发事件的耗时:显示过程耗时+显示时长+隐藏耗时+等待下次间隔
    var showNextInterva = (zbdp.configData.showEmergencyDur + 1 + zbdp.configData.toggleEmergencyInterval) * 1000;
    //显示下一个突发事件的间隔，是在上一次刚开始时开始设置的：显示时长+隐藏耗时+等待下次间隔

    var emergencyLevel = '0';
    showNextEmergencyLevel();

    function showNextEmergencyLevel() {
        emergencyLevel = (parseInt(emergencyLevel) + 1) + '';
        if (emergencyLevel > 5) { //显示完了，需要设置下个检查的时间间隔
            // console.log('load again');
            setTimeout(zbdp.loadEmergency, zbdp.configData.checkEmergencyInterval * 1000);
            return;
        }
        var levelObj = emergencyData[emergencyLevel];

        // showEmergencyItemInOrder(levelObj);
        if (levelObj.length > 0) {
            chunk(levelObj, showEmergencyItemInOrder, null, showNextInterva, showNextEmergencyLevel);
        } else {
            showNextEmergencyLevel();
        }

    }

    function showEmergencyItemInOrder(emItem) {
        $('.emergency-modal').css('display', 'block');
        $('.emergency-alarm').addClass('emergency-flash');
		var SITE = emItem.SITENAME;
//		str = str.replace('<font color=red>','');
//		str = str.replace('</font>','');
		SITE = SITE.replace('<font color=red>','');
		SITE = SITE.replace('</font>','');
        $('.emergency-header .source').text(emItem.SITENAME);
       // $('.emergency-header .source').text(SITE);
        
       // $('.emergency-content-title').text(emItem.URLTITLE);
        $('.emergency-content-title').text(SITE);
        var URLABSTRACT_length = emItem.URLABSTRACT.length;
        if (URLABSTRACT_length>290) {
        	  var URLABSTRACT=emItem.URLABSTRACT.slice(0,250)+'...';
        }
     
        $('.emergency-content-detail').text(emItem.URLABSTRACT);

        setTimeout(function() {
            $('.emergency-modal-dialog').addClass('show-content');
        }, 2000);

        setTimeout(function() {
            zbdp.closeEmergency();
        }, zbdp.configData.showEmergencyDur * 1000);

    }

    function chunk(array, process, context, interval, callback) {
        var item = array.shift();
        // console.log(item);
        if (typeof item != 'undefined') {
            process.call(context, item);
        }
        if (array.length > 0) {
            // console.log(interval);
            setTimeout(function() {
                // console.log('show again');
                chunk(array, process, context, interval, callback);
            }, interval);
        } else {
            setTimeout(function() {
                // console.log('callback');
                callback();
            }, interval);
        }
    }

}

zbdp.closeEmergency = function() {
    $('.emergency-modal').fadeOut('slow', function() {
        $('.emergency-modal-dialog').removeClass('show-content'); //用时1.5s
        $('.emergency-alarm').removeClass('emergency-flash');
    });
}
