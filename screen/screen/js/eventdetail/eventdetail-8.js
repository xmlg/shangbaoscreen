App.prototype.renderSection8 = function() {
    var self = this;

    var svg1 = echarts.init(document.getElementById('section-8-svg1'));
    var svg2 = echarts.init(document.getElementById('section-8-svg2'));

    var innerData = self.sectionData_8.inner;
    var outerData = self.sectionData_8.outer;

    var data1 = [];
    var data2 = [];

    var innerColorScale = d3.scale.linear()
        .domain(d3.extent(innerData, function(d, i) {
            return d.IRECORDNUM;
        }))
        .range(['#188EA3', '#4ED0ED'])
        .clamp(true);

    var outerColorScale = d3.scale.linear()
        .domain(d3.extent(outerData, function(d, i) {
            return d.IRECORDNUM;
        }))
        .range(['#A18028', '#EAE33B'])
        .clamp(true);
    var innerValueScale = d3.scale.linear()
        .domain(d3.extent(innerData, function(d, i) {
            return d.IRECORDNUM;
        }))
        .range([2000, 20000])
    var outerValueScale = d3.scale.linear()
        .domain(d3.extent(outerData, function(d, i) {
            return d.IRECORDNUM;
        }))
        .range([2000, 20000])
    function innercolor(value) {
        return {
            normal: {
                color: innerColorScale(value),
            }
        };
    }
    function outercolor(value) {
        return {
            normal: {
                color: outerColorScale(value),
            }
        };
    }
    $.each(innerData, function (i) {
        var singleword1 = {};
        var value = innerData[i].IRECORDNUM
        singleword1.name = innerData[i].STRVALUE;
        singleword1.value = innerValueScale(innerData[i].IRECORDNUM);
        singleword1.itemStyle = innercolor(value);
        data1.push(singleword1)
    });
    $.each(outerData, function (i) {
        var singleword2 = {};
        var value = outerData[i].IRECORDNUM
        singleword2.name = outerData[i].STRVALUE;
        singleword2.value = outerValueScale(outerData[i].IRECORDNUM);
        singleword2.itemStyle =  outercolor(value);
        data2.push(singleword2)
    })

 //   console.log(data1,data2)

    var option1 = {
        tooltip: {
            show: false
        },
        series: [{
            type: 'wordCloud',
            size: ['99%', '99%'],
            textRotation: [0,0,0,45,-45],
            textPadding: 2,

            autoSize: {
                enable: true,
                minSize: 15,
                maxSize: 45
            },
            itemStyle:{
                normal:{
                    textStyle:{
                        fontFamily:"SimHei"
                    }
                }
            },
            data:data1
        }]
    };
    var option2 = {
        tooltip: {
            show: false
        },
        series: [{
            type: 'wordCloud',
            size: ['99%', '99%'],
            textRotation: [0,0,0,45,-45],
            textPadding: 2,

            autoSize: {
                enable: true,
                minSize: 15,
                maxSize: 45
            },
            itemStyle:{
                normal:{
                    textStyle:{
                        fontFamily:"SimHei"
                    }
                }
            },
            data:data2
        }]
    };


    svg2.setOption(option2);
    svg1.setOption(option1);



};