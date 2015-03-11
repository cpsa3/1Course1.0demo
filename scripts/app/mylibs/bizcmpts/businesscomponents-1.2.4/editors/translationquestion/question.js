var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.translationquestion = businesscomponents.editors.translationquestion || {};

businesscomponents.editors.translationquestion.QuestionGroup = function (opt_html) {
    businesscomponents.editors.translationquestion.QuestionGroup.superClass.constructor.call(this,
              $(opt_html !== undefined ? opt_html : businesscomponents.editors.translationquestion.QuestionGroup.html)[0]);
    this._rtTitle = new businesscomponents.editors.RichText();
    this._rtTitle.replaceTo($(this._element).find('[gi~="anchorTitle"]')[0]);
    this._rtTitle.getInitialView().getLbl2().setText(" 说明");
    this._tabs = new businesscomponents.Tabs();
    this._tabs.replaceTo($(this._element).find('[gi~="anchorTabs"]')[0]);
    this._tabs._switchWhenScroll = true;
    this._tabs.setPagingMode(businesscomponents.Tabs.PagingMode.Pages);
    this._tabs.setSwitchToNewAdded(true);
    this._rtContent = new businesscomponents.editors.RichText();
    this._rtContent.replaceTo($(this._element).find('[gi~="anchorContent"]')[0]);
    this._rtContent.getInitialView().getLbl2().setText(" 题干");
    this._rtSuggestedAnswer = new businesscomponents.editors.RichText();
    this._rtSuggestedAnswer.replaceTo($(this._element).find('[gi~="anchorSuggestedAnswer"]')[0]);
    this._rtSuggestedAnswer.getInitialView().getLbl2().setText(" 参考答案");
    this._lblLineCount = new toot.ui.Label($(this._element).find('[gi~="lblLineCount"]')[0]);
    this._lblLineCount.setText("题组高度");
    this._selectLineCount = new businesscomponents.Select();
    this._selectLineCount.replaceTo($(this._element).find('[gi~="anchorLineCount"]')[0]);
    for (var i = 1; i <= 10; i++) {
        var option = new businesscomponents.Option();
        option.setText(i + "行");
        this._selectLineCount.add(option);
    }
    this._selectLineCount.setSelectedIndex(0);
    this._validator = null;
    if (this.constructor == arguments.callee) this._init();

}
toot.inherit(businesscomponents.editors.translationquestion.QuestionGroup, toot.view.Item);
toot.extendClass(businesscomponents.editors.translationquestion.QuestionGroup, {

    _init_manageEvents: function () {
        businesscomponents.editors.translationquestion.QuestionGroup.superClass._init_manageEvents.call(this);
        toot.connect(this._tabs, "switch", this, this._onTabsSwitch);
        toot.connect(this._tabs, "add", this, this._onTabsAdd);
        toot.connect(this._tabs, "remove", this, this._onTabsRemove);
        toot.connect(this._tabs, "drag", this, this._onTabsDrag);
        toot.connect(this._tabs, "beforeSwitch", this, this._onTabsBeforeAddOrSwitch);
        toot.connect(this._tabs, "beforeAdd", this, this._onTabsBeforeAddOrSwitch);
    },

    _onTabsSwitch: function () {
        this.updateModelByUI();
        this._current = this._tabs.getCurrent();
        this.updateUIByModel();
    },
    _onTabsAdd: function () {
        this.updateModelByUI();
        if (!this._model) this._model = new models.components.translationquestion.QuestionGroup();
        if (!this._model.getQuestions()) this._model.setQuestions([]);
        var question = new models.components.translationquestion.Question();
        this._model.getQuestions().push(question);
        this._current = this._tabs.getCurrent();
        this.updateUIByModel();
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
    _onTabsBeforeAddOrSwitch: function (sender, e) {
        this.updateModelByUI();
        if (this._validator && this._tabs.getCurrent() != -1) {
            this._validator.setModel(this._model.getQuestions()[this._tabs.getCurrent()]);
            if (!this._validator.validate()) {
                e.preventDefault = true;
            }
        }
    },

    getValidator: function () { return this._validator },
    setValidator: function (validator) { this._validator = validator },

    _current: -1,
    getCurrent: function () {
        return this._current;
    },
    setCurrent: function (current) {
        if (this._current == current) return;
        this._current = current;
        this.updateUIByModel();
    },

    updateUIByModel: function () {
        if (this._model) {
            if (!this._model.getQuestions() || (this._model.getQuestions() && this._current > this._model.getQuestions().length - 1))
                this._current = -1;
            if (this._current == -1) {
                this._rtContent.setVisible(false);
                this._rtSuggestedAnswer.setVisible(false);
                this._lblLineCount.setVisible(false);
                this._selectLineCount.setVisible(false);
            } else {
                this._rtContent.setVisible(true);
                this._rtSuggestedAnswer.setVisible(true);
                this._lblLineCount.setVisible(true);
                this._selectLineCount.setVisible(true);
            }
            this._rtTitle.setModelAndUpdateUI(this._model.getTitle());
            this._selectLineCount.setSelectedIndex((this._model.getLineCount() || 1) - 1);
            var count = this._model.getQuestions() ? this._model.getQuestions().length : 0;
            var dMin = 0;
            if (count != 0)
                dMin = Math.floor(this._current / this._tabs.getMaxTabs()) * this._tabs.getMaxTabs();
            this._tabs.setState(count, dMin, this._current);
            if (this._current == -1) {
                this._rtContent.setModelAndUpdateUI(null);
                this._rtSuggestedAnswer.setModelAndUpdateUI(null);
            }
            else {
                this._rtContent.setModelAndUpdateUI(this._model.getQuestions()[this._current].getContent());
                this._rtSuggestedAnswer.setModelAndUpdateUI(this._model.getQuestions()[this._current].getSuggestedAnswer());
            }
        }
        else {
            this._current = -1;
            this._rtContent.setVisible(false);
            this._rtSuggestedAnswer.setVisible(false);
            this._lblLineCount.setVisible(false);
            this._selectLineCount.setVisible(false);

            this._rtTitle.setModelAndUpdateUI(null);
            this._tabs.setState(0, 0, -1);
            this._rtContent.setModelAndUpdateUI(null);
            this._rtSuggestedAnswer.setModelAndUpdateUI(null);
            this._selectLineCount.setSelectedIndex(-1);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.translationquestion.QuestionGroup();
        this._model.setTitle(this._rtTitle.updateAndGetModelByUI());
        this._model.setLineCount(this._selectLineCount.getSelectedIndex() + 1);
        if (this._current != -1) {
            this._model.getQuestions()[this._current].setContent(this._rtContent.updateAndGetModelByUI());
            this._model.getQuestions()[this._current].setSuggestedAnswer(this._rtSuggestedAnswer.updateAndGetModelByUI());
        }
    }
});
businesscomponents.editors.translationquestion.QuestionGroup.html =
                                                    '<div>' +
                                                        '<div gi="anchorTitle"></div>' +
                                                        '<div gi="anchorTabs"></div>' +
                                                        '<div gi="anchorContent"></div>' +
                                                        '<div gi="anchorSuggestedAnswer"></div>' +
                                                        '<span class="Fleftbox1" gi="lblLineCount"></span><div gi="anchorLineCount"><div>' +
                                                    '</div>';