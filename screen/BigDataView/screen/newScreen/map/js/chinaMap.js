 var MAP = function(complete) {
    this.onComplete=complete;
    this.CEIURL=connectUrl("http://111.203.35.59/cas/casData/screenJson?type=threeProvinceCei");
    this.CHINAPURL="chinap.json";
    this.HEBEIURL="json/hebei.json";
 };
    MAP.prototype.reloadData = function() {};
    MAP.prototype.getData = function() {
        var map = this;
        queue()
            .defer(d3.json, this.CHINAPURL||"chinap.json")
            .defer(d3.json, this.HEBEIURL||"json/hebei.json")
            .await(function(error, chinaMapData, hebeiMapData) {

                var georoot = topojson.feature(chinaMapData, chinaMapData.objects.chinap);
                hebeiMapData.features.forEach(function(_HBitem, _HBindex) {
                    _HBitem.id = "河北";
                });

                map.mapData = georoot;
                map.mapHBData = hebeiMapData;
                map.drawMap();
            });

    };
    MAP.prototype.drawMap = function() {
        var map = this;
        this.feature = this.feature
            .data(this.mapData.features)
            .enter().append("path")
            .attr("class", "feature").
        attr("id", function(d) {
            return "path_" + d.properties.name;
        })
       // map.feature.attr("d", map.path);



        
        this.getColorData();
        this.drawSouthArea();



    };

    MAP.prototype.drawSouthArea = function() {
        var map = this;
        // this.mapSvg.html(function(d) {
        //     return d3.select(this).html() + map.southchinaSvg.getElementsByTagName("g")[0].outerHTML;
        // });
        var gSouthSea = map.mapSvg.append("g");
        gSouthSea.append("line").attr("y2", 7).attr("x2", 145).attr("y1", 7).attr("x1", 20);
        gSouthSea.append("line").attr("y2", 24).attr("x2", 6).attr("y1", 7).attr("x1", 20);
        gSouthSea.append("line").attr("y2", 195).attr("x2", 145).attr("y1", 7).attr("x1", 145);
        gSouthSea.append("line").attr("y2", 195).attr("x2", 6).attr("y1", 24).attr("x1", 6);
        gSouthSea.append("line").attr("y2", 195).attr("x2", 145).attr("y1", 195).attr("x1", 6);
        gSouthSea.append("path").attr("d", "m6,31.5l9,7.5l15,9l15,4l18,0l17,-14l21,-31L20,7L6,24z");
        gSouthSea.append("path").attr("d", "m113,7l10,25l11,-25z");
        gSouthSea.append("path").attr("d", "m46.5,66.5l14.5,-6.5l-1,13l-7,7l-15,4l8.5,-17.5z");
        gSouthSea.append("line").attr("y2", 46.5).attr("x2", 132.5).attr("y1", 31.5).attr("x1", 141.5);
        gSouthSea.append("line").attr("y2", 76.5).attr("x2", 115.5).attr("y1", 61.5).attr("x1", 121.5);
        gSouthSea.append("line").attr("y2", 111.5).attr("x2", 110.5).attr("y1", 92.5).attr("x1", 110.5);
        gSouthSea.append("line").attr("y2", 147.5).attr("x2", 101.5).attr("y1", 127.5).attr("x1", 108.5);
        gSouthSea.append("line").attr("y2", 177.5).attr("x2", 78.5).attr("y1", 163.5).attr("x1", 91.5);
        gSouthSea.append("line").attr("y2", 188.5).attr("x2", 39.5).attr("y1", 184.5).attr("x1", 54.5);
        gSouthSea.append("line").attr("y2", 158.5).attr("x2", 11.5).attr("y1", 172.5).attr("x1", 17.5);
        gSouthSea.append("line").attr("y2", 132.5).attr("x2", 39.5).attr("y1", 142.5).attr("x1", 24.5);
        gSouthSea.append("line").attr("y2", 98.5).attr("x2", 37.5).attr("y1", 113.5).attr("x1", 40.5);



        gSouthSea.attr("transform", "translate(" + (this.w / 6 * 4.1) + "," + (this.h / 6 * 5) + ") scale(0.5)")
            .attr("class", "southsea").attr("border", "1");
    }

    MAP.prototype.getColorData = function() {
        var map = this;
        var ss = this.CEIURL||"/cas/casData/screenJson?type=threeProvinceCei";
        queue()
            .defer(d3.json, this.CEIURL||"/cas/casData/screenJson?type=threeProvinceCei")
            .await(function(error, provinceCeiData) {
                provinceCeiData = provinceCeiData.DATA
                //if(MAPurl&&MAPurl!==''){
                //console.log(ss)
                //console.log(ss.indexOf('pubTimeStart'));
                if((ss.indexOf('type=provinceCei')<0) && ss.indexOf('pubTimeStart')<0  ){
                    map.mapData.features.forEach(function (_item, _index) {
                        provinceCeiData.forEach(function ($item, $index) {
                            if (_item.properties.name == $item.areaPY) {
                                _item.cei = $item.cei;
                                _item.CHNAME = $item.area;
                                if (_item.properties.name == "HEBEI") {
                                    map.mapHBData.features.forEach(function (_HBitem, _HBindex) {
                                        _HBitem.cei = $item.cei;
                                        _HBitem.CHNAME = $item.area;
                                        //_HBitem.properties.name="HEBEI";
                                        _HBitem.id = "河北";
                                    });
                                }
                            }
                        })


                    });
                }else {

                    /////
                    map.mapData.features.forEach(function (_item, _index) {
                        provinceCeiData.forEach(function ($item, $index) {
                            if (_item.properties.name == $item.areaPY) {
                                //不去除if else防止需要修改cei为num;
                                _item.cei = $item.cei;
                                _item.CHNAME = $item.area;
                                if (_item.properties.name == "HEBEI") {
                                    map.mapHBData.features.forEach(function (_HBitem, _HBindex) {
                                        _HBitem.cei = $item.cei;
                                        _HBitem.CHNAME = $item.area;
                                        //_HBitem.properties.name="HEBEI";
                                        _HBitem.id = "河北";
                                    });
                                }
                            }
                        })


                    });
                }
                //////
                map.provinceCeiData = provinceCeiData;
                map.drawMapColor();
                map.onComplete&&(typeof map.onComplete=='function')&&map.onComplete();
            });

            setTimeout(function(){
                map.getColorData();
            },1000*60*30);

    };
    MAP.prototype.drawMapColor = function() {
        var map = this;
        var ceiValues = {};
        var _ceiVals = [];
        this.provinceCeiData.forEach(function(item, i) {
            //            console.log(item);
            var itemName = item.areaPY;
            //var itemVal = typeof item.cei == 'number' ? item.cei : parseInt(item.cei.replace(/,/, ''));
            //进行修改 用转载量表示颜色
            var itemVal =item.num;
            //            console.log(itemVal)
            ceiValues[itemName] = itemVal;
            _ceiVals.push(itemVal);
        });
        //求最大值和最小?
        var maxvalue = d3.max(_ceiVals, function(d) {
            return d; /*console.log(d.value); return d.value?d.value:0;*/
        });
        var minvalue = 0;

        //定义一个线性比例尺，将最小值和最大值之间的值映射到[0, 1]
        var linear = d3.scale.linear()
            .domain([minvalue, maxvalue])
            .range([0, 1]);
        //定义最小值和最大值对应的颜色
        var c = d3.rgb(5, 213, 232);
        var a = d3.rgb(255, 255, 0); //浅黄?
        var b = d3.rgb(255, 0, 0); //红色

        //颜色插值函?
        var computeColor = d3.interpolate(c, a);

        this.feature
            //.style("fill","#fafafa")
            //.transition()
            //.duration(15000)
            //.ease("linear")
            .style("fill", function(d, i) {
            var count = ceiValues[d.properties.name] ? ceiValues[d.properties.name] : 0;
            if(count===0) return "#d4f4ef";
            var t = linear(count * 6);
            var color = computeColor(t);
            return color.toString();
        });
        var defs = this.mapSvg.append("defs");
        var linearGradient = defs.append("linearGradient")
            .attr("id", "linearColor")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");

        var stop1 = linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", c.toString());

        var stop2 = linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", a.toString());
            //添加一个矩形，并应用线性渐?
                var colorRect = map.mapSvg.append("rect")
                    .attr("x", $(document).width() - 300)
                    .attr("y", $(document).height() - 50)
                    .attr("width", 140)
                    .attr("height", 30)
                    .style("fill", "url(#" + linearGradient.attr("id") + ")");

                //添加文字
                var explanText = map.mapSvg.append("text")
                    .attr("class", "valueText")
                    .attr("x", $(document).width() - 300)
                    .attr("y", $(document).height() - 50)
                    .attr("dy", "-0.3em")
                    .style("fill", "#fff")
                    .text(function() {
                        return "影响力：";
                    });
                var minValueText = map.mapSvg.append("text")
                    .attr("class", "valueText")
                    .attr("x", $(document).width() - 330)
                    .attr("y", $(document).height() - 25)
                    .attr("dy", "-0.3em")
                    .style("fill", "#fff")
                    .text(function() {
                        return "Min";
                    });

                var maxValueText = map.mapSvg.append("text")
                    .attr("class", "valueText")
                    .attr("x", $(document).width() - 150)
                    .style("fill", "#fff")
                    .attr("y", $(document).height() - 25)
                    .attr("dy", "-0.3em")
                    .text(function() {
                        return "Max";
                    });
        map.feature.attr("d", map.path);

    };
    MAP.prototype.ctr = function(d) {
        return "translate(" + projection([d.longitude, d.latitude]) + ")";
    }

    MAP.prototype.init = function() {
        this.w = document.body.clientWidth;
        this.h = document.body.clientHeight;
        var map = this;
        this.sizes = d3.scale.linear()
            .range([4, 400]);

        this.projection = d3.geo.mercator().scale(this.w / 1.82)
            .translate([this.w / 2, this.h / 1.38]).center([107, 31]);;

        this.path = d3.geo.path()
            .projection(this.projection);

        this.mapSvg = d3.select(document.body)
            .append("div")
            .attr("id", "map")
            .append("svg");
        this.feature = this.mapSvg
            .selectAll("path.feature");

    };

    MAP.prototype.show = function() {
        this.init();
        this.getData(this.drawMap);
    }


