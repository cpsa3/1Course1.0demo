var businesscomponents = businesscomponents || {};

businesscomponents.Lock = function (opt_html) {
    businesscomponents.Lock.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Lock.html)[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.Lock, toot.ui.Component);
businesscomponents.Lock.html = '<div class="lockMask"></div>';