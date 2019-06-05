/**
 * Created by Administrator on 2017-02-16.
 */

var url_china="/wcm/bigdata.do?modelid=getHotIncrement&serviceid=hotpointcluster&typeid=widget&user_id=admin&department=admin";
var url_abroad="/wcm/bigdata.do?modelid=overseasMedia1&serviceid=overseas&typeid=widget&user_id=admin&department=admin";
var url_weibo="/wcm/bigdata.do?modelid=getHotIncrement&serviceid=hotpointcluster&typeid=widget&user_id=admin&department=admin&type=1";
var now="";

$(".menu_body ").mouseenter(function(){
    $(this).find(".menu_ul").show();
});
$(".menu_body ").mouseleave(function(){
    $(this).find(".menu_ul").hide();
});

$(".list").click(function(){
    if($(this).hasClass("china")){
        $(".news_list_box").show();
        $("#ticker").hide();
        drawList('china','&page_no=0&page_size=12');

    }else if($(this).hasClass("abroad")){
        $(".news_list_box").show();
        $("#ticker").hide();
        drawList('abroad','&page_no=0&page_size=12');
    }else if($(this).hasClass("weibo")){
        $(".news_list_box").show();
        $("#ticker").hide();
        drawList('weibo','&page_no=0&page_size=6');
    }
});
$(".view").click(function(){
    if($(this).hasClass("china")){
        $(".news_list_box").hide();
        $("#ticker").show();
        load(url_china);
    }else if($(this).hasClass("abroad")){
        $(".news_list_box").hide();
        $("#ticker").show();
        load(url_abroad);
    }else if($(this).hasClass("weibo")){
        $(".news_list_box").hide();
        $("#ticker").show();
        load(url_weibo);
    }
});


function drawList(type,params){
    if(type=='weibo'){
        url=url_weibo;
    }else if(type=='china'){
        url=url_china;
    }else{
        url=url_abroad;
    }
    url=url+params;
    now=type;
    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",
        success: function(data){
            setListHtml(data,type);
        }
    });
}
function setListHtml(data,type){
    $(".news_list_center").html("");
    var content=data.CONTENT;
    var pages=data.TOTALPAGES;
    var nowpage=data.NUMBER;
    var size=data.SIZE;
    var str="";



    if(type=='weibo'){
        $(".weibo_people").show();
        $(".weibo_people").addClass('w184');


        content.forEach(function(_data,index,array){
            if(index>=6)
                return;
            var title=$.trim(_data.STATUSCONTENT);
            title=title.replace(/\&nbsp;/g,'');
            if(title&&title.length>78)
                title=title.substring(0,78)+"...";
            str+= "<li class='news_list_center_li h104'>"+
                "<span class='news_list_center_num'>"+(nowpage*size+index+1)+"</span>"+
                " <ul class='news_list_center_ul'>"+
                " <li><a href='"+_data.ORIGINALURL+"' target='_blank'>"+title+"</a></li>"+
                // " <li>123</li>"+
                "<li class='w184'>"+_data.SITENAME+"</li>"+
                "<li>"+_data.CREATEDAT+"</li>"+
                "</ul>"+
                "</li>";
        })

    }else if(type=='china'){
        $(".weibo_people").hide();
        content.forEach(function(_data,index,array){
            str+= "<li class='news_list_center_li'>"+
                "<span class='news_list_center_num'>"+(nowpage*size+index+1)+"</span>"+
                " <ul class='news_list_center_ul'>"+
                " <li><a href='/dist/index.html#/decisioncenterverdetail?guid="+_data.GUID+"' target='_blank'>"+_data.TITLE+"</a></li>"+
                // " <li>123</li>"+
                "<li>"+_data.URLDATE+"</li>"+
                "</ul>"+
                "</li>";
        })
    }else if(type=='abroad'){
        $(".weibo_people").hide();
        content=data.PAGEITEMS;
        pages=data.TOTALPAGECOUNT;
        nowpage=data.PAGEINDEX;
        size=data.PAGESIZE;
        content.forEach(function(_data,index,array){
            str+= "<li class='news_list_center_li'>"+
                "<span class='news_list_center_num'>"+(nowpage*size+index+1)+"</span>"+
                " <ul class='news_list_center_ul'>"+
                " <li><a href='"+_data.PERMALINK+"' target='_blank'>"+_data.TITLE+"</a></li>"+
                // " <li>123</li>"+
                "<li>"+_data.DATE+"</li>"+
                "</ul>"+
                "</li>";
        })
    }
    $(".news_list_center").html(str);

    drawPage(nowpage,pages);


}
/**
 * 翻页
 * @param pageno
 */
function jumpPage(pageno){
    var pagesize=12;
    var order='desc';
    if(now=='weibo')
        pagesize=6;
    if(pageno<0)
        pageno=0;
    if($(".pubtime").hasClass("desc")){
        order='desc';
    }else if($(".pubtime").hasClass("asc")){
        order='asc';
    }
    drawList(now,'&page_no='+pageno+'&page_size='+pagesize+"&order="+order);
}
/**
 * 页码前后翻三页
 * nowpage
 * pages共有多少页
 * @param type
 */
function changepage(nowpage,pages,type){


}

function drawPage(nowpage,pages){
    $(".news_list_page").html("");
    $(".news_list_page").append("<a href='javascript:void(0)' onclick='changepage("+nowpage+","+pages+",1)'><img src='images/foreign/news_list_14.png' alt=''></a>");
    var pageStr='';
    var active="";
    var i=0;
    if(pages>=3){
        for(i=0;i<=2;i++){
            if(nowpage==i){
                pageStr+="<a href='javascript:void(0)' onclick='jumpPage("+i+")' class='news_list_page_a news_list_page_active' >"+(i+1)+"</a>";
            }else{
                pageStr+="<a href='javascript:void(0)' onclick='jumpPage("+i+")' class='news_list_page_a' >"+(i+1)+"</a>";
            }
        }
    }else{
        for(i=0;i<=pages-1;i++){
            if(nowpage==i){
                pageStr+="<a href='javascript:void(0)' onclick='jumpPage("+i+")' class='news_list_page_a news_list_page_active' >"+(i+1)+"</a>";
            }else{
                pageStr+="<a href='javascript:void(0)' onclick='jumpPage("+i+")' class='news_list_page_a' >"+(i+1)+"</a>";
            }
        }
    }
    $(".news_list_page").append(pageStr);
    $(".news_list_page").append("<a href='javascript:void(0)' onclick='changepage("+nowpage+","+pages+",2)'><img src='images/foreign/news_list_16.png' alt=''></a>");


}
/**
 *排序
 */
$(".pubtime").click(function(){
    if($(this).hasClass("desc")){
        var sort='asc';
        $(this).removeClass("desc");
        $(this).addClass("asc");
        $(".pubtime img").attr("src","images/foreign/news_list_06.png");
    }else{
        var sort='desc';
        $(this).removeClass("asc");
        $(this).addClass("desc");
        $(".pubtime img").attr("src","images/foreign/news_list_08.png");
    }

    $("#ticker").hide();
    drawList(now,'&page_no=0&page_size=12&order='+sort);

});



//getdate(_data.IR_URLDATE)
function getdate(date) {
    var now = new Date(date),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
    return y + "/" + (m < 10 ? "0" + m : m) + "/" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
}
//(new Date(_data.IR_VRESERVED1).format("yyyy-MM-dd hh:mm:ss"))
Date.prototype.format = function(format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};