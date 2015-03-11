var businesscomponents = businesscomponents || {};

businesscomponents.fillquestion = businesscomponents.fillquestion || {};

businesscomponents.fillquestion.ui = {};

businesscomponents.fillquestion.ui.edit = {};

businesscomponents.fillquestion.ui.code = {
    blank: encodeURIComponent(" ") + "^",
    colon: encodeURIComponent(":") + "^"
};

businesscomponents.fillquestion.ui.getGIComments = function (node) {
    if (!node.childNodes) return [];
    var comments = [];
    for (var i = 0, l = node.childNodes.length; i < l; i++) {
        var targetNode = node.childNodes[i];
        if (targetNode.nodeType == 8) {      // Node.COMMENT_NODE = 8 But it seems IE8 has no Node definition
            try {
                if (node.childNodes[i].data.split(businesscomponents.fillquestion.ui.code.blank)[0].split(businesscomponents.fillquestion.ui.code.colon)[0] == "gi")
                    comments.push(targetNode);
            }
            catch (ex) { }
        }
        else
            comments = comments.concat(arguments.callee(targetNode));
    }
    return comments;
};

//edit
businesscomponents.fillquestion.ui.edit.FillQuestion = function () {
    businesscomponents.ui.BusinessComponentBase.call(this,
       $('<div class="Choicebox">' +
           '<div class="clearfix">' +
             '<div class="fr toolbtn">' +
               '<a href="#" class="close"></a>' +
               '<a href="#" class="down"></a>' +
             '</div>' +
             '<span class="titlestyle">填空题</span>' +
           '</div>' +
           '<div class="headbox clearfix">' +
             '<span class="fl option1">题目要求</span>' +
             '<textarea class="textarea PopupTAw4" onfocus="this.className=\'textareafocus PopupTAw4\'" onblur="this.className=\'textarea PopupTAw4\'"></textarea>' +
           '</div>' +
           '<div class="fillbox">' +
             '<textarea style="width:573px; height:500px; padding:5px;"></textarea>' +
           '</div>' +
           '<div class="addbtnbox">' +
           '<input type="button" value="保存" class="pooupbtn5 PopupTw1 pooupbtn5_dis" onmouseover="this.className=\'pooupbtn5 PopupTw1 pooupbtn5_hover\'" ' +
           'onmouseout="this.className=\'pooupbtn5 PopupTw1\'" disabled="disabled">' +
           '<input type="button" value="长填空" class="pooupbtn5 PopupTw1" onmouseover="this.className=\'pooupbtn5 PopupTw1 pooupbtn5_hover\'" ' +
           'onmouseout="this.className=\'pooupbtn5 PopupTw1\'">' +
           '<input type="button" value="短填空" class="pooupbtn5 PopupTw1" onmouseover="this.className=\'pooupbtn5 PopupTw1 pooupbtn5_hover\'" ' +
           'onmouseout="this.className=\'pooupbtn5 PopupTw1\'">' +
         '</div>' +
       '</div>').get(0));

    this._txtTitle = new toot.ui.TextBox($(this._element).find('textarea').get(0)); $(this._element).children("div")[1].style.display = "none";
    this._txtContent = CKEDITOR.replace($(this._element).find('textarea').get(1), { customConfig: '/content3/Scripts/ckeditor/custom_config.js' });
    CKFinder.setupCKEditor(this._txtContent, '/content3/Scripts/ckfinder/');
    this._btnSave = new toot.ui.Button($(this._element).find('input').get(0)); this._btnSave.setVisible(false);
    this._btnAddLong = new toot.ui.Button($(this._element).find('input').get(1));
    this._btnAddShort = new toot.ui.Button($(this._element).find('input').get(2));

    this._lblComponentTitle = new toot.ui.Label($(this._element).find('span').get(0)); this._lblComponentTitle.setText("填空题");

    this._businessType = 1;

    var option = new businesscomponents.ui.ItemOptions();
    option.setBtnDel(new toot.ui.Button($(this._element).find('a').get(0)));
    option.setBtnMin(new toot.ui.Button($(this._element).find('a').get(1)));
    //    option.getBtnMin().setVisible(false);
    businesscomponents.fillquestion.ui.edit.FillQuestion.superClass.setOption.call(this, option);

    businesscomponents.fillquestion.ui.edit.FillQuestion.superClass._setMinimized.call(this, false);

    this._parser.setRequest(businesscomponents.fillquestion.model.FillQuestion.parse);

    toot.connect(this._btnAddLong, "action", this, function () {
        this._txtContent.insertHtml('<input gi="longfill" spellcheck="false" type="text" style="width: 403px" />');
    });
    toot.connect(this._btnAddShort, "action", this, function () {
        this._txtContent.insertHtml('<input gi="shortfill" spellcheck="false" type="text" style="width: 131px" />');
    });
};
toot.inherit(businesscomponents.fillquestion.ui.edit.FillQuestion, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.fillquestion.ui.edit.FillQuestion, {
    updateUIByModel: function () {
        if (!this.getRequestModel()) {
            this._txtTitle.setValue(null);
            this._txtContent.setSource(null);
            return;
        }

        this._txtTitle.setValue(this.getRequestModel().getTitle());

        var $div = $('<div></div>').html(this.getRequestModel().getContent());
        var gis = $div.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gi);
            var type = $gi.attr("gi");
            var value = gi.value.replace(/"/g, '&quot;');
            if (type == "longfill")
                var elementEdit = $('<input gi="longfill"  type="text" spellcheck="false" style="width: 403px" value="' + value + '" />').get(0);
            else if (type == "shortfill")
                var elementEdit = $('<input gi="shortfill" type="text" spellcheck="false" style="width: 131px" value="' + value + '" />').get(0);

            $(elementEdit).val(gi.value);

            gi.parentNode.replaceChild(elementEdit, gi);
        }
        this._txtContent.setData($div.html());
    },
    updateModelByUI: function () {
        //reset the validation state
        this._validatedOK = true;

        this._setRequestModelIfNull(businesscomponents.fillquestion.model.FillQuestion);
        this.getRequestModel().setTitle(this._txtTitle.getValue());

        var $div = $('<div>' + this._txtContent.getData() + '</div>');
        var gis = $div.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gis[i]);
            var elementVal = $('<input gi="' + $gi.attr("gi") + '" type="hidden">').get(0);
            elementVal.value = gi.value;
            gi.parentNode.replaceChild(elementVal, gi);

            //Set the validation only if the _validatedOK is true in order to keep the first false result.
            if (!gi.value && this._validatedOK) {
                this._validatedOK = false;
                this._validationMsg = "填空题标准答案不能为空";
            }
        }
        this.getRequestModel().setContent($div.html());
    },
    _setMinimizedUI: function () {
        if (this._minimized) {
            var divs = $(this._element).children("div");
            divs[2].style.display = "none";
            divs[3].style.display = "none";
            this._option.getBtnMin().getElement().className = "down";
            this._lblComponentTitle.setVisible(true);
        }
        else {
            var divs = $(this._element).children("div");
            divs[2].style.display = "";
            divs[3].style.display = "";
            this._option.getBtnMin().getElement().className = "up";
            this._lblComponentTitle.setVisible(false);
        }
    }
});


