var businesscomponents = businesscomponents || {};

businesscomponents.RichTextDisplay = function (opt_html) {
    businesscomponents.RichTextDisplay.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.RichTextDisplay.html)[0]);

    var $target = $(this._element).find('[gi~="ctn"]');
    this._elementCtn = $target.length > 0 ? $target[0] : this._element;
}
toot.inherit(businesscomponents.RichTextDisplay, toot.ui.Component);
toot.extendClass(businesscomponents.RichTextDisplay, {
    setHtml: function (html) {
        //fix ie8 innerHTML  show 'null' 
        this._elementCtn.innerHTML = html||'';
    }
});

businesscomponents.RichTextDisplay.html = '<div></div>';

businesscomponents.RichTextDisplay.html1 = '<div class="RichTextEditor"></div>';

businesscomponents.RichTextDisplay.html2 = '<div class="RichTextEditor marB15"></div>';