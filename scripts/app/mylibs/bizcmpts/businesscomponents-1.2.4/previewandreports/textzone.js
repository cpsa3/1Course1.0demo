var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.TextZoon = function (opt_html) {
    businesscomponents.previewandreports.TextZoon.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.TextZoon.html)[0]);

    this._lblText = $(this._element).find('[gi~="titleBox"]')[0];

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.TextZoon, toot.ui.Component);
toot.extendClass(businesscomponents.previewandreports.TextZoon, {
    setText: function (title) {
        $(this._lblText).html(title);
    },
    setClass: function (className) {
        $(this._lblText).removeClass("RichTextEditor").addClass(className);
    }
});
businesscomponents.previewandreports.TextZoon.html =
    '<div class="ReportNewQbox"> ' +
        '<div  class="RichTextEditor" gi="titleBox">' +
        '</div>' +
        '</div>';
