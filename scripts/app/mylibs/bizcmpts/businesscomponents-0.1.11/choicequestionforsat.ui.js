/*
* 功能:SAT选择题 做题页面UI
* 作者:小潘
* 日期:2014年3月11日 15:44:43
* warning: 必须依赖toot.0.1.1版本 T_T
*/


var businesscomponents = businesscomponents || {};

businesscomponents.choicequestionForSAT = businesscomponents.choicequestionForSAT || {};

businesscomponents.choicequestionForSAT.ui = {};



businesscomponents.choicequestionForSAT.ui.ChoiceMode = {
    Single: 1,
    Multi: 2
};

//display 
businesscomponents.choicequestionForSAT.ui.display = {};

//warning 目前只支持单选，多选以后增加 by xp
//warning 硬编码=》强依赖样式名，radioboxStyle 进行判断  
//extendClass-> ui.js businesscomponents.ui.RnRItem
businesscomponents.choicequestionForSAT.ui.display.Choice = function (opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.choicequestionForSAT.ui.display.Choice.HTML)[0]);

    //choice  -- 
    this._choice = $(this._element).find('[gi~="choiceLi"]')[0];

    //choiceText  -- 
    this._choiceText = $(this._element).find('[gi~="choiceText"]')[0];

    //choiceTitile
    this._choiceTitle = new toot.ui.Label($(this._element).find('[gi~="choiceTitle"]')[0]);


    //choiceModel -》 businesscomponents.choicequestionForSAT.ui.ChoiceMode  
    this._choiceMode = -1;


};
toot.inherit(businesscomponents.choicequestionForSAT.ui.display.Choice, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.choicequestionForSAT.ui.display.Choice, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        //设置选项内容
        $(this._choiceText).text(this.getRequestModel().getContent());

        //fix bug http://qa.1gai.cn/index.php/bug/789
        if (this.getResponseModel()) {
            //如果选中 添加选中状态样式
            this.renderCheckState(this.getResponseModel().isSelected());
        } else {
            this.renderCheckState(false);
        }

    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.ChoiceResponse);

        //根据choice上的 choosed样式判断有没有选中状态
        if (this.getChoiceMode() == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Single) {
            if ($(this._choice).hasClass("radioboxStyle2")) {
                this.getResponseModel().setSelected(true);
            } else {
                this.getResponseModel().setSelected(false);

            }
        } else if (this.getChoiceMode() == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Multi) {
            if ($(this._choice).hasClass("TypeCheckbox_choosed")) {
                this.getResponseModel().setSelected(true);
            } else {
                this.getResponseModel().setSelected(false);
            }
        }


    },
    updateUIByIdx: function () {
        //set title by the idx
        if (this._idx < 26)
            this._choiceTitle.setText(String.fromCharCode(0x41 + this._idx));
        else
            this._choiceTitle.setText(null);
    },

    //渲染选中状态 
    renderCheckState: function (state) {

        if (state) {
            if (this.getChoiceMode() == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Single) {
                $(this._choice).addClass("radioboxStyle2").removeClass("radioboxStyle");
            } else if (this.getChoiceMode() == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Multi) {
                $(this._choice).addClass("TypeCheckbox_choosed").removeClass("TypeCheckbox");
            }
        } else {
            if (this.getChoiceMode() == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Single) {
                $(this._choice).addClass("radioboxStyle").removeClass("radioboxStyle2");
            } else if (this.getChoiceMode() == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Multi) {
                $(this._choice).addClass("TypeCheckbox").removeClass("TypeCheckbox_choosed");
            }
        }

    },
    getChoiceMode: function () {
        return this._choiceMode;
    },
    _setChoiceMode: function (mode) {
        this._choiceMode = mode;
        if (this._choiceMode == businesscomponents.choicequestionForSAT.ui.ChoiceMode.Single) {
            $(this._choice).addClass("radioboxStyle").removeClass("TypeCheckbox");
        } else {
            $(this._choice).addClass("TypeCheckbox").removeClass("radioboxStyle");
        }
    },
    setChoiceMode: function (mode) {
        if (this._choiceMode == mode) return;
        this._setChoiceMode(mode);
    },
    getChoiceText: function () {
        return this._choiceText;
    },
    getChoice: function () {
        return this._choice;
    }
});

businesscomponents.choicequestionForSAT.ui.display.Choice.HTML = '<tr><td class="style2"><span class="radioboxStyle" gi="choiceLi"></span><label gi="choiceTitle">A</label></td><td><span class="ChoiceStyle" gi="choiceText">dominance . . edible</span></td></tr>';
businesscomponents.choicequestion.newui.display.Choice.HTML1 = '<li  class="clearfix" ><em class="TypeRadio" gi="choiceLi"></em><span  class="Stylehand"><span gi="choiceText"></span></span></li>';

