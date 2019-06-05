//描述：播放器
//时间：2017-3-22
//作者：Bai.Zhiming
"use strict";
angular.module("videoPlayerModule", [])
    .directive("videoPlayer", ["$timeout", "dataManagerService", function($timeout, dataManagerService) {
        return {
            scope: {
                videoTime: "=",
                sourceId: "=",
            },
            restrict: 'E',
            replace: true,
            template: "<div><div class='video-status-error' ng-if='transcoding'></div></div>",
            link: function($scope, $element, iAttrs, controller) {
                console.log($scope.sourceId);
                $scope.videoTime = "00:00:00";
                $scope.transcoding = false;
                var fv = $element.flareVideo();
                dataManagerService.getVideoUrl($scope.sourceId, $scope).then(function(data) {
                    //返回有两个播放地址,用playUrl连接作为播放地址
                    fv.load([{
                        src: data.playUrl,
                        type: 'video/mp4'
                    }]);
                    fv.ontimeupdate(function(datas) {
                        var time = Math.round(datas.currentTarget.currentTime);
                        if ($scope.time !== time) {
                            $timeout(function() {
                                $scope.time = time;
                                var hour = Math.floor(time / 3600);
                                var minutes = Math.floor(time / 60);
                                var seconds = time - (hour * 3600) - (minutes * 60);
                                $scope.videoTime = (hour === 0 ? "00" : (hour > 9 ? hour : "0" + hour)) + ":" + (minutes === 0 ? "00" : (minutes > 9 ? minutes : "0" + minutes)) + ":" + (seconds > 9 ? seconds : ("0" + seconds));
                            });
                        }
                    });
                });
            }

        };
    }]);
