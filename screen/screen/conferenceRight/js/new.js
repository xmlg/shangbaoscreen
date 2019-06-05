//集团昨日原创稿件传播力分析
// var selectedRecordIndex=0;
function renderList() {
	$.get('./sortData.json',function(data){
		console.log(data);
		sortData=data;
		var createTable = [];
	    for (var i = 0; i < 5; i++) {
	        var d = sortData[i];
	        if (i === selectedRecordIndex) {
	            createTable.push('<tr class="active">');
	        } else {
	            createTable.push('<tr>');
	        }
	        createTable.push('    <td>' + (i + 1) + '</td>');
	        createTable.push('    <td class="tdleft"><div class="titles">' + d.name + '</div></td>');
	        createTable.push('    <td>' + d.time + '</td>');
	        createTable.push('    <td>' + d.value + '</td>');
	        createTable.push('</tr>');
	    };
	    $('#js_listboxcontent2').html(createTable.join(""));


	    //显示详情
	    var selectData = sortData[selectedRecordIndex];
	    $('.main-right2 h2').text(selectData.name);
	    var mediaNum = (function() {
	        if (selectData.inMedias !== undefined) {
	            var num = 0;
	            for (var i = 0; i < selectData.inMedias.length; i++) {
	                var mediaName = selectData.inMedias[i].mediaName;
	                if (mediaName !== selectData.mediaName) num++;
	            }
	            return num + 1;
	        } else {
	            return 1;
	        }
	    })();
	    var isMoreThanOne = mediaNum === 1 ? "" : "等" + mediaNum + "家媒体";
	    $('.department').text(selectData.mediaName + isMoreThanOne);

	    $('.author').text(selectData.author);

	    $('.exCoreMedias').text(selectData.exCoreMedias);
	    $('.exLv1Medias').text(selectData.exLv1Medias);
	    $('.exLv2Medias').text(selectData.exLv2Medias);

	    var createList=[];
	    for (var j = 0; j < selectData.coreMedia.length; j++) {
	    	createList.push('<div class="item">'+selectData.coreMedia[j]+'</div>');
	    }
	    $('.core-list-body').html(createList.join(""));

	    // var update = $('.core-list-body').selectAll('div.item').data(selectData.coreMedia);
	    // var enter = update.enter();
	    // var exit = update.exit();

	    // exit.remove();
	    // enter.append('div').classed('item', true);
	    // update.text(function(d) {
	    //     return d
	    // });
	});
}
renderList();
var interval = window.setInterval(function() {
		renderList();
},1500);

var selectedRecordIndex=0;
function selected(){
	if (selectedRecordIndex<4) {
		++selectedRecordIndex;
	}else{
		selectedRecordIndex=0;
	}
	return selectedRecordIndex;
}
var interval2 = window.setInterval(function() {
		selected();
},1500);


