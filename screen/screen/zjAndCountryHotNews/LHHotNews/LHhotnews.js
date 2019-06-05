/**
 * Created by wyq on 2016-11-24.
 */

var MTdata={serviceid:'hotpointevent1', modelid:'hotpointnews',
    field:"",loadtime:"",pagesize:20,startpage:0};
var WMdata={serviceid:'hotsearch', typeid:"widget",modelid:'content',
    datetime:"",channel:"",user_id:"admin",department:140};
var fieldType = "zyzxfield_000",
    loadTime = getNowFormatDate(false);
var isList = false;
var sortLIstName;//获取排序名称
var pageRankType;//获取分页时的排序方式

/**
 * 初始化
 */
function init(){
    /* WMdata.datetime=getNowFormatDate(true);
     WMdata.channel="国内";
     getData(WMdata);*/

    MTdata.loadtime=getNowFormatDate(false);
    MTdata.field="zyzxfield_000";
    getData(MTdata);

}
$(document).ready(function(){
    setInterval(showNext,30000);
    var bar_length=$(".bar").length;
    var nowCount=2;
    /**
     * 循环切换
     */
    function showNext(){
        // console.log( $(".bar_active"));
        $(".bar:nth-child("+nowCount+")").click();
        if(nowCount<bar_length){
            nowCount++;
        }else{
            nowCount=1;
        }
    }
});
var nowListTime = formateDate(new Date());

