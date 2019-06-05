requirejs.config({
    baseUrl: 'app'
});

require([
    'tool/svgRepository',
    'tool/dataManager',
    'Scene'
], function(
    svgRepository,
    dataManager,
    Scene
) {
    var svgRepositoryReady = false;
    var dataManagerReady = false;
    svgRepository.ready(function() {
        svgRepositoryReady = true;
        if(svgRepositoryReady && dataManagerReady) {
            var scene = new Scene();
            scene.init();
        }
    })
    dataManager.ready(function() {
        dataManagerReady = true;
        if(svgRepositoryReady && dataManagerReady) {
            var scene = new Scene();
            scene.init();
        }
    })
});