function renderNews() {
	$.get('./reportNew.json',function(data){
		console.log(data);
		dataNews=data;
	    var newsArr = [];
	    for (var i = 0; i < dataNews.length; i++) {
	        var item = dataNews[i];
	        newsArr.push('<div class="listbox">');
	        newsArr.push('    <div class="listheader" z-index="99">');
	        newsArr.push('        <div class="font_title">' + item.DEPARTNAME + '</div><img src="img/middle-title-left.png" class="headertitle-left"><img src="img/middle-title-right.png" class="headertitle-right"></div>');
	        newsArr.push('    <div class="listboxcontent yellowbg">');
	        for (var j = 0; j < item.REPORTS_INFO.length; j++) {
	            var news = item.REPORTS_INFO[j];
	            newsArr.push('        <div class="reporttitle list-border-bottom" id="0" reportid="' + news.REPORTID + '">');
	            var classStr = "";
	            /*reportidLists[self.reportidListIndex++] = news.REPORTID;*/
	            if (activeIndex === news.REPORTID) {
	                // if (j == 0) {
	                //     var root = $("#js_reportlist").find(".active").closest('.listbox');
	                //     if (root != null && 0 != self.newsRecordIndex) {
	                //         var scrollt = 60 * self.newsRecordIndex;
	                //         self.scroll += root.height();
	                //         $('#js_reportlist').animate({ scrollTop: self.scroll }, 700);
	                //     }
	                // }
	                
	                classStr = ' class="active"';
	                var titarr = [];
				    titarr.push('<div class="details-content-title" id="details-title">');
				    // titarr.push('    <img class="flagicon2" src="img2/bmx_3.png">');

				    if (news.FLAG == 0) {
				        titarr.push('    <img class="flagicon3" src="img2/bmx_4.png">');
				    } else if (news.FLAG == 1) {
				        titarr.push('    <img class="flagicon2" src="img2/bmx_5.png">');
				    } else if (news.FLAG == 2) {
				        titarr.push('    <img class="flagicon2" src="img2/bmx_6.png">');
				    } else if (news.FLAG == 3) {
				        titarr.push('    <img class="flagicon2" src="img2/bmx_7.png">');
				    }

				    titarr.push('    <p class="tit1">' + news.STATEMENT + '</p>');
				    titarr.push('</div>');
				    $("#js_details-box").find("#details-title").html(titarr.join(""));
	                $("#js_details-box").find(".details-content").html(news.content);

	                //展示报题详情
	                //showDetail(news, self);

	                //展示素材列表
	                //showSucaiList(news, self);

	            }

	            if (news.FLAG == 0) {
	                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_4.png" class="flagicon">');
	            } else if (news.FLAG == 1) {
	                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_5.png" class="flagicon">');
	            } else if (news.FLAG == 2) {
	                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_6.png" class="flagicon">');
	            } else if (news.FLAG == 3) {
	                newsArr.push('            <p ' + classStr + '>' + news.STATEMENT + '</p><img src="img2/bmx_7.png" class="flagicon">');
	            }
	            newsArr.push('        </div>');
	            //activeIndex++;
	            // if (self.newsRecordIndex == 0) {
	            //     this.newsIndex++;
	            // }

	        };
	        newsArr.push('        <img src="img2/bmx_8.png" style="width:97%" class="blueborderup">');
	        newsArr.push('        <img src="img2/bmx_10.png" style="width:97%" class="blueborderdown">');
	        newsArr.push('    </div>');
	        newsArr.push('</div>');

	     //    var titarr = [];
		    // titarr.push('<div class="details-content-title" id="details-title">');
		    // // titarr.push('    <img class="flagicon2" src="img2/bmx_3.png">');

		    // if (news.FLAG == 0) {
		    //     titarr.push('    <img class="flagicon3" src="img2/bmx_4.png">');
		    // } else if (news.FLAG == 1) {
		    //     titarr.push('    <img class="flagicon2" src="img2/bmx_5.png">');
		    // } else if (news.FLAG == 2) {
		    //     titarr.push('    <img class="flagicon2" src="img2/bmx_6.png">');
		    // } else if (news.FLAG == 3) {
		    //     titarr.push('    <img class="flagicon2" src="img2/bmx_7.png">');
		    // }

		    // titarr.push('    <p class="tit1">' + news.STATEMENT + '</p>');
		    // titarr.push('</div>');
		    // $("#js_details-box").find("#details-title").html(titarr.join(""));
		    // $("#js_details-box").find(".details-content").html(news.content);
		    //var content = news.SELECTEDCONTENT !== "" ? news.SELECTEDCONTENT : news.CONTENT;
		    //var retoptId = news.REPORTID;
		    // $.get('/screen/pretheme/onlyReportMessage', { //获取详细内容
		    //     report_id: retoptId
		    // }, function(data) {
		    //     //精敏重急
		    //     data = JSON.parse(data);
		    //     var reportDetailJson = data;
		    //     var flag = reportDetailJson.FLAG;
		    //     var content = reportDetailJson.SELECTEDCONTENT !== "" ? reportDetailJson.SELECTEDCONTENT : reportDetailJson.CONTENT;
		    //     var addContent = reportDetailJson.report_repliesinfo[0] === undefined ? "" : (function() {
		    //         var tempAddContent = "";
		    //         for (var i = 0; i < reportDetailJson.report_repliesinfo.length; i++) {
		    //             if (reportDetailJson.report_repliesinfo[i].VALUE !== undefined && reportDetailJson.report_repliesinfo[i].VALUE !== "") {
		    //                 tempAddContent += "<p>" + reportDetailJson.report_repliesinfo[i].VALUE + "</p><br/>";
		    //             }
		    //         }
		    //         return tempAddContent;
		    //     })();
		    //     if (addContent !== "") {
		    //         content += "<br/><br/><br/><p>补充内容：</p>" + addContent;
		    //     }
		    //     content = content === undefined ? "" : content.replace(/style="[^"]*"/g, "").replace(/<h1/g, "<p").replace(/\/h1>/g, "/p>").replace(/size="[^"]*"/g, "").replace(/class="[^"]*"/g, "");
		    //     $("#js_details-box").find(".details-content").html(content);
		    // });


	    };
	    /*self.reportidList = reportidLists;*/
	    $('#js_reportlist').html(newsArr.join(""));
	    $('#js_Rmain_back').html("<img src='img2/sucai.png' class='bmx_no' />");
	    // if (0 == self.newsRecordIndex) {
	    //     $('#js_reportlist').animate({ scrollTop: 0 }, 700);
	    //     self.scroll = 0;
	    // }
	    // if (self.dataNews.length == undefined) {
	    //     //this.reportlist.html("");

	    //     self.detailsBox.find("#details-title").html("");
	    //     self.detailsBox.find(".details-content").html("");

	    //     js_Rmain_back.html("");
	    // }
	    

	    
	});
}
renderNews();
var interval3 = window.setInterval(function() {
		renderNews();
},1500);

var activeIndex=0;
function selected2(){
	if (activeIndex<14) {
		++activeIndex;
	}else{
		activeIndex=0;
	}
	return activeIndex;
}
var interval4 = window.setInterval(function() {
		selected2();
},1500);
