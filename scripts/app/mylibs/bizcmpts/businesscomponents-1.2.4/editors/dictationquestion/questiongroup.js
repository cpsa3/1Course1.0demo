/*
*User: 小潘
*Date: 2015年1月23日 11:48:22
*Desc: 听写题组 
*/

var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.dictationquestion = businesscomponents.editors.dictationquestion || {};


businesscomponents.editors.dictationquestion.QuestionGroup = function(opt_html) {
    businesscomponents.editors.dictationquestion.QuestionGroup.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.dictationquestion.QuestionGroup.html)[0]);

    //说明文本 - 富文本
    this._explainBox = new businesscomponents.editors.RichText();
    this._explainBox.replaceTo($(this._element).find('[gi~="explainBox"]')[0]);
    this._explainBox.getInitialView().getLbl2().setText(" 说明");

    this._explainBox.setConfigFile('/content3/Scripts/ckeditorconfigs/topic_v2.js');
    this._explainBox.setAttachCKFinder(true);
    this._tabs = new businesscomponents.Tabs();
    //切换时更换选中标签页
    this._tabs._switchWhenScroll = true;
    //设置分页模式
    this._tabs.setPagingMode(businesscomponents.Tabs.PagingMode.Pages);

    this._tabs.setSwitchToNewAdded(true);
    this._tabs.replaceTo($(this._element).find('[gi~="anchorTabs"]')[0]);


    this._audio = new businesscomponents.editors.AudioWithWebUploader();
//    this._audio.getInitialView().setLb12(" 听力音频（请上传总和小于300MB的音频！）");
    this._audio.replaceTo($(this._element).find('[gi~="audioBox"]')[0]);

    this._referenceBox = new businesscomponents.editors.CommentBox(undefined, $191);
    this._referenceBox.setText("输入参考答案");
    this._referenceBox.replaceTo($(this._element).find('[gi~="referenceBox"]')[0]);

    //错误提示控件 调用方传入
    this._msgBar = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.dictationquestion.QuestionGroup, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.dictationquestion.QuestionGroup, {
    getExplainBox: function () { return this._explainBox; },
    getTabs: function () { return this._tabs; },
    getAudio: function () { return this._audio; },
    getReferenceBox: function () { return this._referenceBox; },

    _init_manageEvents: function () {
        businesscomponents.editors.dictationquestion.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._tabs, "switch", this, this._onTabsSwitch);
        toot.connect(this._tabs, "add", this, this._onTabsAdd);
        toot.connect(this._tabs, "remove", this, this._onTabsRemove);
        toot.connect(this._tabs, "drag", this, this._onTabsDrag);

        toot.connect(this._tabs, "beforeSwitch", this, this._onTabsBeforeAddOrSwitch);
        toot.connect(this._tabs, "beforeAdd", this, this._onTabsBeforeAddOrSwitch);
        //音频文件变换事件
        toot.connect(this._audio, "change", this, this._onAudioChange);
    },
    _init_render: function () {
        businesscomponents.editors.dictationquestion.QuestionGroup.superClass._init_render.call(this);
    },
    _onAudioChange: function() {
        this.updateModelByUI();
    },
    updateUIByModel: function () {
        if (this._model) {
            if (!this._model.getQuestions() || (this._model.getQuestions() && this._current > this._model.getQuestions().length - 1))
                this._current = -1;

            if (this._current == -1) {
                this._audio.setVisible(false);
                this._referenceBox.setVisible(false);
            } else {
                this._audio.setVisible(true);
                this._referenceBox.setVisible(true);
            }

            this._explainBox.setModelAndUpdateUI(this._model.getExplain());

            var count = this._model.getQuestions() ? this._model.getQuestions().length : 0;
            var dMin = 0;
            if (count != 0)
                dMin = Math.floor(this._current / this._tabs.getMaxTabs()) * this._tabs.getMaxTabs();
            dMin = dMin < 0 ? 0 : dMin;
            this._tabs.setState(count, dMin, this._current);

            if (this._current == -1) this._audio.setModelAndUpdateUI(null);
            else {
                this._audio.setFileName("");
                this._audio.setModelAndUpdateUI(this._model.getQuestions()[this._current].getAudioUrl());
                this._audio.setAudioSize(this._model.getQuestions()[this._current].getAudioSize());
            }

            if (this._current == -1) this._referenceBox.setModelAndUpdateUI(null);
            else this._referenceBox.setModelAndUpdateUI(this._model.getQuestions()[this._current].getReference());

            //the last one cannot be removed
            if (this._model.getQuestions()) {
                if (this._model.getQuestions().length == 1)
                    this._tabs.getTabs()[0].setBtnCloseVisible(false);
                else if (this._model.getQuestions().length > 1)
                    this._tabs.getTabs()[0].setBtnCloseVisible(true);
            }
        } else {
            this._current = -1;

            this._audio.setVisible(false);
            this._referenceBox.setVisible(false);

            this._explainBox.setModelAndUpdateUI(null);
            this._tabs.setState(0, 0, -1);
            this._audio.setModelAndUpdateUI(null);
            this._referenceBox.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.dictationquestion.QuestionGroup();
        this._model.setExplain(this._explainBox.updateAndGetModelByUI());
        if (this._current != -1) {
            this._model.getQuestions()[this._current].setAudioUrl(this._audio.updateAndGetModelByUI());
            this._model.getQuestions()[this._current].setAudioSize(this._audio.getAudioSize());

            this._model.getQuestions()[this._current].setReference(this._referenceBox.updateAndGetModelByUI());
        }
    },

    _current: -1,
    getCurrent: function () {
        return this._current;
    },
    setCurrent: function (current) {
        if (this._current == current) return;
        this._current = current;
        this.updateUIByModel();
    },

    _onTabsBeforeAddOrSwitch: function (sender, e) {
        this.updateModelByUI();
        if (this._current == -1) return;
        if (!this.getModel().getQuestions()[this.getCurrent()].getAudioUrl()) {
            this._msgBar.setMessage("音频不能为空", 3000);
            e.preventDefault = true;
        }

    },


    _onTabsSwitch: function () {
        this.updateModelByUI();
        this._current = this._tabs.getCurrent();
        this.updateUIByModel();

    },
    _onTabsAdd: function () {
        this.updateModelByUI();
        if (!this._model) this._model = new models.components.dictationquestion.QuestionGroup();
        if (!this._model.getQuestions()) this._model.setQuestions([]);

        var question = new models.components.dictationquestion.Question();


        this._model.getQuestions().push(question);
        this._current = this._tabs.getCurrent();
        this.updateUIByModel();
        //        this._updateUIByModel_QuestionByIdx(this._model.getQuestions().length - 1);
    },
    _onTabsRemove: function (sender, e) {
        this.updateModelByUI();
        this._model.getQuestions().splice(e.idx, 1);
        this._current = this._current < this._model.getQuestions().length ? this._current : this._model.getQuestions().length - 1;
        this.updateUIByModel();
    },
    _onTabsDrag: function (sender, e) {
        this.updateModelByUI();
        var question = this._model.getQuestions().splice(e.originalIndex, 1)[0];
        this._model.getQuestions().splice(e.newIndex, 0, question);
        this._current = this._tabs.getCurrent();
    },
    setMsgBar: function(msgBar) {
        this._msgBar = msgBar;
    }
    

});
businesscomponents.editors.dictationquestion.QuestionGroup.html =
    '<div>' +
    '<div gi="explainBox"></div><div gi="anchorTabs"></div><div gi="audioBox"></div>' +
    '<div gi="referenceBox">' +
    '</div>' +
    '</div>';


