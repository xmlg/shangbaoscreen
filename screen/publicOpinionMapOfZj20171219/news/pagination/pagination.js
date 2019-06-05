/**
 * 分页指令
 */
angular.module("paginationModule", []).directive("pagination", ["$timeout", function($timeout) {
	return {
		restrict: 'E',
		scope: {
			page: "=", //分页参数
			callback: "&", //回调函数
		},
		templateUrl: 'pagination/pagination.html',
		link: function($scope, iElm, iAttrs) {
			/**
			 * 初始化状态
			 */
			(function initStatus() {
				$scope.status = {
					//显示分页数
					pageNum: 3
				}
				//初始化分页实例
				$scope.pageOptions = {
					pageIndex: $scope.page.CURRPAGE, //当前页码
					pageSize: $scope.page.PAGESIZE, //每页显示数量
					itemCount: $scope.page.ITEMCOUNT, //显示项的总数量
					maxButtonCount: 3, //除去第一页和最后一页的最大按钮数量
					prevText: "上一页",
					nextText: "下一页 ",
					buildPageUrl: null,
					onPageChanged: function(pageIndex) {
						$scope.page.CURRPAGE = pageIndex;
						$scope.callback();
					} //页码修改后的回调函数，包含一个pageIndex参数
				};
				$scope.pager = $("#page").pager($scope.pageOptions);
				//监听
				$scope.$watch("page", function(newValue, oldValue) {
					if(newValue === oldValue) {
						return;
					}
					$scope.pageOptions.pageIndex = $scope.page.CURRPAGE; //当前页码
					$scope.pageOptions.pageSize = $scope.page.PAGESIZE; //每页显示数量
					$scope.pageOptions.itemCount = $scope.page.ITEMCOUNT; //显示项的总数量
					$scope.pager = $("#page").pager($scope.pageOptions);
				}, true);

			})();

			/**
			 * 上一页
			 */
			$scope.up = function() {
				if($scope.page.CURRPAGE > 0) {
					--$scope.page.CURRPAGE;
					$scope.pager.setPageIndex($scope.page.CURRPAGE - 1);
				}
				$scope.callback();
			}
			/**
			 * 下一页
			 */
			$scope.down = function() {
				if($scope.page.CURRPAGE < $scope.page.PAGECOUNT - 2) {
					++$scope.page.CURRPAGE;
					$scope.pager.setPageIndex($scope.page.CURRPAGE - 1);
				}
				$scope.callback();
			}
			/**
			 * 跳转
			 */
			$scope.jump = function($event) {
				if($event.keyCode === 13) {
					if(0 < $scope.page.copyCurrPage && $scope.page.copyCurrPage < $scope.page.PAGECOUNT) {
						$scope.page.CURRPAGE = $scope.page.copyCurrPage - 1;
						$scope.pager.setPageIndex($scope.page.CURRPAGE - 1);
					}
					$scope.callback();
				}
			}
		}

	}
}]);