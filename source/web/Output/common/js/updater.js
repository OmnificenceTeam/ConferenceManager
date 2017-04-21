
var isLaunched = localStorage.getItem("isLaunched");

if (isLaunched == undefined) {
    isLaunched = false;
}

var serverUrl = "http://apps.omnificence.in/MSCM2016/admin/service/updateservice.aspx";

var isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
var isBlackBerry = /blackberry/i.test(navigator.userAgent.toLowerCase());
var isiDevice = /ipad|iphone|ipod/i.test(navigator.userAgent.toLowerCase());
var isWindowsPhone = /windows phone/i.test(navigator.userAgent.toLowerCase());

if (isWindowsPhone == true) {
    isAndroid = isBlackBerry = isiDevice = false;
}

// Include css
var head = document.getElementsByTagName('head')[0];
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.media = 'all';

if (isAndroid) {
    link.href = 'css/android.css';
}

else if (isiDevice) {
    link.href = 'css/ios.css';
}

else if (isWindowsPhone) {
    link.href = 'css/windows.css';
}

else {
    link.href = 'css/desktop.css';
}

head.appendChild(link);

$(document).ready(function () {
    window.setTimeout(function () {
        if (isLaunched) {
            $('#updaterTitle').html("Updating ");
            $('#updateProgress').show();
        }
        else {
            $('#updaterTitle').html("Loading ");
            $('#updateProgress').hide();
        }
        $('#updateProcess').show();
        localStorage.setItem("isLaunched", true);
        checkUpdates();
    }, 1000);
});

function checkUpdates() {
    var status = false;
    if (isAndroid) {
        status = androidInterface.isOnline();
        if (status) {
            LoadJSON('version.txt');
        }
        else {
            startApplication();
        }
    }
}

var _FullSize = 0;
var _fileSize = 0;
var index = 0;
var myIntervals = null;
var jsonResult = null;

function setFullSize(size) {
    _FullSize = parseInt(size);
    //alert("Ful = " + _FullSize);
}

function setFileSize(size) {
    //alert("files =" + size);
    _fileSize += parseInt(size);
    //document.getElementById('updateProgress').setAttribute('value', ((_fileSize / _FullSize) * 100));
    if (_FullSize == 0 && _fileSize == 0)
        $('#updateProgress').html('0%');
    else
        $('#updateProgress').html(parseInt(((_fileSize / _FullSize) * 100)) + ' %');
    //document.getElementById('updateProgress').innerHTML(((_fileSize / _FullSize) * 100) + ' %');
    
}

function LoadJSON(url) {
    $.getJSON(url, function (data) {
        var request = new CheckUpdate(data);
        var result = DoService(request, false);
        if ((result.Result).length > 1) {

            var _TotalFiles = (result.Result).length;
            jsonResult = result.Result;

            for (var i = 0; i < _TotalFiles; i++) {
                _FullSize += parseInt(jsonResult[i].size);
            }

            myIntervals = setInterval(function () {
                downloadUpdates(_TotalFiles);
            }, 2000);
        }
        else {
            startApplication();
        }
    });
}

function downloadUpdates(totalFiles) {
    var downloadUrl = null;
    var replaceUrl = null;
    var currentFileSize = 0;

    downloadUrl = jsonResult[index].urlPath;
    replaceUrl = jsonResult[index].relPath;
    currentFileSize = parseInt(jsonResult[index].size);
    androidInterface.DownloadUpdates(downloadUrl, replaceUrl, currentFileSize);

    index += 1;

    if (index == totalFiles) {
        clearInterval(myIntervals);
        myIntervals = null;
        window.setTimeout(function () {
            startApplication();
        }, 500);
    }
}

function startApplication() {
    androidInterface.LoadApplication();
}


function DoService(request, async) {
    try {
        var XmlHttp = new XMLHttpRequest();
        XmlHttp.open("POST", serverUrl, async);
        XmlHttp.send(JSON.stringify(request));

        if (!async) {
            return JSON.parse(XmlHttp.responseText);
        }

        else {
            var timer = window.setInterval(function () {
                if (XmlHttp.readyState == 4) {
                    window.clearInterval(timer);
                    if (XmlHttp.status != 200) {
                        return;
                    }
                    return JSON.parse(XmlHttp.responseText);
                }
            }, 1000);
        }
    }
    catch (ex) {
        return null;
    }
}

function CheckUpdate(data) {
    this.Command = "CheckUpdate"
    this.Data = data;
}