//display
businesscomponents.fillquestion.ui.display = {};


businesscomponents.fillquestion.ui.display.FillQuestion = function (opt_html) {
    businesscomponents.ui.BusinessComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.fillquestion.ui.display.FillQuestion.html)[0]);

    this._elementContainer = $(this._element).find("div").get(1);
    this._lblTitle = new toot.ui.Label($(this._element).find("div").get(0)); this._lblTitle.setVisible(false);
    this._txtAnswers = null;
    this._rightAnswers = null;

    this._parser.setRequest(businesscomponents.fillquestion.model.FillQuestion.parse);
    this._parser.setResponse(businesscomponents.fillquestion.model.FillQuestionResponse.parse);
};
toot.inherit(businesscomponents.fillquestion.ui.display.FillQuestion, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.fillquestion.ui.display.FillQuestion, {
    updateUIByModel: function () {
        if (!this.getRequestModel())
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._lblTitle.setText(this.getRequestModel().getTitle());
        this._txtAnswers = [];
        this._rightAnswers = [];

        var $elementContainer = $(this._elementContainer);
        $elementContainer.html(this.getRequestModel().getContent());
        var gis = $elementContainer.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gi);
            var type = $gi.attr("gi");
            var group = $gi.attr("group");
            if (type == "longfill")
                var elementEdit = $('<input gi="longfill" type="text" spellcheck="false" class="long" onfocus="this.className=\'long focus\'" onblur="this.className=\'long\'">').get(0);
            else if (type == "shortfill") {
                if (group) {                  
                    var elementEdit = $('<input gi="shortfill" type="text" spellcheck="false" class="textstyle10"  group="' + group + '"  >').get(0);
                }
                else {
                    var elementEdit = $('<input gi="shortfill" type="text" spellcheck="false" class="textstyle10"  >').get(0);
                }
            }
            //remove old version
            //                var elementEdit = $('<input gi="shortfill" type="text" class="short" onfocus="this.className=\'short focus\'" onblur="this.className=\'short\'">').get(0);

            this._rightAnswers.push(gi.value);

            gi.parentNode.replaceChild(elementEdit, gi);
        }
        var inputs = $elementContainer.find('[gi]');
        for (var i = 0, l = inputs.length; i < l; i++)
            this._txtAnswers.push(new toot.ui.TextBox(inputs[i]));

        if (this.getResponseModel())
            for (var i = 0, l = this._txtAnswers.length; i < l; i++)
                this._txtAnswers[i].setValue(this.getResponseModel().getAnswers()[i]);
    },
    updateModelByUI: function () {
        this._setResponseModelIfNull(businesscomponents.fillquestion.model.FillQuestionResponse);
        if (!this._txtAnswers) {
            this.getResponseModel().setAnswers(null);
            return;
        }
        var answers = [];
        for (var i = 0, l = this._txtAnswers.length; i < l; i++) {
            var answer = this._txtAnswers[i].getValue();
            answers.push(answer === "" ? null : answer);
        }
        this.getResponseModel().setAnswers(answers);
    },

    getRightWrong: function () {
        if (!(this._rightAnswers && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        var rightWrong = new businesscomponents.model.RightWrong();
        for (var i = 0, l = this._rightAnswers.length; i < l; i++) {
            var rightAnswer = this._rightAnswers[i];
            var answer = this.getResponseModel().getAnswers()[i];
            if (rightAnswer == answer) rightWrong.setRight(rightWrong.getRight() + 1);
            else rightWrong.setWrong(rightWrong.getWrong() + 1);
        }
        return rightWrong;
    }
});
businesscomponents.fillquestion.ui.display.FillQuestion.html = '<div class="marbom"><div></div><div></div></div>';
businesscomponents.fillquestion.ui.display.FillQuestion.html1 = '<div class="clearfix marT10"><div></div><div></div></div>';


