zbdp.drawHeadline = function() {
	var paperHeadlineUrl = serverDomain + "/screen/papermedia/get";
	var networkHeadlineUrl = serverDomain + '/screen/networkmediahistogram/get';
	zbdp.drawNetworkHeadline(networkHeadlineUrl);
	zbdp.drawPageHeadline(paperHeadlineUrl);
}

zbdp.drawPageHeadline = function(url) {
	$.get(url, function(datastr, state) {
		if(state == 'success') {
			// zbdp.tip.info('获取数据<纸媒头版>成功');
			console.log('获取数据<纸媒头版>成功');

			var data = JSON.parse(datastr);
			data.sort(function(value1, value2) {
				var num1 = parseInt(value1.TOTALNUMBER);
				var num2 = parseInt(value2.TOTALNUMBER);
				return num2 - num1;
			});
			if(data.length > 0) {
				var maxValue = parseInt(data[0].TOTALNUMBER || 1);
				var element = $('.headline-paper .content-items-wrapper');
			//	element.empty();
				//appendHeadline(element, data, maxValue, true);
				var flag = true;
				appendHeadline(element, data, maxValue, true,flag);
				var setineter = window.setInterval(function() {
					element.fadeIn('3000').empty();
					if(flag) {
						var data1 = data.slice(0,5);
						
						appendHeadline(element, data1, maxValue, true,flag);
					} else {
						var data2 = data.slice(5,10);
//						element.empty();
						appendHeadline(element, data2, maxValue, true,flag);
					}
					flag = !flag;
				},15*1000)
			}

		} else {
			// zbdp.tip.info('获取数据<纸媒头版>失败');
			console.log('获取数据<纸媒头版>失败');
		}
	});
}

zbdp.drawNetworkHeadline = function(url) {
	$.get(url, function(datastr, state) {
		if(state == 'success') {
			// zbdp.tip.info('获取数据<网媒头条>成功');
			console.log('获取数据<网媒头条>成功');

			var data = JSON.parse(datastr);
			data.sort(function(value1, value2) {
				var num1 = parseInt(value1.VITALITY);
				var num2 = parseInt(value2.VITALITY);
				return num2 - num1;
			});
			if(data.length > 0) {
				var maxValue = parseInt(data[0].VITALITY || 1);
				var element = $('.headline-network .content-items-wrapper');
				var flag = true;
				appendHeadline(element, data, maxValue, false,flag);
				var setineter = window.setInterval(function() {
					element.fadeIn('3000').empty();
					if(flag) {
						var data1 = data.slice(0,5);
						appendHeadline(element, data1, maxValue, false,flag);
					} else {
						var data2 = data.slice(5,10);
						appendHeadline(element, data2, maxValue, false,flag);
					}
					flag = !flag;
				}, 15*1000)

			}

		} else {
			// zbdp.tip.info('获取数据<网媒头条>失败');
			console.log('获取数据<网媒头条>失败');
		}
	});
}


//、、、、、、、、、、、、、、、、、、、、

function appendHeadline(container, data, maxValue, isPaper,flag) {
	for(var i = 0; i < data.length && i < 5; i++) {
		var item = data[i];
		var value;
		if(isPaper) {
			value = item.TOTALNUMBER; //转载数
		} else {
			value = item.VITALITY; //生命力
		}

		var itemDiv = document.createElement('div');
		itemDiv.classList.add('content-item');

		var itemBarWrapper = document.createElement('div');
		itemBarWrapper.classList.add('content-item-bar-wrapper');
		var itemBar = document.createElement('div');
		itemBar.classList.add('content-item-bar');
		itemBar.style.backgroundColor = zbdp.configColors[i][0];
		itemBar.style.width = (((parseInt(value) / maxValue).toFixed(2)) * 100) + '%';
		itemBarWrapper.appendChild(itemBar);
		itemDiv.appendChild(itemBarWrapper);

		var itemDesc = document.createElement('div');
		itemDesc.classList.add('content-item-desc');
		var itemDescSpan = document.createElement('span');
		if (flag) {
			itemDescSpan.innerText = (i + 1) + '.' + item.SHORTTITLE;
		}else{
			itemDescSpan.innerText = (i + 6) + '.' + item.SHORTTITLE;
		}
		
		// itemDescSpan.style.color = zbdp.configColors[i][0];
		itemDesc.appendChild(itemDescSpan);
		itemDiv.appendChild(itemDesc);

		var itemValue = document.createElement('div');
		itemValue.classList.add('content-item-value');
		itemValue.style.color = zbdp.configColors[i][1];
		itemValue.innerText = value;
		itemDiv.appendChild(itemValue);

		container.append(itemDiv);
	}
}

