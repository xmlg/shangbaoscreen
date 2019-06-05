function App() {
    this.initMap();
    this.initWebSocket();
}
App.prototype.initMap = function() {
    var self = this;

    var map = new BMap.Map("container"); // 创建地图实例  
    map.disableDoubleClickZoom()
    map.centerAndZoom('杭州'); // 初始化地图，设置中心点坐标和地图级别

    var navigationControl = new BMap.NavigationControl({
        // 靠左上角位置
        anchor: BMAP_ANCHOR_TOP_LEFT,
        // LARGE类型
        type: BMAP_NAVIGATION_CONTROL_LARGE,
        // 启用显示定位
        enableGeolocation: true
    });
    map.addControl(navigationControl);

    this.map = map;

    function fn() {
        var point = self.map.getCenter();
        var zoom = self.map.getZoom();
        if(self.websocket) {
            websocket.send(
                JSON.stringify({
                    point: point,
                    zoom: zoom
                })
            );
        }
    }
    map.addEventListener("moveend", fn);
    map.addEventListener("zoomend", fn);
}
App.prototype.initWebSocket = function() {
    var self = this;
    var wsUri = "ws://127.0.0.1:8080/";
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
        self.websocket = websocket;
        websocket.send('Controller');
    };
    websocket.onclose = function(evt) {
        console.log('onclose');
    };
    websocket.onmessage = function(evt) {
        console.log(evt.data);
    };
    websocket.onerror = function(evt) {
        console.log('onerror');
    };
}
var app = new App();