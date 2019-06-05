/**
 * Created by Administrator on 2016/8/5.
 */
function MAPAPP(){
    var self = this;
    self.mapdata = new Object();
    self.focusindex = 0;
    //报题列表自动轮询设置
    self.reportlistfocus = new TimedTask(function () {
        var focusmater = self.focusonList();
        if(focusmater){
            return self.material[focusmater].MATERIAL.length*2000000 + 2000
        }
        return 200000
    },0);
    //报题列表自动刷新设置
    self.requestDataTask = new TimedTask(function () {
        self.requestReportdata();
        return 10*60*1000
    },0);
    self.audioicon = window.setInterval(
        function () {

        }
    ,500);
    self.requestDataTask.start();

}

//报题列表及素材数据获取
MAPAPP.prototype.requestReportdata = function () {
    var self = this;

    //d3.json('js/json/map-reportdata.json', function (error,data) {
    d3.json('/screen/mapmanage/reportlist', function (error, data) {
        if(error || $.isEmptyObject(data) == true){
            return false
        }
        else{
            console.log(data);
            self.material = [];
            self.reportdata = data.REPORTS;
            if(data.TASK != undefined){
                for(var i = 0 ;i<data.TASK.length;i++){
                    if(data.TASK[i].ISMATERIAL != 0){
                        self.material.push(data.TASK[i])
                    }
                }
            }

            self.renderReportlist();
            self.renderMaterial();
            self.reportlistfocus.start();
            $(".new").niceScroll();
            $("#tasklist").niceScroll();
        }

    })
};

//报题轮询联动
MAPAPP.prototype.focusonList = function () {
    var self = this;

    $(".list1-newscontent").removeClass("focus");
    $('#'+self.focusindex).addClass("focus");
    self.onfocusreportid = $('#'+self.focusindex).attr("reportid");
    $('.new').animate({
        scrollTop:self.focusindex*113
    },"500");

    if(self.mySwiper){
        self.mySwiper.stopAutoplay();
    }
    self.requestMapdata(self.onfocusreportid);
    self.materialarea(self.onfocusreportid);
    self.focusindex++;
    if (self.focusindex >= self.reportdata.length) {
        self.focusindex = 0;
    }
    if(self.materListId.indexOf(self.onfocusreportid) != -1){
        return self.materListId.indexOf(self.onfocusreportid)
    }
    else {
        return null;
    }
};

//渲染报题列表
MAPAPP.prototype.renderReportlist = function () {
        $('.new').empty();
        var self = this;
        self.reportidList = [];
        var data = self.reportdata;
        $.each(self.reportdata, function (i) {
            self.reportidList.push(self.reportdata[i].REPORTID)
        });
        console.log(self.reportidList)
        var update = d3.select('.new').selectAll("div ").data(data);
        var exit = update.exit();
        var enter = update.enter();

        exit.remove();
        //建立DOM
        enter.append("div").each(function () {
            d3.select(this).classed('list1-news',true);
            d3.select(this).append('div').classed('list1-newstime',true);
            d3.select(this).select('.list1-newstime').append('span');
            d3.select(this).select('.list1-newstime').append('img').attr('src','img/list1-title.png').classed('list1-img',true);
            d3.select(this).append('div').classed('list1-contentbox',true);
            d3.select(this).select('.list1-contentbox').append('p').classed('list1-newscontent',true);
        });
        update.each(function (d,i) {

            d3.select(this).select('.list1-newstime span').text(d.CRTIME);
            d3.select(this).select('.list1-newscontent').attr('id',i).attr('reportid', d.REPORTID).text($(d.CONTENT).text());
            if(d.ISTASK == 2){
                d3.select(this).select('.list1-newstime').append('img').attr('src','img/baoti_14.png').classed('list1-icon',true)
            }
        });

        $('.list1-contentbox :last').css('border','none');
        d3.selectAll('.list1-news').on('click', function (d,i) {
            self.reportlistfocus.stop();
            console.log(d.REPORTID,i)
            if(self.mySwiper){
                self.mySwiper.stopAutoplay();
            }
            $(".list1-newscontent").removeClass("focus");
            $('#'+i).addClass('focus');
            $('.new').animate({
                scrollTop:i*113
            },"500");
            self.materialarea(d.REPORTID);
            self.requestMapdata(d.REPORTID);

            self.listclicktimeout = window.setTimeout(function () {
                self.reportlistfocus.start();
            },60*1000)
        })
};

