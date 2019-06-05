// window.domain = "http://" + document.domain +":8081/app/app";//本地
window.domain = "http://" + document.domain +":" +window.location.port +"/cb";
window.millisec = 10000;

function getResquestUrl(url, call, type) {
    $.ajax({
        type: type ? type : "get",
        url: url,
        dataType: "json",
        success: function(obj) {
            call(obj);
        },
        error: function(message) {
            //console.log(message);
        }
    });
}

//数字动态添加组件默认参数设置
var options = {  
    useEasing: true,
      useGrouping: true,
      separator: '',
      decimal: '.'
};

/**
 * [run description]
 * @param  {[type]} pid  [父元素id]
 * @param  {[type]} id   [元素id]
 * @param  {[type]} path [动画路径]
 * @return {[type]}      [null]
 */
window.run = function(pid, id, path) {
    var map, spaceship, flight_path, flight_path_length, last_point;
    map = Snap('#' + pid);
    flight_path = map.path(path).attr({ 'fill': 'none', 'stroke': 'none' });
    flight_path_length = Snap.path.getTotalLength(flight_path);
    last_point = flight_path.getPointAtLength(flight_path_length);

    var c = map.paper.circle(4, 4, 3).attr({
        fill: '#EFFFFF',
        stroke: "none",
        strokeWidth: 0
    });
    map.append(c);
    var spaceship = map.paper.polygon([0, 0, 50, 4, 0, 8]).attr({
        fill: '#FF7F24',
        stroke: "none",
        strokeWidth: 0,
        opacity: 0.8,
        filter: "url(#drop-shadow)"
    });
    map.append(spaceship);
    spaceshipbbox = spaceship.getBBox();
    Snap.animate(0, flight_path_length, function(step) {
        moveToPoint = Snap.path.getPointAtLength(flight_path, step);
        x = moveToPoint.x - (spaceshipbbox.width / 2);
        y = moveToPoint.y - (spaceshipbbox.height / 2);
        c.transform('translate(' + x + ',' + y + ') rotate(' + (moveToPoint.alpha) + ', ' + spaceshipbbox.cx + ', ' + spaceshipbbox.cy + ')');
        spaceship.transform('translate(' + x + ',' + y + ') rotate(' + (moveToPoint.alpha) + ', ' + spaceshipbbox.cx + ', ' + spaceshipbbox.cy + ')');
    }, 5000, mina.easeout, function() {
        spaceship.remove();
        c.remove();
    });
};

//根据分辨率调整页面大小
function screen() {
    var width = $(window).width();
    var height = $(window).height();
    var location = {
        x: 0,
        y: 0
    };

    if (width / height < 1920 / 1080) {
        scale = width / 1920;
        location.y = (height - 1080 * scale) / 2;
    } else {
        scale = height / 1080;
        location.x = (width - 1920 * scale) / 2;
    }
    $("body").css({
        "width": 1920,
        "height": 1080,
        "transform": "scale(" + scale + ")",
        "-ms-transform": "scale(" + scale + ")",
        "-moz-transform": "scale(" + scale + ")",
        "-webkit-transform": "scale(" + scale + ")",
        "-o-transform": "scale(" + scale + ")",
        "transform-origin": "left top",
        "-ms-transform-origin": "left top",
        "-webkit-transform-origin": "left top",
        "-moz-transform-origin": "left top",
        "-o-transform-origin": "left top",
        "margin-left": location.x + "px",
        "margin-top": location.y + "px"
    });

}

$(window).resize(function() {
    screen();
});

screen();