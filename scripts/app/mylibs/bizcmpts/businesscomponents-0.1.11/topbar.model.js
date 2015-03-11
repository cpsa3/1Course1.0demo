var businesscomponents = businesscomponents || {};

businesscomponents.topbar = businesscomponents.topbar || {};

businesscomponents.topbar.model = {};

businesscomponents.topbar.model.Topbar = function () {
//    this._serialId = null;
    this._name = null;
    this._level = 0;
    this._totalTime = null; // int? type -1表示填写有问题
    //    this._limitTimeChecked = false;
    //    this._limitTimeMin = null;
    //    this._limitTimeSec = null;
};
toot.extendClass(businesscomponents.topbar.model.Topbar, {
//    getSerialId: function () { return this._serialId },
//    setSerialId: function (serialId) { this._serialId = serialId },
    getName: function () { return this._name },
    setName: function (name) { this._name = name },
    getLevel: function () { return this._level },
    setLevel: function (level) { this._level = level },
    getTotalTime: function () { return this._totalTime },
    setTotalTime: function (totalTime) { this._totalTime = totalTime }
    //    isLimitTimeChecked: function () { return this._limitTimeChecked },
    //    setLimitTimeChecked: function (checked) { this._limitTimeChecked = checked },
    //    getLimitTimeMin: function () { return this._limitTimeMin },
    //    setLimitTimeMin: function (min) { this._limitTimeMin = min },
    //    getLimitTimeSec: function () { return this._limitTimeSec },
    //    setLimitTimeSec: function (sec) { this._limitTimeSec = sec }
});