//displayfinish
businesscomponents.fillquestion.ui.displayfinish = {};

businesscomponents.fillquestion.ui.displayfinish.Fill = function () {
    businesscomponents.ui.RnRItem.call(this, $('<a></a>').get(0));
    this._lblAnswer = new toot.ui.Label(this._element);
};
toot.inherit(businesscomponents.fillquestion.ui.displayfinish.Fill, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.fillquestion.ui.displayfinish.Fill, {
    updateUIByModel: function () {
        //        if (this.getResponseModel() == "null") this._lblAnswer.setText("未作答");
        this._lblAnswer.setText(this.getResponseModel() ? this.getResponseModel() : "未作答");

        var answer = this.getResponseModel() ? this.getResponseModel() : "";
        var rightAnswer = this.getRequestModel() ? this.getRequestModel() : "";

        /**
        Standard answer : "I live in New York".
        Omit all whitespaces -> "I,live,in,New,York".
        ONLY two answers are correct
        1. EXACTLY and CASE-SENSITIVELY the same as the answer -> "I,live,in,New,York".
        2. EXACTLY the same as the answer in UPPERCASE         -> 'I,LIVE,IN,NEW,YORK'. 
        **/

        var resultOriginal = false;
        var resultUppercase = false;
        var answerSplit = $.trim(answer).split(/\s+/g);
        var rightAnswerSplit = $.trim(rightAnswer).split(/\s+/g);

        if (answerSplit.length == rightAnswerSplit.length) {
            resultOriginal = true;
            for (var i = 0, l = answerSplit.length; i < l; i++)
                if (rightAnswerSplit[i] != answerSplit[i]) {
                    resultOriginal = false;
                    break;
                }
        }

        if (!resultOriginal) {
            var rightAnswerUppercaseSplit = $.trim(rightAnswer.toUpperCase()).split(/\s+/g);
            if (answerSplit.length == rightAnswerUppercaseSplit.length) {
                resultUppercase = true;
                for (var i = 0, l = answerSplit.length; i < l; i++) {
                    if (rightAnswerUppercaseSplit[i] != answerSplit[i]) {
                        resultUppercase = false;
                        break;
                    }
                }
            }
        }

        if (resultOriginal || resultUppercase)
            this._lblAnswer.getElement().className = "right";
        else {
            this._lblAnswer.getElement().className = "wrong";
            this._lblAnswer.getElement().title = this.getRequestModel();
        }
    }
});


