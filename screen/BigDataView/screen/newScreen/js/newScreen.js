/**
 * Created by Administrator on 2016/11/24.
 */
$(function(){
    //var provinceUrl = "/cas/casData/screenJson?type=provinceCei";//省份影响力url
    var provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=threeProvinceCei");//72小时省份影响力url
    var checkR;//用于稿件id判断
    //监测点击最大化事件
    $('.trans_max').on('click',function(){
        var self = $(this);
        var type= self.attr('data-type');
        var bg = $(".background_img");
        var parent = self.parents(".trans_window");
        var TL = $(".trans_left");
        var TR =$(".trans_right");
        var TRD = $(".trans_rightDown");
        var child = parent.find('.trans_chart');
        parent.css('transition','none');
        if(type == 1){
            parent.find('i').css({
                width:'40px',
                height:'40px',
                backgroundSize:'40px'
            });
            parent.find('.trans_max').css('right','68px');
            self.attr('data-type','11');
            bg.show();
            parent.animate({
                width:'1078px',
                height:'760px',
                right:'422px',
                zIndex: '50'
            });
            TR.css({
                visibility:'hidden'
            });
            TRD.css({
                visibility:'hidden'
            });
            //$(".top_img").css("top","4px");
            //$(".top_img img").css("width","300px");

        }else if(type == 2){
            parent.find('i').css({
                width:'40px',
                height:'40px',
                backgroundSize:'40px'
            });
            parent.find('.trans_max').css('right','68px');
            self.attr('data-type','21');
            bg.show();
            parent.animate({
                width:'1078px',
                height:'760px',
                bottom:'94px',
                right:'422px',
                zIndex: '50'
            });
            TL.css({
                visibility:'hidden'
            });
            TRD.css({
                visibility:'hidden'
            });
            //$(".top_img").css("top","4px");
            //$(".top_img img").css("width","300px");
        }else if(type == 3){
            parent.find('i').css({
                width:'40px',
                height:'40px',
                backgroundSize:'40px'
            });
            parent.find('.trans_max').css('right','68px');
            self.attr('data-type','31');
            bg.show();
            parent.animate({
                width:'1078px',
                height:'760px',
                right:'422px',
                top:'223px',
                zIndex: '50'
            });
            TL.css({
                visibility:'hidden'
            });
            TR.css({
                visibility:'hidden'
            });
            //$(".top_img").css("top","4px");
            //$(".top_img img").css("width","300px");
        }else if(type == 11){
            parent.find('i').css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            parent.find('.trans_max').css('right','45px');
            self.attr('data-type','1');
            bg.hide();
            parent.animate({
                width:'584px',
                height:'400px',
                right:'172px',
                zIndex: '50'
            });
            //$(".top_img").css("top","29px");
            //$(".top_img img").css("width","150px");
        }else if(type == 21){
            parent.find('i').css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            parent.find('.trans_max').css('right','45px');
            self.attr('data-type','2');
            bg.hide();
            parent.animate({
                width:'584px',
                height:'400px',
                right:'172px',
                bottom:'30px',
                zIndex: '50'
            });
            //$(".top_img").css("top","29px");
            //$(".top_img img").css("width","150px");

        }else if(type == 31){
            parent.find('i').css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            parent.find('.trans_max').css('right','45px');
            self.attr('data-type','3');
            bg.hide();
            parent.animate({
                width:'654px',
                height:'426px',
                right:'172px',
                top: '542px',
                zIndex: '50'

            });
            //$(".top_img").css("top","29px");
            //$(".top_img img").css("width","150px");

        }


    });
    //监测点击退出事件
    $(".trans_exit").on('click',function(){
        var self = $(this);
        var bg = $(".background_img");
        var type= self.attr('data-type');
        var parent = self.parents(".trans_window");
        var TL = $(".trans_left");
        var TR =$(".trans_right");
        var TRD = $(".trans_rightDown");
        var alertL = $(".trans_detail_L");
        var alertR = $(".trans_detail_R");
        var alertE = $(".event-lists");
        var child = parent.find('.trans_chart');
        $(".top_img").css("top","29px");
        $(".top_img img").css("width","150px");
        if(type == 1){
            parent.find('i').css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            parent.find('.trans_max').css('right','45px');
            bg.hide();
            parent.css({
                width:'583px',
                height:'400px',
                right:'172px',
                zIndex: '40',
                visibility:'hidden'
            });

        }else if(type == 2){
            parent.find('i').css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            parent.find('.trans_max').css('right','45px');
            bg.hide();
            parent.css({
                width:'583px',
                height:'400px',
                right:'172px',
                zIndex: '40',
                visibility:'hidden'
            });

        }else if(type == 3){
            parent.find('i').css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            parent.find('.trans_max').css('right','45px');
            bg.hide();
            parent.css({
                width:'583px',
                height:'400px',
                right:'172px',
                top: '542px',
                zIndex: '40',
                visibility:'hidden'
            });

        }else if(type == 5){
            bg.hide();
            alertL.hide();
        }else if(type == 6){
            bg.hide();
            alertR.hide();
        }else if(type == 7){
            bg.hide();
            alertE.hide();
        }


        //parent.slideUp("slow");
    });
    //点击显示图表
    $(".trans_button i").on('click',function(){
        $(".eventsInfos").slideUp("slow");
        var self = $(this);
        var alertWindow = $(".trans_alert_window");
        var type =self.attr('data-img');
        var visi = self.attr('data-visi');
        //var bg = $(".background_img");
        if(type == 1){
            self.attr('data-img','11');
            //bg.show();
            //$(".trans_left").slideDown("slow");
            $(".trans_left").css({
                visibility:'visible',
                transition: 'all 1500ms linear',
                transformsStyle: 'preserve-3d',
                transform: 'rotateY(360deg)'
            });
        }else if(type == 2){
            self.attr('data-img','22');
            //bg.show();
            //$(".trans_right").slideDown("slow");
            $(".trans_right").css({
                visibility:'visible',
                transition: 'all 1500ms linear',
                transformsStyle: 'preserve-3d',
                transform: 'rotateY(360deg)'
            });
        }else if(type == 3){
            self.attr('data-img','33');
            //bg.show();
            //$(".trans_rightDown").slideDown("slow");
            $(".trans_rightDown").css({
                visibility:'visible',
                transition: 'all 1500ms linear',
                transformsStyle: 'preserve-3d',
                transform: 'rotateY(360deg)'
            });
        }else if(type ==11){
            self.attr('data-img','1');
            //bg.hide();
            //$(".trans_left").slideUp("slow");
            $(".trans_left").css({
                visibility:"hidden",
                transition: 'none',
                transformsStyle: 'preserve-3d',
                transform: 'rotateY(0deg)'
            });

        }else if(type ==22){
            self.attr('data-img','2');
            //bg.hide();
            //$(".trans_right").slideUp("slow");
            $(".trans_right").css({
                visibility:"hidden",
                transition: 'none',
                transformsStyle: 'preserve-3d',
                transform: 'rotateY(0deg)'
            });
        }else if(type ==33){
            self.attr('data-img','3');
            //bg.hide();
            //$(".trans_rightDown").slideUp("slow");
            $(".trans_rightDown").css({
                visibility:"hidden",
                transition: 'none',
                transformsStyle: 'preserve-3d',
                transform: 'rotateY(0deg)'
            });
        }
        alertWindow.hide();

    });
    //点击右上按钮切换地图背景
    $(".trans_map i").on('click',function(){
        var self = $(this);
        var worldIco = $(".trans_map .topR4");
        var chinaIco = $(".trans_map .topR1");
        var type =self.attr('data-map');
        if(type == 1){
            $(".worldMap").fadeOut();
            $(".chinaMap").fadeIn();
            $('#chinaIfr').attr('src', $('#chinaIfr').attr('src'));
            self.hide();
            worldIco.show();
        }else if(type == 4){
            $(".worldMap").fadeIn();
            $(".chinaMap").fadeOut();
            $('#worldIfr').attr('src', $('#worldIfr').attr('src'));
            self.hide();
            chinaIco.show();
        }
    });
    //点击显示事件信息
    $(".trans_map .topR2").on('click',function(){
        var self =$(this);
        $(".trans_left").css('visibility','hidden');
        $(".trans_button .transL").attr('data-img','1');
        var imgType = self.attr('data-msg');
        if(imgType == 1){
            $(".infoMsgs").hide();
            $(".eventsMsgs").show();
            self.attr('data-msg','2');
        }else{
            $(".eventsMsgs").hide();
            self.attr('data-msg','1');
        }

    });
    $(".eventsMsgs").on('mouseleave',function(){
        //console.log('moveleave');
        $(this).hide();
    });


    //hover信息
    $(".trans_map .topR3").on('click',function(){
        var self =$(this);
        var imgType = self.attr('data-msg');
        if(imgType == 1){
            $(".eventsMsgs").hide();
            $(".infoMsgs").show();
            self.attr('data-msg','2');
        }else{
            $(".infoMsgs").hide();
            self.attr('data-msg','1');
        }
    });
    //点击稿件弹出传播路径
    setTimeout(top_click, 5000);
    function top_click(){
        $("#trans-center").contents().find(".td2").click(function(){

            var id=$(this).attr("id");
            //console.log(id);
            $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid="+id);
            provinceUrl = "/cas/xhs/bigScreen/main.do?method=getProvinceCeiByGuid&zbGuid="+id;
            $(".province").slideUp("slow");
            //var aa=window.open();
            //setTimeout(function(){
            //    aa.location = 'http://www.baidu.com';
            //}, 100);

            //var bg = $(".background_img");
            //bg.show();
            //$('.trans_left').css("visibility","hidden");
            //// $(".trans-right2").attr("src",url);
            //$('#detail_L').attr('src', "./newScreen/force.html?zbGuid="+id);
            //$("#detail_R").attr("src","./newScreen/trans-leftDown_web.html?guid="+id);
            ////$(".trans_alert_window").show("slow");
            //$(".trans_detail_L").show("slow");
        });
        $("#trans-center").contents().find(".td4").click(function(){

            var id=$(this).attr("id");
            //console.log(id);
            var bg = $(".background_img");
            bg.show();
            $(".trans_left i").css({
                width:'20px',
                height:'20px',
                backgroundSize:'20px'
            });
            $(".trans_left .trans_max").css('right','45px');
            $(".trans_button .transL").attr('data-img','11');
            $(".trans_button .transR").attr('data-img','2');
            $(".trans_left").css({
                width:'583px',
                height:'400px',
                right:'172px',
                zIndex: '40',
                visibility:'visible'
            });
            $(".trans_right").css({
                width:'583px',
                height:'400px',
                right:'172px',
                zIndex: '40',
                visibility:'hidden'
            });
            //$('.trans_left').css("visibility","hidden");
            //// $(".trans-right2").attr("src",url);
            $('#detail_L').attr('src', "./newScreen/force.html?zbGuid="+id);
            //$("#detail_R").attr("src","./newScreen/trans-leftDown_web.html?guid="+id);
            ////$(".trans_alert_window").show("slow");
            $(".trans_detail_L").show("slow");
        });
    }
    //获取事件简介
    function getEventInfo(id){
        var url = "http://111.203.35.59/wcm/bigdata.do?modelid=getEventIntroForBig&serviceid=eventtrace&topvalue=5&typeid=event&user_id=admin&department=admin&eventid="+id;
        $.ajax({
            url: wcmUrl,
            data: {
                url:url
            },
            type: "get",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data){
                //console.log(data)
                var lists = data;
                $(".eventsInfos .abs").text(lists.abs);
                $(".eventsInfos .xhsCount>span").attr('data-id',id);
                $(".eventsInfos .xhsCount i").text(lists.xhsCount);
                $(".eventsInfos .allCount i").text(lists.outCount);

            }
        });
    }
    $(".eventsInfos .xhsCount >span").on('click',function(){
        var id =$(this).attr('data-id');
        $(".background_img").show();
        $(".event-lists").show();
        getEventLists(id);
    });
    //获取事件稿件列表
    function getEventLists(id){
        $(".event-lists .lists").empty();
        var url = "http://111.203.35.59/wcm/bigdata.do?modelid=getEventInnerList&serviceid=eventtrace&pageNo=1&pageSize=10&typeid=event&user_id=admin&department=admin&eventid="+id;
        var lists = $(".event-lists .lists");
        $.ajax({
            url: wcmUrl,
            data: {
                url:url
            },
            type: "get",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(data){
                //console.log(data)
                var lists = data.PAGEITEMS;
                var htmls="";
                $.each(lists,function(i,n){
                    var author = n.AUTHOR == null?'暂无':n.AUTHOR.length>11?(n.AUTHOR.substring(0,11)+'...'):n.AUTHOR;
                    htmls += "<li class=\"item\"><span  class=\"title\" >"+
                        "<a href='/dist/index.html#/decisioncenterdetail?guid="+ n.GUID +"'   target='_blank'>"+  n.TITLE+ "</a>" +
                        "</span>"+
                        "<span class=\"author\">"+ author+"</span>" +
                        "<span class=\"PUBTIME\">"+ n.PUBTIME+"</span>" +
                        "</li>"
                });
                $(".event-lists .lists").append(htmls);

            }
        });
    }

    //获取事件信息
    getEvents();
   function getEvents(){
       var events;
       var url = connectUrl("http://111.203.35.59/wcm/bigdata.do?event_type=public&eventid=0&key_word=&modelid=hoteventlist&page_no=0&page_size=10&serviceid=eventmgr&typeid=event&user_id=admin&department=admin");
       // d3.xhr(wcmUrl).get({
       //     url:url
       // },function(error, data){
       //     console.log(error);
       //     console.log(data);
       //     if(error || $.isEmptyObject(data) == true) {
       //         return;
       //     }
       //     events = data.CONTENT;
       //     //console.log(events)
       //     //renderlist
       //     var li = d3.select('.eventsMsgs ul').selectAll('li');
       //     var update = li.data(events);
       //     var enter = update.enter();
       //
       //     update.html(function(d,i){
       //         if(i == 5) return;
       //         return '<s>●</s>'+d.TITLE;
       //     });
       //
       //
       //     enter.append('li')
       //         .html(function(d,i){
       //             if(i == 5) return;
       //             return  '<s>●</s>'+d.TITLE;
       //         })
       //
       //         .on('click',function(d){
       //             $(this).addClass('choose').siblings().removeClass('choose');
       //             $(".province").slideUp("slow");
       //             $(".eventsInfos").slideDown("slow");
       //             getEventInfo(d.ID);
       //             //$("#chinaIfr").attr("src","./newScreen/map/flashmap.html?eventID="+d.ID+"&showTip=false");
       //             $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?eventID="+d.ID);
       //
       //         });
       //
       //     //renderlist-end
       // })

       // $.ajax({
       //     url: wcmUrl,
       //     async:false,
       //     data: {
       //         url:url
       //     },
       //     type: "get",
       //     dataType: "json",
       //     contentType: "application/json; charset=utf-8",
       //     success: function(data){
       //         if($.isEmptyObject(data) == true) {
       //             return;
       //         }
       //         data = data.DATA;
       //         console.log(data);
       //         events = data.CONTENT;
       //         //console.log(events)
       //         //renderlist
       //         var li = d3.select('.eventsMsgs ul').selectAll('li');
       //         var update = li.data(events);
       //         var enter = update.enter();
       //
       //         update.html(function(d,i){
       //             if(i == 5) return;
       //             return '<s>●</s>'+d.TITLE;
       //         });
       //
       //
       //         enter.append('li')
       //             .html(function(d,i){
       //                 if(i == 5) return;
       //                 return  '<s>●</s>'+d.TITLE;
       //             })
       //
       //             .on('click',function(d){
       //                 $(this).addClass('choose').siblings().removeClass('choose');
       //                 $(".province").slideUp("slow");
       //                 $(".eventsInfos").slideDown("slow");
       //                 getEventInfo(d.ID);
       //                 //$("#chinaIfr").attr("src","./newScreen/map/flashmap.html?eventID="+d.ID+"&showTip=false");
       //                 $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?eventID="+d.ID);
       //
       //             });
       //         //return;
       //     }
       // });
       d3.json(url,function(error, data){
           if(error || $.isEmptyObject(data) == true) {
               return;
           }
           events = data.CONTENT;
           //console.log(events)
           //renderlist
           var li = d3.select('.eventsMsgs ul').selectAll('li');
           var update = li.data(events);
           var enter = update.enter();

           update.html(function(d,i){
               if(i == 5) return;
               return '<s>●</s>'+d.TITLE;
           });


           enter.append('li')
               .html(function(d,i){
                   if(i == 5) return;
                   return  '<s>●</s>'+d.TITLE;
               })

            .on('click',function(d){
                $(this).addClass('choose').siblings().removeClass('choose');
                $(".province").slideUp("slow");
                $(".eventsInfos").slideDown("slow");
                getEventInfo(d.ID);
                //$("#chinaIfr").attr("src","./newScreen/map/flashmap.html?eventID="+d.ID+"&showTip=false");
                $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?eventID="+d.ID);

            });

           //renderlist-end
       })

   }
    //getEvents();


    //获取省份分类数据
    /*function getProvince(){
        var influenceValue,sortPro;
        var url = "/cas/casData/screenJson?type=provinceCei";
        d3.json(url,function(error, data){
            if(error || $.isEmptyObject(data) == true) {
                return;
            }

            influenceValue = data;
            sortPro = influenceValue.sort(function(a, b) { return d3.descending (parseInt(a.cei.replace(/,/,'')), parseInt(b.cei.replace(/,/,''))) });
            var lists = "";
            for (var i=0;i<11;i++){
                var name,value,list;
                name = influenceValue[i].area;
                value = influenceValue[i].cei;
                list = "<li><span class='item'>" + name + "</span>" + "<span class='itemValue'>" + value + "</span></li>";
                lists += list;
            }
            console.log(lists);
            $(".province ul").append(lists);

        })

    }*/
    //getProvince();

    var COUNTS={};
    var COUNT = function(id,newcount,oldcount){
        this.id=id;
        this.newcount=newcount;
        this.oldcount=oldcount;
        this.cardNumber = new CardNumber(oldcount,newcount,$("#"+this.id),Math.random()*1000);

    };


    var update=function(t){
        var title = $(".province > h2");
        //console.log(title);
        if(t == 3){
            provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=threeProvinceCei");
            //provinceUrl = "/cas/casData/screenJson?type=provinceCei";
            title.text("72小时稿件影响力排行TOP10")
        }else if(t == 1){
            provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=oneProvinceCei");
            title.text("24小时稿件影响力排行TOP10")
        }else if(t == 7){
            provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=sevenProvinceCei");
            title.text("近7天稿件影响力排行TOP10")
        }else if(t == 30){
            provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=thirtyProvinceCei");
            title.text("近30天稿件影响力排行TOP10")
        }else if(t == 'all'){
            provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=provinceCei");
            title.text("全部稿件影响力排行TOP10")
        }
        queue().defer(d3.json,provinceUrl)
        //queue().defer(d3.json,"/cas/casData/screenJson?type=provinceCei")
            .await(function(error,data){
                if(data.DATA) {
                    $apul.empty();
                    var _COUNTS = $.extend(true, {}, COUNTS);
                    COUNTS = {};
                    data.DATA.forEach(function (item, index) {
                        if (index > 9) return;
                        //var cei = parseInt(item.cei.replace(/,/g, ''));
                        //var cei = parseInt(item.cei);
                        //console.log('111'+item.cei)
                        var cei = (typeof item.cei=='string')?parseInt(item.cei.replace(/,/g,'')):parseInt(item.cei);
                        //var cei = (typeof item.num=='string')?parseInt(item.num.replace(/,/g,'')):parseInt(item.num);

                        $apul.append("<li><span class='item' >" + item.area + "</span><span class='itemValue' id='" + item.areaPY + "'>" + cei + "</span></li>");
                        var oldVal = (_COUNTS[item.areaPY] ? _COUNTS[item.areaPY].cardNumber.getValue() : (cei - 0)) || (cei - 0);
                        //console.log(oldVal)
                        //console.log(cei)

                        //COUNTS[item.areaPY] = new COUNT(item.areaPY, cei, oldVal);
                        //console.log(item.areaPY,cei,oldVal);
                    });
                }
                //console.log('update')
                setTimeout(function(t){
                    COUNTS = {};
                    update(t);
                },1000 * 60 * 10);

            });
    };



    var $apul = $(".province ul").empty();




        


  function checkArticle(url){
      //console.log("checkin");
      var tmp;
      $.ajax({
          url: wcmUrl,
          async:false,
          data: {
              url:url
          },
          type: "get",
          dataType: "json",
          contentType: "application/json; charset=utf-8",
          success: function(data){
              var checkValue = data.Records == ""?'false':'true';
              if(checkValue == 'false'){
                  tmp = 1;


              }
              //return;
          }
      });
      return tmp;
  }


    //稿件检索
    $("#searchSubmit").on('click',function(){

        provinceUrl = connectUrl("http://111.203.35.59/cas/casData/screenJson?type=provinceCei");
        setTimeout(top_click, 5000);
        var searchId = $('#searchValue').val()||'',
            //timeStart = $('#timeStart').val().replace(/-/g,""),
            //timeEnd = $('#timeEnd').val().replace(/-/g,""),
            check=1;
        if(searchId ==''){
            return;
        }else if(searchId!=''&&searchId.length!=18){
            alert("请输入正确的稿件ID！");
            return;
        }
        //console.log(searchId.length)
        //if(searchId=='' &&timeStart==''&&timeEnd==''){
        //    $(".trans_left").css("visibility","visible");
        //    $(".province").slideDown("slow");
        //    $(".trans_button .transL").attr('data-img','11');
        //    //console.log( $(".trans_button .transL").attr('data-img'));
        //    $("#trans-center").attr("src","./newScreen/trans-center.html");
        //    $("#chinaIfr").attr("src","./newScreen/map/flashmap.html");
        //    return;
        //}else if(searchId!=''&&searchId.length!=18){
        //    alert("请输入正确的稿件ID！")
        //    return;
        //}else{
        //    //console.log("in")
        //    var url = url = '/cas/xhs/bigScreen/main.do?method=getArticleSearch&zbGuid='+searchId+"&pubTimeStart="+timeStart+"&pubTimeEnd="+timeEnd;
        //    console.log(checkArticle(url))
        //    checkR = checkArticle(url);
        //
        //    //console.log(checkR);
        //    if(checkR ==1){
        //        alert("暂无该稿件信息！")
        //        //console.log("checkR:"+checkR);
        //        return;
        //    }
        //
        //
        //}
        //console.log("checkR2:"+checkR);
        $(".trans_left").css("visibility","visible");
        $(".province").slideUp("slow");
        $(".eventsInfos").slideUp("slow");
        $(".trans_button .transL").attr('data-img','11');
        $("#trans-center").attr("src","./newScreen/trans-center.html?zbGuid="+searchId+"&pubTimeStart=&pubTimeEnd=");
        setTimeout(top_click, 5000);
        //provinceUrl = "/cas/xhs/bigScreen/main.do?method=getProvinceCeiByGuid&zbGuid="+searchId;
        $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid="+searchId+"&pubTimeStart=&pubTimeEnd=");

        //console.log( $(".trans_button .transL").attr('data-img'));
        //$("#trans-center").attr("src","./newScreen/trans-center.html?zbGuid="+searchId+"&pubTimeStart="+timeStart+"&pubTimeEnd="+timeEnd);
        //console.log(searchId+','+(timeStart=='')+','+timeEnd);
        //if(searchId!=''){
        //    provinceUrl = "/cas/xhs/bigScreen/main.do?method=getProvinceCeiByGuid&zbGuid="+searchId;
        //    $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid="+searchId+"&pubTimeStart="+timeStart+"&pubTimeEnd="+timeEnd);
        //}else if(searchId==''&&timeStart!=''){
        //    $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid="+searchId+"&pubTimeStart="+timeStart+"&pubTimeEnd="+timeEnd+"&showTip=false");
        //}else if(searchId==''&&timeStart==''&&timeEnd==''){
        //    $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid="+searchId+"&pubTimeStart="+timeStart+"&pubTimeEnd="+timeEnd);
        //}



    });
    $('.turnRight').on('click',function(){
        $(".trans_detail_L").slideDown("slow");
        $(".trans_detail_R").hide();
    });
    $('.turnLeft').on('click',function(){
        $(".trans_detail_R").slideDown("slow");
        $(".trans_detail_L").hide();

    });


    //显示所有稿件信息
    //$("#returnAll").on('click',function(){
    //    setTimeout(top_click, 5000);
    //    $(".eventsInfos").slideUp("slow");
    //    //$("#timeStart").val('');
    //    //$("#timeEnd").val('');
    //    $("#searchValue").val('');
    //    $(".trans_left").css("visibility","visible");
    //    $(".trans_button .transL").attr('data-img','11');
    //    $(".eventsMsgs").hide();
    //    $(".province").slideDown("slow");
    //    $("#chinaIfr").attr("src","./newScreen/map/flashmap.html");
    //    update();
    //    $("#trans-center").attr("src","./newScreen/trans-center.html");
    //})

    //搜索条件为ID时清空时间，为时间时清空ID
    $(".choseTime").on('change',function(){
        $("#searchValue").val('')
    });
    $("#searchValue").on('change',function(){
        $(".choseTime").val('')
    });



    //获取时间
    function getChooseTime(t){
        var now = new Date();
        var nowYear = now.getFullYear();
        var nowMonth = (now.getMonth() + 1)<10?'0'+(now.getMonth() + 1):(now.getMonth() + 1);
        var nowDay = now.getDate()<10?'0'+now.getDate():now.getDate();
        var date = new Date(now.getTime() - t * 24 * 3600 * 1000);
        var year = date.getFullYear();
        var month =  (date.getMonth() + 1)<10?'0'+(date.getMonth() + 1):(date.getMonth() + 1);
        var day = date.getDate()<10?'0'+date.getDate():date.getDate();

       var startTime =  year + '' + month + '' + day;
       var endTime = nowYear + ''+ nowMonth +''+ nowDay;
        //console.log(startTime);
        //console.log(endTime)
        $(".trans_left").css("visibility","visible");
        $(".province").slideUp("slow");
        $(".trans_button .transL").attr('data-img','11');
        $("#trans-center").attr("src","./newScreen/trans-center.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTime="+t);
        //provinceUrl = "/cas/xhs/bigScreen/main.do?method=getProvinceCeiByGuid&zbGuid="+searchId;
        //$("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTip=false");
        if(t == 3){
            $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTip=true&type=threeProvinceCei");
            //$("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTip=true&type=provinceCei");
        }else if(t == 1){
            $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTip=true&type=oneProvinceCei");
        }else if(t == 7){
            $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTip=false&type=sevenProvinceCei");
        }else if(t == 30){
            $("#chinaIfr").attr("src","./newScreen/map/flashmap.html?zbGuid=&pubTimeStart="+startTime+"&pubTimeEnd="+endTime+"&showTip=false&type=thirtyProvinceCei");
        }
        $(".province").slideDown("slow");
        update(t);


    }

    $(".recentyTime").on('click',function(){
        var rec = $(this).attr('data-time');
        $("#searchValue").val('');
        $(".eventsInfos").slideUp("slow");
        getChooseTime(rec);
        setTimeout(top_click, 5000);
      });
    getChooseTime(1);
    $(".searchTop .time-choose").on('click',function(){
        $(this).addClass('time-active').siblings().removeClass('time-active')
    });
    $(".event-lists .lists").niceScroll();
});