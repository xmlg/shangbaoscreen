var count=1;
function App() {
    var self = this;
    this.listBody = d3.select('.list-body');

    this.data = []

    this.requestData();
    this.startTimingTask();
}
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
App.prototype.startTimingTask = function() {
    var self = this;
	self.requestData();
	
    var interval = window.setInterval(function() {
        self.requestData();
    },  10 * 60 * 1000);
}

App.prototype.requestData = function() {
    var self = this;
	//var url = 'js/jinriyuanchuang.json'
    //var url = '/cas/casData/screenJson?type=ThreedaysArticle';   //72小時
    var url = '/cas/casData/screenJson?type=OnedayArticle';   //24小時
    var zbGuid = getQueryString("zbGuid");
    var pubTimeStart = getQueryString("pubTimeStart");
    var pubTimeEnd = getQueryString("pubTimeEnd");
    var showTime = getQueryString("showTime")
    if(showTime == 7){
        $("h1.top").text('近7天原创稿件影响力排行');
    }else if(showTime == 30){
        $("h1.top").text('近30天原创稿件影响力排行');
    }
    if(zbGuid==null &&pubTimeStart==null&&pubTimeEnd==null){
        //url = '/cas/casData/screenJson?type=ThreedaysArticle';  //72小時
        url = connectUrl('http://111.203.35.59/cas/casData/screenJson?type=OnedayArticle');  //24小時
    }else{
        url = connectUrl('http://111.203.35.59/cas/xhs/bigScreen/main.do?method=getArticleSearch&zbGuid='+zbGuid+"&pubTimeStart="+pubTimeStart+"&pubTimeEnd="+pubTimeEnd);
    }

    d3.json(url, function(error, data) {
        data=data.DATA
        if(error || $.isEmptyObject(data) == true) {
            return;
        }
        //console.log(data);

        var dataArea1 = null;
        var dateArea3 = null;
        var dataArea7 = null;

        self.data = formatData(data.Records);
        self.render();
		count--;
        if(count>=0){
            $(".td2").click(function(){
            //    console.log(this.innerText);

            });
        }
    });

    function formatData(data) {
        var result = data.map(function(d, i) {
            var dd = {};
            dd.name = d.title;
            dd.time = d3.time.format('%H:%M:%S')(new Date(d.pubTime));
            dd.value = d.ceiIndex;//Number(d.ceiIndex * 100).toFixed(2);
			dd.sort=d.sort;
			dd.id=d.zbGuid;
            return dd;
        });
        return result;
    }

}

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
    var color = d3.scale.ordinal()
        .range(["#97de89", "#efae70", "#1f77b4", "#278f27", "#aec7e8",
            "#d62728", "#e4710c", "#c5b0d5", "#ff9896", "#9467bd"
        ]);
    exit.remove();
    enter
        .append('div').classed('list-item', true)
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.append('div').classed('td1', true);
            var td2 = listItem.append('div').classed('td2', true);
            var td3 = listItem.append('div').classed('td3', true);
            var td4 = listItem.append('div').classed('td4', true);
            //var td5 = listItem.append('div').classed('td5', true);

            td1.text(parseInt(d.value));
            td2.text(d.name.replace(/&nbsp|\r|\n|　/g,''))
                .style('color',function(){
                    //return  d3.rgb(color(i))
                    return '#64f9fe'
                });
            td3.style('background-image',function(d,i){
                if(d.sort == '-1'){
                    return 'url(images/curDown.png)'
                }else if(d.sort == '1'){
                    return 'url(images/curUp.png)'
                }else{
                    return 'none'
                    //return 'url(images/curUp.png)'
                }
            });
            td3.style('background-repeat','no-repeat');
            td3.style('background-size','45px');
            td3.style('background-position-x','33px');
            td3.style('background-position-y','25px');

            td4.attr("id",d.id)
                .style('background-image',function(d,i){
                if(d.isNew == '1'){
                    return 'url(images/relation.png)'
                }else{
                    return 'none'
                    //return 'url(images/relation.png)'
                }
              });
            td4.style('background-repeat','no-repeat');
            td4.style('background-size','66px');
            td4.style('background-position-x','42px');
            td4.style('background-position-y','21px');
            td4.style('cursor','pointer');


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
            //var td5 = listItem.select('div.td5');

            td1.text(parseInt(d.value));
            td2.text(d.name.replace(/&nbsp|\r|\n|　/g,''))
			td2.attr("id",d.id)
                .style('color',function(){
                    //return  d3.rgb(color(i))
                      return '#64f9fe'
                });;
            //td4.text(d.value);
            //td5.text(d.value);
            td3.style('background-image',function(d,i){
                if(d.sort == '-1'){
                    return 'url(images/curDown.png)'
                }else if(d.sort == '1'){
                    return 'url(images/curUp.png)'
                }else{
                    return 'none'
                    //return 'url(images/curUp.png)'
                }
            });
            td3.style('background-repeat','no-repeat');
            td3.style('background-size','45px');
            td3.style('background-position-x','33px');
            td3.style('background-position-y','25px');
            td4.attr("id",d.id)
                .style('background-image',function(d,i){
                if(d.isNew == '1'){
                    return 'url(images/relation.png)'
                }else{
                    //return 'none'
                    return 'url(images/relation.png)'
                }
            });
            td4.style('background-repeat','no-repeat');
            td4.style('background-size','66px');
            td4.style('background-position-x','42px');
            td4.style('background-position-y','21px');
            td4.style('cursor','pointer');
        })
}
var app = new App();
//每20分钟刷新一次数据
setInterval(function(){
    var app = new App();
},1200000)