businesscomponents.fillquestion.ui.displayfinish.FillQuestion = function () {
    businesscomponents.ui.BusinessComponentBase.call(this,
       $('<div><div></div><div></div></div>').get(0));

    this._elementContainer = $(this._element).find("div").get(1);
    this._lblTitle = new toot.ui.Label($(this._element).find("div").get(0)); this._lblTitle.setVisible(false);
    this._fills = null;

    this._parser.setRequest(businesscomponents.fillquestion.model.FillQuestion.parse);
    this._parser.setResponse(businesscomponents.fillquestion.model.FillQuestionResponse.parse);
};
toot.inherit(businesscomponents.fillquestion.ui.displayfinish.FillQuestion, businesscomponents.ui.BusinessComponentBase);
toot.extendClass(businesscomponents.fillquestion.ui.displayfinish.FillQuestion, {
    updateUIByModel: function () {
        if (!(this.getRequestModel() && this.getResponseModel()))
            throw businesscomponents.ui.Exception.MODEL_INPUT_ERR;

        this._lblTitle.setText(this.getRequestModel().getTitle());

        this._fills = [];
        var $elementContainer = $(this._elementContainer);
        $elementContainer.html(this.getRequestModel().getContent());
        var gis = $elementContainer.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gi);
            var type = $gi.attr("gi");
            if (type == "longfill" || type == "shortfill") {
                var fill = new businesscomponents.fillquestion.ui.displayfinish.Fill();
                fill.setRequestModel(gi.value);
                fill.setResponseModel(this.getResponseModel().getAnswers()[i]);
                fill.updateUIByModel();
                gi.parentNode.replaceChild(fill.getElement(), gi);
                this._fills.push(fill);
            }
        }

    }
});


//default
businesscomponents.fillquestion.ui.edit.createDefaultUIFillQuestion = function () {
    var ui = new businesscomponents.fillquestion.ui.edit.FillQuestion();
    return ui;
};


