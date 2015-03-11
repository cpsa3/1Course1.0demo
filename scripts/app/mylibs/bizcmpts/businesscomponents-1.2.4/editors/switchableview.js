var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.SwitchableView = function (element) {
    businesscomponents.editors.SwitchableView.superClass.constructor.call(this, element);
};
toot.inherit(businesscomponents.editors.SwitchableView, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.SwitchableView, {
    _viewState: businesscomponents.editors.ViewState.Initial,
    getViewState: function () {
        return this._viewState;
    },
    _setViewStateUI: function () {
    }
});
