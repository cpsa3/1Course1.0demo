var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.Title = function (opt_html) {
    businesscomponents.previewandreports.Title.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.Title.html)[0]);

    this._lblTitle = new toot.ui.Label(this._element);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.Title, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.Title, {
    setTitle: function (title) {
        $(this._element).html(title);
    }
});
businesscomponents.previewandreports.Title.html =
    '<h5 class="AnswerBoxTitle1" gi="item"></h5>';


businesscomponents.previewandreports.Titles = function (opt_html) {
    businesscomponents.previewandreports.Titles.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.Titles.html)[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.Titles, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.Titles, {
    setTitles: function (titles) {
        for (var i = 0; i < titles.length; i++) {
            var title = new businesscomponents.previewandreports.Title();
            title.setTitle(titles[i]);
            $(this._element).append(title.getElement());
        }
    }
});
businesscomponents.previewandreports.Titles.html =
    '  <div >' +
        '</div>';
