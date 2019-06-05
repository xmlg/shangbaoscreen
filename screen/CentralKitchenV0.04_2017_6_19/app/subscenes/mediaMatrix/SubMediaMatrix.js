define(function(require) {

    var SubScene = require('subscenes/SubScene');

    var relTimeAccess = require('./components/relTimeAccess');
    var accessStatis = require('./components/accessStatis');
    var startMediaMatrix = require('plugIn/startMediaMatrix');

    function SubMediaMatrix(parent) {
        var self = this;
        SubScene.call(this, parent);
        self.relTimeAccess = new relTimeAccess(self);
        self.setPosition(770, 555);
        self.accessStatis = new accessStatis(self);
        self.startMediaMatrix = startMediaMatrix;
    }
    SubMediaMatrix.prototype = Object.create(relTimeAccess.prototype);
    SubMediaMatrix.prototype.constructor = SubMediaMatrix;
    SubMediaMatrix.prototype.init = function() {
        var self = this;
        self.relTimeAccess.init(function() {
            self.accessStatis.init(function() {
                var startMM = new self.startMediaMatrix();
            });
        });
    };
    return SubMediaMatrix;
});
