var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.questionZone = businesscomponents.editors.questionZone || {};

businesscomponents.editors.questionZone = function (opt_html) {
    businesscomponents.editors.questionZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.questionZone.html)[0]);
    this._title = new businesscomponents.editors.RichText();
    this._title.replaceTo($(this._element).find('div')[0]);
    this._title.getInitialView().getLbl2().setText(" 题目题干");
    this._title.setConfigFile('/content3/Scripts/ckeditorconfigs/choicequestion.js');

    this._audio = new businesscomponents.editors.Audio();
    this._audio.setMsgBar(this._msgBar);
    this._audio.getInitialView().getLbl2().setText("听力音频");
    this._audio.appendTo($(this._element).find('div')[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.questionZone, toot.view.Item);
toot.extendClass(businesscomponents.editors.questionZone, {
    _init_manageEvents: function () {
        businesscomponents.editors.questionZone.superClass._init_manageEvents.call(this);
    },
    _render: function () {
        businesscomponents.editors.questionZone.superClass._render.call(this);
    },
    getAudio: function () {
        return this._audio;
    },
    updateUIByModel: function () {
        if (!this._model) {
            this._title.setModelAndUpdateUI(null);
            this._audio.setModelAndUpdateUI(null);
            this._audio.setFileName('');

        }
        else {
            this._title.setModelAndUpdateUI(this._model.getTitle());
            this._audio.setModelAndUpdateUI(this._model.getAudioId());
            this._audio.setFileName(this._model.getAudioFileName());
        }
    },
    updateModelByUI: function () {
        if (!this._model) {
            this._model = new models.components.questionZone();
        }

        this._model.setAudioFileName(this._audio.getFileName());
        this._model.setTitle(this._title.updateAndGetModelByUI());
        this._model.setAudioId(this._audio.updateAndGetModelByUI());
    }

});

businesscomponents.editors.questionZone.html = '<div><div></div></div>';
