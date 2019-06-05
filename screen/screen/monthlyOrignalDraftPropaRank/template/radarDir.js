/*
 * svg构建指令
 */
angular.module("radarModule", []).directive("radar", [function() {
	return {
		replace: true,
		restrict: 'E',
		templateUrl: 'template/radarDir.html',
		link: function($scope, $element, iAttrs) {
			$scope.$watch("article.ARTICLE.CONTRIBOFREAD", function(newV, oldV) {
				$scope.update();
			});
			/*
			 * 传播指数更新，圆形图
			 */
			$scope.update = function() {
				var radarG = d3.select('.radar svg g.radar');
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
					Number($scope.article.ARTICLE.CONTRIBOFREAD),
					Number($scope.article.ARTICLE.CONTRIBOFINTERACT),
					Number($scope.article.ARTICLE.CONTRIBOFREPRINT)
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
			};
		}
	};
}]);