zbdp.initDrawMap = function(dataArr) {
    var target = '浙江';
    var ele = document.querySelector('.pub-sentiment-content-wrapper .map-ch');
    if (!ele) {
        alert('地图初始化失败');
        return;
    }
    if (!dataArr) {
        alert('地图初始化失败');
        return;
    }

    var geoCoord = zbdp.getGeoCoordData();
    // console.log(dataArr);
    //正面、中性、负面
    var colors = ['#00ff90', '#fff600', '#ff1e4b'];

    var myChart = echarts.init(ele);

    var option = {
        mapType: "china",
        backgroundColor: 'transparent',
        toolbox: {
            show: false
        },
        dataRange: {
            show: false,
            min: 0,
            max: 100,
            calculable: true,
            color: ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [{
            name: '全国',
            type: 'map',
            roam: false,
            hoverable: false,
            mapType: 'china',
            itemStyle: {
                normal: {
                    borderColor: '#2ea6c4',
                    borderWidth: 0.5,
                    areaStyle: {
                        color: '#0e141d'
                    },
                    label: {
                        show: false
                    }
                }
            },
            data: [],
            geoCoord: geoCoord
        }, {
            name: '舆情',
            type: 'map',
            mapType: 'china',
            data: [],
        }]
    };

    // 为echarts对象加载数据 
    myChart.setOption(option);

    /**
     * 飞线
     */
    var meteorData = getMeteorData(dataArr);

    var meteorOption = {};
    meteorOption.lines = meteorData;
    meteorOption.container = $(".meteor-container");
    meteorOption.speed = zbdp.configData.speed;
    meteorOption.scale = zbdp.getScaleAndLocation().scale;
    var meteorManager = new MeteorManager(meteorOption);
    meteorManager.run();

    var TMOption = {};
    TMOption.container = $(".meteor-container");
    TMOption.interval = zbdp.configData.twinkle.interval || 10;
    TMOption.scale = zbdp.getScaleAndLocation().scale;
    var twinkleManager = new TwinkleManager(TMOption);
    twinkleManager.update(meteorData);

    function getMeteorData(mapData) {
        var result = [];
        var endPointPos = myChart.chart.map.getPosByGeo(option.mapType, geoCoord[target] || []);
        var endPoint = {};
        if (endPointPos.length > 0) {
            endPoint.x = endPointPos[0];
            endPoint.y = endPointPos[1];
        } else {
            retrun;
        }

        for (var i = 0; i < mapData.length; i++) {
            var meteorDataItem = {};
            var data = mapData[i];
            meteorDataItem.val = data.value;
            meteorDataItem.name = data.name;
            var startPointPos = myChart.chart.map.getPosByGeo(option.mapType, data.geo);
            meteorDataItem.startPoint = {};
            meteorDataItem.startPoint.x = startPointPos[0];
            meteorDataItem.startPoint.y = startPointPos[1];
            meteorDataItem.endPoint = endPoint;
            result.push(meteorDataItem);
        }

        return result;
    }



    zbdp.updateMap = function(dataArr) {
        if (!myChart) {
            return;
        }
        var lines = getMeteorData(dataArr)
        meteorOption.lines = lines;
        meteorManager.update(meteorOption);
        meteorManager.run();
        twinkleManager.update(lines);
    }
}
