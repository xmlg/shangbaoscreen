/**
 * Created by Administrator on 2016/8/18.
 */
function App() {
    var self = this;
    $.get('/screen/eventcontrol/getid', function (data) {
        var idarray = JSON.parse(data);
        var posiarray = [];
        $.each(idarray, function (i) {
            posiarray.push(idarray[i].screencheck)
        })
        var full = posiarray.indexOf('4')
        if( full == -1){
            alert('未设置全屏事件，请先在后台设置')
        }
        else {
            self.id = idarray[full].evnetid;
            self.requesteventData();
        }

    })
}

App.prototype.requesteventData = function () {
    var self = this;
    $.get('/screen/mapmanage/eventdetail',{event_id:self.id}, function (data) {
        console.log(data)
        self.mapdata = JSON.parse(data);
        self.renderMap();
    })
};
App.prototype.renderMap = function () {
    var self = this;
    var mapdata = self.mapdata;
    var location = mapdata.entity_place;
    var url = "http://api.map.baidu.com/geocoder/v2/?address="+location+"&output=json&ak=qYllTsnjS77RI3GPlufXMuQhdQSyYyhh";
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: function( data ) {
            console.log( data );
            var eventpoint = new BMap.Point(data.result.location.lng,data.result.location.lat)
            var eventOverlay = new EventOverlay(eventpoint,mapdata.label,mapdata.title,mapdata.entity_name,mapdata.entity_time)
            initMap(eventpoint);
            self.newmap.addOverlay(eventOverlay);
        }
    });

    initMap = function (eventpoint) {
        var map = new BMap.Map("map");
        map.centerAndZoom(eventpoint, 13);

        map.enableScrollWheelZoom();
        map.setMapStyle({
            styleJson: mapStyle
        });
        self.newmap = map;
    }
};


















var app = new App();