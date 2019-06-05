;
(function($) {
    /**
     * 是否已初始化过的标志
     * @private
     */
    var frameTopPrompt_init = false;

    $.extend({
        /**
         * 顶部弹出窗口初始化
         * @public
         * @param iWidth int 状态条宽度[默认250],单位px
         * @return void
         */
        initTopPrompt: function(iWidth) {
            if (!frameTopPrompt_init) {
                iWidth = (typeof(iWidth) == 'undefined') ? 300 : parseInt(iWidth);
                iWidth = (iWidth < 200) ? 200 : iWidth;
                var aBuf = new Array();
                /*关闭按钮图标*/
                var sImgData = "images/x_fzpic09.png";
                /*构造css样式*/
                aBuf.push('<style>');
                aBuf.push('#gc-frameTopPrompt{');
                aBuf.push('display:none;'); //默认不显示
                aBuf.push('position:fixed;');
                aBuf.push('text-align:center;');
                aBuf.push('font-size:15px;');
                aBuf.push('z-index:2000;');
                aBuf.push('font-family:cursive;');
                aBuf.push('clear:both:');
                aBuf.push('border:1px solid #e5e5e5;');
                aBuf.push('background:#D9EDF7;');
                aBuf.push('padding:5px 15px;');
                // aBuf.push('width:' + iWidth + 'px;');
                aBuf.push('left:50%;');
                aBuf.push('margin-left:-' + parseInt(iWidth / 2) + 'px;');
                aBuf.push('-moz-border-radius:4px;');
                aBuf.push('-moz-border-radius:4px;');
                aBuf.push('-webkit-border-radius:4px;');
                aBuf.push('-webkit-border-radius:4px;');
                aBuf.push('-khtml-border-radius:4px;');
                aBuf.push('-khtml-border-radius:4px;');
                aBuf.push('border-radius:4px;');
                aBuf.push('border-radius:4px;');
                aBuf.push('-moz-box-shadow:rgba(200,200,200,1) 0 4px 18px;');
                aBuf.push('-webkit-box-shadow:rgba(200,200,200,1) 0 4px 18px;');
                aBuf.push('-khtml-box-shadow:rgba(200,200,200,1) 0 4px 18px;');
                aBuf.push('box-shadow:rgba(200,200,200,1) 0 4px 18px;');
                aBuf.push('}</style>');
                aBuf.push('<div id="gc-frameTopPrompt">');
                aBuf.push('<div id="async_TopPrompt_textarea" style="float:left; text-align:center;word-wrap:break-word;word-break:break-all;max-height:300px;overflow:hidden;" ></div>');
                aBuf.push('<span style="float:right;cursor:pointer;margin-left: 20px;">X</span>');
                aBuf.push('</div>');
                $('body').append(aBuf.join('')); //注入代码
                var $my = $('#gc-frameTopPrompt'); //取出gc-frameTopPrompt对象引用
                $my.find('span').bind('click', function() {
                    $my.fadeOut(10);
                    //$.hideTopPrompt();
                })
                delete aBuf;
                frameTopPrompt_init = true; //初始化完成
            }
        },
        /**
         * 弹出状态条
         * @public
         * @param sMsg 状态条显示内容
         * @return void
         */
        showTopPrompt: function(initConfig) {
            clearTimeout($.hideTopPrompt.time);
            var bodyTop = 0;
            if (!frameTopPrompt_init) {
                $.initTopPrompt();
            }
            // 如果没有初始化则显示先初始化
            var $my = $('#gc-frameTopPrompt');
            if (typeof window.pageYOffset != 'undefined')
                bodyTop = window.pageYOffset;
            else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat')
                bodyTop = document.documentElement.scrollTop;
            else if (typeof document.body != 'undefined')
                bodyTop = document.body.scrollTop;

            var msg = initConfig.msg;
            var isSucc = initConfig.isSucc;
            if (typeof(initConfig) == 'string')
                msg = initConfig;
            $my.find('#async_TopPrompt_textarea').html(msg); // 设置显示信息
            $my.css("top", "20px");
            if(isSucc){
                $my.css("background", "#99CCFF");
            }else{
                $my.css("background", "#F2DEDE");
            }
            // if (typeof($.ui) != 'undefined' && typeof($.ui.version) != 'undefined'){
            if(false) {
                $my.show("fade", 1100);
            } else {
                $my.show(false);
                var out = 10000; // 默认值
                if (typeof(initConfig) == 'string')
                    setTimeout(function() {
                        $.hideTopPrompt();
                    }, out);
                else if (initConfig.out) {
                    out = initConfig.out;
                    $.hideTopPrompt.time = setTimeout(function() {
                        $.hideTopPrompt();
                    }, out);
                }
            }
        },
        /**
         * 隐藏窗口
         * @public
         * @param sMsg 状态条显示内容[可以不填]
         * @return void
         */
        hideTopPrompt: function(sMsg) {
            if (frameTopPrompt_init) {
                var $my = $('#gc-frameTopPrompt');
                if (typeof(sMsg) == 'string')
                    $my.find('#async_TopPrompt_textarea').html(sMsg);
                $my.fadeOut(1500);
            }
        },
        /**
         * 返回顶部状态条对象的jQuery引用
         * @public
         * @return jQuery
         */
        get$ObjTopPrompt: function() {
            if (frameTopPrompt_init)
                return $('#gc-frameTopPrompt');
            else
                return null;
        },
    });
})(jQuery);
