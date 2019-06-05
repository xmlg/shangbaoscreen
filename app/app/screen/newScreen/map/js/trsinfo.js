 var INFO = function(title,content,time,url,x,y){
            this.title=title;
            this.content=content;
            this.time=time;
            this.url = url;
            this.x=x;
            this.y=y;
            this.html=$("<div class='trsinfo' onclick='INFO.prototype.openNews(\""+this.url+"\")'>"+this.content+"</br>"+this.title+"</div>");
            this.mark = $("<div class='triangle'></div>");
        }

         INFO.prototype.openNews=function(url){
             //if(url.indexOf('http://')<0){
             //    url = 'http://'+url;
             //}
             var aa=window.parent.open();
             setTimeout(function(){
                 aa.parent.location = url;
             }, 100);
             //console.log(url)
         }
        INFO.prototype.show=function(){
            this.init();
        }

        INFO.prototype.init=function(){
            
            this.start();
        }

        INFO.prototype.getContentLength=function(){
            return this.content.replace(/<font.*?>/g,'').replace(/<\/font>/g,'').length;
        }

        INFO.prototype.start=function(){
             var that = this;
             $("body").append(that.html).append(that.mark);
             setTimeout(function(){
                 that.html.css({
                    width:(that.getContentLength()*21+20),
                    left:that.x-(that.getContentLength()*21+20)/2,
                    top:that.y-40-25-10
                 });

                 that.mark.css({
                    left:that.x-8,
                    top:that.y-15
                 });

              },50);
             setTimeout(function(){
                 //that.html.find(".trsinfo").addClass('on');
                 that.remove();
             },500);
        }
        INFO.prototype.remove=function(){
            var that = this;
            setTimeout(function(){
                that.hide();
            },this.time);
        }
        INFO.prototype.hide=function(){
            this.html.remove();
            this.mark.remove();
        }


