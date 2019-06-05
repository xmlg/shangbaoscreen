/**
 * Created by Administrator on 2016/7/26.
 */
function EditApp() {
	var self = this;
	self.gettime();
	self.Nextfocusindex = 0;
	self.rollindex = 0;
	self.nginx6275 = '/testajax/';
	self.nginx7418 = '/ajax/'
		//轮询间隔设置
	self.focusNextlist = new TimedTask(function() {
		self.focusnextlist();
		self.rollindex = 0;
		//if (nextRecord != undefined ) {
		//    return nextRecord.taskdata.length * 2000 + 3000000;
		//}
		return 20 * 1000;
	}, 0);
	//列表自动刷新
	self.requestdata = new TimedTask(function() {
		self.requestListdata();
		return 6000000;
	}, 0);
	//素材横向滚动
	self.materrolltask = new TimedTask(function() {
		self.materroll();
		return 3000
	}, 0)

	self.requestdata.start();
}

//列表轮询
EditApp.prototype.focusnextlist = function() {
	var firstviewportTOP = $("#0").offset().top
	var self = this;
	var listlength = $('.reporttitle').length;
	var img = '<img src="img/yellowchoose.png" class="listchoose">'
	if(self.listdata) {
		var viewportTOP = $('#' + self.Nextfocusindex).offset().top
		$('.reporttitle').removeClass('listfocus');
		$('.listchoose').remove();
		$('.reportlist').animate({
			scrollTop: (viewportTOP - firstviewportTOP)
		}, "500")
		$('#' + self.Nextfocusindex).addClass('listfocus').append(img);
		var reportid = $('#' + self.Nextfocusindex).attr('reportid')
			//  console.log(reportid);
		self.getnewsdata(reportid);
		self.Nextfocusindex++;
		if(self.Nextfocusindex >= listlength) {
			self.Nextfocusindex = 0;
		}
	}
};
//获取列表数据
EditApp.prototype.requestListdata = function() {
	var self = this;
	//d3.json("js/json/editreportlist.json", function (data) {
	d3.json("/screen/pretheme/report", function(error, data) {
		if(error || $.isEmptyObject(data)) {
			return false
		}
		self.listdata = data;
		self.renderreportlist(data)
		self.focusNextlist.start();
	})
};
//生成报题列表
EditApp.prototype.renderreportlist = function(data) {
	var self = this;
	var editdata = [];
	for(var i = 0; i < data.length; i++) {
		if(data[i].REPORTS_INFO.length != 0) {
			editdata.push(data[i])
		}
	}
	if(editdata == "") {
		self.focusNextlist.stop();
		return false

	}
	var listbox = d3.select('.reportlist').selectAll('div.listbox').data(editdata);
	var boxenter = listbox.enter();
	var boxexit = listbox.exit();

	boxexit.remove();
	boxenter.append('div').each(function(d) {
		d3.select(this).classed("listbox", true);
		d3.select(this).append('div').classed('listheader', true).attr('z-index', 99);
		d3.select(this).append('div').classed('listboxcontent', true);
		d3.select(this).select('.listheader').append('div').classed('font_title', true).text(d.DEPARTNAME)
	});

	listbox.each(function(d, i) {
		var listcontent = d3.select(this).select('.listboxcontent').selectAll('div').data(d.REPORTS_INFO);
		var listenter = listcontent.enter();
		var listexit = listcontent.exit();

		listexit.remove();
		listenter.append('div').each(function(d) {
			d3.select(this).classed('reporttitle', true);
			d3.select(this).append('p').text(d.STATEMENT);
			if(d.FLAG == 1) {
				d3.select(this).append('img').attr('src', 'img/flag-1.png').classed('flagicon', true)
			} else if(d.FLAG == 2) {
				d3.select(this).append('img').attr('src', 'img/flag-2.png').classed('flagicon', true)
			} else if(d.FLAG == 3) {
				d3.select(this).append('img').attr('src', 'img/flag-3.png').classed('flagicon', true)
			} else if(d.FLAG == 4) {
				d3.select(this).append('img').attr('src', 'img/flag-4.png').classed('flagicon', true)
			}
		})

	});

	d3.selectAll('.listbox')
		.each(function() {
			d3.select(this).select('.listheader').classed('listheader', true).append('img')
				.attr('src', 'img/middle-title-left.png').classed('headertitle-left', true);
			d3.select(this).select('.listheader').append('img')
				.attr('src', 'img/middle-title-right.png').classed('headertitle-right', true);
			d3.select(this).select('.listboxcontent').classed('yellowbg', true).append('img')
				.attr('src', 'img/middle-md-up.png').classed("blueborderup", true);
			d3.select(this).select('.listboxcontent').append('img')
				.attr('src', 'img/middle-bg-down.png').classed("blueborderdown", true);
			d3.select(this).selectAll('.reporttitle').classed('list-border-bottom', true)
		});
	$('.reportlist').niceScroll();
	d3.selectAll('.reporttitle').each(function(d, i) {
			d3.select(this).attr('id', i).attr("reportid", d.REPORTID)

		})
		.on('click', function(d, i) {
			self.focusNextlist.stop();
			self.Nextfocusindex = i;
			self.focusnextlist()
			self.clickpause = window.setTimeout(function() {
				self.focusNextlist.start();
			}, 60 * 1000)
		})
};

