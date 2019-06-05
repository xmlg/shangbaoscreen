var app = angular.module('onceOptionModule', []);
app.controller('onceOptionCtrl', ['$scope', '$timeout', '$q', 'readJSON', function($scope, $timeout, $q, readJSON) {
    initStatus();
    initData();
    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.status = {
            index: 0
        };
        $scope.data = {};
    }
    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        requestData().then(function() {
            selectedItem();
        });
    };
    /**
     * [selectedItem description] 选中稿件
     * @return {[type]} [description]
     */
    function selectedItem() {
        $timeout(function() {
        	if ($scope.status.index<5) {
        		$scope.status.selectedItem = $scope.data.datasetData[$scope.status.index];
        		contentScroll();
        	}else{
        		initData();
        		$scope.status.index=0;
        	}
        });
    };

    function contentScroll() {
        var element = angular.element("#rightContent");
        var contentRealHeight = element.find(".textarea").height();
        var contentHeight = element.height();
        console.log(contentRealHeight);
    };
    
    /**
     * [requestData description] 获取列表数据
     * @return {[type]} [description]
     */
    function requestData() {
        var deffer = $q.defer();
        readJSON.query().then(function(data) {
            $scope.data.datasetData = data;
            deffer.resolve();
        });
        return deffer.promise;

    }
    /**
     * [scrollFinsh description] 滚动完成
     * @return {[type]} [description]
     */
    $scope.scrollFinsh = function() {
        $scope.status.index++;
        selectedItem();
    };
}]).factory('readJSON', ['$http', '$q', function($http, $q) {
    return {
        query: function() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: './readJSON.json'
            }).success(function(data, status, header, config) {
                deferred.resolve(data);
            }).error(function(data, status, header, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}]).directive("autoScroll", [function() {
    return {
        restrict: "A",
        replace: false,
        scope: {
            item: "=", //双向绑定
            selectedItem: "=",
            autoScrollFinish: "&" //连接方法
        },
        transclude: false, //
        link: function(scope, $elem, $attr) {
            init();
            /**
             * [init description] 初始化
             * @return {[type]} [description]
             */
            function init() {
                scope.$watch("selectedItem", function(newV, oldV) {
                    if (newV === scope.item) {
                        autoScroll(function() {

                        });
                    }
                })
            }
            /**
             * [autoScroll description] 自动滚动
             * @return {[type]} [description]
             */
            function autoScroll() {
                var pRealWidth = $elem.find("p").width();
                var parentWidth = $elem.width() - 20;
                if (pRealWidth > parentWidth) {
                    var compare = parentWidth - pRealWidth;
                    var speed = 0.1;
                    $elem.find("p").animate({ left: compare }, -(compare / speed), "linear", function() {
                        setTimeout(function() {
                            scope.autoScrollFinish();
                        }, 1000);
                    });
                } else {
                    setTimeout(function() {
                        scope.autoScrollFinish();
                    }, 2000);
                }

            }

        }
    };
}]);