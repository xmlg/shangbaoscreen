var app = angular.module('onceOptionModule', ["onceOpinionServiceModule", "autoScrollModule", "contentScrollModule"]);
app.controller('onceOptionCtrl', ['$scope', '$sce', '$timeout', '$q', 'readJSON', function($scope, $sce, $timeout, $q, readJSON) {
    initStatus();
    initData();
    /**
     * [initStatus description] 初始化状态
     * @return {[type]} [description]
     */
    function initStatus() {
        $scope.status = {
            index: 0,
            id: getUrlParams("id"),
            scene_level: getUrlParams("scene_level"),
            titleScrollFinished: false,
            contentScrollFinished: false,
            noDataTimeout: "", //暂无数据时定时重载定时器
            noDataWaitTime: 1000 * 60 * 2 //暂无数据时定时重载
        };
        $scope.data = {

        };
    }
    /**
     * [getUrlParams description] 获取路由参数
     * @param  {[type]} params [description] 要获取的参数名
     * @return {[type]}        [description]
     */
    function getUrlParams(params) {
        var reg = new RegExp("(^|&)" + params + "=([^&]*)(&|$)");
        var paramsData = window.location.search.substr(1).match(reg);
        return !!paramsData ? paramsData[2] : "0";
    }
    /**
     * [initData description] 初始化数据
     * @return {[type]} [description]
     */
    function initData() {
        requestData().then(function() {
            selectedItem();
        });
    };
    /**
     * [selectedItem description] 选中稿件
     * @return {[type]} [description]
     */
    function selectedItem() {
        if ($scope.status.index < 5 && $scope.status.index < $scope.data.datasetData.length) {
            $timeout(function() {
                delete $scope.status.selectedItem;
            });
            $timeout(function() {
                $scope.status.selectedItem = $scope.data.datasetData[$scope.status.index];
                $scope.status.selectedItem.CONTENT = $scope.status.selectedItem.CONTENT.replace(/\n/g, '<br/>');
                handleHtml();
                $scope.status.selectedItem.CONTENT = $sce.trustAsHtml($scope.status.selectedItem.CONTENT);
            }, 500);
        } else {
            window.location.reload();
            // $scope.status.index = 0;
        }
    }
    /**
     * [handleHtml description] 处理HTML正文
     * @return {[type]} [description]
     */
    function handleHtml() {
        var dom = document.createElement("div");
        dom.innerHTML = $scope.status.selectedItem.CONTENT;
        var $dom = $(dom);
        $dom.find("img").remove();
        $dom.find("iframe").remove();
        $dom.find("video").remove();
        $scope.status.selectedItem.CONTENT = $dom.html();
    }
    /**
     * [requestData description] 获取列表数据
     * @return {[type]} [description]
     */
    function requestData() {
        var deffer = $q.defer();
        readJSON.query($scope.status.id, $scope.status.scene_level).then(function(data) {
            $scope.data.datasetData = data.ITEMS.PAGEITEMS;
            $scope.data.title = data.SENTIMENT_INDEX;
            if ($scope.data.datasetData.length === 0) {
                $('.noData').show();
                $('.main').hide();
                $('#ab_scroll').hide();
                //暂无数据时，定时去请求页面
                clearTimeout($scope.status.noDataTimeout);
                $scope.status.noDataTimeout = setTimeout(function() {
                    window.location.reload();
                }, $scope.status.noDataWaitTime);
                deffer.reject();
            } else {
                $('.noData').hide();
                $('.main').show();
                $('#ab_scroll').show();
                deffer.resolve();
            }
        });
        return deffer.promise;
    }
    /**
     * [scrollFinsh description] 滚动完成
     * @param {[string]} [varname] [description] 
     * @return {[type]} [description]
     */
    $scope.scrollFinsh = function(type) {
        if (type === "title") {
            $scope.status.titleScrollFinished = true;
        } else if (type === "content") {
            $scope.status.contentScrollFinished = true;
        }
        if ($scope.status.titleScrollFinished && $scope.status.contentScrollFinished) {
            $scope.status.titleScrollFinished = false;
            $scope.status.contentScrollFinished = false
            $scope.status.index++;
            selectedItem();
        }
    };
}]);