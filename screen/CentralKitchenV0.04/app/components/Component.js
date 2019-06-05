define(function() {
    function Component(parent) {
        this.parent = parent;
        this.snapElement = this.parent.snapElement.g();
        this.x = 0;
        this.y = 0;
        this.setPosition(this.x,this.y);
        
        //this.init();
    }
    Component.prototype.init = function() {
        var bigCircle = this.snapElement.circle(150, 150, 100);
        // By default its black, lets change its attributes
        bigCircle.attr({
            fill: "#bada55",
            stroke: "#F00",
            strokeWidth: 15
        });
    }
    Component.prototype.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
        this.snapElement.attr({
            transform: new Snap.Matrix().translate(this.x, this.y)
        })
    }
    return Component;
})