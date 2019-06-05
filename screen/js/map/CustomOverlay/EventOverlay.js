function EventOverlay(point, label,title, people, time) {
    this._point = point;
    this._label = label;
    this._title = title;
    this._people = people;
    this._time = time;
}

EventOverlay.prototype = new BMap.Overlay();
EventOverlay.prototype.initialize = function(map) {
    this._map = map;
    div = this._div = document.createElement("div");

    div.setAttribute('class', 'test');
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.width = "0px";
    div.style.height = "0px";

    var html = [
        '<img src="img/map-local-1.png" class="pro-local-1">',
        '<img src="img/map-local-2.png" class="pro-local-2">',
        '<img src="img/map-local-3.png" class="pro-local-3">',
        '<img src="img/proceed-1.png" class="proceed-1">',

        '<div class="EventOverlay animated bounceIn">',
        '   <span>标签：</span>',
        '  ' + this._label + '<br><br>',
        '   <span>标题：</span>',
        '  ' + this._title + '<br><br>',
        '   <span>相关人物：</span>',
        '  ' + this._people + '<br>',
        '   <span>时间：</span>',
        '  ' + this._time,
        '<img src="img/border-line.png" class="taskpro-line-up-img">',
        '<img src="img/border-dot.png" class="taskpro-dot-up-img">',
        '<img src="img/border-line.png" class="taskpro-line-down-img">',
        '<img src="img/border-dot.png" class="taskpro-dot-down-img">',
        '</div>'
    ].join("");

    var inner = $(html);
    inner.appendTo(div);

    map.getPanes().labelPane.appendChild(div);
    $('.proceed-1').hide();
    $('.EventOverlay').hide();
    $('.personnel-overlay').hide();
    $('.taskOverlay').hide();
    $('.pro-local-2').animate({width:"168px",bottom: "-79px",
        left: "-77px"},1000);
    $('.pro-local-1').animate({width:"168px",bottom: "-79px",
        left: "-77px"},1000);
    $('.pro-local-3').animate({width:"188px",bottom: "-4px",
        left: "-86px"},1000)
    $('.pro-local-3').animate({width:"132px",bottom: "-6px",
        left: "-59px"},1000, function () {
        $('.proceed-1').show();
        $('.EventOverlay').show();
        window.setTimeout(function () {
            $('.personnel-overlay').show();
            $('.taskOverlay').show();
        },1000)
    });
    return div;
};

EventOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x + "px";
    this._div.style.top = pixel.y + "px";
};