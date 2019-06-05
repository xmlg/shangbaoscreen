"use strict";
angular.module("httpServerModule", []).
factory("http", ["$q", "$http", function($q, $http) {
    return {
        /**
         * [get description]
         * @param  {[type]} params [description] 参数
         * @return {[type]}        [description]
         */
        getData: function(url, params, dataType) {
            var deffer = $q.defer();
            $.ajax({
                url: url,
                type: "get",
                data: params,
                timeout: 10000,
                dataType: dataType || "json",
                success: function(data) {
                    deffer.resolve(data);
                },
                error: function() {
                    deffer.reject();
                }
            });
            return deffer.promise;
        }
    };
}]);