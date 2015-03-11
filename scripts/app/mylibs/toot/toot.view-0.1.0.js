/*  Dev based on toot 0.1.1  */

var toot = toot || {};

toot.view = toot.view || {};

toot.view.ViewBase = function (element) {
    toot.view.ViewBase.superClass.constructor.call(this, element);
    this._model = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(toot.view.ViewBase, toot.ui.Component);
toot.defineEvent(toot.view.ViewBase, "change");
toot.extendClass(toot.view.ViewBase, {

    _render: function () {
        toot.view.ViewBase.superClass._render.call(this);
        this.updateUIByModel();
    },

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

    //tool function for control setter
    _setControl: function (ctrlTarget, ctrlParam, receiver, handler) {
        if (this[ctrlTarget] == ctrlParam) return;
        if (this[ctrlTarget])
            toot.disconnect(this[ctrlTarget], "action", receiver, handler);
        this[ctrlTarget] = ctrlParam;
        if (this[ctrlTarget])
            toot.connect(this[ctrlTarget], "action", receiver, handler);
    }
});

toot.view.Item = function (element) {
    toot.view.Item.superClass.constructor.call(this, element);
    this._btnDel = null;
    this._btnMin = null;
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(toot.view.Item, toot.view.ViewBase);
toot.defineEvent(toot.view.Item, "actionDel");
toot.extendClass(toot.view.Item, {

    _init_manageEvents: function () {
        toot.view.Item.superClass._init_manageEvents.call(this);
        if (this._btnDel) toot.connect(this._btnDel, "action", this, this._onBtnDelAction);
        if (this._btnMin) toot.connect(this._btnMin, "action", this, this._onBtnMinAction);
    },

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
    setMinimized: function (minimize) {
        if (this._minimized == minimize) return;
        this._minimized = minimize;
        this._setMinimizedUI();
    },
    _setMinimizedUI: function () {
    },

    /* btn */
    getBtnDel: function () {
        return this._btnDel;
    },
    setBtnDel: function (btn) {
        this._setControl("_btnDel", btn, this, this._onBtnDelAction)
    },
    getBtnMin: function () {
        return this._btnMin;
    },
    setBtnMin: function (btn) {
        this._setControl("_btnMin", btn, this, this._onBtnMinAction);
    },

    /* btn action handlers */
    _onBtnDelAction: function () {
        toot.fireEvent(this, "actionDel");
    },
    _onBtnMinAction: function () {
        this.setMinimized(!this._minimized);
    }
});


toot.view.List = function (element, elementContainer, typeUI, typeModel, nonItemElements) {
    toot.view.List.superClass.constructor.call(this, element);
    this._elementContainer = elementContainer;
    this._typeUI = typeUI;
    this._poolUI = null;
    if (this._typeUI) this._createPoolUI();

    this._typeModel = typeModel;
    //    this._defaultUIGenerator = null;
    this._defaultModelGenerator = null;
    this._uiInitializers = null;
    this._uiUpdaters = null;

    this._nonItemElements = nonItemElements || null;
    this._elementInsertBefore = null;

    this._btnAdd = null;

    //toot.view.Item
    this._items = null;

    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(toot.view.List, toot.view.ViewBase);
toot.extendClass(toot.view.List, {

    _init_manageEvents: function () {
        toot.view.List.superClass._init_manageEvents.call(this);
        if (this._btnAdd) toot.connect(this._btnAdd, "action", this, this._onBtnAddAction);
    },

    getPoolUI: function () { return this._poolUI },
    setPoolUI: function (pool) { this._poolUI = pool },

    _createPoolUI: function () {
        var _this = this;
        this._poolUI = new toot.lib.Pool(this._typeUI);
    },

    _initializeItem: function () {
        var item = this._poolUI.pop();
        if (this._uiInitializers)
            for (var i = 0, l = this._uiInitializers.length; i < l; i++)
                this._uiInitializers[i](item, { isNew: this._poolUI.isNewLastPoped() });
        toot.connect(item, "actionDel", this, this._onItemActionDel);
        toot.connect(item, "change", this, this._onItemChange);
        return item;
    },
    _disposeItem: function (item) {
        toot.disconnect(item, "actionDel", this, this._onItemActionDel);
        toot.disconnect(item, "change", this, this._onItemChange);
        this._poolUI.push(item);
    },

    /* override ( implement ) the two methods */
    updateUIByModel: function () {
        var binUI = null;

        if (this._model) {
            //create and/or delete Item by model
            this._items = this._items || [];
            for (var i = 0, l = this._model.length; i < l; i++)
                if (!this._items[i]) {
                    var item = this._initializeItem();
                    this._items[i] = item;
                }
            binUI = this._items.splice(i, this._items.length);


            //update each item by corresponding model with same idx
            for (var i = 0, l = this._items.length; i < l; i++) {
                if (this._uiUpdaters)
                    for (var j = 0, m = this._uiUpdaters.length; j < m; j++)
                        this._uiUpdaters[j](this._items[i]);

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
                for (var i = this._elementContainer.childNodes.length - 1; i >= 0; i--) {
                    var element = this._elementContainer.childNodes[i];
                    if (!this._nonItemElements || this._nonItemElements.indexOf(element) == -1)
                        this._elementContainer.removeChild(element);
                }
            //            }
            //append each ui component's element ( here is Choice ) to the container
            if (this._elementInsertBefore)
                for (var i = 0, l = this._items.length; i < l; i++)
                    this._items[i].insertBefore(this._elementInsertBefore);
            else
                for (var i = 0, l = this._items.length; i < l; i++)
                    this._items[i].appendTo(this._elementContainer);
        }
        else {
            binUI = this._items;
            this._items = null;
            //            try {
            //                this._elementContainer.innerHTML = "";
            //            }
            //            catch (ex) {
            if (this._elementContainer.childNodes)
                for (var i = this._elementContainer.childNodes.length - 1; i >= 0; i--) {
                    var element = this._elementContainer.childNodes[i];
                    if (!this._nonItemElements || this._nonItemElements.indexOf(element) == -1)
                        this._elementContainer.removeChild(element);
                }
            //            }
        }

        if (binUI)
            for (var i = 0, l = binUI.length; i < l; i++)
                this._disposeItem(binUI[i]);
    },
    updateModelByUI: function () {
        //        //reset validation 
        //        this._validatedOK = true;
        //        if (!this._model) this._model = new this._typeModel();
        if (this._items) {
            this._model = this._model || [];
            this._model.splice(0, this._model.length);
            for (var i = 0, l = this._items.length; i < l; i++)
                this._model.push(this._items[i].updateAndGetModelByUI());

            //            //validation
            //            //Set the validation to the first found false result and quit the loop. 
            //            for (var i = 0, l = this._items.length; i < l; i++) {
            //                if (!this._items[i].isValidatedOK()) {
            //                    this._validatedOK = false;
            //                    this._validationMsg = this._items[i].getValidationMsg();
            //                    break;
            //                }
            //            }
        }
        else
            this._model = null;
    },


    _onItemActionDel: function (sender) {
        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeChange", e);
        if (e.preventDefault) return;

        this.updateModelByUI();
        var idx = this._items.indexOf(sender);
        this._model.splice(idx, 1);
        this.updateUIByModel();
        toot.fireEvent(this, "change", { type: "remove", idx: idx });

        //        this._disposeItem(sender);
        //        var idx = this._items.indexOf(sender);
        //        this._items.splice(idx, 1);
        //        this._elementContainer.removeChild(sender.getElement());
    },
    _onItemChange: function (sender) {
        toot.fireEvent(this, "beforeChange");

        this.updateModelByUI();
        var idx = this._items.indexOf(sender);
        toot.fireEvent(this, "change", { type: "itemChange", idx: idx });
    },
    _onBtnAddAction: function () {
        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeChange", e);
        if (e.preventDefault) return;

        this.updateModelByUI();
        var model = (this._defaultModelGenerator) ? this._defaultModelGenerator() : new this._typeModel();
        if (!this._model) this._model = [];
        this._model.push(model);
        this.updateUIByModel();
        toot.fireEvent(this, "change", { type: "add" });

        //        var item = this._createItem();
        //        var model = (this._defaultModelGenerator) ? this._defaultModelGenerator() : new this._typeModel();
        //        item.setModelAndUpdateUI(model);

        //        if (!this._items) this._items = [];
        //        this._items.push(item);
        //        this._elementContainer.appendChild(item.getElement());
        //        //新增选项，页面焦点获取 by 小潘  2013/6/9 23：00
        //        window.scrollBy(0, item.getElement().offsetTop - $(window).scrollTop());
    },

    getBtnAdd: function () {
        return this._btnAdd;
    },
    setBtnAdd: function (btn) {
        this._setControl("_btnAdd", btn, this, this._onBtnAddAction);
    },

    getDefaultModelGenerator: function () {
        return this._defaultModelGenerator;
    },
    setDefaultModelGenerator: function (defaultModelGenerator) {
        this._defaultModelGenerator = defaultModelGenerator;
    },
    getUIInitializer: function () { return this._uiInitializers && this._uiInitializers.length > 0 ? this._uiInitializers[0] : null },
    setUIInitializer: function (initializer) { this._uiInitializers = [initializer] },
    getUIInitializers: function () { return this._uiInitializers },
    setUIInitializers: function (initializers) { this._uiInitializers = initializers },

    getUIUpdater: function () { return this._uiUpdaters && this._uiUpdaters.length > 0 ? this._uiUpdaters[0] : null },
    setUIUpdater: function (updater) { this._uiUpdaters = [updater] },
    getUIUpdaters: function () { return this._uiUpdaters },
    setUIUpdaters: function (updaters) { this._uiUpdaters = updaters },

    getItems: function () {
        return this._items;
    },


    getNonItemElements: function () {
        return this._nonItemElements;
    },
    setNonItemElements: function (elements) {
        this._nonItemElements = elements;
    },
    getElementInsertBefore: function () {
        return this._elementInsertBefore;
    },
    setElementInsertBefore: function (elementBefore) {
        this._elementInsertBefore = elementBefore;
    }
});
