var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.TranslationZone = function (opt_html) {
    businesscomponents.previewandreports.TranslationZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TranslationZone.html)[0]);

    //    this._lblText = $(this._element).find('[gi~="titleBox"]')[0];

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TranslationZone, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TranslationZone, {
    setQuestions: function (questions) {
        if (questions) {
            for (var i = 0; i < questions.length; i++) {
                var item = new businesscomponents.previewandreports.TranslationZoneItem();
                item.setIndex(i);
                item.setContent(questions[i]);
                item.appendTo(this._element);
            }
        }
    }
});
businesscomponents.previewandreports.TranslationZone.html = '<div class="ReportNewSBox1">' +
    '<div class="ReportNewSBox6"> ' +
        '</div>' +
        '</div>';


businesscomponents.previewandreports.TranslationZoneItem = function (opt_html) {
    businesscomponents.previewandreports.TranslationZoneItem.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TranslationZoneItem.html)[0]);

    this._index = $(this._element).find('[gi~="index"]')[0];
    this._content = $(this._element).find('[gi~="content"]')[0];

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TranslationZoneItem, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TranslationZoneItem, {
    setIndex: function (index) {
        $(this._index).text(index);
    },
    setContent: function (content) {
        $(this._content).text(content);
    }
});
businesscomponents.previewandreports.TranslationZoneItem.html =
    '<div class="clearfix"> ' +
        '<span class="NumStyle"><span gi="index"></span>.</span>' +
        '<span gi="content" class="AboxInner"></span>' +
    '</div>';
