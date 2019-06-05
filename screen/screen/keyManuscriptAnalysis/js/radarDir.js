//描述：滚动条指令
//时间：2017-3-16
//作者：Bai.Zhiming
angular.module("radarModule", []).directive("radar", [function() {
    return {
        replace: true,
        scope: {
            currArticle: "="
        },
        restrict: 'E',
        templateUrl: 'template/radar_tpl.html?v=' + Math.random(),
        link: function($scope, $element, iAttrs) {
            var radarG = d3.select('.radar svg g.radar');
            update();
            /**
             * [setPercent description] 获取百分数
             * @param {[string]} [value] [description] 小数值
             * @return {[string]} percentValue [description] 百分数值
             */
            $scope.setPercent = function(value) {
                return (Number(value) * 100).toFixed(0) + "%";
                /*return (Number(value) * 100) + "%";*/
            };

            function update() {
                var self = this;

                var scale = d3.scale.linear().domain([0, 1]).range([82.5, 330]).clamp(true);

                var line0 = d3.svg.line()
                    .x(function(d, i) {
                        return 0;
                    })
                    .y(function(d, i) {
                        return 0;
                    });

                var line1 = d3.svg.line()
                    .x(function(d, i) {
                        return scale(d) * Math.sin(i * 2 * Math.PI / 3);
                    })
                    .y(function(d, i) {
                        return -scale(d) * Math.cos(i * 2 * Math.PI / 3);
                    });

                var radarValues = [
                    Number($scope.currArticle.CONTRIBOFREAD),
                    Number($scope.currArticle.CONTRIBOFINTERACT),
                    Number($scope.currArticle.CONTRIBOFREPRINT)
                ];

                var update = radarG.selectAll('path.line').data([radarValues]);
                var enter = update.enter();
                var exit = update.exit();

                exit.remove();
                enter.append("path")
                    .classed('line', true)
                    .attr({
                        'fill': 'rgba(45, 160, 150, 0.5)',
                        'stroke': '#269797',
                        'stroke-width': 1
                    })
                    .attr("d", function(d) {
                        return line0(d) + ' Z';
                    });
                update
                    .transition()
                    .duration(500)
                    .attr("d", function(d) {
                        return line1(d) + ' Z';
                    });
            }
        }
    };
}]);
