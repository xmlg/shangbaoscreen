/**
 * [CircularArc 画椭圆]
 * @param {[type]} r         [半径]
 * @param {[type]} progress  [椭圆大小比]
 * @param {[type]} dasharray [线段空隙长度]
 * @param {[type]} color     [颜色]
 */
function CircularArc(r, progress) {
    this.r = r;
    this.progress = progress;
}
CircularArc.prototype.drawPath = function() {

    var startX = 0,
        startY = -this.r; //圆弧起点、终点

    // 计算当前的进度对应的角度值
    var degrees = this.progress * 360;

    // 计算当前角度对应的弧度值
    var rad = degrees * (Math.PI / 180);

    //极坐标转换成直角坐标
    var x = (Math.sin(rad) * this.r).toFixed(2);
    var y = -(Math.cos(rad) * this.r).toFixed(2);

    //大于180度时候画大角度弧，小于180度的画小角度弧，(deg > 180) ? 1 : 0
    var lenghty = window.Number(degrees > 180);

    //path 属性
    var descriptions = ['M', startX, startY, 'A', this.r, this.r, 0, lenghty, 1, x, y];

    // 给path 设置属性
    return descriptions.join(' ');
};
