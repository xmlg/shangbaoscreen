//var bigDataUrl="https://121.33.210.170";
//var  XNbigUrl ="/xianning/servlet/com.chinauip.common.servlet.UIUrlServlet";
//var bigDataUrl="";
//var  XNbigUrl='';
var bigDataUrl="http://111.203.35.59";
var XNbigUrl ='/wcm/bigdata.do';
var wcmUrl="/wcm/bigServlet.action";
//add by liujh in 2017-12-07 start
// var bigUrl = "/wcm/bigdata";

function connectUrl(url) {
    return wcmUrl+"?url="+encodeURIComponent(url);
}
//刷新屏幕

function locattion(){
    window.location.reload();

}
window.setInterval("locattion()",1800*1000); 




