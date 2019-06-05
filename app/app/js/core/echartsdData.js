// 雅安地图数据
IABS.getChongqing_map = function(fn) {

    getResquestUrl(IABS.domain + "/data/4/data1.json",fn);

    //fn(data);
};

//雅安地图列表数据
IABS.getChongqing_maplist = function(fn){
    getResquestUrl(IABS.domain + "/data/4/data1.json",fn);
    //  $.ajax({
    //      type: "get",
    //      //dataType :'json',
    //      url: IABS.domain + "/data/4/data1.json",
    //      data: "cluster_name=provice_1&pageNum=0&pageSize=10",
    //      success: function(data) {
    //          try {
    //             //  fn(JSON.parse(data));
    //             fn(data);
    //          } catch (e) {
    //              console.error(e);
    //          }
    //      }
    //  });
 };

// 返回全国数据
IABS.getQuanguo_map = function(fn) {
    getResquestUrl(IABS.domain + "/data/4/quanguodata.json",fn);
    // $.ajax({
    //     type: "get",
    //     url: IABS.domain + "/data/4/data2.json",
    //     data: "cluster_name=country_1&pageNum=0&pageSize=5",
    //     success: function(msg) {
    //         try {
    //             fn(JSON.parse(msg));
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // });

};

// 垂直行热点分布
IABS.getHotNews_right = function(fn) {
    $.ajax({
        type: "post",
        url: IABS.domain + "/zyzx/BigScreen/findTop",
        data: "mediaName=paper&timeRange=1",
        success: function(data) {
            try {
                fn(JSON.parse(data));
            } catch (e) {
                console.error(e);
            }
        }
    });
};

//雅安热点分布
IABS.getYANews_right = function(fn) {
    getResquestUrl(IABS.domain + "/data/4/yanews.json",fn);
    // $.ajax({
    //     type: "post",
    //     url: IABS.domain + "/zyzx/BigScreen/hotpointcluster",
    //     data: "zyzxfiled=zyzxfield_000&listNum=3&isLocal=true",
    //     success: function(data) {
    //         try {
    //             fn(JSON.parse(data));
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // });
};
//全国热点分布
IABS.getQGNews_right = function(fn) {
    getResquestUrl(IABS.domain + "/data/4/qgnews.json",fn);
    // $.ajax({
    //     type: "post",
    //     url: IABS.domain + "/zyzx/BigScreen/hotpointcluster",
    //     data: "zyzxfiled=zyzxfield_000&listNum=3&isLocal=false",
    //     success: function(data) {
    //         try {
    //             fn(JSON.parse(data));
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // });
};

//灾害热点分布
IABS.getZHNews_right = function(fn) {
    getResquestUrl(IABS.domain + "/data/4/zhnews.json",fn);
    // $.ajax({
    //     type: "post",
    //     url: IABS.domain + "/zyzx/BigScreen/disasterSearch",
    //     data: "pageNum=0&pageSize=8",
    //     success: function(data) {
    //         try {
    //             fn(JSON.parse(data));
    //         } catch (e) {
    //             console.error(e);
    //         }
    //     }
    // });
};

// 头版头条热点 —— 纸媒
IABS.getHeadlines_paper = function(fn, ele, max) {
    // var data = {
    //     "summary_info": {    
    //         "MaxHotPoint": 200, // 返回数据中的最大转载数
    //     },
    //     "CONTENT": [{ 
    //         "HOTPOINTNUM": 200, // 返回转载数
    //          "TITLE": "教育部开通高校生资助热线",
    //         "SOURCE": "南方日报"
    //     }, { 
    //         "HOTPOINTNUM": 50,
    //          "TITLE": "明年西南又快有一个中超球队了",
    //         "SOURCE": "南方日报"
    //     }, { 
    //         "HOTPOINTNUM": 20,
    //          "TITLE": "重庆巫山干旱致5000亩烤烟绝收",
    //         "SOURCE": "南方日报"
    //     }]
    // };

    $.ajax({
        // type: "post",
        // url: IABS.domain + "/zyzx/BigScreen/media",
        type: "get",
        url: IABS.domain + "/data/4/data_media.json",
        data: "mediaName=paper&timeRange=1",
        success: function(data) {
            try {
                // var data = JSON.parse(res);
                max = data.summary_info.MaxHotPoint;
                fn(data, ele, max);
            } catch (e) {
                console.error(e);
            }
        }
    });
};

