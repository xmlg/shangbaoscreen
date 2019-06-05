function TaskProceedOverlay(point, title, task, executor, time) {
    this._point = point;
    this._title = title;
    this._task = task;
    this._executor = executor;
    this._time = time;
}

TaskProceedOverlay.prototype = new BMap.Overlay();
TaskProceedOverlay.prototype.initialize = function(map) {
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

        '<div class="taskProceedOverlay animated bounceIn">',
        '   <span>标题：</span>',
        '  ' + this._title + '<br><br>',
        '   <span>任务：</span>',
        '  ' + this._task + '<br><br>',
        '   <span>执行人：</span>',
        '  ' + this._executor + '<br>',
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
    $('.taskProceedOverlay').hide();
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
        $('.taskProceedOverlay').show();
        window.setTimeout(function () {
            $('.personnel-overlay').show();
            $('.taskOverlay').show();
        },1000)
    });
    return div;
};

TaskProceedOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x + "px";
    this._div.style.top = pixel.y + "px";
};