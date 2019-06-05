function App() {
    var self = this;
    this.listBody = d3.select('.list-body');

    this.data = []

    this.requestData();
    this.startTimingTask();
}

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestData();
    }, 100 * 1000);
}

App.prototype.requestData = function() {
    var self = this;
    var id = self.getUrlParams("id");
    var scene_level = self.getUrlParams("scene_level");
    var myDate = new Date();
	var today = myDate.format("yyyy-MM-dd");
    var url = '/cas/xhs/articleDetail/main.do?method=searchCeiToOutService&interfaceType=2&model=DESC&orderBy=ceiIndex&pageNo=1&pageSize=10'+
        '&startTime='+today+'+00:00:00&&endTime='+today+'+23:59:59';
    d3.json(url, function(error, data) {
        if(error || $.isEmptyObject(data) == true) {
            return;
        }
        console.log(data);

        var dataArea1 = null;
        var dateArea3 = null;
        var dataArea7 = null;

        self.data = formatData(data.Records);
        self.render();
    });

    function formatData(data) {
        var result = data.map(function(d, i) {
            var dd = {};
            dd.name = d.title;
            dd.time = d3.time.format('%m-%d')(new Date(d.pubTime));
            dd.value = Number(d.ceiIndex).toFixed(2);

            return dd;
        });
        return result;
    }

}

/**
 * [getUrlParams description] 获取路由参数
 * @param  {[type]} params [description] 要获取的参数名
 * @return {[type]}        [description]
 */
App.prototype.getUrlParams = function(params) {
    var self = this;
    var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
    var paramsData = window.location.search.substr(1).match(reg);
    return !!paramsData ? paramsData[2] : "0";
};

App.prototype.render = function() {
    var self = this;
    this.renderList();
}

App.prototype.renderList = function() {
    var self = this;
    var sortData = this.data.sort(function(a, b) {
        return b.value - a.value;
    });

    var update = this.listBody.selectAll('div.list-item').data(sortData);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('div').classed('list-item', true)
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.append('div').classed('td1', true);
            var td2 = listItem.append('div').classed('td2', true);
            var td3 = listItem.append('div').classed('td3', true);
            var td4 = listItem.append('div').classed('td4', true);

            td1.text(i + 1);
            td2.text(d.name);
            td3.text(d.time);
            td4.text(d.value);
        });
    update
        .style('color', function(d, i) {
            if(i === self.selectedRecordIndex) {
                return '#F8EF02';
            }
            return null;
        })
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.select('div.td1');
            var td2 = listItem.select('div.td2');
            var td3 = listItem.select('div.td3');
            var td4 = listItem.select('div.td4');

            td1.text(i + 1);
            td2.text(d.name);
            td3.text(d.time);
            td4.text(d.value);
        })
}
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}

var app = new App();