//extendclass ->>>businesscomponents.ui.List

businesscomponents.choicequestionForSAT.ui.display.ChoiceList = function (opt_html) {
    var choiceBoxElement = $(opt_html !== undefined ? opt_html : businesscomponents.choicequestionForSAT.ui.display.ChoiceList.HTML)[0];
    businesscomponents.choicequestionForSAT.ui.display.ChoiceList.superClass.constructor.call(this, choiceBoxElement, choiceBoxElement, businesscomponents.choicequestionForSAT.ui.display.Choice, businesscomponents.choicequestion.model.QuestionResponse);
    this._inAnswerCount = 0;
};
toot.inherit(businesscomponents.choicequestionForSAT.ui.display.ChoiceList, businesscomponents.ui.List);
//define event 
toot.defineEvent(businesscomponents.choicequestionForSAT.ui.display.ChoiceList, ["change", "beforeChange"]);
toot.extendClass(businesscomponents.choicequestionForSAT.ui.display.ChoiceList, {
    //init  Item   
    _createItem: function () {
        var item = businesscomponents.choicequestionForSAT.ui.display.ChoiceList.superClass._createItem.call(this);
        //click event 
        toot.connect(item, "click", this, this._onItemClick);
        item.setChoiceMode((this.getRadioMode()) ?
            businesscomponents.choicequestionForSAT.ui.ChoiceMode.Single : businesscomponents.choicequestionForSAT.ui.ChoiceMode.Multi);

        return item;

    },
    updateUIByModel: function () {
        //判断是否单选
        this.initRadioMode();
        businesscomponents.choicequestionForSAT.ui.display.ChoiceList.superClass.updateUIByModel.call(this);


    },
    _disposeItem: function (item) {
        //销毁点击事件
        toot.disconnect(item, "click", this, this._onItemClick);
        businesscomponents.choicequestionForSAT.ui.display.ChoiceList.superClass._disposeItem.call(this, item);
    },
    //单击事件 
    _onItemClick: function (sender, e) {
        //beforechange
        //        var e = { preventDefault: false };
        //        toot.fireEvent(this, "beforeChange", e);
        //        if (e.preventDefault) return;

        //解决界面层可能 误将responseModel 为null 的情况

        if ((e.target === sender.getChoice()) || (e.target === sender.getChoiceText())) {

            this.updateModelByUI();

            if (this.getItems()) {
                var idx = this.getItems().indexOf(sender);
                var choiceModel = this.getItems()[idx].getResponseModel();
                if (this._radioMode) {
                    var choiceLiState = choiceModel.isSelected();

                    for (var i = 0; i < this.getItems().length; i++) {
                        this.getItems()[i].getResponseModel().setSelected(false);
                    }
                    if (!choiceLiState) {
                        choiceModel.setSelected(true);
                    }


                } else {
                    //多选模式，点击切换状态
                    choiceModel.setSelected(!choiceModel.isSelected());
                }

                this.updateUIByModel();

                //fireEvent 
                toot.fireEvent(this, "change", { type: "itemChange", idx: idx });

            }

            //        toot.fireEvent(this, "change", { type: "checkChange" });
        }


    },
    //取消选中状态  参数：choiceList ，idx
    cancelItemState: function (choiceList, idx) {
        choiceList.getItems()[idx].getResponseModel().setSelected(false);
        choiceList.updateUIByModel();
    },
    _radioMode: false,
    getRadioMode: function () {
        return this._radioMode;
    },
    //根据items判断是否为单选
    initRadioMode: function () {
        this._inAnswerCount = 0;

        if (this.getModel()) {
            for (var i = 0; i < this.getModel().length; i++) {
                if (this.getModel()[i].getRequest().isInAnswer()) {
                    this._inAnswerCount++;
                }
            }

        }

        if (this._inAnswerCount > 1) {
            this._radioMode = false;
        } else {
            this._radioMode = true;
        }

    },
    //获取标准答案个数
    getInAnswerCount: function () {
        return this._inAnswerCount;
    }
});

businesscomponents.choicequestionForSAT.ui.display.ChoiceList.HTML1 = '<ul class="L2answerchoicebox2" gi="choiceBox"></ul>';
businesscomponents.choicequestionForSAT.ui.display.ChoiceList.HTML = '<table border="0" cellpadding="0" cellspacing="0" class="fontn" gi="choiceBox"></table>';


