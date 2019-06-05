/**
 * 首页
 * 2017-12-22
 */
"use strict";
angular.module("homePageModule", [
	"ngAnimate",
	"modalDialogServiceModule",
	"homePageServiceModule",
	"httpServiceModule",
	"scrollBarModule"
]).
controller("homePageCtrl", ["$scope", "$timeout", '$interval', "homePageService", "httpService", "$q", "$sce", "modalDialogService", function($scope, $timeout, $interval, homePageService, httpService, $q, $sce, modalDialogService) {
	initStatus();
	initData();
	/**
	 * [initStatus description] 初始化状态
	 * @return {[type]} [description]
	 */
	function initStatus() {
		$scope.status = {
			//最热新闻的滚动参数
			hotPlayConfig: {
				afterEndWaitingTime: 1000,
				initialWaitingTime: 1000,
				slideSpeed: 14,
			},
			isClose: false,
		};
		$scope.playIntervals = {};
		$scope.data = {
			hottestTopicList: []
		};
		initMap();
	}
	modalDialogService.setting(function() { //重置设置
		//		shutDownAutoPlay();
		//		$scope.playIntervals.dutyModeStopPlay = false;
		//		$interval.cancel($scope.playIntervals.emergencyAutoPlay);
		//		initStatus();
		//		initData();
		window.location.reload();
	});
	/**
	 * [initMap description] 初始化地图
	 * @return {[type]} [description]
	 */
	function initMap() {
		$scope.status.chart = echarts.init($('.c_map')[0]); //echarts对象、
		$scope.status.chart.setOption(homePageService.getMapOption());
	}
	/**
	 * [getConfigInfo description] 获取配置信息
	 * @return {[type]} [description]
	 */
	function getConfigInfo() {
		var deffer = $q.defer();
		$scope.configInfo = localStorage["pubOpin2018"];
		if(!$scope.configInfo) {
			homePageService.getAreaList().then(function(data) {
				$scope.configInfo = {
					showMode: "visitMode",
					visitMode: {
						intervalTime: 5000,
					},
					dutyMode: {
						initialWaitingTime: 1000,
						afterEndWaitingTime: 1000,
						slideSpeed: 10
					},
					area: data[0]
				};
				deffer.resolve();
			});
		} else {
			$scope.configInfo = JSON.parse($scope.configInfo);
			deffer.resolve();
		}
		return deffer.promise;
	}
	/**
	 * [initData description] 初始化数据
	 * @return {[type]} [description]
	 */
	function initData() {
		getAreaList();
		hottestTopicPlay(); //最热话题定时任务
		getConfigInfo().then(function() {
			getNewTopicList().then(function() {
				newTopicAutoPlay();
				emergencyAutoPlay();
			});
		});
	}
	/**
	 * [getAreaList description] 获取地域列表
	 * @return {[type]} [description]
	 */
	function getAreaList() {
		var deffer = $q.defer();
		homePageService.getAreaList().then(function(data) {
			$scope.status.areaList = data;
		});
	}
	/**
	 * [newTopicArticle description] 选中最新话题稿件
	 * @param {[obj]} [item] [description] 稿件信息
	 * @return {[type]} [description]
	 */
	$scope.newTopicArticle = function(item) {
		if($scope.configInfo.showMode === "visitMode") {
			//如果当前是参观模式，弹框添加关闭按钮，停止地图的冒泡
			$interval.cancel($scope.playIntervals.newTopic);
			$scope.status.selectedNewTopic = item;
			$scope.playIntervals.dutyModeStopPlay = true;
			var field = $scope.configInfo.area.dictName === "浙江" ? item.AREA : $scope.configInfo.area.dictName;
			modalDialogService.newTopicModal(item, field, "", function() {}, true, function() {
				//当关闭窗口的时候开始地图的冒泡
				doVisitModePlay();
			});
			return;
		}
		$scope.status.selectedNewTopic = item;
		$scope.playIntervals.dutyModeStopPlay = true;
		var field = $scope.configInfo.area.dictName === "浙江" ? item.AREA : $scope.configInfo.area.dictName;
		modalDialogService.newTopicModal(item, field, "", function() {
		});
	};
	/**
	 * [emergencyAutoPlay description] 突发事件自动播放
	 * @return {[type]} [description]
	 */
	function emergencyAutoPlay() {
		emergency();
		//突发事件的定时 2分钟一次
		$scope.playIntervals.emergency = $interval(emergency, 120000);
	}
	/**
	 * [emergency description] 获取突发事件
	 * @return {[type]} [description]
	 */
	function emergency() {
		var deffer = $q.defer();
		var params = {
			"page_no": 0,
			"page_size": 1,
		};
		httpService.http("/screen/zjsentimentBreakNewsMgr/breakNewsSearch", params, "get").
		then(function(data) {
			data = data.MAPRESULT.content.PAGEITEMS;
			var lastEmergencyId = localStorage['lastEmergencyId'];
			if(!data.length) return;
			$scope.data.emergency = data;
			if(!!lastEmergencyId && lastEmergencyId === data[0].SID) {
				return; //如果已经展示过，则不再展示
			} else {
				localStorage['lastEmergencyId'] = data[0].SID;
			}
			shutDownAutoPlay();
			//判断，根据当前的模式选择不同的弹出方式
			if($scope.configInfo.showMode === "dutyMode") {
				modalDialogService.emergencyModal(data[0], $scope.configInfo.dutyMode, function() {
					modalDialogService.closeEmergencyModal();
					$scope.playIntervals.dutyModeStopPlay = false;
					dutyModeDoPlay();
				});
			} else {
				modalDialogService.emergencyPopup(data[0]);
				$timeout(function() {
					modalDialogService.closeEmergencyPopup();
					doVisitModePlay();
				}, Number($scope.configInfo.visitMode.intervalTime) * 2);
			}
		});
	}
	/**
	 * [hottestTopicPlay description] 最热话题定时任务
	 * @return {[type]} [description]
	 */
	function hottestTopicPlay() {
		getHottestTopic();
		$scope.playIntervals.hottestTopic = $interval(getHottestTopic, 600000);
	}
	/**
	 * [getHottestTopic description] 获取最热话题
	 * @return {[type]} [description]
	 */
	function getHottestTopic() {
		var params = {
			page_no: 0,
			page_size: 30,
			user_id: "admin",
			cluster_name: "provice_1"
		};
		$scope.data.hottestTopicList = [];
		httpService.http("/screen/zjSentimentHotTopicsMgr/getHotTopicsList", params, "get").then(function(data) {
			var arrayList = data.MAPRESULT.content.PAGEITEMS;
			arrayList.sort(function(x, y) {
				return y.WEIGHTEDNUMS - x.WEIGHTEDNUMS;
			});
			$scope.data.hottestTopicList = data.MAPRESULT.content.PAGEITEMS;
		});
	}
	/**
	 * [selectArea description]
	 * @param {[object]} [area] [description] 地区信息
	 * @return {[type]} [description]
	 */
	$scope.selectArea = function(selectArea) {
		//判断，如果在参观模式下则跳转至更多，链接上加上当前地域的信息
		if($scope.configInfo.showMode === "visitMode") {
			window.location.href = "../news/news.html?area=" + selectArea.dictNum;
			return;
		}
		//清除所有自动进程以及弹窗 --start
		shutDownAutoPlay();
		//清除所有自动进程以及弹窗 --end
		//更改Localstorage中的地域选择 --start
		$scope.configInfo.area = angular.copy(selectArea);
		var configInfo = JSON.parse(localStorage["pubOpin2018"]);
		configInfo.area = angular.copy(selectArea);
		localStorage["pubOpin2018"] = JSON.stringify(configInfo);
		//更改Localstorage中的地域选择 --end
		getNewTopicList().then(function() {
			$scope.playIntervals.dutyModeStopPlay = false;
			newTopicAutoPlay();
		});
	};
	/**
	 * [shutDownAutoPlay description] 停止最新话题的轮播
	 * @return {[type]} [description]
	 */
	function shutDownAutoPlay() {
		$scope.playIntervals.newTopicIndex = 0;
		$scope.playIntervals.dutyModeStopPlay = true;
		$interval.cancel($scope.playIntervals.newTopic);
		modalDialogService.closeNewTopicPopup(); //关闭浮框
		modalDialogService.closeNewTopicModal(); //关闭最新话题弹窗
	}
	/**
	 * [selectEmergency description] 选中突发新闻
	 * @param {[obj]} [item] [description] 稿件信息
	 * @return {[type]} [description]
	 */
	$scope.selectEmergency = function(item) {
		if($scope.configInfo.showMode === "visitMode") {
			//判断当前的模式
			shutDownAutoPlay();
			modalDialogService.emergencyModal(item, "", function() {
				modalDialogService.closeEmergencyModal();
			}, true, function() {
				doVisitModePlay();
			});
			return;
		}
		shutDownAutoPlay();
		modalDialogService.emergencyModal(item, $scope.configInfo.dutyMode, function() {
			//			modalDialogService.closeEmergencyModal();

		});
	};
	/**
	 * [getbreakDetail description] 获取突发新闻稿件详情
	 * @param {string} [id] [description] 稿件id
	 * @return {[type]} [description]
	 */
	function getbreakDetail(id) {
		var deffer = $q.defer();
		$scope.data.breakdetail = {
			TITLE: "【微博】比悲伤更悲伤：八旬老人为何杀死养育46年的智障儿",
			HTMLCONTENT: $sce.trustAsHtml("<div>asdf<br>sadff</div>"),
			ATTR: "社会",
			URL: "http://www.baidu.com"
		};
		deffer.resolve();
		return deffer.promise;
	}
	/**
	 * [getNewTopicList description] 获取最新话题列表
	 * @return {[type]} [description]
	 */
	function getNewTopicList() {
		var deffer = $q.defer();
		var params = {
			user_id: "admin",
			area_id: $scope.configInfo.area.dictNum,
			page_no: 0,
			page_size: 5,
		};
		httpService.http("/screen/zjSentimentNewTopicsMgr/newTopicsSearch", params, "get").then(function(data) {
			$scope.data.newTopicList = data.MAPRESULT.content.PAGEITEMS;
			deffer.resolve();
		});
		return deffer.promise;
	}

	/**
	 * 新闻自动播放
	 */
	function newTopicAutoPlay() {
		//判断是否是参观模式
		if($scope.configInfo.showMode === "visitMode") {
			//地图冒泡
			visitModePlay();
		} else {
			//列表轮播
			dutyModePlay();
		}
	}
	/**
	 * [visitModePlay description] 参观模式自动轮播
	 * @return {[type]} [description]
	 */
	function visitModePlay() {
		$scope.playIntervals.newTopicIndex = 0;
		$interval.cancel($scope.playIntervals.newTopic);
		doVisitModePlay();
	}
	/**
	 * [doVisitModePlay description] 执行参观模式自动轮播
	 * @return {[type]} [description]
	 */
	function doVisitModePlay() {
		//这边是地图冒泡的定时
		$scope.playIntervals.newTopic = $interval(function() {
			var field;
			var articleInfo = $scope.data.newTopicList[$scope.playIntervals.newTopicIndex];
			//设置当前的选中项，白色
			$scope.status.selectedNewTopic = $scope.data.newTopicList[$scope.playIntervals.newTopicIndex];
			field = $scope.configInfo.area.dictName === "浙江" ? articleInfo.AREA : $scope.configInfo.area.dictName;
			modalDialogService.newTopicPopup(articleInfo, field, function() {
				//点击详情后，停止地图冒泡
				shutDownAutoPlay();
				//打开详情页
				$scope.newTopicArticle($scope.status.selectedNewTopic);
			});
			if($scope.playIntervals.newTopicIndex < ($scope.data.newTopicList.length - 1)) {
				$scope.playIntervals.newTopicIndex++;
			} else {
				getNewTopicList().then(function() {
					visitModePlay();
				});
			}
		}, Number($scope.configInfo.visitMode.intervalTime));
	}
	/**
	 * [dutyModePlay description] 值班模式自动轮播
	 * @return {[type]} [description]
	 */
	function dutyModePlay() {
		$scope.playIntervals.newTopicIndex = 0;
		dutyModeDoPlay();
	}
	/**
	 * [autoPlay description] 执行值班模式自动轮播
	 * @return {[type]} [description]
	 */
	function dutyModeDoPlay() {
		if($scope.playIntervals.dutyModeStopPlay) return;
		if($scope.playIntervals.newTopicIndex < $scope.data.newTopicList.length) {
			var field;
			var articleInfo = $scope.data.newTopicList[$scope.playIntervals.newTopicIndex];
			field = $scope.configInfo.area.dictName === "浙江" ? articleInfo.AREA : $scope.configInfo.area.dictName;
			$scope.status.selectedNewTopic = articleInfo;
			modalDialogService.newTopicModal(articleInfo, field, $scope.configInfo.dutyMode, function() {
				$scope.playIntervals.newTopicIndex++;
				dutyModeDoPlay();
			});
		} else {
			getNewTopicList().then(function() {
				dutyModePlay();
			});
		}
	}

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