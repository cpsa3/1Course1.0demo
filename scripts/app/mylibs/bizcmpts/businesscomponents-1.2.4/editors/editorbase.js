var businesscomponents = businesscomponents || {};

businesscomponents.editors = businesscomponents.editors || {};

businesscomponents.editors.EditorBase = function () {
    businesscomponents.editors.EditorBase.superClass.constructor.call(this, document.body);

    this._projectList = JSON.parse($("#data-testList").val())
    this._element.className = "taskbodybg";
    this._topbar = new businesscomponents.editors.Topbar();
    //    this._topbar.setZIndex(7000);
    this._topbar.appendTo(this._element);
    this._elementCtnZones = $('<div class="taskMidbox"></div>').appendTo(this._element)[0];
    $('<div class="taskfooter"></div>').appendTo(this._element);
    this._msgBar = new businesscomponents.MessageBar();
    //    this._msgBar.setZIndex(20000);
    this._msgBar.setVisible(false);
    this._msgBar.setMsgDuration(this._defaultMessageDuration);
    this._msgBar.appendTo(this._element);
    //版本化弹框
    this._versionBox = new businesscomponents.VersionBox();
    this._versionBox.appendTo(this._element);
    this._versionBox.setVisible(false);
    this._versionTextBox = new businesscomponents.VersionTextBox();
    this._versionTextBox.appendTo(this._element);
    this._versionTextBox.setVisible(false);
    this._zones = [];
    this._isCreateVersion = true;
    this._oldContent = null;
    this._oldContentStr = "";
    this._oldLevel = "";
    this._oldTotalTime = 0;
    this._version = 0;
    this._oldName = "";
    this._oldSerial = "";
    //解析函数
    this._contentParser;
    this._urlInfo = this._getUrlInfo();

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.editors.EditorBase, toot.view.ViewBase);
toot.extendClass(businesscomponents.editors.EditorBase, {
    _defaultMessageDuration: 3000,

    _init: function () {
        businesscomponents.editors.EditorBase.superClass._init.call(this);
        this._init_editor();

        //窗口高度超过页面高度时，中间部分的高度自动增高 duji
        if ($(window).height() > $("body").height()) {
            $(".taskMidbox").css("min-height", $(window).height() - 90);
        }
    },

    _init_manageEvents: function () {
        businesscomponents.editors.EditorBase.superClass._init_manageEvents.call(this);
        //保存先确认弹框
        toot.connect(this._topbar.getBtnSave(), "action", this, this._confirmVersion);
        toot.connect(this._topbar.getBtnCancel(), "action", this, this._onBtnCancelAction);
        toot.connect(this._topbar.getTxtName(), "change", this, this._onTxtNameChange);
        toot.connect(this._topbar.getTxtNum(), "change", this, this._onTxtNumChange);
        //试做
        toot.connect(this._topbar.getBtnPreview(), "action", this, this._onBtnPreviewAction);
        //版本化保存弹窗
        toot.connect(this._versionBox, "confirm", this, this._versionChangeAction);
        toot.connect(this._versionTextBox, "confirmLeft", this, this._versionSaveAction);
        toot.connect(this._versionTextBox, "confirm", this, this._versionChangeAction);
    },

    _init_editor: function () {

        //        if (this._projectList.length > 0) {
        //            this._topbar.getBtnSave().setEnabled(false);
        //            this._msgBar.setMessage(StatusMessage[2621], this._defaultMessageDuration);
        //        }
    },

    _onBtnCancelAction: function () {
        this._confirm(StatusMessage[2628], function () {
            window.close();
        }, null, null, null, null, null, 90000);
    },
    _onTxtNameChange: function () {
        if ($.trim(this._topbar.getTxtName()) == "")
            this._topbar.getTxtName().setValidationHightlighted(true);
        else
            this._topbar.getTxtName().setValidationHightlighted(false);
    },
    _onTxtNumChange: function () {
        if ($.trim(this._topbar.getTxtNum()) == "")
            this._topbar.getTxtNum().setValidationHightlighted(true);
        else
            this._topbar.getTxtNum().setValidationHightlighted(false);
    },
    _validate: function () {
        if ($.trim(this._model.getSerialId()) == "") {
            this._msgBar.setMessage(StatusMessage[2642], this._defaultMessageDuration);
            this._topbar.getTxtNum().setValidationHightlighted(true);
            return false;
        }
        if ($.trim(this._model.getName()) == "") {
            this._msgBar.setMessage(StatusMessage[2623], this._defaultMessageDuration);
            this._topbar.getTxtName().setValidationHightlighted(true);
            return false;
        }
        if (!this._model.getLevel()) {
            this._msgBar.setMessage(StatusMessage[2624], this._defaultMessageDuration);
            return false;
        }
        if (isNaN(this._model.getTotalTime())) {
            this._msgBar.setMessage(StatusMessage[2625], this._defaultMessageDuration);
            return false;
        }
        return true;
    },

    _getQuestionInfos: function () {
        return null;
    },
    //试做
    _onBtnPreviewAction: function () {
        var _this = this;
        this.updateModelByUI();
        if (!this._validate()) return;
        var data = {};
        data.orgId = this._urlInfo.orgId;
        data.typeId = this._urlInfo.typeId;
        data.userId = this._urlInfo.userId;
        data.token = this._urlInfo.token;
        data.ticks = this._urlInfo.ticks;
        data.question = JSON.stringify(this._model.getContent());
        data.name = this._model.getName();
        openPostWindow("/Task/TestDisplay", data, "result");
    },
    _onBtnSaveAction: function () {
        var _this = this;
        //        this.updateModelByUI();
        //        if (!this._validate()) return;
        var qInfos = this._getQuestionInfos();
        var files = this._gerResourceFiles();
        $.ajax({
            url: "/TaskService/SaveTask?id=" + this._urlInfo.id + "&typeId=" + this._urlInfo.typeId
                + "&orgId=" + this._urlInfo.orgId + "&userId=" + this._urlInfo.userId + "&token=" + this._urlInfo.token + "&ticks=" + this._urlInfo.ticks + "&version=" + this.getVersion() + "&createVersion=" + this._getIsCreateVersion() + "&labelIds=" + this._urlInfo.labels,
            data: {
                //修改了去掉编号前后空格,修改时间：5.23 下午5点 修改人：文艺
                serialId: $.trim(this._model.getSerialId()),
                name: this._model.getName(),
                level: this._model.getLevel(),
                totalTime: this._model.getTotalTime(),
                content: JSON.stringify(this._model.getContent()),
                questionInfos: JSON.stringify(qInfos == null ? null : model.core.QuestionInfo.convert(qInfos)),
                resourceFiles: JSON.stringify(files)
            },
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (json) {
                if (json.status == 1) {
                    if (window.taskAfterSaved) taskAfterSaved();
                    if (typeof window.onFinishSuccess == "function")
                        window.onFinishSuccess();
                    _this._confirm(StatusMessage[2626],
                        function () {
                            window.close();
                        }, function () {
                            //不关闭页面需要重新设置老的Model
                            var tempObj = {};
                            $.extend(true, tempObj, _this._model);
                            _this.setOldContent(_this.getContentParser()(JSON.parse(JSON.stringify(_this._model.getContent()))));
                            _this.setOldContentStr(JSON.stringify(_this._model.getContent()));
                            _this.setOldLevel(tempObj.getLevel());
                            _this.setOldTotalTime(_this._model.getTotalTime());

                            _this.setVersion(json.version);
                        });
                    location.hash = "id=" + json.id;
                    _this._urlInfo = _this._getUrlInfo();
                } else {
                    _this._msgBar.setMessage(StatusMessage[json.code], _this._defaultMessageDuration);
                    //                    greedyint.dialog.error(StatusMessage[2611], StatusMessage[json.code]);
                }
                _this._topbar.getBtnSave().setEnabled(true);
            },
            error: function (httpRequest, statusText) {
                //异常提示登录
                if (httpRequest.status == 497 || httpRequest.status == 498) {
                    var v = new greedyintLogin();
                    v.show(_this._urlInfo.orgId, 2);
                } else {
                    greedyint.common.DealStatus(httpRequest, statusText);
                }
                _this._topbar.getBtnSave().setEnabled(true);
            }
        });
        this._topbar.getBtnSave().setEnabled(false);
    },

    updateUIByModel: function () {
        if (this._model) {
            this._topbar.setModel(this._topbar.getModel() || new businesscomponents.editors.Topbar.Model());
            this._topbar.getModel().setName(this._model.getName());
            this._topbar.getModel().setLevel(this._model.getLevel());
            this._topbar.getModel().setNum(this._model.getSerialId());
            this._setLimitTimes();
            this._topbar.updateUIByModel();
            this._setLimitTimeNames();
        } else {
            this._topbar.setModelAndUpdateUI(null);
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new models.core.TaskQuestion();
        var modelTopbar = this._topbar.updateAndGetModelByUI();
        this._model.setName(modelTopbar.getName());
        this._model.setLevel(modelTopbar.getLevel());
        this._model.setTotalTime(modelTopbar.getTimeInput().getTotalTime());
        this._model.setSerialId(modelTopbar.getNum());
    },

    _setLimitTimes: function () {
    },
    _setLimitTimeNames: function () {
    },

    //    _addZone: function (zone) {
    //        this._zones.push(zone);
    //        this._elementCtnZones.appendChild(zone.getElement());
    //    },
    //    _removeZone: function (zone) {
    //        var idx = this._zones.indexOf(zone);
    //        if (idx != -1) {
    //            this._zones.splice(idx, 1);
    //            this._elementCtnZones.removeChild(zone.getElement());
    //        }
    //    },

    _getUrlInfo: function () {
        var defaultInfo = { canChangeStruct: true };
        var infoFromSearch = this._parseUrlParas(location.search);
        var infoFromHash = this._parseUrlParas(location.hash);
        for (var p in infoFromSearch)
            defaultInfo[p] = infoFromSearch[p];
        for (var p in infoFromHash)
            defaultInfo[p] = infoFromHash[p];
        return defaultInfo;
    },
    _parseUrlParas: function (str) {
        var result = {};
        var searchItems = str.substring(1).split('&');
        for (var i = 0, l = searchItems.length; i < l; i++) {
            var kv = searchItems[i].split('=');
            if (kv[0].toLowerCase() == "id") result.id = kv[1];
            else if (kv[0].toLowerCase() == "typeid") result.typeId = kv[1];
            else if (kv[0].toLowerCase() == "orgid") result.orgId = kv[1];
            else if (kv[0].toLowerCase() == "userid") result.userId = kv[1];
            else if (kv[0].toLowerCase() == "token") result.token = kv[1];
            else if (kv[0].toLowerCase() == "ticks") result.ticks = kv[1];
            else if (kv[0].toLowerCase() == "canchangestruct") result.canChangeStruct = kv[1].toLowerCase() == "false" ? false : true;
            else if (kv[0].toLowerCase() == "version") result.version = kv[1];
            else if (kv[0].toLowerCase() == "labels") result.labels = kv[1];
        }
        return result;
    },


    getTopbar: function () { return this._topbar; },

    _confirm: function (msg, yes, no) {
        greedyint.dialog.confirm(msg, yes, no, null, null, null, null, 90000);
    },
    //该方法已被抛弃，被greedyint.common.js中的全局ajax错误事件所代替 by xp 2014-12-2 13:22:45
    //    _onLoginOut: function () {
    //        var v = new greedyintLogin();
    //        v.show(this._urlInfo.orgId, 2);
    //    },
    //获取静态资源地址 by xp  2014年8月22日 17:19:37
    _gerResourceFiles: function () {
        return null;
    },
    //获取ckeditor中的图片地址。 by xp 2014年9月2日 13:10:56
    //传入富文本内容 : 必须
    //返回ResourceFile类数组
    //ChangeLog：如果传入为空，则返回空数组 by xp 2014年9月22日 15:17:54
    _getRichTextImgUrl: function (data) {
        if (!data || data == "") {
            //throw "Content do not conform to the specifications ";
            return [];
        }
        var files = [];
        var richTextImageFile = new models.core.ResourceFile();
        var fragment = CKEDITOR.htmlParser.fragment.fromHtml(data);

        var filter = new CKEDITOR.htmlParser.filter({
            elements: {
                img: function (element) {
                    richTextImageFile.setUrl(element.attributes.src);
                    richTextImageFile.setFieldName("richTextImage");
                    richTextImageFile.setFileType(models.core.FileType.Image);
                    files.push($.extend({}, richTextImageFile));
                }
            }
        });

        filter.applyTo(fragment);

        return files;
    },
    _getIsCreateVersion: function () {
        return this._isCreateVersion;
    },
    _versionChangeAction: function () {
        this._isCreateVersion = true;
        this._onBtnSaveAction();
    },
    _versionSaveAction: function () {
        this._isCreateVersion = false;
        this._onBtnSaveAction();
    },
    _confirmVersion: function () {
        //更新
        this.updateModelByUI();
        //验证
        if (!this._validate()) return;
        //新增
        if (this.getOldContentStr() == "") {
            this._onBtnSaveAction();
            return;
        }
        //没有关联项不涉及版本
        if (this._projectList.length <= 0) {
            this._isCreateVersion = false;
            //没有关联不需升版本
            //            if (this.getIsCreateVersionStructure() || (this._model.getTotalTime() == null ? 0 : this._model.getTotalTime()) != (this.getOldTotalTime() == null ? 0 : this.getOldTotalTime())) {
            //                this._isCreateVersion = true;
            //            }
            this._onBtnSaveAction();
            return;
        }
        if (this.getIsCreateVersionStructure() || (this._model.getTotalTime() == null ? 0 : this._model.getTotalTime()) != (this.getOldTotalTime() == null ? 0 : this.getOldTotalTime())) {
            //            结构变化
            this._versionBox.setVisible(true);
            this._versionBox.setList(this._projectList);
        }
        else {
            //文本变化
            if (this.getIsCreateVersionText()) {
                this._versionTextBox.setVisible(true);
                this._versionTextBox.getListCtn().show();
                this._versionTextBox.setList(this._projectList);
            }
            //什么都没变化
            else {
                this._isCreateVersion = false;
                this._onBtnSaveAction();
            }
        }
    },
    getIsCreateVersionText: function () {
        if (this.getOldContentStr() == "") {
            return false;
        }
        else {
            if (this.getOldContentStr() != JSON.stringify(this._model.getContent())) {
                return true;
            }
            else if (this.getOldLevel() != this._model.getLevel()) {
                return true;
            }
            else if (this.getOldName() != this._model.getName()) {
                return true;
            }
            else if (this.getOldSerial() != this._model.getSerialId()) {
                return true;
            }
            else {
                return false;
            }
        }

    },
    getIsCreateVersionStructure: function () {
        return false;
    },
    setOldContent: function (content) {
        this._oldContent = content;
    },
    getOldContent: function () {
        return this._oldContent;
    },
    setOldLevel: function (level) {
        this._oldLevel = level;
    },
    getOldLevel: function () {
        return this._oldLevel;
    },
    setOldContentStr: function (contentstr) {
        this._oldContentStr = contentstr;
    },
    getOldContentStr: function () {
        return this._oldContentStr;
    },
    setVersion: function (version) {
        this._version = version;
    },
    getVersion: function () {
        return this._version;
    },
    setContentParser: function (contentParser) {
        this._contentParser = contentParser;
    },
    getContentParser: function () {
        return this._contentParser;
    },
    setOldTotalTime: function (oldTotalTime) {
        this._oldTotalTime = oldTotalTime;
    },
    getOldTotalTime: function () {
        return this._oldTotalTime;
    },
    setOldName: function (oldName) {
        this._oldName = oldName;
    },
    getOldName: function () {
        return this._oldName;
    },
    setOldSerial: function (oldSerial) {
        this._oldSerial = oldSerial;
    },
    getOldSerial: function () {
        return this._oldSerial;
    }
});