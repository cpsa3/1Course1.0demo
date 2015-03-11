var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.AddZoneButton = function (opt_html) {
    businesscomponents.editors.AddZoneButton.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.AddZoneButton.html)[0]);

    this._lblName = new toot.ui.Label($(this._element).find('[gi~="lblName"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.AddZoneButton, toot.ui.Button);
toot.extendClass(businesscomponents.editors.AddZoneButton, {

    _init_manageEvents: function () {
        businesscomponents.editors.AddZoneButton.superClass._init_manageEvents.call(this);
    },
    _render: function () {
        businesscomponents.editors.AddZoneButton.superClass._render.call(this);
    },

    setText: function (text) {
        this._lblName.setText(text);
    }
});
businesscomponents.editors.AddZoneButton.html = '<div class="fl"><div class="tagStyle1 font18"><div class="textboxOuter"><div class="textboxInner" gi="lblName"></div></div></div></div>';