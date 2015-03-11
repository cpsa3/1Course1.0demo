var businesscomponents = businesscomponents || {};


businesscomponents.VersionTextBox = function (opt_html) {
    businesscomponents.VersionTextBox.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.VersionTextBox.html)[0]);

    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]);
    this._btnSave = new toot.ui.Button($(this._element).find('[gi~="btnSave"]')[0]);
    this._btnChange = new toot.ui.Button($(this._element).find('[gi~="btnChange"]')[0]);
    this._confirmBox = new businesscomponents.VersionTextConfirmBox();
    this._confirmBox.setVisible(false);
    this._confirmBox.replaceTo($(this._element).find('[gi~="conformBox"]')[0]);
    this._$list = $($(this._element).find('[gi~="list"]')[0]);
    this._$ctnTip = $($(this._element).find('[gi~="ctnTip"]')[0]);
    this._zIndex = 101;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.VersionTextBox, toot.ui.Component);
toot.defineEvent(businesscomponents.VersionTextBox, "confirm");
toot.defineEvent(businesscomponents.VersionTextBox, "confirmLeft");
toot.extendClass(businesscomponents.VersionTextBox, {
    _init_manageEvents: function () {
        businesscomponents.VersionTextBox.superClass._init_manageEvents.call(this);
        toot.connect(this._btnClose, "action", this, this._onBtnCloseAction);
        toot.connect(this._btnSave, "action", this, this._onBtnSaveAction);
        toot.connect(this._btnChange, "action", this, this._onBtnChangeAction);
        toot.connect(this._confirmBox, "confirm", this, this._onBtnConfirmChangeAction);
        toot.connect(this._confirmBox, "cancle", this, this._onBtnConfirmCancleAction);
    },

    _onBtnCloseAction: function () {
        this.setVisible(false);
    },
    _onBtnSaveAction: function () {
        toot.fireEvent(this, "confirm");
        this.setVisible(false);
    },
    _onBtnChangeAction: function () {
        this._confirmBox.setVisible(true);
        this._$ctnTip.hide();
    },
    _onBtnConfirmChangeAction: function () {
        //确认更新
        toot.fireEvent(this, "confirmLeft");
        this.setVisible(false);
    },
    _onBtnConfirmCancleAction: function () {
        this._$ctnTip.show();
    },
    setList: function (data) {
        //清空所有的子项
        for (var i = 0; i < this._$list.children().length; i++) {
            this._$list.empty();
        }
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                var tempItem = "<tr><td>" + data[i].ProjectName + "</td></tr>";
                this._$list.append($(tempItem));
            }
        }

    },
    getListCtn: function () {
        return this._$ctnTip;
    }
});
businesscomponents.VersionTextBox.html =
    '<div >' +
        ' <div gi="ctnTip" class="popupDialogBoxOuter popupDialogBoxOuterStyle3"  style="z-index:105;">' +
            '<div class="popupDialogHead"> 提醒</div>' +
            '<div class="popupDBTipsbox clearfix" style="height:auto">' +
                '<em class="popupDBTipsIcon"></em>' +
                '<div class="popupDBTipsText popupDBTipsTextStyle3">' +
                    '是否同时更新该资料的关联项？<br>' +
                    '选择“更新关联项”，本次修改将对以下全部关联内容生效，包括学员已经完成的内容和报告，且更新后不能恢复。如果修改内容会对学员理解题目和查看报告产生困扰，请勿选择此项。<br>' +
                    '选择“不更新关联项，仅保存”，保存修改只会对未来创建的课程、作业、测试生效，不会影响以下现有关联项。你可以重新修改现有的关联项来应用修改后的资料。' +
                '</div>' +
            '</div>' +
            '<div class="TipboxTable copyScroll" >' +
                '<table cellpadding="0" cellspacing="0">' +
                    '<tbody gi="list">' +
                    '</tbody>' +
                '</table>' +
            '</div>' +
            '<div class="popupDialogFoot clearfix">' +
                '<button class="fl btnBack" gi="btnClose" >' +
                    '取消</button>' +
                '<button class="fr btnNext" gi="btnChange" style="width:68px" >' +
                    '更新关联项</button>' +
                '<button class="fr btnNext btnNextStyle2" gi="btnSave" >' +
                    '不更新关联项，仅保存</button>' +
            '</div>' +
            '</div>' +
            '<div gi="conformBox"></div>' +
            '<div class="lockMaskFix"  gi="mark"></div>' +
        '</div>';