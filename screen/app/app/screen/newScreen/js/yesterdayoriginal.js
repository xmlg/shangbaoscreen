function App() {
    var self = this;
    this.listBody = d3.select('.list-body');
    this.radarG = d3.select('.radar-map svg g.radar');
    this.relationG = d3.select('.relation-map g');
    this.selectedRecordIndex = 0;
    this.dataAreaIndex = 0;

    this.allData = [];

    this.requestData();
   // this.startTimingTask();
}

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestData();
    }, 150 * 1000);

    var interval = window.setInterval(function() {
        self.selectedRecordIndex++;
        if(self.selectedRecordIndex >= 10) {
            self.selectedRecordIndex = 0;
            self.dataAreaIndex++;
            if(self.dataAreaIndex >= self.allData.length) {
                self.dataAreaIndex = 0;
            }
        }
        self.render();
    }, 5 * 1000);
}

App.prototype.requestData = function() {
    var self = this;
	//var url = 'js/zuorigaojian.json '
      var url = '/cas/casData/screenJson?type=reprintALL';
    d3.json(url, function(error, data) {
        if(error) {
            return;
        }
      //  console.log(data);
//console.log(data);
        var dataArea1 = null;
        var dateArea3 = null;
        var dataArea7 = null;

        data.Records.forEach(function(d, i) {
			dataArea1 = formatData(d.data);
           /* if(d.timeArea === 1) {
                dataArea1 = formatData(d.data);
            } else if(d.timeArea === 3) {
                dataArea3 = formatData(d.data);
            } else if(d.timeArea === 7) {
                dataArea7 = formatData(d.data);
            }*/
        });
        self.allData = [dataArea1];//, dataArea3, dataArea7];

       // console.log(self.allData);
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
        //        console.log(set);
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
       //         console.log(setArr);
            }

            var children = setArr.filter(function(d) {
     //       	console.log(d);
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
    self.data = self.allData[this.dataAreaIndex];
    this.renderTitle();
    this.renderList();
    this.renderRadarMap();
    this.renderRelationMap();
    this.renderInfo();
}

App.prototype.renderTitle = function() {
    var self = this;
    d3.select('h1.right');
    switch(self.dataAreaIndex) {
        case 1:
            d3.select('h1.right').text('三日原创稿件排行TOP10');
            break;
        case 2:
            d3.select('h1.right').text('七日原创稿件排行TOP10');
            break;
        default:
            d3.select('h1.right').text('昨日原创稿件排行TOP10');
            break;
    }
}

App.prototype.renderList = function() {
    var self = this;
    var sortData = this.data.sort(function(a, b) {
        return b.value - a.value;
    });

    var update = this.listBody.selectAll('div.list-item').data(sortData);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('div').classed('list-item', true)
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.append('div').classed('td1', true);
            var td2 = listItem.append('div').classed('td2', true);
            var td3 = listItem.append('div').classed('td3', true);
            var td4 = listItem.append('div').classed('td4', true);

            td1.text(i + 1);
            td2.text(d.name);
            td3.text(d.time);
            td4.text(d.value);
        });
    update
        .style('color', function(d, i) {
            if(i === self.selectedRecordIndex) {
                return '#F8EF02';
            }
            return null;
        })
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.select('div.td1');
            var td2 = listItem.select('div.td2');
            var td3 = listItem.select('div.td3');
            var td4 = listItem.select('div.td4');

            td1.text(i + 1);
            td2.text(d.name);
            td3.text(d.time);
            td4.text(d.value);
        })
}

App.prototype.renderRadarMap = function() {
    var self = this;

    var scale = d3.scale.linear().domain([0, 1]).range([25, 100]).clamp(true);

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

    var tree = d3.layout.tree()
        .size([360, 150])
        .separation(function(a, b) {
            return(a.parent == b.parent ? 1 : 2) / a.depth;
        });

    var nodes = tree.nodes(this.data[self.selectedRecordIndex]),
        links = tree.links(nodes);
	//	console.log(nodes);
    var link = this.relationG.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#0D7074")
        .style("stroke-width", 1)
        .each(function(d) {
            var x1 = (d.source.depth * 40 + Math.min(d.source.depth, 1) * 25) * Math.cos(Math.PI * (d.source.x - 90) / 175) || 0;
            var y1 = (d.source.depth * 40 + Math.min(d.source.depth, 1) * 25) * Math.sin(Math.PI * (d.source.x - 90) / 175) || 0;

            var x2 = (d.target.depth * 40 + Math.min(d.target.depth, 1) * 25) * Math.cos(Math.PI * (d.target.x - 90) / 175) || 0;
            var y2 = (d.target.depth * 40 + Math.min(d.target.depth, 1) * 25) * Math.sin(Math.PI * (d.target.x - 90) / 175) || 0;

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
                var x = (d.parent.depth * 40 + Math.min(d.parent.depth, 1) * 25) * Math.cos(Math.PI * (d.parent.x - 90) / 175) || 0;
                var y = (d.parent.depth * 40 + Math.min(d.parent.depth, 1) * 25) * Math.sin(Math.PI * (d.parent.x - 90) / 175) || 0;
            } else {
                var x = (d.depth * 40 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
                var y = (d.depth * 40 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
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
            var x = (d.depth * 40 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
            var y = (d.depth * 40 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            return "translate(" + x + "," + y + ")";
        });
}

App.prototype.renderInfo = function() {
    var selectData = this.data[this.selectedRecordIndex];
//    console.log(selectData);
    d3.select('.main-right h2').text(selectData.name);
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