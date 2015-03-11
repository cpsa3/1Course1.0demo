/*
*User: 小潘   
*Date: 2014年11月17日 15:31:17
*Desc: 通用题型(主观题) -批改信息 相关设置
*/

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.CorrectConfig = function(opt_html) {
    businesscomponents.editors.CorrectConfig.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.CorrectConfig.html)[0]);

    //评分
    this._lblConfigMax = new toot.ui.TextBox($(this._element).find('[gi~="config-max"]')[0]);
    this._lblConfigMin = new toot.ui.TextBox($(this._element).find('[gi~="config-min"]')[0]);

    //枚举
    this._lblEnumBox = new toot.ui.TextBox($(this._element).find('[gi~="enum-box"]')[0]);
    this._lblEnumBox.setVisible(false);

    //步进 集合
    this._$steps = $(this._element).find('[gi~="config-step"]');

    this._$configBox = $(this._element).find('[gi~="config-box"]');
    this._$numBox = $(this._element).find('[gi~="num-box"]');


    //评分类型
    this._$numGrade = $(this._element).find('[gi~="num-grade"]');
    this._$enumGrade = $(this._element).find('[gi~="enum-grade"]');

    this._model = new models.tasks.core.CorrectConfig();


    if (this.constructor == arguments.callee) this._init();
};

