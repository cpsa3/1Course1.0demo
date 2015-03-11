var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.fillquestion = businesscomponents.editors.fillquestion || {};

businesscomponents.editors.fillquestion.Question = function (opt_html) {
    businesscomponents.editors.fillquestion.Question.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.editors.RichText.html)[0]);

    var _this = this;
    //组的标示
    this.groupMark = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    //    this._btnAdd = new toot.ui.Button($("<span>ADD</span>")[0]);
    //    this._btnAdd.appendTo(this._element) ;
    this._iv.getLbl2().setText("题目");
    this._isShowPlaceHold = "false";
    this._placeHoldContent = "";

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.fillquestion.Question, businesscomponents.editors.RichText);
toot.extendClass(businesscomponents.editors.fillquestion.Question, {

    setIsShowPlaceHold :function(isShowPlaceHold){
        this._isShowPlaceHold = isShowPlaceHold;
    },
    setPlaceHoldContent:function(placeHoldContent){
        this._placeHoldContent = placeHoldContent;
    },
    _configFile: '/content3/Scripts/ckeditorconfigs/fillquestion.js',
    _attachCKFinder: true,

    //    _init_manageEvents: function () {
    //        businesscomponents.editors.fillquestion.Question.superClass._init_manageEvents.call(this);
    //        toot.connect(this._btnAdd, "action", this, this._onBtnAddAction);
    //    },
    _onBtnFillAssortedAction: function () {
        //这个路径其实没有，只有这个有用fillgroupquestion，基于原来是这样的写法，我也不做改动

    },
    _onBtnAddAction: function () {
        var fillAnswer = this._rte.document.createElement('input');
        //  DOM:   <input type="text" class="textstyle4" gi="shortfill">

        fillAnswer.setAttributes({
            "type": "text",
            "class": "textstyle4",
            "gi": "shortfill",
            "isshowplacehold": this._isShowPlaceHold,
            "placeholdcontent": this._placeHoldContent
            //            "value": _this.getValueOf("fill", "fillAnswer")
        });
        //appendto edito
        this._rte.insertElement(fillAnswer);
        //        this._rte.insertHtml('<input type="text" class="textstyle4" gi="shortfill">');
    },
    _onBtnAddGroupAction: function (rte) {
        rte.commands.InsertFill.setState(CKEDITOR.TRISTATE_DISABLED);
        rte.commands.GroupFinish.setState(CKEDITOR.TRISTATE_OFF);
        //找到添加组按钮只有一个+
        //$("#cke_" + parseInt(id.split("_")[1] - 2)).css("display", "none");
        var _this = this;
        var groupName;
        if (_this.groupMark.length > 0) {
            groupName = _this.groupMark[0];
        }
        else {
         //到上限是去检测页面元素，中间可能会删除组，里面没有任何响应数据。还是重新检测下
            _this._onBtnFinishGroupAction();
            if (_this.groupMark.length > 0) {
                rte.commands.InsertFill.setState(CKEDITOR.TRISTATE_DISABLED);
                rte.commands.GroupFinish.setState(CKEDITOR.TRISTATE_OFF);
                groupName = _this.groupMark[0];
            } else {
                rte.commands.InsertFill.setState(CKEDITOR.TRISTATE_OFF);
                rte.commands.InsertFillGroup.setState(CKEDITOR.TRISTATE_OFF);
                rte.commands.GroupFinish.setState(CKEDITOR.TRISTATE_DISABLED);
                alert("已经到达组上限");
                return;
            }
        }

        var fillAnswer = this._rte.document.createElement('input');
        //  DOM:   <input type="text" class="textstyle4" gi="shortfill">
        var _this = this;
        fillAnswer.setAttributes({
            "type": "text",
            "class": "textstyle4_2 border_colorS" + groupName,
            "gi": "shortfill",
            "group": groupName,
            "isshowplacehold": this._isShowPlaceHold,
            "placeholdcontent": this._placeHoldContent
            //            "value": _this.getValueOf("fill", "fillAnswer")
        });
        //appendto edito
        this._rte.insertElement(fillAnswer);
    },
    _onBtnFinishGroupAction: function () {
        var _this = this;
        //组的标示
        //每次完成都要去查询现有组
        this.groupMark = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        var $div = $('<div>' + this._rte.getData() + '</div>');
        var groupInput = $div.find('[group]');
        var currentGroup = [];
        for (var i = 0, l = groupInput.length; i < l; i++) {
            currentGroup.push($(groupInput[i]).attr("group"));
        }
        for (var i = 0; i < currentGroup.length; i++) {
            for (var j = 0; j < _this.groupMark.length; j++) {
                if (currentGroup[i] == _this.groupMark[j]) {
                    _this.groupMark.splice(j, 1);
                }
            }
        }
    },
    updateUIByModel: function () {
        if (!(this._model && this._model.getContent())) {
            //            this._txtTitle.setValue(null);
            this._viewState = businesscomponents.editors.ViewState.Initial;
            this._renderViewState();
            if (this._rte) this._rte.setData(null);
            return;
        }

        //        this._txtTitle.setValue(this._model.getTitle());
        this._viewState = businesscomponents.editors.ViewState.Edit;
        this._renderViewState();


        var $div = $('<div></div>').html(this._model.getContent());
        var gis = $div.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gi);
            var type = $gi.attr("gi");
            var group = $gi.attr("group");
            var value = gi.value.replace(/"/g, '&quot;');
            if (type == "longfill")
                var elementEdit = $('<input gi="longfill" type="text" style="width: 403px" value="' + value + '" />').get(0);
            else if (type == "shortfill") {
                if (group) {
                    var elementEdit = $('<input gi="shortfill" type="text" class="textstyle4_2 border_colorS' + group + '"  value="' + value + '"  group="' + group + '" />').get(0);
                }
                else {
                    var elementEdit = $('<input gi="shortfill" type="text" class="textstyle4" value="' + value + '" />').get(0);
                }
            }
            $(elementEdit).val(gi.value);

            gi.parentNode.replaceChild(elementEdit, gi);
        }
        this._rte.setData($div.html());
        //初始化下组
        this._onBtnFinishGroupAction();
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.components.fillquestion.FillQuestion();
        //        this._model.setTitle(this._txtTitle.getValue());

        if (this._viewState == businesscomponents.editors.ViewState.Initial) return;

        var $div = $('<div>' + this._rte.getData() + '</div>');
        var gis = $div.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gis[i]);
            var group = $gi.attr("group");

            if (group) {
                var elementVal = $('<input group="' + group + '" gi="' + $gi.attr("gi") + '" type="hidden">').get(0);
                elementVal.value = gi.value;
                gi.parentNode.replaceChild(elementVal, gi);
            }
            else {
                var elementVal = $('<input gi="' + $gi.attr("gi") + '" type="hidden">').get(0);
                elementVal.value = gi.value;
                gi.parentNode.replaceChild(elementVal, gi);
            }
        }
        this._model.setContent($div.html());
    },
    validate: function () {
        var _validate = true;
        if (!this._model) this._model = new models.components.fillquestion.FillQuestion();
        //        this._model.setTitle(this._txtTitle.getValue());

        if (this._viewState == businesscomponents.editors.ViewState.Initial) return _validate;

        var $div = $('<div>' + this._rte.getData() + '</div>');
        var gis = $div.find('[gi]');
        for (var i = 0, l = gis.length; i < l; i++) {
            var gi = gis[i];
            var $gi = $(gis[i]);
            var elementVal = $('<input gi="' + $gi.attr("gi") + '" type="hidden">').get(0);
            //有空格没写正确答案
            if (gi.value == "") {
                _validate = false;
                return _validate;
            }
        }
        return _validate;
    },
    _setupRTE: function () {
        businesscomponents.editors.fillquestion.Question.superClass._setupRTE.call(this);
        var _this = this;
        this._rte.addCommand("InsertFill", {
            exec: function () {
                _this._onBtnAddAction();
            }
        });
        this._rte.ui.addButton('InsertFill', {
            label: '插入填空',
            command: 'InsertFill'
        });

        this._rte.addCommand("InsertFillGroup", {
            exec: function () {
                _this._onBtnAddGroupAction(_this._rte);

            }
        });
        this._rte.ui.addButton('InsertFillGroup', {
            label: '插入填空组',
            command: 'InsertFillGroup'
        });

        this._rte.addCommand("GroupFinish", {
            exec: function () {
                _this._onBtnFinishGroupAction();
                _this._rte.commands.InsertFill.setState(CKEDITOR.TRISTATE_OFF);
                _this._rte.commands.InsertFillGroup.setState(CKEDITOR.TRISTATE_OFF);
                _this._rte.commands.GroupFinish.setState(CKEDITOR.TRISTATE_DISABLED);
            }
        });
        this._rte.ui.addButton('GroupFinish', {
            label: '完成',
            command: 'GroupFinish',
            state: 0
        });
    },

    _minHeight: 200
});
