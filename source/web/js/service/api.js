
function UserService() {
    this.userURL = "";
    if (document.location.hostname == "localhost") {
        this.userURL = "service/ConferenceAppWebService.aspx";
    }
    else {
        this.userURL = "http://apps.omnificence.in/MSCM2016/app/service/ConferenceAppWebService.aspx";
    }
}

UserService.prototype = new ServiceBase();

UserService.prototype.getCountries = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "GetCountryList";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);

}
UserService.prototype.createUser = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "CreateUser";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.createNotes = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "CreateUserNotes";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.getNotes = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "GetUserNotes";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.deleteNotes = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "DeleteUserNotes";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.sendUserNotes = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SendUserNotes";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.createQuery = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "CreateQuery";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.submitFeedback = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SubmitFeedback";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.registerWorkshop = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "RegisterWorkshop";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.getRegisteredWorkshop = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "GetRegisteredWorkshop";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.submitPollOption = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SubmitPollOption";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.GetUserNotification = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "GetUserNotification";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.SetUserNotificationRead = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SetUserNotificationRead";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

function RequestHeader(Command, Data) {
    this.Command = Command;
    this.Data = Data;
}

UserService.prototype.submitSurvey = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SubmitSurvey";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.getSurveyResult = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "GetSurveyResult";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.completeSurvey = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SetSurveyComplete";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

UserService.prototype.setUserLogged = function (data, async, callBack) {
    var reqHeader = new RequestHeader();
    reqHeader.Command = "SetUserLogged";
    reqHeader.Data = data;
    return this.ExecuteService(reqHeader, async, callBack);
}

var g_UserService = new UserService();