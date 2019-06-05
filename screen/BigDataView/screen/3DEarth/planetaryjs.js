/*! Planetary.js v1.1.2
 *  Copyright (c) 2013 Michelle Tilley
 *
 *  Released under the MIT license
 *  Date: 2015-11-22T10:07:37.594Z
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'topojson'], function(d3, topojson) {
      return (root.planetaryjs = factory(d3, topojson, root));
    });
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'), require('topojson'));
  } else {
    root.planetaryjs = factory(root.d3, root.topojson, root);
  }
}(this, function(d3, topojson, window) {
  'use strict';

  var originalPlanetaryjs = null;
  if (window) originalPlanetaryjs = window.planetaryjs;
  var plugins = [];



  var doDrawLoop = function(planet, canvas, hooks) {
    // d3.timer(function() {
    //   if (planet.stopped) {
    //     return true;
    //   }
    //   planet.context.clearRect(0, 0, canvas.width, canvas.height);
    //   for (var i = 0; i < hooks.onDraw.length; i++) {
    //     hooks.onDraw[i]();
    //   }
    // });
    // return;
    var width = canvas.width,
        height = canvas.height;

    var projection =planet.projection
        //.translate([width / 2, height / 2])
        //.scale(width / 3)
        .clipAngle(90)
        .precision(0.6);


    var c = canvas.getContext("2d");

    var path = d3.geo.path()
        .projection(projection)
        .context(c);
    var world = planet.plugins.topojson.world,
        names = planet.plugins.topojson.countries;
    var globe = {type: "Sphere"},
        land = topojson.feature(world, world.objects.land),
        countries = topojson.feature(world, world.objects.countries).features,
        borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }),
        i = -1,
        n = countries.length;
        countries = countries.filter(function(d) {
          return names.some(function(n) {
            if (d.id == n.id) return d.name = n.name;
          });
        }).sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });

        (function transition() {

          d3.transition()
              .duration(2250)
              .each("start", function() {

                     
                        i = (i + 1) % n;
						i==countries.length&&(function(){
							i = 0;
						})();
                    
              })
              .tween("rotate", function() {
                var p = d3.geo.centroid(countries[i]),//����һ�������������������ġ�
                    r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]);//����һ����ֵ��������������������ֵ����ֵ���������ͻ������������������ͣ����֡��ַ�������ɫ�ȣ����Զ�ѡ����
                return function(t) {
                  projection.rotate(r(t));
                  planet.context.clearRect(0, 0, canvas.width, canvas.height);
                  //draw the news panel



                  for (var k = 0; k < hooks.onDraw.length; k++) {
                    hooks.onDraw[k](planet.path,i);
                  }

                  //圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘�?
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    return this;
}
                  var _canvas = planet.context;
                  _canvas.beginPath();
                  _canvas.strokeStyle="#ccc";
                  _canvas.fillStyle = "rgba(2, 0, 0, 0.82)";
                  _canvas.borderR
                  var center = planet.projection.center();
                  //_canvas.fillRect(canvas.width/5, canvas.height/5,150,100);
                  _canvas.roundRect(canvas.width/5, canvas.height/5,150,100,30);
                  _canvas.fill();
                  _canvas.save();
                  var gradient=_canvas.createLinearGradient(0,0,170,0);
                  gradient.addColorStop("0","magenta");
                  gradient.addColorStop("0.5","blue");
                  gradient.addColorStop("1.0","red");

                  // 用渐变进行填�?
                  _canvas.strokeStyle=gradient;
                  _canvas.lineWidth=5;
                  _canvas.stroke();
                  _canvas.closePath();
                  _canvas.restore();
                  _canvas.beginPath();
                  _canvas.strokeStyle="#ccc";
                  _canvas.fillStyle = "white";
			
				 countries[i]&&countries[i].name&&_canvas.fillText(countries[i].name+":", canvas.width/5+10, canvas.height/5*1.2);
                  _canvas.closePath();


                  // _canvas.beginPath();
                  // _canvas.strokeStyle="#ccc";
                  // _canvas.fillStyle = "white";
                  // _canvas.fillText(countries[i].name+" "+countries[i].name+" "+countries[i].name, canvas.width/5+25, canvas.height/5*1.2+20);
                  // _canvas.closePath();
                  countries[i]&&countries[i].name&&draw_long_text("          "+countries[i].name+" "+countries[i].name+" "+countries[i].name,
                  _canvas,canvas.width/5+5, canvas.height/5*1.2+20);

                };
              })
            .transition()
              .each("end", transition);
        })();

  };

  function draw_long_text(longtext,cxt,begin_width,begin_height)
{
  var linelenght = 25;
  var text = "";
  var count = 0;
  var begin_width = begin_width;
  var begin_height = begin_height;
  var stringLenght = longtext.length;
  var newtext = longtext.split("");
  var context = cxt;

  for(i = 0; i <= stringLenght ; i++)
  {

    if(count == linelenght)
    {
    context.fillText(text,begin_width,begin_height);
    begin_height = begin_height + 25;
    text = "";
    count = 0;
    }
    if(i == stringLenght)
    {
    context.fillText(text,begin_width,begin_height);
    }
    var text = text + newtext[0];
    count ++;
    newtext.shift();
  }
}

  var initPlugins = function(planet, localPlugins) {
    // Add the global plugins to the beginning of the local ones
    for (var i = plugins.length - 1; i >= 0; i--) {
      localPlugins.unshift(plugins[i]);
    }

    // Load the default plugins if none have been loaded so far
    if (localPlugins.length === 0) {
      if (planetaryjs.plugins.earth)
        planet.loadPlugin(planetaryjs.plugins.earth());
      if (planetaryjs.plugins.pings)
        planet.loadPlugin(planetaryjs.plugins.pings());
    }

    for (i = 0; i < localPlugins.length; i++) {
      localPlugins[i](planet);
    }
  };

  var runOnInitHooks = function(planet, canvas, hooks) {
    // onInit hooks can be asynchronous if they take a parameter;
    // iterate through them one at a time
    if (hooks.onInit.length) {
      var completed = 0;
      var doNext = function(callback) {
        var next = hooks.onInit[completed];
        if (next.length) {
          next(function() {
            completed++;
            callback();
          });
        } else {
          next();
          completed++;
          setTimeout(callback, 0);
        }
      };
      var check = function() {
        if (completed >= hooks.onInit.length) doDrawLoop(planet, canvas, hooks);
        else doNext(check);
      };
      doNext(check);
    } else {
      doDrawLoop(planet, canvas, hooks);
    }
  };

  var startDraw = function(planet, canvas, localPlugins, hooks) {
    planet.canvas = canvas;
    planet.context = canvas.getContext('2d');

    if (planet.stopped !== true) {
      initPlugins(planet, localPlugins);
    }

    planet.stopped = false;
    runOnInitHooks(planet, canvas, hooks);
  };

  var planetaryjs = {
    plugins: {},

    noConflict: function() {
      window.planetaryjs = originalPlanetaryjs;
      return planetaryjs;
    },

    loadPlugin: function(plugin) {
      plugins.push(plugin);
    },

    planet: function() {
      var localPlugins = [];
      var hooks = {
        onInit: [],
        onDraw: [],
        onStop: []
      };

      var planet = {
        plugins: {},

        draw: function(canvas) {
          startDraw(planet, canvas, localPlugins, hooks);
        },

        onInit: function(fn) {
          hooks.onInit.push(fn);
        },

        onDraw: function(fn) {
          hooks.onDraw.push(fn);
        },

        onStop: function(fn) {
          hooks.onStop.push(fn);
        },

        loadPlugin: function(plugin) {
          localPlugins.push(plugin);
        },

        stop: function() {
          planet.stopped = true;
          for (var i = 0; i < hooks.onStop.length; i++) {
            hooks.onStop[i](planet);
          }
        },

        withSavedContext: function(fn) {
          if (!this.context) {
            throw new Error("No canvas to fetch context for");
          }

          this.context.save();
          fn(this.context);
          this.context.restore();
        }
      };

      planet.projection = d3.geo.orthographic()
        .clipAngle(90);
      planet.path = d3.geo.path().projection(planet.projection);

      return planet;
    }
  };

  planetaryjs.plugins.topojson = function(config) {
    return function(planet) {
      planet.plugins.topojson = {};

      planet.onInit(function(done) {
        if (config.world) {
          planet.plugins.topojson.world = config.world;
          setTimeout(done, 0);
        } else {
          queue()
              .defer(d3.json, config.file||"world-110m-withlakes.json")
              //.defer(d3.tsv, "world-country-names.tsv")
              .await(function(error, world){
                 if (error) throw error;
                  planet.plugins.topojson.world = world;
                  //planet.plugins.topojson.countries = names;
                  done();
              });

        }
      });
    };
  };

  planetaryjs.plugins.oceans = function(config) {
    return function(planet) {
      planet.onDraw(function(path) {
        planet.withSavedContext(function(context) {
          context.beginPath();
          path?path({type: 'Sphere'}):planet.path.context(context)({type: 'Sphere'});
          // planet.path.context(context)({type: 'Sphere'});
          context.fillStyle = config.fill || 'black';
          context.fill();

        });
      });
    };
  };

    planetaryjs.plugins.countries = function(config) {
      return function(planet) {
        var countries = null,i,n;
        var china = null;
        planet.onInit(function() {
          var world = planet.plugins.topojson.world;
          countries =topojson.feature(world, world.objects.countries).features,
          i = -1,
          n = countries.length;


          queue()
                .defer(d3.tsv, config.file||"world-country-names.tsv")
                //.defer(d3.tsv, "world-country-names.tsv")
                .await(function(error, names){
                   if (error) throw error;
                    planet.plugins.topojson.countries = names;
                    countries = countries.filter(function(d) {
                      return names.some(function(n) {
                        if (d.id == n.id) return d.name = n.name;
                      });
                    }).sort(function(a, b) {
                      return a.name.localeCompare(b.name);
                    });
                      planet.plugins.topojson.countries = countries;
                      countries.forEach(function(item,index){
                        if(item.name=="China"){china = item;}

                      });
                });

        });

        planet.onDraw(function(path,i) {
          planet.withSavedContext(function(context) {
            context.beginPath();
            path?path(countries[i]):planet.path.context(context)(countries[i]);
            context.fillStyle = config.colorRange.begin || 'black';
            context.fill();
            context.closePath();
            context.beginPath();
            path?path(china):planet.path.context(context)(china);
            context.fillStyle = 'yellow' || 'black';
            context.fill();
          //}
          });
        });
      };

    };

  planetaryjs.plugins.land = function(config) {
    return function(planet) {
      var land = null;

      planet.onInit(function() {
        var world = planet.plugins.topojson.world;
        land = topojson.feature(world, world.objects.land);
      });

      planet.onDraw(function(path) {
        planet.withSavedContext(function(context) {
          context.beginPath();
          // planet.path.context(context)(land);
          path?path(land):planet.path.context(context)(land);
          //
          if (config.fill !== false) {
            context.fillStyle = config.fill || 'white';
            context.fill();
          }

          if (config.stroke) {
            if (config.lineWidth) context.lineWidth = config.lineWidth;
            context.strokeStyle = config.stroke;
            context.stroke();
          }

        });
      });
    };
  };

  planetaryjs.plugins.borders = function(config) {
    return function(planet) {
      var borders = null;
      var borderFns = {
        internal: function(a, b) {
          return a.id !== b.id;
        },
        external: function(a, b) {
          return a.id === b.id;
        },
        both: function(a, b) {
          return true;
        }
      };

      planet.onInit(function() {
        var world = planet.plugins.topojson.world;
        var countries = world.objects.countries;
        var type = config.type || 'internal';
        borders = topojson.mesh(world, countries, borderFns[type]);
      });

      planet.onDraw(function(path) {
        planet.withSavedContext(function(context) {
          context.beginPath();
          // planet.path.context(context)(borders);
          path?path(borders):planet.path.context(context)(borders);
          context.strokeStyle = config.stroke || 'gray';
          if (config.lineWidth) context.lineWidth = config.lineWidth;
          context.stroke();
        });
      });
    };
  };

  planetaryjs.plugins.earth = function(config) {
    config = config || {};
    var topojsonOptions = config.topojson || {};
    var oceanOptions = config.oceans || {};
    var landOptions = config.land || {};
    var bordersOptions = config.borders || {};

    return function(planet) {
      planetaryjs.plugins.topojson(topojsonOptions)(planet);
      planetaryjs.plugins.oceans(oceanOptions)(planet);
      planetaryjs.plugins.land(landOptions)(planet);
      planetaryjs.plugins.borders(bordersOptions)(planet);
    };
  };

  planetaryjs.plugins.pings = function(config) {
    var pings = [];
    config = config || {};

    var addPing = function(lng, lat, options) {
      options = options || {};
      options.color = options.color || config.color || 'white';
      options.angle = options.angle || config.angle || 5;
      options.ttl   = options.ttl   || config.ttl   || 2000;
      var ping = { time: new Date(), options: options };
      if (config.latitudeFirst) {
        ping.lat = lng;
        ping.lng = lat;
      } else {
        ping.lng = lng;
        ping.lat = lat;
      }
      pings.push(ping);
    };

    var drawPings = function(planet, context, now) {
      var newPings = [];
      for (var i = 0; i < pings.length; i++) {
        var ping = pings[i];
        var alive = now - ping.time;
        if (alive < ping.options.ttl) {
          newPings.push(ping);
          drawPing(planet, context, now, alive, ping);
        }
      }
      pings = newPings;
    };

    var drawPing = function(planet, context, now, alive, ping) {
      var alpha = 1 - (alive / ping.options.ttl);
      var color = d3.rgb(ping.options.color);
      color = "rgba(" + color.r + "," + color.g + "," + color.b + "," + alpha + ")";
      context.strokeStyle = color;
      var circle = d3.geo.circle().origin([ping.lng, ping.lat])
        .angle(alive / ping.options.ttl * ping.options.angle)();
      context.beginPath();
      planet.path.context(context)(circle);
      //path(circle);
      context.stroke();
    };

    return function (planet) {
      planet.plugins.pings = {
        add: addPing
      };

      planet.onDraw(function(path) {
        var now = new Date();
        planet.withSavedContext(function(context) {
          drawPings(planet, context, now);
        });
      });
    };
  };

  planetaryjs.plugins.zoom = function (options) {
    options = options || {};
    var noop = function() {};
    var onZoomStart = options.onZoomStart || noop;
    var onZoomEnd   = options.onZoomEnd   || noop;
    var onZoom      = options.onZoom      || noop;
    var afterZoom   = options.afterZoom   || noop;
    var startScale  = options.initialScale;
    var scaleExtent = options.scaleExtent || [50, 2000];

    return function(planet) {
      planet.onInit(function() {
        var zoom = d3.behavior.zoom()
          .scaleExtent(scaleExtent);

        if (startScale !== null && startScale !== undefined) {
          zoom.scale(startScale);
        } else {
          zoom.scale(planet.projection.scale());
        }

        zoom
          .on('zoomstart', onZoomStart.bind(planet))
          .on('zoomend', onZoomEnd.bind(planet))
          .on('zoom', function() {
            onZoom.call(planet);
            planet.projection.scale(d3.event.scale);
            afterZoom.call(planet);
          });
        d3.select(planet.canvas).call(zoom);
      });
    };
  };

  planetaryjs.plugins.drag = function(options) {
    options = options || {};
    var noop = function() {};
    var onDragStart = options.onDragStart || noop;
    var onDragEnd   = options.onDragEnd   || noop;
    var onDrag      = options.onDrag      || noop;
    var afterDrag   = options.afterDrag   || noop;

    return function(planet) {
      planet.onInit(function() {
        var drag = d3.behavior.drag()
          .on('dragstart', onDragStart.bind(planet))
          .on('dragend', onDragEnd.bind(planet))
          .on('drag', function() {
            onDrag.call(planet);
            var dx = d3.event.dx;
            var dy = d3.event.dy;
            var rotation = planet.projection.rotate();
            var radius = planet.projection.scale();
            var scale = d3.scale.linear()
              .domain([-1 * radius, radius])
              .range([-90, 90]);
            var degX = scale(dx);
            var degY = scale(dy);
            rotation[0] += degX;
            rotation[1] -= degY;
            if (rotation[1] > 90)   rotation[1] = 90;
            if (rotation[1] < -90)  rotation[1] = -90;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            afterDrag.call(planet);
          });
        d3.select(planet.canvas).call(drag);
      });
    };
  };

  return planetaryjs;
}));