toot.inherit(businesscomponents.editors.CorrectConfig, toot.ui.Component);
toot.defineEvent(businesscomponents.editors.CorrectConfig, ["beforeSwitch"]);
toot.extendClass(businesscomponents.editors.CorrectConfig, {
    _init_manageEvents: function() {
        businesscomponents.editors.CorrectConfig.superClass._init_manageEvents.call(this);
        //评分类型
        this._$numGrade.bind("click", this._onGradeClick.bind(this));
        this._$enumGrade.bind("click", this._onGradeClick.bind(this));

        this._$steps.bind("click", this._onStepsClick.bind(this));

    },
    _onGradeClick: function(e) {
        this._$numGrade.toggleClass("selected");
        this._$enumGrade.toggleClass("selected");
        if (e.currentTarget == this._$numGrade[0]) {
            this._$numBox.show();
            this._lblEnumBox.setVisible(false);
        } else {
            this._$numBox.hide();
            this._lblEnumBox.setVisible(true);
        }
    },
    _onStepsClick: function(e) {
        this._$steps.each(function() {
            $(this).removeClass("selected");
        });
        $(e.currentTarget).addClass("selected");
    },
    getModel: function() { return this._model; },
    setModelAndUpdateUI: function(model) {
        if (this._model == model) return;
        this._model = model;
        this.updateUIByModel();
    },
    updateUIByModel: function() {;
        if (this._model) {
            if (this.getModel().getGradeType() == models.tasks.core.GradeType["数值"]) {
            
                this._$numGrade.addClass("selected");
                this._$enumGrade.removeClass("selected");

                this._$numBox.show();
                this._lblEnumBox.setVisible(false);

                this._lblConfigMax.setValue(this.getModel().getConfig().getMax());
                this._lblConfigMin.setValue(this.getModel().getConfig().getMin());

                var step = this.getModel().getConfig().getStep();
                this._$steps.each(function () {
                    $(this).removeClass("selected");
                    if ($(this).text() == step) {
                        $(this).addClass("selected");
                    }
                });

            } else {
                this._$numGrade.removeClass("selected");
                this._$enumGrade.addClass("selected");

                this._$numBox.hide();
                this._lblEnumBox.setVisible(true);


                this._lblEnumBox.setValue(this.getModel().getConfig().getValue());
            }

        }
    },
    updateModelByUI: function() {
        var step = 0;
        if (this._$numGrade.hasClass("selected")) {
            this.getModel().setGradeType(models.tasks.core.GradeType["数值"]);
            this.getModel().setConfig(new models.tasks.core.NumericalCorrectConfig());

            this.getModel().getConfig().setMax(this._lblConfigMax.getValue());
            this.getModel().getConfig().setMin(this._lblConfigMin.getValue());
            this._$steps.each(function(idx) {
                if ($(this).hasClass("selected")) {
                    step = $(this).text();
                }
            });
            this.getModel().getConfig().setStep(step);

        } else {
            this.getModel().setGradeType(models.tasks.core.GradeType["枚举"]);
            this.getModel().setConfig(new models.tasks.core.EnumCorrectConfig());

            this.getModel().getConfig().setValue(this._lblEnumBox.getValue());
        }

    },
    validate: function() {
        if (this.getModel().getGradeType() == models.tasks.core.GradeType["数值"]) {
            if (!this._validateNum(this.getModel().getConfig())) {
                return false;
            }
        } else {
            if (!this._validateEnum(this.getModel().getConfig().getValue())) {
                return false;
            }
        }
        return true;
    },
    //校验枚举
    _validateEnum: function (value) {
        if (!value.match(/^([\u4E00-\u9FA5]|[\x21-\x7d]|\s){0,500}$/)) {
            this._msgBar.setMessage("你输入的字符不合法", this._messageDuration);
            return false;
        }

        if (value == "") {
            this._msgBar.setMessage("枚举值不能为空", this._messageDuration);
            return false;
        }
        var configArray = value.split(",");
        if (configArray.length > 100) {
            this._msgBar.setMessage("您输入的枚举值过多", this._messageDuration);
            return false;
        }
        var isReplication = false;
        var isEmpty = false;

        $.each(configArray, function(idx, config) {
            if (!isReplication) {
                if (this.inMyArray(config, configArray).length > 1) {
                    isReplication = true;
                    return;
                }
            }
        }.bind(this));

        $.each(configArray, function(idx, config) {
            if (!isEmpty) {
                if (config == "") {
                    isEmpty = true;
                    return;
                }
            }
        });


        if (isReplication) {
            this._msgBar.setMessage("您输入的枚举值中有重复项，请检查后重新输入", this._messageDuration);
            return false;
        }
        if (isEmpty) {
            this._msgBar.setMessage("您输入的枚举值中有空值，请检查后重新输入", this._messageDuration);
            return false;
        }

        return true;
    },
    //校验数值配置信息
    _validateNum: function(config) {
        if (!config.getStep()) {
            this._msgBar.setMessage("请选择最小分数档（步进）", this._messageDuration);
            return false;
        }


        //最高分必须为0到5000之间的数值
        if (!String(config.getMax()).match(/^(100|[1-9]\d{0,1})$/)) {
            this._msgBar.setMessage("分值必须为1到100之间的整数", this._messageDuration);
            return false;
        }

        //最低分必须为0到5000之间的数值
        if (!String(config.getMin()).match(/^(100|[1-9]\d|\d)$/)) {
            this._msgBar.setMessage("分值必须为0到100之间的整数", this._messageDuration);
            return false;
        }

        //最高分必须为步进的整数倍
        if (!((config.getMax() * 10) % (config.getStep() * 10) == 0)) {
            this._msgBar.setMessage("最高分必须为步进的整数倍", this._messageDuration);
            return false;
        }


        //最高分必须大于最低分
        if (parseInt(config.getMax()) <= parseInt(config.getMin())) {
            this._msgBar.setMessage("最高分必须大于最低分", this._messageDuration);
            return false;
        }
        return true;
    },
    getContent: function() {
        this.updateModelByUI();
        if (this.validate()) {
            return this.getModel();
        }
    },
    setMessageBar: function(messageBar, messageDuration) {
        this._msgBar = messageBar;
        this._messageDuration = messageDuration;
    },
    //扩展$.inArray方法，判断，传入的值对应的索引位，如有多个值，则返回多个索引值
    inMyArray: function(elem, arr) {
        var len;
        var result = [];
        if (arr) {

            len = arr.length;

            for (var i = 0; i < len; i++) {
                // Skip accessing in sparse arrays
                if (i in arr && arr[i] === elem) {
                    result.push(i);
                }
            }
        }
        if (result.length < 2) {
            result = result.pop();
        }
        return result;
    }
});
businesscomponents.editors.CorrectConfig.html =
    '<div class="BtnTabListWrap" style="display:block;" gi="config-box">' +
    '<dl class="BtnTabListStyle1 clearfix">' +
    '<dd class="BtnTabListItem BtnTabListItem1" gi="num-grade">数值</dd>' +
    '<dd class="BtnTabListItem BtnTabListItem3" gi="enum-grade">枚举</dd>' +
    '</dl>' +
    '<div class="BtnTabList1 clearfix" style="display:block;" gi="num-box">' +
    '<dl class="BtnTabListStyle2 clearfix fl">' +
    '<dd class="BtnTabListItem4">分值步进</dd>' +
    '<dd class="BtnTabListItem BtnTabListItem1" gi="config-step">0.1</dd>' +
    '<dd class="BtnTabListItem BtnTabListItem2" gi="config-step">0.5</dd>' +
    '<dd class="BtnTabListItem BtnTabListItem3" gi="config-step">1</dd>' +
    '</dl>' +
    '<div class="ValueWrap fl">' +
    '<span class="ValueText" >最大值</span><input type="text" class="inputStyle4" gi="config-max">' +
    '</div>' +
    '<div class="ValueWrap fl">' +
    '<span class="ValueText" >最小值</span><input type="text" class="inputStyle4" gi="config-min">' +
    '</div>' +
    '</div>' +
    '<input type="text" class="textareaStyle5" style="display:block;" placeholder="请输入枚举值，从大到小以英文逗号分隔" gi="enum-box"></input>' +
    '</div>';