businesscomponents.editors.dictationquestion.Question = function(opt_html) {
    businesscomponents.editors.dictationquestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.dictationquestion.Question.html)[0]);

    this._audio = new businesscomponents.editors.RichText();

    this._audio = new businesscomponents.editors.Audio();
    this._audio.setMsgBar(this._msgBar);
//    this._audio.getInitialView().setLb12(" 听力音频（请上传总和小于300MB的音频！）");
    this._audio.replaceTo($(this._element).find('[gi~="audioBox"]')[0]);

    this._referenceBox = new businesscomponents.editors.CommentBox(undefined, $191);
    this._referenceBox.setText("输入参考答案");
    this._referenceBox.replaceTo($(this._element).find('[gi~="referenceBox"]')[0]);

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.dictationquestion.Question, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.dictationquestion.Question, {
    updateUIByModel: function() {
        if (this._model) {
            this._audio.setModelAndUpdateUI(this._model.getAudioUrl());
            this._audio.setAudioSize(this._model.getAudioSize());
            this._referenceBox.setModelAndUpdateUI(this._model.getReference());
        } else {
            this._audio.setModelAndUpdateUI(null);
            this._referenceBox.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function() {
        if (!this._model) this._model = new models.components.dictationquestion.Question();
        this._model.setAudioUrl(this._audio.updateAndGetModelByUI());
        this._model.setAudioSize(this._audio.getAudioSize());
        this._model.setReference(this._referenceBox.updateAndGetModelByUI(0));
    },

    getAudio: function() { return this._audio; },
    getReferenceBox: function() { return this._referenceBox; }
});
businesscomponents.editors.dictationquestion.Question.html = '<div gi="audioBox"></div><div gi="referenceBox"></div>';