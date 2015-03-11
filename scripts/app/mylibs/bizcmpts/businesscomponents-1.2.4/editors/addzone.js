var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.AddZone = function (opt_html) {
    businesscomponents.editors.AddZone.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.AddZone.html)[0]);

    this._buttons = [];

//    this._$p1 = $(this._element).find('[gi~="p1"]');
    this._$p2 = $(this._element).find('[gi~="p2"]');
    this._$ctnButtons = $(this._element).find('[gi~="ctnButtons"]');

    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.AddZone, toot.ui.Component);
toot.extendClass(businesscomponents.editors.AddZone, {

    _init_manageEvents: function () {
        businesscomponents.editors.AddZone.superClass._init_manageEvents.call(this);
        var _this = this;
//        this._$p1.bind("mouseenter", function () {
//            _this._buttonsVisible = true;
//            _this._renderButtonsVisible();
//        });
        this._$p2.bind("mouseleave", function () {
//            _this._buttonsVisible = false;
            _this._renderButtonsVisible();
        });
    },

    _render: function () {
        businesscomponents.editors.AddZone.superClass._render.call(this);
        this._renderButtonsVisible();
    },

    addButton: function (btn) {
        this._buttons.push(btn);
        this._$ctnButtons[0].appendChild(btn.getElement());
    },
    addButtons: function (btns) {
        for (var i = 0, l = btns.length; i < l; i++)
            this.addButton(btns[i]);
    },
    getButtons: function () {
        return this._buttons;
    },

    _buttonsVisible: true,
    _renderButtonsVisible: function () {
        if (this._buttonsVisible) {
//            this._$p1.hide();
            this._$p2.show();
        }
        else {
//            this._$p1.show();
            this._$p2.hide();
        }
    }
});
businesscomponents.editors.AddZone.html =
                                     '<div class="taskLayoutbox clearfix">' +
                                       '<div class="tagStyleAdd fl AddTransition" gi="p2">' +
                                         '<div class="fl"><div class="tagStyle1 font36">+</div></div>' +
                                         '<div class="fl transitionStyle" gi="ctnButtons">' +
                                         '</div>' +
                                       '</div>' +
                                     '</div>';
                                      
