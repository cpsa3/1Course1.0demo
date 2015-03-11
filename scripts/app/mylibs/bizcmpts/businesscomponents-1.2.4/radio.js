var businesscomponents = businesscomponents || {};

businesscomponents.Radio = function (opt_html) {
    businesscomponents.Radio.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Radio.html)[0]);

    //businesscomponents.RadioGroup 
    this._group = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.Radio, toot.ui.Component);
toot.extendClass(businesscomponents.Radio, {

    _init_manageEvents: function () {
        businesscomponents.Radio.superClass._init_manageEvents.call(this);
        toot.connect(this, "click", this, function () {
            if (this._checked) return;
            var e = { preventDefault: false };
            toot.fireEvent(this, "beforeChange", e);
            if (e.preventDefault) return;
            this.setChecked(!this._checked);
            toot.fireEvent(this, "change");
        })
    },
    _render: function () {
        businesscomponents.Radio.superClass._render.call(this);
        this._renderChecked();
    },


    _checked: false,
    _uncheckedClass: "radioboxStyle",
    _checkedClass: "radioboxStyle2",

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
        if (this._group) {
            if (this._checked)
                this._group.setChecked(this);
            else if (this._group.getChecked() == this)
                this._group.setChecked(null);
        }
    },
    _renderChecked: function () {
        if (this._checked) this._element.className = this._checkedClass;
        else this._element.className = this._uncheckedClass;
    },

    getGroup: function () {
        return this._group;
    },
    setGroup: function (group) {
        if (this._group == group) return;
        var groupBefore = this._group;
        this._group = null;
        if (groupBefore) groupBefore.removeRadio(this);
        this._group = group;
        if (this._group) this._group.addRadio(this);
    }
});
businesscomponents.Radio.html = businesscomponents.Radio.html1 = '<span></span>';


businesscomponents.RadioGroup = function () {
    this._radios = [];
    this._checked = null;
    this._checkedBefore = null;
}
toot.defineEvent(businesscomponents.RadioGroup, ["change", "beforeChange"]);
toot.extendClass(businesscomponents.RadioGroup, {
    getRadios: function () {
        return this._radios;
    },
    getRadioAt: function (idx) {
        if (idx >= 0 && idx < this._radios.length) return this._radios[idx];
        return null;
    },
    getChecked: function () {
        return this._checked;
    },
    getCheckedIndex: function () {
        if (this._checked) return this._radios.indexOf(this._checked);
        else return -1;
    },
    getCheckedBefore: function () {
        return this._checkedBefore;
    },
    getCheckedBeforeIndex: function () {
        if (this._checkedBefore) return this._radios.indexOf(this._checkedBefore);
        else return -1;
    },

    addRadio: function (radio) {
        if (this._radios.indexOf(radio) != -1) return;
        this._radios.push(radio);
        toot.connect(radio, "beforeChange", this, this._onRadioBeforeChange);
        toot.connect(radio, "change", this, this._onRadioChange);
        radio.setGroup(this);

        if (radio.isChecked()) this.setChecked(radio);
    },
    addRadios: function (radios) {
        for (var i = 0, l = radios.length; i < l; i++)
            this.addRadio(radios[i]);
    },
    removeRadio: function (radio) {
        var idx = this._radios.indexOf(radio);
        if (idx == -1) return;
        this._radios.splice(idx, 1);
        toot.disconnect(radio, "beforeChange", this, this._onRadioBeforeChange);
        toot.disconnect(radio, "change", this, this._onRadioChange);
        radio.setGroup(null);

        if (this._checked == radio) this._checked = null;
    },
    removeRadioAt: function (idx) {
        if (idx >= 0 && idx < this._radios.length)
            this.removeRadioAt(idx);
    },
    removeAllRadios: function () {
        for (var i = 0, l = this._radios.length; i < l; i++)
            this.removeRadio(this._radios[i]);
    },

    setChecked: function (radio) {
        if (this._checked == radio) return;
        this._checkedBefore = this._checked;
        var checkedBefore = this._checked;
        this._checked = null;
        if (checkedBefore) checkedBefore.setChecked(false);
        this._checked = radio;
        if (this._checked) this._checked.setChecked(true);
    },
    setCheckedIndex: function (idx) {
        if (idx >= 0 && idx < this._radios.length)
            this.setChecked(this._radios[idx]);
    },

    _onRadioBeforeChange: function (sender, e) {
        var e2 = { preventDefault: false };
        toot.fireEvent(this, "beforeChange", e2);
        e.preventDefault = e2.preventDefault;
    },
    _onRadioChange: function (sender) {
        this.setChecked(sender);
        toot.fireEvent(this, "change");
    }
});


