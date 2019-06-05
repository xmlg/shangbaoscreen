// 地图
IABS.initdrawMap = function() {
    try {
        IABS.getChongqing_map(getCQData);
        IABS.getQuanguo_map(getQGData);
        IABS.getChongqing_maplist(Newslist);
    } catch (e) {
        console.error(e.message);
    }

    // 获取坐标
    function getCoordinate(name, areaDtas) {
        for (var j = 0; j < areaDtas.length; j++) {
            var areaDta = areaDtas[j];
            if (areaDta.area == name) {
                return areaDta.coordinate;
            }
        }
    }

    // 格式化数据
    function formatData(data, areaDtas, type) {
        var formatData = [];
        for (var i = 0; i < data.content.length; i++) {
            var content = data.content[i];
            var temp = {
                name: "",
                value: "",
                hotvalue: "",
                title: ""
            };
            temp.name = content.AREA;
            temp.value = getCoordinate(content.AREA, areaDtas);
            temp.hotvalue = content.HOTPOINTNUM;
            temp.title = content.SHORTTITLE;
            if (temp.value) {
                temp.value.push(parseInt(temp.hotvalue));
                formatData.push(temp);
            }
        }
        return formatData;
    }

    // 获取坐标集合,将坐标转化成像素
    function coordinateSet(data, areaDtas, chongQingChart) {
        var coordinate = [];
        for (var i = 0; i < data.content.length; i++) {
            var content = data.content[i];
            var value = getCoordinate(content.AREA, areaDtas);
            coordinate.push(value);
        }
        var geoTemps = [];
        for (var j = 0; j < coordinate.length; j++) {
            var geoTemp = coordinate[j];
            var geos;
            if (!geoTemp) {
                geos = "";
            } else {
                if (geoTemp.length > 2) {
                    geoTemp.pop();
                }
                geos = chongQingChart.convertToPixel({
                    seriesIndex: 0
                }, geoTemp);
            }
            geoTemps.push(geos);
        }
        return geoTemps;
    }
    
    //地图列表数据
    function Newslist(data) {
        var updataOpt = {
            id: "",
            value: 40, //圈内的值
            radius: 20, //半径
            width: 4, // 弧度宽度
            duration: 200,
            colors: ['#153D57', '#429EDF'],
            textClass: 'circles-text',
            valueStrokeClass: 'circles-valueStroke'
        };

        for (var i = 0; i < data.content.length; i++) {
            var content = data.content[i];
            var html = '<li id="newLi_' + i + '"><div class="newList"><div class="titleDiv"><span>' + content.TITLE + '</span></div></div>' +
                '<div class="circle" id="newList_' + i + '"></div></li>';
            $(".chongQingNewList ul").append(html);
            updataOpt.id = 'newList_' + i;
            updataOpt.value = content.HOTPOINTNUM;
            Circles.create(updataOpt);
        }
    }

    function getCQData(data) {
        if (data.result == 'success') {
            $.ajax({
                type:"get",
                url:'lib/echarts/src/util/echartMap/map/city/440300.json',
                success:function(placeJson){
                    echarts.registerMap("深圳",placeJson);
                    // 将数据转化成echarts使用的打data
                    var areaDtas = IABS.getChongQingData();
                    var mapData = formatData(data, areaDtas, "yaAn");
                    var chongQingOption = {
                        title: {
                            show: false,
                            text: '全区视频监控信息采集热力图',
                            left: 'center',
                            textStyle: {
                                color: '#fff',
                                fontSize: 22,
                                fontWeight: 'normal'
                            }
                        },
                        legend: {},
                        visualMap: {
                            show: false,
                            min: 0,
                            max: 100,
                            calculable: false,
                            inRange: {
                                color: ['#825747', '#FFC001']
                            },
                            itemHeight: 100,
                            top: '10%',
                            left: '15%'
                        },
                        geo: {
                            map: '深圳',
                            layoutCenter: ['50%', '50%'],
                            layoutSize: '110%',
                            label: {
                                normal: {
                                    show: false,
                                    textStyle: {
                                        color: '#fff',
                                        fontFamily: 'Microsoft YaHei'
                                    }
                                },
                                emphasis: {
                                    show: false,
                                    textStyle: {
                                        color: '#fff',
                                        fontFamily: 'Microsoft YaHei'
                                    }
                                }
                            },
                            layoutCenter: ['50%', '50%'],
                            // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
                            layoutSize: 600,
                            itemStyle: {
                                normal: {
                                    borderColor: '#225574',
                                    borderWidth: 2,
                                    areaColor: '#111924',
                                    // shadowColor: 'red',
                                    // shadowOffsetX : 10
                                },
                                emphasis: {
                                    areaColor: '#323c48'
                                }
                            }
                        },
                        series: [{
                            name: '视频监控采集数量',
                            type: 'effectScatter',
                            // type: 'map',
                            mapType: "深圳",
                            coordinateSystem: 'geo',
                            data: mapData,
                            symbol: 'circle',
                            symbolSize: function(params) {
                                return params[2] / 5;
                            },
                            rippleEffect: {
                                //特效宽度不可控，通过改动源码46616实现2px宽度
                                scale: 10, //控制动画半径
                                brushType: 'fill'
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            }
                        }, {
                            name: '视频监控采集数量2',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            data: mapData,
                            symbol: 'circle',
                            symbolSize: function(params) {
                                return params[2] / 5;
                            },
                            rippleEffect: {
                                //特效宽度不可控，通过改动源码46616实现2px宽度
                                scale: 10, //控制动画半径
                                brushType: 'stroke'
                            },
                            label: {
                                normal: {
                                    show: false
                                },
                                emphasis: {
                                    show: false
                                }
                            }
                        }]
                    };
                    var geoTemps;
                    var chongQingChart = echarts.init($('.mapChongQing').get(0));
                    setTimeout(function() {
                        chongQingChart.setOption(chongQingOption);
                        geoTemps = coordinateSet(data, areaDtas, chongQingChart);
                    }, 600);
                    var isfirst = false;
        
                    function changePrompt(showTitle, index) {
                        if (isfirst) {
                            setTimeout(function() {
                                $('.promptBox .tips span').text(showTitle);
                            }, 1000);
                        } else {
                            setTimeout(function() {
                                $('.promptBox .tips span').text(showTitle);
                            }, 100);
                            isfirst = true;
                        }
        
                        var x = 130;
                        var y = 116;
                        geoTemp = geoTemps[index];
                        if (geoTemp) {
                            var left = (parseInt(geoTemp[0]) + x - 200) + "px";
                            var top = (parseInt(geoTemp[1]) + y - 174) + "px";
                            $('.promptBox').css('left', left);
                            $('.promptBox').css('top', top);
                            $('.promptBox').show();
                        }
                    }
        
                    // 轮播
                    var idnex = 0;
        
                    function carousel(data) {
                        var time = isfirst ? 1000 : 100;
                        // setTimeout(function() {
                        // 	if (idnex == 0) {
                        // 		$('#newLi_9 .titleDiv').css('color', '#47A1E0');
                        // 		$('#newLi_9 .circles-valueStroke').css('stroke', '#47A1E0');
                        // 	} else {
                        // 		$('#newLi_' + (idnex - 1) + ' .titleDiv').css('color', '47A1E0');
                        // 		$('#newLi_' + (idnex - 1) + ' .circles-valueStroke').css('stroke', '47A1E0');
                        // 	}
                        // 	$('#newLi_' + idnex + ' .titleDiv').css('color', 'D59379');
                        // 	$('#newLi_' + idnex + ' .circles-valueStroke').css('stroke', 'D59379');
                        // }, time);
                        var showTitle = data.content[idnex].TITLE;
                        showTitle = showTitle.length > 20 ? showTitle.substring(0, 20) + '...' : showTitle;
        
                        changePrompt(showTitle, idnex);
        
                        setTimeout(function() {
                            idnex = idnex + 1;
                            if (idnex > data.content.length - 1) {
                                idnex = 0;
                            }
                            carousel(data);
                        }, 2000);
                    }
                    setTimeout(function() {
                        $('.chongQingMap .tips').show();
                        carousel(data);
                    }, 4000);
                }
            });

        }
    }

    function getQGData(data) {
        if (data.result == 'success') {

            var areaDtas = IABS.getChinaData();
            var chinaMapData = formatData(data, areaDtas, "quangGu");

            var chinaOption = {
                title: {
                    show: false,
                    text: '全区视频监控信息采集热力图',
                    left: 'center',
                    textStyle: {
                        color: '#fff',
                        fontSize: 22,
                        fontWeight: 'normal'
                    }
                },
                legend: {},
                visualMap: {
                    show: false,
                    min: 0,
                    max: 100,
                    calculable: false,
                    inRange: {
                        // '#01E7FE', '#00E8FF', '#121122',
                        color: ['#009EFF', '#FFC001']
                    },
                    itemHeight: 100,
                    top: '10%',
                    left: '5%'
                },
                geo: {
                    map: 'china',
                    layoutCenter: ['50%', '50%'],
                    layoutSize: '110%',
                    label: {
                        normal: {
                            show: false,
                            textStyle: {
                                color: '#fff',
                                fontFamily: 'Microsoft YaHei'
                            }
                        },
                        emphasis: {
                            show: false,
                            textStyle: {
                                color: '#fff',
                                fontFamily: 'Microsoft YaHei'
                            }
                        }
                    },
                    layoutCenter: ['50%', '50%'],
                    // 如果宽高比大于 1 则宽度为 100，如果小于 1 则高度为 100，保证了不超过 100x100 的区域
                    layoutSize: 450,
                    itemStyle: {
                        normal: {
                            borderColor: '#225574',
                            borderWidth: 2,
                            areaColor: '#111924',
                            // shadowColor: 'red',
                            // shadowOffsetX : 10
                        },
                        emphasis: {
                            areaColor: '#323c48'
                        }
                    }
                },
                series: [{
                    name: '视频监控采集数量2',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: chinaMapData,
                    symbol: 'circle',
                    symbolSize: function(params) {
                        return params[2] / 5;
                    },
                    rippleEffect: {
                        //特效宽度不可控，通过改动源码46616实现2px宽度
                        scale: 6, //控制动画半径
                        brushType: 'stroke'
                    },
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false
                        }
                    }
                }]
            };
            var chinaChart = echarts.init($('.MapChart').get(0));
            setTimeout(function() {
                chinaChart.setOption(chinaOption);
            }, 600);

            function QGNewslist(data) {
                for (var j = 0; j < data.content.length; j++) {
                    var content = data.content[j];
                    var html = '<li class=QGnewList_' + j + '><span class="newcontent">' + content.TITLE + '</span>' +
                        '<span class="newHotNum">' + content.HOTPOINTNUM + '</span></li>';
                    $('.chinaMaps .hotNewList ul').append(html);
                }
            }
            QGNewslist(data);

            // 循环播放
            var index = 0;

            function play(data) {
                if (index == 0) {
                    $('.QGnewList_4').css('color', '#47A1E0');
                } else {
                    $('.QGnewList_' + (index - 1)).css('color', '#47A1E0');
                }
                $('.QGnewList_' + index).css('color', '#D59379');
                setTimeout(function() {
                    index = index + 1;
                    index = index > 4 ? 0 : index;
                    play(data);
                }, 2000)
            }
            setTimeout(function() {
                play(data);
            }, 4000);
        }
    }

};