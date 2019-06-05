function Queue(isRepet, isReverse) {
    var self = this;
    this.index = -1;
    this.isRepet = isRepet;
    this.isReverse = isReverse || false;
    this.direction = true;

    if(typeof isRepet === 'number' && isRepet > 0) {
        this.isNumber = true;
    } else {
        this.isNumber = false;
    }
    self.run = function() {
        if(self.direction) {
            self.index++;
        } else {
            self.index--;
        }
        if(
            self.isRepet &&
            (self.index >= self.actions.length || self.index < 0)
        ) {
            if(self.isNumber) {
                self.isRepet--;
            }
            if(self.isReverse) {
                self.direction = !self.direction;
                if(self.direction) {
                    self.index += 2;
                } else {
                    self.index -= 2;
                }
            } else {
                self.index = 0;
            }
        };
        var action = self.actions[self.index];
        if(action && typeof action == 'function') {
            action()
        } else {
            self.subQueue && self.subQueue.run();
        };
    }
    this.runActions = function(actions) {
        this.actions = actions;
        this.run();
        return this;
    }
    this.createSubQueue = function(isRepet, isReverse) {
        this.subQueue = new Queue(isRepet, isReverse);
        this.subQueue.runActions = function(actions) {
            this.actions = actions;
            return this;
        }
        return this.subQueue;
    }
}

Snap.plugin(function(Snap, Element, Paper, global, Fragment) {
    Element.prototype.animateQueue = function(attrs, ms, cb) {
        var self = this;
        if(!this._queue) {
            needStart = true;
            this._queue = new Queue();
            this._queueList = [];
            this._queueList.push(function() {
                self.animate(attrs, ms, function() {
                    self._queue.run();
                    cb && cb();
                });
            })
            this._queue.runActions(this._queueList);
        } else {
            this._queueList.push(function() {
                self.animate(attrs, ms, function() {
                    self._queue.run();
                    cb && cb();
                });
            })
        }
        return this;
    };
    Element.prototype.animatePath = function(d, ms, cb) {
        var element = this;
        var path = Snap('svg').path(d);
        var pathLength = path.getTotalLength();
        path.remove();

        //console.log(pathLength);

        var sd = d.slice(1, d.length);
        var attr = sd.split(/\s{1,}/);
        var nodes = [];

        for(var i = 0; i < attr.length; i += 2) {
            nodes.push({
                x: attr[i],
                y: attr[i + 1]
            })
        }
        element.attr({
            d: 'M' + nodes[0].x + ' ' + nodes[0].y + ' ' + nodes[0].x + ' ' + nodes[0].y
        })
        var ad = 'M' + nodes[0].x + ' ' + nodes[0].y + ' ';

        var queue = new Queue();
        var list = [];
        for(var i = 1; i < nodes.length; i++) {
            ad += nodes[i].x + ' ' + nodes[i].y + ' ';
            //console.log(ad);

            var x = nodes[i].x - nodes[i - 1].x;
            var y = nodes[i].y - nodes[i - 1].y;

            var l = Math.pow(x * x + y * y, 0.5)
            list.push((function(ii, ad, s) {
                return function() {
                    if(ii == nodes.length - 1) {
                        element.animate({
                            d: ad
                        }, s, cb)
                    } else {
                        element.animate({
                            d: ad
                        }, s, queue.run);
                    }
                }
            })(i, ad, (ms * l) / pathLength));
        }
        queue.runActions(list);
        //console.log(nodes);
    }
    Element.prototype.blinkShow = function(time, ms, cb) {
        var element = this;
        var queue = new Queue();
        var list = [];
        for(var i = 0; i < time; i++) {
            list.push(function() {
                element.animate({
                        opacity: 0
                    },
                    0.5 * ms / time,
                    function() {
                        element.animate({
                            opacity: 1
                        }, 0.5 * ms / time, i == time - 1 ? cb : queue.run);
                    }
                );
            });
        }
        queue.runActions(list);
        return element;
    }
});

function delay(ms, fn) {
    Snap.animate(0, 0, function() {}, ms, fn);
}