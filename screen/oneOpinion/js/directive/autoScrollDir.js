angular.module("autoScrollModule", [])
    .directive("autoScroll", [function() {
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
                var myTimeout;
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
                        } else {
                            $elem.find("p").stop().css("left", 0);
                            clearTimeout(myTimeout);
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
                    if (pRealWidth - parentWidth > 10) {
                        var compare = parentWidth - pRealWidth;
                        var speed = 0.1;
                        $elem.find("p").animate({ left: compare }, -(compare / speed), "linear", function() {
                            myTimeout = setTimeout(function() {
                                $elem.find("p").css("left", 0);
                                autoScroll();
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