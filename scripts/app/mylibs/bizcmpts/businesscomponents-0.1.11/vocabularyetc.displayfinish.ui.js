/*
* 功能:词汇训练 报告页
* 作者:小潘
* 日期：2014年2月27日 13:45:10
*/

var businesscomponents = businesscomponents || {};

businesscomponents.vocabularyetc = businesscomponents.vocabularyetc || {};

businesscomponents.vocabularyetc.ui = businesscomponents.vocabularyetc.ui || {};

businesscomponents.vocabularyetc.ui.displayfinish = businesscomponents.vocabularyetc.ui.displayfinish || {};

businesscomponents.vocabularyetc.ui.displayfinish.Question = function(optHtml) {

    toot.ui.Component.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.vocabularyetc.ui.displayfinish.Question.HTML)[0]);


//题目总数
    this._$count = $(this._element).find('[gi~="count"]');
    //正确个数
    this._$right = $(this._element).find('[gi~="right"]');
    //错误个数
    this._$wrong = $(this._element).find('[gi~="wrong"]');
    //正确率
    this._$accuracy = $(this._element).find('[gi~="accuracy"]');


    //answers obj
    this._answers = null;
    //questions obj
    this._questions = null;

};
//inherit toot.ui.Component
toot.inherit(businesscomponents.vocabularyetc.ui.displayfinish.Question, toot.ui.Component);


//可尝试用List渲染
toot.extendClass(businesscomponents.vocabularyetc.ui.displayfinish.Question, {
    updateUIByModel: function() {
        if (this._answers.getAnswers() && this._questions && (this._questions.length == this._answers.getAnswers().length)) {
            //渲染
            var questionCount = this._questions.length;
            var rightCount = 0;
            var wrongCount = 0;
            for (var i = 0; i < this._questions.length; i++) {

                var answerBox = new businesscomponents.vocabularyetc.ui.displayfinish.Question.AnswerBox();
                //题目
                answerBox._$question.text(this._questions[i].getEnglishWord());
                //参考答案
                answerBox._$reference.text(this._questions[i].getChineseWord());
                //您的答案
                answerBox._$answer.text(this._answers.getAnswers()[i].getAnswer());
                //正误
//                    this._correct = this._answer[i].getIsRight();
                //图标 ：正确：rightIcon 、错误：wrongIcon，正确2：rightIcon2
                //新增英译中批改判断 isRight3 -sue
                if (this._answers.getAnswers()[i].getIsRight3()) {//批改扭转修改 by-sf
					 rightCount++;
                	 answerBox._$rightIcon.addClass("rightIcon3");
				}else{
					if(this._answers.getAnswers()[i].getIsRight3() == undefined){
					     if (this._answers.getAnswers()[i].getIsRight()) {
		                    //正确：rightIcon
		                    rightCount++;
		                    answerBox._$rightIcon.addClass("rightIcon");
		                  } else {
			                    if (this._answers.getAnswers()[i].getIsRight2()) {
			                        //正确2：rightIcon2
			                        rightCount++;
			                        answerBox._$rightIcon.addClass("rightIcon2");
			                    } else {						
				                        //错误：wrongIcon
				                        answerBox._$rightIcon.addClass("wrongIcon");
				                        wrongCount++;
			                    }
		                   }
					}else{
						//错误：wrongIcon
				        answerBox._$rightIcon.addClass("wrongIcon");
				        wrongCount++;
					}

				}
          
           

                $(this.getElement()).append($(answerBox.getElement()));
            }
            //answerCountBox UI
            //题目总数
            this._$count.text(questionCount);
            //正确个数
            this._$right.text(rightCount);
            //错误个数
            this._$wrong.text(wrongCount);
            //正确率
            this._$accuracy.text(Math.floor(rightCount * 100 / questionCount) + "%");
        }
    },
    //传入answers和questions
    setAnswersAndQuestions: function(answers, questions) {
        this._answers = answers;
        this._questions = questions;
        this.updateUIByModel();
    }

});


businesscomponents.vocabularyetc.ui.displayfinish.Question.HTML = '<div>' +
    '<table gi="answerCountBox" class="TipsboxStyle5"><tr>' +
    '<td>共<span gi="count">15</span>题，<span gi="right">5</span></td><td><em class="rightIcon"></em></td>' +
    '<td>，<span gi="wrong">10</span></td><td><em class="wrongIcon"></em></td>' +
    '<td>，您的正确率为<span gi="accuracy" class="colorTips2" > 30%</span>。</td>' +
    ' </tr></table>' +
    '<dl gi="answerBox" class="questionbox10 clearfix fontb">' +
    '<dt gi="question" class="boxL1">题目</dt>' +
    '<dd gi="reference" class="boxL2">参考答案</dd>' +
    '<dd gi="answer" class="boxL3">您的答案</dd>' +
    '<dd gi="correct" class="boxL4">正误</dd>' +
    '</dl>' +
    '</div>';


businesscomponents.vocabularyetc.ui.displayfinish.Question.AnswerBox = function(optHtml) {

    toot.ui.Component.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.vocabularyetc.ui.displayfinish.Question.AnswerBox.HTML)[0]);


    //题目
    this._$question = $(this._element).find('[gi~="question"]');
    //参考答案
    this._$reference = $(this._element).find('[gi~="reference"]');
    //您的答案
    this._$answer = $(this._element).find('[gi~="answer"]');
    //正误
    this._$correct = $(this._element).find('[gi~="correct"]');
    //图标 ：正确：rightIcon 、错误：wrongIcon，正确2：rightIcon2
    this._$rightIcon = $(this._element).find('[gi~="rightIcon"]');


};
//inherit toot.ui.Component
toot.inherit(businesscomponents.vocabularyetc.ui.displayfinish.Question.AnswerBox, toot.ui.Component);

toot.extendClass(businesscomponents.vocabularyetc.ui.displayfinish.Question.AnswerBox, {
    getAnswerBox: function() {
        return this.getElement();
    }
});

businesscomponents.vocabularyetc.ui.displayfinish.Question.AnswerBox.HTML = '<dl gi="answerBox" class="questionbox10 clearfix ">' +
    '<dt gi="question" class="boxL1"></dt>' +
    '<dd gi="reference" class="boxL2"></dd>' +
    '<dd gi="answer" class="boxL3"></dd>' +
    '<dd gi="correct" class="boxL4"><em gi="rightIcon"></em></dd>' +
    '</dl>';