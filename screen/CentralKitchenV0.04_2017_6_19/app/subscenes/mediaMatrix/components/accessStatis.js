define(function(require) {
    var Component = require('components/Component');
    var svgRepository = require('tool/svgRepository');
    var ringChart = require('plugIn/ringChart');
   /* var startMediaMatrix = require('plugIn/startMediaMatrix');*/

    function AccessStatis(parent) {
        Component.call(this, parent);
        this.setPosition(-50, 200);
        this.ringChart = ringChart;
    }
    //RelTimeAccess.prototype = Object.create(Component.prototype);
    AccessStatis.constructor = AccessStatis;
    AccessStatis.prototype = Object.create(Component.prototype);
    AccessStatis.prototype.init = function(success) {
        var self = this;
        this.AccessStatisG = this.snapElement.g();
        this.AccessStatisG.append(svgRepository.getSvg('accessStatisSvg'));
        this.AccessStatisG.select("#accessStatis").animate({
            opacity: 1
        }, 1000, function() {
            success();
        });
    };
    return AccessStatis;
});
