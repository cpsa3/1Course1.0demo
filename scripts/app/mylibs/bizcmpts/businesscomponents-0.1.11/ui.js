var businesscomponents = businesscomponents || {};

businesscomponents.ui = businesscomponents.ui || {};

businesscomponents.ui.Exception = {

    MODEL_INPUT_ERR: "MODEL_INPUT_ERR",
    MODEL_OUTPUT_ERR: "MODEL_INPUT_ERR"
    //    VALIDATION_FALSE: "VALIDATION_FALSE"

};

businesscomponents.ui.ComponentBase = function (element) {
    toot.ui.Component.call(this, element);
    this._model = null;
    this._option = null;

    this._validationMsg = "";
    this._validatedOK = true;
};
toot.inherit(businesscomponents.ui.ComponentBase, toot.ui.Component);
toot.extendClass(businesscomponents.ui.ComponentBase, {

    /* model and ui */
    getModel: function () {
        return this._model;
    },
    setModel: function (model) {
        this._model = model === undefined ? null : model;
    },
    updateUIByModel: function () {
    },
    updateModelByUI: function () {
    },
    setModelAndUpdateUI: function (model) {
        this.setModel(model);
        this.updateUIByModel();
    },
    updateAndGetModelByUI: function () {
        this.updateModelByUI();
        return this.getModel();
    },

    /* options */
    getOption: function () {
        return this._option;
    },
    setOption: function (option) {
        this._disposeOption();
        this._option = option ? option : null;
        this._initializeOption();
    },
    _initializeOption: function () {
    },
    _disposeOption: function () {
    },

    /* Add this method
    since there is a problem with xheditor when the target element is not in the doc dom tree */
    initializeAfterAppendedToDocDOMTree: function () {
    },

    /* validation */
    getValidationMsg: function () {
        return this._validationMsg;
    },
    isValidatedOK: function () {
        return this._validatedOK;
    }
});

businesscomponents.ui.ItemOptions = function () {
    this._btnDel = null;
    this._btnMin = null;
};
toot.extendClass(businesscomponents.ui.ItemOptions, {
    getBtnDel: function () {
        return this._btnDel;
    },
    setBtnDel: function (btnDel) {
        this._btnDel = btnDel;
    },
    getBtnMin: function () {
        return this._btnMin;
    },
    setBtnMin: function (btnMin) {
        this._btnMin = btnMin;
    }
});

businesscomponents.ui.Item = function (element, option) {
    businesscomponents.ui.ComponentBase.call(this, element);
    businesscomponents.ui.Item.thisClass.setOption.call(this, option);
};
toot.inherit(businesscomponents.ui.Item, businesscomponents.ui.ComponentBase);
toot.defineEvent(businesscomponents.ui.Item, "actionDel");
toot.extendClass(businesscomponents.ui.Item, {

    /* idx in the list  */
    //the location in the list
    _idx: -1,
    getIdx: function () {
        return this._idx;
    },
    setIdx: function (idx) {
        this._idx = idx;
    },
    updateUIByIdx: function () {
    },
    updateIdxByUI: function () {
    },
    setIdxAndUpdateUI: function (idx) {
        this.setIdx(idx);
        this.updateUIByIdx();
    },
    updateAndGetIdxByUI: function () {
        this.updateIdxByUI();
        return this.getIdx();
    },

    /* minimize */
    _minimized: false,
    getMinimized: function () {
        return this._minimized;
    },
    _setMinimized: function (minimize) {
        this._minimized = minimize;
        this._setMinimizedUI();
    },
    setMinimized: function (minimize) {
        if (this._minimized == minimize) return;
        this._setMinimized(minimize);
    },
    _setMinimizedUI: function () {
    },

    /* override ( implement ) the two methods */
    _initializeOption: function () {
        if (!this._option) return;
        if (this._option.getBtnDel())
            toot.connect(this._option.getBtnDel(), "action", this, this._onBtnDelAction);
        if (this._option.getBtnMin())
            toot.connect(this._option.getBtnMin(), "action", this, this._onBtnMinAction);
    },
    _disposeOption: function () {
        if (!this._option) return;
        if (this._option.getBtnDel())
            toot.disconnect(this._option.getBtnDel(), "action", this, this._onBtnDelAction);
        if (this._option.getBtnMin())
            toot.disconnect(this._option.getBtnMin(), "action", this, this._onBtnMinAction);
    },

    /* btn action handlers */
    _onBtnDelAction: function () {
        toot.fireEvent(this, "actionDel");
    },
    _onBtnMinAction: function () {
        this._setMinimized(!this._minimized);
    }
});

