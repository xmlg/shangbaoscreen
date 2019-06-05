define(function(require) {
    var Component = require('components/Component');

    var svgRepository = require('tool/svgRepository');
    var dataManager = require('tool/dataManager');

    var GalaxyTitleAtLeft = require('./GalaxyTitleAtLeft');
    var StarBig = require('./StarBig');
    var StarMedium = require('./StarMedium');
    var StarSmall = require('./StarSmall');

    function Galaxy(parent) {
        Component.call(this, parent);

        var self = this;

        this.galaxyTitle = new GalaxyTitleAtLeft(this);
        this.snapElement.append(Snap.parse('<image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="img/galaxyBg.png" style="x: -800;y: -410;width: 1600px;height: 800px;"></image>'));

        this.mediaMap = {};
        this.starMap = {};

        var mediaInRing1 = this.mediaInRing1 = [];
        var mediaInRing2 = this.mediaInRing2 = [];
        var mediaInRing3 = this.mediaInRing3 = [];

        var starInRing1 = this.starInRing1 = [];
        var starInRing2 = this.starInRing2 = [];
        var starInRing3 = this.starInRing3 = [];

        dataManager.getData().JSONDISTRIBUTE.TYPECOUNTS.forEach(function(media) {
            switch (media.QUANTYPE) {
                case '1':
                    mediaInRing1.push(media);
                    self.mediaMap[media.MEDIAID] = media;
                    break;
                case '2':
                    mediaInRing2.push(media);
                    self.mediaMap[media.MEDIAID] = media;
                    break;
                default:
                    mediaInRing3.push(media);
                    self.mediaMap[media.MEDIAID] = media;
                    break;
            }
        });

        var starSetInRing2 = null;

        mediaInRing1.forEach(function(media, i) {
            var r = 81;
            var angle = i * 360 / mediaInRing1.length;
            var ox = r * Math.cos(Math.PI * angle / 180);
            var oy = -r * Math.sin(Math.PI * angle / 180);

            var star = new StarBig(self, media, ox, oy);

            starInRing1.push(star);
            self.starMap[media.MEDIAID] = star;
        });
        var index2 = 0;
        var mediaInRing2Count = 0;
        var hasNotOne = 0;
        mediaInRing2.forEach(function(media, i) {
            if (media.ONE) {
                mediaInRing2Count++
            } else {
                hasNotOne = 1;
            }
        });
        mediaInRing2Count += hasNotOne;
        mediaInRing2.forEach(function(media, i) {
            if (!media.ONE) {
                if (!starSetInRing2) {
                    var r = 158;
                    var angle = index2 * 360 / mediaInRing2Count;
                    var ox = r * Math.cos(Math.PI * angle / 180);
                    var oy = -r * Math.sin(Math.PI * angle / 180);
                    starSetInRing2 = new StarMedium(self, ox, oy);
                    starInRing2.push(starSetInRing2);
                    index2++;
                }
                self.starMap[media.MEDIAID] = starSetInRing2;
            } else {
                var r = 158;
                var angle = index2 * 360 / mediaInRing2Count;
                var ox = r * Math.cos(Math.PI * angle / 180);
                var oy = -r * Math.sin(Math.PI * angle / 180);

                var star = new StarMedium(self, ox, oy);

                starInRing2.push(star);
                self.starMap[media.MEDIAID] = star;
                index2++
            }

        });
        for (var i = 0; i < 12; i++) {
            var r = 228;
            var angle = i * 360 / 12;
            var ox = r * Math.cos(Math.PI * angle / 180);
            var oy = -r * Math.sin(Math.PI * angle / 180);

            starInRing3.push(new StarSmall(self, ox, oy));
        }
        mediaInRing3.forEach(function(media, i) {
            self.starMap[media.MEDIAID] = starInRing3[~~(Math.random() * starInRing3.length)];
        });
    }

    Galaxy.prototype = Object.create(Component.prototype);
    Galaxy.prototype.constructor = Galaxy;
    Galaxy.prototype.init = function() {
        var self = this;

        delay(750, function() {
            $('img.leftButtom').animate({
                opacity: 1
            }, 1000);
            $('.galaxyText').animate({
                opacity: 1,
                display: 'none'
            }, 1000);
        });

        this.initStart();
        this.galaxyTitle.init();

        this.snapElement.append(svgRepository.getSvg('galaxy'));

        var ring01 = this.snapElement.select('#ring01');
        var ring02 = this.snapElement.select('#ring02');
        var ring03 = this.snapElement.select('#ring03');

        ring01.attr({
            transform: 'scale(0)'
        })
        ring02.attr({
            transform: 'scale(0)'
        })
        ring03.attr({
            transform: 'scale(0)'
        })

        ring01.animate({
            transform: 'scale(1)'
        }, 500, function() {
            self.starInRing1.forEach(function(star) {
                star.init();
            });
        });

        delay(250, function() {
            ring02.animate({
                transform: 'scale(1)'
            }, 500, function() {
                self.starInRing2.forEach(function(star) {
                    star.init();
                });
            });
        });

        delay(500, function() {
            ring03.animate({
                transform: 'scale(1)'
            }, 500, function() {
                self.starInRing3.forEach(function(star) {
                    star.init();
                });
            });
        });

        var roate01 = 0;
        var roate02 = 0;
        var roate03 = 0;

        function updatePostion() {
            var matrix1 = new Snap.Matrix(1.0, 0, 0, 0.385, -60, 30);
            var matrix2 = new Snap.Matrix(1.0, 0, 0, 0.385, -60, 30);
            var matrix3 = new Snap.Matrix(1.0, 0, 0, 0.385, -60, 45);

            matrix1.rotate(roate01);
            matrix2.rotate(roate02);
            matrix3.rotate(roate03);

            for (var i = 0; i < self.starInRing1.length; i++) {
                var star = self.starInRing1[i];
                var x = matrix1.x(star.ox, star.oy);
                var y = matrix1.y(star.ox, star.oy);
                star.setPosition(x, y);
            }

            for (var i = 0; i < self.starInRing2.length; i++) {
                var star = self.starInRing2[i];
                var x = matrix2.x(star.ox, star.oy);
                var y = matrix2.y(star.ox, star.oy);
                star.setPosition(x, y);
            }

            for (var i = 0; i < self.starInRing3.length; i++) {
                var star = self.starInRing3[i];
                var x = matrix3.x(star.ox, star.oy);
                var y = matrix3.y(star.ox, star.oy);
                star.setPosition(x, y);
            }
            if (self.star) {
                self.galaxyTitle.setOrigin(self.star.x, self.star.y);
            }
        };
        updatePostion();
        delay(750, function() {
            var queue = new Queue(true);
            queue.runActions([
                function() {
                    Snap.animate(0, 360, function(val) {
                        roate01 = val * 10;
                        roate02 = val * 11;
                        roate03 = val * 12;
                        ring01.attr({
                            transform: 'translate(0,0) rotate(' + roate01 + ')'
                        });
                        ring02.attr({
                            transform: 'translate(0,0) rotate(' + roate02 + ')'
                        });
                        ring03.attr({
                            transform: 'translate(0,0) rotate(' + roate03 + ')'
                        });
                        updatePostion();
                    }, 600 * 1000, queue.run);
                }
            ]);
        });
    }
    Galaxy.prototype.initStart = function() {

    }
    Galaxy.prototype.showGalaxyTitle = function(entry) {
        console.log(entry);
        var self = this;
        if (this.star) {
            this.star.hideName();
        }
        this.star = this.starMap[entry.MEDIAID];

        var value = 1;
        dataManager.getData().JSONDISTRIBUTE.TYPECOUNTS.forEach(function(media) {
            if (media.MEDIAID == entry.MEDIAID) {
                value = media.TOTAL;
            }
        });

        var media = this.mediaMap[entry.MEDIAID];
        this.star.showName(media.MEDIANAME);

        this.galaxyTitle.show();
        this.galaxyTitle.set(media.MEDIANAME, entry.CONTENT, value);

        if (this.showGalaxyTitleInterval) {
            window.clearInterval(this.showGalaxyTitleInterval);
        }
        this.showGalaxyTitleInterval = window.setInterval(function() {
            self.star.hideName();
            self.galaxyTitle.hide();
        }, 10 * 1000);
    };
    return Galaxy;
})