//extendClass -> businesscomponents.ui.RnRItem  注入ChoiceList
businesscomponents.choicequestionForSAT.ui.display.Question = function (opt_html) {
    businesscomponents.ui.RnRItem.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.choicequestionForSAT.ui.display.Question.HTML)[0]);

    this._choice = null;

    //ContentBox  -- 
    this._contentBox = $(this._element).find('[gi~="contentBox"]')[0];

    //choicebox ->toot.ui.List
    this._choiceBox = $(this._element).find('[gi~="choiceBox"]').get(0);

    //questionTitle -》选择题 题干
    this._questionTitle = $(this._element).find('[gi~="questionTitle"]').get(0);

    //listenImg -》选择题 题干  重听回答题标志图
    this._listenImg = $(this._element).find('[gi~="listenImg"]').get(0);



    //iaAnswerTipsBox -》多选题，带选项个数提醒
    this._isAnswerTipsBox = $(this._element).find('[gi~="isAnswerTipsBox"]').get(0);
    //isAnswerCount  ->  多选题  正确个数，提示选择数量
    this._isAnswerCount = $(this._element).find('[gi~="isAnswerCount"]').get(0);


    //ui.display.ChoiceList   
    this._listChoice = new businesscomponents.choicequestionForSAT.ui.display.ChoiceList(this._choiceBox);


};


toot.inherit(businesscomponents.choicequestionForSAT.ui.display.Question, businesscomponents.ui.RnRItem);
//define event 
toot.defineEvent(businesscomponents.choicequestionForSAT.ui.display.Question, ["change", "beforeChange"]);
toot.extendClass(businesscomponents.choicequestionForSAT.ui.display.Question, {
    updateUIByModel: function () {
        if (!this.getRequestModel()) {
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;
        }
        //fix bug :托福阅读 会将item带到下一题 导致下一题渲染出现错误
        this._listChoice.setModelAndUpdateUI(null);

        //设置题干信息
        $(this._questionTitle).html(this.getRequestModel().getTitle());


        this.renderListenImgState();

        var choiceAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getChoices().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this._model.getRequest().getChoices()[i]);
            if (this._model.getResponse())
                rnr.setResponse(this._model.getResponse().getChoiceResponses()[i]);
            choiceAndResponses.push(rnr);
        }


        //渲染dom
        this._listChoice.setModelAndUpdateUI(choiceAndResponses);

        //判断，渲染单选题、多选题样式 如果是多选题，插入选项个数
        if (this._listChoice.getRadioMode()) {
            $(this._isAnswerTipsBox).hide();
        } else {
            //插入待选项个数
            $(this._isAnswerCount).text(this.getCountHasSelectedChoices());
            $(this._isAnswerTipsBox).show();
        }


    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.QuestionResponse);
        var responses = [];
        for (var i = 0, l = this._listChoice.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listChoice.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setChoiceResponses(responses);
    },

    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var q = new businesscomponents.choicequestion.model.QuestionAndResponse();
        q.setRequest(this.getRequestModel());
        q.setResponse(this.getResponseModel());
        return q.getRightWrong();
    },
    getChoiceList: function () {
        return this._listChoice;
    },
    //获取标准答案个数
    getCountHasSelectedChoices: function () {
        //调用choiceList中的get方法
        return this._listChoice.getInAnswerCount();
    },
    getContentBox: function () {
        return this._contentBox;
    },
    _listenImgState: false,
    setReplayListenChoice: function (replayListen) {
        this._listenImgState = replayListen;
        this.renderListenImgState();
    },
    //是否显示重听回答题图标
    renderListenImgState: function () {
        if (this._listenImgState) {
            $(this._listenImg).show();
        } else {
            $(this._listenImg).hide();
        }

    }
});

//静态DOM  -》 对应v1.3版

businesscomponents.choicequestionForSAT.ui.display.Question.HTML1 = '<div class="listenbox2">' +
    '<!--题干 {-->' +
    '<div class="L2questionbox" ><span gi="questionTitle"></span>' +
    '<img src="/Content/images/TEbg14.png" gi="listenImg">' +
    '</div>' +
    '<!--} 题干-->' +
    '<!--contentBox {-->' +
    '<div gi="contentBox" >' +
    '<!--{ 待选数量-->' +
    '<div class="L2Tipsbox" gi="isAnswerTipsBox">Click on <span gi="isAnswerCount">2</span> answers</div>' +
    '<!--} 待选数量-->' +
    '<!--选项 {-->' +
    '<ul class="L2answerchoicebox" gi="choiceBox">' +
//    '<li>To get permission to organize a club event</li><!--选择前-->' +
//    '<li class="choosed">To arrange for a work space for his club</li><!--选择后-->' +
//    '<li>To inquire about a photography class</li>' +
//    '<li>To reserve a room for a photography exhibit</li>' +
    '</ul>' +
    '</div>' +
    '<!--} contentBox-->' +
    '<!--} 选项-->' +
    '</div>';


