(function() {
	function App() {
		App.prototype.getReportData();
	};

	App.prototype.getReportData = function() {
		$.get("report.json", function(data) {
			data = JSON.parse(data);
			App.prototype.drewReportList(data);
			App.prototype.getListMessage();
		})
	}
	App.prototype.drewReportList = function(data) {
		var main_left = d3.select('.main_left').selectAll('div').data(data);
		var main_enter = main_left.enter();
		main_enter.append('div').classed('deparment', true).each(function(d, i) {
			d3.select(this).append('div').classed('DTop', true).each(function() {
				d3.select(this).append('div').classed('Tleft', true)
				d3.select(this).append('div').classed('Dname', true).text(d.DEPARTNAME);
				d3.select(this).append('div').classed('Tright', true);
			});
			d3.select(this).append('div').classed('Dmain', true).each(function(d, i) {
				var Dmain = d3.select(this).selectAll('div').data(d.REPORTS_INFO);
				var enter = Dmain.enter();
				enter.append('div').classed('aaaaa', true).each(function(dd, i) {
					d3.select(this).append('div').classed('Dreport', true).text(dd.STATEMENT);
					d3.select(this).append('span').classed('Dmone', true).text(dd.REPORTID)
				})
			});
		})
	}
	App.prototype.getListMessage = function() {
			var self = this;
			var reportList = $('.aaaaa');
			var listLenth = reportList.length;
			var n = 0;
			self.startSet = function() {
				if(n < listLenth) {
					$('.aaaaa').children().css({'color':'white'});
					var ele = reportList[n];
					App.prototype.getReportMessage($(ele));
					App.prototype.getTraceData($(ele));
					App.prototype.getTaskData($(ele));
					n++;
				}else {
					n = 0;
				}
			}
			window.setine = window.setInterval(self.startSet, 60000);
			window.startAgain = function() {
				window.setine = window.setInterval(self.startSet, 60000);
			}
		}
		//获取精重敏急等信息
	App.prototype.getReportMessage = function(ele) {
			var elelength = $(ele).children().length;
			$(ele).children('.Dreport').css({
				'color': 'yellow'
			});
			var eleValue = $(ele).children().last();
			var retoptId = $(eleValue).text();
			$.get('/screen/pretheme/reportmessage', {
				report_id: retoptId
			}, function(data) {
				var data = JSON.parse(data);
				var reportDetailJson = data.reportDetailJson;
				reportDetailJson = JSON.parse(reportDetailJson);
				var flag = reportDetailJson.FLAG;
				var flagicon1 = "<img class='Dreport_img' src='img/flag-1.png'>";
				var flagicon2 = "<img class='Dreport_img' src='img/flag-2.png'>";
				var flagicon3 = "<img class='Dreport_img' src='img/flag-3.png'>";
				var flagicon4 = "<img class='Dreport_img' src='img/flag-4.png'>";
				if(elelength > 2) {
					return;
				} else {
					if(flag == 1) {
						$(ele).children().first().before(flagicon1)
					}
					if(flag == 2) {
						$(ele).children().first().before(flagicon2)
					}
					if(flag == 3) {
						$(ele).children().first().before(flagicon3)
					}
					if(flag == 4) {
						$(ele).children().first().before(flagicon4)
					}
				}

			})
		}
		//获取任务追踪信息
	App.prototype.getTaskData = function(ele) {
			var self = this;
			var eleValue = $(ele).children().last();
			var retoptId = $(eleValue).text();
			$.get('/screen/pretheme/reporttask', {
				report_id: retoptId
			}, function(data) {
				$("#MR4").addClass('Dmone');
				$("#MR3").addClass('Dmone');
				$("#MR2").addClass('Dmone');
				$('#MR1').addClass('Dmone');
				$("#MR0").addClass('Dmone');
				var data = JSON.parse(data);
				window.data1 = data;
				App.prototype.drawSource(data);
				if($.isEmptyObject(data) == true) {
					$("#MR0").removeClass('Dmone');
				} else {
					var task_got = data.PlanTaskLogs[0].TASKUSER;
					var create_name = data.PlanTaskLogs[0].CRUSER;
					$('.task_got').text(task_got);
					$('.create_name').text(create_name);
					var PlanTaskLogs = data.PlanTaskLogs;
					var Materials = data.Materials;
					//任务追踪开始
					var Planstatus = [];
					$.each(PlanTaskLogs, function(i) {
						Planstatus.push(PlanTaskLogs[i].OPERSTATUS)
					});

					if(Materials.length == 0) {
						$("#MR0").removeClass('Dmone');
						if(Planstatus.indexOf('10') != -1) {
							$("#MR0").addClass('Dmone');
							$("#MR4").addClass('Dmone');
							$("#MR3").addClass('Dmone');
							$("#MR2").addClass('Dmone');
							$('#MR1').removeClass('Dmone');
						}
						if(Planstatus.indexOf('1') != -1) {
							$("#MR0").addClass('Dmone');
							$("#MR4").addClass('Dmone');
							$("#MR3").addClass('Dmone');
							$("#MR1").addClass('Dmone');
							$('#MR2').removeClass('Dmone');
						}
						if(Planstatus.indexOf('11') != -1) {
							$("#MR0").addClass('Dmone');
							$("#MR4").addClass('Dmone');
							$("#MR2").addClass('Dmone');
							$("#MR1").addClass('Dmone');
							$('#MR3').removeClass('Dmone');
						}
					} else {
						$("#MR3").addClass('Dmone');
						$("#MR2").addClass('Dmone');
						$("#MR1").addClass('Dmone');
						$('#MR4').removeClass('Dmone');

					}
				}

			})
		}
		//绘制回传素材
	App.prototype.drawSource = function(data) {
			var Materials = data.Materials;
			var Rmain = $('.Rmain');
			Rmain.empty();
			if($.isEmptyObject(Materials) == false) {
				var text = '<div class="back_m"></div><div class="Rmain_back"></div>'
				Rmain.append(text);
				//遍历回传素材数组
				var left = true; //定义左右开关门
				$.each(Materials, function(d, i) {
						left = !left;
						if(i.MATERIALTYPE == 1) {
							TextSource(i, left, 450, 'Rmain_back');
						}
						if(i.MATERIALTYPE == 2) {
							pictureSource(i, left, 0, 'Rmain_back');
						}
						if(i.MATERIALTYPE == 3) {
							audioSource(i, true, 650, 'Rmain_back');
						}
						if(i.MATERIALTYPE == 4) {
							VideoSource(i, left, 650, 'Rmain_back')
						}
					})
					//判断素材种类

			} else {
				var report_back = '<div class="report_back"><div class="none_back"></div><span  class="none_text">暂无回传素材</span></div>';
				Rmain.append(report_back);
			}
			//		})
		}
		//任务追踪
	App.prototype.getTraceData = function(ele) {
			var eleValue = $(ele).children().last();
			var retoptId = $(eleValue).text();
			$.get('/screen/pretheme/reporttrace', {
				report_id: retoptId
			}, function(data) {
				var data = JSON.parse(data);
				var metalogdata = data.Data;
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
						var metastatusObj = {};
						//	metastatusObj.status = metalogdata[i].OPERATION;
						//	metastatusObj.name = metalogdata[i].USERNAME;
						metastatus.push(metalogdata[i].OPERATION);
						//metastatus.push(metastatusObj)
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
					if(metastatus.indexOf("撤稿") != -1 || metastatus.indexOf("取消签发") != -1) {
						$('.metalog-start').attr('src', 'img/metalog-start.png');
						$('.metalog-process:eq(2)').attr('src', 'img/metalog-pro.png');
						$('.metalog-process:eq(3)').attr('src', 'img/metalog-notpro.png');
						$('.metalog-process:eq(4)').attr('src', 'img/metalog-notpro.png');
					}
					if(metastatus.indexOf("取稿") != -1 || metastatus.indexOf("待编") != -1) {
						$('.metalog-start').attr('src', 'img/metalog-start.png')
						$('.metalog-process:eq(2)').attr('src', 'img/metalog-pro.png');
					}
					if(metastatus.indexOf("传稿") != -1 || metastatus.indexOf("提交") != -1) {
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
			})
		}
		//视频素材
	var b = 0;
	function VideoSource(data, flag, videoPosition, Rmain_back) {
		var Rmain_back = $('.' + Rmain_back);
		b++;
		var Id = data.MATERIALAPPFILE;
		var videoId = 'video_'+b;
		var videoUrl = getmediaurl(Id);
		if(flag) {
			var text = "<div class='video_class'><div class='video_source'><div class='video_time'>7-11 11:45</div><div class=''></div><video id="+videoId+" class='video_video'><source src="+videoUrl+"></source></video></div><div class='video_line'></div><div class='source_circle'></div><div class='report_author'>宁帅臣</div></div>"
			Rmain_back.append(text);
			$('.video_class').css({
				top: videoPosition
			});
		} else {
			var text = "<div class='video_class1'><div class='report_author1'>宁帅臣</div><div class='source_circle1'></div><div class='video_line1'></div><div class='video_source1'><div class='video_time1'>7-11 11:45</div><div class=''></div><video id="+videoId+" class='video_video1'><source src="+videoUrl+"></source></video></div></div>"
			Rmain_back.append(text);
			$('.video_class1').css({
				top: videoPosition
			});
		}
		VideoSourceClick(videoId,flag);
	}

	function VideoSourceClick(ele, flag) {
		//var ele = $("#"+ele);
		$("#"+ele).bind('click', function() {
			if(flag) {
				if(ele.paused) {
					window.startAgain();
					ele.css('width', '600px').css('height', '500px').css('position', 'relative').css('margin-left', '-10px').css('margin-top', '-100px');
					ele.play();
				} else {
					clearInterval(window.setine);
					ele.pause();
					ele.css('width', '150px').css('height', '124px').css('position', '').css('margin-left', '10px').css('margin-top', '0px');
				}
			} else {
				if($("#"+ele).hasClass('pause')) {
					window.startAgain();
					$("#"+ele).removeClass('pause');
					$("#"+ele).css('width', '600px').css('height', '500px').css('position', 'relative').css('margin-left', '-375px').css('margin-top', '-100px');
					$("#"+ele).trigger('play')
				} else {
					clearInterval(window.setine);
					$("#"+ele).addClass('pause')
					$("#"+ele).trigger('pause');
					$("#"+ele).css('width', '150px').css('height', '124px').css('position', '').css('margin-left', '10px').css('margin-top', '0px');
				}
			}

		})
	}
	//音频素材
		//设置播放条
	function audio_play(eleb,elec){
				var b = $("#"+eleb);
				var Audio = b[0];
				var time = Audio.duration;
				if(Audio.paused) {
					window.startAgain();
					Audio.play();
					var timer = setInterval(currentpage, 50);
				} else {
					clearInterval(window.setine);
					Audio.pause();
					$("#"+elec).css('width',0);
					var timer = setInterval(currentpage, 50);
				}

				function currentpage(){
					var percentage = (Audio.currentTime * 100 / Audio.duration) + '%';
					if(percentage == "NaN%") {
						percentage = 0 + '%';
					}
					var styles = {
						"width": percentage,
					};
					$("#"+elec).css(styles);
				}

			}
	
	
	var c = 0
	function audioSource(data, flag, videoPosition, Rmain_back) {
		var data_ctime = data.CRTIME.substring(5, 20);
		var Rmain_back = $('.' + Rmain_back);
		var audioId = data.MATERIALAPPFILE;
		var audioUrl = getmediaurl(audioId);
		c++;
		var AudioIdb = 'AudioIdb'+n;
		var AudioIdc = 'AudioIdc'+n;
		if(flag) {
			var text = "<div class='autio_class1'><div class='autio_source1'><div class='autio_time1'>" + data_ctime + "</div><div class='autio_autio1'>";
			var text1 = '<div id="audio_a" class="audio_a"><audio id='+AudioIdb+' class="audio_b" controls src='+audioUrl+'></audio><div class="audio_logo"></div><div class="audio_content"></div><div id='+AudioIdc+' class="audio_c"></div></div>'
			var text2 ="</div></div><div class='autio_line1'></div><div class='autio_circle1'></div><div class='autio_report1'>" + data.CRUSER + "</div></div></div>"
			var alltext = text + text1+text2;
			Rmain_back.append(alltext);
		} else {
			var text = "<div class='autio_class'><div class='autio_report'>" + data.CRUSER + "</div><div class='autio_circle'></div><div class='autio_line'></div><div class='autio_source'><div class='autio_time'>" + data_ctime + "</div><div class='autio_autio'>"
			var text1 = '<div id="audio_a" class="audio_a"><audio id='+AudioIdb+' class="audio_b" controls src='+audioUrl+'></audio><div class="audio_logo"></div><div class="audio_content"></div><div id='+AudioIdc+' class="audio_c"></div></div>'
			var text2 = "</div></div></div>"
			var alltext = text+text1+text2;
			Rmain_back.append(alltext);
		}
		$(".audio_logo").on('click',function(){
			audio_play(AudioIdb,AudioIdc);
		})

	}


	function getmediaurl(id){
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
	//图片素材
	var n = 0

	function pictureSource(data, flag, d, Rmain_back) {
		var Rmain_back = $('.' + Rmain_back);
		var data_ctime = data.CRTIME.substring(5, 20);
		var img_src = data.MATERIALAPPFILE;
		n++;
		if(n < 4) {
			n++
		} else {
			n = 1;
		}
		var nub = 'img_' + n;

		if(flag) {
			var text = "<div class='img_class'><div class='img_source'><div class='img_time'>" + data_ctime + "</div><div class=''></div><div class='img_video'><img class='img_sou' id=" + nub + "  src=" + img_src + "></div></div><div class='img_line'></div><div class='img_circle'></div><div class='img_author'>" + data.CRUSER + "</div></div>"
			Rmain_back.append(text);
		} else {
			var text = "<div class='img_class1'><div class='img_author1'>" + data.CRUSER + "</div><div class='img_circle1'></div><div class='img_line1'></div><div class='img_source1'><div class='img_time1'>" + data_ctime + "</div><div class='img_video1'><img class='img_sou1' id=" + nub + " src=" + img_src + "></div></div></div>"
			Rmain_back.append(text);
		}
		pictureSourceClick(nub, flag, true);
	}

	function pictureSourceClick(ele, flag, big) {

		var ele = $('#' + ele);
		ele.on('click', function() {
			if(flag) {
				if(big) {
					clearInterval(window.setine)
					ele.css({
						'width': '600px',
						'height': '500px',
						'position': 'relative',
						'margin-left': '0px',
						'margin-top': '-10px'
					})
					big = !big;
				} else {
					ele.css({
						'margin-left': '10px',
						'margin-top': '0px',
						'width': '155px',
						'position': '',
						'height': '110px',
					})

					window.startAgain();
					big = !big;
				}
			} else {
				if(big) {
					clearInterval(window.setine)
					ele.css({
						'width': '600px',
						'height': '500px',
						'position': 'relative',
						'margin-left': '-380px',
						'margin-top': '-10px'
					})
					big = !big;
				} else {
					ele.css({
						'margin-left': '5px',
						'margin-top': '7px',
						'width': '155px',
						'position': '',
						'height': '110px',
					})
					window.startAgain();
					big = !big;
				}
			}

		})

	}
	//文字素材
	var b = 0;

	function TextSource(data, flag, videoPosition, Rmain_back) {
		var data_ctime = data.CRTIME.substring(5, 20);
		var Rmain_back = $('.' + Rmain_back);
		if(b < 5) {
			b++;
		} else {
			b = 1;
		}
		var textid = "text_" + b;

		var text_short_title = data.MATERIALAPPFILE.substring(0, 30);
		if(flag) {
			var text = "<div class='text_class1'><div class='text_source1'><div class='text_time1'>" + data_ctime + "</div><div class='text_content1' id=" + textid + ">" + text_short_title + "</div></div><div class='text_line1'></div><div class='text_circle1'></div><div class='text_report1'>" + data.CRUSER + "</div></div>";
			Rmain_back.append(text);

		} else {
			var text = "<div class='text_class'><div class='text_report'>" + data.CRUSER + "</div><div class='text_circle'></div><div class='text_line'></div><div class='text_source'><div class='text_time'>" + data_ctime + "</div><div class='text_content' id=" + textid + ">" + text_short_title + "</div></div></div>"
			Rmain_back.append(text);
		}
		TextSourceClick(textid, 'Rmain_back', data);
	}

	function TextSourceClick(ele, Rmain_back, data) {
		var ele = $('#' + ele);
		var Rmain_back = $('.' + Rmain_back);
		var text = "<div class='textsou_details'><div class='text_details'>" + data.MATERIALAPPFILE + "</div><div class='text_mark'></div></div>";
		ele.on('click', function() {
			clearInterval(window.setine);
			$('.Rmain_back').empty();
			$('.back_m').css('display', 'none');
			Rmain_back.append(text);
			TextDetailsClick(window.data1);
		})

	}

	function TextDetailsClick(data) {
		var textsou_details = $('.textsou_details');
		textsou_details.click(function() {
			$('.Rmain_back').empty();
			App.prototype.drawSource(data);
			window.startAgain();
		})
	}
	//获取当前时间
	function getnowtime() {
		var nowtime = new Date();
		var year = nowtime.getFullYear();
		var month = padleft0(nowtime.getMonth() + 1);
		var day = padleft0(nowtime.getDate());
		var hour = padleft0(nowtime.getHours());
		var minute = padleft0(nowtime.getMinutes());
		// var second = padleft0(nowtime.getSeconds());  
		// var millisecond = nowtime.getMilliseconds(); millisecond = millisecond.toString().length == 1 ? "00" + millisecond : millisecond.toString().length == 2 ? "0" + millisecond : millisecond;  
		return year + "-" + month + "-" + day + " " + hour + ":" + minute;
	}

	function padleft0(obj) {
		return obj.toString().replace(/^[0-9]{1}$/, "0" + obj);
	}
	$('.current_time').text(getnowtime())
	var app = new App();
})()