/**
 * Created by Administrator on 2016/11/29.
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var url_param = getQueryString("zbGuid");

if(url_param==null ||url_param.length<=0){
    console.log("parameter error")
}
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

var color = d3.scaleOrdinal(d3.schemeCategory10);
/**布局开始*/
var simulation = d3.forceSimulation()

    .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(100))
    .force("charge", d3.forceManyBody().strength(-140))
    .force("center", d3.forceCenter(width/2 , height/2 ));
url_param = 799580416196882432;
/**布局结束*/
d3.json("http://111.203.35.59/cas/xhs/bigScreen/main.do?method=getExReprintMaualsByGUID&zbGuid="+url_param, function(error, graph
                                                                                                                      /* d3.json("miserables.json", function(error, graph) */){
    if (error) throw error;
    /**绘制开始*/
    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });


    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 10)
        .attr("fill", function(d) { return color(d.group); })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));



    var svg_text = svg.selectAll("text")
        .data(graph.nodes)
        .enter()
        .append("text")
        .style("fill","#333333")
        .style("font-size","8px")
        .style("font","微软雅黑")
        .attr("dx",12)
        .attr("dy",5)
        .text(function(d){return d.id;});

    node.append("title")
        .text(function(d) { return d.id; });

    simulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(graph.links);
    /**更新连线坐标，对于每一个时间间隔*/
    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        svg_text
            .attr("x", function(d){ return d.x; })
            .attr("y", function(d){ return d.y; });
        graph.nodes.forEach(function(d,i){
            d.x = d.x - 20/2 < 0     ? 20/2 : d.x ;
            d.x = d.x + 20/2 > width ? width - 20/2 : d.x ;
            d.y = d.y - 20/2 < 0      ? 20/2 : d.y ;
            d.y = d.y + 20/2  > height ? height - 20/2  : d.y ;
        });

    }
});
/**绘制结束*/

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}


