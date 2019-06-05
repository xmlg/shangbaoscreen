/**
 * Created by Administrator on 2016/7/20.
 */
function App(){

    var self = this;
    self.url = "/screen/mapmanage/competitiveclue";
    this.content = d3.select("#content");

    this.focusNextRecordTask = new TimedTask(function() {
        var nextRecord = self.focusNextRecord();
        if (nextRecord ) {
            return 5000;
        }
        return 5000;
    }, 0);
    this.requestDataTask = new TimedTask(function() {
        self.requestData();
        return 30000;
    }, 0);
    this.focusNextRecordTask.start();
    this.requestDataTask.start();
}

App.prototype.focusNextRecord = function() {
    if (this.data) {
        $(".newscontent").removeClass("focus");
        $("#"+this.onfocusIndex).addClass("focus");
        $("#content").animate({scrollTop:(this.onfocusIndex)*150},"1000");
        this.onfocusIndex++;
        if (this.onfocusIndex >= this.data.length) {
            this.onfocusIndex = 0;
        }

        return this.data[this.onfocusIndex];
    }
};
App.prototype.requestData = function () {
            $(".competing-box").remove();
            this.onfocusIndex = 0;
            var self = this;
            $.get(self.url, function (data) {
                self.data = JSON.parse(data);
                self.render(self.data);
                self.focusNextRecord();
            })



};
App.prototype.render = function (data) {
            this.renderList(data)
};
App.prototype.renderList = function (data) {
            var self = this;

            var update = this.content.selectAll('div.new').data(data);
            var exit = update.exit();
            var enter = update.enter();

            exit.remove();
            enter.append('div').each(function () {
                d3.select(this).classed('competing-box',true);
                d3.select(this).append('div').classed('newstime',true);
                d3.select(this).append('div').classed('newscontent',true);
                d3.select(this).append('div').classed('circle',true)
            });
            update.each(function (d,i) {
                console.log(d)
                var date = new Date(d.URLTIME);
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
                var D = math(date.getDate()) + ' ';
                var h = math(date.getHours()) + ':';
                var m = math(date.getMinutes()) + ':';
                var s = math(date.getSeconds());
                var time = Y+M+D+h+m+s;
                d3.select(this).select('.newstime').text(time);
                d3.select(this).select('.newscontent').text(d.URLTITLE).attr('id',i)
            });

        $(".newstime:last").css('border','none')
    $("#content").niceScroll();
};



var app = new App();


//日期个位加0
function math(data){
    if(data<10){
        return "0"+ data;
    }
    else return data
}