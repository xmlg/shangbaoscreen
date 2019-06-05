$(function() {
    /**
     * [Polygon 梯形]
     * @param {[int]} shareCount [已共享]
     * @param {[int]} takeCount  [已取用]
     */
    function Polygon(shareCount, takeCount) {
        // this.object = this.object || {};
        this.width = 100;
        this.height = 175;
        this.angle = 29.5;
        this.x = 120;
        this.shareCount = shareCount;
        this.takeCount = takeCount;
    }
    Polygon.prototype.init = function() {
        var tan = Math.tan(this.angle * (Math.PI / 180)); //直角三角形正切值
        if (this.shareCount === 0) {
            progress = 0;
        } else {
            progress = this.takeCount / this.shareCount;
        }
        this.h = this.height * progress;
        this.y = this.height - this.height * progress; //梯形起点y
        var l = this.h * tan; //直角三角形邻边长度
        this.w = this.width - l; //梯形上底宽度
        var shareArticle = Snap("#shareArticle");
        if ($("#shapes2").length > 0) {
            $("#shapes2").remove();
        }
        this.g = shareArticle.paper.g().attr({
            id: "shapes2"
        });
        shareArticle.append(this.g);
        this.createTrapezoid();
        this.createH();
        this.createV();
        this.createClip();
    };
    //创建梯形
    Polygon.prototype.createTrapezoid = function() {
        this.path = "M" + this.x + "," + this.y + " " + this.x + "," + this.height + " " + (this.x + this.width) + "," + this.height + " " + (this.x + this.w) + "," + this.y + " z";
        var shareArticle = Snap("#shareArticle");
        var p = shareArticle.paper.path(this.path).attr({
            stroke: "none",
            fill: "#0b6479"
        });
        this.g.add(p);
    };
    //创建垂直线
    Polygon.prototype.createH = function() {
        var number = Math.floor(this.width / 10);
        var up = this.w / number;
        for (var i = 1; i < number + 1; i++) {
            var x1 = this.x + (up * i);
            var x2 = this.x + (10 * i);
            var shareArticle = Snap("#shareArticle");
            var p = shareArticle.paper.path("M" + x1 + "," + this.y + " " + x2 + ",175").attr({
                fill: "none",
                stroke: "black",
            });
            this.g.add(p);
        }

    };
    //创建水平线
    Polygon.prototype.createV = function() {
        var number = Math.floor(this.h / 15);
        for (var i = 1; i < number + 1; i++) {
            var h = this.height - 15 * i;
            var shareArticle = Snap("#shareArticle");
            var p = shareArticle.paper.path("M120" + "," + h + " 220," + h).attr({
                fill: "none",
                stroke: "black"
            });
            this.g.add(p);
        }
    };
    //创建裁剪图形
    Polygon.prototype.createClip = function() {
        var pathClip2 = Snap("#pathClip2");
        var p1 = pathClip2.paper.path(this.path).attr({
            stroke: "#9c4c50",
            fill: "none"
        });
        pathClip2.append(p1);
    };

    function queryShareAndFetch(obj) {
        var polygon = new Polygon(obj.sharecount, obj.fetchcount);
        polygon.init();
        var percent = (obj.fetchcount / obj.sharecount) * 100;
        Snap("#percent_num").node.textContent = percent.toFixed(2) + "%";
        middleBelow.running(obj.fetchcount, obj.sharecount);
    }


    //三圈
    function querySanquan(content) {

        //三圈子集
        for (i in content) {
            switch (i) {
                case 'baozi':
                    $("#sanquan_szb_content").empty();
                    drawInternet("sanquan_szb_content", content.baozi, content.baozi / content.totalcount);
                    break;
                case 'app':
                    $("#sanquan_app_content").empty();
                    drawInternet("sanquan_app_content", content.app, content.app / content.totalcount);
                    break;
                case 'weibo':
                    $("#sanquan_weibo_content").empty();
                    drawInternet("sanquan_weibo_content", content.weibo, content.weibo / content.totalcount);
                    break;
                case 'weixin':
                    $("#sanquan_weixin_content").empty();
                    drawInternet("sanquan_weixin_content", content.weixin, content.weixin / content.totalcount);
                    break;
                case 'website':
                    $("#sanquan_website_content").empty();
                    drawInternet("sanquan_website_content", content.website, content.website / content.totalcount);
                    break;
            }
        }
    }

    function drawInternet(id, value, percent) {
        var svg = Snap("#" + id);
        var g = svg.paper.g().attr({
            fill: "#21a3c0",
            stroke: "none"
        });
        var rect1 = g.paper.rect(50, 0, 93, 15, 8, 8).attr({
            stroke: "#09687d",
            strokeWidth: 1,
            fill: "none"
        });
        var length = 15 * percent;
        var x = 58;
        for (var i = 0; i < length; i++) {
            if (i === 0) {
                g.add(g.paper.path("M57,2 A5 5 90 10 57 12"));
            } else if (i === 14) {
                g.add(g.paper.path("M136,2 A5 5 90 1 1 136 12"));
            } else {
                g.add(g.paper.rect(x, 2, 5, 10));
                x += 6;
            }
        }
        g.add(rect1);

        var text = svg.paper.text(150, 10, value).attr({
            fontSize: 10.11,
            fill: "#1bf2f8",
            stroke: "none"
        });

        svg.add(g);
        svg.add(text);
    }

    getResquestUrl(domain + "/data/index/right/data17.json", queryShareAndFetch);
    setInterval(function() {
        getResquestUrl(domain + "/data/index/right/data17.json", queryShareAndFetch);
    }, millisec);


    getResquestUrl(domain + "/data/index/right/data18.json", querySanquan);
});