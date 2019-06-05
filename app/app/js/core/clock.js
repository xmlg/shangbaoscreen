/**
 * 设置右下角圆形的偏转，及日期时间的显示
 */
cqrbdp.setClockHour = function() {
    var animationIndex = 0;

    setRotate();
    setDateAndHour();
    setInterval(function() {
        setRotate();
        setDateAndHour();
    }, 300000);

    function setRotate() {
        var tempIndex = getAnimationIndex();
        // console.log(tempIndex);
        if (animationIndex != tempIndex) {
            animationIndex = tempIndex;
            var animationName = 'hourP' + animationIndex;
            $('#clock-plate').css('animation', animationName + ' 1s linear forwards');
        };
    }

    function setDateAndHour() {
        var date = cqrbdp.toDayString();
        var hours;
        if (animationIndex == 1) {
            hours = "08:00-10:00";
        } else if (animationIndex == 2) {
            hours = "10:00-12:00";
        } else if (animationIndex == 3) {
            hours = "12:00-02:00";
        } else if (animationIndex == 4) {
            hours = "02:00-04:00";
        } else if (animationIndex == 5) {
            hours = "04:00-06:00";
        } else if (animationIndex == 6) {
            hours = "06:00-08:00";
        }
        $('.date-hour .date').text(date);
        $('.date-hour .hour').text(hours);
    }
    /**
     * 根据当前时间获得偏转动画序数
     * @return {[type]} [description]
     */
    function getAnimationIndex() {
        var animationIndex = 0;
        var time = cqrbdp.getTime();
        var hour = time.hours > 12 ? time.hours - 12 : time.hours;
        // console.log(hour+"H");
        if (hour >= 8 && hour < 10) {
            animationIndex = 1;
        } else if (hour >= 10 && hour < 12) {
            animationIndex = 2;
        } else if (hour >= 12 && hour < 2) {
            animationIndex = 3;
        } else if (hour >= 2 && hour < 4) {
            animationIndex = 4;
        } else if (hour >= 4 && hour < 6) {
            animationIndex = 5;
        } else if (hour >= 6 && hour < 8) {
            animationIndex = 6;
        }
        return animationIndex;
    }
}
