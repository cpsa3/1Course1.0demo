
var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};


businesscomponents.previewandreports.vocabularyetc = businesscomponents.previewandreports.vocabularyetc || {};

businesscomponents.previewandreports.vocabularyetc.Question = function (optHtml) {

    toot.ui.Component.call(this, $(optHtml !== undefined ? optHtml : businesscomponents.previewandreports.vocabularyetc.Question.HTML)[0]);


    //题目总数
    this._$count = $(this._element).find('[gi~="count"]');
    //正确个数
    this._$right = $(this._element).find('[gi~="right"]');
    //错误个数
    this._$wrong = $(this._element).find('[gi~="wrong"]');
    //正确率
    this._$accuracy = $(this._element).find('[gi~="accuracy"]');
    //显示内容
    this._$tableAnswer = $(this._element).find('[gi~="tableAnswer"]');

    //answers obj
    this._answers = null;
    //questions obj
    this._questions = null;

};
//inherit toot.ui.Component
toot.inherit(businesscomponents.previewandreports.vocabularyetc.Question, toot.ui.Component);


//可尝试用List渲染
toot.extendClass(businesscomponents.previewandreports.vocabularyetc.Question, {
    updateUIByModel: function () {
        if (this._questions) {
            if (!this._answers) {
                this._answers = new models.tasks.vocabularyETC.AnswerContent();
                var tempAnswer = [];
                for (var i = 0; i < this._questions.length; i++) {
                    tempAnswer.push(new models.tasks.vocabularyETC.Answer());
                }
                this._answers.setAnswers(tempAnswer);
            }
        }
        else {
            return;
        }

        if (this._answers.getAnswers() && this._questions && (this._questions.length == this._answers.getAnswers().length)) {
            //渲染
            var questionCount = this._questions.length;
            var rightCount = 0;
            var wrongCount = 0;
            var table = '<table class="ReportQTablebox2"><tbody><tr><th class="TWidth1"></th>' +
            '<th class="TWidth2">序号</th>' +
            '<th>题目</th>' +
            '<th class="TWidth3">学生作答</th>' +
            '<th class="TWidth3">参考答案</th>' +
        '</tr>';
            for (var i = 0; i < this._questions.length; i++) {
                //正确匹配
                if (this._answers.getAnswers()[i].getIsRight()) {
                    table += this._trIsRight1Html(i + 1, this._questions[i].getEnglishWord(), this._answers.getAnswers()[i].getAnswer(), this._questions[i].getChineseWord());
                    //正确：rightIcon
                    rightCount++;

                } else {
                    //字典正确匹配
                    if (this._answers.getAnswers()[i].getIsRight2()) {
                        table += this._trIsRight2Html(i + 1, this._questions[i].getEnglishWord(), this._answers.getAnswers()[i].getAnswer(), this._questions[i].getChineseWord());
                        //正确：rightIcon
                        rightCount++;
                    } else {
                        //答案未填写
                        if (this._answers.getAnswers()[i].getAnswer() == null || $.trim(this._answers.getAnswers()[i].getAnswer()) == '') {
                            table += this._trIsEmptyHtml(i + 1, this._questions[i].getEnglishWord(), this._answers.getAnswers()[i].getAnswer(), this._questions[i].getChineseWord());
                            wrongCount++;
                        }
                        else {
                            //回答错误
                            table += this._trIsWrongHtml(i + 1, this._questions[i].getEnglishWord(), this._answers.getAnswers()[i].getAnswer(), this._questions[i].getChineseWord());
                            wrongCount++;
                        }
                    }
                }
            }
            table += '</tbody></table>';
            this._$tableAnswer.append(table);
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
    //正确匹配
    _trIsRight1Html: function (number, questingStr, stuAnswer, rightAnswer) {
        return '<tr>' +
        	'<td><span class="RightFillbox1"></span></td>' +
            '<td>' + number + '</td>' +
            '<td><div class="Textbox1">' + questingStr + '</div></td>' +
            '<td><div class="Textbox1 ReportRColor"><span class="Textbox2">' + stuAnswer + '</span></div></td>' +
            '<td><div class="Textbox1">' + rightAnswer + '</div></td>' +
       ' </tr>';
    },
    //正确词库匹配
    _trIsRight2Html: function (number, questingStr, stuAnswer, rightAnswer) {
        return '<tr>' +
        	'<td><span class="RightFillbox1"></span></td>' +
            '<td>' + number + '</td>' +
            '<td><div class="Textbox1">' + questingStr + '</div></td>' +
            '<td><div class="Textbox1 ReportRColor"><span class="Textbox2">' + stuAnswer + '</span><span class="ReportRightbox"></span></div></td>' +
            '<td><div class="Textbox1">' + rightAnswer + '</div></td>' +
       ' </tr>';
    },
    //错误
    _trIsWrongHtml: function (number, questingStr, stuAnswer, rightAnswer) {
        return '<tr>' +
        	'<td><span class="WrongFillbox1"></span></td>' +
            '<td>' + number + '</td>' +
            '<td><div class="Textbox1">' + questingStr + '</div></td>' +
            '<td><div class="Textbox1 ReportWColor"><span class="Textbox2">' + stuAnswer + '</span></div></td>' +
            '<td><div class="Textbox1">' + rightAnswer + '</div></td>' +
       ' </tr>';
    },
    //回答为空
    _trIsEmptyHtml: function (number, questingStr, stuAnswer, rightAnswer) {
        return '<tr>' +
        	'<td><span class="NothingFillbox1"></span></td>' +
            '<td>' + number + '</td>' +
            '<td><div class="Textbox1">' + questingStr + '</div></td>' +
            '<td><div class="Textbox1 ReportWColor"><span class="Textbox2">未作答</span></div></td>' +
            '<td><div class="Textbox1">' + rightAnswer + '</div></td>' +
       ' </tr>';
    },
    //传入answers和questions
    setAnswersAndQuestions: function (answers, questions) {
        this._answers = answers;
        this._questions = questions;
        this.updateUIByModel();
    }

});

businesscomponents.previewandreports.vocabularyetc.Question.HTML = '<div class="ReportNewQAbox ReportNewStyle1">' +
                                                                        '<div class="ReportNewQbox">' +
      	                                                                    '本任务共<span gi="count" class="ReportTextboxS1">5</span>个单词，正确<span  gi="right" class="ReportTextboxS1 ReportRColor">3</span>个，错误<span gi="wrong" class="ReportTextboxS1 ReportWColor">2</span>个，正确率<span gi="accuracy" class="ReportTextboxS1">60%</span>' +
                                                                         '</div>' +
                                                                         '<div gi="tableAnswer">' +
                                                                         '</div>' +
                                                                  '</div>';