//获取对应新闻数据
EditApp.prototype.getnewsdata = function(id) {
	var self = this;
	$.when(
			//$.ajax('js/json/edit-reportDetails.json',{report_id:id}),
			//$.ajax('js/json/edit-metadataLogs.json',{report_id:id}),
			//$.ajax('js/json/edit-taskdatalog.json',{report_id:id})
			$.get("/screen/pretheme/reportmessage", {
				report_id: id
			}),
			$.get('/screen/pretheme/reporttrace', {
				report_id: id
			}),
			$.get('/screen/pretheme/reporttask', {
				report_id: id
			})
		)
		.then(function(
			reportDetailsData,
			metadataLogsData,
			taskdatalogData
		) {
			self.detailsdata = JSON.parse(reportDetailsData[0]);
			//  console.log(metadataLogsData);
			self.metadata = JSON.parse(metadataLogsData[0]);
			self.taskdata = taskdatalogData
			self.render();
		})

};

//渲染内容
EditApp.prototype.render = function() {
	var self = this;
	if($.isEmptyObject(self.detailsdata) == false) {
		this.renderdetails();
		this.renderhotcurve()
	}
	if($.isEmptyObject(self.metadata) == false) {
		this.rendermetalog();
	}
	this.renderright();
};
//渲染稿件详情
EditApp.prototype.renderdetails = function() {
	var self = this;
	var reportdetailsdata = JSON.parse(self.detailsdata.reportDetailJson);
	var flagicon1 = "<img class='flagicon' src='img/flag-1.png'>";
	var flagicon2 = "<img class='flagicon' src='img/flag-2.png'>";
	var flagicon3 = "<img class='flagicon' src='img/flag-3.png'>";
	var flagicon4 = "<img class='flagicon' src='img/flag-4.png'>";
	$('.details-keyword p').remove();
	$("#details-title p").html("【" + reportdetailsdata.GNAME + "】" + reportdetailsdata.STATEMENT)
	$("#details-title").empty();
	if(reportdetailsdata.FLAG == 1) {
		$("#details-title").append(flagicon1)
	} else if(reportdetailsdata.FLAG == 2) {
		$("#details-title").append(flagicon2)
	} else if(reportdetailsdata.FLAG == 3) {
		$("#details-title").append(flagicon3)
	} else if(reportdetailsdata.FLAG == 4) {
		$("#details-title").append(flagicon4)
	}
	$('.details-content').html(reportdetailsdata.CONTENT);
	for(var m = 0; m < reportdetailsdata.KEYWORDS.length; m++) {
		$('.details-keyword').append("<p>" + reportdetailsdata.KEYWORDS[m].name + '</p>')
	}
	self.renderAdddata();
};

