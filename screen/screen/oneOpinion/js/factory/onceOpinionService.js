angular.module("onceOpinionServiceModule", []).factory('readJSON', ['$http', '$q', function($http, $q) {
    return {
        /**
         * [query description] 查询列表 
         * @param  {[type]} id [description] 查询id
         * @return {[type]}    [description]
         */
        query: function(id, scene_level) {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: '/screen/consensus/getnewlist?id=' + id + '&scene_level=' + scene_level + '&pagesize=20&startpage=0'
            }).success(function(data, status, header, config) {
                deferred.resolve(data);
            }).error(function(data, status, header, config) {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}])