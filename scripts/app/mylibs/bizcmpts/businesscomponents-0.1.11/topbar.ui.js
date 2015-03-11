var businesscomponents = businesscomponents || {};

businesscomponents.topbar = businesscomponents.topbar || {};

businesscomponents.topbar.ui = {};

businesscomponents.topbar.ui.Topbar = function (opt_html) {
    businesscomponents.topbar.ui.Topbar.superClass.constructor.call(this, $(opt_html === undefined ?
           '<div class="formgroupFIX">' +
//             '<input type="text" class="TEtextstyle1 TEtextW6 fl" placeholder="编号" gi="txtSerialId">' +
             '<input type="text" class="TEtextstyle1 TEtextW7 fl" placeholder="名称" gi="txtName">' +
             '<span class="fl">难度</span>' +
             '<div class="fl starbox"><div gi="z">*****</div></div><input gi="valLevel" type="hidden" />' +
             '<span class="fl">预计耗时：<span class="fontStyle17" gi="lblTotalTime">18分35秒</span></span>' +
    //             '<span class="fl"><input type="checkbox" checked="checked" gi="cbLimitTime"> 限时</span><span class="fl" gi="ctnLimitTimeInput"><input type="text" class="TEtextstyle1 TEtextW5" gi="txtLimitTimeMin" > 分 ' +
    //             '<input type="text" class="TEtextstyle1 TEtextW5" gi="txtLimitTimeSec"> 秒</span>' +
             '<div class="btngroup2">' +
               '<button type="button" class="blackbtn" gi="btnCancel">放弃</button>' +
               '<button type="button" class="greenbtn disablebtn2" gi="btnSave">保存</button>' +
             '</div>' +
           '</div>'
        : opt_html).get(0));

    var _this = this;

//    this._txtSerialId = new toot.ui.TextBox($(this._element).find('[gi="txtSerialId"]').get(0));
    this._txtName = new toot.ui.TextBox($(this._element).find('[gi="txtName"]').get(0));
    this._$valLevel = $(this._element).find('[gi="valLevel"]');
    this._$z = $(this._element).find('[gi="z"]');
    this._lblTotalTime = new toot.ui.Label($(this._element).find('[gi="lblTotalTime"]').get(0));

    //    this._$cbLimitTime = $(this._element).find('[gi="cbLimitTime"]');
    //    this._txtLimitTimeMin = new toot.ui.TextBox($(this._element).find('[gi="txtLimitTimeMin"]').get(0));
    //    this._txtLimitTimeSec = new toot.ui.TextBox($(this._element).find('[gi="txtLimitTimeSec"]').get(0));
    //    this._$ctnLimitTimeInput = $(this._element).find('[gi="ctnLimitTimeInput"]');
    //    this._$cbLimitTime.bind("change", function () {
    //        if (_this._$cbLimitTime.get(0).checked) _this._$ctnLimitTimeInput.show();
    //        else _this._$ctnLimitTimeInput.hide();
    //    });

    this._btnSave = new toot.ui.Button($(this._element).find('[gi="btnSave"]').get(0));
    this._btnSave.setEnabledStyleConfig({ enabled: "greenbtn", disabled: "greenbtn disablebtn2" });
    this._btnCancel = new toot.ui.Button($(this._element).find('[gi="btnCancel"]').get(0));
    this._btnCancel.setEnabledStyleConfig({ enabled: "blackbtn", disabled: "blackbtn disablebtn2" });

    this.updateUIByModel();
};
toot.inherit(businesscomponents.topbar.ui.Topbar, businesscomponents.ui.ComponentBase);
toot.extendClass(businesscomponents.topbar.ui.Topbar, {
    updateUIByModel: function () {
        if (this._model) {
//            this._txtSerialId.setValue(this._model.getSerialId());
            this._txtName.setValue(this._model.getName());
            this._setLevel(this._model.getLevel());
            this.updateUIByModel_totalTime();
            //            this._$cbLimitTime.get(0).checked = this._model.isLimitTimeChecked();
            //            if (this._$cbLimitTime.get(0).checked) this._$ctnLimitTimeInput.show();
            //            else this._$ctnLimitTimeInput.hide();
            //            this._txtLimitTimeMin.setValue(this._model.getLimitTimeMin());
            //            this._txtLimitTimeSec.setValue(this._model.getLimitTimeSec());
        }
        else {
//            this._txtSerialId.setValue(null);
            this._txtName.setValue(null);
            this._setLevel(null);
            this.updateUIByModel_totalTime();
            //            this._$cbLimitTime.get(0).checked = false;
            //            this._$ctnLimitTimeInput.hide();
            //            this._txtLimitTimeMin.setValue(null);
            //            this._txtLimitTimeSec.setValue(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.topbar.model.Topbar();
//        this._model.setSerialId(this._txtSerialId.getValue());
        this._model.setName(this._txtName.getValue());
        this._model.setLevel(parseInt(this._$valLevel.val()));
        //        this._model.setLimitTimeChecked(this._$cbLimitTime.get(0).checked);
        //        this._model.setLimitTimeMin(this._txtLimitTimeMin.getValue());
        //        this._model.setLimitTimeSec(this._txtLimitTimeSec.getValue());
    },
    updateUIByModel_totalTime: function () {
        var totalTime = this._model ? this._model.getTotalTime() : null;
        if (totalTime == null) this._lblTotalTime.setText("未知");
        else if (totalTime == -1) this._lblTotalTime.setText("请正确填写限时");
        else {
            var sec = totalTime % 60;
            var min = (totalTime % 3600 - totalTime % 60) / 60;
            var hr = (totalTime - totalTime % 3600) / 3600;
            this._lblTotalTime.setText(hr + "小时" + min + "分" + sec + "秒");
        }
    },
    _setLevel: function (level) {
        var _this = this;
        this._$valLevel.val(level);
        this._$z.studyplay_star({ MaxStar: 5, CurrentStar: this._$valLevel.val(), Enabled: true }, function (value) { _this._$valLevel.val(value) });
    },

    getBtnSave: function () { return this._btnSave },
    getBtnCancel: function () { return this._btnCancel }

});