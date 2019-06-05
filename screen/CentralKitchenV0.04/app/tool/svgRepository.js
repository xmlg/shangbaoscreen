define(function() {
    var svgRepository = {};
    svgRepository.isReady = false;
    svgRepository.count = 0;
    svgRepository.svgs = {};
    
    svgRepository.addSvg = function(name,url) {
        svgRepository.count++;
        Snap.ajax(url, function(req) {
            svgRepository.svgs[name] = req.responseText;
            svgRepository.count--;
            if(svgRepository.count===0) {
               svgRepository.fn&&svgRepository.fn();
               svgRepository.isReady = true;
            };
        });
    }
    svgRepository.getSvg = function(name) {
        return Snap.parse(svgRepository.svgs[name]);
    }
    svgRepository.ready = function(fn) {
        svgRepository.fn = fn;
        if(svgRepository.isReady) {
            svgRepository.fn();
        }
    }
    svgRepository.addSvg('numberSvg','svg/number.svg');
    svgRepository.addSvg('numberBorderSvg','svg/number-border.svg');
    svgRepository.addSvg('auditInfoPanel','svg/auditInfoPanel.svg');
    svgRepository.addSvg('collector','svg/collector.svg');
    svgRepository.addSvg('galaxy','svg/galaxy.svg');
    svgRepository.addSvg('classifier','svg/classifier.svg');
    svgRepository.addSvg('sharereprot','svg/sharereprot.svg');
    svgRepository.addSvg('numberBorderDoubleSvg','svg/number-border-double.svg');
    return svgRepository;
})