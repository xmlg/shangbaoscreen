define(function(require) {
    var dataManager = require('tool/dataManager');
    var SubScenePlan = require('subscenes/plan/SubScenePlan');
    var SubSceneCollect = require('subscenes/collect/SubSceneCollect');
    var SubSceneEdit = require('subscenes/edit/SubSceneEdit');
    var SubSceneDistribute = require('subscenes/distribute/SubSceneDistribute');
    var SubSceneOther = require('subscenes/other/SubSceneOther');
    
    function Scene() {
        this.snapElement = Snap("#svg");

        this.subScenePlan = new SubScenePlan(this);
        this.subSceneCollect = new SubSceneCollect(this);
        this.subSceneEdit = new SubSceneEdit(this);
        this.subSceneDistribute = new SubSceneDistribute(this);
        this.subSceneOther = new SubSceneOther(this);
    }

    Scene.prototype.init = function() {
        var self = this;

        this.subScenePlan.init();
        delay(1250, function() {
            self.subSceneCollect.init();
        });
        delay(1750, function() {
            self.subSceneOther.init();
            self.subSceneEdit.init();
        });
        delay(2250, function() {
            self.subSceneDistribute.init();
        });
        this.startTimingTask();
 	 this.reloadhref();
    }
        Scene.prototype.reloadhref = function(){
    		var interval = window.setInterval(function() {
       			 window.location.reload(true);
  			  },30*60*1000);
    }
    Scene.prototype.startTimingTask = function() {
        var self = this;
        window.setTimeout(function() {
            window.setInterval(function() {
                self.subScenePlan.update();
                self.subSceneCollect.update();
                self.subSceneEdit.update();
                self.subSceneDistribute.update();
                self.subSceneOther.update();
            }, 5 * 1000);
             window.setInterval(function() {
               window.location.reload();
            }, 30*60 * 1000);
            
        }, 5 * 1000);
    }
    return Scene;
});