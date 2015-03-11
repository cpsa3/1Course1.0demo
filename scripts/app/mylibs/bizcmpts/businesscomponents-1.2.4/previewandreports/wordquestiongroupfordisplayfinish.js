//sat语法的插句题 Create by xiaobao 14/3/6

var businesscomponents = businesscomponents || {};

businesscomponents.previewandreports = businesscomponents.previewandreports || {};

businesscomponents.previewandreports.wordquestiongroup = businesscomponents.previewandreports.wordquestiongroup || {};
//组
businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish = function (opt_html) {
    businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish.html)[0]);
    this._questionsui = [];
    this._renderModel = 0; //表示中英都有；1表示英；2表示中
    this._$questionList = $($(this._element).find('[gi~="questionList"]')[0]);
    this._lblQuestionCount = new toot.ui.Label($(this._element).find('[gi~="questionCount"]')[0]);
    this._lblEnglishRightCount = new toot.ui.Label($(this._element).find('[gi~="englishRightCount"]')[0]);
    this._lblEnglishErrorCount = new toot.ui.Label($(this._element).find('[gi~="englishErrorCount"]')[0]);
    this._lblEnglishRight = new toot.ui.Label($(this._element).find('[gi~="englishRight"]')[0]);
    this._lblChineseRightCount = new toot.ui.Label($(this._element).find('[gi~="chineseRightCount"]')[0]);
    this._lblChineseErrorCount = new toot.ui.Label($(this._element).find('[gi~="chineseErrorCount"]')[0]);
    this._lblChineseRight = new toot.ui.Label($(this._element).find('[gi~="chineseRight"]')[0]);

    this._$englishCtn = $($(this._element).find('[gi~="englishCtn"]')[0]);
    this._$chineseCtn = $($(this._element).find('[gi~="chineseCtn"]')[0]);
    this._$titleCtn = $($(this._element).find('[gi~="titleCtn"]')[0]);
    this._$titleCtn1 = $($(this._element).find('[gi~="titleCtn1"]')[0]);
    //播放器
    this._myJwplayer = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish, toot.view.ViewBase);
