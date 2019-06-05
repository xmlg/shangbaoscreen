/**
 * Created by Administrator on 2016/10/29.
 */
function EditApp(){
    var self = this;
    //self.gettime();


    self.Nextfocusindex = 0;
    self.rollindex = 0;
    self.nginx6275 = '/testajax/';
    self.nginx7418 = '/ajax/'
    //轮询间隔设置
    //self.focusNextlist = new TimedTask(function() {
    //    self.focusnextlist();
    //    self.rollindex = 0;
    //    //if (nextRecord != undefined ) {
    //    //    return nextRecord.taskdata.length * 2000 + 3000000;
    //    //}
    //    return 20*1000;
    //}, 0);
    //列表自动刷新
    //self.requestdata = new TimedTask(function() {
    //    self.requestListdata();
    //    return 6000000;
    //}, 0);
    //素材横向滚动
    //self.materrolltask = new TimedTask(function () {
    //    self.materroll();
    //    return 3000
    //},0)


    //self.requestdata.start();


}
    //获取对应新闻数据
EditApp.prototype.getnewsdata = function (id) {
    var self = this;
    $.when(
        $.ajax('js/json/edit-reportDetails.json',{report_id:id}),
        $.ajax('js/json/edit-metadataLogs.json',{report_id:id}),
        $.ajax('js/json/edit-taskdatalog.json',{report_id:id})
        //$.get("/screen/pretheme/reportmessage",{report_id:id}),
        //$.get('/screen/pretheme/reporttrace',{report_id:id}),
        //$.get('/screen/pretheme/reporttask',{report_id:id})
        )
        .then(function (
            reportDetailsData,
            metadataLogsData,
            taskdatalogData
        ) {
            //self.detailsdata = JSON.parse(reportDetailsData[0]);
            //self.metadata = JSON.parse(metadataLogsData[0]);
            //self.taskdata = taskdatalogData

            self.detailsdata = reportDetailsData[0];
            self.metadata = metadataLogsData[0];
            self.taskdata = taskdatalogData[0]
            console.log(self.detailsdata,self.metadata,self.taskdata)
            self.render();
        })

};
//渲染内容
EditApp.prototype.render = function () {
    var self = this;
    if($.isEmptyObject(self.detailsdata) == false){
        //this.renderdetails();
        this.renderhotcurve()
    }
    if($.isEmptyObject(self.metadata) == false){
        //this.rendermetalog();
    }
    //this.renderright();
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

    var startDate = new Date(starttime);
    var endDate = new Date(startDate.getTime() + dayLength * 24 * 3600 * 1000);

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
        .attr('class','grid');
    grid.append('line')
        .attr('x1',function(d, i) {
            return xScale(i);
        })
        .attr('x2',function(d, i) {
            return xScale(i);
        })
        .attr('y1',-180)
        .attr('y2',0)
        .attr(
            {
                'stroke': "#6a7577",
                'stroke-width':"1"
            });
    var ygrid = svg.select('g.backgroundline').selectAll('grid')
        .data(yTicks)
        .enter().append('g');
    ygrid.append('line')
        .attr('y1',function(d) {
            return -yScale(d);
        })
        .attr('y2',function(d) {
            return -yScale(d);
        })
        .attr('x1',0)
        .attr('x2',525)
        .attr(
            {
                'stroke': "#6a7577",
                'stroke-width':"1"
            });
    /*渲染y-axis start*/
    var yAxis = svg.select('g.y-axis');

    var update = yAxis.selectAll('text').data(yTicks);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('text');
    update.text(function(d, i) {
            return d;
        })
        .attr({
            'y': function(d, i) {
                return -yScale(d)+5;
            },
            'x': '-10',
            'font-size': '14px',
            'stroke': 'none',
            'fill': '#ffffff',
            'text-anchor': 'end'
        });
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
        .attr('cx', line.x()
        )
        .attr('cy',line.y()
        )
        .attr({
            'r':'3.5',
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
        .attr('cx', line.x()
        )
        .attr('cy',line.y()
        )
        .attr({
            'r':'3.5',
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
        'media':'媒体',
        'fork':'网民'
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
    $('div.item:first').css("margin-right","198px")

};

var app = new EditApp();
app.getnewsdata();