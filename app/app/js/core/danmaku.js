cqrbdp.showInfoItems = function() {

    var itemBgColor = [{
        'bg': '#822538',
        'border': '#D3A49A',
        'corner': 'pro-icon09.png'
    }, {
        'bg': '#99800A',
        'border': '#DDC378',
        'corner': 'pro-icon05.png'
    }, {
        'bg': '#26762F',
        'border': '#4AC18B',
        'corner': 'pro-icon01.png'
    }];

    var trackPaths = [
        [{
            bottom: '120px',
            left: '600px'
        }, {
            bottom: '320px',
            left: '880px'
        }, {
            bottom: '680px',
            left: '1100px'
        }, {
            bottom: '780px',
            left: '1200px'
        }],
        [{
            bottom: '220px',
            left: '290px'
        }, {
            bottom: '440px',
            left: '600px'
        }, {
            bottom: '800px',
            left: '800px'
        }, {
            bottom: '900px',
            left: '900px'
        }],
        [{
            bottom: '330px',
            left: '0px'
        }, {
            bottom: '560px',
            left: '280px'
        }, {
            bottom: '920px',
            left: '530px'
        }, {
            bottom: '1020px',
            left: '630px'
        }]
    ];

    function danmakuItem(parent, option) {
        this.parent = parent;
        this.title = option.title;
        this.author = option.author;
        this.bgIndex = option.bgIndex;
        this.source = option.source;
        this.reshipment = option.reshipment;
    }
    danmakuItem.prototype.init = function() {
        this.dom = document.createElement('div');
        this.dom.className = 'item-wrapper';

        var textNodes = document.createElement('div');
        textNodes.className = 'text-wrapper';
        var innerhtml = '';
        innerhtml += '<div class="item-title"><span>' + this.title + '</span></div>';
        innerhtml += '<div class="item-intro"><span>记者：' + this.author + '</span><span class="sep"></span>'+
                     '</span><span>转载量：' + this.reshipment + '</span></span><span class="sep"></span>'+
                     '</span><span>来源：' + this.source + '</span>' +
            '</div>';
        innerhtml += '<div class="text-bg"><img class="corner1"><img class="corner2"><img class="corner3"><img class="corner4"></div>';
        textNodes.innerHTML = innerhtml;

        var iconNode = document.createElement('div');
        iconNode.className = 'item-headic';
        var innerhtml2 = '';
        innerhtml2 += '<div class="line"><img src="images/pro-icon13.png"></div>';
        innerhtml2 += '<div class="headic"><img class="icon" src="images/pro-bac06.png"><img class="spinner" src="images/pro-bac05.png"></div>';
        iconNode.innerHTML = innerhtml2;

        this.dom.appendChild(textNodes);
        this.dom.appendChild(iconNode);
    }
    danmakuItem.prototype.execPhase1 = function() {
        var itemWrapper = this.dom;
        var headic = $(itemWrapper).find('.item-headic').fadeIn('slow', function(){
        	$(itemWrapper).find('.text-wrapper').slideDown('slow');
        });
    }
    danmakuItem.prototype.execPhase2 = function(callback) {
        var itemWrapper = this.dom;
        var color = itemBgColor[this.bgIndex];
        //放大
        $(itemWrapper).find('.headic .icon').animate({
            'height': '180px',
            'margin-left': '-60px'
        }, 500, function() {
            // $(itemWrapper).find('.item-intro').slideDown('1000', function() {
            $(itemWrapper).addClass('hight-light'); //放倒
            $(itemWrapper).find('.item-headic .line').animate({ //增长连接线
                'height': '100px',
                'margin-bottom': '-80px',
            }, 300, function() {
                $(itemWrapper).find('.spinner').css('display', 'block'); //增加环
                $(itemWrapper).find('.spinner').addClass('ring'); //增加环旋转
                addBg(callback);
            });
            // });

        });
        $(itemWrapper).find('.item-intro').slideDown('slow');


        function addBg() {
            $(itemWrapper).find('.text-bg').css({
                'background-color': color.bg,
                'border': '1px solid ' + color.border,
            });
            $(itemWrapper).find('.text-bg img').attr('src', 'images/' + color.corner);
            $(itemWrapper).find('.text-bg img').css('display', 'block');
            $(itemWrapper).find('.text-bg').animate({
                'width': '100%',
            }, 'fast', function() { callback() });
        }
    }
    danmakuItem.prototype.execPhase3 = function(callback) {
        var itemWrapper = this.dom;
        $(itemWrapper).find('.text-bg').animate({
            'width': '0',
        }, 200, function() {
            $(itemWrapper).find('.text-bg img').css('display', 'none');
            $(itemWrapper).find('.text-bg').css({
                'border': 'none',
            });
            $(itemWrapper).find('.item-intro').slideUp('slow');

            $(itemWrapper).find('.spinner').css('display', 'none'); //增加环
            $(itemWrapper).removeClass('hight-light'); //放倒
            $(itemWrapper).addClass('normal'); //放倒
            $(itemWrapper).find('.item-headic .line').animate({
                'height': '50px',
                'margin-bottom': '0px'
            }, 200, function() {
                $(itemWrapper).find('.item-headic .line').animate({
                    'height': '120px'
                }, callback);
                $(itemWrapper).find('.headic .icon').animate({
                    'height': '60px',
                    'margin-left': '0px'
                });
            });
        });
    }
    danmakuItem.prototype.execPhase4 = function() {
        var itemWrapper = this.dom;
        $(itemWrapper).find('.item-headic .line').animate({
            'height': '20px'
        }, 2000);
    }



    function CommentManager(stageObj, loop) {
        this.stage = stageObj;
        this.timeline = [];
        this.runline = [];
        this.position = 0;
        this.available = true;

        this.interVal = -1;

        this.loop = false; //是否循环播放
        if (loop != undefined) {
            this.loop = loop;
        };
    }
    /**
     * 
     */
    CommentManager.prototype.load = function(datalist) {
        this.timeline = datalist;
    }
    CommentManager.prototype.add = function() {
        var cmts = [];
        if (this.available) {
            if (this.position + 3 <= this.timeline.length) {
                for (var i = 0; i < 3; i++) {
                    var cmt = new danmakuItem(this, this.timeline[this.position]);
                    this.position += 1;
                    cmts.push(cmt);
                }
            } else {
                if (this.loop) {
                    this.position = 0;
                    if (this.timeline.length < 3) {
                        return;
                    }
                    for (var i = 0; i < 3; i++) {
                        var cmt = new danmakuItem(this, this.timeline[this.position]);
                        this.position += 1;
                        cmts.push(cmt);
                    }
                } else {
                    this.available = false;
                    return;
                }
            }
        } else {
            return;
        }
        var backcolorIndex = [0, 1, 2];
        for (var i = 0; i < cmts.length; i++) {
            var tempcmt = cmts[i];
            tempcmt.track = i; //该条信息处在的位置[1,2,3]
            tempcmt.init();
            tempcmt.dom.style.bottom = trackPaths[i][0].bottom;
            tempcmt.dom.style.left = trackPaths[i][0].left;
            var tempIndex = backcolorIndex.splice(Math.floor(Math.random() * backcolorIndex.length), 1);
            tempcmt.bgIndex = tempIndex[0];
            tempcmt.step = 1; //当前处于阶段

            this.runline.push(tempcmt);
            this.stage.appendChild(tempcmt.dom);
            tempcmt.execPhase1();
        };
    }
    CommentManager.prototype.start = function() {
        var _cm = this;
        _cm.add();
        var occupid = false;
        //时间间隔后更新内容位置
        if (!occupid) {
            setTimeout(function() {
                _cm.update();
                occupid = true;
                _cm.interVal = setInterval(function() {
                    _cm.update();
                }, 6000);
            }, 1000);
        };
    }

    CommentManager.prototype.update = function() {
        var _cm = this;
        var step1Count = 3;
        var detailShowing = false;
        if (_cm.runline.length > 0) {
            for (var i = 0; i < _cm.runline.length; i++) {
                if (_cm.runline[i].step == 4) {
                    _cm.runline.splice(i, 1);
                }
            }
            for (var i = 0; i < _cm.runline.length; i++) {
                var cmt = _cm.runline[i];
                if (cmt.step == 1) {
                    step1Count -= 1;
                };
                cmt.step += 1;
                move(cmt, step1Count);
            }
        }

        function move(cmt, count) {
            var trackPath = trackPaths[cmt.track];
            if (cmt.step == 2) {
                setTimeout(function() {
                    moveAndShowing();
                }, 500);

                function moveAndShowing() {
                    detailShowing = true;
                    $(cmt.dom).animate({
                        'bottom': trackPath[1].bottom,
                        'left': trackPath[1].left
                    }, 1500, function() {
                        cmt.execPhase2(function() { //在展示动画播放完后，再添加新的信息
                            if (count == 0) {
                                _cm.add();
                            };
                        });

                    });
                }
            } else if (cmt.step == 3) {
                cmt.execPhase3(function() {
                    cmt.execPhase4();
                    $(cmt.dom).animate({
                        'bottom': trackPath[2].bottom,
                        'left': trackPath[2].left
                    }, 1500);
                });

            } else if (cmt.step == 4) {
                $(cmt.dom).animate({
                    'bottom': trackPath[3].bottom,
                    'left': trackPath[3].left,
                    'opacity': 0
                }, 2000, function() {
                    _cm.finish(this);
                });
            }
        }
    }
    CommentManager.prototype.finish = function(cmtdom) {
        this.stage.removeChild(cmtdom);
    };
    /*CommentManager.prototype.replay = function() {
        this.position = 0;
        this.available = true;
        // this.start();
    }*/






    var datalist = [{
        title: '西部地区鼓励类产业企业 我市减按15%税率征收所得税',
        author: '胡勇',
        source:'重庆日报',
        reshipment:'25'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
        title: '三借“外脑”突破发展瓶颈',
        author: '张红梅 黄光红',
        source:'重庆日报',
        reshipment:'19'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
        title: '坚持结果导向 落实法治政府建设',
        author: '张珺',
        source:'重庆日报',
        reshipment:'19'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
    	title: '使用错误临时号牌 车主遭罚5000元',
        author: '唐中明',
        source:'重庆晚报',
        reshipment:'16'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
        title: '迎世界旅游城市峰会，2016泛渝旅游品牌大会下月20日举行',
        author: '刘涛',
        source:'重庆晚报',
        reshipment:'26'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
        title: '永川成全国最大机器人产业基地',
        author: '李栋 毕克勤',
        source:'重庆晚报',
        reshipment:'23'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
        title: '“营改增”前赶紧买卖房？没这必要',
        author: '黎胜斌',
        source:'重庆晨报',
        reshipment:'33'
        //telephone: '18898773458',
       // domain: '纪实新闻'
    }, {
        title: '这个干粗活的机器人，为什么练起了书法？',
        author: '熊远树 杨野',
        source:'重庆晨报',
        reshipment:'15'
       // telephone: '18898773458',
       // domain: '纪实新闻'
    }, {
        title: '重庆楼市企稳回暖 成交量增长超3成',
        author: '陈再',
        source:'重庆商报',
        reshipment:'18'
        //telephone: '18898773458',
        //domain: '纪实新闻'
    }, {
        title: '20条文物旅游线路 带你穿梭重庆老街',
        author: '刘晓娜',
        source:'重庆商报',
        reshipment:'15'
       // telephone: '18898773458',
       // domain: '纪实新闻'
    }];
    var cm = new CommentManager($('.stage')[0], true);
    cm.load(datalist);
    cm.start();

}
