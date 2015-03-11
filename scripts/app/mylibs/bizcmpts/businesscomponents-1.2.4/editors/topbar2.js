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
        if (this._cbLimitTime.isChecked()) {
            this._$ctnTexts.show();
        } else {
            this._$ctnTexts.hide();
        }
    },

    getCbLimitTime: function () { return this._cbLimitTime; }
});
businesscomponents.editors.LimitTimeItem.html =
         '<table><tr><td><span gi="anchorCheckbox"></span></td><td gi="lblName"></td><td gi="ctnTexts"><input type="text" class="textstyle3" gi="txtMin"></td><td gi="ctnTexts">分</td><td gi="ctnTexts"><input type="text" class="textstyle3" gi="txtSec"></td><td gi="ctnTexts">秒</td></tr></table>';









businesscomponents.editors.TimeInput = function (opt_html) {
    businesscomponents.editors.TimeInput.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.TimeInput.html)[0]);

    this._lblTotalTime = new toot.ui.Label($(this._element).find('[gi~="lblTotalTime"]')[0]);
    this._btnSwitch = new toot.ui.Button($(this._element).find('[gi~="btnSwitch"]')[0]);
    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="listLimitTimes-btnClose"]')[0]);
    this.$taskTimer = $(this._element).find('[gi~="taskTimer"]');
    var elementListLimitTimes = $(this._element).find('[gi~="listLimitTimes"]')[0];
    this._listLimitTimes = new toot.view.List(elementListLimitTimes, elementListLimitTimes, businesscomponents.editors.LimitTimeItem, null, [this._btnClose.getElement()]);
    this._listLimitTimes.setDefaultModelGenerator(function () {
        return null;
    });
    this._listLimitTimes.setElementInsertBefore(this._btnClose.getElement());
    this._defaultMsg = "未知";

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.TimeInput, toot.view.ViewBase);
toot.defineEvent(businesscomponents.editors.TimeInput, ["listLimitTimesVisibleChange", "beforeTaskTimerSwitch"]);
toot.extendClass(businesscomponents.editors.TimeInput, {

    setDefaultMsg:function(msg){
        this._defaultMsg = msg;
    },

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
            if (this._model.getTotalTime() == null) this._lblTotalTime.setText(this._defaultMsg);
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
            this._lblTotalTime.setText(this._defaultMsg);
        }

    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.editors.TimeInput.Model();
        this._model.setLimitTimes(this._listLimitTimes.getModel());
    },
    //增加触发点击切换按钮之前事件
    _onBtnSwitchAction: function () {
        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeTaskTimerSwitch", e);
        if (e.preventDefault) return;

        this._listLimitTimes.setVisible(!this._listLimitTimes.isVisible());
        if (this._listLimitTimes.isVisible()) {
            this.$taskTimer.addClass("taskTBtimerHover");
        }
        else {
            this.$taskTimer.removeClass("taskTBtimerHover");
        }
        toot.fireEvent(this, "listLimitTimesVisibleChange");
    },
    _onBtnCloseAction: function () {
        this._listLimitTimes.setVisible(false);
        this.$taskTimer.removeClass("taskTBtimerHover");
    },
    _onListLimitTimesChange: function () {
        this.updateModelByUI();
        this.updateUIByModel();
    },
    getListLimitTimes: function () { return this._listLimitTimes; }
});
businesscomponents.editors.TimeInput.html = '<dd class="Item4">' +
                                              '<div class="taskTBtimer" gi="taskTimer">' +
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
    this._typeId = parseInt(greedyint.common.parseUrlParas(window.location.href).typeId);
    var _this = this;

    var currentNoIndex = -1;
    var currentNameIndex = -1;


    //编号输入框匹配历史记录优化    2014.11.22   
    $(this._element).find('[gi~="txtNum"]').keyup(function (event) {
        var key = event.keyCode;  
        if(key == 13 || key == 38 || key == 40){
            return;
        }

        $.post("/TaskService/GetTaskListByTaskTypeId", { taskTypeId: _this._typeId, serial: _this._txtNum.getValue() }, function (result) {

            var dataList = JSON.parse(result).data.list;
            $(_this._element).find('[gi~="top5Task"]').html("");
            for (var i = 0; i < dataList.length; i++) {
                $(_this._element).find('[gi~="top5Task"]').append("<li>" + dataList[i].Serial + "</li>");
            }
            $(_this._element).find('[gi~="top5Task"]').find("li").click(function () {
                _this._txtNum.setValue($(this).text());
                $(_this._element).find('[gi~="txtNumFive"]').css('display', 'none');
            })
            if (dataList.length == 0)
                $(_this._element).find('[gi~="txtNumFive"]').css('display', 'none');
            else
                $(_this._element).find('[gi~="txtNumFive"]').css('display', 'block');

            $(_this._element).find('[gi~="top5Task"]').find("li").mouseenter(function(){
                $(this).css('background', '#c3e1f5').siblings().css('background', '');
                currentNoIndex = $(this).index();
            });
        });

        currentNoIndex = -1;
    });

    //编号输入框上下键选择
    $(this._element).find('[gi~="txtNum"]').keydown(function(event){
        var tasks = $(_this._element).find('[gi~="top5Task"] li');
        var length = tasks.length;
        if(length == 0){
            return;
        }

        var key = event.keyCode;  
        if(key == 13){
            if(currentNoIndex == -1) return;
             _this._txtNum.setValue(tasks.eq(currentNoIndex).text());
            $(_this._element).find('[gi~="txtNumFive"]').css('display', 'none');
        }else if(key == 38){ //up
            currentNoIndex = (currentNoIndex == -1) ? (length -1) : (currentNoIndex + length - 1) % length;
            tasks.eq(currentNoIndex).css('background', '#c3e1f5').siblings().css('background', '');
        }else if(key == 40){ //down
            currentNoIndex = (currentNoIndex == -1) ? 0 : (currentNoIndex + 1) % length;
            tasks.eq(currentNoIndex).css('background', '#c3e1f5').siblings().css('background', '');
        }
    });



    var blurTimer;

    $(this._element).find('[gi~="txtNum"]').focus(function(e) {
        $(this).keyup();
        var a = e;
        clearTimeout(blurTimer);
    });
    $(this._element).find('[gi~="txtNum"]').blur(function (e) {
        var a = e;

        blurTimer = setTimeout(function () {
            $(_this._element).find('[gi~="txtNumFive"]').css('display', 'none');
        }, 150);

    })
    //名称输入框匹配历史记录    2014.11.22   
    $(this._element).find('[gi~="txtName"]').keyup(function (event) {
        var key = event.keyCode;  
        if(key == 13 || key == 38 || key == 40){
            return;
        }

        $.post("/TaskService/GetTaskListByTaskTypeId", { taskTypeId: _this._typeId, name: _this._txtName.getValue() }, function (result) {

            var dataList = JSON.parse(result).data.list;
            $(_this._element).find('[gi~="top5TaskName"]').html("");
            for (var i = 0; i < dataList.length; i++) {
                $(_this._element).find('[gi~="top5TaskName"]').append("<li>" + dataList[i].Name + "</li>");
            }
            $(_this._element).find('[gi~="top5TaskName"]').find("li").click(function () {
                _this._txtName.setValue($(this).text());
                $(_this._element).find('[gi~="txtNameFive"]').css('display', 'none');
            })
            if (dataList.length == 0)
                $(_this._element).find('[gi~="txtNameFive"]').css('display', 'none');
            else
                $(_this._element).find('[gi~="txtNameFive"]').css('display', 'block');

            $(_this._element).find('[gi~="top5TaskName"]').find("li").mouseenter(function(){
                $(this).css('background', '#c3e1f5').siblings().css('background', '');
                currentNameIndex = $(this).index();
            });
        });

        currentNameIndex = -1;
    });

    //姓名输入框上下键选择
    $(this._element).find('[gi~="txtName"]').keydown(function(event){
        var tasks = $(_this._element).find('[gi~="top5TaskName"] li');
        var length = tasks.length;
        if(length == 0){
            return;
        }

        var key = event.keyCode;  
        if(key == 13){
            if(currentNameIndex == -1) return;
             _this._txtName.setValue(tasks.eq(currentNameIndex).text());
            $(_this._element).find('[gi~="txtNameFive"]').css('display', 'none');
        }else if(key == 38){ //up
            currentNameIndex = (currentNameIndex == -1) ? (length -1) : (currentNameIndex + length - 1) % length;
            tasks.eq(currentNameIndex).css('background', '#c3e1f5').siblings().css('background', '');
        }else if(key == 40){ //down
            currentNameIndex = (currentNameIndex == -1) ? 0 : (currentNameIndex + 1) % length;
            tasks.eq(currentNameIndex).css('background', '#c3e1f5').siblings().css('background', '');
        }
    });


    var blurTimer1;

    $(this._element).find('[gi~="txtName"]').focus(function (e) {
        $(_this._element).find('[gi~="txtName"]').keyup();
        clearTimeout(blurTimer1);
    });
    $(this._element).find('[gi~="txtName"]').blur(function (e) {
        blurTimer1 = setTimeout(function () {
            $(_this._element).find('[gi~="txtNameFive"]').css('display', 'none');
        }, 150);

    });
    this._txtNum = new toot.ui.TextBox($(this._element).find('[gi~="txtNum"]')[0]);
    this._txtName.setValidationHightlightedStyleConfig({ open: "textstyle1_error", closed: "textstyle1" });
    this._txtNum.setValidationHightlightedStyleConfig({ open: "textstyle1_error", closed: "textstyle1" });
    this._level = new businesscomponents.editors.Level(); this._level.replaceTo($(this._element).find('[gi~="anchorLevel"]')[0]);
    this._timeInput = new businesscomponents.editors.TimeInput();
    this._timeInput.replaceTo($(this._element).find('[gi~="anchorTimeInput"]')[0]);

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
//businesscomponents.editors.Topbar.html = '<div class="taskTopToolbarOuter">' +
//                                           '<dl class="taskTopToolbar clearfix">' +
//                                             '<dd class="Item1 font18" gi="lblName"></dd>' +
//                                             '<dd class="Item2_2"><input type="text" class="textstyle1" placeholder="编号" gi="txtNum"></dd>' +
//                                              '<dd class="Item2"><input type="text" class="textstyle1" placeholder="名称"  gi="txtName"></dd>' +
//                                             '<dd class="Item3" gi="anchorLevel"></dd>' +
//                                             '<dd class="Item4" gi="anchorTimeInput" ></dd>' +
//                                             '<dd class="Item5 clearfix">' +
//                                               '<button class="btnTrytodo" title="试做" gi="btnPreview"></button>' +
//                                               '<button class="btnCancel2" title="取消" gi="btnCancel"></button>' +
//                                               '<button class="btnSave1" gi="btnSave">保存</button>' +
//                                             '</dd>' +
//                                           '</dl>' +
//                                         '</div>';


