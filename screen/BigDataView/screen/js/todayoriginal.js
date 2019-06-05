var count=1;
function App() {
    var self = this;
    this.listBody = d3.select('.list-body');

    this.data = []

    this.requestData();
  //  this.startTimingTask();
}

App.prototype.startTimingTask = function() {
    var self = this;
	self.requestData();
	
    //var interval = window.setInterval(function() {
     //   self.requestData();
    //}, 1 * 1000);
}

App.prototype.requestData = function() {
    var self = this;
//	var url = 'js/jinriyuanchuang.json'

    var url = '/cas/casData/screenJson?type=ThreedaysArticle';
 
    d3.json(url, function(error, data) {
        if(error || $.isEmptyObject(data) == true) {
            return;
        }
        //console.log(data);

        var dataArea1 = null;
        var dateArea3 = null;
        var dataArea7 = null;

        self.data = formatData(data.Records);
        self.render();
		count--;
        if(count>=0){
            $(".td2").click(function(){
            //    console.log(this.innerText);

            });
        }
    });

    function formatData(data) {
        var result = data.map(function(d, i) {
            var dd = {};
            dd.name = d.title;
            dd.time = d3.time.format('%H:%M:%S')(new Date(d.pubTime));
            dd.value = d.ceiIndex;//Number(d.ceiIndex * 100).toFixed(2);
			dd.sort=d.sort;
			dd.id=d.zbGuid;
            return dd;
        });
        return result;
    }

}

App.prototype.render = function() {
    var self = this;
    this.renderList();
}

App.prototype.renderList = function() {
    var self = this;
    var sortData = this.data.sort(function(a, b) {
        return b.value - a.value;
    });

    var update = this.listBody.selectAll('div.list-item').data(sortData);
    var enter = update.enter();
    var exit = update.exit();

    exit.remove();
    enter
        .append('div').classed('list-item', true)
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.append('div').classed('td1', true);
            var td2 = listItem.append('div').classed('td2', true);
            var td3 = listItem.append('div').classed('td3', true);
            var td4 = listItem.append('div').classed('td4', true);
            var td5 = listItem.append('div').classed('td5', true);

            td1.text(i + 1);
            td2.text(d.name);
            td3.text(d.time);
            td4.text(d.value);
            //td5.text(d.value);
            td5.style('background-image',function(d,i){
                 td5.style('background-image',function(d,i){
                if(d.sort == '-1'){
                    return 'url(images/down.png)'
                }else{
                    return 'url(images/up.png)'
                }
            });
            });
            td5.style('background-repeat','no-repeat');
            td5.style('background-size','contain');
            td5.style('background-position-x','55px');

            //td5.style('background-size',function(d,i){
            //    if(d.name == '习近平在火箭军机关视察'){
            //        return 'contain'
            //    }else{
            //        return 'url(images/down.png)no-repeat center center;'
            //    }
            //});

        });
    update
        .style('color', function(d, i) {
            if(i === self.selectedRecordIndex) {
                return '#F8EF02';
            }
            return null;
        })
        .each(function(d, i) {
            var listItem = d3.select(this);
            var td1 = listItem.select('div.td1');
            var td2 = listItem.select('div.td2');
            var td3 = listItem.select('div.td3');
            var td4 = listItem.select('div.td4');
            var td5 = listItem.select('div.td5');

            td1.text(i + 1);
            td2.text(d.name);
			td2.attr("id",d.id);
            td3.text(d.time);
            td4.text(d.value);
            //td5.text(d.value);
            td5.style('background-image',function(d,i){
                if(d.sort == '-1'){
                    return 'url(images/down.png)'
                }else{
                    return 'url(images/up.png)'
                }
            });
            td5.style('background-repeat','no-repeat');
            td5.style('background-size','contain');
            td5.style('background-position-x','55px');
        })
}

var app = new App();