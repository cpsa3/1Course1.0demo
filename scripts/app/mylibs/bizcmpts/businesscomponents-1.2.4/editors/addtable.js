//
/*
* 功能:配置表格
* 作者:小潘
* 日期:20130817
* code：businesscomponents.editors.AddTable()
*/


var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.AddTable = function (opt_html) {
    businesscomponents.editors.AddTable.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.AddTable.html)[0]);
    this._iv = new businesscomponents.editors.InitialView();
    this._iv.getLbl1().setText("添加");
    this._iv.getLbl2().setText("表格");
    this._iv.setLayoutboxClass("marB10 NotfilledS4 taskTableEditor");

    this._iv.replaceTo($(this._element).find('[gi~="anchorInitialView"]')[0]);

    this._$editView = $(this._element).find('[gi~="EditView"]');

    this._$rows = $(this._element).find('[gi~="rows"]');

    this._$columns = $(this._element).find('[gi~="columns"]');

    this._rowsTextBox = new toot.ui.TextBox(this._$rows[0]);
    this._rowsTextBox.setValidationHightlightedStyleConfig({ open: "textstyle9_error", closed: "textSytle9" });

    this._columnsTextBox = new toot.ui.TextBox(this._$columns[0]);
    this._columnsTextBox.setValidationHightlightedStyleConfig({ open: "textstyle9_error", closed: "textSytle9" });

    this._rows = null;
    this._colums = null;

    this._inputStyle = "textSytle9 boxStyle1";
    this._inputErrorStyle = "textstyle9_error boxStyle1";

    this._viewState = "Initial";
    //确认
    this._btnSub = new toot.ui.Button($(this._element).find('[gi~="btnSub"]')[0]);

    this._btnCancel = new toot.ui.Button($(this._element).find('[gi~="btnCancel"]')[0]);


    if (this.constructor == arguments.callee) this._init();
};

toot.inherit(businesscomponents.editors.AddTable, businesscomponents.editors.SwitchableView);

toot.extendClass(businesscomponents.editors.AddTable, {
    _init_manageEvents: function () {
        businesscomponents.editors.AddTable.superClass._init_manageEvents.call(this);
        var _this = this;
        toot.connect(this._btnCancel, "action", this, this._onBtnCancelAction);
        //        toot.connect(this._btnSub, "action", this, this._onBtnSubAction);

        this._$rows.focus(function () {
            _this._rowsTextBox.setValidationHightlighted(false);
        });
        this._$columns.focus(function () {
            _this._columnsTextBox.setValidationHightlighted(false);
        });

        toot.connect(this._iv, "click", this, function () {
            this.setViewState("Edit");
        });
    },

    _init: function () {
        this._init_manageEvents();
        this._renderViewState();
    },
    //cancel btn
    _onBtnCancelAction: function () {
        this.setViewState("Initial");
    },

    _validate: function () {

        var state = true;
        if (!this._rows || isNaN(this._rows) || this._rows == 0) {
            this._$rows.attr("class", this._inputErrorStyle);
            state = false;
        }
        if (!this._colums || isNaN(this._rows) || this._colums == 0) {
            this._$columns.attr("class", this._inputErrorStyle);
            state = false;
        }
        return state;
    },
    //    _onBtnSubAction: function () {
    //        this._rows = this._rowsTextBox.getValue();
    //        this._colums = this._columnsTextBox.getValue();
    //        if (this._validate()) {
    //            //添加表格，并隐藏自己
    //            this.setViewState("Hide");
    //
    //
    //        }
    //
    //    },
    _renderViewState: function () {
        if (this._viewState == "Initial") {

            this._rowsTextBox.setValue("");
            this._columnsTextBox.setValue("");

            this._iv.setVisible(true);
            this._$editView.hide();
        }
        else if (this._viewState == "Edit") {
            this._iv.setVisible(false);
            this._$editView.show();
        }
        else if (this._viewState == "Hide") {
            this._iv.setVisible(false);
            this._$editView.hide();
        }
    },
    //--public function
    //设置状态，并改变UI。对应值：Initial（初始），Edit（编辑），Hide（隐藏）
    setViewState: function (state) {
        this._viewState = state;
        this._renderViewState();
    },
    //行数输入框：type:TextBox
    getRowsTextBox: function () {
        return this._rowsTextBox;
    },
    //列数输入框：type:TextBox
    getColumsTextBox: function () {
        return this._columnsTextBox;
    },
    //确定按钮,type:Button
    getBtnSub: function () {
        return this._btnSub;
    },
    //错误样式：type:string
    getErrorStyle: function () {
        return this._inputErrorStyle;
    },
    //验证规则：返回bool值
    getValidate: function () {
        return this._validate();
    }


});




