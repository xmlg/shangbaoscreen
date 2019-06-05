define(function() {
    function SuScene(parent) {
        this.snapElement = parent.snapElement.g();
        this._children = {};
    }
    SuScene.prototype.addComponent = function(name, component, x, y) {
        this._children[name] = component;
        this._children[name].setPosition(x || 0, y || 0);
        this[name] = component;
        return this._children[name];
    }
    return SuScene
})