IABS.drawBlogBarChart = function() {
    var container = $('.blogBarChart');
    var svgWidth = container.width(),
        svgHeight = container.height();
    var contentWidth = svgWidth - 100,
        contentHeight = svgHeight - 120;

    //图相对于svg的偏移量
    var leftMove = 70,
        topMove = 45;

    //坐标轴信息与轴的距离
    var tickPadding = 20,
        tickPaddingX = 5;

    var svg = d3.select('.blogBarChart')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var xAxisTicks = [],
        yAxisTicks = [];
    var xAxisScale, yAxisScale;

    //获取数据
    try {
        IABS.getWeiboData(drawBarWithData);
    } catch (e) {
        console.error(e.message);
    }

    /**
     * 需要使用数据进行绘制
     * 其他的操作不用放在这个方法里
     */
    function drawBarWithData(data) {
        var chartData = [];
        if (data.result === 'success') {
            for (var i = 0; i < data.content.length; i++) {
                var item = {};
                item.name = data.content[i].belongto;
                item.value = data.content[i].score;
                chartData.push(item);
            }
        } else {
            console.log('柱状图获取数据失败！');
        }
        for (var i = 0; i < chartData.length; i++) {
            xAxisTicks.push(chartData[i].name);
            yAxisTicks.push(chartData[i].value);
        }
        drawAxis();
        drawBar(chartData);
    }

    //添加横轴、纵轴、水平分割线
    function drawAxis() {
        // x轴比例尺
        xAxisScale = d3.scaleBand()
            .domain(xAxisTicks)
            .rangeRound([0, contentWidth])
            .paddingInner([0.5])
            .paddingOuter([0.5]);
        // x轴
        var xAxis = d3.axisBottom(xAxisScale)
            .tickSizeInner([0])
            .tickSizeOuter([0])
            .tickPadding([tickPaddingX]);
        // 添加坐标轴
        svg.append('g')
            .classed('axis-container xaxis', true)
            .attr('transform', 'translate(' + leftMove + ',' + (contentHeight + topMove) + ')')
            .call(xAxis);

        // y轴比例尺
        var yScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, yAxisTicks)])
            .range([0, contentHeight]);
        yAxisScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, yAxisTicks)])
            .rangeRound([contentHeight, 0])
            .nice();

        //y轴
        var yAxis = d3.axisLeft(yAxisScale)
            .tickSizeInner([0])
            .tickSizeOuter([0])
            .ticks([6])
            .tickPadding([tickPadding]);
        svg.append('g')
            .classed('axis-container yaxis', true)
            .attr('transform', 'translate(' + leftMove + ', ' + topMove + ')')
            .call(yAxis);
        svg.select('.yaxis')
            .append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', contentHeight)
            .style('stroke', '#12b5e4');
        $('.xAxis .tick text').attr('y', '30');

        var ticks = [];
        for (var i = 0; i < $('.yAxis .tick text').length; i++) {
            var obj = $('.yAxis .tick text').eq(i).text();
            var str = '';
            for (var j = 0; j < obj.length; j++) {
                if (obj.charAt(j) != ',') {
                    str += obj.charAt(j);
                }
            }
            ticks.push(parseInt(str));
        }
        for (var m = 0; m < ticks.length; m++) {
            if (ticks[m] / 10000 >= 1 && ticks[m] / 10000 < 100) {
                $('.yAxis .tick text').eq(m).text((ticks[m] / 10000) + "W");
            } else if (ticks[m] / 1000000 >= 1) {
                $('.yAxis .tick text').eq(m).text((ticks[m] / 1000000) + "M");
            } else {
                $('.yAxis .tick text').eq(m).text(ticks[m]);
            }
        }
        //添加水平分割线
        svg.append('g')
            .classed('divide-line-container', true)
            .selectAll('line')
            .data(ticks)
            .enter()
            .append('line')
            .classed('divide-line', true)
            .attr('x1', leftMove)
            .attr('x2', (leftMove + contentWidth))
            .attr('y1', function(d, i) {
                return yAxisScale(d) + topMove;
            })
            .attr('y2', function(d, i) {
                return yAxisScale(d) + topMove;
            })
            .style('fill', 'none')
            .style('stroke', function(d, i) {
                if (d == 0) {
                    return '#12b5e4';
                } else {
                    return 'rgba(18, 54, 68, 0.8)';
                }
            });

        svg.append('g')
            .classed('divide-dots-container', true)
            .selectAll('circle')
            .data(ticks)
            .enter()
            .append('circle')
            .attr('cx', leftMove)
            .attr('cy', function(d, i) {
                return yAxisScale(d) + topMove;
            })
            .attr('r', 3);
    }

    // 添加柱
    function drawBar(data) {
        var panelArgument = {};
        var lineTrigger = svg.append('g')
            .classed('line-trigger', true)
            .append('rect')
            .attr('width', 1)
            .attr('height', contentHeight)
            .attr('zIndex', 2)
            .attr('fill', 'transparent');
        var rectContainer = svg.append('g')
            .classed('rect-container', true);
        var rects = rectContainer.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .classed('content', true)
            .attr('width', xAxisScale.step() / 3)
            .attr('height', function(d, i) {
                return contentHeight - yAxisScale(d.value);
            })
            .attr('x', function(d, i) {
                return xAxisScale(d.name) + leftMove;
            })
            .attr('y', function(d, i) {
                return yAxisScale(d.value) + topMove + 15;
            })
            .attr('rx', '16')
            .style('fill', '#12b5e4');

        // 添加柱的背景
        svg.append('g')
            .classed('bar-bg', true)
            .selectAll('rect.bg')
            .data(data)
            .enter()
            .append('rect')
            .classed('bg', true)
            .attr('width', xAxisScale.step() / 3)
            .attr('height', contentHeight)
            .attr('fill', 'rgba(255, 255, 255, 0.1)')
            .attr('x', function(d, i) {
                return xAxisScale(data[i].name) + leftMove;
            })
            .attr('y', function(d, i) {
                return topMove;
            })
            .attr('rx', '16')
            .on('mouseenter', function(data, index, nodes) {
                lineTrigger.attr('x', xAxisScale(xAxisTicks[index]) + leftMove + xAxisScale.bandwidth() / 3)
                    .attr('y', topMove)
                    .attr('fill', '#12b5e4');
                var event = d3.event;
                panelArgument.pos = {
                    x: event.clientX,
                    y: event.clientY
                }
                panelArgument.bindWidth = Math.round(xAxisScale.bandwidth()) + 10;
                panelArgument.data = data;
                updateDataPanel('show', panelArgument);
            })
            .on('mouseleave', function() {
                lineTrigger.attr('fill', 'transparent');
                updateDataPanel('hide');
            })
            .on('mousemove', function() {
                panelArgument.pos.x = d3.event.clientX;
                panelArgument.pos.y = d3.event.clientY;
                throttle(updateDataPanel, null, ['update', panelArgument]);
            });
        /**
         * 节流
         */
        function throttle(method, context, argument) {
            clearTimeout(method.interval);
            method.interval = setTimeout(function() {
                method.apply(context, argument);
            }, 15);
        }

        $('.blogBarChart').append('<div class="data-panel"><div class="content"></div></div>')
        var panel = {
            node: $('.blogBarChart .data-panel'),
            showing: false
        };
        var chartContainerPos = (function() {
            var container = $('.blogBarChart');
            return {
                width: container.width(),
                height: container.height(),
                top: container.offset().top,
                left: container.offset().left
            }
        })();

        function updateDataPanel(type, argument) {
            if (type == 'show') {
                show(argument);
            } else if (type == 'hide') {
                hide();
            } else if (type == 'update') {
                update(argument);
            }

            function show(argument) {
                updatePanelContent();
                panel.node.show();
                var originalHeight = panel.size ? panel.size.height : 0;
                panel.size = {
                    width: panel.node.width(),
                    height: panel.node.height()
                }
                panel.boundary = {
                    maxLeft: chartContainerPos.width + chartContainerPos.left - panel.size.width,
                    minLeft: chartContainerPos.left,
                    maxTop: chartContainerPos.height + chartContainerPos.top - panel.size.height,
                    minTop: chartContainerPos.top
                }
                panel.node.offset(getPos(argument));
            }

            function hide() {
                panel.node.hide();
            }

            function update() {
                panel.node.offset(getPos(argument));
            }

            function getPos(argument) {
                var result = {
                    top: argument.pos.y,
                    left: argument.pos.x
                }
                if (result.top < panel.boundary.minTop) {
                    result.top = result.top;
                } else if (result.top > panel.boundary.maxTop) {
                    result.top = result.top - panel.size.height;
                }
                if (result.left < panel.boundary.minLeft) {
                    result.left = panel.boundary.minLeft;
                } else {
                    result.left = result.left - 20;
                }

                result.top = result.top - 50;
                return result;
            }

            /**
             * 为panel添加内容
             * 设置需要隐藏的项
             * @return {[type]} [description]
             */
            function updatePanelContent() {
                var content = argument.data;
                panel.node.find('.content').text(content.name + '：' + content.value);
            }
        }

        var circleContainer1 = svg.append('g')
            .classed('circle1-container', true);
        var circleContainer2 = svg.append('g')
            .classed('circle2-container', true);
        circleContainer1.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) {
                return xAxisScale(d.name) + leftMove + xAxisScale.bandwidth() / 3;
            })
            .attr('cy', contentHeight + topMove)
            .attr('r', xAxisScale.bandwidth() / 3 - 5)
            .style('fill', '#031B38');
        circleContainer2.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) {
                return xAxisScale(d.name) + leftMove + xAxisScale.bandwidth() / 3;
            })
            .attr('cy', contentHeight + topMove)
            .attr('r', 3)
            .style('fill', '#12b5e4');
    }
};
IABS.drawWeChatBarChart = function() {
    var container = $('.weChatBarChart');
    var svgWidth = container.width(),
        svgHeight = container.height();
    var contentWidth = svgWidth - 100,
        contentHeight = svgHeight - 120;

    //图相对于svg的偏移量
    var leftMove = 70,
        topMove = 45;

    //坐标轴信息与轴的距离
    var tickPadding = 20,
        tickPaddingX = 5;

    var svg = d3.select('.weChatBarChart')
        .append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    var xAxisTicks = [],
        yAxisTicks = [];
    var xAxisScale, yAxisScale;
    //获取数据
    try {
        IABS.getWeChatData(drawWeChatBarChartWithData);
    } catch (e) {
        console.error(e.message);
    }

    /**
     * 需要使用数据进行绘制
     * 其他的操作不用放在这个方法里
     */
    function drawWeChatBarChartWithData(data) {
        var chartData = [];
        if (data.result === 'success') {
            for (var i = 0; i < data.content.length; i++) {
                var item = {};
                item.name = data.content[i].belongto;
                item.value = data.content[i].score;
                chartData.push(item);
            }
        } else {
            console.log('柱状图获取数据失败！');
        }
        for (var i = 0; i < chartData.length; i++) {
            xAxisTicks.push(chartData[i].name);
            yAxisTicks.push(chartData[i].value);
        }
        drawAxis();
        drawBar(chartData);
    }

    //添加横轴、纵轴、水平分割线
    function drawAxis() {
        // x轴比例尺
        xAxisScale = d3.scaleBand()
            .domain(xAxisTicks)
            .rangeRound([0, contentWidth])
            .paddingInner([0.5])
            .paddingOuter([0.5]);
        // x轴
        var xAxis = d3.axisBottom(xAxisScale)
            .tickSizeInner([0])
            .tickSizeOuter([0])
            .tickPadding([tickPaddingX]);
        // 添加坐标轴
        svg.append('g')
            .classed('axis-container xaxis', true)
            .attr('transform', 'translate(' + leftMove + ',' + (contentHeight + topMove) + ')')
            .call(xAxis);

        // y轴比例尺
        var yScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, yAxisTicks)])
            .range([0, contentHeight]);
        yAxisScale = d3.scaleLinear()
            .domain([0, Math.max.apply(Math, yAxisTicks)])
            .rangeRound([contentHeight, 0])
            .nice();

        //y轴
        var yAxis = d3.axisLeft(yAxisScale)
            .tickSizeInner([0])
            .tickSizeOuter([0])
            .ticks([6])
            .tickPadding([tickPadding]);
        svg.append('g')
            .classed('axis-container yaxis', true)
            .attr('transform', 'translate(' + leftMove + ', ' + topMove + ')')
            .call(yAxis);
        svg.select('.yaxis')
            .append('line')
            .attr('x1', 0)
            .attr('x2', 0)
            .attr('y1', 0)
            .attr('y2', contentHeight)
            .style('stroke', '#1e936b');
        $('.xAxis .tick text').attr('y', '30');

        var ticks = [];
        for (var i = 0; i < $('.yAxis .tick text').length; i++) {
            var obj = $('.yAxis .tick text').eq(i).text();
            var str = '';
            for (var j = 0; j < obj.length; j++) {
                if (obj.charAt(j) != ',') {
                    str += obj.charAt(j);
                }
            }
            ticks.push(parseInt(str));
        }
        for (var m = 0; m < ticks.length; m++) {
            if (ticks[m] / 10000 >= 1 && ticks[m] / 10000 < 100) {
                $('.yAxis .tick text').eq(m).text((ticks[m] / 10000) + "W");
            } else if (ticks[m] / 1000000 >= 1) {
                $('.yAxis .tick text').eq(m).text((ticks[m] / 1000000) + "M");
            } else {
                $('.yAxis .tick text').eq(m).text(ticks[m]);
            }
        }
        //添加水平分割线
        svg.append('g')
            .classed('divide-line-container', true)
            .selectAll('line')
            .data(ticks)
            .enter()
            .append('line')
            .classed('divide-line', true)
            .attr('x1', leftMove)
            .attr('x2', (leftMove + contentWidth))
            .attr('y1', function(d, i) {
                return yAxisScale(d) + topMove;
            })
            .attr('y2', function(d, i) {
                return yAxisScale(d) + topMove;
            })
            .style('fill', 'none')
            .style('stroke', function(d, i) {
                if (d == 0) {
                    return '#1e936b';
                } else {
                    return 'rgba(18, 54, 68, 0.3)';
                }
            });

        svg.append('g')
            .classed('divide-dots-container', true)
            .selectAll('circle')
            .data(ticks)
            .enter()
            .append('circle')
            .attr('cx', leftMove)
            .attr('cy', function(d, i) {
                return yAxisScale(d) + topMove;
            })
            .attr('r', 3);
    }

    // 添加柱
    function drawBar(data) {
        var panelArgument = {};
        var lineTrigger = svg.append('g')
            .classed('line-trigger', true)
            .append('rect')
            .attr('width', 1)
            .attr('height', contentHeight)
            .attr('zIndex', 2)
            .attr('fill', 'transparent');
        var rectContainer = svg.append('g')
            .classed('rect-container', true);
        var rects = rectContainer.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .classed('content', true)
            .attr('width', xAxisScale.step() / 3)
            .attr('height', function(d, i) {
                return contentHeight - yAxisScale(d.value);
            })
            .attr('x', function(d, i) {
                return xAxisScale(d.name) + leftMove;
            })
            .attr('y', function(d, i) {
                return yAxisScale(d.value) + topMove + 15;
            })
            .attr('rx', '16')
            .style('fill', '#1e936b');

        // 添加柱的背景
        svg.append('g')
            .classed('bar-bg', true)
            .selectAll('rect.bg')
            .data(data)
            .enter()
            .append('rect')
            .classed('bg', true)
            .attr('width', xAxisScale.step() / 3)
            .attr('height', contentHeight)
            .attr('fill', 'rgba(255, 255, 255, 0.1)')
            .attr('x', function(d, i) {
                return xAxisScale(data[i].name) + leftMove;
            })
            .attr('y', function(d, i) {
                return topMove;
            })
            .attr('rx', '16')
            .on('mouseenter', function(data, index, nodes) {
                lineTrigger.attr('x', xAxisScale(xAxisTicks[index]) + leftMove + xAxisScale.bandwidth() / 3)
                    .attr('y', topMove)
                    .attr('fill', '#1e936b');
                var event = d3.event;
                panelArgument.pos = {
                    x: event.clientX,
                    y: event.clientY
                }
                panelArgument.bindWidth = Math.round(xAxisScale.bandwidth()) + 10;
                panelArgument.data = data;
                updateDataPanel('show', panelArgument);
            })
            .on('mouseleave', function() {
                lineTrigger.attr('fill', 'transparent');
                updateDataPanel('hide');
            })
            .on('mousemove', function() {
                panelArgument.pos.x = d3.event.clientX;
                panelArgument.pos.y = d3.event.clientY;
                throttle(updateDataPanel, null, ['update', panelArgument]);
            });
        /**
         * 节流
         */
        function throttle(method, context, argument) {
            clearTimeout(method.interval);
            method.interval = setTimeout(function() {
                method.apply(context, argument);
            }, 15);
        }

        $('.weChatBarChart').append('<div class="data-panel"><div class="content"></div></div>')
        var panel = {
            node: $('.weChatBarChart .data-panel'),
            showing: false
        };
        var chartContainerPos = (function() {
            var container = $('.weChatBarChart');
            return {
                width: container.width(),
                height: container.height(),
                top: container.offset().top,
                left: container.offset().left
            }
        })();

        function updateDataPanel(type, argument) {
            if (type == 'show') {
                show(argument);
            } else if (type == 'hide') {
                hide();
            } else if (type == 'update') {
                update(argument);
            }

            function show(argument) {
                updatePanelContent();
                panel.node.show();
                var originalHeight = panel.size ? panel.size.height : 0;
                panel.size = {
                    width: panel.node.width(),
                    height: panel.node.height()
                }
                panel.boundary = {
                    maxLeft: chartContainerPos.width + chartContainerPos.left - panel.size.width,
                    minLeft: chartContainerPos.left,
                    maxTop: chartContainerPos.height + chartContainerPos.top - panel.size.height,
                    minTop: chartContainerPos.top
                }
                panel.node.offset(getPos(argument));
            }

            function hide() {
                panel.node.hide();
            }

            function update() {
                panel.node.offset(getPos(argument));
            }

            function getPos(argument) {
                var result = {
                    top: argument.pos.y,
                    left: argument.pos.x
                }
                if (result.top < panel.boundary.minTop) {
                    result.top = result.top;
                } else if (result.top > panel.boundary.maxTop) {
                    result.top = result.top - panel.size.height;
                }
                if (result.left < panel.boundary.minLeft) {
                    result.left = panel.boundary.minLeft;
                } else {
                    result.left = result.left - 20;
                }

                result.top = result.top - 50;
                return result;
            }

            /**
             * 为panel添加内容
             * 设置需要隐藏的项
             * @return {[type]} [description]
             */
            function updatePanelContent() {
                var content = argument.data;
                panel.node.find('.content').text(content.name + '：' + content.value);
            }
        }

        var circleContainer1 = svg.append('g')
            .classed('circle1-container', true);
        var circleContainer2 = svg.append('g')
            .classed('circle2-container', true);
        circleContainer1.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) {
                return xAxisScale(d.name) + leftMove + xAxisScale.bandwidth() / 3;
            })
            .attr('cy', contentHeight + topMove)
            .attr('r', xAxisScale.bandwidth() / 3 - 5)
            .style('fill', '#031B38');
        circleContainer2.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', function(d, i) {
                return xAxisScale(d.name) + leftMove + xAxisScale.bandwidth() / 3;
            })
            .attr('cy', contentHeight + topMove)
            .attr('r', 3)
            .style('fill', '#1e936b');
    }
}
