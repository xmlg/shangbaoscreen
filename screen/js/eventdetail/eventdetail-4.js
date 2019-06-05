App.prototype.renderSection4 = function() {
	var self = this;
	var sectionData = self.sectionData_4;
	
	if($.isEmptyObject(sectionData) == false) {
		var g = d3.select('.section-4 svg g');

		var formattingData = [];
		var dates = [];

		for(var date in sectionData) {
			var result = {};
			result.date = date;
			result.viewpoints = [];
			sectionData[date].forEach(function(d, i) {
				result.viewpoints.push({
					text: d.TITLE,
					value: Number(d.viewPointId || 0),
					imgurl: d.imageUrl
				})
			});
			formattingData.push(result);
			dates.push(date);
		}

		var nodes = [];
		var max = 0;

		var inumber = 0;
		var circleindex = 0;
		var dateData = [80];
		formattingData.forEach(function(d) {
			var step = 640 / 4;
			dateData.push(dateData[dateData.length - 1] + d.viewpoints.length * 160);
			d.viewpoints.forEach(function(dd) {

				nodes.push({
					x: inumber * step + 0 * step / 8,
					y: 0
				});
				nodes.push({
					x: inumber * step + 2 * step / 8,
					y: 0
				});
				nodes.push({
					x: inumber * step + 2.5 * step / 8,
					y: 0.4 * dd.value * (Math.random() * 0.5 + 0.5)
				});
				nodes.push({
					x: inumber * step + 3 * step / 8,
					y: 0.2 * dd.value * (Math.random() * 0.5 + 0.5)
				});
				nodes.push({
					x: inumber * step + 3.5 * step / 8,
					y: 0
				});
				nodes.push({
					text: dd.text,
					x: inumber * step + 5 * step / 8,
					y: dd.value,
					imgurl: dd.imgurl
				});
				nodes.push({
					x: inumber * step + 6.5 * step / 8,
					y: -0.1 * dd.value * (Math.random() * 0.5 + 0.5)
				});
				nodes.push({
					x: inumber * step + 7 * step / 8,
					y: 0.1 * dd.value * (Math.random() * 0.5 + 0.5)
				});
				if(dd.value > max) {
					max = dd.value;
				}
				inumber++;
			});
		});

		if(self.Section4number >= inumber) {

			self.Section4number = 0;
		}
		g.data([{}]).transition().duration(2000)
			.attr('transform', 'translate(' + ((-self.Section4number || 0) * 160 + 160) + ',290)');

		var yScale = d3.scale.linear()
			.domain([0, max])
			.range([0, 75]);

		var line = d3.svg.line()
			.x(function(d) {
				return d.x;
			})
			.y(function(d) {
				return -yScale(d.y);
			});
		//console.log(nodes);
		var update = g.selectAll('path').data([nodes]);
		var enter = update.enter();
		var exit = update.exit();

		exit.remove();
		enter.append("path")
			.style('filter', 'url(#filter3000)')
			.attr({
				'fill': 'none',
				'stroke-width': 4,
				'stroke': '#14D7DE',
				'd': function(d) {

					return line(d);
				}
			});
		update
			.transition()
			.duration(3000)
			.attr({
				'd': function(d) {
					//console.log(d);
					return line(d);
				}
			});

		var update = g.selectAll('circle').data(
			nodes.filter(function(d) {
				return d.text;
			})
		);
		var enter = update.enter();
		var exit = update.exit();

		exit.remove();
		enter.append('circle');

		update.attr({
				fill: '#14D7DE',
				r: '10',
				cx: function(d) {
					return d.x;
				},
				cy: function(d) {
					return -yScale(d.y) - 20;
				}
			})
			.each(function(d, i) {
				if(i == self.Section4number) {
					d3.select(this).attr({
						fill: '#14D7DE',
						r: '15',
					})
				} else {
					d3.select(this).attr({
						fill: '#14D7DE',
						r: '10',
					})
				}
			});

		var update = g.selectAll('text').data(dates);
		var enter = update.enter();
		var exit = update.exit();
		//Ìí¼ÓÈÕÆÚ
		exit.remove();
		enter.append('text')
			.attr('text-anchor', 'middle')
			.attr('fill', '#14D7DE');
		update
			.attr('x', function(d, i) {
				return dateData[i];
			})
			.attr('y', 25)
			.text(function(d) {

				return d;
			})
		g.selectAll('rect').remove();
		g.selectAll('image').remove();
		var update = g.selectAll('g.new').data(
			nodes.filter(function(d) {
				return d.text;
			})
		);
		var enter = update.enter();
		var exit = update.exit();
		exit.remove();
		enter.append('g')
			.each(function(d, i) {
				var g = d3.select(this);
				var x = d.x;
				var y = -yScale(d.y) - 45;
				g.attr({
					'transform': 'translate(' + x + ',' + y + ')'
				})
				 strs1 = [];
				var t = d.text;
				t = t.slice(0,30);
				var z = 0;
				var t_length = t.length+7
				for(z; z < t_length; z=z+7) {
					strs1.push(t.slice(z, z + 7));
				}
				
				if(i == self.Section4number) {
					//if(d.imgurl==undefined){
					//							var lines1 = [[-58,-41],[-73,-41],[-77,-37],[-77,-5],[-73,0],[-58,0]];
					//							var lines2 = [[58,-41],[73,-41],[77,-37],[77,-5],[73,0],[58,0]];
					//							var lines3 = [[-77,-27],[-77,-15]];
					//							var lines4 = [[77,-27],[77,-15]];
					//                      	var linePath1 = d3.svg.line();
					//                      	g.append('path').attr('d',linePath1(lines1)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',2);
					//                      	g.append('path').attr('d',linePath1(lines2)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',2);
					//                      	g.append('path').attr('d',linePath1(lines3)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',4);
					//                      	g.append('path').attr('d',linePath1(lines4)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',4);
					var lines5 = [
						[-73, 5],
						[-78, 0],
						[-78, -150],
						[-73, -155],
						[72, -155],
						[77, -150],
						[77, 0],
						[72, 5],
						[-73, 6]
					];
					var lines6 = [
						[-53, 5],
						[-73, 5],
						[-78, 0],
						[-78, -20]
					];
					var lines7 = [
						[-78, -130],
						[-78, -150],
						[-73, -155],
						[-53, -155]
					];
					var lines8 = [
						[52, -155],
						[72, -155],
						[77, -150],
						[77, -130]
					];
					var lines9 = [
						[77, -20],
						[77, 0],
						[72, 5],
						[52, 5]
					];

					var linePath2 = d3.svg.line();
					g.append('path').attr('d', linePath2(lines5)).attr('stroke', 'rgb(0,125,151)').attr('fill', 'none').attr('stroke-width', 2);
					g.append('path').attr('d', linePath2(lines6)).attr('stroke', 'rgb(0,125,151)').attr('fill', 'none').attr('stroke-width', 5);
					g.append('path').attr('d', linePath2(lines7)).attr('stroke', 'rgb(0,125,151)').attr('fill', 'none').attr('stroke-width', 5);
					g.append('path').attr('d', linePath2(lines8)).attr('stroke', 'rgb(0,125,151)').attr('fill', 'none').attr('stroke-width', 5);
					g.append('path').attr('d', linePath2(lines9)).attr('stroke', 'rgb(0,125,151)').attr('fill', 'none').attr('stroke-width', 5);

					//}

					var rect = g.append('rect');
					var text = d3.select(this).append('text')
						.attr({
							'text-anchor': 'middle',
							'fill': '#ffffff',
							x: 0,
							y: -120
						});
					text.selectAll("tspan")
						.data(strs1)
						.enter()
						.append("tspan")
						.attr("x", text.attr("x"))
						.attr("dy", "1.3em")
						.text(function(d) {
							return d;
						}).classed('text-tspan',true);
					var $text = $(text[0][0]);
					var w = $text.width();
					w = w < 112 ? 112 : 112;
					rect.attr({
						width: w + 25,
						height: 142,
						x: -(w + 25) / 2,
						y: -145,
						fill: '#215C69'
					});
					//   if(d.imgurl !=undefined){
					// 					  		var lines5 = [[-73,5],[-78,0],[-78,-150],[-73,-155],[72,-155],[77,-150],[77,0],[72,5],[-73,6]];
					// 					  		var lines6 = [[-53,5],[-73,5],[-78,0],[-78,-20]];
					// 					  		var lines7 = [[-78,-130],[-78,-150],[-73,-155],[-53,-155]];
					// 					  		var lines8 = [[52,-155],[72,-155],[77,-150],[77,-130]];
					// 					  		var lines9 = [[77,-20],[77,0],[72,5],[52,5]];
					// 					  		
					//                      	var linePath2 = d3.svg.line();
					//                      	g.append('path').attr('d',linePath2(lines5)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',2);
					//                      	g.append('path').attr('d',linePath2(lines6)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',5);
					//                      	g.append('path').attr('d',linePath2(lines7)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',5);
					//                      	g.append('path').attr('d',linePath2(lines8)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',5);
					//                      	g.append('path').attr('d',linePath2(lines9)).attr('stroke','rgb(0,125,151)').attr('fill','none').attr('stroke-width',5);
					//                      	
					//                          var img = g.append('image');
					//                          img.attr({
					//                              'xlink:href':d.imgurl,
					//                              width:200,
					//                              height:200,
					//                              x: -162.5,
					// 	                            y: -145,
					//				 preserveAspectRatio:'none'
					//                          })
					//  }
				}
			});
		update.each(function(d, i) {
			var g = d3.select(this);
			var x = d.x;
			var y = -yScale(d.y) - 45;
			g.attr({
				'transform': 'translate(' + x + ',' + y + ')'
			})
			if(i == self.Section4number) {
//				
//				var text = d3.selectAll('text')
//						.attr({
//							'text-anchor': 'middle',
//							'fill': '#ffffff',
//							x: 0,
//							y: -120
//						});
				var text = g.select('text');
					text.selectAll("tspan")
						.data(strs1)
						.enter()
						.append("tspan")
						.attr("x", text.attr("x"))
						.attr("dy", "1.3em")
						.text(function(d) {
							return d;
						})
						.classed('text-tspan',true);
				//g.select('text').text(d.text);
				//console.log(d.text);
				g.select('image').attr('xlink:href', d.imgurl).attr({
					width: 138,
					height: 110,
					x: -69.5,
					y: -147,
					preserveAspectRatio: 'none'
				})
			}

		});

	}
}