 var CardNumber = function(min,max,$el,delay){
            this.container = $('<div class="flip-clock-wrapper">');
            this.max = max;
            this.min=min;
            this.step=this.max-this.min;
            this.children=[];
            this.$el=$el;
            this.id=Math.floor(Math.random()*1000000);
            this.delay=delay;
            this.init();

         }

             CardNumber.prototype.addPlace=function(pre,fix,index){
                pre = 0;
                var $num = $('<ul class="flip" id="'+this.id+"_"+index+'"><li class="flip-clock-before"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">'+pre+'</div></div><div class="down"><div class="shadow"></div><div class="inn">'+pre+'</div></div></a></li><li class="flip-clock-active"><a href="#"><div class="up"><div class="shadow"></div><div class="inn">'+fix+'</div></div><div class="down"><div class="shadow"></div><div class="inn">'+fix+'</div></div></a></li></ul>');
                this.children.push($num);
                this.container.append($num);


             };

             CardNumber.prototype.update=function(index,uncheckable){
                var $num = $("#"+this.id+"_"+index);
                //去掉play
                
                //更新数字
                var old = $num.find("li:eq(1) .down").find(".inn").text();
                old =parseInt(old);
                var newV = parseInt(old)+1;
                if(newV>=10){
                    newV=0;
                    old=0;
                    this.update(index-1,true);
                }
                $num.find("li:eq(0)").find(".inn").empty().text(old);
                $num.find("li:eq(1)").find(".inn").empty().text(newV);

                //添加play
                $num.addClass("play");
                setTimeout(function(){
                    $num.removeClass("play");
                },100);

                if(!this.check()&&!uncheckable){
                    //console.log(this);
                    clearInterval(this.interval);
                }
                //this.children[index]=$num;
             };


                CardNumber.prototype.start=function(){
                   
                    var that =this;
                    var lc = this.maxs.length - this.mins.length;
                    this.maxs.forEach(function(item,index){
                        if(index>=lc){
                             that.addPlace(that.mins[index-lc],that.mins[index-lc],index);
                         }else{
                             that.addPlace(0,0,index);
                         }
                    });
                    setTimeout(function(){
                        that.count();
                    },this.delay);
                }
              CardNumber.prototype.init=function(){
                 this.mins=[];
                 this.maxs=[];
                 var mi = this.min,ma=this.max;
                 while(mi>0)  
                    {  
                        i = mi % 10;//计算每一位上的数字 
                        this.mins.push(parseInt(i));
                        mi = Math.floor(mi/10);//实现位与位之间的遍历  
                    }

                    while(ma>0)  
                    {  
                        i = ma % 10;//计算每一位上的数字 
                        this.maxs.push(parseInt(i));
                        ma = Math.floor(ma/10);//实现位与位之间的遍历  
                    }
                    this.mins.reverse();
                    this.maxs.reverse();

                    this.start();
                    this.$el.html(this.container)
              }

              CardNumber.prototype.count=function(){
                 //个位数
                 var l = this.mins[this.mins.length-1];
                 var that = this;
                 this.interval = setInterval(function(){
                    that.update(that.maxs.length-1);
                 },150);
                

              }

              CardNumber.prototype.check=function(){
                return (parseInt(this.$el.find(".flip-clock-active .up .inn").text()))<this.max;
              }

              CardNumber.prototype.getValue=function(){
                return parseInt(this.$el.find(".flip-clock-active .up .inn").text());
              }