businesscomponents.ui.ListOptions = function () {
    this._btnAdd = null;
    this._defaultModelGenerator = null;
};
toot.extendClass(businesscomponents.ui.ListOptions, {
    getBtnAdd: function () {
        return this._btnAdd;
    },
    setBtnAdd: function (btnAdd) {
        this._btnAdd = btnAdd;
    },
    getDefaultModelGenerator: function () {
        return this._defaultModelGenerator;
    },
    setDefaultModelGenerator: function (defaultModelGenerator) {
        this._defaultModelGenerator = defaultModelGenerator;
    }
});

businesscomponents.ui.List = function (element, elementContainer, typeUI, typeModel, option) {
    businesscomponents.ui.ComponentBase.call(this, element);
    this._elementContainer = elementContainer;
    this._typeUI = typeUI;
    this._typeModel = typeModel;

    this._defaultUIGenerator = null;

    //businesscomponents.ui.Item
    this._items = null;

    businesscomponents.ui.List.thisClass.setOption.call(this, option);

};
toot.inherit(businesscomponents.ui.List, businesscomponents.ui.ComponentBase);
toot.extendClass(businesscomponents.ui.List, {
    _createItem: function () {
        var item = this._defaultUIGenerator ? this._defaultUIGenerator() : new this._typeUI();
        toot.connect(item, "actionDel", this, this._onItemActionDel);
        return item;
    },
    /* override ( implement ) the two methods */
    updateUIByModel: function () {
        if (this._model) {
            //create and/or delete Item by model
            this._items = this._items || [];
            for (var i = 0, l = this._model.length; i < l; i++)
                if (!this._items[i]) {
                    var item = this._createItem();
                    this._items[i] = item;
                }
            this._items.splice(i);

            //update each item by corresponding model with same idx
            for (var i = 0, l = this._items.length; i < l; i++) {
                this._items[i].setModelAndUpdateUI(this._model[i]);
                //update idx related ui
                this._items[i].setIdxAndUpdateUI(i);
            }

            //DOM modification
            //set the container to empty
            //Since innerHTML is read-only for element of some kinds in IE8, use the DOM to clear content if innerHTML not work
            //Comment out the method in try block for the reason:
            //     in IE8 after this._elementContainer.innerHTML = "", this._items[i].getElement().innerHTML will be set to empty.
            //            try {
            //                this._elementContainer.innerHTML = "";
            //            }
            //            catch (ex) {
            if (this._elementContainer.childNodes)
                for (var i = this._elementContainer.childNodes.length - 1; i >= 0; i--)
                    this._elementContainer.removeChild(this._elementContainer.childNodes[i]);
            //            }
            //append each ui component's element ( here is Choice ) to the container
            for (var i = 0, l = this._items.length; i < l; i++) {
                this._elementContainer.appendChild(this._items[i].getElement());
                //                this._disposeItem(this._items[i]);
            }
        }
        else {
            this._items = null;
            //            try {
            //                this._elementContainer.innerHTML = "";
            //            }
            //            catch (ex) {
            if (this._elementContainer.childNodes)
                for (var i = this._elementContainer.childNodes.length - 1; i >= 0; i--)
                    this._elementContainer.removeChild(this._elementContainer.childNodes[i]);
            //            }
        }
    },
    updateModelByUI: function () {
        //reset validation 
        this._validatedOK = true;
        //        if (!this._model) this._model = new this._typeModel();
        if (this._items) {
            this._model = [];
            for (var i = 0, l = this._items.length; i < l; i++)
                this._model.push(this._items[i].updateAndGetModelByUI());

            //validation
            //Set the validation to the first found false result and quit the loop. 
            for (var i = 0, l = this._items.length; i < l; i++) {
                if (!this._items[i].isValidatedOK()) {
                    this._validatedOK = false;
                    this._validationMsg = this._items[i].getValidationMsg();
                    break;
                }
            }
        }
        else
            this._items = null;
    },


    _onItemActionDel: function (sender) {
        this._disposeItem(sender);
        var idx = this._items.indexOf(sender);
        this._items.splice(idx, 1);
        this._elementContainer.removeChild(sender.getElement());
    },
    _onBtnAddAction: function () {
        var item = this._createItem();
        var model = (this._option && this._option.getDefaultModelGenerator()) ?
                             this._option.getDefaultModelGenerator()() : new this._typeModel();
        item.setModelAndUpdateUI(model);

        if (!this._items) this._items = [];
        this._items.push(item);
        this._elementContainer.appendChild(item.getElement());
        //新增选项，页面焦点获取 by 小潘  2013/6/9 23：00
        window.scrollBy(0, item.getElement().offsetTop - $(window).scrollTop());
    },
    _initializeOption: function () {
        if (!this._option) return;
        if (this._option.getBtnAdd())
            toot.connect(this._option.getBtnAdd(), "action", this, this._onBtnAddAction);
    },
    _disposeOption: function () {
        if (!this._option) return;
        if (this._option.getBtnAdd()) {
            toot.disconnect(this._option.getBtnAdd(), "action", this, this._onBtnAddAction);
        }
    },
    _disposeItem: function (item) {
        toot.disconnect(item, "actionDel", this, this._onItemActionDel);
    },

    setDefaultUIGenerator: function (defaultUIGenerator) {
        this._defaultUIGenerator = defaultUIGenerator;
    },
    getDefaultUIGenerator: function () {
        return this._defaultUIGenerator;
    },


    getItems: function () {
        return this._items;
    }
});