//渲染稿件跟踪
EditApp.prototype.rendermetalog = function() {
	var self = this;
	var metalogdata = self.metadata.Data;
	var metastatus = [];
	if(metalogdata == 0) {
		$('.metalog-start').attr('src', 'img/notstart_03.png');
		$('.metalog-process:eq(2)').attr('src', 'img/metalog-notpro.png');
		$('.metalog-process:eq(1)').attr('src', 'img/metalog-notpro.png');
		$('.metalog-process:eq(3)').attr('src', 'img/metalog-notpro.png');
		$('.metalog-process:eq(4)').attr('src', 'img/metalog-notpro.png');
		$('.metalog-process:eq(0)').attr('src', 'img/metalog-notpro.png');
	} else {
		$.each(metalogdata, function(i) {
			metastatus.push(metalogdata[i].OPERATION)
		});
		if(metastatus.indexOf("新建") != -1 || metastatus.indexOf("编辑") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png');
			$('.metalog-process:eq(2)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(1)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(3)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(4)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(0)').attr('src', 'img/metalog-notpro.png');
		}

		if(metastatus.indexOf('送审') != -1 || metastatus.indexOf('待审') != -1 || metastatus.indexOf('上版') != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png');
			$('.metalog-process:eq(3)').attr('src', 'img/metalog-pro.png');
			$('.metalog-process:eq(4)').attr('src', 'img/metalog-notpro.png');

		}
		if(metastatus.indexOf("签发") != -1 || metastatus.indexOf("签发照排") != -1 || metastatus.indexOf("已签发") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png');
			$('.metalog-process:eq(3)').attr('src', 'img/metalog-pro.png');
			$('.metalog-process:eq(4)').attr('src', 'img/metalog-pro.png');
		}
		if(metastatus.indexOf("撤稿")!= -1|| metastatus.indexOf("取消签发") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png');
			$('.metalog-process:eq(2)').attr('src', 'img/metalog-pro.png');
			$('.metalog-process:eq(3)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(4)').attr('src', 'img/metalog-notpro.png');
		}
		if(metastatus.indexOf("取稿") != -1|| metastatus.indexOf("待编") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png')
			$('.metalog-process:eq(2)').attr('src', 'img/metalog-pro.png');
		}
		if(metastatus.indexOf("传稿") != -1|| metastatus.indexOf("提交") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png')
			$('.metalog-process:eq(0)').attr('src', 'img/metalog-pro.png');
			$('.metalog-process:eq(1)').attr('src', 'img/metalog-notpro.png');
		}
		if(metastatus.indexOf("共享") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png')
			$('.metalog-process:eq(0)').attr('src', 'img/metalog-pro.png');
			$('.metalog-process:eq(1)').attr('src', 'img/metalog-pro.png');
		}
		
		if(metastatus.indexOf("退稿") != -1) {
			$('.metalog-start').attr('src', 'img/metalog-start.png')
			$('.metalog-process:eq(1)').attr('src', 'img/metalog-pro.png');
			$('.metalog-process:eq(2)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(3)').attr('src', 'img/metalog-notpro.png');
			$('.metalog-process:eq(4)').attr('src', 'img/metalog-notpro.png');
		}

	}
};
//渲染补充资料
EditApp.prototype.renderAdddata = function() {
	var self = this;
	var data = JSON.parse(self.detailsdata.reportDetailJson).report_repliesinfo;
	//alert(data.length);
	$('.adddata-list').empty();
	$('.adddata-clickdown').remove();
	if(data.length != 0) {
		var update = d3.select('.adddata-list').selectAll('div').data(data)
		var enter = update.enter();
		var exit = update.exit();

		exit.remove();
		enter.append('div').each(function(d, i) {
			var pvalue = $(d.ADDCONTENT).text();
			//var imgvalue = $($(d.ADDCONTENT).html()).attr('src')
			var imgvalue = $(d.ADDCONTENT).find('img').attr('src');
			//              if(
			//              	imgvalue!=undefined;
			//              ){
			//              	
			//              }
			var time = d.CRTIME.split(' ', 11)
				//整个图片div
			d3.select(this).classed('add-listbox', true);
			d3.select(this).classed('bluebg', true).append('img')
				.attr('src', 'img/md-2-up.png').classed("md-2-up", true);
			d3.select(this).append('img')
				.attr('src', 'img/md-2-down.png').classed("md-2-down", true);
			if(pvalue != '' && imgvalue != undefined) {
				d3.select(this).append('p').classed('add-p-2', true).text(pvalue)
				d3.select(this).append('img').classed('add-img-2', true).attr('src', imgvalue)
				d3.select(this).append('div').classed('add-time-2', true).text(time[0])
				d3.select(this).select('.add-time-2').append('span').text(time[1]);
			} else if(pvalue != '' && imgvalue == undefined) {
				d3.select(this).append('p').classed('add-p-1', true).text(pvalue);
				d3.select(this).append('div').classed('add-time-1', true).text(time[0])
				d3.select(this).select('.add-time-1').append('span').text(time[1]);
			} else if(pvalue == '' && imgvalue != undefined) {
				d3.select(this).append('img').classed('add-img-1', true).attr('src', imgvalue)
				d3.select(this).append('div').classed('add-time-2', true).text(time[0])
				d3.select(this).select('.add-time-2').append('span').text(time[1]);
			}
		})

		var detalisH = $('.reportdetails').height();
		var adddataH = $('.adddata').height();
		//   console.log(detalisH,adddataH)
		if(detalisH + adddataH > 672) {
			$('.center-wrap').niceScroll();
			$('.center-wrap').append("<div style='width: 100%;height: 140px;float: left'></div>")
			$('.middlebox').append("<div class='adddata-clickdown'><img src='img/click.png' class='clickdown-img'> </div>")
			$('.adddata-clickdown').on('click', function() {
				var scrollH = $('.center-wrap').scrollTop()
				if(scrollH > (data.length - 2) * 140) {
					$('.center-wrap').animate({
						scrollTop: 0
					}, "600")
					return false
				}
				$('.center-wrap').animate({
					scrollTop: scrollH + 140
				}, "600")

			})
		}
	} else {
		$('.adddata-list').empty();
	}
};
//渲染右侧任务跟踪
EditApp.prototype.renderright = function() {
	var self = this;
	console.log(self.taskdata);
	var taskdatalog = JSON.parse(self.taskdata[0]);
	console.log(taskdatalog);
	//判断任务进程
	if($.isEmptyObject(taskdatalog) == false) {
		var PlanTaskLogs = taskdatalog.PlanTaskLogs;
		var PlanTaskLogs_OPERSTATUS = [];
		$.each(PlanTaskLogs, function(i) {
			PlanTaskLogs_OPERSTATUS.push(PlanTaskLogs[i].OPERSTATUS)
		});
		if(taskdatalog.Materials.length == 0) {
			$('.taskMaterials').remove();
			$('.bigbox').remove();
			$('.taskdatalog').css('height', '125px');
			$('.tasklog').css('margin', '23px 0');
			$('.metalogpro').css({
				'height': '424px',
				'padding': '47px 8px',
				'margin-top': '33px'
			});
			$('.metalog-box').css('height', '548px');
			$('.metalog-start').css({
				'width': '456px',
				'height': '43px'
			});
			$('.metalog-img').css({
				'width': '456px',
				'height': '55px'
			});
			$('.tasklogpro').removeClass('tasklogdone tasklognotdone');
			if(PlanTaskLogs_OPERSTATUS.indexOf('10') != -1) {
				$('#fs').addClass('tasklogdone');
				$('#dq').addClass('tasklognotdone');
				$('#js').addClass('tasklognotdone');
				$('#hc').addClass('tasklognotdone');
			}
			if(PlanTaskLogs_OPERSTATUS.indexOf('1') != -1) {
				$('#fs').removeClass('tasklogdone');
				$('#fs').addClass('tasklogdone');
				$('#dq').removeClass('tasklognotdone');
				$('#dq').addClass('tasklogdone');
				$('#js').addClass('tasklognotdone');
			}
			if(PlanTaskLogs_OPERSTATUS.indexOf('11') != -1) {
				$('#js').removeClass('tasklognotdone');
				$('#fs').removeClass('tasklogdone');
				$('#dq').removeClass('tasklognotdone');
				$('#fs').addClass('tasklogdone');
				$('#dq').addClass('tasklogdone');
				$('#js').addClass('tasklogdone');
			}

		} else {
			$('.tasklogpro').removeClass('tasklognotdone');
			$('.tasklogpro').addClass('tasklogdone');
//			$('#js').removeClass('tasklognotdone');
//			$('#fs').removeClass('tasklogdone');
//			$('#dq').removeClass('tasklognotdone');
//			$('#fs').addClass('tasklogdone');
//			$('#dq').addClass('tasklogdone');
//			$('#js').addClass('tasklogdone');
			self.rendermaterials();
		}
	} else {
		$('.taskMaterials').remove();
		$('.bigbox').remove();
		$('.taskdatalog').css('height', '125px');
		$('.tasklog').css('margin', '23px 0');
		$('.metalogpro').css({
			'height': '424px',
			'padding': '47px 8px',
			'margin-top': '33px'
		});
		$('.metalog-box').css('height', '548px');
		$('.metalog-start').css({
			'width': '456px',
			'height': '43px'
		});
		$('.metalog-img').css({
			'width': '456px',
			'height': '55px'
		});
		$('.tasklogpro').removeClass('tasklogdone tasklognotdone').addClass('tasklognotdone')
	}
	self.rendertopicback();
};
//渲染素材时间轴
EditApp.prototype.rendermaterials = function() {
	var self = this;
	var materialdata = self.taskdata[0].Materials;
	console.log(materialdata);
	var topdata = [];
	var bottomdata = [];
	$('.taskmaterial-up').empty().css('width', (materialdata.length / 2 + 1) * 220)
	$('.taskmaterial-down').empty().css('width', (materialdata.length / 2 + 1) * 220)
	$(materialdata).each(function(i) {
		if(i % 2 == 0) {
			topdata.push(materialdata[i]);
		} else if(i % 2 == 1) {
			bottomdata.push(materialdata[i])
		}
	})

	//上半部分
	var upupdate = d3.select('.taskmaterial-up').selectAll('div').data(topdata);
	var enter = upupdate.enter();
	var exit = upupdate.exit();

	exit.remove();
	enter.append('div').each(function(d, i) {
		var $this = $(this);
		d3.select(this).classed('materialbox', true)
			.append('div').classed('localtime-up', true)
		d3.select(this).append('div').classed('localrect-up', true)
		d3.select(this).append('p').classed('mater-time-up', true).text(d.CRTIME.slice(6));
		d3.select(this).append('div').classed('mater-details-up', true)

		if(d.MATERIALTYPE == 1) {
			d3.select(this).select('.mater-details-up').append('p').classed('mater-p', true).text(d.MATERIALAPPFILE)
		} else if(d.MATERIALTYPE == 2) {
			d3.select(this).select('.mater-details-up').style({
					"width": "127px",
					"height": "82px",
					"left": "25px"
				})
				.append('img').classed('mater-img', true).attr('src', d.MATERIALAPPFILE)
		} else if(d.MATERIALTYPE == 3) {
			d3.select(this).select('.mater-details-up').style({
					"width": "200px",
					"height": "56px"
				})
				.append('audio').attr({
					"src": self.getmediaurl(d.MATERIALAPPFILE),
					"id": "audio" + d.MATERIALAPPFILE
				})
			var audiodata = d;
			var audiodom = doT.template($("#audiotmp").text())
			$this.append(audiodom(audiodata))
			self.clickaudio(d.MATERIALAPPFILE);
		} else if(d.MATERIALTYPE == 4) {
			var videosrc = self.getmediaurl(d.MATERIALAPPFILE)
			d3.select(this).select('.mater-details-up').style({
					"width": "127px",
					"height": "82px",
					"left": "25px"
				})
				.append('video')
				.attr({
					"src": videosrc,
					"width": "120px",
					"height": "82px",
					"preload": "auto"
				})
			d3.select(this).select('.mater-details-up').append('div').classed('playcover', true)
				.append('img').attr('src', "img/icon-play.png").classed('play-img', true)
			d3.select(this).select('.playcover').on('click', function(d) {
				var src = videosrc;
				var reportid = d.MATERIALAPPENDIXID
				var date = new Date();
				var datetime = date.getTime()
				self.clickvideo(src, reportid + datetime)
			})
		}
	})

	//下半部分
	var downupdate = d3.select('.taskmaterial-down').selectAll('div').data(bottomdata);
	var enter = downupdate.enter();
	var exit = downupdate.exit();

	exit.remove();
	enter.append('div').each(function(d, i) {
		var $this = $(this);
		d3.select(this).classed('materialbox', true)
			.append('div').classed('localtime-down', true)
		d3.select(this).append('div').classed('localrect-down', true)
		d3.select(this).append('p').classed('mater-time-down', true).text(d.CRTIME.slice(6));
		d3.select(this).append('div').classed('mater-details-down', true)
		if(d.MATERIALTYPE == 1) {
			d3.select(this).select('.mater-details-down').append('p').classed('mater-p', true).text(d.MATERIALAPPFILE)
		} else if(d.MATERIALTYPE == 2) {
			d3.select(this).select('.mater-details-down').style({
					"width": "127px",
					"height": "82px",
					"left": "25px"
				})
				.append('img').classed('mater-img', true).attr('src', d.MATERIALAPPFILE)
		} else if(d.MATERIALTYPE == 3) {
			d3.select(this).select('.mater-details-up').style({
					"width": "200px",
					"height": "56px"
				})
				.append('audio').attr({
					"src": self.getmediaurl(d.MATERIALAPPFILE),
					"id": "audio" + d.MATERIALAPPFILE
				})
			var audiodata = d;
			var audiodom = doT.template($("#audiotmp").text())
			$this.append(audiodom(audiodata))
			self.clickaudio(d.MATERIALAPPFILE);
		} else if(d.MATERIALTYPE == 4) {
			var videosrc = self.getmediaurl(d.MATERIALAPPFILE)
			d3.select(this).select('.mater-details-down').style({
					"width": "127px",
					"height": "82px",
					"left": "25px"
				})
				.append('video')
				.attr({
					"src": videosrc,
					"width": "120px",
					"height": "82px",
					"preload": "auto"
				})
			d3.select(this).select('.mater-details-down').append('div').classed('playcover', true)
				.append('img').attr('src', "img/icon-play.png").classed('play-img', true)
			d3.select(this).select('.playcover').on('click', function(d) {
				var src = videosrc;
				var reportid = d.MATERIALAPPENDIXID
				var date = new Date();
				var datetime = date.getTime()
				self.clickvideo(src, reportid + datetime)
			})
		}
	})
	$('.taskMaterials').niceScroll({
		horizrailenabled: true,
		oneaxismousemode: "auto"
	})

	//图片点击放大
	$('.mater-img').on('click', function() {
		self.materrolltask.stop();
		self.focusNextlist.stop();
		var src = $(this).attr('src')
		d3.select('#bigbox').append('img').classed('big-img', true).attr({
			"src": src,
			"id": "bigimg"
		})
		$('#bigbox').show().animate({
			"width": "602px",
			"height": "325px",
			"left": "0",
			"top": "0"
		}, 600);
		//放大图片点击缩小
		$('#bigimg').on('click', function() {
			$(this).remove();
			$('#bigbox').animate({
				"width": "0",
				"height": "0",
				"left": "301px",
				"top": "162px"
			}, 600, function() {
				$('#bigbox').hide()
				self.materrolltask.start();
				window.clearTimeout(self.clickpause);
				self.focusNextlist.start();
			});
		})
		return false
	})

	if($('.taskmaterial-up').width() > 600) {
		self.materrolltask.start();
	}
};
//素材横向滚动
EditApp.prototype.materroll = function() {
		var self = this;
		var divwidth = $('.taskmaterial-up').width();
		var leftscroll = $('.taskMaterials').scrollLeft();
		if(leftscroll + 602 >= divwidth) {
			$('.taskMaterials').animate({
				scrollLeft: 0
			}, "2000");
			self.rollindex = 0
		} else {

			$('.taskMaterials').animate({
				scrollLeft: self.rollindex * 191
			}, "2000", function() {
				self.rollindex++;
			});
		}
	}
	//素材内视频点击播放
