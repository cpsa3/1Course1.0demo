//
/*
* 功能:批改头部
* 作者:小潘
* 日期:20130731
*/
businesscomponents.correctors.Topbar = function(opt_html) {
    businesscomponents.correctors.Topbar.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.correctors.Topbar.html)[0]);

    this._txtName = new toot.ui.Label($(this._element).find('[gi~="txtName"]')[0]);
    this._useTime = new toot.ui.Label($(this._element).find('[gi~="useTime"]')[0]);
    this._btnCancel = new toot.ui.Button($(this._element).find('[gi~="btnCancel"]')[0]);
    this._btnSave = new toot.ui.Button($(this._element).find('[gi~="btnSave"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.correctors.Topbar, toot.view.ViewBase);
toot.extendClass(businesscomponents.correctors.Topbar, {
   
    getTxtName: function() { return this._txtName; },
    getUseTime: function() { return this._useTime; },
    getBtnCancel: function() { return this._btnCancel; },
    getBtnSave: function() { return this._btnSave; }
});
businesscomponents.correctors.Topbar.html = '<div class="taskTopToolbarOuter" style="z-index:2147483584">' +
    '<dl class="taskTopToolbar clearfix">' +
    '<dd class="Item6 font18" gi="txtName"></dd>' +
    
    '<dd class="Item5 clearfix">' +
    '<button class="btnCancel1" gi="btnCancel">取消</button>' +
    '<button class="btnSave1" gi="btnSave">保存</button>' +
    '</dd>' +
    '<dd class="Item7" >' +
    '<span class="fr" gi="useTime"></span>' +
    '</dd>' +
    '</dl>' +
    '</div>';

 