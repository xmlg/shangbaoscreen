function PersonnelOverlay(point, name, phoneNumber) {
    this._point = point;
    this._name = name;
    this._phoneNumber = phoneNumber;
}

PersonnelOverlay.prototype = new BMap.Overlay();
PersonnelOverlay.prototype.initialize = function(map) {
    this._map = map;
    div = this._div = document.createElement("div");

    div.setAttribute('class', 'test');
    div.style.position = "absolute";
    div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
    div.style.width = "0px";
    div.style.height = "0px";

    var html = [
        '<div class="personnel-overlay animated bounceIn">',
        '   <div class="name">' + this._name + '</div>',
        '   <div class="phone-number">' + this._phoneNumber + '</div>',
        '</div>'
    ].join('');

    var inner = $(html)
    inner.appendTo(div);

    map.getPanes().labelPane.appendChild(div);
    return div;
}

PersonnelOverlay.prototype.draw = function() {
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    this._div.style.left = pixel.x + "px";
    this._div.style.top = pixel.y + "px";
}