/**
 * Created by zss on 2016/3/22.
 */
$(document).ready(function () {

//下拉列表显示隐藏
    selectBox($('.ab-sel-bk'),$('.ab-sel-bk ul'));
    $(".ab-sel-bk").click(function () {
        if($(this).hasClass("sel_op")){$(this).removeClass("sel_op");}
        else{$(this).addClass("sel_op");}
    });

    $(document).click(function(){
        if($(".ab-sel-bk ul").css('display')=='block') {
            $(".ab-sel-bk").removeClass("sel_op");
        }
    });
  //下拉列表显示隐藏
    selectBox($('.lb-sel-bk'),$('.lb-sel-bk ul'));
    $(".lb-sel-bk").click(function () {
        if($(this).hasClass("rw-sel-op")){$(this).removeClass("rw-sel-op");}
        else{$(this).addClass("rw-sel-op");}
    });

    $(document).click(function(){
        if($(".lb-sel-bk ul").css('display')=='block') {
            $(".lb-sel-bk").removeClass("rw-sel-op");
        }
    });
});
function selectBox(div1,div2){
    div1.click(function(event){
        event.stopPropagation();
        var Index = div1.index(this);

        if(div2.eq(Index).css('display')=='block'){
            div2.eq(Index).hide();
        }
        else{
            div2.hide();
            div2.eq(Index).show();
        }
        if(div2.eq(Index).css('display')=='block'){
            $(document).click(function(){
                div2.hide();
            });
            $('li a',div2).click(function(){
                var text=this.innerHTML;
                $(this).parent().parent().prev().text(text);
            });
        }
    });
}