businesscomponents.editors.AddTable.html =
    '<div>' +
        '<div gi="anchorInitialView"></div>' +
    '<div class="marB10 NotfilledS4 taskTableEditor"  gi="EditView">' +
    '<span class="colorGray"><span class="font20">+</span>添加</span><span>表格</span>' +
    '<div class="lockMask"></div>' +
    '<div class="taskTableFormNew" >' +
    '<div class="clearfix">' +
    '<div class="fl">' +
    '<span>行数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="rows">' +
    '</div>' +
    '<div class="fr">' +
    '<span>列数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="columns">' +
    '</div>' +
    '</div>' +
    '<div class="btnGroup3 clearfix">' +
    '<button class="fl btn4Back3" gi="btnCancel">返回</button>' +
    '<button class="fr btn4Next3" gi="btnSub">确认</button>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>';

//            <!-- 错误样式：<input type="text" class="textstyle9_error StyleW6 StyleH1" /> -->
//              <!-- 错误样式：<input type="text" class="textstyle9_error StyleW6 StyleH1" /> -->



businesscomponents.editors.AddTable2 = function (opt_html) {
    businesscomponents.editors.AddTable2.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.AddTable2.html));
    this._groupsTextBox = new toot.ui.TextBox($(this._element).find('[gi~="groups"]')[0]);
    this._cmptGroup = new toot.ui.Component($(this._element).find('[gi~="cmptGroup"]')[0]);
    this._cmptRow = new toot.ui.Component($(this._element).find('[gi~="cmptRow"]')[0]);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.editors.AddTable2, businesscomponents.editors.AddTable);
toot.extendClass(businesscomponents.editors.AddTable2, {
    getGroupsTextBox: function () { return this._groupsTextBox; },
    getCmptGroup: function () { return this._cmptGroup; },
    setCmtpGroupVisible: function (visible) {
        this._cmptGroup.setVisible(visible);
        if (visible)
            this._cmptRow.getElement().className = "fl marL15";
        else
            this._cmptRow.getElement().className = "fr";
    }
});
businesscomponents.editors.AddTable2.html =
    '<div>' +
        '<div gi="anchorInitialView"></div>' +
    '<div class="marB10 NotfilledS4 taskTableEditor"  gi="EditView">' +
    '<span class="colorGray"><span class="font20">+</span>添加</span><span>表格</span>' +
    '<div class="lockMask"></div>' +
    '<div class="taskTableFormNew" >' +
    '<div class="clearfix">' +
    '<div class="fl">' +
    '<span>行数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="rows">' +
    '</div>' +
    '<div class="fl marL15" gi="cmptRow">' +
    '<span>列数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="columns">' +
    '</div>' +
    '<div class="fl marL15" gi="cmptGroup">' +
    '<span>组数</span>' +
    '<input type="text" class="textSytle9 boxStyle1" gi="groups">' +
    '</div>' +
    '</div>' +
    '<div class="btnGroup3 clearfix">' +
    '<button class="fl btn4Back3" gi="btnCancel">返回</button>' +
    '<button class="fr btn4Next3" gi="btnSub">确认</button>' +
    '</div>' +

    '</div>' +
    '</div>' +
    '</div>';