(function() {
    function request(method, url, param, resolve, reject) {
        $.ajax({
            type: method || "get",
            url: url,
            data: param || {},
            dataType:"json",
            success: function(data) {
                resolve(data);
            },
            error: function(e) {
                reject(e);
            }
        });
    }

    function sendRequest(method, url, param) {
        return new Promise(function(resolve, reject) {
            request(method, url, param, resolve, reject);
        });
    }
    window.sendRequest = sendRequest;
})();