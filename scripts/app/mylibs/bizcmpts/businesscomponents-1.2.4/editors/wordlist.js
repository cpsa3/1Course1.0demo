var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.WordList = function () {
    businesscomponents.editors.WordList.superClass.constructor.call(this, $(businesscomponents.editors.WordList.edithtml)[0]);

    this._$questions = $(this._element).find('[gi~="questions"]');
};

toot.inherit(businesscomponents.editors.WordList, toot.view.ViewBase);

toot.extendClass(businesscomponents.editors.WordList, {
    updateUIByModel: function () {
        this._$questions.html("");
        if (this._model) {
            for (var i = 0; i < this._model.length; i++) {
                var num = i + 1;
                var question = businesscomponents.editors.WordHtml(num, this._model[i].getLeftWord(), this._model[i].getRightWord());
                $(question).appendTo(this._$questions);
            }
        }
    },
    updateModelByUI: function () {
        var wordList = [];
        $(this._element).find('[gi~="question"]').each(function () {
            var word = new models.components.word();
            var leftWord = $(this).find("input").eq(0).val();
            var rightWord = $(this).find("input").eq(1).val();
            word.setLeftWord(leftWord);
            word.setRightWord(rightWord);
            wordList.push(word);
        })
        this._model = wordList;
    },
    setModelAndUpdateUI: function (model) {
        this.setModel(model);
        this.updateUIByModel();
    }
});

businesscomponents.editors.WordList.edithtml = '<div class="ChoiceboxGroupOuter" gi="wordQuestion"><div  gi="questions"></div></div>';



businesscomponents.editors.WordHtml = function (num, leftWord, rightWord) {
    return '<div class="marT10 ChoiceboxGroup clearfix" gi="question"><div class="fl optionbox2">' + num + '</div><div class="fr">' +
                        '<input type="text" value="' + leftWord + '" class="textstyle2 StyleW9"/>' +
                        '<input type="text"  value="' + rightWord + '" class="textstyle2 StyleW9"/>' +
                    '</div></div>';
}