businesscomponents.ui.RnRItem = function (element) {
    businesscomponents.ui.Item.call(this, element);

    this._model = new businesscomponents.RequestAndResponse();
};
toot.inherit(businesscomponents.ui.RnRItem, businesscomponents.ui.Item);
toot.extendClass(businesscomponents.ui.RnRItem, {
    setModel: function (model) {
        if (model == null) {
            this.setRequestModel(null);
            this.setResponseModel(null);
            this.setRenderingType(null);
        }
        else {
            this.setRequestModel(model.getRequest());
            this.setResponseModel(model.getResponse());
            if (model.getRenderingType) {
                this.setRenderingType(model.getRenderingType());
            }
        
        }
    },
    getRequestModel: function () {
        return this._model.getRequest();
    },
    getResponseModel: function () {
        return this._model.getResponse();
    },
    setRequestModel: function (request) {
        this._model.setRequest(request == null ? null : request);
    },
    setRenderingType: function (renderingType) {
        this._model.setRenderingType(renderingType == null ? 1 : renderingType);
    },
    setResponseModel: function (response) {
        this._model.setResponse(response == null ? null : response);
    },
    _setRequestModelIfNull: function (typeRequest) {
        if (this.getRequestModel() == null) this.setRequestModel(new typeRequest());
    },
    _setResponseModelIfNull: function (typeResponse) {
        if (this.getResponseModel() == null) this.setResponseModel(new typeResponse());
    }
});




