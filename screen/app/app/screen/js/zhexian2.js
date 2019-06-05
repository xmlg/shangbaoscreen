
var width  = 1650;	//SVG绘制区域的宽度
var height = 800;	//SVG绘制区域的高度

var svg = d3.select("body svg")			//选择<body>
//在<body>中添加<svg>
    .attr("width", width)	//设定<svg>的宽度属性
    .attr("height", height);//设定<svg>的高度属性

//1. 确定初始数据
var dataset = [
    { name: "网媒" ,
        sales: [
            { year:'10/20', profit: 200 },
            { year:'10/21', profit: 100 },
            { year:'10/22', profit: 120 },
            { year:'10/23', profit: 350 },
            { year:'10/24', profit: 200 },
            { year:'10/25', profit: 350 }
        ] },
    { name: "微博" ,
        sales: [
            { year:'10/20', profit: 150 },
            { year:'10/21', profit: 280 },
            { year:'10/22', profit: 90 },
            { year:'10/23', profit: 160 },
            { year:'10/24', profit: 180 },
            { year:'10/25', profit: 400 }] },
    { name: "电子报" ,
        sales: [
            { year:'10/20', profit: 300 },
            { year:'10/21', profit: 150 },
            { year:'10/22', profit: 90 },
            { year:'10/23', profit: 210 },
            { year:'10/24', profit: 270 },
            { year:'10/25', profit: 300 }] },
    { name: "微信" ,
        sales: [
            { year:'10/20', profit: 180 },
            { year:'10/21', profit: 220 },
            { year:'10/22', profit: 380 },
            { year:'10/23', profit: 130 },
            { year:'10/24', profit: 290 },
            { year:'10/25', profit: 180 }] },
    { name: "APP" ,
        sales: [
            { year:'10/20', profit: 130 },
            { year:'10/21', profit: 20 },
            { year:'10/22', profit: 180 },
            { year:'10/23', profit: 230 },
            { year:'10/24', profit: 380 },
            { year:'10/25', profit: 220 }] }
];


//2. 转换数据
var stack = d3.layout.stack()
    .values(function(d){ return d.sales; })
    .x(function(d){ return d.year; })
    .y(function(d){ return d.profit; });

var data = stack(dataset);

//    console.log(data);


//3. 绘制

//外边框
var padding = { left:10, right:100, top:30, bottom:30 };

//创建x轴比例尺
var xRangeWidth = width - padding.left - padding.right;

var xScale = d3.scale.ordinal()
    .domain(data[0].sales.map(function(d){ return d.year; }))
    .rangeBands([0, xRangeWidth],0.3);

//创建y轴比例尺

//最大利润（定义域的最大值）
var maxProfit = d3.max(data[data.length-1].sales, function(d){
    return d.y0 + d.y;
});

//最大高度（值域的最大值）
var yRangeWidth = height - padding.top - padding.bottom;

var yScale = d3.scale.linear()
    .domain([0, maxProfit])		//定义域
    .range([0, yRangeWidth]);	//值域

var area = d3.svg.area()
    .x(function(d){ return xScale(d.year) + xScale.rangeBand()/2; })
    .y0(function(d){ return yRangeWidth - yScale(d.y0); })
    .y1(function(d){ return yRangeWidth - yScale(d.y0+d.y); })
    .interpolate("basis");

//颜色比例尺
//    var color = d3.scale.category20();
var  color = {
    '0':'#0f466f',
    '1':'#0d3d65',
    '2':'#0f3c63',
    '3':'#0a2945',
    '4':'#081034'
}
console.log(color[1]);


//添加分组元素
var groups = svg.selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .style("fill",function(d,i){ return color[i]; });

//添加区域
var areas = groups.append("path")
    .attr("d", function(d){ return area(d.sales); })
    .attr("transform","translate(-68," + padding.top + ")");

//添加坐标轴
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

yScale.range([yRangeWidth, 0]);

var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding.left + "," + (height - padding.bottom) +  ")")
    .call(xAxis);

svg.append("g")
    .attr("class","axis")
    .attr("transform","translate(" + padding.left + "," + (height - padding.bottom - yRangeWidth) +  ")")
    .call(yAxis);

//添加右侧分组标签
var labHeight = 50;
var labRadius = 10;
//右侧分组图标
var labelCircle = groups.append("circle")
    .attr("cx",function(d){ return width - padding.right*0.98; })
    .attr("cy",function(d,i){ return padding.top * 2 + labHeight * i; })

    .attr("r",labRadius);
//右侧标签位置
var labelText = groups.append("text")
    .attr("x",function(d){ return width - padding.right*0.8; })
    .attr("y",function(d,i){ return padding.top * 2 + labHeight * i; })
    .attr("dy",labRadius/2)

    .text(function(d){ return d.name; });