EditApp.prototype.clickvideo = function(src, id) {
		var self = this;
		self.materrolltask.stop();
		self.focusNextlist.stop();
		var $video = "<video  class='video-js vjs-default-skin' width='602px' controls height='325px' autoplay src='" + src + "' id=" + id + ">";
		$("#bigbox").append($video).animate({
			"width": "602px",
			"height": "325px",
			"left": "0",
			"top": "0"
		}, 600)
		videojs(id, {
			ControlBar: {
				FullscreenToggle: false,
				MuteToggle: false
			}
		}, function() {
			this.on('ended', function() {
				$("#" + id).remove();
				$('#bigbox').hide();
				self.materrolltask.start();
				window.clearTimeout(self.clickpause)
				self.focusNextlist.start();
			})

			$('.vjs-tech').on('dblclick', function() {
				$("#" + id).remove();
				$('#bigbox').animate({
					"width": "0",
					"height": "0",
					"left": "301px",
					"top": "162px"
				}, 600, function() {
					$('#bigbox').hide()
					self.materrolltask.start();
					window.clearTimeout(self.clickpause)
					self.focusNextlist.start();
				});
				return false
			})

		})
		$('#bigbox').show();

	}
	//素材内根据ID获取音视频播放地址
EditApp.prototype.getmediaurl = function(id) {
		var params = {
			json: {
				masId: id,
				isLive: "false",
				player: "HTML5"
			}
		}
		var masurl = "/mas/openapi/pages.do?method=prePlay&appKey=TRSWCM4"
		var videourl;
		$.ajax({
			type: "get",
			headers: {
				"formdata": "1",
				"Content-Type": "application/x-www-form-urlencoded"
			},
			url: masurl,
			async: false,
			data: {
				json: JSON.stringify(params.json)
			},
			success: function(data) {
				videourl = JSON.parse(data).streamsMap.l.httpURL
			}
		})
		return videourl;
	}
	//素材内音频点击播放
