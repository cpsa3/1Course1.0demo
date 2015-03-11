var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.LimitTimeItem = function (opt_html) {
    businesscomponents.editors.LimitTimeItem.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.LimitTimeItem.html)[0]);

    this._cbLimitTime = new businesscomponents.CheckBox(); this._cbLimitTime.replaceTo($(this._element).find('[gi~="anchorCheckbox"]')[0]);
    this._cbLimitTime.setUncheckedClass("checkboxStyle3");
    this._cbLimitTime.setCheckedClass("checkboxStyle4");
    this._txtMin = new toot.ui.TextBox($(this._element).find('[gi~="txtMin"]')[0]);
    this._txtSec = new toot.ui.TextBox($(this._element).find('[gi~="txtSec"]')[0]);
    this._$ctnTexts = $(this._element).find('[gi~="ctnTexts"]');
    this._lblName = new toot.ui.Label($(this._element).find('[gi~="lblName"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.LimitTimeItem, toot.view.Item);
toot.extendClass(businesscomponents.editors.LimitTimeItem, {
    _init_manageEvents: function () {
        businesscomponents.editors.LimitTimeItem.superClass._init_manageEvents.call(this);
        toot.connect(this._cbLimitTime, "change", this, this._onCBLimitTimeChange);
        toot.connect([this._cbLimitTime, this._txtMin, this._txtSec], "change", this, function () {
            this.updateModelByUI();
            toot.fireEvent(this, "change");
        });
    },

   

    getLblName: function () {
        return this._lblName;
    },

    updateUIByModel: function () {
        if (this._model) {
            this._cbLimitTime.setChecked(true);
            this._$ctnTexts.show();
            this._txtMin.setValue((this._model - this._model % 60) / 60 + "");
            this._txtSec.setValue(this._model % 60 == 0 ? "" : (this._model % 60) + "");
        }
        else if (isNaN(this._model)) {
            this._cbLimitTime.setChecked(true);
            this._renderChecked();
        }
        else {
            this._cbLimitTime.setChecked(false);
            this._renderChecked();
        }
    },
    updateModelByUI: function () {
        if (this._cbLimitTime.isChecked()) {
            var min = $.trim(this._txtMin.getValue()) == "" ? 0 : parseInt(this._txtMin.getValue());
            var sec = $.trim(this._txtSec.getValue()) == "" ? 0 : parseInt(this._txtSec.getValue());
            //sec min 不能同时为0
            if (sec >= 0 && sec <= 59 && min >= 0 && !(sec == 0 && min == 0)) this._model = min * 60 + sec;
            else this._model = NaN;
        }
        else
            this._model = null;
    },
    _onCBLimitTimeChange: function (sender) {
        this._renderChecked();
    },
    _renderChecked: function () {
        if (this._cbLimitTime.isChecked()) this._$ctnTexts.show();
        else this._$ctnTexts.hide();
    }
});
businesscomponents.editors.LimitTimeItem.html =
         '<table><tr><td><span gi="anchorCheckbox"></span></td><td gi="lblName"></td><td gi="ctnTexts"><input type="text" class="textstyle3" gi="txtMin"></td><td gi="ctnTexts">分</td><td gi="ctnTexts"><input type="text" class="textstyle3" gi="txtSec"></td><td gi="ctnTexts">秒</td></tr></table>';



businesscomponents.editors.TimeInput = function (opt_html) {
    businesscomponents.editors.TimeInput.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.TimeInput.html)[0]);

    this._lblTotalTime = new toot.ui.Label($(this._element).find('[gi~="lblTotalTime"]')[0]);
    this._btnSwitch = new toot.ui.Button($(this._element).find('[gi~="btnSwitch"]')[0]);
    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="listLimitTimes-btnClose"]')[0]);

    var elementListLimitTimes = $(this._element).find('[gi~="listLimitTimes"]')[0];
    this._listLimitTimes = new toot.view.List(elementListLimitTimes, elementListLimitTimes,
                     businesscomponents.editors.LimitTimeItem, null, [this._btnClose.getElement()]);
    this._listLimitTimes.setDefaultModelGenerator(function () {
        return null;
    });
    this._listLimitTimes.setElementInsertBefore(this._btnClose.getElement());

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.TimeInput, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.TimeInput, "listLimitTimesVisibleChange");
toot.extendClass(businesscomponents.editors.TimeInput, {

    _init_manageEvents: function () {
        businesscomponents.editors.TimeInput.superClass._init_manageEvents.call(this);
        toot.connect(this._btnSwitch, "action", this, this._onBtnSwitchAction);
        toot.connect(this._btnClose, "action", this, this._onBtnCloseAction);
        toot.connect(this._listLimitTimes, "change", this, this._onListLimitTimesChange);
    },

    _init_render: function () {
        businesscomponents.editors.TimeInput.superClass._init_render.call(this);
        this._listLimitTimes.setVisible(false);
    },


    updateUIByModel: function () {
        if (this._model) {
            this._listLimitTimes.setModelAndUpdateUI(this._model.getLimitTimes());
            if (this._model.getTotalTime() == null) this._lblTotalTime.setText("未知");
            else if (isNaN(this._model.getTotalTime())) this._lblTotalTime.setText("请正确填写限时");
            else {
                var totalTime = this._model.getTotalTime();
                var sec = totalTime % 60;
                var min = (totalTime % 3600 - totalTime % 60) / 60;
                var hr = (totalTime - totalTime % 3600) / 3600;
                this._lblTotalTime.setText(hr + "小时" + min + "分" + sec + "秒");
            }
        }
        else {
            this._listLimitTimes.setModelAndUpdateUI(null);
            this._lblTotalTime.setText("未知");
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.editors.TimeInput.Model();
        this._model.setLimitTimes(this._listLimitTimes.getModel());
    },
    _onBtnSwitchAction: function () {
        this._listLimitTimes.setVisible(!this._listLimitTimes.isVisible());
        toot.fireEvent(this, "listLimitTimesVisibleChange");
    },
    _onBtnCloseAction: function () {
        this._listLimitTimes.setVisible(false);
    },
    _onListLimitTimesChange: function () {
        this.updateModelByUI();
        this.updateUIByModel();
    },

    getListLimitTimes: function () { return this._listLimitTimes; }
});
businesscomponents.editors.TimeInput.html = '<dd class="Item4">' +
                                              '<div class="taskTBtimer">' +
                                                '<span class="fl">耗时</span>' +
                                                '<span class="fl taskTBTotalTime" gi="lblTotalTime">未知</span>' +
                                                '<span class="fl"><button class="btnTimer" gi="btnSwitch" style="cursor: pointer"></button></span>' +
                                              '</div>' +
                                              '<div class="taskTBtimerOpen" gi="listLimitTimes">' +
                                                '<div class="taskTBtimerClose" gi="listLimitTimes-btnClose"></div>' +
                                              '</div>' +
                                            '</dd>';
businesscomponents.editors.TimeInput.Model = function () {
    this._limitTimes = null;
};
toot.extendClass(businesscomponents.editors.TimeInput.Model, {
    getLimitTimes: function () {
        return this._limitTimes;
    },
    setLimitTimes: function (limitTimes) {
        this._limitTimes = limitTimes;
    },
    getTotalTime: function () {
        if (this._limitTimes) {
            var totalTime = 0;
            var allNull = true;
            for (var i = 0, l = this._limitTimes.length; i < l; i++) {
                if (this._limitTimes[i] != null) allNull = false;
                totalTime += this._limitTimes[i];
            }
            return allNull ? null : totalTime;
        }
        else
            return null;
    }
});




businesscomponents.editors.Topbar = function (opt_html) {
    businesscomponents.editors.Topbar.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.Topbar.html)[0]);

    this._lblName = new toot.ui.Label($(this._element).find('[gi~="lblName"]')[0]);
    this._txtName = new toot.ui.TextBox($(this._element).find('[gi~="txtName"]')[0]);
    this._txtNum = new toot.ui.TextBox($(this._element).find('[gi~="txtNum"]')[0]);
    this._txtName.setValidationHightlightedStyleConfig({ open: "textstyle1_error", closed: "textstyle1" });
    this._txtNum.setValidationHightlightedStyleConfig({ open: "textstyle1_error", closed: "textstyle1" });
    this._level = new businesscomponents.editors.Level(); this._level.replaceTo($(this._element).find('[gi~="anchorLevel"]')[0]);
    this._timeInput = new businesscomponents.editors.TimeInput(); this._timeInput.replaceTo($(this._element).find('[gi~="anchorTimeInput"]')[0]);

    this._btnPreview = new toot.ui.Button($(this._element).find('[gi~="btnPreview"]')[0]); // this._btnPreview.setVisible(false);
    this._btnCancel = new toot.ui.Button($(this._element).find('[gi~="btnCancel"]')[0]);
    this._btnSave = new toot.ui.Button($(this._element).find('[gi~="btnSave"]')[0]);
    this._btnSave.setEnabledStyleConfig({ enabled: "btnSave1", disabled: "btnSave1 btnSave1Dis" })

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.Topbar, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.Topbar, {

    _zIndex: 20000,

    updateUIByModel: function () {
        if (this._model) {
            this._txtName.setValue(this._model.getName());
            this._level.setModelAndUpdateUI(this._model.getLevel());
            this._timeInput.setModelAndUpdateUI(this._model.getTimeInput());
            this._txtNum.setValue(this._model.getNum());
        }
        else {
            this._txtName.setValue(null);
            this._level.setModelAndUpdateUI(0);
            this._timeInput.setModelAndUpdateUI(null);
            this._txtNum.setValue(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.editors.Topbar.Model();
        this._model.setName(this._txtName.getValue());
        this._model.setLevel(this._level.updateAndGetModelByUI());
        this._model.setTimeInput(this._timeInput.updateAndGetModelByUI());
        this._model.setNum(this._txtNum.getValue());
    },

    getLblName: function () { return this._lblName; },
    getTxtName: function () { return this._txtName },
    getTxtNum: function () { return this._txtNum },
    getTimeInput: function () { return this._timeInput; },
    getBtnPreview: function () { return this._btnPreview; },
    getBtnCancel: function () { return this._btnCancel; },
    getBtnSave: function () { return this._btnSave; }
});
businesscomponents.editors.Topbar.html = '<div class="taskTopToolbarOuter" style="z-index:2147483584">' +
                                           '<dl class="taskTopToolbar clearfix">' +
                                             '<dd class="Item1 font18" gi="lblName"></dd>' +
                                             '<dd class="Item2_2"><input type="text" class="textstyle1" placeholder="编号" gi="txtNum"></dd>' +
                                              '<dd class="Item2"><input type="text" class="textstyle1" placeholder="名称"  gi="txtName"></dd>' +
                                             '<dd class="Item3" gi="anchorLevel"></dd>' +
                                             '<dd class="Item4" gi="anchorTimeInput" ></dd>' +
                                             '<dd class="Item5 clearfix">' +
                                               '<button class="btnTrytodo" title="试做" gi="btnPreview"></button>' +
                                               '<button class="btnCancel2" title="取消" gi="btnCancel"></button>' +
                                               '<button class="btnSave1" gi="btnSave">保存</button>' +
                                             '</dd>' +
                                           '</dl>' +
                                         '</div>';



businesscomponents.editors.Topbar.Model = function () {
    this._name = null;
    this._level = 0;
    this._timeInput = null;
    this._num = null;
};
toot.extendClass(businesscomponents.editors.Topbar.Model, {
    getNum: function () { return this._num },
    setNum: function (num) { this._num = num },
    getName: function () { return this._name },
    setName: function (name) { this._name = name },
    getLevel: function () { return this._level },
    setLevel: function (level) { this._level = level },
    getTimeInput: function () { return this._timeInput },
    setTimeInput: function (timeInput) { this._timeInput = timeInput }
});