zbdp.getHeadlineData = function(type) {
	var result = null;
	if(type == 'paper') {
		result = [{
			"ID": 60245,
			"SHORTTITLE": "长征七号运载火箭首飞成 功",
			"TOTALNUMBER": 109,
			"TIMERANGE": 1
		}, {
			"ID": 60246,
			"SHORTTITLE": "习近平同俄罗斯总统普 京举行会谈",
			"TOTALNUMBER": 87,
			"TIMERANGE": 1
		}, {
			"ID": 60247,
			"SHORTTITLE": "拟报高校录取规 则要先了解",
			"TOTALNUMBER": 15,
			"TIMERANGE": 1
		}, {
			"ID": 60248,
			"SHORTTITLE": "付费搜索信 息",
			"TOTALNUMBER": 12,
			"TIMERANGE": 1
		}, {
			"ID": 60249,
			"SHORTTITLE": "区天气预 报",
			"TOTALNUMBER": 10,
			"TIMERANGE": 1
		}, {
			"ID": 60250,
			"SHORTTITLE": "亚投行首批四项目亮 相",
			"TOTALNUMBER": 6,
			"TIMERANGE": 1
		}, {
			"ID": 60251,
			"SHORTTITLE": "不动产统一登记年底前将在 基层全面落地",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1
		}, {
			"ID": 60253,
			"SHORTTITLE": "迅速落实中央最 新指示抓细抓实抢险救灾工作",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1
		}, {
			"ID": 60255,
			"SHORTTITLE": " 弘扬上海精神",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1
		}, {
			"ID": 60256,
			"SHORTTITLE": "第十二届新疆喀 什·中亚南亚商品交易会开幕",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1
		}]
	} else if(type == 'network') {
		result = [{
			"ID": 59369,
			"SHORTTITLE": "为什么长征七号的尾焰多了蓝 色",
			"TOTALNUMBER": 9,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "100"
		}, {
			"ID": 59370,
			"SHORTTITLE": "英国民众集会呼吁第二次公 投",
			"TOTALNUMBER": 4,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "18"
		}, {
			"ID": 59371,
			"SHORTTITLE": "不符优抚政 策",
			"TOTALNUMBER": 4,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "180"
		}, {
			"ID": 59372,
			"SHORTTITLE": "湖南宜章境内一客运大巴起 火",
			"TOTALNUMBER": 4,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "18"
		}, {
			"ID": 59373,
			"SHORTTITLE": "国资委副主任徐福顺等 3",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "88"
		}, {
			"ID": 59374,
			"SHORTTITLE": "用身体护住妻 子",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "18"
		}, {
			"ID": 59375,
			"SHORTTITLE": "协作推进信息网络空间发 展",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "18"
		}, {
			"ID": 59376,
			"SHORTTITLE": "陕西高考状元清华博士毕业回西 安",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "18"
		}, {
			"ID": 59377,
			"SHORTTITLE": "江苏遭龙卷风村庄自救遇难 题",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "300"
		}, {
			"ID": 59379,
			"SHORTTITLE": "都是怎么追回来 的",
			"TOTALNUMBER": 3,
			"TIMERANGE": 1,
			"DICTNUM": "000",
			"VITALITY": "18"
		}]
	}

	return result;
}