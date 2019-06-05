//描述：切换稿件界面
//时间：2017-3-20
//作者：Bai.Zhiming
"use strict";
angular.module("switchDraftModule", [])
    .directive("switchDraftDir", ["$timeout", function($timeout) {
        return {
            scope: {
                data: "=",
                modalShow: "=",
                selectedIndex: "="
            },
            restrict: 'E',
            replace: true,
            templateUrl: "template/switchDraft_tpl.html",
            link: function($scope, $element, iAttrs, controller) {
                initStatus();
                $scope.clickTitle = function(item) {
                    /*if (angular.isDefined(item.URL)) {
                        window.open(item.URL);
                        return;
                    }*/
                    $scope.modalShow = true;
                };
                $scope.toLeft = function() {
                    if ($scope.selectedIndex === 0) return;
                    $scope.status.offsetLeft += $scope.status.offsetWidth;
                    $timeout(function() {
                        $scope.selectedIndex -= 1;
                    });
                    $(".bqxt_scroll_content_parent").stop(true, true).animate({
                            left: $scope.status.offsetLeft
                        },
                        'slow');
                };
                $scope.toRight = function() {
                    if ($scope.selectedIndex === ($scope.data.length - 1)) return;
                    $scope.status.offsetLeft -= $scope.status.offsetWidth;
                    $timeout(function() {
                        $scope.selectedIndex += 1;
                    });
                    $(".bqxt_scroll_content_parent").stop(true, true).animate({
                            left: $scope.status.offsetLeft
                        },
                        'slow');
                };
                $scope.jumpTo = function(index) {
                    $scope.status.offsetLeft = -index * $scope.status.offsetWidth;
                    $timeout(function() {
                        $scope.selectedIndex = index;
                    });
                    $(".bqxt_scroll_content_parent").stop(true).animate({
                            left: $scope.status.offsetLeft
                        },
                        'slow');
                };

                function initStatus() {
                    $scope.selectedIndex = 0;
                    $scope.status = {
                        offsetWidth: 1904,
                        offsetLeft: 0
                    };
                    $timeout(function() {
                        $scope.status.parentWidth = $scope.status.offsetWidth * $scope.data.length;
                        $element.find(".bqxt_scroll_content_parent").eq(0).width($scope.status.parentWidth);
                    }, 100);
                }
            }
        };
    }]);
