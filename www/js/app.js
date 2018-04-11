// TODO
// 为什么调用插件功能后都会触发onResume？？


function Success(imageUri) {
    appState.takingPicture = false;
    appState.imageUri = imageUri;
    document.getElementById("get-picture-result").src = imageUri;
    console.log("Success: ");
}

function Failure(error) {
    appState.takingPicture = false;
    console.log("Failure: " + error);
}

function onPause() {
    console.log("onPause: ");
    if (appState.takingPicture || appState.imageUri) {
        window.localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(appState));
    }
}

function onResume(event) {

    console.log("onResume: " + JSON.stringify(event));

    var storedState = window.localStorage.getItem(APP_STORAGE_KEY);
    if (storedState) {
        appState = JSON.parse(storedState);
    }
    if (!appState.takingPicture && appState.imageUri) {
        document.getElementById("get-picture-result").src = appState.imageUri;
    }
    else if (appState.takingPicture && event.pendingResult) {
        if (event.pendingResult.pluginStatus === "OK") {
            Success(event.pendingResult.result);
        } else {
            Failure(event.pendingResult.result);
        }
    }
}

//返回键点击响应
function eventBackButton() {
    if (backButtonPressed) {
        exitApp()
    } else {
        //cordova.plugins.LycPlugin.coolMethod("再按一次退出应用");
        console.log('再按一次退出应用');

        //标记为已点击过一次
        backButtonPressed = true;
        //2秒内没有再次点击返回则将触发标志标记为false
        setTimeout(() => backButtonPressed = false, 3000);
    }
}

//退出程序
function exitApp() {
    navigator.app.exitApp();
}

//返回键点击响应
function eventAppMinimize() {
    window.plugins.appMinimize.minimize();
}


/* 获得app版本,如1.0.0
* @description  对应/AndroidManifest.xml中android:versionCode的值
* @returns {Promise<string>}
*/
function getVersionNumber() {
    return new Promise((resolve) => {
        cordova.getAppVersion.getVersionNumber((version) => {
            resolve(version);
        });
    });
}


/**
 * 获得app版本号,如10000
 * @description  对应/config.xml中version的值转化而来
 * @returns {Promise<string>}
 */
function getVersionCode() {
    return new Promise((resolve) => {
        cordova.getAppVersion.getVersionCode((version) => {
            resolve(version);
        });
    });
}


/**
 * 获得app name,如ionic2_tabs
 * @description  对应/config.xml中name的值
 * @returns {Promise<string>}
 */
function getAppName() {
    return new Promise((resolve) => {
        cordova.getAppVersion.getAppName((value) => {
            resolve(value);
        });
    });
}


/**
 * 获得app包名/id,如com.kit.com
 * @description  对应/config.xml中id的值
 * @returns {Promise<string>}
 */
function getPackageName() {
    return new Promise((resolve) => {
        cordova.getAppVersion.getPackageName((value) => {
            resolve(value);
        })
    });
}



/**
 * 下载安装app
 */
function downloadApp(datas, handle) {
    var fileTransfer = new FileTransfer();
    //服务器apk的下载路径
    var uri = encodeURI('xx/xxx.apk');
    //apk下载后保存的目录
    var fileURL = 'file:///storage/emulated/0/xxx.apk';
    fileTransfer.download(
        uri,
        fileURL,
        function (entry) {
            //下载完成后利用fileOpener2打开安装包
            cordova.plugins.fileOpener2.open(
                fileURL,
                'application/vnd.android.package-archive',
                {
                    error: function () { },
                    success: function () { }
                }
            );
        },
        function (error) {
            alert("请开启储存权限");
        }
    );


    //监听下载过程，你可以让用户看到已下载多少
    fileTransfer.onprogress = function (event) {
        let num = Math.floor(event.loaded / event.total * 100);
        if (num === 100) {
            $.hidePreloader();
        } else {
            let title = $('.modal-title.update');
            if (title.length)
                title.text('已下载：' + num + '%')
            else
                $('.modal-title').text('已下载：' + num + '%');
        }
    }

}


function checkPermit() {
    var permissions = cordova.plugins.permissions;
    var camera = permissions.CAMERA;
    console.log(" checkPermit()");
    permissions.checkPermission(camera, function (status) {
        if (status.hasPermission) {
            console.log("Yes :D ");
        }
        else {
            permissions.requestPermission(camera, success, error);

            function error() {
                console.log('Camera permission is not turned on');
            }

            function success(status) {
                if (!status.hasPermission) error();
            }
        }
    });


    appAvailability.check(
        'com.twitter.android', // Package Name
        function (info) {           // Success callback        
            // Info parameter is available only for android
            console.log('Twitter is available, and it\'s version is ' + info.version);
        },
        function () {           // Error callback
            console.log('Twitter is not available');
        }
    );

}

function startApp() {

    // cordova plugin add com.lampa.startapp

    var uri = "baidumap://map/direction?origin=我的位置&destination=中电软件园";
    var pck = "com.baidu.BaiduMap";//包名
    var sApp = startApp.set({
        "action": "ACTION_VIEW",
        "category": "CATEGORY_DEFAULT",
        "type": "text/css",
        "package": pck,
        "uri": uri,
        "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
        "intentstart": "startActivity",
    }, { /* extras */
            "EXTRA_STREAM": "extraValue1",
            "extraKey2": "extraValue2"
        }
    );

    sApp.start(function () { /* success */
        cordova.plugins.LycPlugin.coolMethod("返回应用");
    }, function (error) { /* fail */
        cordova.plugins.LycPlugin.coolMethod('开启地图出错');
    });

}


function chooseFile() {
    fileChooser.open(callback, callback);

    function callback(uri) { console.log(uri); };
}

// 20180411：没测试
function uploadFile() { 
    //上传服务器地址
    let url = 'https://www.xxx.xxx/csb/upload/';

    fileChooser.open(function (uri) {
        window.resolveLocalFileSystemURL(uri, function (entry) {
            
            var fileURL = entry.toURL();

            //参数，根据项目而定 
            var options = new FileUploadOptions();
            options.fileKey = 'file';
            options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
            options.mimeType = "text/plain";
            var params = {
                value1: 'test',
                value2: 'param'
            };
            options.params = params;
            //执行上传  
            var ft = new FileTransfer();
            console.info(ft);
            //绑定显示上传进度  
            ft.onprogress = function (e) {
                console.info(e);
                if (e.lengthComputable) {
                    $('#button3').text('当前进度：' + e.loaded / e.total)
                }
            };
            //开始上传
            ft.upload(fileURL, encodeURI(url), function (r) {
                console.log("Code = " + r.responseCode);
            }, function (error) {
                console.log("An error has occurred: Code = " + error.code);
            });

        });

    });
};

// 20180411：没测试
function downloadFile() {
    //文件
    var url = 'http://www.xxx.xxx/uploads/hostoperate1.png';
    //下载后存储的地址
    var fileEntry = 'file:///storage/emulated/0/xxx.doc';

    var ft = new FileTransfer();
    var fileURL = fileEntry.toURL();

    //监听下载进度  
    ft.onprogress = function (e) {
        console.info(e);
        if (e.lengthComputable) {
            console.log('当前进度：' + e.loaded / e.total);
        }
    };

    //开始下载
    ft.download(url, fileURL, function (entry) {
        console.log('下载成功');
        console.log('文件位置：' + entry.toURL());
    }, function (err) {
        console.log("下载失败！");
        console.info(err);
    });
   
}