// 头版头条热点 —— 网媒
IABS.getHeadlines_net = function(fn, ele, max) {
    var data = {
        "summary_info": {    
            "MaxHotPoint": 100, // 返回数据中的最大转载数
        },
        "CONTENT": [{ 
            "HOTPOINTNUM": 100, // 返回转载数
             "TITLE": "重庆，你再次震撼了亚洲，震惊了世界！",
            "SOURCE": "南方日报"
        }, { 
            "HOTPOINTNUM": 54,
             "TITLE": "222教育部开通高校生资助热线",
            "SOURCE": "南方日报"
        }, { 
            "HOTPOINTNUM": 34,
             "TITLE": "333教育部开通高校生资助热线",
            "SOURCE": "南方日报"
        }]
    };
    $.ajax({
        // type: "post",
        // url: IABS.domain + "/zyzx/BigScreen/media",
        type: "get",
        url: IABS.domain + "/data/4/data_media2.json",
        data: "mediaName=net&timeRange=1",
        success: function(data) {
            // var data = JSON.parse(data)
            max = data.summary_info.MaxHotPoint;
            fn(data, ele, max);
        }
    });

};

IABS.getChongQingData = function() {
    return [{
        "area": "南山区",
        "coordinate": [113.936181,22.539169]
    }, {
        "area": "盐田区",
        "coordinate": [114.234562,22.578686]
    }, {
        "area": "宝安区",
        "coordinate": [113.90916,22.750504]
    }, {
        "area": "福田区",
        "coordinate": [114.057488,22.534896]
    }, {
        "area": "龙岗区",
        "coordinate": [114.239162,22.712104]
    }, {
        "area": "罗湖区",
        "coordinate": [114.165572,22.578686]
    }];
    // return [{
    //     "area": "雨城区",
    //     "coordinate": [103.00, 29.98]
    // }, {
    //     "area": "荥经县",
    //     "coordinate": [102.85, 29.80]
    // }, {
    //     "area": "汉源县",
    //     "coordinate": [102.65, 29.35]
    // }, {
    //     "area": "石棉县",
    //     "coordinate": [102.37, 29.23]
    // }, {
    //     "area": "天全县",
    //     "coordinate": [102.75, 30.07]
    // }, {
    //     "area": "芦山县",
    //     "coordinate": [102.92, 30.15]
    // }, {
    //     "area": "宝兴县",
    //     "coordinate": [102.82, 30.37]
    // }, {
    //     "area": "名山县",
    //     "coordinate": [103.12, 30.08]
    // }];
};

IABS.getChinaData = function() {
    return [{
        "coordinate": [121.509062, 25.044332],
        "area": "台湾"
    }, {
        "coordinate": [114.502461, 38.045474],
        "area": "河北"
    }, {
        "coordinate": [112.549248, 37.857014],
        "area": "山西"
    }, {
        "coordinate": [111.670801, 40.818311],
        "area": "内蒙古"
    }, {
        "coordinate": [123.429096, 41.796767],
        "area": "辽宁"
    }, {
        "coordinate": [125.3245, 43.886841],
        "area": "吉林"
    }, {
        "coordinate": [126.642464, 45.756967],
        "area": "黑龙江"
    }, {
        "coordinate": [118.767413, 32.041544],
        "area": "江苏"
    }, {
        "coordinate": [120.153576, 30.287459],
        "area": "浙江"
    }, {
        "coordinate": [117.283042, 31.86119],
        "area": "安徽"
    }, {
        "coordinate": [119.306239, 26.075302],
        "area": "福建"
    }, {
        "coordinate": [115.892151, 28.676493],
        "area": "江西"
    }, {
        "coordinate": [117.000923, 36.675807],
        "area": "山东"
    }, {
        "coordinate": [113.665412, 34.757975],
        "area": "河南"
    }, {
        "coordinate": [114.298572, 30.584355],
        "area": "湖北"
    }, {
        "coordinate": [112.982279, 28.19409],
        "area": "湖南"
    }, {
        "coordinate": [113.280637, 23.125178],
        "area": "广东"
    }, {
        "coordinate": [108.320004, 22.82402],
        "area": "广西"
    }, {
        "coordinate": [110.33119, 20.031971],
        "area": "海南"
    }, {
        "coordinate": [106.713478, 26.578343],
        "area": "贵州"
    }, {
        "coordinate": [102.712251, 25.040609],
        "area": "云南"
    }, {
        "coordinate": [91.132212, 29.660361],
        "area": "西藏"
    }, {
        "coordinate": [108.948024, 34.263161],
        "area": "陕西"
    }, {
        "coordinate": [103.823557, 36.058039],
        "area": "甘肃"
    }, {
        "coordinate": [101.778916, 36.623178],
        "area": "青海"
    }, {
        "coordinate": [106.278179, 38.46637],
        "area": "宁夏"
    }, {
        "coordinate": [87.617733, 43.792818],
        "area": "新疆"
    }, {
        "coordinate": [116.405285, 39.904989],
        "area": "北京"
    }, {
        "coordinate": [117.190182, 39.125596],
        "area": "天津"
    }, {
        "coordinate": [121.472644, 31.231706],
        "area": "上海"
    }, {
        "coordinate": [106.504962, 29.533155],
        "area": "重庆"
    }, {
        "coordinate": [114.173355, 22.320048],
        "area": "香港"
    }, {
        "coordinate": [113.54909, 22.198951],
        "area": "澳门"
    }];
};