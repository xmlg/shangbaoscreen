function App() {
    var self = this;
    this.radarG = d3.select('.radar-map svg g.radar');
    this.relationG = d3.select('.relation-map g');
    this.selectedRecordIndex = 0;
    this.dataAreaIndex = 2;
    this.newsRecordIndex = 0;
     this.newsIndex = 0;
    this.listboxcontent2 = $("#js_listboxcontent2");
    this.allData = [];
    this.allDataNews = [];
    this.requestData();
    this.requestNews();
    this.startTimingTask();
    this.reportlist = $("#js_reportlist");
    this.detailsBox = $("#js_details-box");
    this.scroll = 0;
}

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestData();
    }, 150 * 1000);

    var interval = window.setInterval(function() {
        self.selectedRecordIndex++;
        if(self.selectedRecordIndex >= 5) {
            self.selectedRecordIndex = 0;
            self.dataAreaIndex++;
            if(self.dataAreaIndex >= self.allData.length) {
                self.dataAreaIndex = 0;
            }
        }
        self.render();
    }, 5 * 1000);

    var interval2 = window.setInterval(function() {
        self.newsRecordIndex++;
        if(self.newsRecordIndex >= self.newsIndex) {
            self.newsRecordIndex = 0;
            self.newsIndex = 0;
            self.requestNews();
            $('#js_reportlist').scrollTop(0);
            this.scroll = 0;
        }else{
            self.renderNews();
            
        }
        
    }, 12 * 1000);

}

App.prototype.requestData = function() {
    var self = this;
	// var url = 'js/zuorigaojian.txt'
    var url = serverDomain + '/screen/manuscript/yesterdayoriginal';
    d3.json(url, function(error, data) {
        if(error) {
            return;
        }
        console.log(data);

        var dataArea1 = null;
        var dataArea3 = null;
        var dataArea7 = null;

        data.Records.forEach(function(d, i) {
            if(d.timeArea === 1) {
                dataArea1 = formatData(d.data);
            } else if(d.timeArea === 3) {
                dataArea3 = formatData(d.data);
            } else if(d.timeArea === 7) {
                dataArea7 = formatData(d.data);
            }
        });
        self.allData = [dataArea1, dataArea3,dataArea7];
        self.render();
    });


    function formatData(data) {
        var result = data.map(function(d, i) {
            var dd = {};
            dd.name = d.title;
            dd.time = d3.time.format('%H:%M:%S')(new Date(d.pubTime));
            dd.radarValues = [d.contribOfRead, d.contribOfInteract, d.contribOfReprint];
            dd.value = ~~Number(d.ceiIndex);
            dd.children = [];

            dd.coreMedia = [];
            dd.author = d.author;
            dd.department = d.department;

            dd.exCoreMedias = d.exCoreMedias;
            dd.exLv1Medias = d.exLv1Medias;
            dd.exLv2Medias = d.exLv2Medias;

            var allMedias = [].concat(d.exmedias);

            var set = {};
            allMedias.forEach(function(d, i) {
                if(d.mediaLevel === '核心' && dd.coreMedia.indexOf(d.mediaName) < 0) {
                    dd.coreMedia.push(d.mediaName);
                }
                var node = {
                    name: d.mediaName,
                    parent: d.srcname && d.srcname !== '' ? d.srcname : null,
                    children: []
                };
                set[d.mediaName] = node;
            });
            allMedias.forEach(function(d, i) {
                if(d.srcname && d.srcname !== '' && !set[d.srcname]) {
                    set[d.srcname] = {
                        name: d.srcname,
                        children: []
                    };
                }
            });
            var setArr = [];
            for(key in set) {
                setArr.push(set[key]);
            }

            var children = setArr.filter(function(d) {
                return !d.parent;
            });

            setArr.forEach(function(d, i) {
                if(d.parent) {
                    set[d.parent].children.push(d);
                }
            });
            dd.children = children;
            return dd;
        });
        return result;
    }

}

App.prototype.render = function() {
    var self = this;
    self.data = self.allData[0];
    this.renderTitle();
    this.renderList();
    this.renderRadarMap();
    this.renderRelationMap();
    this.renderInfo();
}

