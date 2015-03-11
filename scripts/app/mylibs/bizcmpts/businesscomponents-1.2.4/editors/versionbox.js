var businesscomponents = businesscomponents || {};


businesscomponents.VersionBox = function (opt_html) {
    businesscomponents.VersionBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.VersionBox.html)[0]);

    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]);
    this._btnSave = new toot.ui.Button($(this._element).find('[gi~="btnSave"]')[0]);
    this._$list = $($(this._element).find('[gi~="list"]')[0]);
    this._$mark = $($(this._element).find('[gi~="mark"]')[0]);

    this._timer = null;
    //    this._zIndex = 100;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.VersionBox, toot.ui.Component);
toot.defineEvent(businesscomponents.VersionBox, "confirm");
toot.extendClass(businesscomponents.VersionBox, {
    _init_manageEvents: function () {
        businesscomponents.VersionBox.superClass._init_manageEvents.call(this);
        toot.connect(this._btnClose, "action", this, this._onBtnCloseAction);
        toot.connect(this._btnSave, "action", this, this._onBtnSaveAction);
    },

    _onBtnCloseAction: function () {
        this.setVisible(false);
    },
    _onBtnSaveAction: function () {
        toot.fireEvent(this, "confirm");
        this.setVisible(false);
    },
    setList: function (data) {
        //清空所有的子项
        for (var i = this._$list.children().length - 1; i >= 0; i--) {
            this._$list.empty();
        }
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var tempItem = "<tr><td>" + data[i].ProjectName + "</td></tr>";
                this._$list.append($(tempItem));
            }
        }
    }
});
businesscomponents.VersionBox.html =
'<div>' +

    ' <div class=" popupDialogBoxOuter popupDialogBoxOuterStyle2" style="z-index:105" >' +
        '<div class="popupDialogHead"> 提醒</div>' +
        '<div class="popupDBTipsbox clearfix" style="height:auto"><em class="popupDBTipsIcon"></em><div class="popupDBTipsText popupDBTipsTextStyle2">' +
            ' 确定要保存吗？<br> 保存修改只会对未来创建的课程、作业、测试生效，不会影响以下现有关联项。<br>你可以重新修改现有的关联项来应用修改后的资料。<br></div></div>' +
        '<div class="TipboxTable copyScroll">' +
            '<table cellpadding="0" cellspacing="0" >' +
                '<tbody gi="list">' +

                    '</tbody>' +
                    '</table>' +
        '</div>' +
        '<div class="popupDialogFoot clearfix">' +
            '<button class="fl btnBack" gi="btnClose">' +
                '取消</button>' +
            '<button class="fr btnNext" gi="btnSave">' +
                '确定</button>' +
        '</div>' +

        '</div>' +
        '<div class="lockMaskFix"  gi="mark"></div>' +
'</div>';