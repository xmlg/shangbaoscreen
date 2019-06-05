define(function(require) {
    var dataManager = require('tool/dataManager');
    var util = require('tool/util');

    var SubScene = require('subscenes/SubScene');

    var OfficalWeiBo = require('./components/OfficalWeiBo');
    var ShareRateNew = require('./components/ShareRateNew');
    //var ShareRate = require('./components/ShareRate');
    /*var CentreLogo = require('./components/CentreLogo');*/
    var TopRelease = require('./components/TopRelease');

    function SubSceneOther(parent) {
        var self = this;
        SubScene.call(this, parent);
        this.snapElement.attr('name', 'SubSceneOther');
        this.shareRateNew = new ShareRateNew(self, 598, 1507);
        this.shareRateNew.setPosition(1518, 705);
        //this.shareRate = new ShareRate(self, 295, 295);
        //this.shareRate.setPosition(1200, 915);

        this.officalWeiBo = new OfficalWeiBo(self, 295, 295);
        this.officalWeiBo.setPosition(785, 185);

        this.topRelease = new TopRelease(self, 305, 295);
        this.topRelease.setPosition(1090, 185);

        /*this.centreLogo = new CentreLogo(self);
        this.centreLogo.setPosition(998, 558)*/
    }
    SubSceneOther.prototype = Object.create(SubScene.prototype);
    SubSceneOther.prototype.constructor = SubSceneOther;
    SubSceneOther.prototype.init = function() {
        var self = this;

        /*this.centreLogo.init();*/
        delay(1000, function() {
            self.topRelease.init();
            self.officalWeiBo.init();
        });
        delay(5000, function() {
            self.shareRateNew.init();
        });
    }
    SubSceneOther.prototype.update = function() {
        this.topRelease.update();
        this.shareRateNew.update();
        this.officalWeiBo.update();
        /*this.centreLogo.update();*/
    }
    return SubSceneOther;
});
