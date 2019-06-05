//描述：滚动条指令
//时间：2017-3-16
//作者：Bai.Zhiming
angular.module("scrollBarModule", []).directive("scrollBar", ['$timeout', function($timeout) {
    return {
        scope: {
            loadWatch: "="
        },
        restrict: 'A',
        link: function($scope, $element, iAttrs, controller) {
            var scrollBar;
            var idCode = Math.floor(Math.random() * 99 + 1);
            var id = "wrap_" + idCode;
            $element.attr({"id": id});
            $element.children().eq(0).attr("id","scroll_" + idCode);
            $scope.$watch("loadWatch", function(newV, oldV) {
                if ($element.children().length === 0) return;
                if (angular.isDefined(scrollBar)) scrollBar.destroy();
                $timeout(function() {
                    scrollBar = new IScroll('#' + id, {
                        scrollbars: true,
                        mouseWheel: true,
                        interactiveScrollbars: true,
                        shrinkScrollbars: 'scale',
                        fadeScrollbars: true
                    });
                });
            });
        }
    };
}]);
