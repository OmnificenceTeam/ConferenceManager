

function LocalStorageCore() {
    this.localData = {};
    this.version = "1.0";
    this.loadInitialData();
}

LocalStorageCore.prototype.getVersion = function () {
    return this.version;
}

LocalStorageCore.prototype.incrementVersion = function () {
    return this.version;
}

LocalStorageCore.prototype.loadData = function (tag) {
    var data = localStorage.getItem("ApplicationData");
    if ((data != "") && (data != null)) {
        data = JSON.parse(data);
        return data.localData[tag];
    }
}

LocalStorageCore.prototype.saveData = function (tag, data) {
    this.localData[tag] = data;
    localStorage.setItem("ApplicationData", JSON.stringify(this));
}

LocalStorageCore.prototype.deleteData = function () {
    localStorage.removeItem("ApplicationData");
}

LocalStorageCore.prototype.isDataExists = function (tag) {
    if (this.localData[tag] != undefined)
        return true;
    else
        return false;
}


LocalStorageCore.prototype.haveToUpdate = function (tag) {
    // implement have to updated logic
}

LocalStorageCore.prototype.loadInitialData = function () {
    for (var index = 0; index < _gtags.length ; index++) {
        var data = localStorage.getItem("ApplicationData");
        if ((data != "") && (data != null)) {
            data = JSON.parse(data);
            this.localData[_gtags[index]] = data.localData[_gtags[index]];
        }
    }
}


var _gtags = ["login"];

var _glocalStorage = new LocalStorageCore();


