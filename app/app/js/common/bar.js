function dateQuantity(appQuanDate){
    var width = 408;
    var height = 265;
    var dataset = appQuanDate;
    var color = ["#2e557e","#fff7d7","#f9966c","#6acce4","#d69093"];
    var svg = d3.select("#bar").append("svg")
        .attr("width", width + 5)
        .attr("height", height + 50);

    //定义坐标缩放比例
    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([height - 50, 0]);

    var xScale = d3.scaleBand()
        .domain(["纸媒", "网站", "微信", "微博", "app"])
        .range([0, width - 30]);
    //定义坐标系
    var xAxis = d3.axisBottom(xScale)
        .tickPadding(20);

    var yAxis = d3.axisLeft(yScale)
        .ticks(7)
        .tickFormat(function(d) {
            return dollarFormatter(d);
        });

    //x,y数据显示的位置
    var yScale1 = d3.scaleLinear()
        .domain([0, d3.max(dataset)])
        .range([0, height - 50]);

    var xScale1 = d3.scaleBand()
        .domain(["纸媒", "网站", "微信", "微博", "app"])
        .range([0, width - 10], 0.05);

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(30," + (height - 5) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(30,45)")
        .call(yAxis);

    //柱状图背景
    var rect1 = svg.selectAll("rect1")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale.step() * i + 60 - 10;
        })
        .attr("y", 40)
        .attr("width", function(d, i) {
            return xScale.step() / 2;
        })
        .attr("rx", xScale.step() / 4)
        .attr("xy", xScale.step() / 4)
        .attr("height", height - 40)
        .attr("fill", "#112a4c")
        .attr("opacity", 0.5);

    //创建柱状图
    var rect2 = svg.selectAll("rect2")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d, i) {
            return xScale.step() * i + 60 - 10;
        })
        .attr("y", height)
        .attr("width", function(d, i) {
            return xScale.step() / 2;
        })
        .attr("height", 0)
        .attr("fill", function(d,i){
            return color[i];
        })
        .attr("rx", xScale.step() / 4)
        .attr("xy", xScale.step() / 4)
        .transition()
        .duration(1000)
        .attr("height", function(d, i) {
            return yScale1(d) + 20;
        })
        .attr("y", function(d, i) {
            return height - yScale1(d) + xScale.step() / 4 - 25;
        });

    svg.selectAll("circle1")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return xScale.step() * i + 70;
        })
        .attr("cy", function(d, i) {
            return height + xScale.step() / 4 - 25;
        })
        .attr("r", xScale.step() / 4 - 5)
        .attr("fill", "#001b37");


    svg.selectAll("circle2")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) {
            return xScale.step() * i + 70;
        })
        .attr("cy", function(d, i) {
            return height + xScale.step() / 4 - 25;
        })
        .attr("r", 4)
        .attr("fill", "#69cde0");


    svg.selectAll(".image")
        .data(dataset)
        .enter()
        .append("image")
        .attr("x", function(d, i) {
            return xScale.step() * i + xScale.step() / 2;
        })
        .attr("y", width)
        .text(function(d) {
            return d;
        })
        .attr("xlink:href", "./images/1.png")
        .transition()
        .duration(1000)
        .attr("y", function(d, i) {
            return height - yScale1(d) - 45;
        });

    svg.selectAll("text1")
        .data(dataset)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return xScale.step() * i + 60 - 10 + xScale.step() / 4;
        })
        .attr("y", width)
        .text(function(d) {
            return d;
        })
        .attr("class", "text")
        .transition()
        .duration(1000)
        .attr("y", function(d, i) {
            return height - yScale1(d) - 28;
        });

    //格式化y轴
    function dollarFormatter(n) {
        var result = n;
        if (Math.abs(n) > 10000) {
            result = Math.round(n / 10000) + '万';
        }
        return result;
    }
};