//渲染素材标签
MAPAPP.prototype.renderMaterial = function () {
    var self = this;
    var data = self.material;
    //素材标签ID集合，便于后面比对
    self.materListId = [];
    $.each(data,function (i) {
        self.materListId.push(data[i].REPORTID);
    });
    console.log(self.materListId)
    var material = d3.select('#tasklist').selectAll('div').data(data);
    var exit = material.exit();
    var enter = material.enter();

    exit.remove();
    enter.append('div').each(function (d) {
        d3.select(this).classed('taskdetails',true).attr('id', d.REPORTID);
        d3.select(this).append('p');
        d3.select(this).select('.taskdetails p').text(d.CONTENT);
    });
    d3.selectAll('.taskdetails').on('click', function (d, i) {
        self.reportlistfocus.stop();
        console.log(d.REPORTID,i)
        if(self.mySwiper){
            self.mySwiper.stopAutoplay();
        }
        self.materialarea(d.REPORTID);
        self.requestMapdata(d.REPORTID);
        var listindex = self.reportidList.indexOf(d.REPORTID);
        console.log(listindex)
        $(".list1-newscontent").removeClass("focus");
        $('#'+listindex).addClass('focus');
        $('.new').animate({
            scrollTop:listindex*113
        },"500");
        self.taskclicktimeout = window.setTimeout(function () {
            self.reportlistfocus.start();
        },60*1000)
    })


};

//渲染轮播区域
MAPAPP.prototype.materialarea = function (id) {
    var self = this;
    var tasktriangle = '<div class="tasktriangle">'+'</div>';

    var index = 0;
    if(self.materListId.indexOf(id) != -1){
        $("#list2").show();
        index = self.materListId.indexOf(id);
        var data = self.material[index].MATERIAL

        //标签高亮联动
        $('.taskdetails').removeClass('taskonfocus');
        $('.tasktriangle').remove();
        $('.tasklist').animate({scrollTop:index*69},"500");
        $('#'+id).addClass('taskonfocus').append(tasktriangle);

        $(".swiper-wrapper").empty();
        //素材轮播区域
        var update = d3.select(".swiper-wrapper").selectAll('div').data(data);
        var exit = update.exit();
        var enter = update.enter();

        exit.remove();
        enter.append("div").each(function (d) {
            d3.select(this).classed('swiper-slide',true);
            if(d.MATERIALTYPE == 1){
                d3.select(this).classed('materialarea',true);
                d3.select(this).append('p').classed('material-p',true);
                d3.select(this).select('.material-p').text(d.MATERIALAPPFILE);
            }
            else if(d.MATERIALTYPE == 2){
                d3.select(this).append('img').classed('material-img',true).attr('src', d.MATERIALAPPFILE);
            }
            else if(d.MATERIALTYPE == 3){
                d3.select(this).append('div').classed('audiodiv',true);
                d3.select(this).select('.audiodiv').append('audio').attr({
                    'src': d.MATERIALAPPFILE,
                    'controls':'controls',
                    'width':'460px',
                    'height':'274px'
                });
            }
            else if(d.MATERIALTYPE == 4){
                var date = new Date();
                var datetime = date.getTime();
                var videoid = d.MATERIALID+datetime;
                d3.select(this).append('video').attr({
                    'src': d.MATERIALAPPFILE,
                    'width':'460px',
                    'controls':true,
                    'height':'274px',
                    'id': videoid
                }).classed("video-js vjs-default-skin vjs-big-play-centered",true);
                videojs(videoid,{}, function () {
                    this.on('play', function () {

                        self.reportlistfocus.stop();
                        window.clearTimeout(self.taskclicktimeout);
                        window.clearTimeout(self.listclicktimeout);
                        self.mySwiper.stopAutoplay();
                    });

                    this.on('pause', function () {
                        self.mySwiper.startAutoplay();
                        self.reportlistfocus.start();
                    });
                    this.on('ended', function () {
                        self.mySwiper.startAutoplay();
                        self.reportlistfocus.start();
                    });

                })
            }
        });
        self.initSwiper();
    }
    else {
        $("#list2").hide();
    }
};

//初始化素材轮播
MAPAPP.prototype.initSwiper = function () {

    this.mySwiper = new Swiper ('.swiper-container', {
        mode: 'vertical',
        autoplay:2000,
        loop: false,
        autoplayDisableOnInteraction:true,
        mousewheelControl:true

    });

};

//获取地图数据
MAPAPP.prototype.requestMapdata = function (id) {
    var self = this;
    $.when(
        //$.get('js/json/map-reporterdata.json',{reportid:id}),
        $.get('/screen/mapmanage/userposition'),
        $.get('/screen/mapmanage/taskmaterail',{reportid:id}),
        //$.get('js/json/map-nonetaskdata.json',{reportid:id})
        $.get('/screen/mapmanage/othertasks')
    )
        .then(
            function (
                reporterdata,
                maptaskdata,
                nonetaskdata
            ) {
                self.mapdata.reporterdata = JSON.parse(reporterdata[0]).Data;
                self.mapdata.maptaskdata = JSON.parse(maptaskdata[0]).Task;
                self.mapdata.nonetaskdata = JSON.parse(nonetaskdata[0]);
                var eventid = JSON.parse(maptaskdata[0]).EventId;
                if(eventid != 0){
                    $.get('/screen/mapmanage/eventdetail',{event_id:eventid}, function (data) {
                        self.mapdata.mapeventdata = JSON.parse(data)
                        mapApp(self.mapdata);
                    })
                }
                else{
                    mapApp(self.mapdata);
                }

            }
        )
}







var app = new MAPAPP();