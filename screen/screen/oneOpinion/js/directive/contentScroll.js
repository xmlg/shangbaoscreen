angular.module("contentScrollModule", [])
    .directive("contentScroll", ["$timeout", function($timeout) {
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
                    contentScroll();

                }
                /**
                 * [contentScroll description] 向上滚动
                 * @return {[type]} [description]
                 */
                function contentScroll() {
                    $timeout(function() {
                        var element = $elem.find("#rightContent");
                        var contentHeight = element.height();
                        if (contentHeight > 900) {
                            setTimeout(function() {
                                var compareHeight = contentHeight - 900;
                                var speed = 0.1;
                                element.animate({ top: -compareHeight }, (compareHeight / speed), "linear", function() {
                                    setTimeout(function() {
                                        element.css("top", "0px");
                                        scope.autoScrollFinish();
                                    }, 3000);
                                });
                            }, 3000);
                        } else {
                            setTimeout(function() {
                                scope.autoScrollFinish();
                            }, 3000);
                        }
                    })
                };


            }
        };
    }]);