var businesscomponents = businesscomponents || {};

businesscomponents.TextMarkerToeflReadingDisplay = function () {
    businesscomponents.TextMarkerToeflReadingDisplay.superClass.constructor.call(this);
    if (this.constructor == arguments.callee) this._init();
}
toot.inherit(businesscomponents.TextMarkerToeflReadingDisplay, businesscomponents.TextMarker);
toot.extendClass(businesscomponents.TextMarkerToeflReadingDisplay, {
    _question: null,
    getQuestion: function () { return this._question },
    setQuestion: function (question) { this._question = question },


    _getEffectiveHtmlForMarksCalculating: function () {
        if (this._question == null) {
            return businesscomponents.TextMarkerToeflReadingDisplay.superClass._getEffectiveHtmlForMarksCalculating.call(this);
        }
        else if (this._question.type == 3 || this._question.type == 4) {
            return this._element.innerHTML.replace(/<!--x-->(.|\n)*?<!--x-->/g, '');
        }
    },

    _getHtmlByEffectiveMarks: function (marks) {
        if (this._question == null) {
            return businesscomponents.TextMarkerToeflReadingDisplay.superClass._getHtmlByEffectiveMarks.call(this, marks);
        }
        else if (this._question.type == 3 || this._question.type == 4) {
            var positions = [];

            for (var i = 0, l = marks.length; i < l; i++) {
                positions.push({ type: 1, at: marks[i].start });
                positions.push({ type: 2, at: marks[i].end });
            }

            if (this._question.type == 3) {
                var question = this._question;
                if (question.q.getContent().getLocations()) {
                    for (var i = 0; i < question.q.getContent().getLocations().length; i++) {
                        if (question.q.getContent().getType() == 1) {
                            positions.push({ type: 31, at: question.q.getContent().getLocations()[i].getStart() });
                            positions.push({ type: 32, at: question.q.getContent().getLocations()[i].getEnd() });
                        }
                        else {
                            positions.push({ type: 33, at: question.q.getContent().getLocations()[i].getStart() });
                            positions.push({ type: 34, at: question.q.getContent().getLocations()[i].getEnd() });
                        }
                    }
                }
            }
            else if (this._question.type == 4) {
                var question = this._question;
                if (question.q.getContent().getLocations()) {
                    for (var i = 0; i < question.q.getContent().getLocations().length; i++) {
                        positions.push({ type: 41, at: question.q.getContent().getLocations()[i] - i * 2 });
                    }
                }
            }

            //sort 
            var l = positions.length;
            while (l > 1) {
                for (var i = 0; i < l - 1; i++) {
                    var position1 = positions[i];
                    var position2 = positions[i + 1];
                    if (position1.at > position2.at) {
                        positions[i] = position2;
                        positions[i + 1] = position1;
                    }
                    else if (position1.at == position2.at) {
                        if (position1.type == 1) {
                            positions[i] = position2;
                            positions[i + 1] = position1;
                        }
                        if (position2.type == 2) {
                            positions[i] = position2;
                            positions[i + 1] = position1;
                        }
                    }
                }
                l--;
            }
            positions.unshift({ type: 0, at: 0 });
            positions.push({ type: 0, at: this._getModelNotNull().length });

            var texts = [];
            for (var i = 1, l = positions.length; i < l; i++) {
                texts.push((this._getModelNotNull()).substring(positions[i - 1].at, positions[i].at));
                switch (positions[i].type) {
                    case 1:
                    case 2: texts.push('<!--m-->'); break;
                    case 31: texts.push('<!--x--><span class="readboxlefta" gi="MarkedQuestion" style="margin-right:6px"></span><!--x-->'); break;
                    case 32: texts.push(''); break;
                    case 33: texts.push('<!--x--><font style="background-color:#d5d2d6;" gi="MarkedQuestion"><!--x-->'); break;
                    case 34: texts.push('<!--x--></font><!--x-->'); break;
                    case 41: texts.push('<!--x--><span gi="SentenceQuestion" style="cursor:pointer" class="IconStyle1"></span><!--x-->'); break;
                }
            }
            var html = texts.join('');

            return html;
        }
    }
});