/*
    description:新闻实时线索 近期政策 历史今天
    author:Bzm
 */
(function() {
    var myDate = new Date();
    var today = myDate.getFullYear()+"-"+myDate.getMonth()+1+"-"+myDate.getDate();
    var starter = [new ANI("zjPolicyList", "/wcm/bigdata.do?group=广东&modelid=searchNew&serviceid=recentpolicy&type=0"), 
    new ANI("countryPolicyList", "/wcm/bigdata.do?group=&modelid=searchNew&serviceid=recentpolicy&type=0"), 
    new ANI("historyTodayList", "/wcm/bigdata.do?day="+myDate.getDate()+"&groupname_type=0&modelid=get&month=01&serviceid=todayinhistory")];
    starter[0].appendList().then(function() {
        return starter[1].appendList();
    }).then(function() {
        return starter[2].appendList();
    }).then(function() {
        var index = 0;
        slider(index);
    });

    function slider(index) {
        starter[index].slideLeft().then(function() {
            index++;
            if (index > starter.length - 1) index = 0;
            slider(index);
        });
    }
})();