EditApp.prototype.clickaudio = function(id) {
		var self = this;
		var audio = $('#audio' + id)[0]
		var audioWrapper = $('#' + id)[0];
		var playIcon = $('#default' + id)[0];
		var playingIcon = $('#playing' + id)[0]
		audioWrapper.addEventListener("click", function() {
			play();
		}, false);

		function play() {
			// start audio
			if(audio.paused) {
				audio.play();
				self.materrolltask.stop();
				self.focusNextlist.stop();
				// toggle icons display
				playIcon.style.display = "none";
				playingIcon.style.display = "inline-block";
			} else { // pause audio
				audio.pause();
				self.materrolltask.start();
				window.clearTimeout(self.clickpause)
				self.focusNextlist.start();
				playIcon.style.display = "inline-block";
				playingIcon.style.display = "none";
			}
		}
		audio.addEventListener("ended", function() {
			self.materrolltask.start();
			window.clearTimeout(self.clickpause)
			self.focusNextlist.start();
			playIcon.style.display = "inline-block";
			playingIcon.style.display = "none";
		}, false);
	}
	//渲染选题背景
EditApp.prototype.rendertopicback = function() {
	$('.topic-back').empty();
	var self = this;
	var reportbackground = self.detailsdata.themeOrigin;
	var update = d3.select('.topic-back').selectAll('div').data(reportbackground)
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('div').each(function(d, i) {
		d3.select(this).classed('topic-listbox', true);
		d3.select(this).append('div').classed('topictitle', true).text(d.DOCTITLE);
		d3.select(this).append('p').classed('topic-p', true).text(d.DOCABSTRACT);
		d3.select(this).append('div').classed('topic-bottom', true);
		d3.select(this).select('.topic-bottom')
			.append('span').classed('topic-source', true).text('来源：' + d.ZB_SOURCE_SITE);
		d3.select(this).select('.topic-bottom')
			.append('span').classed('topic-time', true).text(d.PUBTIME);

	})
	$('.topic-p').prepend('<span class="topic-abst">摘要:</span>');

	d3.selectAll('.topic-listbox')
		.each(function() {
			d3.select(this).classed('bluebg', true).append('img')
				.attr('src', 'img/middle-md-up.png').classed("blueborderup", true);
			d3.select(this).append('img')
				.attr('src', 'img/middle-bg-down.png').classed("blueborderdown", true);
			d3.select(this).select('.topic-abst').style('color', '#48dfff');
		});

	$('.topic-back').niceScroll();
};
//渲染右侧曲线图
EditApp.prototype.renderhotcurve = function() {
	var self = this;
	var svg = d3.select('.hotarea svg');
	var hotcurve = self.detailsdata.hotCurve;

	$('.backgroundline').empty();
	$('.linecircle').remove();
	$('.linecircle1').remove();
	var starttime = hotcurve[0];
	var data = hotcurve[1];
	var dayLength = 0;
	var maxValue = 0;
	var matrix = [];
	var keys = [];
	for(var key in data) {
		var subData = data[key].split(';');
		keys.push(key);
		matrix.push(subData);
		dayLength = subData.length;
		subData.forEach(function(d) {
			if(Number(d) > maxValue) {
				maxValue = Number(d);
			}
		})
	}

	var endDate = new Date(starttime);
	var startDate = new Date(endDate.getTime() - dayLength * 24 * 3600 * 1000);

	var section = d3.select('.section-3');

	var xScale = d3.time.scale()
		.domain([0, dayLength - 1])
		.range([0, 525]);

	var yTicks = d3.scale.linear()
		.domain([0, maxValue])
		.ticks(4);

	if(yTicks[yTicks.length - 1] < maxValue && yTicks.length >= 2) {
		var step = yTicks[1] - yTicks[0];
		yTicks.push(yTicks[yTicks.length - 1] + step);
	}

	var yScale = d3.scale.linear()
		.domain([yTicks[0], yTicks[yTicks.length - 1]])
		.range([0, 180]);

	var color = d3.scale.ordinal()
		.range(["#efea38", "#03c878"]);

	/*渲染x-axis start*/
	var xTickScale = d3.time.scale()
		.domain([0, dayLength - 1])
		.range([startDate, endDate]);

	var xTicks = d3.range(0, dayLength).map(function(d, i) {
		return xTickScale(d);
	});

	var xAxis = svg.select('g.x-axis');

	var update = xAxis.selectAll('text').data(xTicks);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append('text');
	update.text(function(d, i) {
			var date = new Date(d);
			return(date.getMonth() + 1) + '月' + date.getDate() + '日';
		})
		.attr({
			x: function(d, i) {
				return xScale(i);
			},
			y: 20,
			'font-size': '14px',
			'stroke': 'none',
			'fill': '#ffffff',
			'text-anchor': 'middle'
		});
	/*渲染x-axis end*/
	//背景网格线
	var grid = svg.select('g.backgroundline').selectAll('.grid')
		.data(xTicks)
	grid.exit().remove();
	grid
		.enter().append('g')
		.attr('class', 'grid');
	grid.append('line')
		.attr('x1', function(d, i) {
			return xScale(i);
		})
		.attr('x2', function(d, i) {
			return xScale(i);
		})
		.attr('y1', -180)
		.attr('y2', 0)
		.attr({
			'stroke': "#6a7577",
			'stroke-width': "1"
		});
	var ygrid = svg.select('g.backgroundline').selectAll('grid')
		.data(yTicks)
		.enter().append('g');
	ygrid.append('line')
		.attr('y1', function(d) {
			return -yScale(d);
		})
		.attr('y2', function(d) {
			return -yScale(d);
		})
		.attr('x1', 0)
		.attr('x2', 525)
		.attr({
			'stroke': "#6a7577",
			'stroke-width': "1"
		});
	/*渲染y-axis start*/
	//      var yAxis = svg.select('g.y-axis');
	//
	//      var update = yAxis.selectAll('text').data(yTicks);
	//      var enter = update.enter();
	//      var exit = update.exit();
	//
	//      exit.remove();
	//      enter.append('text');
	//      update.text(function(d, i) {
	//              return d;
	//          })
	//          .attr({
	//              'y': function(d, i) {
	//                  return -yScale(d)+5;
	//              },
	//              'x': '-10',
	//              'font-size': '14px',
	//              'stroke': 'none',
	//              'fill': '#ffffff',
	//              'text-anchor': 'end'
	//          });
	/*渲染y-axis end*/

	/*渲染line start*/
	var line = d3.svg.line()
		.interpolate('cardinal')
		.x(function(d, i) {
			return xScale(i);
		})
		.y(function(d) {
			return -yScale(Number(d));
		});

	var main = svg.select('g.main');

	var update = main.selectAll('path').data(matrix);
	var enter = update.enter();
	var exit = update.exit();

	exit.remove();
	enter.append("path")
		.attr({
			'fill': 'none',
			'stroke-width': 3,
			'stroke': function(d, i) {
				return color(i);
			},
			'd': function(d) {
				return line(d);
			},
			//'filter':"url(#filter3000)"
		});
	update
		.transition()
		.duration(3000)
		.attr({
			'stroke': function(d, i) {
				return color(i);
			},
			'd': function(d) {
				return line(d);
			}
		});
	/*渲染line end*/

	//打点
	var circle = svg.select('g.main').selectAll('circle')
		.data(matrix[0])
		.enter().append('g')
		.append('circle')
		.attr('class', 'linecircle')
		.attr('cx', line.x())
		.attr('cy', line.y())
		.attr({
			'r': '3.5',
			'fill': function() {
				return color(0);
			},
			'stroke': function() {
				return color(0);
			},
			//"filter":"url(#filter3000)"
		});
	var circle2 = svg.select('g.main').selectAll('circle1')
		.data(matrix[1])
		.enter().append('g')
		.append('circle')
		.attr('class', 'linecircle1')
		.attr('cx', line.x())
		.attr('cy', line.y())
		.attr({
			'r': '3.5',
			'fill': function() {
				return color(1);
			},
			'stroke': function() {
				return color(1);
			},
			//'filter':"url(#filter3000)"
		})
		//打点结束
		//渲染legend
	var nameMap = {
		'media': '媒体',
		'fork': '网民'
	};
	/*渲染legend start*/
	var legendData = keys;
	var legend = d3.select('.hotarea .legend');

	var update = legend.selectAll('.item').data(legendData);
	var enter = update.enter();
	var exit = update.exit();

	enter.append('div').classed('item', true).each(function(d, i) {
		var item = d3.select(this);
		item.append('div').classed('color-lump', true);
		item.append('div').classed('name', true);
	});

	update.each(function(d, i) {
		var item = d3.select(this);
		var colorLump = item.select('div.color-lump');
		var name = item.select('div.name');

		colorLump.style('background-color', color(i));
		name.text(nameMap[d]);
	});
	/*渲染legend end*/
	$('div.item:first').css("margin-right", "198px")

};
//设置图片位置
function falg_img() {
	var font_title = $('.font_title')
	font_text = font_title.text();
	console.log(font_text.length);
}
falg_img()
	//顶端时间更新
EditApp.prototype.gettime = function() {
	window.setInterval(function() {
		var date = new Date();
		var Y = date.getFullYear() + '-';
		var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
		var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
		var h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':';
		var m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
		var s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
		var time = Y + M + D + h + m;
		$('.span-right').html(time);
		var Hour = date.getHours();
		var Min = date.getMinutes();
		if((8 < Hour && Hour < 16) || (Hour == 16 && Min < 31) || (Hour == 8 && Min > 29)) {
			$('.header p').html("晨 间")
		} else
		if((16 < Hour && Hour < 20) || (Hour == 16 && Min > 29) || (Hour == 20 && Min < 31)) {
			$('.header p').html("午 间")
		} else if((20 < Hour && Hour < 24) || (Hour == 20 && Min > 29)) {
			$('.header p').html("晚 间")
		}

	}, 1000)
};

var app = new EditApp();