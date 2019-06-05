/*
 * 稿件详情模版
 */
"use strict"
angular.module("manuscriptModule", []).directive("manuscriptdetail", ['$sce', "$timeout", function($sce, $timeout) {
	return {
		restrict: 'AE',
		templateUrl: 'template/indexfordetail.html',
		link: function($scope, iElm, iAttrs) {
			/*
			 * 右下轮播
			 */
			$scope.gettableinfo = function(index) {
				$scope.status.dataArrs = [];
				$scope.status.index = 0;
				$scope.selectedIndex = 0;
				$scope.status.tableNum = Math.ceil($scope.article.IMPS.length / 5); //轮播列表个数
				$scope.status.tableItemsWidth = $scope.status.tableNum * 1920; //轮播模块总宽度
				var tempArry = [];
				for(var i = 0; i < $scope.article.IMPS.length; i++) {
                    console.log($scope.article);
                    if((i + 1) % 5 === 0) {
						tempArry.push($scope.article.IMPS[i]);
						$scope.status.dataArrs.push(tempArry);
						tempArry = [];
					} else {
						tempArry.push($scope.article.IMPS[i]);
					}
				}
				if(tempArry.length > 0) {
					$scope.status.dataArrs.push(tempArry);
				}
			}
			/*
			 * 右下轮播点击切换方法
			 */
			$scope.playIndex = function(index) {
				$scope.status.index = index;
				$(".table_cox").animate({
					"left": -$scope.status.offsetWidth * index
				}, 'slow');
			};
		}
	}
}]);