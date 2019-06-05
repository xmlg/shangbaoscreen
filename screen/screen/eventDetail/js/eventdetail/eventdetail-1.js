App.prototype.renderSection1 = function() {
    var self = this;
    var sectionData = self.sectionData_1;
   if($.isEmptyObject(sectionData) == false) {
   	    var section = d3.select('.section-1');
	var title =  section.select('.title1');//标题
    var time = section.select('.time');//时间
    var location = section.select('.location');//地点
    var organization = section.select('.organization');//机构
    var personage = section.select('.personage');//人物
	title.text(sectionData.title);
    time.text(sectionData.entity_time);
    location.text(sectionData.entity_place);
    organization.text(sectionData.entity_org);
    personage.text(sectionData.entity_name);
   }else{
   	
   }

}