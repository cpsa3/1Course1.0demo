var businesscomponents = businesscomponents || {};

businesscomponents.CheckBox = function (opt_html) {
    businesscomponents.CheckBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.CheckBox.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.CheckBox, toot.ui.Component);
toot.extendClass(businesscomponents.CheckBox, {

    _init_manageEvents: function () {
        businesscomponents.CheckBox.superClass._init_manageEvents.call(this);
        toot.connect(this, "click", this, function () {
            if (this._disable) return;
            var e = { preventDefault: false };
            toot.fireEvent(this, "beforeChange", e);
            if (e.preventDefault) return;
            this.setChecked(!this._checked);
            toot.fireEvent(this, "change");
        })
    },
    _render: function () {
        businesscomponents.CheckBox.superClass._render.call(this);
        this._renderChecked();
    },


    _checked: false,
    _uncheckedClass: "checkboxStyle",
    _checkedClass: "checkboxStyle2",
    _disable: false,
    _disableClass: "checkboxStyle",

    getUncheckedClass: function () {
        return this._uncheckedClass;
    },
    setUncheckedClass: function (className) {
        this._uncheckedClass = className;
        this._renderChecked();
    },
    getCheckedClass: function () {
        return this._checkedClass;
    },
    setCheckedClass: function (className) {
        this._checkedClass = className;
        this._renderChecked();
    },

    isChecked: function () {
        return this._checked;
    },
    setChecked: function (checked) {
        if (this._checked == checked) return;
        this._checked = checked;
        this._renderChecked();
    },
    _renderChecked: function () {
        if (this._checked) this._element.className = this._checkedClass;
        else this._element.className = this._uncheckedClass;
    },
    setDisableClass: function (className) {
        this._disableClass = className;
    },
    getDisableClass: function () {
        return this._disableClass;
    },
    isDisable: function () {
        return this._disable;
    },
    setDisable: function (disable) {
        this._disable = disable;
        this._checked = false;
        this._renderDisable();
    },
    _renderDisable: function () {
        if (this._disable) this._element.className = this._disableClass;
        else  this._element.className = this._uncheckedClass;


    }
});
businesscomponents.CheckBox.html = businesscomponents.CheckBox.html1 = '<span></span>';

