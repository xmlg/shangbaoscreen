function App() {
    var self = this;
    $.get('/screen/eventcontrol/getid', function (data) {
        var idarray = JSON.parse(data);
       // console.log(idarray)
        var posiarray = [];
        $.each(idarray, function (i) {
            posiarray.push(idarray[i].screencheck)
        })
        var left = posiarray.indexOf('2')
       // console.log(left,posiarray)
        if( left == -1){
            alert('未设置中屏事件，请先在后台设置')
            return ;
        }
        else {
            self.id = idarray[left].evnetid
        }
        self.requestData();
        self.startTimingTask();
    })

}

App.prototype.startTimingTask = function() {
    var self = this;
    var interval = window.setInterval(function() {
        self.requestData();
    }, 10 * 60 * 1000);
}

App.prototype.startTimingTask2 = function() {
    if(this.hasStartTimingTask2){
        return;
    }
    this.hasStartTimingTask2 = true;

    var self = this;
    self.carouselIndexSection3 = 0;
    self.carouselIndexSection4 = 0;
    self.carouselIndexSection5 = 0;

    self.carouselIndexSection9 = 0;
    var interval1 = window.setInterval(function() {
        self.carouselIndexSection9++;
        self.carouselIndexSection5++;
        self.carouselIndexSection4++;
        if(self.carouselIndexSection9 >= 3) {
            self.carouselIndexSection9 = 0;
        }
        if(self.carouselIndexSection5 >= 2) {
            self.carouselIndexSection5 = 0;
        }
        self.renderSection9();
        self.renderSection5();
        //self.renderSection4();
    }, 12 * 1000);
    var indexinterval2 = window.setInterval(function () {

        self.carouselIndexSection6++;
        if(self.carouselIndexSection6 >=2){
            self.carouselIndexSection6 = 0;
        }
        window.clearInterval(self.tooltipnexy)
        self.renderSection6();
    },28*1000);
    var indexinterval3 = window.setInterval(function () {
        self.Section4number++;
        self.renderSection4();
    },4*1000)
    var indexinterval4 = window.setInterval(function(){
    	 self.carouselIndexSection3++;
    	 if ( self.carouselIndexSection3>1) {
    	 	 self.carouselIndexSection3 = 0;
    	 }
    	self.renderSection3()
    },10*1000)
};
App.prototype.requestData = function() {
    var self = this;
    var eventid = self.id;
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate());
    var dateid = Y+M+D;

    var briefIntroductionUrl = '/event/'+eventid+'/eventdetail/briefIntroduction';
//  var originalEventUrl = '/event/'+eventid+'/eventdetail/originalEvent';
    var originalEventUrl = '/event/'+eventid+'/eventdetail/viewcomment';
    
    
    var countinglineUrl = '/event/'+eventid+'/eventtrace/countingline';

    var viewpointlistUrl = '/event/'+eventid+'/eventtrace/viewpointlist/?search_time='+dateid;
    var internalvsoutsideUrl = '/event/'+eventid+'/eventrelatezb/internalvsoutside';
    var officialvsfolkUrl = '/event/'+eventid+'/eventrelatezb/officialvsfolk';

    //情感分析柱状图及瀑布图接口地址
    var feelinghistogramUrl = '/event/'+eventid+'/eventrelatezb/feelinghistogram';
    var feelingfallsUrl = '/event/'+eventid+'/eventrelatezb/feelingfalls';

    var zbstatisticsUrl = '/event/'+eventid+'/eventrelatezb/zbstatistics';
    var hotwordcompareUrl = '/event/'+eventid+'/eventrelatezb/hotwordcompare';
//if(self.id == 236||self.id==266||self.id ==226){
    //	 var relatedentityNameUrl = 'js/eventdetail/92.txt';
   // }else{
    	 var relatedentityNameUrl = '/event/'+eventid+'/eventdetail/relatedentity/?entityfield=ENTITY_NAME';
   // }
  //  var relatedentityNameUrl = '/event/'+eventid+'/eventdetail/relatedentity/?entityfield=ENTITY_NAME';
    var relatedentityPlaceUrl = '/event/'+eventid+'/eventdetail/relatedentity/?entityfield=ENTITY_PLACE';
    var relatedentityOrgUrl = '/event/'+eventid+'/eventdetail/relatedentity/?entityfield=ENTITY_ORG';

    $.when(
            $.ajax(briefIntroductionUrl),
            $.ajax(originalEventUrl),
            $.ajax(countinglineUrl),

            $.ajax(viewpointlistUrl),
            $.ajax(internalvsoutsideUrl),
            $.ajax(officialvsfolkUrl),

            $.ajax(feelinghistogramUrl),
            $.ajax(feelingfallsUrl),

            $.ajax(zbstatisticsUrl),
            $.ajax(hotwordcompareUrl),
            $.ajax(relatedentityNameUrl),
            $.ajax(relatedentityPlaceUrl),
            $.ajax(relatedentityOrgUrl)
        )
        .then(
            function(
                briefIntroductionData,
                originalEventData,
                countinglineData,

                viewpointlistData,
                internalvsoutsideData,
                officialvsfolkData,

                feelinghistogramData,
                feelingfallsData,


                zbstatisticsData,
                hotwordcompareData,
                relatedentityNameData,
                relatedentityPlaceData,
                relatedentityOrgData
            ) {	
               // if($.isEmptyObject(JSON.parse(briefIntroductionData[0])) == false){
                    self.sectionData_1 = JSON.parse(briefIntroductionData[0]);
               // }
              //  else {
                //    alert('暂无数据！')
                 //   return false;
              //  }
              //  if($.isEmptyObject(JSON.parse(originalEventData[0])) == false){
                    self.sectionData_2 = JSON.parse(originalEventData[0]);
              //  }
              //  else {
               //     alert('暂无数据！')
                  // return false;
               // }

                self.sectionData_3 = JSON.parse(countinglineData[0]);


                self.sectionData_4 = JSON.parse(viewpointlistData[0]);

                self.sectionData_5 = {
                    internalvsoutsideData: JSON.parse(internalvsoutsideData[0]),
                    officialvsfolkData: JSON.parse(officialvsfolkData[0])
                };
                self.sectionData_6 = {
                    feelinghistogramData:JSON.parse(feelinghistogramData[0]),
                    feelingfallsData:JSON.parse(feelingfallsData[0])
                };


                self.sectionData_7 = JSON.parse(zbstatisticsData[0]);
                self.sectionData_8 = JSON.parse(hotwordcompareData[0]);
                self.sectionData_9 = {
                    relatedentityNameData: JSON.parse(relatedentityNameData[0]),
                    relatedentityPlaceData: JSON.parse(relatedentityPlaceData[0]),
                    relatedentityOrgData: JSON.parse(relatedentityOrgData[0])
                };
                self.carouselIndexSection6 = 0;
                self.Section4number = 0;
                self.render();
                self.startTimingTask2();
            },
            function(error) {
                console.log(error);
            }
        );
}

App.prototype.render = function() {
    this.renderSection1();
    this.renderSection2();
    this.renderSection3();

    this.renderSection4();
    this.renderSection5();
    this.renderSection6();
    this.renderSection7();
    this.renderSection8();
    this.renderSection9();
};