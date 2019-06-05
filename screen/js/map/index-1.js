
function mapApp(data) {
    var self = this;
    var repoterdata = data.reporterdata;
    var taskdata1 = data.maptaskdata;
    var nonetaskdata = data.nonetaskdata;
    var eventdata = data.mapeventdata;
    var TaskProceeddata;
    var notaskdata1 = [];

    if(taskdata1 == ""){

    }
    else{
        for(var i=0;i<taskdata1.length;i++){
            if(taskdata1[i].TASKTYPE == 2){
                TaskProceeddata = taskdata1[i]
            }
            else {
                notaskdata1.push(taskdata1[i])
            }
        }
    }

    self.audiolisten = new TimedTask(function () {
        self.audiotask();
        return 1000;
    },0)
    self.audiotask = function () {
        $.get('/screen/mapmanage/queryvoicetaskstatus', function (data) {

            if(JSON.parse(data)[0].STATUS == 1){
                self.audiolisten.stop();
                $('.HqOverlaydiv').addClass('Hqtwinkling');
                $.get('/ajax/screen/mapmanage/resettaskstatus', function () {
                    if(self.audiotasktimeout){
                        window.clearTimeout(self.audiotasktimeout)
                    }
                    self.audiotasktimeout = window.setTimeout(function () {
                        self.audiolisten.start();
                        $('.HqOverlaydiv').removeClass('Hqtwinkling')
                    },2000)
                })
            }
        })
    }

    self.taskchoose = function () {
        $.get('/ajax/screen/mapmanage/taskstatus', function (data) {
            if(JSON.parse(data)[0].STATUS == 1){

            }
        })
    }

    self.addlay = function (){
        //事件相关
        if(eventdata){
            var url = "http://api.map.baidu.com/geocoder/v2/?address="+'北京'+"&output=json&ak=qYllTsnjS77RI3GPlufXMuQhdQSyYyhh";
            $.ajax({
                url: url,
                dataType: "jsonp",
                success: function( data ) {
                    console.log( data );
                    var eventpoint = new BMap.Point(data.result.location.lng,data.result.location.lat)
                    var eventOverlay = new TaskOverlay(eventpoint,"eventdata.title","event")
                    self.newmap.addOverlay(eventOverlay);
                }
            });
        }
        if(notaskdata1.length != 0){
            //无任务线索
            for(var n=0;n<notaskdata1.length;n++){
                var notaskOverlay = new TaskOverlay(new BMap.Point(
                    notaskdata1[n].TASKADDRESS.value[0],notaskdata1[n].TASKADDRESS.value[1]
                    ),
                    notaskdata1[n].CONTENT,
                    notaskdata1[n].TASKID
                );
                self.newmap.addOverlay(notaskOverlay)
            }
        }

        //无关报题的任务线索
        for(var n=0;n<nonetaskdata.length;n++){
            var notaskOverlay = new TaskOverlay(new BMap.Point(
                nonetaskdata[n].TASKADDRESS.value[1],nonetaskdata[n].TASKADDRESS.value[0]
                ),
                nonetaskdata[n].CONTENT,
                nonetaskdata[n].TASKID
            );
            self.newmap.addOverlay(notaskOverlay)
        }
        //记者位置
        for(var m=0;m<repoterdata.length;m++){
            var position = repoterdata[m].UserPosition.split(",");
            var reporterOverlay = new PersonnelOverlay(
                new BMap.Point(position[0],position[1]),
                repoterdata[m].UserName,
                repoterdata[m].Mobile);
            self.newmap.addOverlay(reporterOverlay)
        }


        var hqOverlay = new HqOverlay(new BMap.Point(120.181827,30.276287));
        self.newmap.addOverlay(hqOverlay);


        if(TaskProceeddata != undefined){
            //进行中的任务
            var procetime = TaskProceeddata.CRTIME.split(" ");

            var taskProceedOverlay = new TaskProceedOverlay(
                new BMap.Point(TaskProceeddata.TASKADDRESS.value[0],TaskProceeddata.TASKADDRESS.value[1]),
                TaskProceeddata.TITLE,
                TaskProceeddata.CONTENT,
                TaskProceeddata.TASKUSERNAME,
                procetime[0]
            );
            self.newmap.addOverlay(taskProceedOverlay);
        }
    }
    initMap(TaskProceeddata,notaskdata1);
    self.audiolisten.start();
}
initMap = function(TaskProceeddata,notaskdata1) {
    var self = this;
    if(TaskProceeddata == undefined){
        var newcenterpoint = new BMap.Point(120.181827,30.276287);
    }
    else{
        var newcenterpoint = new BMap.Point(TaskProceeddata.TASKADDRESS.value[0],TaskProceeddata.TASKADDRESS.value[1])
    }
    if(notaskdata1.length != 0){
        var notaskpoint =new BMap.Point(
            notaskdata1[0].TASKADDRESS.value[0],notaskdata1[0].TASKADDRESS.value[1]
        )
    }


    if(self.newmap){
        var changecenter = [newcenterpoint,self.mapcenter];
        self.newmap.setViewport(changecenter);

        window.setTimeout(function () {
            self.newmap.clearOverlays();
            self.newmap.panTo(newcenterpoint);
        },1000)
        window.setTimeout(function () {
            var map = new BMap.Map("map");
            if(notaskpoint){
                var maparray = [newcenterpoint,notaskpoint];
                var zoomfac=  map.getViewport(maparray);
                map.centerAndZoom(newcenterpoint,zoomfac.zoom-1);
            }
            else{
                map.centerAndZoom(newcenterpoint,14);
            }
            self.mapcenter = newcenterpoint;
            map.enableScrollWheelZoom();
            map.setMapStyle({
                styleJson: mapStyle
            });
            self.newmap = map;
            self.addlay()

        },1000)

    }
    else {
        var map = new BMap.Map("map");
        if(notaskpoint){
            var maparray = [newcenterpoint,notaskpoint];
            var zoomfac=  map.getViewport(maparray);
            map.centerAndZoom(newcenterpoint,zoomfac.zoom-1);
        }
        else{
            map.centerAndZoom(newcenterpoint,15);
        }
        self.mapcenter = newcenterpoint;
        map.enableScrollWheelZoom();
        map.setMapStyle({
            styleJson: mapStyle
        });
        self.newmap = map;
        self.addlay()
    }
};