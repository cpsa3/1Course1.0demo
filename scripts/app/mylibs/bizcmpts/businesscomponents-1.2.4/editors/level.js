var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.Level = function (opt_html) {
    businesscomponents.editors.Level.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.Level.html)[0]);

    this._model = 0;
    this._lblName = new toot.ui.Label($(this._element).find('[gi~="lblName"]')[0]);
    this._lblName.setText("难度");
    this._$z = $(this._element).find('[gi~="z"]');

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.Level, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.Level, {
    updateUIByModel: function () {
        var _this = this;
        this._$z.studyplay_star({ MaxStar: 5, CurrentStar: _this._model, StarWidth: 20, Enabled: true }, function (value) { _this._model = value });
    },

    getLblName: function () { return this._lblName }
});
businesscomponents.editors.Level.html = '<dd class="Item3"><span class="fl" gi="lblName"></span><div class="taskTBstarbox" gi="z"></div></dd>';