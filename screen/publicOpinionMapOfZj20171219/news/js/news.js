/**
 * 描述：浙江舆情地图
 * 日期：2018/1/09
 * 作者: yuzhipeng
 */
"use strict";
var app = angular.module("news", ["ngAnimate", "httpServiceModule", "htmlParseModule", "scrollBarModule", "paginationModule", "homePageServiceModule"]);
app.controller("newsCtrl", ["$scope", "httpService", "$q", "$filter", "$sce", "htmlParseService", "$timeout", "$interval", "homePageService", function($scope, httpService, $q, $filter, $sce, htmlParseService, $timeout, $interval, homePageService) {

	/**
	 * 初始化状态
	 */
	(function initStatus() {
		$scope.status = {
			//控制设置弹窗
			showSet: false,
			//控制详情弹窗
			showDetail: true,
			//当前的地域
			curarea: {
				dictName: "浙江",
				dictNum: "001020"
			},
			//当前的文章
			cursid: "",
			//控制图片的弹窗
			showPic: false,
		}
		openSet();
	})();

	/**
	 * 初始化数据
	 */
	(function initData() {
		$scope.data = {
			//列表数据
			tableData: [],
			//详情数据
			detailData: {},
			//当前的图片地址
			curPic: "",
			//分页参数
			page: {
				CURRPAGE: 0,
				PAGESIZE: 10,
				PAGECOUNT: 0,
				ITEMCOUNT: 0,
				copyCurrPage: 1
			},
			//地域信息 001020,001020001~002020011
			area: [],
		}
		homePageService.getAreaList().then(function(data) {
			$scope.data.area = data;
			getUrlInfo();
			getList().then(function() {

			});
		});
		//		document.addEventListener('click', (e) => {
		//			if($(e.target)[0].tagName == "IMG"){
		//				$timeout(function(){
		//					$scope.status.showPic = true;
		//					$scope.data.curPic = e.target.currentSrc;
		//				},0)
		//			}
		//		})
	})();

	/**
	 * 获取url参数,得到当前的地域信息
	 */
	function getUrlInfo() {
		var area = GetQueryString("area");
		if(area != null) {
			var arr = $scope.data.area.filter(function(arr) {
				return arr.dictNum == area;
			});
			$scope.status.curarea = arr[0];
		}

		function GetQueryString(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
			var r = window.location.search.substr(1).match(reg);
			if(r != null) return unescape(r[2]);
			return null;
		}
	}

	/**
	 * 获取列表数据
	 */
	function getList() {
		var defer = $q.defer();
		var params = {
			page_no: $scope.data.page.CURRPAGE,
			page_size: $scope.data.page.PAGESIZE,
			area_id: $scope.status.curarea.dictNum,
		}
		httpService.httpServer("/screen/zjSentimentNewTopicsMgr/newTopicsSearch?user_id=admin", params).then(function(data) {
			$scope.data.tableData = data.MAPRESULT.content.PAGEITEMS;
			//更新分页参数
			$scope.data.page.ITEMCOUNT = data.MAPRESULT.content.TOTALITEMCOUNT;
			$scope.data.page.PAGECOUNT = data.MAPRESULT.content.PAGETOTAL;
			//判断，设置第一个数为默认展示数据
			if($scope.data.tableData.length > 0) {
				$scope.status.cursid = $scope.data.tableData[0].SID;
				getDetailData($scope.data.tableData[0].SID);
			} else {
				//清空文本内容
				$scope.data.detailData = {};
			}
			defer.resolve();
		});
		return defer.promise;
	}

	/**
	 * 获取详情数据
	 */
	function getDetailData(sid) {
		var params = {
			sid: sid
		}
		httpService.httpServer("/screen/zjSentimentCommonMgr/details", params).then(function(data) {
			$scope.data.detailData = data;
			handleHtmlContent($scope.data.detailData.CONTENTDISPLAY);
		});
	}

	/**
	 *  格式化html
	 */
	function handleHtmlContent(content) {
		htmlParseService.handleHtmlContent(content, 2620, function(data) {
			$timeout(function() {
				$scope.data.detailData.CONTENTDISPLAYRUST = data;
				changeLoadWatch("contentLoadWatch");
			});
		});
	};

	/**
	 * [changeLoadWatch description] 改变滚动条对应监控变量
	 * @param {string} [varname] [description] 变量名称
	 */
	function changeLoadWatch(varname) {
		if(angular.isDefined($scope.status[varname])) $scope.status[varname]++;
		else($scope.status[varname] = 0);
	}

	/**
	 * 关闭设置弹窗
	 */
	function closeSet() {
		$timeout(function() {
			$scope.status.showSet = false;
		}, 0);
	}

	/**
	 * 关闭详情弹窗
	 */
	function closeDetail() {
		$timeout(function() {
			$scope.status.showDetail = false;
		}, 0);
	}

	/**
	 * 打开弹窗
	 */
	function openSet() {
		$("body").bind("keydown", function(e) {
			if(e.keyCode === 27) {
				$timeout(function() {
					$scope.status.showSet = !$scope.status.showSet;
				}, 0);
			}
		});
	}

	/**
	 * 打开详情弹窗
	 */
	function openDetail() {
		$timeout(function() {
			$scope.status.showDetail = true;
		}, 0);
	}

	/**
	 * 重置分页
	 */
	function resetPage() {
		$scope.data.page = {
			CURRPAGE: 0,
			PAGESIZE: 10,
			PAGECOUNT: 0,
			ITEMCOUNT: 0,
			copyCurrPage: 1
		};
		getList();
	}

	$scope.requestData = function() {
		$scope.newTopicIndex = 0;
		$interval.cancel($scope.newTopic);
		getList();
	}

	$scope.getDetailData = function(sid) {
		$scope.status.showDetail = true;
		getDetailData(sid);
	}

	$scope.closeSet = function() {
		closeSet();
	}

	$scope.closeDetail = function() {
		closeDetail();
	}

	$scope.resetPage = function() {
		$scope.newTopicIndex = 0;
		$interval.cancel($scope.newTopic);
		resetPage();
	}

}]).filter('number', ['$sce', function($sce) {
	function wordLimitTo(text, len, symbol) {
		var bytesCount = 0;
		var commonCount = 0;
		for(var i = 0; i < text.length; i++) {
			var c = text.charAt(i);
			var isSingle = /^[\u0000-\u00ff]$/.test(c);
			if(isSingle) //匹配双字节
			{
				bytesCount += 1;
			} else {
				bytesCount += 2;
			}
			commonCount++;
			if(bytesCount >= len) {
				text = text.substring(0, commonCount);
				text += symbol;
				break;
			}
		}
		return text;
	};
	return function(input, params) {
		if(angular.isDefined(input)) {
			if(angular.isDefined(params)) {
				return wordLimitTo(input, params.number, "...");
			}
			return wordLimitTo(input, 40, "...");
		}
		return input;
	};
}]).filter('time1', ['$sce', function($sce) {
	return function(input) {
		if(angular.isDefined(input)) {
			var time = input.split(" ");
			return time[0].substring(2, time[0].length);
		}
		return input;
	};
}]).filter('time2', ['$sce', function($sce) {
	return function(input) {
		if(angular.isDefined(input)) {
			var time = input.split(" ");
			return time[1];
		}
		return input;
	};
}]).filter("trsSce", ['$sce', function($sce) {
	return function(input) {
		if(angular.isDefined(input)) {
			input = $sce.trustAsHtml(input);
		}
		return input;
	};
}]).filter("type", ['$sce', function($sce) {
	return function(input) {
		if(angular.isDefined(input)) {
			switch(input) {
				case "1":
					return "新闻";
					break;
				case "2":
					return "微博";
					break;
				case "3":
					return "新闻";
					break;
				case "4":
					return "新闻";
					break;
				case "5":
					return "新闻";
					break;
				case "6":
					return "微博";
					break;
				case "7":
					return "头条";
					break;
			}
		}
		return input;
	};
}]);