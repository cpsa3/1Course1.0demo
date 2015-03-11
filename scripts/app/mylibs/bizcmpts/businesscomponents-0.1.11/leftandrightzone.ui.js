/*
* 功能:SAT 做题页面 左右分区UI 仅适用于SAT阅读、SAT语法、SAT数学
* 作者:小潘
* 日期:2014年3月12日 16:40:09
* warning: 强依赖choicequestionforsat.ui.js
*/


//warning :特殊组件-提供给SAT语法、数学、阅读使用，强依赖dom、不可复用   注入questionGroup  
//示例var uiQuestion=new businesscomponents.leftandrightzone.ui.Display()
//uiQuestion.setType(1);
//uiQuestion.setQuestionGroupModel(model);
//uiQuestion.updateUIByModel


//拿取questionGroup Response Model 方法 
//warning ： 有两个questionGroup对象
//uiQuestion.getLeftQuestionGroup().updateAndGetModelByUI().getResponse();
//

var businesscomponents = businesscomponents || {};

businesscomponents.leftandrightzone = businesscomponents.leftandrightzone || {};

businesscomponents.leftandrightzone.ui = {};
businesscomponents.leftandrightzone.ui.Display = function (opt_html) {

    businesscomponents.ui.ComponentBase.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.leftandrightzone.ui.Display.html)[0]);

    //显示文章
    this._$markLineNumberBox = $(this._element).find('[gi~="markLineNumberBox"]');


    //LeftBox  -- 
    this._leftBox = $(this._element).find('[gi~="ctnQuestionLeftBox"]')[0];

    //RightBox  -- 
    this._rightBox = $(this._element).find('[gi~="ctnQuestionRightBox"]')[0];

    this._leftQuestionGroup = new businesscomponents.choicequestionForSAT.ui.display.QuestionGroup();

    this._rightQuestionGroup = new businesscomponents.choicequestionForSAT.ui.display.QuestionGroup();


    this._questionGroupModel = null;
    //文章阅读，文案显示类型 0为对比文章、1为独立文章
    this._readingType = 0;

};
toot.inherit(businesscomponents.leftandrightzone.ui.Display, businesscomponents.ui.ComponentBase);

toot.extendClass(businesscomponents.leftandrightzone.ui.Display, {

    updateUIByModel: function () {

        if (this._questionGroupModel && this._type) {

            if (this._type == 1) {
                //完成句子
                var leftCount, rightCount, count, leftModel, rightModel;

                //                var leftModel = {};
                leftModel = $.extend(true, {}, this._questionGroupModel);

                //                var rightModel = {};
                rightModel = $.extend(true, {}, this._questionGroupModel);

                count = this._questionGroupModel.getQuestions().length;
                leftCount = Math.ceil(count / 2);
                rightCount = count - leftCount;



                //leftBox start
                leftModel.getQuestions().splice(leftCount, count);
                this._leftQuestionGroup.getModel().setRequest(leftModel);
                this._leftQuestionGroup.updateUIByModel();
                //                this._leftBox.appendChild($(this._leftQuestionGroup.getElement()).clone()[0]);
                this._leftBox.appendChild(this._leftQuestionGroup.getElement());

                //leftBox end


                //rightBox start

                rightModel.getQuestions().splice(0, leftCount);

                this._rightQuestionGroup.getModel().setRequest(rightModel);
                this._rightQuestionGroup.updateUIByModel();
                //                this._rightBox = this._rightBox.appendChild(this._leftQuestionGroup.getElement());


                this._rightBox.appendChild(this._rightQuestionGroup.getElement());

                //add start attribute
                this._rightQuestionGroup.setStartAttr(leftCount + 1);


                //rightBox end

                this._$markLineNumberBox.hide();

                //                //还原原始model
                //                this._leftQuestionGroup.getModel().setRequest(this._questionGroupModel);
                //                this._leftQuestionGroup.updateUIByModel();
            } else {
                //文章阅读

                this._leftQuestionGroup.getModel().setRequest(this._questionGroupModel);
                this._leftQuestionGroup.updateUIByModel();
                this._leftBox.appendChild(this._leftQuestionGroup.getElement());
                //                $(this._rightBox).html(this._leftQuestionGroup.getTitle());
                this._$markLineNumberBox.html(this._leftQuestionGroup.getTitle());
                this._readingType = this._leftQuestionGroup.getModel().getRequest().getType();
            }

        }
    },


    //设置questionGroup所需model
    setQuestionGroupModel: function (model) {
        this._questionGroupModel = model;
        //        this.updateUIByModel();
    },
    //1为完成句子、2为文章阅读
    setType: function (type) {
        this._type = type;
    },
    getType: function () {
        return this._type;
    },
    getLeftQuestionGroup: function () {
        return this._leftQuestionGroup;
    },
    getRightQuestionGroup: function () {
        return this._rightQuestionGroup;
    },
    getReadingType: function () {
        return this._readingType;
    }
});

businesscomponents.leftandrightzone.ui.Display.html = '<div><div class="fl questionbox8inner" gi="ctnQuestionLeftBox"></div><div class="fr questionbox8inner" gi="ctnQuestionRightBox"><div class="marB15 MarkLineNumberBox" gi="markLineNumberBox"></div></div></div>';
