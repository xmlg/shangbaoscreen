function isPointInPolygon(pts,point){
    
        if(!pts||pts.length<1||!point){
            return false;
        }

        var Point = function(lat,lng){
          this.lng=lng;
          this.lat=lat;
        }

        Point.prototype.equals=function(p){
          return this.lng==p.lng&&this.lat==p.lat;
        }

        pts = pts.map(function(item,index){
            var _item = projection([item[0],item[1]]);
            return new Point(round(_item[0],2),round(_item[1],2));
        });
        var _point = point;//projection([point[0],point[1]]);
        point = new Point(_point[0],_point[1]);

        //var pts = polygon.getPath();//获取多边形点
        
        //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
        //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
        //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。
        
        var N = pts.length;
        var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
        var intersectCount = 0;//cross points count of x 
        var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
        var p1, p2;//neighbour bound vertices
        var p = point; //测试点
        
        p1 = pts[0];//left vertex        
        for(var i = 1; i <= N; ++i){//check all rays            
            if(p.equals(p1)){
                return boundOrVertex;//p is an vertex
            }
            
            p2 = pts[i % N];//right vertex            
            if(p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)){//ray is outside of our interests                
                p1 = p2; 
                continue;//next ray left point
            }
            
            if(p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)){//ray is crossing over by the algorithm (common part of)
                if(p.lng <= Math.max(p1.lng, p2.lng)){//x is before of ray                    
                    if(p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)){//overlies on a horizontal ray
                        return boundOrVertex;
                    }
                    
                    if(p1.lng == p2.lng){//ray is vertical                        
                        if(p1.lng == p.lng){//overlies on a vertical ray
                            return boundOrVertex;
                        }else{//before ray
                            ++intersectCount;
                        } 
                    }else{//cross point on the left side                        
                        var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng                        
                        if(Math.abs(p.lng - xinters) < precision){//overlies on a ray
                            return boundOrVertex;
                        }
                        
                        if(p.lng < xinters){//before ray
                            ++intersectCount;
                        } 
                    }
                }
            }else{//special case when ray is crossing through the vertex                
                if(p.lat == p2.lat && p.lng <= p2.lng){//p crossing over p2                    
                    var p3 = pts[(i+1) % N]; //next vertex                    
                    if(p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)){//p.lat lies between p1.lat & p3.lat
                        ++intersectCount;
                    }else{
                        intersectCount += 2;
                    }
                }
            }            
            p1 = p2;//next ray left point
        }
        
        if(intersectCount % 2 == 0){//偶数在多边形外
            return false;
        } else { //奇数在多边形内
            return true;
        } 
}

    function isPointInChinaPro(point){
      if(!point)return false;
      var allPointsArray = MAPDATA.features;
      //一次按照省来判断
      for(var i in allPointsArray){
        var provenceObj = allPointsArray[i];
        var allPointsProvence = provenceObj.geometry.coordinates[0];
        // console.log(allPointsProvence);
         if(isPointInPolygon(allPointsProvence,point)){
            // console.log("在"+provenceObj.properties.name+"内部");
            return provenceObj;
         }else{
            // console.log("不在"+provenceObj.properties.name+"内部");
         }

        
      }

      return false;
    }

    function getNodeFromProcence(pName){
          var _dAray = [];
          for (var i = data.length - 1; i >= 0; i--) {
              var d = data[i];
                if(d.srcPlace==pName||d.destPlace==pName){
                  _dAray.push(d);
                }
          }
          return _dAray;

        }

        function round(v,e){
      var t=1;
      for(;e>0;t*=10,e--);
        for(;e<0;t/=10,e++);
          return Math.round(v*t)/t;
    }


    function isPointInHeBeiPro(point){
      if(!point)return false;
      var allPointsArray = HEBEIDATA.features;
      //一次按照省来判断
      for(var i in allPointsArray){
        var provenceObj = allPointsArray[i];
        var allPointsProvence = provenceObj.geometry.coordinates[0];
        // console.log(allPointsProvence);
         if(isPointInPolygon(allPointsProvence,point)){
            // console.log("在"+provenceObj.properties.name+"内部");
            return provenceObj;
         }else{
          //console.log("不在"+provenceObj.properties.name+"内部");
         }

        
      }

      return false;
    }