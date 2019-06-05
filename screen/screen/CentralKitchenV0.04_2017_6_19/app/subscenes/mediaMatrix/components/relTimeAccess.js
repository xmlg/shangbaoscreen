define(function(require) {
    var Component = require('components/Component');
    var svgRepository = require('tool/svgRepository');

    function RelTimeAccess(parent) {
        Component.call(this, parent);
    }
    //RelTimeAccess.prototype = Object.create(Component.prototype);
    RelTimeAccess.constructor = RelTimeAccess;
    RelTimeAccess.prototype = Object.create(Component.prototype);
    RelTimeAccess.prototype.init = function(success) {
        this.relTimeAccessG = this.snapElement.g();
        this.relTimeAccessG.append(svgRepository.getSvg('reltimeaccessSvg'));
        this.relTimeAccessG.select("#reltimeaccess").animate({
            opacity: 1
        },1000,function(){
            success();
        });
    };
    return RelTimeAccess;
});
