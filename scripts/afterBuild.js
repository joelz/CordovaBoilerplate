module.exports = function (ctx) {
    
    console.log('\r\n******afterbuild output*******\r\n')

    // make sure android platform is part of build
    if (ctx.opts.platforms.indexOf('android') < 0) {
        return;
    }
    var fs = ctx.requireCordovaModule('fs'),
        path = ctx.requireCordovaModule('path'),
        deferral = ctx.requireCordovaModule('q').defer();

    var platformRoot = path.join(ctx.opts.projectRoot, 'platforms/android');
    var apkFileLocation = path.join(platformRoot, 'build/outputs/apk/debug/android-debug.apk');

    // console.log(platformRoot, apkFileLocation);

    fs.stat(apkFileLocation, function(err,stats) {
        if (err) {
            console.log("error after build");
            deferral.reject('Operation failed');
        } else {
            console.log("****after build js: ");
            console.log('Size of ' + apkFileLocation + ' is ' + stats.size +' bytes');
            deferral.resolve();
        }
    });

    return deferral.promise;
};