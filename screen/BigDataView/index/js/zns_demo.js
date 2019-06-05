window.onload=function ()
{
	var oDiv=document.getElementById('div1');
	var aDiv=oDiv.getElementsByClassName('hid');
	//var aSpan=document.createElement('span');
	var x=-10;
	var y=0;
	var datamation=[
		 {title:"地域热点",link:"../screen/bureau_screen.html"},
		 {title:"新闻线索",link:"../screen/head-line.html"},
		 {title:"热点分布",link:"../screen/newScreen.html"},
		 // {title:"热点分布",link:""},
		 {title:"微信榜单",link:"../screen/weChatRank.html"},
		 {title:"微博热点",link:"../screen/microBlog.html"},
		 {title:"全网热点",link:"../screen/hotnews.html"},
		
	];
	var M=datamation.length;	
	var speedX=0;
	var speedY=0;
	for(var i=1;i<=M;i++)
	{
		
		var oNewDiv=document.createElement('div');
		oNewDiv.className='hid';	
		(function (oNewDiv,i){
			setTimeout(function (){
				oNewDiv.style.WebkitTransform='rotateY('+(360*(i-1)/M)+'deg) translateZ(400px)';
		        oNewDiv.style.MozTransform='rotateY('+(360*(i-1)/M)+'deg) translateZ(400px)';
		        oNewDiv.style.msTransform='rotateY('+(360*(i-1)/M)+'deg) translateZ(400px)';
		        oNewDiv.style.OTransform='rotateY('+(360*(i-1)/M)+'deg) translateZ(400px)';
				oNewDiv.style.transform='rotateY('+(360*(i-1)/M)+'deg) translateZ(400px)';
				setTimeout(function(){
					if(i==M)fixAll();
					setTimeout(function (){	
						oNewDiv.style.WebkitTransition='none';
						oNewDiv.style.MozTransition='none';
						oNewDiv.style.msTransition='none';
						oNewDiv.style.OTransition='none';
						oNewDiv.style.transition='none';	
					},1000);
				}, 3000);
			}, (M+3-i)*200);
		})(oNewDiv,i);	
		oNewDiv.degY=360*(i-1)/M;
			/*9月15日 */
			oNewDiv.innerHTML='<div class="img"><a class="title"></a><span class="over"><span class="shadow"></span></span></div>';
			oNewDiv=oNewDiv.getElementsByClassName('img')[0];
			oTitle=oNewDiv.getElementsByClassName('title')[0];
			oNewDiv.style.background='url(img/'+i+'.jpg)';
			oTitle.innerHTML=datamation[i-1].title;
			oTitle.href=datamation[i-1].link;
			oNewDiv.getElementsByClassName('shadow')[0].style.background='-webkit-linear-gradient(rgba(0,0,0,1) 40%, rgba(255,255,255,0)), url(img/'+i+'.jpg)';
			oNewDiv.getElementsByClassName('shadow')[0].style.background='-moz-linear-gradient(rgba(0,0,0,1) 40%, rgba(255,255,255,0)), url(img/'+i+'.jpg)';
			oNewDiv.getElementsByClassName('shadow')[0].style.background='-ms-linear-gradient(rgba(0,0,0,1) 40%, rgba(255,255,255,0)), url(img/'+i+'.jpg)';
			oNewDiv.getElementsByClassName('shadow')[0].style.background='-o-linear-gradient(rgba(0,0,0,1) 40%, rgba(255,255,255,0)), url(img/'+i+'.jpg)';
			oNewDiv.getElementsByClassName('shadow')[0].style.backgroundSize='100% 100%';
			oNewDiv.style.backgroundSize='100% 100%';
			oDiv.appendChild(oNewDiv.parentNode);
		(function (){
			var oS=document.createElement('script');
			
			oS.type='text/javascript';
			oS.src='';
			
			document.body.appendChild(oS);
		})();
		
	
	}

	
	document.onmousedown=function (ev)
	{
		var oEvent=ev||event;
		var mouseStartX=oEvent.clientX;
		var mouseStartY=oEvent.clientY;
		
		var startX=x;
		var startY=y;
		
		var lastX=mouseStartX;
		var lastY=mouseStartY;
		
		speedX=speedY=0;
		
		document.onmousemove=function(ev)
		{
			var oEvent=ev||event;
			
			y=startY+(oEvent.clientX-mouseStartX)/10;
			x=startX-(oEvent.clientY-mouseStartY)/10;
			
			speedX=(oEvent.clientX-lastX)/5;
			speedY=(oEvent.clientY-lastY)/5;
			
			fixAll();
			
			lastX=oEvent.clientX;
			lastY=oEvent.clientY;
		};
		
		document.onmouseup=function ()
		{
			document.onmousemove=null;
			document.onmouseup=null;
			
			startMove();
		};
		
		stopMove();
		
		return false;
	};	
	var timer=null;
	function startMove()
	{
		clearInterval(timer);
		timer=setInterval(function (){
			x-=speedY;
			y+=speedX;
			
			speedY*=0.93;
			speedX*=0.93;
			
			if(Math.abs(speedX)<0.1 && Math.abs(speedY)<0.1)
				stopMove();
			
			fixAll();
		}, 30);
	}	
	function stopMove()
	{
		clearInterval(timer);
	}
	
	function fixAll()
	{
		oDiv.style.WebkitTransform='perspective(1000px) rotateX('+x+'deg) rotateY('+y+'deg)';
		oDiv.style.MozTransform='perspective(1000px) rotateX('+x+'deg) rotateY('+y+'deg)';
		oDiv.style.msTransform='perspective(1000px) rotateX('+x+'deg) rotateY('+y+'deg)';
		oDiv.style.OTransform='perspective(1000px) rotateX('+x+'deg) rotateY('+y+'deg)';
		oDiv.style.transform='perspective(1000px) rotateX('+x+'deg) rotateY('+y+'deg)';
		
		for(var i=0;i<aDiv.length;i++)
		{
			var deg=aDiv[i].degY+y;
			var a=(deg%360+360)%360;
			
			a=Math.abs(180-a);
			
			var d=0.1+(a/180)*0.9;
			
			if(d<0.2)d=0.2;
			
			aDiv[i].style.opacity=d;
			
			//aDiv[i].innerHTML=parseInt(a);
		}
	}
};