//静态DOM  -》 对应v1.4版
businesscomponents.choicequestionForSAT.ui.display.Question.HTML = '<li>' +
    '<!--题干 {-->' +
    '<div class="fontn marB15" ><div gi="questionTitle"></div></div>' +

    '<!--} 题干-->' +

    '<!-- 答案 {-->' +
    '<table border="0" cellpadding="0" cellspacing="0" class="fontn" gi="choiceBox">' +

    '</table>' +
    '<!--} 答案 -->' +
    '</li>';


businesscomponents.choicequestionForSAT.ui.display.QuestionGroup = function (opt_html) {

    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.choicequestionForSAT.ui.display.QuestionGroup.html)[0]);
    //    this._lblTitle = new toot.ui.Label($(this._element).find('div').get(0));

    var _this = this;

    //    this._lblTitleOne = new toot.ui.Label($(this._element).find('div').get(0)); 
    //    this._lblTitleOne.getElement().style.fontWeight = "bold";
    //    this._lblTitleTwo = new toot.ui.Label($(this._element).find('div').get(1));

    //    this._rtdTitle = new businesscomponents.RichTextDisplay(businesscomponents.RichTextDisplay.html1);
    //    this._rtdTitle.replaceTo($(this._element).find('div')[0]);


    this._listQuestion = new businesscomponents.ui.List(this._element, this._element,
        businesscomponents.choicequestionForSAT.ui.display.Question, businesscomponents.choicequestion.model.Question);


    this._parser.setRequest(businesscomponents.choicequestion.model.QuestionGroup.parse);
    this._parser.setResponse(businesscomponents.choicequestion.model.QuestionResponseGroup.parse);

    this._singleChoiceMode = false;
    this._choiceTitleVisible = true;

    //选择题题组 文本
    this._title = '';

};
toot.inherit(businesscomponents.choicequestionForSAT.ui.display.QuestionGroup, businesscomponents.ui.BusinessComponentBase);
//define event 
toot.defineEvent(businesscomponents.choicequestionForSAT.ui.display.QuestionGroup, ["change", "beforechange"]);

toot.extendClass(businesscomponents.choicequestionForSAT.ui.display.QuestionGroup, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;


        //        this._rtdTitle.setHtml(this.getRequestModel().getTitle() || '');
        this._title = this.getRequestModel().getTitle() || '';
        var questionAndResponses = [];
        for (var i = 0, l = this.getRequestModel().getQuestions().length; i < l; i++) {
            var rnr = new businesscomponents.RequestAndResponse();
            rnr.setRequest(this.getRequestModel().getQuestions()[i]);
            if (this.getResponseModel())
                rnr.setResponse(this.getResponseModel().getQuestionResponses()[i]);
            questionAndResponses.push(rnr);
        }
        this._listQuestion.setModelAndUpdateUI(questionAndResponses);
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.choicequestion.model.QuestionResponseGroup);
        var responses = [];
        for (var i = 0, l = this._listQuestion.updateAndGetModelByUI().length; i < l; i++)
            responses.push(this._listQuestion.updateAndGetModelByUI()[i].getResponse());
        this.getResponseModel().setQuestionResponses(responses);
    },

    _generatorQuestion: function () {
        var uiQuestion = new businesscomponents.choicequestionForSAT.ui.display.Question();
        //        uiQuestion.setSingleChoiceMode(this._singleChoiceMode);
        //        uiQuestion.setChoiceTitleVisible(this._choiceTitleVisible);
        return uiQuestion;
    },

    isSingleChoiceMode: function () {
        return this._singleChoiceMode;
    },
    setSingleChoiceMode: function (open) {
        this._singleChoiceMode = open;
    },
    isChoiceTitleVisible: function () {
        return this._choiceTitleVisible;
    },
    //only sets the property, requires further ui refresh operations to update display
    setChoiceTitleVisible: function (visible) {
        this._choiceTitleVisible = visible;
    },

    getRightWrong: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var questionGroupAndRespnose = new businesscomponents.choicequestion.model.QuestionGroupAndResponse();
        questionGroupAndRespnose.setRequest(this.getRequestModel());
        questionGroupAndRespnose.setResponse(this.getResponseModel());

        return questionGroupAndRespnose.getRightWrong();
    },
    getListQuestion: function () {
        return this._listQuestion;
    },
    getTitle: function () {
        return this._title;
    },
    //设置有序列表起始序号
    setStartAttr: function (start) {
        $(this._element).attr('start', start);
    }
});

businesscomponents.choicequestionForSAT.ui.display.QuestionGroup.html = '<ol gi="choiceList" class="questionListOl"></ol>';



