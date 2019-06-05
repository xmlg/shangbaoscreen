define(function(require) {
	var dataManager = require('tool/dataManager');
	var util = require('tool/util');
	var SubScene = require('subscenes/SubScene');

	var MainLabel = require('components/MainLabel');
	var PathWay = require('components/PathWay');

	var CollectorSvg = require('./components/CollectorSvg');
	var Manuscript = require('./components/Manuscript');
	var OriginalDetail = require('./components/OriginalDetail');

	function SubSceneCollect(parent) {
		var self = this;
		SubScene.call(this, parent);
		this.snapElement.attr('name', 'SubSceneCollect');

		var data = this.data = util.clone(dataManager.getData().JSONCOLLECT);

		this.mainLabel = new MainLabel(this, '采', data.TOTAL);
		this.mainLabel.setPosition(1295.5, 157.5);

		this.collectorSvg = new CollectorSvg(this, [data.MATERAILNUM, data.XHSNUM, data.EMAILNUM, data.WEBENTRY.TOTAL, data.ORGINAL.TOTAL]);
		this.collectorSvg.setPosition(1295 + 298, 157 + -35);

		this.manuscript = new Manuscript(this, [data.WEBENTRY.ONE, data.WEBENTRY.TWO, data.WEBENTRY.THREE, data.WEBENTRY.FOUR, data.WEBENTRY.FIVE]);

		this.originalDetail = new OriginalDetail(this, [data.ORGINAL.ONE, data.ORGINAL.TWO, data.ORGINAL.THREE]);
		this.originalDetail.setPosition(1644.5, 364.5);
		//跑线轨道
		var pathWayStyle = {
			stroke: "#E24E2B ",
			strokeWidth: 1,
			fill: "none",
			opacity: 0.5
		}
		this.pathWay0 = new PathWay(this, 'M45 -5 45 -132 65 -147 853 -147 867 -127 867 -5', pathWayStyle);
		this.pathWay0.setPosition(495, 155);
		this.lineChange = dataManager.getData().LINE.LINE1CHANGE;
		//新式样
		var pathWayStyle = {
			stroke: "#00A0E8",
			strokeWidth: 1,
			fill: "none",
			opacity: 1
		};
		//原创素材
		this.pathWay1 = new PathWay(this, 'M-157 74 -143 74 -102 47 -44 47', pathWayStyle, '#00AAFF');

		//新华社稿件
		this.pathWay2 = new PathWay(this, 'M-157 68 -143 68 -102 30 -58 30', pathWayStyle, '#00AAFF');

		//邮件稿
		this.pathWay3 = new PathWay(this, 'M-157 62 -143 62 -102 -25 -62 -25', pathWayStyle, '#00AAFF');

		//互联网稿件
		this.pathWay4 = new PathWay(this, 'M-157 56 -143 56 -102 -88 20 -88 30 -78 30 -60', pathWayStyle, '#00AAFF');

		//原创稿件
		this.pathWay5 = new PathWay(this, 'M-157 50 -143 50 -102 -110 10 -110 20 -114 278 -114 306 -93 306 41 290 57 30 57', pathWayStyle, '#00AAFF');

		//新式样
		var pathWayStyle = {
			stroke: "#5EC3DB",
			strokeWidth: 1,
			fill: "none",
			opacity: 1
		};
		//子路径
		this.pathWay10 = new PathWay(this, 'M-28 30 0 0', pathWayStyle, '#00AAFF');
		this.pathWay20 = new PathWay(this, 'M-41 0 0 0', pathWayStyle, '#00AAFF');
		this.pathWay30 = new PathWay(this, 'M-27 -32 0 0', pathWayStyle, '#00AAFF');
		this.pathWay40 = new PathWay(this, 'M34 24 0 0', pathWayStyle, '#00AAFF');
		this.pathWay50 = new PathWay(this, 'M5 40 0 0', pathWayStyle, '#00AAFF');

		this.pathWay1.setPosition(1592.5, 122.5);
		this.pathWay2.setPosition(1592.5, 122.5);
		this.pathWay3.setPosition(1592.5, 122.5);
		this.pathWay4.setPosition(1592.5, 122.5);
		this.pathWay5.setPosition(1592.5, 122.5);
		this.pathWay10.setPosition(1592.5, 122.5);
		this.pathWay20.setPosition(1592.5, 122.5);
		this.pathWay30.setPosition(1592.5, 122.5);
		this.pathWay40.setPosition(1592.5, 122.5);
		this.pathWay50.setPosition(1592.5, 122.5);
	}
	SubSceneCollect.prototype = Object.create(SubScene.prototype);
	SubSceneCollect.prototype.constructor = SubSceneCollect;
	SubSceneCollect.prototype.init = function() {
		var self = this;
		this.pathWay0.init(1000);

		delay(500, function() {
			self.mainLabel.init();
		});

		delay(1000, function() {
			self.pathWay1.init(1000);
			self.pathWay2.init(1000);
			self.pathWay3.init(1000);
			self.pathWay4.init(1000);
			self.pathWay5.init(1000);

		});
		delay(1500, function() {
			self.manuscript.init();
		})
		delay(2000, function() {
			self.collectorSvg.init();
		})

		delay(2500, function() {
			self.pathWay10.init(1000);
			self.pathWay20.init(1000);
			self.pathWay30.init(1000);
			self.pathWay40.init(1000);
			self.pathWay50.init(1000);

			self.originalDetail.init();

		});
	};

	SubSceneCollect.prototype.update = function() {
		var data = this.data;
		var newData = util.clone(dataManager.getData().JSONCOLLECT);
		this.data = newData;

		this.runPathWay(data, newData);

		var lineChange = this.lineChange;
		var newLineChange = dataManager.getData().LINE.LINE1CHANGE;
		this.lineChange = newLineChange;
		var self = this;
		for(var i = 0; i < newLineChange - lineChange; i++) {
			delay(Math.random() * 5000, function() {
				self.pathWay0.run();
			});
		}
	};

	SubSceneCollect.prototype.runPathWay = function(data, newData, ms) {
		var self = this;
		var rayInfos = [];

		//      for(var i = 0; i < Math.random() * 2; i++) {
		//          delay(Math.random() * 5000, function() {
		//              self.pathWay0.run(2000);
		//          });
		//      }

		//MATERAILNUM
		if(newData.MATERAILNUM - data.MATERAILNUM > 0) {
			util.sliceNumber(newData.MATERAILNUM - data.MATERAILNUM, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay1.run(null, q.run)
						},
						function() {
							self.pathWay10.run(null);
							self.collectorSvg.increase(1, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.MATERAILNUM - data.MATERAILNUM < 0) {
			self.collectorSvg.increase(1, newData.MATERAILNUM - data.MATERAILNUM);
		}

		//XHSNUM
		if(newData.XHSNUM - data.XHSNUM > 0) {
			util.sliceNumber(newData.XHSNUM - data.XHSNUM, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay2.run(null, q.run)
						},
						function() {
							self.pathWay20.run(null);
							self.collectorSvg.increase(2, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.XHSNUM - data.XHSNUM < 0) {
			self.mainLabel.increase(newData.XHSNUM - data.XHSNUM);
			self.collectorSvg.increase(2, newData.XHSNUM - data.XHSNUM);
		}

		//EMAILNUM
		if(newData.EMAILNUM - data.EMAILNUM > 0) {
			util.sliceNumber(newData.EMAILNUM - data.EMAILNUM, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay3.run(null, q.run)
						},
						function() {
							self.pathWay30.run(null);
							self.collectorSvg.increase(3, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.EMAILNUM - data.EMAILNUM < 0) {
			self.mainLabel.increase(newData.EMAILNUM - data.EMAILNUM);
			self.collectorSvg.increase(3, newData.EMAILNUM - data.EMAILNUM);
		}

		//WEBENTRY ONE
		if(newData.WEBENTRY.ONE - data.WEBENTRY.ONE > 0) {
			util.sliceNumber(newData.WEBENTRY.ONE - data.WEBENTRY.ONE, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay4.run(null, q.run)
						},
						function() {
							self.pathWay40.run(null);
							self.collectorSvg.increase(4, mySelf.value);
							self.manuscript.increase(1, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.WEBENTRY.ONE - data.WEBENTRY.ONE < 0) {
			self.mainLabel.increase(newData.WEBENTRY.ONE - data.WEBENTRY.ONE);
			self.collectorSvg.increase(4, newData.WEBENTRY.ONE - data.WEBENTRY.ONE);
			self.manuscript.increase(1, newData.WEBENTRY.ONE - data.WEBENTRY.ONE);
		}

		//WEBENTRY TWO
		if(newData.WEBENTRY.TWO - data.WEBENTRY.TWO > 0) {
			util.sliceNumber(newData.WEBENTRY.TWO - data.WEBENTRY.TWO, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay4.run(null, q.run)
						},
						function() {
							self.pathWay40.run(null);
							self.collectorSvg.increase(4, mySelf.value);
							self.manuscript.increase(2, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.WEBENTRY.TWO - data.WEBENTRY.TWO < 0) {
			self.mainLabel.increase(newData.WEBENTRY.TWO - data.WEBENTRY.TWO);
			self.collectorSvg.increase(4, newData.WEBENTRY.TWO - data.WEBENTRY.TWO);
			self.manuscript.increase(2, newData.WEBENTRY.TWO - data.WEBENTRY.TWO);
		}

		//WEBENTRY THREE
		if(newData.WEBENTRY.THREE - data.WEBENTRY.THREE > 0) {
			util.sliceNumber(newData.WEBENTRY.THREE - data.WEBENTRY.THREE, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay4.run(null, q.run)
						},
						function() {
							self.pathWay40.run(null);
							self.collectorSvg.increase(4, mySelf.value);
							self.manuscript.increase(3, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.WEBENTRY.THREE - data.WEBENTRY.THREE < 0) {
			self.mainLabel.increase(newData.WEBENTRY.THREE - data.WEBENTRY.THREE);
			self.collectorSvg.increase(4, newData.WEBENTRY.THREE - data.WEBENTRY.THREE);
			self.manuscript.increase(3, newData.WEBENTRY.THREE - data.WEBENTRY.THREE);
		}

		//WEBENTRY FOUR
		if(newData.WEBENTRY.FOUR - data.WEBENTRY.FOUR > 0) {
			util.sliceNumber(newData.WEBENTRY.FOUR - data.WEBENTRY.FOUR, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay4.run(null, q.run)
						},
						function() {
							self.pathWay40.run(null);
							self.collectorSvg.increase(4, mySelf.value);
							self.manuscript.increase(4, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.WEBENTRY.FOUR - data.WEBENTRY.FOUR < 0) {
			self.mainLabel.increase(newData.WEBENTRY.FOUR - data.WEBENTRY.FOUR);
			self.collectorSvg.increase(4, newData.WEBENTRY.FOUR - data.WEBENTRY.FOUR);
			self.manuscript.increase(4, newData.WEBENTRY.FOUR - data.WEBENTRY.FOUR);
		}

		//WEBENTRY FIVE
		if(newData.WEBENTRY.FIVE - data.WEBENTRY.FIVE > 0) {
			util.sliceNumber(newData.WEBENTRY.FIVE - data.WEBENTRY.FIVE, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay4.run(null, q.run)
						},
						function() {
							self.pathWay40.run(null);
							self.collectorSvg.increase(4, mySelf.value);
							self.manuscript.increase(5, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.WEBENTRY.FIVE - data.WEBENTRY.FIVE < 0) {
			self.mainLabel.increase(newData.WEBENTRY.FIVE - data.WEBENTRY.FIVE);
			self.collectorSvg.increase(4, newData.WEBENTRY.FIVE - data.WEBENTRY.FIVE);
			self.manuscript.increase(5, newData.WEBENTRY.FIVE - data.WEBENTRY.FIVE);
		}

		//ORGINAL
		if(newData.ORGINAL.ONE - data.ORGINAL.ONE > 0) {
			util.sliceNumber(newData.ORGINAL.ONE - data.ORGINAL.ONE, 5).forEach(function(d, i) {
				var rayInfo = {
					value: d
				};
				rayInfo.run = function() {
					var mySelf = this;
					var q = new Queue();
					q.runActions([
						function() {
							self.mainLabel.increase(mySelf.value);
							self.pathWay5.run(null, q.run)
						},
						function() {
							self.pathWay50.run(null);
							self.collectorSvg.increase(5, mySelf.value);
							self.originalDetail.increase(1, mySelf.value);
						}
					]);
				}
				rayInfos.push(rayInfo);
				rayInfo = null;
			});
		} else if(newData.ORGINAL.ONE - data.ORGINAL.ONE < 0) {
			self.mainLabel.increase(newData.ORGINAL.ONE - data.ORGINAL.ONE);
			self.collectorSvg.increase(5, newData.ORGINAL.ONE - data.ORGINAL.ONE);
			self.originalDetail.increase(1, newData.ORGINAL.ONE - data.ORGINAL.ONE);

		}
		if (newData.ORGINAL.TWO - data.ORGINAL.TWO>0) {
					util.sliceNumber(newData.ORGINAL.TWO - data.ORGINAL.TWO, 5).forEach(function(d, i) {
					var rayInfo = {
						value: d
					};
					rayInfo.run = function() {
						var mySelf = this;
						var q = new Queue();
						q.runActions([
							function() {
								self.mainLabel.increase(mySelf.value);
								self.pathWay5.run(null, q.run)
							},
							function() {
								self.pathWay50.run(null);
								self.collectorSvg.increase(5, mySelf.value);
								self.originalDetail.increase(2, mySelf.value);
							}
						]);
					}
					rayInfos.push(rayInfo);
					rayInfo = null;
				});
		} else if(newData.ORGINAL.TWO - data.ORGINAL.TWO<0){
			self.mainLabel.increase(newData.ORGINAL.TWO - data.ORGINAL.TWO);
			self.collectorSvg.increase(5, newData.ORGINAL.TWO - data.ORGINAL.TWO);
								self.originalDetail.increase(2, newData.ORGINAL.TWO - data.ORGINAL.TWO);
		}

		if (newData.ORGINAL.THREE - data.ORGINAL.THREE>0) {
					util.sliceNumber(newData.ORGINAL.THREE - data.ORGINAL.THREE, 5).forEach(function(d, i) {
					var rayInfo = {
						value: d
					};
					rayInfo.run = function() {
						var mySelf = this;
						var q = new Queue();
						q.runActions([
							function() {
								self.mainLabel.increase(mySelf.value);
								self.pathWay5.run(null, q.run)
							},
							function() {
								self.pathWay50.run(null);
								self.collectorSvg.increase(5, mySelf.value);
								self.originalDetail.increase(3, mySelf.value);
							}
						]);
					}
					rayInfos.push(rayInfo);
					rayInfo = null;
				});
		} else if(newData.ORGINAL.THREE - data.ORGINAL.THREE<0){
			self.mainLabel.increase(newData.ORGINAL.THREE - data.ORGINAL.THREE);
			self.collectorSvg.increase(5, newData.ORGINAL.THREE - data.ORGINAL.THREE);
								self.originalDetail.increase(3, newData.ORGINAL.THREE - data.ORGINAL.THREE);
		}


		//RUN
		rayInfos.forEach(function(rayInfo) {
			delay((ms || 5000) * Math.random(), function() {
				rayInfo.run();
			});
		})
	};

	return SubSceneCollect;
});