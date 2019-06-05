function TimedTask(taskFn, delay) {
	this.state = 0; //0 未初始化
	this.taskFn = taskFn;
	this.delay = delay;
}

TimedTask.prototype.start = function() {
	var self = this;
	if (this.windowTimeOut) {
		window.clearTimeout(this.windowTimeOut);
	}
	this.windowTimeOut = window.setTimeout(function() {
		try {
			var nextDelay = self.taskFn();
			if (nextDelay) {
				self.delay = nextDelay;
				self.start();
			}
		} catch (e) {
			console.log(e);
		}

	}, self.delay);
}

TimedTask.prototype.stop = function() {
	if (this.windowTimeOut) {
		window.clearTimeout(this.windowTimeOut);
	}
}