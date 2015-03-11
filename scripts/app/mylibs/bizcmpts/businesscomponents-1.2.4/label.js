var businesscomponents = businesscomponents || {};

businesscomponents.Label = function (opt_html) {
    businesscomponents.CheckBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Label.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.Label, toot.ui.Label);
toot.extendClass(businesscomponents.Label, {

    _init_manageEvents: function () {
        businesscomponents.CheckBox.superClass._init_manageEvents.call(this);
        
    },
    _disable: false,
    _disableClass: "checkboxdisableStyle",
    _enableClass: "",

    setDisableClass: function (className) {
        this._disableClass = className;
    },
    getDisableClass: function () {
        return this._disableClass;
    },
    setEnableClass: function (className) {
        this._enableClass = className;
    },
    getEnableClass: function () {
        return this._enableClass;
    },
    isDisable: function () {
        return this._disable;
    },
    setDisable: function (disable) {
        this._disable = disable;
        this._renderDisable();
    },
    _renderDisable: function () {
        if (this._disable) this._element.className = this._disableClass;
        else this._element.className = this._enableClass;
    }
});
businesscomponents.Label.html = '<span></span>';

