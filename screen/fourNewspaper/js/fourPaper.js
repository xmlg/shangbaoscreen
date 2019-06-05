$(function () {




    function init() {
        var params = {
            code: "551b1ff558194a0eb61d171ef40f3085",
            banci: "A01",
            fastTime: new Date().format("yyyy-MM-dd"),
            pageSize: "30",
            type: 32
        }


        var today = new Date().getFullYear()+"年"+(new Date().getMonth()+1)+"月"+new Date().getDate()+"日";

        $(".date>p").html(today);



        $.ajax({
            type: "GET",
            url: "/isearch/front/search.jhtml",
            data: params,
            dataType: "json",
            success: function(data){
                console.log(data);
                var newData = [];
                for (var k = 0; k < data.page.content.length; k++) {
                    console.log(data.page.content[k]);
                    switch (data.page.content[k].source){
                        case '晶报':
                            newData[4] = data.page.content[k]||null;
                            break;
                        case '深圳都市报':
                            newData[7] = data.page.content[k]||null;
                            break;
                        case '香港商报':
                            newData[5] = null;
                            break;
                        case '宝安日报':
                            newData[6] = data.page.content[k]||null;
                            break;
                        case '深圳晚报':
                            newData[2] = data.page.content[k]||null;
                            break;
                        case '深圳特区报':
                            newData[0] = data.page.content[k]||null;
                            break;
                        case '深圳商报':
                            newData[1] = data.page.content[k]||null;
                            break;
                    }
                    
                }
                console.log(newData);
                for (var i = 0; i < newData.length; i++) {
                    var obj = newData[i];
                    if(newData[i] == null){
                        continue
                    }
                    var paperName;
                    switch (newData[i].source){
                        case '晶报':
                            paperName = '晶';
                            break;
                        case '深圳都市报':
                            paperName = '都市';
                            break;
                        case '香港商报':
                            paperName = '商';
                            break;
                        case '宝安日报':
                            paperName = '宝安';
                            break;
                        case '深圳晚报':
                            paperName = '晚';
                            break;
                        case '深圳特区报':
                            paperName = '特';
                            break;
                        case '深圳商报':
                            paperName = '商';
                            break;

                    }
                    // $(".crContentT>ul").append('<li class="paperLi"><img src="'+obj.img+'" alt="" width="140" height="204"><p class="hint"><span class="ban">第A01版</span><span class="name">'+paperName+'</span></p></li>')
                    $(".crContentT>ul").append('<li class="paperLi" name="'+obj.source+'"><img src="'+obj.img+'" alt="" width="140" height="204"></li>')

                }


                    $(".clContentLeft>img").attr("src",$('.paperLi').eq(0).find("img").attr('src'))
                    var imgName;
                    var paperType;
                    switch ($('.paperLi').eq(0).attr('name')){
                        case '晶报':
                            imgName = 'jing';
                            paperType = 24;
                            break;
                        case '深圳都市报':
                            imgName = 'dushi';
                            paperType = 8;
                            break;
                        case '香港商报':
                            imgName = 'xgshang';
                            paperType = 26;
                            break;
                        case '宝安日报':
                            imgName = 'baoan';
                            paperType = 4;
                            break;
                        case '深圳晚报':
                            imgName = 'wan';
                            paperType = 23;
                            break;
                        case '深圳特区报':
                            imgName = 'te';
                            paperType = 2;
                            break;
                        case '深圳商报':
                            imgName = 'shang';
                            paperType = 11;
                            break;

                    }
                    $(".clTop>.log>img").attr("src","images/"+imgName+".png");

                    $.ajax({
                        type: "GET",
                        url: "/isearch/front/search.jhtml",
                        data: {
                            code: "551b1ff558194a0eb61d171ef40f3085",
                            banci: "A01",
                            fastTime: new Date().format("yyyy-MM-dd"),
                            pageNumber: 1,
                            pageSize: 10,
                            type: paperType
                        },
                        dataType: "json",
                        success: function(data){
                            $(".clContentRight>ul>li").remove()
                            for (var i = 0; i < data.page.content.length; i++) {
                                var obj1 = data.page.content[i];
                                $(".clContentRight>ul").append('<li class="newContent"><p class="paperTitle">'+obj1.title+'</p><p class="paperContent">'+obj1.content+'</p></li>')
                            }
                            var html = '<iframe scrolling="no" src="../../screen/fourPaperDetail/index.html?type='+paperType+'" frameborder="0" width="100%" height="100%"></iframe>';
                            $(".newContent").off("click").on("click",function () {
                                layer.open({
                                    title: '新闻详情',
                                    type: 1,
                                    skin: 'layui-layer-demo', //样式类名
                                    //closeBtn: 0, //不显示关闭按钮
                                    maxmin: true, //开启最大化最小化按钮
                                    anim: 2,
                                    scrollbar:false,
                                    area: ['1347px', '800px'],
                                    shadeClose: false, //开启遮罩关闭
                                    content: html
                                });
                            })
                        }
                    })




                $(".paperLi").on('click',function () {
                    // $(this).addClass('active')
                    // console.log($(this).find("img").attr('src'));
                    $(".clContentLeft>img").attr("src",$(this).find("img").attr('src'))
                    var imgName;
                    var paperType;
                    switch ($(this).attr('name')){
                        case '晶报':
                            imgName = 'jing';
                            paperType = 24;
                            break;
                        case '深圳都市报':
                            imgName = 'dushi';
                            paperType = 8;
                            break;
                        case '香港商报':
                            imgName = 'xgshang';
                            paperType = 26;
                            break;
                        case '宝安日报':
                            imgName = 'baoan';
                            paperType = 4;
                            break;
                        case '深圳晚报':
                            imgName = 'wan';
                            paperType = 23;
                            break;
                        case '深圳特区报':
                            imgName = 'te';
                            paperType = 2;
                            break;
                        case '深圳商报':
                            imgName = 'shang';
                            paperType = 11;
                            break;

                    }
                    $(".clTop>.log>img").attr("src","images/"+imgName+".png");

                    $.ajax({
                        type: "GET",
                        url: "/isearch/front/search.jhtml",
                        data: {
                            code: "551b1ff558194a0eb61d171ef40f3085",
                            banci: "A01",
                            fastTime: new Date().format("yyyy-MM-dd"),
                            pageNumber: 1,
                            pageSize: 10,
                            type: paperType
                        },
                        dataType: "json",
                        success: function(data){
                            $(".clContentRight>ul>li").remove()
                            for (var i = 0; i < data.page.content.length; i++) {
                                var obj1 = data.page.content[i];
                                $(".clContentRight>ul").append('<li class="newContent"><p class="paperTitle">'+obj1.title+'</p><p class="paperContent">'+obj1.content+'</p></li>')
                            }
                            var html = '<iframe scrolling="no" src="../../screen/fourPaperDetail/index.html?type='+paperType+'" frameborder="0" width="100%" height="100%"></iframe>';
                            $(".newContent").off("click").on("click",function () {
                                layer.open({
                                    title: '新闻详情',
                                    type: 1,
                                    skin: 'layui-layer-demo', //样式类名
                                    //closeBtn: 0, //不显示关闭按钮
                                    maxmin: true, //开启最大化最小化按钮
                                    anim: 2,
                                    scrollbar:false,
                                    area: ['1347px', '800px'],
                                    shadeClose: false, //开启遮罩关闭
                                    content: html
                                });
                            })
                        }
                    })
                })
            }
        })
    }

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }


    init();
})