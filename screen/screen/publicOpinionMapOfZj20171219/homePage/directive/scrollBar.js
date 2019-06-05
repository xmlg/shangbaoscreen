//描述：滚动条指令
//时间：2017-3-16
//作者：Bai.Zhiming
"use strict";
angular.module("scrollBarModule", []).directive("scrollBar", ['$timeout', function($timeout) {
    return {
        scope: {
            loadWatch: "=",
            autoScrollConfig: "=",
            scrollEnd: "&",
            autoPlayStop: "&"
        },
        restrict: 'A',
        link: function($scope, $element, iAttrs, controller) {
            var scroll;
            var myTimeout1;
            var myTimeout2;
            var myTimeout3;
            var myTimeout4;
            var idCode = Math.floor(Math.random() * 99 + 1);
            var id = "wrap_" + idCode;
            $element.attr({ "id": id });
            $element.children().eq(0).attr("id", "scroll_" + idCode);
            $scope.$watch("loadWatch", function(newV, oldV) {
                if ($element.children().length === 0) return;
                if (angular.isDefined(scroll)) scroll.destroy();
                myTimeout1 = $timeout(function() {
                    scroll = new IScroll('#' + id, {
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: true
                    });
                    if ($scope.autoScrollConfig) {
                        var containerHeight = $element.height();
                        var pHeight = $element.children().eq(0).height();
                        myTimeout2 = $timeout(function() {
                            autoScroll(containerHeight - pHeight, function() {
                                $scope.scrollEnd();
                            });
                        }, Number($scope.autoScrollConfig.initialWaitingTime));
                    }
                    scroll.on("scrollCancel", function() {
                        $scope.autoPlayStop();
                    });
                });
            });
            $scope.$on("$destroy", function() {
                scroll.destroy();
                $timeout.cancel(myTimeout1);
                $timeout.cancel(myTimeout2);
                $timeout.cancel(myTimeout3);
                $timeout.cancel(myTimeout4);
            });
            /**
             * [autoScroll description] 自动滚动
             * @param {int} [different] [description] 差值
             * @param {fn} [success] [description] 结束回调
             * @return {[type]} [description]
             */
            function autoScroll(different, success) {
                if (different < 0) {
                    var time = (Math.abs(different) / Number($scope.autoScrollConfig.slideSpeed)) * 1000;
                    scroll.scrollTo(0, different, time, IScroll.utils.ease.linear, function() {
                        myTimeout3 = $timeout(function() {
                            success();
                        }, Number($scope.autoScrollConfig.afterEndWaitingTime));
                    });
                } else {
                    myTimeout4 = $timeout(function() {
                        success();
                    }, Number($scope.autoScrollConfig.afterEndWaitingTime));
                }
            }
        }
    };
}]);