IABS.drawRose = function() {
    var myChart = echarts.init(document.getElementById('rose_content'));
    var roseData = [];
    try {
        IABS.getRoseData(drawRoseWithData);
    } catch (e) {
        console.log(e.message);
    }

    function drawRoseWithData(data) {
        formatData(data);
        // 指定图表的配置项和数据
        var option = {
            title: {
                show: false,
            },
            tooltip: {
                show: false,
                trigger: 'item',
                formatter: "{b} : {d}%",
                textStyle: {
                    color: 'white', //标签文字颜色
                    fontSize: 18,
                },
            },
            legend: {
                show: false,
            },
            toolbox: {
                show: false,

            },
            color: ['#44503A', '#07888E', '#195A57', '#208178', '#286266', '#05A9AE', '#0A5058', '#1D9069', '#143D37', '#5F6D49'], //每块元素的颜色
            calculable: true,
            series: [{
                name: '面积模式',
                type: 'pie',
                radius: [80, 350],
                center: ['47%', '60%'],
                roseType: 'area',
                data: roseData,
                selected: true,
                selectedMode: 'multiple',
                selectedOffset: 8,
                silent: true,
                label: { //线条引出的文字标签
                    normal: {
                        textStyle: {
                            color: '#77FFFF', //标签文字颜色
                            fontSize: 24,
                            fontFamily: '微软雅黑',
                        },
                        formatter: '{b}\n{c}',
                    }
                },
                itemStyle: { //每块样式
                    normal: {
                        borderColor: '#A9F7FA',
                        borderWidth: 1.5,
                        shadowBlur: 20, //阴影模糊程度
                        shadowColor: 'rgba(0, 0, 0, 0.5)' //阴影的颜色
                    }
                },
                labelLine: { //标签连接的线条
                    normal: { //默认状态
                        lineStyle: {
                            color: '#00F0FF' //线条颜色
                        },
                        smooth: 0, //线条的笔直程度
                        length: 30, //线条上一节的长度
                        length2: 50 //线条下一节的长度
                    }
                },
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);

    }

    function formatData(data) {
        if (data.result === 'success') {
            for (var i = 0; i < data.content.length; i++) {
                var item = {};
                item.value = data.content[i].avgceiindex;
                item.name = data.content[i].belongto;
                roseData.push(item);
            }
        } else {
            console.log('玫瑰图获取数据失败！');
        }

    }
}
