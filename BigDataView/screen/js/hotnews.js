/**
 * 初始化
 */
function App() {
    var self = this;
    this.isList = false;
    this.domainId = "zyzxfield_000"; //分类的id--默认为全部的id
    this.getData(this.domainId);
    this.showChange();
    this.classChange();
}
//获取分类的数据
App.prototype.getData = function(domainId) {
        var _self = this;
        var paramData = "/bigScreen/hotspot/domain?domainId=" + domainId;
        $.ajax({
            type: "GET",
            url: paramData,
            dataType: "json",
            beforeSend: function() {
                indexB = layer.load(1, {
                    shade: [0.4, '#fff'] //0.1透明度的白色背景
                });
            },
            success: function(data) {
                layer.close(indexB);
                var ChildData = JSON.parse(JSON.stringify(data)); //拷贝对象

                if (_self.isList === false) {
                    console.log("我是图表");
                    _self.setContentHtml(data);
                } else if (_self.isList === true) {
                    console.log("我是列表表");
                    _self.renderList(data);
                }
            }
        });
    }
    //渲染图标的页面
App.prototype.setContentHtml = function(item) {
    var _self = this;
    $(".content").html("");
    var hotNum = _self.randomText(item);
    console.log(hotNum, "处理后的数字")
    var str = "";
    hotNum.forEach(function(data, index, array) {
        str += "<div class='hot_head_module_1'>";
        data.forEach(function(_data, _index, _array) {
            _data.shortTitle = (_data.shortTitle == undefined) ? '' : _data.shortTitle;
            str += " <div class='hot_head_li_" + _data.size + " " + _data.CLASS + "'>";
            str += "<ul><li class='effect'>";
            str += "<a target='_blank' class='jsclusterid' clusterid=" + _data.guid + "  href='javascript:void(0)'>" + _data.shortTitle + "</a>"; //CUSTER_NUMS
            str += "</li></ul>";
            str += "</div>"

        });
        str += "</div>"
    });
    $(".content").html(str);
    var aa = $(".effect").height() + 'px';
    $(".hides").css({ "width": "100%", "height": "100%", "marginTop": "aa", "position": "relative", "z-index": "999", "background-image": "url('images/img_bg.png')" })
    $(".ims").css({ "width": "100%", "height": "100%" })
    $(".lsi").css({ "width": "100%", "height": "100%" })
    $(".usl").css({ "width": "100%", "height": "100%" })

    $(".effect").on("mouseenter", function() {
        var aa = $(this).height() + 6 + 'px';
        $(this).children("div").stop(false, true).animate({ marginTop: '-' + aa });
    })
    $(".effect").on("mouseleave", function() {
        var aa = $(this).height() + 6 + 'px';
        $(this).children("div").stop(false, true).animate({ marginTop: aa });
    })
};
//矩阵数据处理
App.prototype.randomText = function(params) {
    var _self = this;
    var headLine = params;
    var length = headLine.length;
    var newArrary = [];
    var randomAni = _self.animation();
    console.log(randomAni)
    if (headLine.length == undefined) return;
    /**
     * 对数据按照从大到小排序
     */
    headLine.sort(function(a, b) { //EVENTVALUE
        if (b.weight != null)
            return b.weight - a.weight;
    });
    /**
     * 初始化数组
     * size2 为占横2格
     * size3 为占竖2格
     */
    var generArray = [
        [{ size: "4" }],
        [{ size: "4" }],
        [{ size: "2" }, { size: "2" }],
        [{ size: "2" }, { size: "1" }, { size: "1" }],
        [{ size: "3" }, { size: "1" }, { size: "1" }],
        [{ size: "1" }, { size: "1" }, { size: "2" }],
        [{ size: "3" }, { size: "1" }, { size: "1" }],
        [{ size: "1" }, { size: "1" }, { size: "1" }, { size: "1" }],
    ];
    newArrary = generArray;
    var initNum = 0;
    newArrary.forEach(function(data, index, array) {
        data.forEach(function(_data, _index, _array) {
            var nowNeed = 0;
            if (_data.size == 1) {
                nowNeed = headLine.length - 1;
            }
            newArrary[index][_index].num = initNum + 1;
            newArrary[index][_index].shortTitle = headLine[nowNeed].shortTitle; //稿件题目
            newArrary[index][_index].guid = headLine[nowNeed].guid; //稿件id
            newArrary[index][_index].CLASS = randomAni[initNum];
            newArrary[index][_index].reportNum = headLine[nowNeed].reportNum; //报道数
            newArrary[index][_index].duration = headLine[nowNeed].duration; //持续时间
            newArrary[index][_index].tippingMedia = headLine[nowNeed].tippingMedia; //引爆媒体
            newArrary[index][_index].loadTime = headLine[nowNeed].loadTime; //上榜时间
            headLine.splice(nowNeed, 1);
            initNum++;
        });
    });
    for (var i = 0; i < 8; i++) {
        var random = Math.floor(Math.random() * generArray.length);
        newArrary.push(generArray[random]);
        generArray.splice(random, 1);
    }
    var hotNums = newArrary;
    return hotNums;
};
//渲染列表页面
App.prototype.renderList = function(item) {
    var pNum = 0;
    var wrap = $(".news_list_box");
    var listUl = $(".news_list_center");
    var listPage = $(".news_list_page");
    var listLength = item.length;
    var totalPage = 50;
    listUl.empty();
    listPage.empty();
    // 添加列表内容
    var content = '';
    var logoImg = '<img src="images/foreign/xhslogo.png">';
    var newImg = '<img src="images/foreign/isnews.png">';
    var isPubImg = '<img src="images/foreign/isPub.png">';
    for (var i = 0; i < listLength; i++) {
        content += '<li  class="news_list_center_li">' +
            '<span class="news_list_center_num">' + ((pNum) * 10 + i + 1) + '</span>' +
            '<ul class="news_list_center_ul">' +
            // "<li><a class='jsclusterid' clusterid=" + item[i].guid + " target='_blank' href='javascript:void(0)'>" + item[i].shortTitle + (item[i].STATUS == 0 ? newImg : '') + "</a></li>" +
            "<li><a class='jsclusterid' clusterid=" + item[i].guid + " target='_blank' href='javascript:void(0)'>" + item[i].shortTitle + "</a></li>" +
            '<li>' + item[i].reportNum + '</li>' +
            '<li>' + item[i].duration + '小时' + '</li>' +
            '<li>' + item[i].tippingMedia + '</li>' +
            '<li>' + item[i].loadTime + '</li>' +
            '</ul>' +
            '</li>'
    }
    listUl.html(content);
    $('.reportRankImg').hide();
    $('.timeRankImg').hide();
    // 添加页码信息

    // var page = '';
    // page += '<a><img src="images/foreign/news_list_14.png" alt=""></a>';
    // for (var j = 0; j < totalPage; j++) {
    //     var active = (pNum == j) ? ' news_list_page_active' : '';
    //     page += "<a  style='cursor: pointer;' class='news_list_page_a " + active + "'>" + (j / 1 + 1) + "</a>"; // '+(pNum==j)?' news_list_page_active':'' + '
    // }
    // page += '<a><img src="images/foreign/news_list_16.png" alt=""></a>';
    // listPage.html(page);


    // $(".news_list_page_a").on('click', function() {
    //     var pn = $(this).text();
    //     MTdata.field = fieldType;
    //     MTdata.loadtime = loadTime;
    //     getData(MTdata, (pn - 1), sortName, sortType);

    // })
}

