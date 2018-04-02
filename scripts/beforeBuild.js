module.exports = function (ctx) {
    if (ctx.opts.platforms.indexOf('android') < 0) return;

    var exec = ctx.requireCordovaModule('child_process').exec,
        fs = ctx.requireCordovaModule('fs'),    
        path = ctx.requireCordovaModule('path'),    
        deferral = ctx.requireCordovaModule('q').defer();

    console.log('\r\n******beforebuild output*******\r\n')
    deferral.resolve();
    console.log('\r\n******beforebuild output end*******\r\n')

    return deferral.promise;
};