toot.defineEvent(businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish, "renderComplete");
toot.extendClass(businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish, {

    updateUIByModel: function () {
        if (this._model) {
            //统计总的个数
            this._lblQuestionCount.setText(this._model.getChannelQ().length);
            var answers = this._model.getChannelA();
            var questions = this._model.getChannelQ();
            var englishRightCount = 0;
            var chineseRightCount = 0;
            for (var i = 0; i < questions.length; i++) {
            	
            	if(answers[i].getChineseAnswer().getIsRight3()){
            		chineseRightCount++;
            	}else{
					if(answers[i].getChineseAnswer().getIsRight3() == undefined){
		                if (answers[i].getChineseAnswer().getIsRight() || answers[i].getChineseAnswer().getIsRight2() ) {
		                    chineseRightCount++;
		                }
					}
				}
				if(answers[i].getEnglishAnswer().getIsRight3()){
					 englishRightCount++;
				}else{
					if(answers[i].getEnglishAnswer().getIsRight3()== undefined){
		                if (answers[i].getEnglishAnswer().getIsRight() ) {
		                    englishRightCount++;
		                }
					}
				}
            }
            this._lblEnglishRightCount.setText(englishRightCount);
            this._lblEnglishErrorCount.setText(questions.length - englishRightCount);
            this._lblChineseRightCount.setText(chineseRightCount);
            this._lblChineseErrorCount.setText(questions.length - chineseRightCount);
            this._lblEnglishRight.setText(this._changeTwoDecimal_f(englishRightCount / questions.length));
            this._lblChineseRight.setText(this._changeTwoDecimal_f(chineseRightCount / questions.length));
            //初始化播放器
            this._myJwplayer = null;
            this._playAudio();
            //渲染题
            for (var i = 0; i < questions.length; i++) {
                var item = new models.previewandreports.RenderingItem();
                item.setRenderingType(this._model.getRenderingType());
                //如果是重听回答题

                item.setChannelQ(questions[i]);
                item.setChannelA(answers[i]);

                var question = new businesscomponents.previewandreports.wordquestiongroup.Question();

                question.setRenderModel(this.getRenderModel());

                question.setModelAndUpdateUI(item);
                this._$questionList.append($(question.getElement()));
                this._questionsui.push(question);
                toot.connect(question, "play", this, this._play);
                toot.fireEvent(this, "renderComplete");
            }

        }
        else {

        }
    },

    setRenderModel: function (renderModel) {
        this._renderModel = renderModel;
        this.render();
    },
    getRenderModel: function () {
        return this._renderModel;
    },
    render: function () {
        if (this.getRenderModel() == 2) {
            this._$englishCtn.show();
            this._$chineseCtn.hide();
            this._$titleCtn.hide();
            this._$titleCtn1.show();
        }
        else if (this.getRenderModel() == 1) {
            this._$englishCtn.hide();
            this._$chineseCtn.show();
            this._$titleCtn.hide();
            this._$titleCtn1.show();
        }
        else {
            this._$englishCtn.show();
            this._$chineseCtn.show();
            this._$titleCtn.show();
            this._$titleCtn1.hide();
        }
    },
    _changeTwoDecimal_f: function (x) {
        var s_x = "";
        if (x == 0) {
            s_x = "0";
            return s_x;
        }
        else if (x == 1) {
            s_x = "100";
            return s_x;
        }
        else {
            var tempArray = x.toString().split('.');
            if (tempArray[1].length >= 4) {
                s_x = tempArray[1].substring(0, 4);
            }
            else {
                s_x = tempArray[1].substring(0);
            }
        }
        var index = 0;
        if (s_x.length > 2) {
            s_x = s_x.substring(0, 2) + "." + s_x.substring(2);
        }
        for (var i = 0; i < s_x.length; i++) {
            if (s_x[i] != 0) {
                index = i;
                break;
            }
        }
        if (index == 0 && s_x.length == 1) {
            s_x = s_x + '0';
        }
        else {
            s_x = s_x.substring(index);
        }
        if (s_x.indexOf('.') == 0) {
            s_x = "0" + s_x;
        }
        if (s_x == 0) {
            s_x = "0";
        }
        return s_x;
    },
    _currentQuestionBtn: null,
    _playAudio: function (url, sender) {
        var _this = this;
        this._currentQuestionBtn = sender;
        if (!this._myJwplayer) {
            this._myJwplayer = jwplayer("player").setup({
                flashplayer: "/Scripts/libs/jwplayer/player.swf",
                width: '1',
                height: '1',
                provider: 'sound',
                controlbar: 'bottom'
            });
        } else {
            this._myJwplayer.stop();
            this._myJwplayer.load([{ file: url}]);
            this._myJwplayer.play();
        }
        this._myJwplayer.onComplete(function () {
            _this._currentQuestionBtn._btnPlay.setEnabled(true);
            $(_this._currentQuestionBtn._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        });

    },
    _play: function (sender, e) {
        if (this._currentQuestionBtn) {
            this._currentQuestionBtn._btnPlay.setEnabled(true);
            $(this._currentQuestionBtn._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
        }
        this._playAudio(e.url, sender);

    }
});
businesscomponents.previewandreports.wordquestiongroup.QuestionGroupForDisplayFinish.html =
                                                      '<div class="ReportNewQAbox marT40">' +
															'<div class="ReportQAboxWrap">' +
																'<p>' +
                                                                '本任务共<span class="ReportTotalNum" gi="questionCount">' +
                                                                 '</span>个单词，' +
                                                                 '<span gi="englishCtn">英文正确<span class="ReportCorrectNum" gi="englishRightCount">' +
                                                                  '</span>个，' +
                                                                  '错误<span class="ReportWrongNum" gi="englishErrorCount">' +
                                                                  '</span>个，' +
                                                                  '正确率<span class="ReportCorrectRate" gi="englishRight">' +
                                                                  '</span>%；</span>' +
                                                                  '<span gi="chineseCtn">中文正确<span class="ReportCorrectNum" gi="chineseRightCount">' +
                                                                  '</span>个，' +
                                                                  '错误<span class="ReportWrongNum" gi="chineseErrorCount">' +
                                                                  '</span>个，' +
                                                                  '正确率<span class="ReportCorrectRate" gi="chineseRight">' +
                                                                  '</span>%。</span>' +
                                                                  '</p>' +

                                                                '<table>' +
                                                                    '<tbody gi="questionList">' +
                                                                          '<tr gi="titleCtn">' +
                                                                                    '<th width="140">题目</th>' +
                                                                                    '<th width="140">参考答案</th>' +
                                                                                    '<th width="140">你的答案</th>' +
                                                                                    '<th width="100">正误</th>' +
                                                                                    '<th width="140">参考答案</th>' +
                                                                                    '<th width="140">你的答案</th>' +
                                                                                    '<th>正误</th>' +
                                                                        '</tr>' +
                                                                        '<tr gi="titleCtn1">' +
                                                                                    '<th width="140">题目</th>' +
                                                                                    '<th width="140">参考答案</th>' +
                                                                                    '<th width="140">你的答案</th>' +
                                                                        '</tr>' +
                                                                        '</tbody>' +
                                                                '</table>' +
                                                            '</div>' +
                                                           
														'</div>';




businesscomponents.previewandreports.wordquestiongroup.Question = function (opt_html) {
    businesscomponents.previewandreports.wordquestiongroup.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.previewandreports.wordquestiongroup.Question.html)[0]);
    this._renderModel = 0; //表示中英都有；1表示英；2表示中
    this._displayModel = 0; //0表示预览；1表示做题
    //容器
    this._$audioCtn = $($(this._element).find('[gi~="audioCtn"]')[0]);
    this._$suggestAnswerE = $($(this._element).find('[gi~="suggestAnswerE"]')[0]);
    this._$myAnswerE = $($(this._element).find('[gi~="myAnswerE"]')[0]);
    this._$rightIconE = $($(this._element).find('[gi~="rightIconE"]')[0]);
    this._$suggestAnswerC = $($(this._element).find('[gi~="suggestAnswerC"]')[0]);
    this._$myAnswerC = $($(this._element).find('[gi~="myAnswerC"]')[0]);
    this._$rightIconC = $($(this._element).find('[gi~="rightIconC"]')[0]);

    this._$suggestAnswerC.hide();
    this._$myAnswerC.hide();
    this._$rightIconC.hide();
    this._btnPlay = new toot.ui.Button($(this._element).find('[gi~="btnPlay"]')[0]);
    //播放器
    this._myJwplayer = null;

    toot.connect(this._btnPlay, "action", this, this._btnPlayAction);
    var _this = this;
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.previewandreports.wordquestiongroup.Question, toot.view.ViewBase);
toot.defineEvent(businesscomponents.previewandreports.wordquestiongroup.Question, ["change"]);
toot.defineEvent(businesscomponents.previewandreports.wordquestiongroup.Question, ["error"]);
toot.defineEvent(businesscomponents.previewandreports.wordquestiongroup.Question, ["play"]);
toot.extendClass(businesscomponents.previewandreports.wordquestiongroup.Question, {
    updateUIByModel: function () {
        if (this._model) {
            var question = this._model.getChannelQ();
            var answer = this._model.getChannelA();
            if (this.getRenderModel() == 2) {
                this._$suggestAnswerE.html(question.getEnglishWord());
                this._$myAnswerE.html(answer.getEnglishAnswer().getAnswer());
                if(answer.getEnglishAnswer().getIsRight3()){
                	 this._$rightIconE.attr("class","rightIcon3");
                }else{
                	if(answer.getEnglishAnswer().getIsRight3()==undefined){
                		if (answer.getEnglishAnswer().getIsRight()) {
		                    this._$rightIconE.attr("class","rightIcon");
		                }
		                else {
		                    this._$rightIconE.attr("class","wrongIcon");
		                }
                	}else{
                		this._$rightIconE.attr("class","wrongIcon");
                	}
                }
               
            }
            else if (this.getRenderModel() == 1) {
                this._$suggestAnswerE.html(question.getChineseWord());
                this._$myAnswerE.html(answer.getChineseAnswer().getAnswer());
                if(answer.getChineseAnswer().getIsRight3()){// 新增英译中 听英写英中批改页面判断
                	 this._$rightIconE.attr("class","rightIcon3");
                }else{
                	if(answer.getChineseAnswer().getIsRight3() == undefined){
                		if (answer.getChineseAnswer().getIsRight()) {
		                    this._$rightIconE.attr("class","rightIcon");
		                }
		                else {
		                    if (answer.getChineseAnswer().getIsRight2()) {
		                        this._$rightIconE.attr("class","rightIcon2");
		                    }
		                    else {
		                        this._$rightIconE.attr("class","wrongIcon");

		                    }
		                }
                	}else{
                		this._$rightIconE.attr("class","wrongIcon");
                	}
                	
                }


               

            }
            //默认都显示
            else {
                this._$suggestAnswerC.show();
                this._$myAnswerC.show();
                this._$rightIconC.show();

                this._$suggestAnswerE.html(question.getEnglishWord());
                this._$myAnswerE.html(answer.getEnglishAnswer().getAnswer());
                 if(answer.getEnglishAnswer().getIsRight3()){
                	 this._$rightIconE.attr("class","rightIcon3");
                }else{
                	if(answer.getEnglishAnswer().getIsRight3()==undefined){

		                if (answer.getEnglishAnswer().getIsRight()) {
		                    this._$rightIconE.attr("class","rightIcon");
		                }
		                else {
		                    this._$rightIconE.attr("class","wrongIcon");
		                }
					}else{
						this._$rightIconE.attr("class","wrongIcon");
					}
				}
                //中文
                this._$suggestAnswerC.html(question.getChineseWord());
                this._$myAnswerC.html(answer.getChineseAnswer().getAnswer());
                if(answer.getChineseAnswer().getIsRight3()){// 新增英译中 听英写英中批改页面判断
                	 this._$rightIconC.attr("class","rightIcon3");
                }else{
                	if(answer.getChineseAnswer().getIsRight3() == undefined){
		                if (answer.getChineseAnswer().getIsRight()) {
		                    this._$rightIconC.attr("class","rightIcon");
		                }
		                else {
		                    if (answer.getChineseAnswer().getIsRight2()) {
		                        this._$rightIconC.attr("class","rightIcon2");
		                    }
		                    else {
		                        this._$rightIconC.attr("class","wrongIcon");
		                    }
		                }
                	}else{
                		 this._$rightIconC.attr("class","wrongIcon");
                	}
                }

            }


        }
        else {
            //model 为空时做一些处理
        }
    },
    setRenderModel: function (renderModel) {
        this._renderModel = renderModel;
    },
    getRenderModel: function () {
        return this._renderModel;
    },
    _playAudio: function (url) {
//        var _this = this;
//        if (!this._myJwplayer) {
//            this._myJwplayer = jwplayer("player").setup({
//                flashplayer: "/Scripts/libs/jwplayer/player.swf",
//                width: '0',
//                height: '0',
//                provider: 'sound',
//                file: url,
//                controlbar: 'bottom'
//            });
//        } 
//        else {
//            this._myJwplayer.stop();
//            this._myJwplayer.load([{ file: url}]);
//        }
//        this._myJwplayer.onComplete(function () {
//            _this._btnPlay.setEnabled(true);
//            $(_this._btnPlay.getElement()).removeClass("btn10Pause").addClass("btn10Play");
//        });
        //        this._myJwplayer.play();
        toot.fireEvent(this, "play", { url: url });
    },
    _btnPlayAction: function () {
        this._playAudio(this._model.getChannelQ().getAudioUrl());
        $(this._btnPlay.getElement()).removeClass("btn10Play").addClass("btn10Pause");
        this._btnPlay.setEnabled(false);

    }

});
businesscomponents.previewandreports.wordquestiongroup.Question.html =
                                '<tr>' +
                                    '<td>' +
                                            '<input class="btn10Play" type="button" gi="btnPlay">' +
                                    '</td>'+
                                    '<td gi="suggestAnswerE">' +
                                    '</td>' +

                                    '<td gi="myAnswerE">' +
                                    '</td>' +

                                    '<td >' +
                                        '<span  gi="rightIconE">' +
                                        '</span>' +
                                    '</td>' +

                                    '<td gi="suggestAnswerC">' +
                                    '</td>' +

                                    '<td gi="myAnswerC">' +
                                        '</td>' +

                                    '<td>' +
                                            '<span  gi="rightIconC">' +
                                        '</span>' +
                                    '</td>' +
                                '</tr>'