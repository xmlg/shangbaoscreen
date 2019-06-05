function HqOverlay(point) {
    this._point = point;
}

HqOverlay.prototype = new BMap.Overlay();
HqOverlay.prototype.initialize = function(map) {
    this._map = map;
    div = this._div = document.createElement("div");

    div.setAttribute('class', 'test');
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.width = "0px";
    div.style.height = "0px";

    var html = [
        '<div class="HqOverlaydiv">',
        '<img class="HqOverlay animated bounceIn" src="img/hq-img.png" />',
        '</div>'
    ].join('');

    var inner = $(html)
    inner.appendTo(div);

    map.getPanes().labelPane.appendChild(div);
    return div;
}

HqOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x + "px";
    this._div.style.top = pixel.y + "px";
}