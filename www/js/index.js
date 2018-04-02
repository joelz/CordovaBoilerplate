/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var backButtonPressed = false;

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        
        //监听返回键按钮事件
        //document.addEventListener("backbutton", eventBackButton, false);
        document.addEventListener("backbutton", eventAppMinimize, false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

//返回键点击响应
function eventBackButton() {
    if (backButtonPressed){
        exitApp()
    } else {
        //cordova.plugins.LycPlugin.coolMethod("再按一次退出应用");
        window.plugins.toast.showShortTop('再按一次退出应用',
            function (a) { console.log('toast success: ' + a) },
            function (b) { alert('toast error: ' + b) });
        
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