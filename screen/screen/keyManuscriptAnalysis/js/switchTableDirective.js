//描述：切换table界面
//时间：2017-5-23
//作者：fanglijuan
"use strict";
angular.module("switchTableModule", [])
    .directive("switchTableDir", ["$timeout", function($timeout) {
        return {
            scope: {
                data: "="
            },
            restrict: 'E',
            replace: true,
            templateUrl: "template/switchTable_tpl.html",
            link: function($scope, $element, iAttrs, controller) {
                initStatus();

                function initStatus() {
                    $scope.status = {
                        dataArrs: [],
                        idx: 0,
                        tableItemsWidth: 1800,
                        tableNum: 1,
                        offsetWidth:1800
                    };
                    $scope.selectedIndex = 0;
                    $scope.status.tableNum = Math.ceil($scope.data.length / 5); //轮播列表个数
                    $scope.status.tableItemsWidth = $scope.status.tableNum * 1800; //轮播模块总宽度
                    var tempArry = [];
                    for (var i = 0; i < $scope.data.length; i++) {
                        if ((i + 1) % 5 === 0) {
                            tempArry.push($scope.data[i]);
                            $scope.status.dataArrs.push(tempArry);
                            tempArry = [];
                        } else {
                            tempArry.push($scope.data[i]);
                        }
                    }
                    if (tempArry.length > 0) {
                        $scope.status.dataArrs.push(tempArry);
                    }
                }
                $scope.jumpTo = function(index) {
                    $scope.status.offsetLeft = -index * $scope.status.offsetWidth;
                    $timeout(function() {
                        $scope.selectedIndex = index;
                    });
                    $(".table_items").animate({
                            "margin-left": $scope.status.offsetLeft
                        },'slow');
                };
            }
        };
    }]);
