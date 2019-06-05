$(function() {
    var interval = (IABS.configData.shiftInterval || 5) * 1000;
    // var togglePage = function() {
    //     setTimeout(function() {
    //         $('.container').toggleClass('shift');
    //         togglePage();
    //     }, interval);
    // }
    // togglePage();

    IABS.resizePage();
    window.onresize = function() {
        throttle(IABS.resizePage);
    }

    function throttle(method, context) {
        clearTimeout(method.tId);
        method.tId = setTimeout(function() {
            method.call(context);
        }, 100);
    }

    // // IABS.initSentiment();
    // IABS.initSentimentLocal();
    try {
        IABS.initnewList();
    } catch (e) {
        console.log(e);
    }

    try {
        IABS.initdrawMap();
    } catch (e) {
        console.log(e);
    }

    try {
        IABS.drawBlogBarChart();
    } catch (e) {
        console.log(e);
    }

    try {
        IABS.drawWeChatBarChart();
    } catch (e) {
        console.log(e);
    }

    try {
        IABS.drawRose();
    } catch (e) {
        console.log(e);
    }
});
