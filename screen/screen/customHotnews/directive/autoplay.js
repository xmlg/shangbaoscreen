/**
 * 自动播放指令
 */
"use strict";
angular.module("autoPlayModule", [])
    .directive("autoplay", ["$timeout", function($timeout) {
        return {
            restrict: "A",
            replace: false,
            scope: false,
            link: function(scope, $elem, $attrs) {
                var index = 0;
                $timeout(function() {
                    autoPlay();
                }, 1000);
                /**
                 * [autoPlay description]自动轮播
                 * @return {[type]} [description]
                 */
                function autoPlay() {
                    scope.status.selectedDoc = scope.data.list[index];
                    if (index === (scope.data.list.length - 1)) index = 0;
                    else index++;
                    $timeout(function() {
                        reload();
                        autoPlay();
                    }, 5000);
                }
                /**
                 * [reload description] 刷新页面
                 * @return {[type]} [description]
                 */
                function reload() {
                    var minute = new Date().getMinutes();
                    minute = minute > 9 ? minute + "" : "0" + minute;
                    var second = new Date().getSeconds();
                    second = second > 9 ? second + "" : "0" + second;
                    var time = minute + second;
                    if (time > "4545"&&time<"4554") {
                        window.location.reload();
                    }
                }
            }
        };
    }]);