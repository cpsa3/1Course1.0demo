var businesscomponents = businesscomponents || {};

businesscomponents.AutoHeightTextBox = function (element, jq) {
    businesscomponents.AutoHeightTextBox.superClass.constructor.call(this, element);
    this._$ = jq !== undefined ? jq : $;
    if (this._element.nodeName.toLowerCase() != "textarea")
        throw "wrong element type";
    this._$(element).autosize();

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.AutoHeightTextBox, toot.ui.TextBox);
toot.extendClass(businesscomponents.AutoHeightTextBox, {

    _render: function () {
        businesscomponents.AutoHeightTextBox.superClass._render.call(this);
        this._renderMinHeight();
    },

    _minHeight: 20,
    setMinHeight: function (minHeight) {
        this._minHeight = minHeight;
        this._renderMinHeight();
    },
    getMinHeight: function () {
        return this._minHeight;
    },
    _renderMinHeight: function () {
        this._element.style.minHeight = this._minHeight + "px";
    }
});
