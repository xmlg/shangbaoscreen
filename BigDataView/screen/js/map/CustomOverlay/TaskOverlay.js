function TaskOverlay(point, text,id) {
    this._point = point;
    this._text = text;
    this._id = id;
}

TaskOverlay.prototype = new BMap.Overlay();
TaskOverlay.prototype.initialize = function(map) {
    this._map = map;
    div = this._div = document.createElement("div");

    div.setAttribute('class', 'test');
    div.setAttribute('id',this._id);
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.width = "0px";
    div.style.height = "0px";

    var html = [
        '<div class="taskOverlay animated bounceIn">',
        '<img src = "img/notaskreporet.png" class="taskOverlay-img">',
        '<img src="img/border-img.png" class="task-border-up-img">',
        '<img src="img/border-img.png" class="task-border-down-img">',
        '   <span>标题：</span>',
            this._text,
        '</div>'
    ].join("");
    
    var inner = $(html)
    inner.appendTo(div);

    map.getPanes().labelPane.appendChild(div);
    return div;
}

TaskOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x + "px";
    this._div.style.top = pixel.y + "px";
}