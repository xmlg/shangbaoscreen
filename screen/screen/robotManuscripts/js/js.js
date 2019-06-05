<script>
var str = '';
if(page=="") page=1; 
var stop=true;//触发开关，防止多次调用事件 
$(window).scroll( function(event){
//当内容滚动到底部时加载新的内容 100当距离最底部100个像素时开始加载. 
if ($(this).scrollTop() + $(window).height() + 10 >= $(document).height() && $(this).scrollTop() > 10) {
//if(stop==true){ 
//stop=false; 
//var canshu="page/"+page+"; 
var url = "";
var parm = {'page':page};
page=page+1;//当前要加载的页码 
//加载提示信息 
$("#showlists").append("<li class='ajaxtips'><div style='font-size:2em'>Loding…..</div><>");
$.post(url,parm,function(data){
if( data.count == 0 ) {
$('.prolist-abtn').html('已全部加载完');
return;
} 
$.each(eval(data), function(data, val) {
var url1 = "";
$(".ajaxtips").hide();
str = '<div class="content" id="showdiv">';
str +='<div class="cont clearfix">';
str +='<a href="url"><div class="cont_img fl">';
str +='<img src='+val.imgurl+' alt="" /></div>';
str += '<div class="cont_list fl"><p>'+val.sceneryname+'</p><ul class="cont_list fl">';
str += '<li class="cont_list2"><span>￥</span>';
str +='<strong>'+val.sellerprice+'</strong>起<i>￥'+val.sellerprice+'</i></li>';
str +='</ul></div></a></div></div>';
$("#showdiv").append(str);//把新的内容加载到内容的后面 
}); 
stop=true; 
},'JSON') 
} 
});
</script>