App.prototype.renderSection5 = function() {
    var self = this;

    var viewpoint1 = d3.select('.section-5 .viewpoint1');
    var viewpoint2 = d3.select('.section-5 .viewpoint2');
    var h1 = d3.select('.section-5 h1');
    var sn1 = d3.select('.standpoint-name-1');
    var sn2 = d3.select('.standpoint-name-2');

    var sectionData = self.sectionData_5;
    var allData = sectionData.officialvsfolkData;
     if($.isEmptyObject(allData) == false){
    switch(self.carouselIndexSection5) {
        case 1:
            h1.text('官方媒体VS民间媒体观点对比');
            sn1.text('民间媒体');
            sn2.text('官方媒体');
           
            //console.log(allData);
            var data1 = allData.folkString.filter(function(d, i) {
                return i < 4
            });
            var data2 = allData.official_data.filter(function(d, i) {
                return i < 4
            });
            break;
        default:
            h1.text('集团媒体VS商业媒体观点对比');
            sn2.text('集团媒体');
            sn1.text('商业媒体');
            var allData = sectionData.internalvsoutsideData;
         //   console.log(allData);
        
         	var data1 = allData.INTERNAL_DATA.filter(function(d, i) {
                return i < 4
            });
            var data2 = allData.OUTSIDE_DATA.filter(function(d, i) {
                return i < 4
            });
            
               var all = [].concat(data1, data2);
    var widthScale = d3.scale.linear()
        .domain(d3.extent(all, function(d, i) {
            return d.cluster_nums;
        }))
        .range([15, 185])
        .clamp(true);

    var update = viewpoint1.selectAll('div.item').data(data1);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('div').classed('item', true).each(function(d, i) {
        var item = d3.select(this);
        item.append('div').classed('text', true);

        var bar = item.append('div').classed('bar', true);
        bar.append('div').classed('bar-inner', true);
        bar.append('div').classed('value', true);
    });
    update.each(function(d, i) {
        var item = d3.select(this);

        var text = item.select('.text');
        var bar = item.select('.bar-inner');
        var value = item.select('.value');

        text.text(d.shorttitle);
        bar.style('width', widthScale(d.cluster_nums) + 'px')
        value.text(d.cluster_nums);
    });

    var update = viewpoint2.selectAll('div.item').data(data2);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter.append('div').classed('item', true).each(function(d, i) {
        var item = d3.select(this);
        item.append('div').classed('text', true);

        var bar = item.append('div').classed('bar', true);
        bar.append('div').classed('bar-inner', true);
        bar.append('div').classed('value', true);
    });
    update.each(function(d, i) {
        var item = d3.select(this);

        var text = item.select('.text');
        var bar = item.select('.bar-inner');
        var value = item.select('.value');

        text.text(d.shorttitle);
        bar.style('width', widthScale(d.cluster_nums) + 'px')
        value.text(d.cluster_nums);
    });
            
         }
            
   

 
     }
}