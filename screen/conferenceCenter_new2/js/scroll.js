(function() {
    /*var myScroll, myScrol2;

    function loaded() {
        myScroll = new IScroll('#wrapper1', {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        });
        myScrol2 = new IScroll('#wrapper2', {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        });
    }
    loaded();*/
    window.myScroll = function() {};
    myScroll.prototype.scroll = function(id) {
        if (this[id]) this[id].destroy();
        this[id] = new IScroll('#' + id, {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        });
    };
})();
