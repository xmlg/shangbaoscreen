(function() {
    function App() {
        var self = this;
        var globalIdx = 0;
        App.prototype.start();
        var srterval = window.setInterval(function() {
            $('.main_content').html("");
            if ($('.main').find(".noData")) {
                $('.noData').hide();
            }
            App.prototype.start();
        }, 150 * 1000);
    }
    App.prototype.getId = function() {
        var self = this;
        self.quest = new UrlSearch();
        self.id = self.quest.id
        self.url = '/screen/consensus/getnewlist?id=' + self.id + '&pagesize=20&startpage=0';
    }
    App.prototype.start = function() {
        var self = this;
        $(".main_content").attr("style", "margin-top:0px");
        App.prototype.getId();
        App.prototype.getOptionData(this.url, "text", "");
    }
    App.prototype.getOptionData = function(url, dataType, params) {
            var keepConnectionTimeout, //定时请求后端服务的定时器
                keepConnectionTime = 1000 * 5; //定时请求后端服务的设定时间
            var self = this;
            $.ajax({
                data: (params === undefined ? "" : params),
                dataType: dataType || "json",
                timeOut: 20000,
                method: "get",
                url: url,
                success: function(data) {
                    if (self.globalIdx != 0) {
                        self.globalIdx = 0;
                    }
                    var data = JSON.parse(data);
                    var dat = data.ITEMS.PAGEITEMS;
                    var datalen = dat.length;
                    var MONITOR_NAME_ARR = data.SENTIMENT_INDEX.split(">");
                    var MONITOR_NAME = MONITOR_NAME_ARR[MONITOR_NAME_ARR.length - 1];
                    var topTitle = (MONITOR_NAME != null) ? MONITOR_NAME : '一次舆情';
                    $('.top').text(topTitle); //显示头部大标题
                    $(document).attr("title", topTitle); //修改title值
                    if (datalen == 0) {
                        $("#ab_scroll").hide();
                        var mainDiv = $('.main');
                        mainDiv.append('<div class="noData">暂无今日数据</div>');
                        var srterval = window.setInterval(function() {
                            window.location.reload();
                        }, 120 * 1000);
                    } else {
                        $("#ab_scroll").show();
                        var n = 2;
                        var num = 1;
                        if (datalen >= 5) {
                            for (var i = 0; i < datalen; i++) {
                                App.prototype.drawOptionList(dat[i]);
                            }
                            var setinter = window.setInterval(function() {
                                if (num < Math.ceil(datalen / 5)) {
                                    App.prototype.DoMove('main_content', num);
                                    num++;
                                }
                            }, 30 * 1000);
                        }
                        if (datalen < 5 && datalen > 1) {
                            for (var i = 0; i < datalen; i++) {
                                App.prototype.drawOptionList(dat[i]);
                            }
                            var srterval = window.setInterval(function() {
                                window.location.reload();
                            }, 120 * 1000);
                        }
                        if (datalen == 1) {
                            App.prototype.drawOptionList(dat[0]);
                            var srterval = window.setInterval(function() {
                                window.location.reload();
                            }, 120 * 1000);
                        }
                    }
                },
                error: function(data) {
                    console.log("error:" + data);
                    self.globalIdx++;
                    if (self.globalIdx < 3) {
                        clearTimeout(keepConnectionTimeout);
                        keepConnectionTimeout = setTimeout(function() {
                            App.prototype.start();
                        }, keepConnectionTime);
                    }
                }
            });
        }
        /**
         * [drawOptionList description]添加一个列表信息
         * @param  {[type]} data [description]
         * @return {[type]}      [description]
         */
    App.prototype.drawOptionList = function(data) {
        var self = this;
        var chnl;
        if (data.DOCCHANNEL == null) {
            chnl = '';
        } else {
            chnl = data.DOCCHANNEL;
        }
        if (data.DOCTITLE.length > 61) {
            var context = data.DOCTITLE.substring(0, 60);
            context = context + '...';
        } else {
            var context = data.DOCTITLE;
        }
        var mainDiv = $('.main_content');
        mainDiv.append("<div class='item'><div class='top_circle'></div><div class='item_message'><span class='item_time'>" + data.SOURCESITE + "</span><span class='item_name'>" + chnl + "</span><span class='item_from'>" + data.DOCPUBTIME + "</span></div><div class='item_text'>" + context + "</div></div>")
        mainDiv.find(".noData").hide();
    }
    App.prototype.DoMove = function(ele, num) {
        var ele = $('.' + ele);
        var item0 = ele.children()[0];
        var item0_height = item0.offsetHeight * 5 + 150;
        $(ele).animate({
            'margin-top': -(item0_height * num) + "px"
        }, {
            duration: 3000,
            queue: false,
            complete: function() {
                //$(item0).remove();
            }
        })
    }

    function UrlSearch() {
        var name, value;
        var str = location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                this[name] = value;
            }
        }
    }
    var app = new App();
})()
