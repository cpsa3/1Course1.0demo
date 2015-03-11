var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.PlainText = function (opt_html, opt_html_initialview) {
    businesscomponents.editors.PlainText.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.PlainText.html)[0]);

    this._iv = new businesscomponents.editors.TextInitialView(opt_html_initialview);
    this._iv.setHeight(this._minHeight);
    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);

    this._txt = new toot.ui.TextBox($(this._element).find('[gi~="txt"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.PlainText, businesscomponents.editors.SwitchableView);
toot.extendClass(businesscomponents.editors.PlainText, {

    _init_manageEvents: function () {
        businesscomponents.editors.RichText.superClass._init_manageEvents.call(this);

        var _this = this;
        toot.connect(this._iv, "click", this, function () {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();
            this._txt.setFocused(true);
        });
        $(this._txt.getElement()).bind("blur", function () {
            if (!_this._txt.getValue()) {
                _this._viewState = businesscomponents.editors.ViewState.Initial;
                _this._renderViewState();
            }
        });
    },

    _render: function () {
        businesscomponents.editors.RichText.superClass._render.call(this);
        this._renderMinHeight();
    },


    _minHeight: 50,
    getMinHeight: function () {
        return this._minHeight;
    },
    setMinHeight: function (minHeight) {
        this._minHeight = minHeight;
        this._renderMinHeight();
    },
    _renderMinHeight: function () {
        this._txt.getElement().style.height = this._minHeight + "px";
        this._iv.setHeight(this._minHeight);
    },

    getInitialView: function () {
        return this._iv;
    },

    updateUIByModel: function () {
        if (this._model) {
            this._viewState = businesscomponents.editors.ViewState.Edit;
            this._renderViewState();
            this._txt.setValue(this._model);
        } else {
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
            this._txt.setValue(this._model);
        }
    },
    updateModelByUI: function () {
        if (this._viewState == businesscomponents.editors.ViewState.Initial) this._model = null;
        else if (this._viewState == businesscomponents.editors.ViewState.Edit) this._model = this._txt.getValue();
    },
    _renderViewState: function () {
        var _this = this;

        if (this._viewState == businesscomponents.editors.ViewState.Initial) {
            this._iv.setVisible(true);
            this._txt.setVisible(false);
        } else if (this._viewState == businesscomponents.editors.ViewState.Edit) {
            this._iv.setVisible(false);
            this._txt.setVisible(true);
        }
    }

});
businesscomponents.editors.PlainText.html =
    '<div>' +
    '<div gi="anchorInitialView"></div>' +
    '​<textarea class="marB10 textareastyle2 boxStyle4" gi="txt"></textarea>' +
    '</div>';

