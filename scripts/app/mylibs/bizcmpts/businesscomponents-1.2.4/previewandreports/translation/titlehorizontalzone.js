var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};


businesscomponents.previewandreports.TitlesHorizontalZone = function (opt_html) {
    businesscomponents.previewandreports.TitlesHorizontalZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TitlesHorizontalZone.html)[0]);
    this._title = new businesscomponents.previewandreports.Title();
    this._title.replaceTo($(this._element).find('[gi~="title"]')[0]);
    this._content = $(this._element).find('[gi~="content"]')[0];
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TitlesHorizontalZone, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TitlesHorizontalZone, {
    setTitle: function (title) {
        this._title.setTitle(title);
    },
    setContent: function (content) {
        $(this._content).html(content);
    },
    getContent: function () {
        return this._content;
    },
    setContentClass: function (className) {
        $(this._content).parent().addClass(className);
    }
});
businesscomponents.previewandreports.TitlesHorizontalZone.html =
    '  <div class="ReportNewSBox2 clearfix">' +
        '<h5 class="ReportNewSTitle" gi="title">题目</h5>' +
        '<div class="ReportNewSBox3R">' +
            '<div class="ReportNewSBox6">' +
                '<div gi="content"></div>' +
            '</div>' +
        '</div>' +
    '</div>';
