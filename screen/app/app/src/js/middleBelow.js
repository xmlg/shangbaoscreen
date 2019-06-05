$(function() {

    function MiddleBelow() {
        this.counts = 30;
    }

    //取用率
    MiddleBelow.prototype.running = function(min, max) {
        this.hideshow("runLine", min, max);
        var percent = (min / max) * 100;
        Snap("#runNum_count").node.textContent = percent.toFixed(2) + "%";
    };

    //签发率 
    MiddleBelow.prototype.health = function(min, max) {
        this.hideshow("healthLine", min, max);
        var percent = 0;
        if (max) {
            percent = (min / max) * 100;
        }
        Snap("#healthNum_count").node.textContent = percent.toFixed(2) + "%";
    };

    MiddleBelow.prototype.hideshow = function(id, min, max) {
        var count = this.counts;
        if (max) {
            count = Math.floor(this.counts * (min / max));
        }
        var svg = Snap("#" + id);
        var path = svg.selectAll("path");
        var counts = this.counts;
        path.forEach(function(element, index) {
            if (index < counts - count) {
                element.attr({
                    opacity: 0
                });
            } else {
                element.attr({
                    opacity: 10
                });
            }
        });
    };

    function querySystemPerformance(obj) {
        var middleBelownew = new MiddleBelow();
        middleBelownew.health(obj.health.relcount, obj.health.totalcount);
        middleBelownew.running(obj.performance.relcount, obj.performance.totalcount);
    }
    //提供给取用率使用
    window.middleBelow = new MiddleBelow();

    getResquestUrl(domain + "/data/index/middle/data16.json", querySystemPerformance);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/middle/data16.json", querySystemPerformance);
    }, millisec);
});