businesscomponents.editors.Topbar.html = '<div><div class="taskTopToolbarOuter">' +
                                            '<dl class="taskTopToolbar clearfix">' +
                                            '<dd class="font18 Item1Padding" gi="lblName"></dd>' +
                                            '<dd class="Item5 clearfix">' +
                                            '<button class="btnCancel1" title="试做" gi="btnPreview">试做</button>' +
                                            '<button class="btnCancel1" title="取消" gi="btnCancel">取消</button>' +
                                            '<button class="btnSave1" gi="btnSave">保存</button>' +
                                            '</dd>' +
                                            '</dl>' +
                                            '</div>' +
                                        '<div class="taskMidboxNew">' +
                                            '<div class="taskMidboxHead">' +
                                            '<dl class="taskTopToolbar taskTopToolbarNew clearfix">' +
                                            '<dd class="Item2_2"><input type="text" class="textstyle1" placeholder="编号" gi="txtNum">' +
                                            '<div class="taskTopEnterbox" gi="txtNumFive" style="display:none;"><ul class="taskTopEnterli" gi="top5Task"></ul></div>' +
                                            '</dd>' +
                                            '<dd class="Item2"><input type="text" class="textstyle1" placeholder="名称" gi="txtName">' +
                                              '<div class="taskTopEnterbox" gi="txtNameFive" style="display:none;"><ul class="taskTopEnterli" gi="top5TaskName"></ul></div>' +
                                            '</dd>' +
                                             '<dd class="Item3" gi="anchorLevel"></dd>' +
                                            '<dd class="Item4" gi="anchorTimeInput" ></dd>' +
                                            '</dl>' +
                                            '</div>' +
                                        '</div></div>';


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