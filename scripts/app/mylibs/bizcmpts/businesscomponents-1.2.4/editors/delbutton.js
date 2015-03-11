var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};


businesscomponents.editors.DelButton = function (opt_html) {
    businesscomponents.editors.DelButton.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.DelButton.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.DelButton, toot.ui.Button);
toot.extendClass(businesscomponents.editors.DelButton, {

    _init_manageEvents: function () {
        businesscomponents.editors.DelButton.superClass._init_manageEvents.call(this);
    },
    //特殊要求，避免覆盖样式里hover by xp
    _renderVisible:function() {
        if (this._visible)
            $(this._element).css("display","");
        else
            $(this._element).hide();
    }
});