businesscomponents.ui.BusinessComponentBase = function (element) {
    businesscomponents.ui.RnRItem.call(this, element)

    // business item
    this._item = new businesscomponents.RequestAndResponse();
    this._parser = new businesscomponents.RequestAndResponse();

    this._serializer = businesscomponents.ui.BusinessComponentBase.serializer;
    this._deserializer = businesscomponents.ui.BusinessComponentBase.deserializer;

    this._businessType = null;
};
toot.inherit(businesscomponents.ui.BusinessComponentBase, businesscomponents.ui.RnRItem);
toot.extendClass(businesscomponents.ui.BusinessComponentBase, {
    getItem: function () {
        return this._item;
    },
    updateUIByItem: function () {
        if (this._item.getRequest() != null && this._parser.getRequest() != null)
            this.setRequestModel(this._parser.getRequest()(this._deserializer(this._item.getRequest().getContent())));
        if (this._item.getResponse() != null && this._parser.getResponse() != null)
            this.setResponseModel(this._parser.getResponse()(this._deserializer(this._item.getResponse().getContent())));

        this.updateUIByModel();
    },
    updateRequestItemByUI: function () {
        this.updateModelByUI();
        if (this.getRequestModel() == null) throw businesscomponents.ui.Exception.MODEL_OUTPUT_ERR;
        if (this._item.getRequest() == null) this._item.setRequest(new businesscomponents.model.BusinessItem());
        this._item.getRequest().setContent(this._serializer(this.getRequestModel()));
        this._item.getRequest().setBusinessType(this._businessType);
    },
    updateResponseItemByUI: function () {
        this.updateModelByUI();
        if (this.getResponseModel() == null) throw businesscomponents.ui.Exception.MODEL_OUTPUT_ERR;
        if (this._item.getResponse() == null) this._item.setResponse(new businesscomponents.model.BusinessResponseItem());
        this._item.getResponse().setContent(this._serializer(this.getResponseModel()));
    },

    getRightWrong: function () {
        return null;
    }
});
businesscomponents.ui.BusinessComponentBase.serializer = JSON.stringify;
businesscomponents.ui.BusinessComponentBase.deserializer = JSON.parse;


businesscomponents.ui.MinimizableItem1 = function () {
    businesscomponents.ui.Item.call(this,
        $('<div class="Choicebox">' +
           '<div class="clearfix">' +
             '<div class="fr toolbtn">' +
    //               '<a href="#" class="close"></a>' +
               '<a href="#" class="down"></a>' +
             '</div>' +
             '<span class="titlestyle"></span>' +
           '</div>' +
           '<div class="headbox clearfix">' +
           '</div>' +
           '<div class="fillbox">' +
           '</div>' +
       '</div>').get(0));

    this._elementContainer = $(this._element).children('div').get(1);
    this._elementContainer2 = $(this._element).children('div').get(2);
    this._lblBarTitle = new toot.ui.Label($(this._element).find('span').get(0));

    var option = new businesscomponents.ui.ItemOptions();
    option.setBtnMin(new toot.ui.Button($(this._element).find('a').get(0)));
    businesscomponents.ui.MinimizableItem1.superClass.setOption.call(this, option);

    businesscomponents.ui.MinimizableItem1.superClass._setMinimized.call(this, false);
};
toot.inherit(businesscomponents.ui.MinimizableItem1, businesscomponents.ui.Item);
toot.defineEvent(businesscomponents.ui.MinimizableItem1, "MinimizedChanged");
toot.extendClass(businesscomponents.ui.MinimizableItem1, {
    getLblBarTitle: function () {
        return this._lblBarTitle;
    },
    _setMinimized: function (minimize) {
        this._minimized = minimize;
        this._setMinimizedUI();
        toot.fireEvent(this, "MinimizedChanged", { fromInternal: true });
    },
    _setMinimizedUI: function () {
        if (this._minimized) {
            var divs = $(this._element).children("div");
            divs[1].style.display = "none";
            divs[2].style.display = "none";
            this._option.getBtnMin().getElement().className = "down";
            this._lblBarTitle.setVisible(true);
        }
        else {
            var divs = $(this._element).children("div");
            divs[1].style.display = "";
            divs[2].style.display = "";
            this._option.getBtnMin().getElement().className = "up";
            this._lblBarTitle.setVisible(false);
        }
    },
    getElementContainer: function () {
        return this._elementContainer;
    },
    getElementContainer2: function () {
        return this._elementContainer2;
    }
});