/**
 *  Module 随机动画排列
 */
App.prototype.animation = function() {
        var oldArrClass = [];
        var newArrClass = [];
        for (var i = 0; i < 20; i++) {
            oldArrClass.push('anim-' + i);
        }
        for (var n = 0; n < 20; n++) {
            var random = Math.floor(Math.random() * oldArrClass.length);
            newArrClass.push(oldArrClass[random]); //
            oldArrClass.splice(random, 1);
        }
        return newArrClass;
    }
    /**
     * 分类
     */
App.prototype.classChange = function() {
    var _self = this;
    $(".bar").click(function() {
        $(".bar_active").removeClass("bar_active");
        $(this).addClass("bar_active");
        if ($(this).attr("id").indexOf("zyzxfield") >= 0) {
            _self.domainId = $(this).attr("id");
            _self.getData(_self.domainId);
        } else {
            // WMdata.datetime = getNowFormatDate(true, dataCount);s
        }
    });
}
App.prototype.showChange = function() {
    var _self = this;
    $(".list_btn a").click(function() {
        var tag = $(this);
        var chartL = $('.content');
        var listL = $('.news_list_box');
        $(this).addClass("list_btn_a").siblings("a").removeClass("list_btn_a");
        if (tag.attr('data-type') === 'chart') {
            _self.isList = false;
            _self.getData(_self.domainId);
            chartL.slideDown('normal', 'linear');
            listL.slideUp();
        } else {
            _self.isList = true;
            _self.getData(_self.domainId);
            chartL.slideUp();
            listL.slideDown('normal', 'linear');
        }
    });
}
var app = new App()
$(document).ready(function() {
    setInterval(showNext, 30000);
    var bar_length = $(".bar").length;
    var nowCount = 2;
    /**
     * 循环切换
     */
    function showNext() {
        // console.log( $(".bar_active"));
        $(".bar:nth-child(" + nowCount + ")").click();
        if (nowCount < bar_length) {
            nowCount++;
        } else {
            nowCount = 1;
        }
    }
});
/**
 * 点击不同分类
 */