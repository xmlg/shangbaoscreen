 function startsbg(canvas){
        //var canvas = document.getElementById(canvasId);
        var w = canvas.width ;//= window.innerWidth,
            h = canvas.height ;//= window.innerHeight,
            ctx = canvas.getContext('2d'),
            opts = {
                len: 20,
                count: 1000,
                baseTime: 10,
                addedTime: 10,
                dieChance: .05,
                spawnChance: 1,
                sparkChance: .1,
                sparkDist: 10,
                sparkSize: 2,
                color: 'hsl(hue,100%,light%)',
                baseLight: 50,
                addedLight: 10,
                shadowToTimePropMult: 6,
                baseLightInputMultiplier: .01,
                addedLightInputMultiplier: .02,
                cx: w / 2,
                cy: h / 2,
                repaintAlpha: .04,
                hueChange: .1
            },
            tick = 0,
            lines = [],
            dieX = w / 2 / opts.len,
            dieY = h / 2 / opts.len,
            baseRad = Math.PI * 2 / 6;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, w, h);

        function loop() {
            window.requestAnimationFrame(loop);
            ++tick;
            ctx.globalCompositeOperation = 'source-over';
            ctx.shadowBlur = 0;
            ctx.fillStyle = 'rgba(0,0,0,alp)'.replace('alp', opts.repaintAlpha);
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            if (lines.length < opts.count && Math.random() < opts.spawnChance) lines.push(new Line);
            lines.map(function(line) {
                line.step()
            })
        }

        function Line() {
            
            this.reset()
        }
        Line.prototype.reset = function() {
            
            this.x = 0;
            this.y = 0;
            this.addedX = 0;
            this.addedY = 0;
            this.rad = 0;
            this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();
            this.color = opts.color.replace('hue', tick * opts.hueChange);
            this.cumulativeTime = 0;
            this.beginPhase()
        }
        Line.prototype.beginPhase = function() {
            this.x += this.addedX;
            this.y += this.addedY;
            this.time = 0;
            this.targetTime = (opts.baseTime + opts.addedTime * Math.random()) | 0; 
            this.rad += baseRad * (Math.random() < .5 ? 1 : -1);
            this.addedX = Math.cos(this.rad);
            this.addedY = Math.sin(this.rad);
            if ( Math.random() < opts.dieChance 
                || this.x > dieX 
                || this.x < -dieX
                || this.y > dieY
                || this.y < -dieY ){
                this.reset()
            }
        }
        Line.prototype.step = function() {
            ++this.time;
            ++this.cumulativeTime;
            if (this.time >= this.targetTime) this.beginPhase();
            var prop = this.time / this.targetTime,
                wave = Math.sin(prop * Math.PI / 2),
                x = this.addedX * wave,
                y = this.addedY * wave;
            ctx.shadowBlur = prop * opts.shadowToTimePropMult; 
            ctx.fillStyle = ctx.shadowColor = this.color.replace('light', opts.baseLight + opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier));
            ctx.fillRect(
                opts.cx + (this.x + x) * opts.len,
                opts.cy + (this.y + y) * opts.len,
                2, 2);
            if (Math.random() < opts.sparkChance) {
                ctx.fillRect(
                    opts.cx + (this.x + x) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2,
                    opts.cy + (this.y + y) * opts.len + Math.random() * opts.sparkDist * (Math.random() < .5 ? 1 : -1) - opts.sparkSize / 2,
                    opts.sparkSize, opts.sparkSize)
            }
        }
        loop();
        window.addEventListener('resize',
            function() {
                w = canvas.width ;//= window.innerWidth;
                h = canvas.height ;//= window.innerHeight;
                ctx.fillStyle = 'black';
                ctx.fillRect(0, 0, w, h);
                opts.cx = w / 2;
                opts.cy = h / 2;
                dieX = w / 2 / opts.len;
                dieY = h / 2 / opts.len
            });

    }

    var html5_3d_animation=function(dom,p){
        var p=p||{};

        var w_w=p&&p.window_width?p.window_width:"500";
        var w_h=p&&p.window_height?p.window_height:"400";
        var w_b=p&&p.window_background?p.window_background:"#000";
        var s_c=p&&p.star_count?p.star_count:"600";
        var s_color=p&&p.star_color?p.star_color:"#FFF";
        var s_d=p&&p.star_depth?p.star_depth:"250";
        var fov = parseInt(s_d);
        var SCREEN_WIDTH = parseInt(w_w);
        var SCREEN_HEIGHT = parseInt(w_h);
        var HALF_WIDTH = SCREEN_WIDTH/2;
        var HALF_HEIGHT = SCREEN_HEIGHT/2;
        var c_id = dom.getAttribute("id");
        var numPoints = s_c;
        dom.setAttribute("width",w_w);
        dom.setAttribute("height", w_h);
        setup();
        function setup()
        {
            function draw3Din2D(point3d)
            {
                x3d = point3d[0];
                y3d = point3d[1];
                z3d = point3d[2];
                var scale = fov/(fov+z3d);
                var x2d = (x3d * scale) + HALF_WIDTH;
                var y2d = (y3d * scale)  + HALF_HEIGHT;

                c.lineWidth= scale;
                c.strokeStyle = s_color;
                c.beginPath();
                c.moveTo(x2d,y2d);
                c.lineTo(x2d+scale,y2d);
                c.stroke();
            }

            var canvas = document.getElementById(c_id);
            var c = canvas.getContext('2d');
            var points = [];

            function initPoints()
            {
                for (i=0; i<numPoints; i++)
                {
                    point = [(Math.random()*400)-200, (Math.random()*400)-200 , (Math.random()*400)-200 ];
                    points.push(point);
                }

            }

            function render()
            {
                c.fillStyle=w_b;
                c.fillRect(0,0, SCREEN_WIDTH, SCREEN_HEIGHT);

                for (i=0; i<numPoints; i++)
                {
                    point3d = points[i];

                    z3d = point3d[2];
                    z3d-=4;
                    if(z3d<-fov) z3d +=400;
                    point3d[2] = z3d;

                    draw3Din2D(point3d);

                }
                var show = document.getElementById('show');
                show.appendChild(document.createElement("p"));
            }

            initPoints();

            var loop = setInterval(function(){
                render();
            }, 50);

        }
       }


        html5_3d_animation(document.getElementById("html5_3d_animation"),{
            window_width: '600',
            window_height: '300',
            window_background: '#00113F',
            star_count: '1000',
            star_color: '#FBFFAF',
            star_depth: '100'
        });