//计算持续时间
function durationTime(firstTime){
    var d1 = new Date(firstTime);
    var d2 = new Date(nowListTime);
    var gap = Math.ceil(Math.abs(d1-d2)/1000/60/60);
    // console.log(gap);
    return gap + "小时";
}
//获取引爆媒体
function getHotMedia(me){
    // console.log(me);
    if (me == null)  return '&nbsp;';
    var media = me.split(';')[0].split(':')[0];
    return media;
}
//格式化日期
function formateDate(date){
    var year=date.getFullYear();
    var month=(date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1;
    var day=date.getDate()<10?'0'+date.getDate():date.getDate();
    var hour = date.getHours()<10?'0'+date.getHours():date.getHours();
    var minutes = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
    var seconds = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
    return year+'/'+month+'/'+day+ ' '+hour + ":" + minutes + ":" + seconds;
}
function renderList(data,pn,sortName,sortType){
    var pNum = pn?pn:0;
    // console.log('list');
    var wrap = $(".news_list_box");
    var listUl = $(".news_list_center");
    var listPage = $(".news_list_page");
    var listLength = data.PAGEITEMS.length;
    var totalPage = data.PAGETOTAL;
    listUl.empty();
    listPage.empty();
    // 添加列表内容
    var content = '';
    var logoImg = '<img src="images/foreign/xhslogo.png">';
    var newImg = '<img src="images/foreign/isnews.png">';
    var isPubImg = '<img src="images/foreign/isPub.png">';
    for(var i=0;i<listLength;i++){
        content += '<li  class="news_list_center_li">' +
            '<span class="news_list_center_num">'+((pNum)*10+i+1)+'</span>'+
            '<ul class="news_list_center_ul">'+
            "<li><a class='jsclusterid' clusterid="+data.PAGEITEMS[i].CLUSTERID+" target='_blank' href='javascript:void(0)'>" +data.PAGEITEMS[i].TITLE+ (data.PAGEITEMS[i].STATUS==0?newImg:'') + "</a></li>"+
            '<li>'+data.PAGEITEMS[i].REPORTNUM+'</li>'+
            '<li>'+durationTime(data.PAGEITEMS[i].FIRSTTIME)+'</li>'+
            '<li>'+getHotMedia(data.PAGEITEMS[i].EVENTTIPPING3)+'</li>'+
            '<li>'+data.PAGEITEMS[i].FIRSTTIME+'</li>'+
            '</ul>'+
            '</li>'


    }
    listUl.html(content);

    // 添加页码信息

    var page = '';
    page+= '<a><img src="images/foreign/news_list_14.png" alt=""></a>';
    for(var j=0;j<totalPage;j++){
        var active=(pNum==j)?' news_list_page_active':'';
        page+= "<a  style='cursor: pointer;' class='news_list_page_a "+active+"'>"+ (j/1+1)+"</a>";// '+(pNum==j)?' news_list_page_active':'' + '
    }
    page+=  '<a><img src="images/foreign/news_list_16.png" alt=""></a>';
    listPage.html(page);
// console.log(pNum)

    // $(".news_list_page_a:eq(0)").addClass('news_list_page_active');


    $(".news_list_page_a").on('click',function(){
        var pn = $(this).text();
        // $(this).addClass('news_list_page_active').siblings().removeClass('news_list_page_active');
        MTdata.field=fieldType;
        MTdata.loadtime=loadTime;
        getData(MTdata,(pn-1),sortName,sortType);

    })
}



/**
 * 点击不同分类
 */


$(".bar").click(function(){
    $(".bar_active").removeClass("bar_active");
    $(this).addClass("bar_active");
    if($(this).attr("id").indexOf("zyzxfield")>=0){
        fieldType = MTdata.field=$(this).attr("id");
        loadTime = MTdata.loadtime=getNowFormatDate(false);
        getData(MTdata);
    }else{
        WMdata.datetime=getNowFormatDate(true);
        WMdata.channel=$(this).attr("id");
        getData(WMdata);
    }

});
/**
 * 获取内容
 */
var rankReport = 0;
var rankFtime = 0;
var RrankType = 'desc';
var TrankType = 'desc';
function getData(data,pn,sortName,sortType){
    if(isList === true && pn){
        data.startpage = pn;
    }else{
        data.startpage = 0;
    }
    if(isList === true){
        data.pagesize = 10;
    }else{
        data.pagesize = 20;
    }
    /*
    if(sortName){
        sortLIstName = data.orderfield = sortName;
        if(sortName == 'SY_CLUSTER_NUMS'){

            RrankType = data.ordermode = sortType;
        }else if(sortName == 'SY_FIRSTTIME'){

            TrankType = data.ordermode = sortType;
        }
    }else{
        data.orderfield = '';
        data.ordermode = '';
    }
    */
    var urlInfo="?";

    for(item in data){
        urlInfo+=item+"="+data[item]+"&"
    }


    // var dataInfo=bigDataUrl+XNbigUrl+urlInfo.substring(0,urlInfo.length-1);

    var data = "/wcm/bigdata.do?field=zyzxfield_020&loadtime="+getNowFormatDate(false)+"&modelid=hotpointnews&orderfield=&ordermode=&pagesize=20&serviceid=hotpointevent1&startpage=0&typeid=widget"
    $.ajax({
        type: "GET",
        url:data,
        /* url:wcmUrl,
        data:{
         url:dataInfo,
        }, */
        dataType: "json",
        beforeSend:function(){
            indexB =layer.load(1, {
                shade: [0.4,'#fff'] //0.1透明度的白色背景
            });
        },
        success: function(_data){
            layer.close(indexB);
            //var datas = _data.DATA;
            //var ChildData = JSON.parse(JSON.stringify(_data.DATA));   //拷贝对象
            var ChildData = JSON.parse(JSON.stringify(_data));   //拷贝对象
            // console.log(datas)
            //console.log(ChildData)
            //if(data.serviceid=="hotsearch"){
            //    _data=_data.CONTENT;
            //}
            // console.log(_data)
            if(isList === false){
                // console.log('false')
                //setContentHtml(_data.DATA);
                setContentHtml(_data);
                console.log(_data)
            }else if(isList === true){
                // console.log('true')
                renderList(ChildData,pn,sortName,sortType);

            }

        }
    });
}
/**
 *获取当前时间  形如2016-11-24+14
 **/
function getNowFormatDate(isWM) {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours=date.getHours();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if(isWM){
        return year + seperator1 + month + seperator1 + strDate;
    }else{
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate
            + "+" + hours;

        return currentdate;
    }

}

/**
 *content内容加载
 */

function setContentHtml(item){

    // console.log('chart');
    $(".content").html("");
    var hotNum=randomText(item);
    var str="";
    hotNum.forEach(function(data,index,array){
        str+="<div class='hot_head_module_1'>";
        data.forEach(function(_data,_index,_array){
            if(_data.URLIMAGE!=null&&_data.URLIMAGE.length>0){
                var urlimg=_data.URLIMAGE
                _data.URLIMAGE=urlimg.split(";")[0];
            }
            if(_data.URLIMAGE==null){
                _data.SHORTTITLE = (_data.SHORTTITLE==undefined)?'':_data.SHORTTITLE;
                str+=" <div class='hot_head_li_"+_data.size+" "+_data.CLASS+"'>";
                str+="<ul><li class='effect'>";
                str+="<a target='_blank' class='jsclusterid' clusterid="+_data.CLUSTERID+"  href='javascript:void(0)'>"+_data.SHORTTITLE+"</a>";//CUSTER_NUMS
                //if(_data.ISTIPPINGPOINT==1)
                //str+="<span class='pic3' ></span>";
                str+="</li></ul>";
                str+="</div>"
            }else{
                _data.SHORTTITLE = (_data.SHORTTITLE==undefined)?'':_data.SHORTTITLE;
                str+=" <div class='hot_head_li_"+_data.size+" "+_data.CLASS+"'>"
                str+="<ul class='usl'><li class='effect lsi'>"
                str+="<img class='ims' src='"+_data.URLIMAGE+"'>"//CUSTER_NUMS
                str+="<div class='hides'>"
                str+="<a target='_blank' href='/dist/index.html#/plan/hotpointcluster?guids="+_data.CLUSTERID+"'>"+_data.SHORTTITLE+"</a>"
                str+="</div>"
                if(_data.ISTIPPINGPOINT==1)
                    str+="<span class='pic3' ></span>"
                str+="</li></ul>";
                str+="</div>"
            }

        });
        str+="</div>"
    });
    $(".content").html(str);
    var aa=$(".effect").height()+'px';
    $(".hides").css({"width":"100%","height":"100%","marginTop":"aa","position":"relative","z-index":"999","background-image":"url('images/img_bg.png')"})
    $(".ims").css({"width":"100%","height":"100%"})
    $(".lsi").css({"width":"100%","height":"100%"})
    $(".usl").css({"width":"100%","height":"100%"})

    $(".effect").on("mouseenter",function(){
        var aa=$(this).height()+6+'px';
        $(this).children("div").stop(false,true).animate({marginTop:'-'+aa});
    })
    $(".effect").on("mouseleave",function(){
        var aa=$(this).height()+6+'px';
        $(this).children("div").stop(false,true).animate({marginTop:aa});
    })
}
/**
 * 去除字符串左右两端的空格
 */
String.prototype.trim=function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
/**
 *  Module 随机动画排列
 *
 * Description
 */
function animation(){
    var oldArrClass = [];
    var newArrClass = [];
    for (var i = 0; i < 20; i++) {
        oldArrClass.push('anim-' + i);
    }
    for (var n= 0; n < 20; n++) {
        var random = Math.floor(Math.random() * oldArrClass.length);
        newArrClass.push(oldArrClass[random]); //
        oldArrClass.splice(random, 1);
    }
    //    console.log(newArrClass)
    return newArrClass;
}


/**
 * [NUMSTRVALUE description]  不同分辨率下 截取不同长度
 * @param {[type]} STRVALUE [description]
 */
function NUMSTRVALUE(STRVALUE) {
    if (window.screen.width <= '1366') {
        STRVALUE = STRVALUE.substring(0,15);
    } else if (window.screen.width <= '1680' && window.screen.width > '1366') {
        STRVALUE = STRVALUE.substring(0,18);
    } else if (window.screen.width > '1680') {
        STRVALUE = STRVALUE.substring(0,20);
    }
    return STRVALUE;
}
/***
 *生成随机区域块内容
 */
function randomText(params){
    // params=[{"STRVALUE": "中拉友好关系驶入新航程", "ID": "43562", "value": 20}, {"STRVALUE": "枪未响\" 或将一两周内公告", "ID": "43563", "value": 11}, {"STRVALUE": "白银操作建议", "ID": "43564", "value": 18}, {"STRVALUE": "西昌卫星发射中心发射破百", "ID": "43567", "value": 32}, {"STRVALUE": "北极异常升温让科学家不解", "ID": "43568", "value": 22}, {"STRVALUE": "军事情报保护协定", "ID": "43569", "value": 32}, {"STRVALUE": "习近平出席中拉媒体领袖峰会开幕式", "ID": "43570", "value": 52}, {"STRVALUE": "香港黄金大劫案", "ID": "43571", "value": 22}, {"STRVALUE": "上厕所没带纸", "ID": "43572", "value": 52}, {"STRVALUE": "自由贸易账户", "ID": "43574", "value": 32}, {"STRVALUE": "城市生活垃圾产生量", "ID": "43578", "value": 42}, {"STRVALUE": "着火信号系虚报乘客已安", "ID": "43579", "value": 12}, {"STRVALUE": "丰田酷路泽", "ID": "43580", "value": 22}, {"STRVALUE": "恒大二次举牌万科A 总持股达１０％", "ID": "43581", "value": 32}, {"STRVALUE": "组工部门要自觉走在前列", "ID": "43582", "value": 12}, {"STRVALUE": "疑因学习压力过大", "ID": "43584", "value": 14}, {"STRVALUE": "“百日新政”", "ID": "43585", "value": 34}, {"STRVALUE": "“世芳扯铃”成笑柄", "ID": "42852", "value": 34}, {"STRVALUE": "特朗普“百日新政”", "ID": "42862", "value": 51}, {"STRVALUE": "叫花鸡敲开泥巴只剩纸", "ID": "42868", "value": 11}];
    //    console.log(params)
    var headLine ;
    if(params.PAGEITEMS==null){//网民关注
        headLine=params;
    }else{
        headLine=params.PAGEITEMS;
    }
    params.PAGEITEMS;
    var length=headLine.length;
    var newArrary = [];
    var randomAni=animation();
    if(headLine.length==undefined) return;


    /**
     * 对数据按照从大到小排序
     */
    headLine.sort(function(a,b){//EVENTVALUE
        if(b.WEIGHTVALUE!=null)
            return b.WEIGHTVALUE-a.WEIGHTVALUE;
    });
// console.log(headLine)
    /**
     * 初始化数组
     * size2 为占横2格
     * size3 为占竖2格
     */
    var generArray = [
        [{    size: "4"}],
        [{    size: "4"}],
        [{    size: "2"}, {   size: "2"}],
        [{    size: "2"}, {   size: "1"}, {    size: "1"}],
        [{    size: "3"}, {   size: "1"}, {    size: "1"}],
        [{    size: "1"}, {   size: "1"}, {    size: "2"}],
        [{    size: "3"}, {   size: "1"}, {    size: "1"}],
        [{    size: "1"}, {   size: "1"}, {    size: "1"}, {    size: "1"}],



    ];
    newArrary=generArray;
    var initNum = 0;
    newArrary.forEach(function(data, index, array) {
        data.forEach(function(_data, _index, _array) {

            if (initNum <= length - 1) {
                // newArrary[index][_index].STRVALUE = headLine[initNum].STRVALUE.substr(0,20);
                var  nowNeed=0;
                if(_data.size==1){
                    nowNeed=headLine.length-1;
                }
                newArrary[index][_index].num = initNum+1;
                newArrary[index][_index].SHORTTITLE = headLine[nowNeed].SHORTTITLE;
                newArrary[index][_index].CLUSTERID=headLine[nowNeed].CLUSTERID;
                newArrary[index][_index].CLASS=randomAni[initNum];
                newArrary[index][_index].ISTIPPINGPOINT=headLine[nowNeed].ISTIPPINGPOINT;
                newArrary[index][_index].WEIGHTVALUE=headLine[nowNeed].WEIGHTVALUE;
                newArrary[index][_index].STATUS=headLine[nowNeed].STATUS;
                newArrary[index][_index].URLIMAGE=headLine[nowNeed].URLIMAGE;
                newArrary[index][_index].STRVALUE=headLine[nowNeed].STRVALUE;
                newArrary[index][_index].CLUSTERID=headLine[nowNeed].CLUSTERID;
                //  console.log(headLine[nowNeed].STRVALUE+headLine[nowNeed].CUSTER_NUMS);
                headLine.splice(nowNeed,1);
                initNum++;
            }


        });
    });
    for (var i = 0; i < 8; i++) {
        var random = Math.floor(Math.random() * generArray.length);
        newArrary.push(generArray[random]);
        generArray.splice(random, 1);
    }

    // console.log(newArrary)
    var hotNums = newArrary;
    return hotNums;

}


//领域
var fieldJsons = [{
    name: '政治',
    value: 'zyzxfield_001'
}, {
    name: '财经',
    value: 'zyzxfield_002'
},{
    name: '司法',
    value: 'zyzxfield_003'
}, {
    name: '军事',
    value: 'zyzxfield_004'
}, {
    name: '社会',
    value: 'zyzxfield_005'
}, {
    name: '地产',
    value: 'zyzxfield_006'
}, {
    name: '科技',
    value: 'zyzxfield_007'
}, {
    name: '人文',
    value: 'zyzxfield_008'
}, {
    name: '体育',
    value: 'zyzxfield_009'
}, {
    name: '教育',
    value: 'zyzxfield_010'
}, {
    name: '生活',
    value: 'zyzxfield_011'
}, {
    name: '健康',
    value: 'zyzxfield_012'
}, {
    name: '汽车',
    value: 'zyzxfield_013'
}, {
    name: '美食',
    value: 'zyzxfield_014'
}, {
    name: '旅游',
    value: 'zyzxfield_015'
}, {
    name: '游戏',
    value: 'zyzxfield_016'
}, {
    name: '动漫',
    value: 'zyzxfield_017'
}, {
    name: '电商',
    value: 'zyzxfield_018'
}, {
    name: '娱乐',
    value: 'zyzxfield_019'
}];
