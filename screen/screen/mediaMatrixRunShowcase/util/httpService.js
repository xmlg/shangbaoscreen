//描述：http ajax工具类
//时间：2017-2-11
//作者：bai,zhiming
(function() {
    window.httpService = function() {};
    httpService.prototype.httpServer = function(url, params, dataType) {
        var deffer = $.Deferred();
        $.ajax({
            url: url,
            data: (params !== undefined ? params : null),
            dataType: dataType || "json",
            method: "get",
            timeout: 20000,
            success: function(data) {
                deffer.resolve(data);
            },
            error: function(data) {
            	deffer.reject(data);
            }
        });
        return deffer.promise();
    };
})();
