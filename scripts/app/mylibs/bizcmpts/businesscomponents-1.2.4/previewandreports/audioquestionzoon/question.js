var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.audioQuestionZoon = businesscomponents.previewandreports.audioQuestionZoon || {};

businesscomponents.previewandreports.audioQuestionZoon = function (opt_html) {
    businesscomponents.previewandreports.audioQuestionZoon.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.audioQuestionZoon.html)[0]);
    this._title = $(this._element).find('[gi~="title"]')[0];
    this._audio = new businesscomponents.previewandreports.Audio();
    this._audio.replaceTo($(this._element).find('[gi~="player"]')[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.audioQuestionZoon, toot.view.Item);
toot.extendClass(businesscomponents.previewandreports.audioQuestionZoon, {
    _init_manageEvents: function () {
        businesscomponents.previewandreports.audioQuestionZoon.superClass._init_manageEvents.call(this);
    },
    _render: function () {
        businesscomponents.previewandreports.audioQuestionZoon.superClass._render.call(this);
    },
    getAudio: function () {
        return this._audio;
    },
    updateUIByModel: function () {
        if (!this._model) {
            return;
        }
        if (this._model && this._model.getChannelQ())
            $(this._title).html(this._model.getChannelQ().getTitle());
        else
            $(this._title).html(null);
        //预览和网页报告是要考虑音频播放的
        if (this._model.getRenderingType() == models.previewandreports.RenderingType.Preview || this._model.getRenderingType() == models.previewandreports.RenderingType.WebReprot || this._model.getRenderingType() == models.previewandreports.RenderingType.DisplayFinish) {
            if (this._model && this._model.getChannelQ()) {
                //                if (this._model.getChannelQ().getAudioId()) {
                this._audio.setRenderModel(0);
                this._audio.setAudioId(this._model.getChannelQ().getAudioId());
                this._audio.renderPlayer();
                //                }
            }
        }
        else {
            this._audio.setRenderModel(1);
            this._audio.renderPlayer();
        }
    }
});

businesscomponents.previewandreports.audioQuestionZoon.html =
            '<div class="ReportNewQbox">' +
                 '<div class="QboxInner2  RichTextEditor " gi="title"></div>' +
                 '<div class="AudioBox" gi="player"></div>' +
            '<div>';
businesscomponents.previewandreports.audioQuestionZoon.htmlIeltsListening =
            '<div class="ReportNewQbox">' +
                 '<div class="AudioBox" gi="player"></div>' +
                 '<div class="RichTextEditor" gi="title"></div>' +

            '<div>';