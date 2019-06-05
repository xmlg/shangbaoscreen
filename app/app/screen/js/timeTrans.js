/**
 * Created by Administrator on 2016/11/10.
 */
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

    //var interval = window.setInterval(function() {
    //    self.selectedRecordIndex++;
    //    if(self.selectedRecordIndex >= 10) {
    //        self.selectedRecordIndex = 0;
    //        self.dataAreaIndex++;
    //        if(self.dataAreaIndex >= self.allData.length) {
    //            self.dataAreaIndex = 0;
    //        }
    //    }
    //    self.render();
    //}, 5 * 1000);
}

App.prototype.requestData = function() {
    var self = this;
    //var url = 'js/zuorigaojian.json '
    //var url = 'js/json/testJson1107.json '
    //var url = 'js/json/trans1110.json '
    //var url = 'js/11testJson/timeTrans1114.json '
    var url = '/cas/casData/screenJson?type=reprintALLOrderByPubTime';
    // var url = './js/111.txt';
    d3.json(url, function(error, data) {
        if(error) {
            return;
        }
        console.log(data);
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
            //d.contribOfRead = parseFloat(d.contribOfRead).toFixed(2);
            d.contribOfRead = 0.59;
            //d.contribOfInteract = parseFloat(d.contribOfInteract).toFixed(2);
            d.contribOfInteract = 0.29;
            //d.contribOfReprint = parseFloat(1 - d.contribOfRead - d.contribOfReprint).toFixed(2);
            d.contribOfReprint = 0.12;
            dd.radarValues = [d.contribOfRead, d.contribOfInteract, d.contribOfReprint];
            console.log(dd.radarValues);
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
                    name: d.exMediaTime,
                    parent: d.exMediaTimeParent && d.exMediaTimeParent !== '' ? d.exMediaTimeParent : null,
                    children: []
                };
                set[d.exMediaTime] = node;
                //        console.log(set);
            });
            allMedias.forEach(function(d, i) {
                if(d.exMediaTimeParent && d.exMediaTimeParent !== '' && !set[d.exMediaTimeParent]) {
                    set[d.exMediaTimeParent] = {
                        name: d.exMediaTimeParent,
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
        console.log("bbb");
        console.log(result);
        return result;
    }

}

App.prototype.render = function() {
    var self = this;
    self.data = self.allData[this.dataAreaIndex];
    //this.renderTitle();
    //this.renderList();
    //this.renderRadarMap();
    this.renderRelationMap();
    //this.renderInfo();
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
    console.log(nodes[0]);
    console.log("aaa");
    console.log(links[0]);
    var link = this.relationG.selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", "#0D7074")
        .style("stroke-width", 3)
        .attr("transform", function(d) {
            var x = (d.depth * 100 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
            var y = (d.depth * 100 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            return "translate(" + (x-350) + "," + (y+100) + ")";
        })
        .each(function(d) {
            var x1 = (d.source.depth * 100 + Math.min(d.source.depth, 1) * 25) * Math.cos(Math.PI * (d.source.x - 90) / 175) || 0;
            var y1 = (d.source.depth * 100 + Math.min(d.source.depth, 1) * 25) * Math.sin(Math.PI * (d.source.x - 90) / 175) || 0;

            var x2 = (d.target.depth * 100 + Math.min(d.target.depth, 1) * 25) * Math.cos(Math.PI * (d.target.x - 90) / 175) || 0;
            var y2 = (d.target.depth * 100 + Math.min(d.target.depth, 1) * 25) * Math.sin(Math.PI * (d.target.x - 90) / 175) || 0;

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
                var x = (d.parent.depth * 100 + Math.min(d.parent.depth, 1) * 25) * Math.cos(Math.PI * (d.parent.x - 90) / 175) || 0;
                var y = (d.parent.depth * 100 + Math.min(d.parent.depth, 1) * 25) * Math.sin(Math.PI * (d.parent.x - 90) / 175) || 0;
            } else {
                var x = (d.depth * 100 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
                var y = (d.depth * 100 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            }
            return "translate(" + (x-350) + "," + (y+100) + ")";
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
            return(4 + 2 * Math.random() - 0.5 * d.depth);
        })
        .attr("transform", function(d) {
            var x = (d.depth * 100 + Math.min(d.depth, 1) * 25) * Math.cos(Math.PI * (d.x - 90) / 175) || 0;
            var y = (d.depth * 100 + Math.min(d.depth, 1) * 25) * Math.sin(Math.PI * (d.x - 90) / 175) || 0;
            return "translate(" + (x-350) + "," + (y+100) + ")";
        });
}


var app = new App();