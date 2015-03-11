var businesscomponents = businesscomponents || {};

businesscomponents.questionZone = businesscomponents.questionZone || {};

businesscomponents.questionZone.model = function () {
    this._audioId = null;
    this._audioFileName = null;
    this._title = null;
};
toot.extendClass(businesscomponents.questionZone.model, {
    getAudioId: function () { return this._audioId; },
    setAudioId: function (audioId) { this._audioId = audioId; },
    getAudioFileName: function () { return this._audioFileName; },
    setAudioFileName: function (audioFileName) { this._audioFileName = audioFileName; },
    getTitle: function () { return this._title; },
    setTitle: function (title) { this._title = title; }
});


businesscomponents.questionZone.model.parse = function (obj) {
    if (obj == null) return null;

    var result = new businesscomponents.questionZone.model();
    result.setAudioId(obj._audioId);
    result.setTitle(obj._title);
    result.setAudioFileName(obj._audioFileName);
    return result;
};