//描述：http ajax工具类
//时间：2017-2-11
//作者：bai,zhiming
angular.module("httpServiceModule", []).
config(["$httpProvider", function($httpProvider) {
    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    function toFormData(obj) {
        var query = '';
        var name, value, fullSubName, subName, subValue, innerObj, i;

        for (name in obj) {
            value = obj[name];

            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name; //name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += toFormData(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += toFormData(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    }
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? toFormData(data) : data;
    }];
}]).
factory("httpService", ["$http", "$q", function($http, $q) {
    return {
        httpServer: function(url, params) {
            var deffer = $q.defer();
            $http({
                method: "get",
                url: url,
                headers: {
                    'formdata': "1",
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: params,
                params: params
            }).success(function(data) {
                deffer.resolve(data);
            }).error(function(data) {
                deffer.reject(data);
            });
            return deffer.promise;
        }
    };
}]);
