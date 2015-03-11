var businesscomponents = businesscomponents || {};

businesscomponents.limittime = businesscomponents.limittime || {};

businesscomponents.limittime.ui = businesscomponents.limittime.ui || {};

businesscomponents.limittime.ui.Item = function (opt_html) {
    businesscomponents.limittime.ui.Item.superClass.constructor.call(this, $(opt_html === undefined ? businesscomponents.limittime.ui.Item.html1 : opt_html).get(0));

    var _this = this;

    this._$cbLimitTime = $(this._element).find('[gi="cbLimitTime"]');
    this._txtLimitTimeMin = new toot.ui.TextBox($(this._element).find('[gi="txtLimitTimeMin"]').get(0));
    this._txtLimitTimeSec = new toot.ui.TextBox($(this._element).find('[gi="txtLimitTimeSec"]').get(0));
    this._$ctnLimitTimeInput = $(this._element).find('[gi="ctnLimitTimeInput"]');

    this._$cbLimitTime.bind("change", function () {
        if (_this._$cbLimitTime.get(0).checked) _this._$ctnLimitTimeInput.show();
        else _this._$ctnLimitTimeInput.hide();
    });

    $([this._$cbLimitTime.get(0), this._txtLimitTimeMin.getElement(), this._txtLimitTimeSec.getElement()]).bind("change", function () {
        toot.fireEvent(_this, "inputChange");
    });

    this._lblName = new toot.ui.Label($(this._element).find('[gi="lblName"]').get(0));

      //后加：点击限时控件文本显示限时输入文本框, 文艺
        this._$lblName = $(this._element).find('[gi="lblName"]');
        this._$lblName.bind("click", function () {
            if (_this._$cbLimitTime.get(0).checked) {
                _this._$cbLimitTime.get(0).checked=false;
                _this._$ctnLimitTimeInput.hide();
            } else {
                _this._$cbLimitTime.get(0).checked = true;
                _this._$ctnLimitTimeInput.show();
            }
            toot.fireEvent(_this, "inputChange");
        });

};
toot.inherit(businesscomponents.limittime.ui.Item, businesscomponents.ui.Item);
toot.defineEvent(businesscomponents.limittime.ui.Item, "inputChange");
toot.extendClass(businesscomponents.limittime.ui.Item, {
    updateUIByModel: function () {
        if (this._model) {
            this._$cbLimitTime.get(0).checked = this._model.isLimitTimeChecked();
            if (this._$cbLimitTime.get(0).checked) this._$ctnLimitTimeInput.show();
            else this._$ctnLimitTimeInput.hide();
            this._txtLimitTimeMin.setValue(this._model.getLimitTimeMin());
            this._txtLimitTimeSec.setValue(this._model.getLimitTimeSec());
        }
        else {
            this._$cbLimitTime.get(0).checked = false;
            this._$ctnLimitTimeInput.hide();
            this._txtLimitTimeMin.setValue(null);
            this._txtLimitTimeSec.setValue(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.limittime.model.Item();
        this._model.setLimitTimeChecked(this._$cbLimitTime.get(0).checked);
        this._model.setLimitTimeMin(this._txtLimitTimeMin.getValue());
        this._model.setLimitTimeSec(this._txtLimitTimeSec.getValue());
    },
    getLblName: function () {
        return this._lblName;
    }
});

businesscomponents.limittime.ui.Item.html1 =
           '<div class="fillbox">' +
             '<input type="checkbox" gi="cbLimitTime"><span gi="lblName" style="cursor:pointer" >限时</span>' +
             '<span gi="ctnLimitTimeInput"><input type="text" class="TEtextstyle1 TEtextW5" gi="txtLimitTimeMin">分<input type="text" class="TEtextstyle1 TEtextW5" gi="txtLimitTimeSec">秒</span>' +
           '</div>';



businesscomponents.limittime.ui.LimitTime = function (opt_html) {

    businesscomponents.limittime.ui.LimitTime.superClass.constructor.call(this, $(opt_html === undefined ? businesscomponents.limittime.ui.LimitTime.html1 : opt_html).get(0));

    var _this = this;

    this._$part1 = $(this._element).find('[gi="part1"]');
    this._$part2 = $(this._element).find('[gi="part2"]');
    this._$part1Click = $(this._element).find('[gi="part1Click"]');
    this._$part2Click = $(this._element).find('[gi="part2Click"]');

    this._$part1Click.bind("click", function () {
        _this._setExpanded(true);
    });
    this._$part2Click.bind("click", function () {
        _this._setExpanded(false);
    });

    this._setExpanded(false);

    this._list = new businesscomponents.ui.List($(this._element).find('[gi~="list"]').get(0),
             $(this._element).find('[gi~="listCtn"]').get(0), businesscomponents.limittime.ui.Item, businesscomponents.limittime.model.Item);
};
toot.inherit(businesscomponents.limittime.ui.LimitTime, businesscomponents.ui.ComponentBase);
toot.defineEvent(businesscomponents.limittime.ui.LimitTime, "inputChange");
toot.extendClass(businesscomponents.limittime.ui.LimitTime, {
    updateUIByModel: function () {
        this._list.setModelAndUpdateUI(this._model);
        for (var i = 0, l = this._list.getItems().length; i < l; i++)
            toot.connect(this._list.getItems(), "inputChange", this, function () {
                toot.fireEvent(this, "inputChange");
            })
    },
    updateModelByUI: function () {
        this._model = this._list.updateAndGetModelByUI();
    },
    resetItems: function (itemsCount) {
        var items = [];
        for (var i = 0; i < itemsCount; i++)
            items.push(null);
        this.setModelAndUpdateUI(items);
    },
    getLblNames: function () {
        var lblNames = [];
        for (var i = 0, l = this._list.getItems().length; i < l; i++)
            lblNames.push(this._list.getItems()[i].getLblName());
        return lblNames;
    },
    _setExpanded: function (expand) {
        if (expand) { this._$part1.hide(); this._$part2.show(); }
        else { this._$part1.show(); this._$part2.hide(); }
    }
});

businesscomponents.limittime.ui.LimitTime.html1 =
'<div class="formgroupFIX2">' +
    	'<table class="settingTimerbox" gi="part1">' +
        	'<tbody><tr>' +
            	'<td class="settingTimerOpen"></td>' +
                '<td class="settingTimerClock" gi="part1Click"></td>' +
            '</tr>' +
        '</tbody></table>' +
        '<table class="settingTimerbox" gi="part2">' +
        	'<tbody><tr>' +
            	'<td class="settingTimerClose" rowspan="2" gi="part2Click"></td>' +
                '<td class="settingTimerFill" gi="list listCtn">' +
                '</td>' +
            '</tr>' +
        '</tbody></table>' +
'</div>'