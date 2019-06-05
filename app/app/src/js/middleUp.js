$(function() {
    //稿件原创排行
    function originalRank(object) {
        var origins = object.data;
        var max = object.totalcount;
        //更新前清空所有子节点
        $("#originalRank").empty();
        var originalRank = Snap("#originalRank");
        var x1 = 22;
        for (var i = 0; i < origins.length; i++) {
            var g = originalRank.paper.g().attr({
                transform: "matrix(1 0 0 1 0 " + x1 + ")"
            });

            var origin = origins[i];
            g.add(originalRank.paper.text(30, 0, (origin.name).substring(0, 3)).attr({
                textAnchor: "end"
            }));
            var count = 16 * (origin.value / max);
            var x2 = 35;
            for (var j = 0; j < count; j++) {
                g.add(originalRank.paper.rect(x2, -10, 5, 12).attr({ fill: "#21a3c0", stroke: "none" }));
                x2 += 6;
            }
            g.add(originalRank.paper.text(140, 0, origin.value).attr({
                textAnchor: "start"
            }));
            originalRank.append(g);
            x1 += 32;
        }
    }

    //选题稿件 
    function manuscriptTrace(obj) {
        var len = obj.data.length;
        var i = 0;
        var t;
        if (len <= 0) { return; }

        function fade() {
            if (i >= len) {
                i = 0;
            }
            var o = obj.data[i];
            Snap("#headline").node.innerHTML = o.title.substring(0, 7)+"...";
            if (o.iwo) {
                Snap("#iwo").attr({
                    opacity: 1
                });
            } else {
                Snap("#iwo").attr({
                    opacity: 0
                });
            }
            if (o.share) {
                Snap("#share").attr({
                    opacity: 1
                });
            } else {
                Snap("#share").attr({
                    opacity: 0
                });
            }
            if (o.fetch) {
                Snap("#fetch").attr({
                    opacity: 1
                });
            } else {
                Snap("#fetch").attr({
                    opacity: 0
                });
            }
            if (o.fetch) {
                Snap("#yifa").attr({
                    opacity: 1
                });
            } else {
                Snap("#yifa").attr({
                    opacity: 0
                });
            }
            i++;
            clearTimeout(t);
            t = setTimeout(function() {
                fade();
            }, 5000);
        }
        fade();
    }

    //稿件原创判断
    getResquestUrl(domain + "/data/index/middle/data14.json", originalRank);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/middle/data14.json", originalRank);
    }, millisec);

    //选题稿件 
    // setInterval(function() {
    //     getResquestUrl(domain + "/wcm/bigscreen.do?methodname=xuanTiGaoJian&serviceid=mlf_bigscreen", manuscriptTrace);
    // }, millisec);
    getResquestUrl(domain + "/data/index/middle/data15.json", manuscriptTrace);
});