
/**
*   Omnificence - 2015
*   Point to interact with server application
*/

function ServiceBase() {
    this.XmlHttp = new XMLHttpRequest();
    this.userURL = "";
    if (document.location.hostname == "localhost") {
        this.userURL = "service/ConferenceAppWebService.aspx";
    }
    else {
        this.userURL = "http://apps.omnificence.in/MSCM2016/app/service/ConferenceAppWebService.aspx";
    }
}

ServiceBase.prototype.ExecuteService = function (PostData, async, callBack) {
    try {
        this.XmlHttp.open("POST", this.userURL, async);
        this.XmlHttp.send(JSON.stringify(PostData));
        this.callback = callBack;

        if (!async) {
            return JSON.parse(this.XmlHttp.responseText);
        }

        else {
            var me = this;
            var timer = window.setInterval(function () {
                if (me.XmlHttp.readyState == 4) {
                    window.clearInterval(timer);
                    if (me.XmlHttp.status != 200) {
                        return;
                    }
                    var Header = JSON.parse(me.XmlHttp.responseText);
                    if (Header.isError) {
                        throw new ServiceException(Header.ErrorCode, Header.ErrorMessage);
                    }
                    var result = Header.Result;
                    window[me.callback](result);
                }
            }, 1000);
        }
    }
    catch (ex) {
        if (ex.code == 19) {
            return false;
        }
        return true;
    }
}

function ServiceException(errorCode, errorMessage) {
    this.errorCode = errorCode;
    this.errorMessage = errorMessage;
}

window.onError = function () {

}

