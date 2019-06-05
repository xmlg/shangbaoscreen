window.onload=function(){
		setInterval(function(){
		var hostItemObj = [];
		var hotObj = [];
		getAjax();
	},1200)
}
window.fieldName = '';
window.hostname = '';

function getAjax() {
	hostItemObj = [];
	hotObj = [];
	$.ajax({
		type: "get",
		url:'/screen/hotpointrefact/hotpointnews',
		//url: 'hot2.txt',
		async: true,
		success: function(data) {
			$('.main-content').html('');
			var data = JSON.parse(data);
			var state = data.state;
			if(state == '1' && fieldName !== data.fieldstr) {
					var keyArr = [];
					data.field.forEach(function(d,i){
						for(var key in d) {
							keyArr.push(key);
						}
					})
					var data = data.field;
					
					createMainDiv(keyArr, data);
					fieldName = data.fieldstr;
			} else {
				if(hostname != data.HOTID) {
					$('.main-content').html('');
					appendDiv();
					data = data.defaultEntity;
					var fieldId = data.FIELD;
					console.log(fieldId);
					var content = data.CONTENT;
					var titleid = data.TITLEID;
					var hotid = data.HOTID;
					var hotList = data.HOTLIST;
					var hotItem = data.DOCTITLELIST.splice(0, 6);
					var hotItemId = data.LISTID.splice(0, 6);
					var contentItem = data.SHORTTITLELIST;
					createMidObj(hotItem, hotItemId);
					createMiddleItem(hostItemObj, hotid);
					createHotObj(contentItem, hotList);
					createLftItem(hotObj, titleid);
					$('.right-content-child').text(content);
					$('.left-top').text(changeFIELD(fieldId));
					var ele = $('.right-content');
					var elechild  ='right-content-child';
					/*section_2move(ele,elechild);*/
				}
				hostname = data.HOTID
			}

		}
	});
}

function createMainDiv(key, data) {
	var mainDiv = d3.select('.main-content').selectAll('div').data(key).enter();
	mainDiv.append('div').each(function(d, i) {
		d3.select(this).classed('main-content-content', true);
		d3.select(this).append('div').classed('title-content', true).text(changeFIELD(d));
		var SHORTTITLE = d3.select(this).append('div').classed('SHORTTITLE', true);
		SHORTTITLE.selectAll('div').data(data[i][d]?data[i][d].splice(0,3):[]).enter()
			.append('div').classed('SHORTTITLE2', true).append('span').classed('SHORTTITLE3',true)
			.text(function(d, i) {
				return d.TITLE;
			})
	})

}

function changeFIELD(val) {
	var name = '';
	var fieldArr = [{
		name: '政治',
		field: 'zyzxfield_001'
	}, {
		name: '财经',
		field: 'zyzxfield_002'
	}, {
		name: '司法',
		field: 'zyzxfield_003'
	}, {
		name: '军事',
		field: 'zyzxfield_004'
	}, {
		name: '社会',
		field: 'zyzxfield_005'
	}, {
		name: '地产',
		field: 'zyzxfield_006'
	}, {
		name: '科技',
		field: 'zyzxfield_007'
	}, {
		name: '人文',
		field: 'zyzxfield_008'
	}, {
		name: '体育',
		field: 'zyzxfield_009'
	}, {
		name: '教育',
		field: 'zyzxfield_010'
	}, {
		name: '生活',
		field: 'zyzxfield_011'
	}, {
		name: '健康',
		field: 'zyzxfield_012'
	}, {
		name: '汽车',
		field: 'zyzxfield_013'
	}, {
		name: '美食',
		field: 'zyzxfield_014'
	}, {
		name: '旅游',
		field: 'zyzxfield_015'
	}, {
		name: '游戏',
		field: 'zyzxfield_016'
	}, {
		name: '动漫',
		field: 'zyzxfield_017'
	}, {
		name: '电商',
		field: 'zyzxfield_018'
	}, {
		name: '娱乐',
		field: 'zyzxfield_019'
	}];
	$.each(fieldArr, function(i) {
		if(val == fieldArr[i].field)
			name = fieldArr[i].name;
	});
	return name;
}
function createMidObj(hotItem, hotItemId) {
	$.each(hotItem, function(i) {
		var obj = {};
		obj.name = hotItem[i];
		obj.id = hotItemId[i];
		hostItemObj.push(obj);
	});
	return hostItemObj;
}

function createHotObj(contentItem, hotList) {
	$.each(contentItem, function(i) {
		var obj = {};
		obj.name = contentItem[i];
		obj.id = hotList[i];
		hotObj.push(obj);
	});
	return hotObj;
}

function createLftItem(hotObj, titleid) {
	var leftItem = d3.select('.conentItem').selectAll('div').data(hotObj).enter();
	leftItem.append('div').each(function(d, i) {

		d3.select(this).classed('left-content', true)
			.text(d.name)
		if(d.id == titleid) {
			d3.select(this).classed('leftmidLight', true);
		}
	})
}

function createMiddleItem(hotItem, hotid) {
	var middleItem = d3.select('.hostItem').selectAll('div').data(hotItem).enter();
	middleItem.append('div').each(function(d, i) {

		d3.select(this).classed('middle-item', true)
			.text(d.name)
		if(d.id == hotid) {
			d3.select(this).classed('midLight', true);
		}
	})
}

function appendDiv() {
	$('.main-content').append('<div class="left"><div class="left-top"></div><div class="conentItem"></div></div><div class="middle"><div class="middle-title">新闻列表</div><div class="hostItem"></div></div><div class="right"><div class="right-title">新闻详情</div><div class="right-content"><div class="right-content-child"></div></div>')
}
		
		function section_2move(ele,elechild){
			var elechild = $('.'+elechild);
			var containerHeight = elechild.height();
			console.log(containerHeight);
			var elechileItem = elechild.clone();
			ele.append(elechileItem)
			doSection_move(elechild,containerHeight)
		}
		function doSection_move(elechild,containerHeight){
			var speed = 150;
			elechild.animate({marginTop:-containerHeight},2800*containerHeight/speed,function(){
				elechild.css({marginTop:0});
				window.setTimeout(function(){
					doSection_move(elechild,containerHeight)
				},2000)
			})
		}
		