App.prototype.renderNews = function() {
    var self = this;
    self.dataNews = self.allDataNews;
    var newsArr = [];
    var activeIndex = 0;
    for (var i = 0; i < self.dataNews.length; i++) {
        var item = self.dataNews[i];
        newsArr.push('<div class="listbox">');
        newsArr.push('    <div class="listheader" z-index="99">');
        newsArr.push('        <div class="font_title">'+item.DEPARTNAME+'</div><img src="img/middle-title-left.png" class="headertitle-left"><img src="img/middle-title-right.png" class="headertitle-right"></div>');
        newsArr.push('    <div class="listboxcontent yellowbg">');
        for (var j = 0; j < item.REPORTS_INFO.length; j++) {
            var news = item.REPORTS_INFO[j];
            newsArr.push('        <div class="reporttitle list-border-bottom" id="0" reportid="466">');
            var classStr = "";
            
            if(activeIndex === self.newsRecordIndex) {
                if(j==0){
                    console.log('第一条');
                    var root = $("#js_reportlist").find(".active").closest('.listbox');
                    if(root!=null){
                        var scrollt = 60*self.newsRecordIndex;
                        self.scroll +=root.width();
                        $('#js_reportlist').animate({ scrollTop: self.scroll }, 700);
                    }
                    console.log(self.scroll);
                }
                classStr = ' class="active"';
                var titarr = [];
                titarr.push('<div class="details-content-title" id="details-title">');
                titarr.push('    <img class="flagicon2" src="img2/bmx_3.png">');

                if(news.FLAG == 0){
                    // titarr.push('    <img class="flagicon3" src="img2/bmx_2.png">');
                }else if(news.FLAG == 1){
                    titarr.push('    <img class="flagicon3" src="img2/bmx_5.png">');
                }else if(news.FLAG == 2){
                    titarr.push('    <img class="flagicon3" src="img2/bmx_6.png">');
                }else if(news.FLAG == 3){
                    titarr.push('    <img class="flagicon3" src="img2/bmx_7.png">');
                }

                titarr.push('    <p class="tit1">'+news.STATEMENT+'</p>');
                titarr.push('</div>');
                self.detailsBox.find("#details-title").html(titarr.join(""));
                var content = news.CONTENT;
                content = content === undefined ? "" : content.replace(/style="[^"]*"/g, "").replace(/<h1/g, "<p").replace(/\/h1>/g, "/p>");
                self.detailsBox.find(".details-content").html(content);
                var retoptId = news.REPORTID;
                $.get('/screen/pretheme/reporttask', {
                    report_id: retoptId
                }, function(data) {
                    var data = JSON.parse(data);
                    var js_Rmain_back = $("#js_Rmain_back");
                    if ($.isEmptyObject(data) == true) {
                        js_Rmain_back.html("<img src='img2/bmx_no.jpg' class='bmx_no' />");
                        return;
                    } else {
                        var PlanTaskLogs = data.PlanTaskLogs;
                        var Materials = data.Materials;
                        console.log(data);
                        var materialArr = [];
                        for (var i = 0; i < Materials.length; i++) {
                            var material = Materials[i];
                            //1是文字 2是图片 3是音频 4是视频
                            var cssStr = 'style="top: -'+(i*50)+'px;"';
                            if(i%2 == 0){
                                if(material.MATERIALTYPE == 1){

                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="text_class1 click" '+cssStr+'>');
                                    materialArr.push('    <div class="text_source1">');
                                    materialArr.push('        <div class="text_time1">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('        <div class="text_content1" id="text_1">'+material.MATERIALAPPFILE+'</div>');
                                    materialArr.push('    </div>');
                                    materialArr.push('    <div class="text_line1"></div>');
                                    materialArr.push('    <div class="text_circle1"></div>');
                                    materialArr.push('    <div class="text_report1">'+material.USERNAME+'</div>');
                                    materialArr.push('</div>');
                                }else if(material.MATERIALTYPE == 2){
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="img_class click" '+cssStr+'>');
                                    materialArr.push('    <div class="img_source">');
                                    materialArr.push('    <div class="img_time">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('    <div class=""></div>');
                                    materialArr.push('    <div class="img_video"><img class="img_sou" id="img_1" src="'+material.MATERIALAPPFILE+'"></div></div>');
                                    materialArr.push('    <div class="img_line"></div>');
                                    materialArr.push('    <div class="img_circle"></div>');
                                    materialArr.push('    <div class="img_author">'+material.USERNAME+'</div>');
                                    materialArr.push('</div>');
                                }else if(material.MATERIALTYPE == 3){
                                    var videoId = material.MATERIALAPPFILE;
                                    var videoUrl = getmediaurl(videoId);
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="autio_class1 click" '+cssStr+'>');
                                    materialArr.push('    <div class="autio_source1">');
                                    materialArr.push('        <div class="autio_time1">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('        <div class="autio_autio1">');
                                    materialArr.push('            <div id="audio_a" class="audio_a">');
                                    materialArr.push('                <audio id="AudioIdb0" class="audio_b" controls="" src="'+videoUrl+'"></audio>');
                                    materialArr.push('                <div class="audio_logo">');
                                    materialArr.push('                    <img src="img2/bmx_11.png" alt="">');
                                    materialArr.push('                </div>');
                                    materialArr.push('                <div class="audio_content">这是一条音频</div>');
                                    materialArr.push('                <div id="AudioIdc0" class="audio_c"></div>');
                                    materialArr.push('            </div>');
                                    materialArr.push('        </div>');
                                    materialArr.push('    </div>');
                                    materialArr.push('    <div class="autio_line1"></div>');
                                    materialArr.push('    <div class="autio_circle1"></div>');
                                    materialArr.push('    <div class="autio_report1">'+material.USERNAME+'</div>');
                                    materialArr.push('</div>');
                                }else if(material.MATERIALTYPE == 4){
                                    var videoId = material.MATERIALAPPFILE;
                                    var videoUrl = getmediaurl(videoId);
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="video_class click" '+cssStr+'>');
                                    materialArr.push('    <div class="video_source">');
                                    materialArr.push('        <div class="video_time1">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('        <div class=""></div>');
                                    materialArr.push('        <video id="video_7" class="video_video1"  ><source src="'+videoUrl+'"></video>');
                                    materialArr.push('    </div>');
                                    materialArr.push('    <div class="video_line"></div>');
                                    materialArr.push('    <div class="source_circle"></div>');
                                    materialArr.push('    <div class="report_author">'+material.USERNAME+'</div>');
                                    materialArr.push('</div>');
                                }
                            }else{
                                if(material.MATERIALTYPE == 1){
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="text_class click" '+cssStr+'>');
                                    materialArr.push('    <div class="text_report">'+material.USERNAME+'</div>');
                                    materialArr.push('    <div class="text_circle"></div>');
                                    materialArr.push('    <div class="text_line"></div>');
                                    materialArr.push('    <div class="text_source">');
                                    materialArr.push('        <div class="text_time">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('        <div class="text_content" id="text_1">'+material.MATERIALAPPFILE+'</div>');
                                    materialArr.push('    </div>');
                                    materialArr.push('</div>');
                                }else if(material.MATERIALTYPE == 2){
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="img_class1 click" '+cssStr+'>');
                                    materialArr.push('    <div class="img_author1">'+material.USERNAME+'</div>');
                                    materialArr.push('    <div class="img_circle1"></div>');
                                    materialArr.push('    <div class="img_line1"></div>');
                                    materialArr.push('    <div class="img_source1">');
                                    materialArr.push('    <div class="img_time1">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('    <div class=""></div>');
                                    materialArr.push('    <div class="img_video1"><img class="img_sou" id="img_1" src="'+material.MATERIALAPPFILE+'"></div></div>');
                                    materialArr.push('</div>');
                                }else if(material.MATERIALTYPE == 3){
                                    var videoId = material.MATERIALAPPFILE;
                                    var videoUrl = getmediaurl(videoId);
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="autio_class click" '+cssStr+'>');
                                    materialArr.push('    <div class="autio_report">'+material.USERNAME+'</div>');
                                    materialArr.push('    <div class="autio_circle"></div>');
                                    materialArr.push('    <div class="autio_line"></div>');
                                    materialArr.push('    <div class="autio_source">');
                                    materialArr.push('        <div class="autio_time">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('        <div class="autio_autio">');
                                    materialArr.push('            <div id="audio_a" class="audio_a">');
                                    materialArr.push('                <audio id="AudioIdb0" class="audio_b" controls="" src="'+videoUrl+'"></audio>');
                                    materialArr.push('                <div class="audio_logo">');
                                    materialArr.push('                    <img src="img2/bmx_11.png" alt="">');
                                    materialArr.push('                </div>');
                                    materialArr.push('                <div class="audio_content"></div>');
                                    materialArr.push('                <div id="AudioIdc0" class="audio_c"></div>');
                                    materialArr.push('            </div>');
                                    materialArr.push('        </div>');
                                    materialArr.push('    </div>');
                                    materialArr.push('</div>');
                                }else if(material.MATERIALTYPE == 4){
                                    var videoId = material.MATERIALAPPFILE;
                                    var videoUrl = getmediaurl(videoId);
                                    materialArr.push('<div rel="'+material.MATERIALTYPE+'" class="video_class1 click" '+cssStr+'>');
                                    materialArr.push('    <div class="report_author1">'+material.USERNAME+'</div>');
                                    materialArr.push('    <div class="source_circle1"></div>');
                                    materialArr.push('    <div class="video_line1"></div>');
                                    materialArr.push('    <div class="video_source1">');
                                    materialArr.push('        <div class="video_time1">'+d3.time.format('%m-%d %H:%M')(new Date(material.CRTIME))+'</div>');
                                    materialArr.push('        <div class=""></div>');
                                    materialArr.push('        <video id="video_7" class="video_video1"  ><source src="'+videoUrl+'"></video>');
                                    materialArr.push('    </div>');
                                    materialArr.push('</div>');
                                }
                            }
                            
                        };
                        
                        js_Rmain_back.html(materialArr.join(""));
                        if($.trim(js_Rmain_back.html()) == ""){
                            js_Rmain_back.html("<img src='img2/bmx_no.jpg' class='bmx_no' />");
                        }



                    }

                });

            }
            if(news.FLAG == 0){
                newsArr.push('            <p '+classStr+'>'+news.STATEMENT+'</p>');
            }else if(news.FLAG == 1){
                newsArr.push('            <p '+classStr+'>'+news.STATEMENT+'</p><img src="img2/bmx_5.png" class="flagicon">');
            }else if(news.FLAG == 2){
                newsArr.push('            <p '+classStr+'>'+news.STATEMENT+'</p><img src="img2/bmx_6.png" class="flagicon">');
            }else if(news.FLAG == 3){
                newsArr.push('            <p '+classStr+'>'+news.STATEMENT+'</p><img src="img2/bmx_7.png" class="flagicon">');
            }
            newsArr.push('        </div>');
            activeIndex++;
            if(self.newsRecordIndex == 0){
                this.newsIndex++;
            }
            
        };
        newsArr.push('        <img src="img2/bmx_8.png" class="blueborderup">');
        newsArr.push('        <img src="img2/bmx_10.png" class="blueborderdown">');
        newsArr.push('    </div>');
        newsArr.push('</div>');
    };
    this.reportlist.html(newsArr.join(""));
    
}

App.prototype.requestNews = function(){
    var self = this;
    var urlNews = serverDomain + '/screen/pretheme/reportNew';
    d3.json(urlNews, function(error, data1) {
        if(error) {
            return;
        }
        console.log(data1);

        self.allDataNews = data1;
        self.renderNews();
    });
}

App.prototype.renderTitle = function() {
    var self = this;
    d3.select('h1.right').text('昨日原创稿件排行TOP10');
//  switch(self.dataAreaIndex) {
//      case 1:
//          d3.select('h1.right').text('三日原创稿件排行TOP10');
//          break;
//      case 2:
//          d3.select('h1.right').text('七日原创稿件排行TOP10');
//          break;
//      default:
//          d3.select('h1.right').text('昨日原创稿件排行TOP10');
//          break;
//  }
}

App.prototype.renderList = function() {
    var self = this;
    var sortData = this.data.sort(function(a, b) {
        return b.value - a.value;
    });
    if(sortData.length == 0){
        return false;
    }
    var createTable = [];
   for (var i = 0; i < 5; i++) {
        var d = sortData[i];
        if(i === self.selectedRecordIndex) {
            createTable.push('<tr class="active">');
        }else{
            createTable.push('<tr>');
        }
        createTable.push('    <td>'+(i + 1)+'</td>');
        createTable.push('    <td class="tdleft"><div class="titles">'+d.name+'</div></td>');
        createTable.push('    <td>'+d.time+'</td>');
        createTable.push('    <td>'+d.value+'</td>');
        createTable.push('</tr>');
    };
    this.listboxcontent2.html(createTable.join(""));
}

App.prototype.renderRadarMap = function() {
    var self = this;
    if(this.data.length == 0){
        return false;
    }
    var scale = d3.scale.linear().domain([0, 1]).range([25, 55]).clamp(true);

    var line0 = d3.svg.line()
        .x(function(d, i) {
            return 0;
        })
        .y(function(d, i) {
            return 0;
        });

    var line1 = d3.svg.line()
        .x(function(d, i) {
            return scale(d) * Math.sin(i * 2 * Math.PI / 3);
        })
        .y(function(d, i) {
            return -scale(d) * Math.cos(i * 2 * Math.PI / 3);
        });

    var radarValues = this.data[self.selectedRecordIndex].radarValues;

    var update = this.radarG.selectAll('path.line').data([radarValues]);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append("path")
        .classed('line', true)
        .attr({
            'fill': 'rgba(45, 160, 150, 0.5)',
            'stroke': '#269797',
            'stroke-width': 1
        })
        .attr("d", function(d) {
            return line0(d) + ' Z';
        });
    update
        .transition()
        .duration(500)
        .attr("d", function(d) {
            return line1(d) + ' Z';
        });

    d3.select('.radarValues-1').text(~~(radarValues[0] * 100));
    d3.select('.radarValues-2').text(~~(radarValues[1] * 100));
    d3.select('.radarValues-3').text(~~(radarValues[2] * 100));
}

App.prototype.renderRelationMap = function() {
    var self = this;

    this.relationG.selectAll('*').remove();
    if(this.data.length == 0){
        return false;
    }
    var tree = d3.layout.tree()
        .size([360, 150])
        .separation(function(a, b) {
            return(a.parent == b.parent ? 1 : 2) / a.depth;
        });

    var nodes = tree.nodes(this.data[self.selectedRecordIndex]),
        links = tree.links(nodes);
    var link = this.relationG.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#0D7074")
        .style("stroke-width", 1)
        .each(function(d) {
            var x1 = (d.source.depth * 30 + Math.min(d.source.depth, 1) * 25) * Math.cos(Math.PI * (d.source.x - 90) / 175) || 0;
            var y1 = (d.source.depth * 30 + Math.min(d.source.depth, 1) * 25) * Math.sin(Math.PI * (d.source.x - 90) / 175) || 0;

            var x2 = (d.target.depth * 30 + Math.min(d.target.depth, 1) * 25) * Math.cos(Math.PI * (d.target.x - 90) / 175) || 0;
            var y2 = (d.target.depth * 30 + Math.min(d.target.depth, 1) * 25) * Math.sin(Math.PI * (d.target.x - 90) / 175) || 0;

            d3.select(this).attr({
                    x1: x1,
                    y1: y1,
                    x2: x1,
                    y2: y1
                })
                .transition()
                .ease('linear ')
                .duration(500)
                .delay(function(d, i) {
                    return d.target.depth * 500 || 0;
                })
                .attr({
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
        });

    var node = this.relationG.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("transform", function(d) {
            if(d.parent) {
                var x = (d.parent.depth * 30 + Math.min(d.parent.depth, 1) * 25) * Math.cos(Math.PI * (d.parent.x - 90) / 175) || 0;
                var y = (d.parent.depth * 30 + Math.min(d.parent.depth, 1) * 25) * Math.sin(Math.PI * (d.parent.x - 90) / 175) || 0;
            } else {
                var x = (d.depth * 30 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
                var y = (d.depth * 30 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            }
            return "translate(" + x + "," + y + ")";
        })
        .attr("r", 0)
        .style("fill", '#0ECAC9')
        .transition()
        .ease('linear ')
        .duration(500)
        .delay(function(d, i) {
            return d.depth * 500;
        })
        .attr("r", function(d, i) {
            return(2 + 2 * Math.random() - 0.5 * d.depth);
        })
        .attr("transform", function(d) {
            var x = (d.depth * 30 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
            var y = (d.depth * 30 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            return "translate(" + x + "," + y + ")";
        });
}

App.prototype.renderInfo = function() {
    if(this.data.length==0){return false;}
    var selectData = this.data[this.selectedRecordIndex];
    d3.select('.main-right2 h2').text(selectData.name);
    d3.select('.department').text(selectData.department);
    d3.select('.author').text(selectData.author);

    d3.select('.exCoreMedias').text(selectData.exCoreMedias);
    d3.select('.exLv1Medias').text(selectData.exLv1Medias);
    d3.select('.exLv2Medias').text(selectData.exLv2Medias);

    var update = d3.select('.core-list-body').selectAll('div.item').data(selectData.coreMedia);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('div').classed('item', true);
    update.text(function(d) {
        return d
    });
}
var app = new App();
var $modalOverlay = $("#modal-overlay");
function closelay(self){
    $modalOverlay.hide();
    var myVideo = $modalOverlay.find("video")[0];
    if($modalOverlay.find('video').length > 0){
        if (myVideo.paused){
           myVideo.play();
        }else{
           myVideo.pause();
        }
    }
    var myaudio = $modalOverlay.find("audio")[0];
    if($modalOverlay.find('audio').length > 0){
        if (myaudio.paused){
           myaudio.play();
        }else{
           myaudio.pause();
        }
    }
}

$("#js_Rmain_back").delegate('.click', 'click', function(event) {
    var self = $(this);
    var rel = self.attr("rel");
    //1是文字 2是图片 3是音频 4是视频
    if(rel== 1){
        var textArr = [];
        textArr.push('<div id="modal_text">');
        textArr.push('    <div id="modaltext_message">');
        textArr.push('    <div id="modaltext_name">'+self.find(".text_report").html()+'</div>');
        textArr.push('    <div id="modaltext_time">'+self.find(".text_time").html()+'</div></div><div id="modaltext_text">');
        textArr.push(self.find(".text_content").html());
        textArr.push('    </div>');
         textArr.push('</div>');
        $modalOverlay.find(".modal-main").html(textArr.join(""));
    }else if( rel== 2){
        $modalOverlay.find(".modal-main").html("<img id='modal_picture_video' src='"+self.find(".img_sou").attr("src")+"' />");
    }else if( rel== 3){
        $modalOverlay.find(".modal-main").html('<div id="modal_aiduo" class="modal_aiduo"><audio controls="" id="modal_audio_source" src="'+self.find("audio").attr("src")+'"></audio><img src="img2/aaa.png" style="position: relative;left: -465px;"><div class="modal_aiduo_message"><div id="modal_aiduo_player"></div><div id="modal_audio_content">这是一条音频</div></div></div>');
        
        var audio =$modalOverlay.find('audio')[0];
        if(audio.paused){
            audio.play();//audio.play();// 这个就是播放  
        }else{
            audio.pause();// 这个就是暂停
        }
    }if( rel== 4){
        $modalOverlay.find(".modal-main").html('<video id="modal_video" class="modal_video" src="'+self.find("source").attr("src")+'" controls=""></video>');
        var myVideo = $modalOverlay.find('video')[0];
        if (myVideo.paused){
           myVideo.play();
        }else{
           myVideo.pause();
        }
    }

    $("#modal-overlay").show();
});


//获取音视频地址
function getmediaurl(id) {
    var params = {
        json: {
            masId: id,
            isLive: "false",
            player: "HTML5"
        }
    };
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
            data = JSON.parse(data);
            videourl = data.streamsMap.l.httpURL;
        }
    });
    return videourl;
}
    
