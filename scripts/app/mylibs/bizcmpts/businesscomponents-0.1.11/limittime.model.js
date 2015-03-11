var businesscomponents = businesscomponents || {};

businesscomponents.limittime = businesscomponents.limittime || {};

businesscomponents.limittime.model = businesscomponents.limittime.model || {};

businesscomponents.limittime.model.Item = function () {
    this._limitTimeChecked = false;
    this._limitTimeMin = null;
    this._limitTimeSec = null;
};
toot.extendClass(businesscomponents.limittime.model.Item, {
    isLimitTimeChecked: function () { return this._limitTimeChecked },
    setLimitTimeChecked: function (checked) { this._limitTimeChecked = checked },
    getLimitTimeMin: function () { return this._limitTimeMin },
    setLimitTimeMin: function (min) { this._limitTimeMin = min },
    getLimitTimeSec: function () { return this._limitTimeSec },
    setLimitTimeSec: function (sec) { this._limitTimeSec = sec }
});

