var businesscomponents = businesscomponents || {};

businesscomponents.ui = businesscomponents.ui || {};

businesscomponents.ui.tabs = {};

businesscomponents.ui.tabs.model = {};

businesscomponents.ui.tabs.model.Tab = function () {
    this._idx = 0;
    this._active = false;
};
toot.extendClass(businesscomponents.ui.tabs.model.Tab, {
    getIdx: function () {
        return this._idx;
    },
    setIdx: function (idx) {
        this._idx = idx;
    },
    isActive: function () {
        return this._active;
    },
    setActive: function (activate) {
        this._active = activate;
    }
});

businesscomponents.ui.tabs.model.Tabs = function () {
    this._count = 0;
    this._idxActive = -1;
};
toot.extendClass(businesscomponents.ui.tabs.model.Tabs, {
    getCount: function () {
        return this._count;
    },
    setCount: function (count) {
        this._count = count;
    },
    getIdxActive: function () {
        return this._idxActive;
    },
    setIdxActive: function (idxActive) {
        this._idxActive = idxActive;
    }
});

businesscomponents.ui.tabs.ui = {};

businesscomponents.ui.tabs.ui.Tab = function () {
    businesscomponents.ui.ComponentBase.call(this,
       $('<a href="javascript:;"><em>1</em><span>x</span></a>').get(0));

    this._lblIdx = new toot.ui.Label($(this._element).find('em')[0]);
    this._btnDel = new toot.ui.Button($(this._element).find('span')[0]);

    toot.connect(this._btnDel, "action", this, function () {
        toot.fireEvent(this, "actionDel");
    });
    toot.connect(this, "click", this, function (e) {
        if (e.target != this._btnDel.getElement())
            toot.fireEvent(this, "actionTap");
    });

    businesscomponents.ui.tabs.ui.Tab.thisClass.updateUIByModel.call(this);
};
toot.inherit(businesscomponents.ui.tabs.ui.Tab, businesscomponents.ui.ComponentBase);
toot.defineEvent(businesscomponents.ui.tabs.ui.Tab, ["actionTap", "actionDel"]);
toot.extendClass(businesscomponents.ui.tabs.ui.Tab, {
    updateUIByModel: function () {
        if (!this._model) {
            this._lblIdx.setText("");
            this._element.className = "class";
            return;
        }

        this._lblIdx.setText(this._model.getIdx() + 1);
        if (this._model.isActive()) this._element.className = "class on";
        else this._element.className = "class";
    }
});


businesscomponents.ui.tabs.ui.Tabs = function () {
    businesscomponents.ui.ComponentBase.call(this,
       $('<div class="leftTab"><a href="javascript:;">+</a></div>').get(0));
    this._btnAdd = new toot.ui.Button($(this._element).find('a')[0]);

    this._tabs = null;
    this._tabActive = null;

    toot.connect(this._btnAdd, "action", this, this._onBtnAddAction);

    this._model = new businesscomponents.ui.tabs.model.Tabs();
    this._model.setCount(0);
    this._model.setIdxActive(-1);
    businesscomponents.ui.tabs.ui.Tabs.thisClass.updateUIByModel.call(this);

};
toot.inherit(businesscomponents.ui.tabs.ui.Tabs, businesscomponents.ui.ComponentBase);
toot.defineEvent(businesscomponents.ui.tabs.ui.Tabs, ["added", "removed", "activeChanged"]);
toot.extendClass(businesscomponents.ui.tabs.ui.Tabs, {
    _enabled: true,
    setEnabled: function (enable) {
        this._enabled = enable;
    },
    _createTab: function () {
        var tab = new businesscomponents.ui.tabs.ui.Tab();
        tab.setModel(new businesscomponents.ui.tabs.model.Tab());
        toot.connect(tab, "actionDel", this, this._onTabActionDel);
        toot.connect(tab, "actionTap", this, this._onTabActionTap);
        return tab;
    },
    updateUIByModel: function () {
        //remove all Tabs from the DOM
        if (this._tabs)
            for (var i = 0, l = this._tabs.length; i < l; i++)
                this._element.removeChild(this._tabs[i].getElement());

        //no Tabs if model is empty 
        if (!this._model) return;

        //create and/or delete Tab by model
        this._tabs = this._tabs || [];
        for (var i = 0, l = this._model.getCount(); i < l; i++)
            if (!this._tabs[i]) {
                var tab = this._createTab();
                this._tabs[i] = tab;
            }
        this._tabs.splice(i);

        //update each Tab and append it to the DOM
        for (var i = 0, l = this._tabs.length; i < l; i++) {
            this._tabs[i].getModel().setIdx(i);
            this._tabs[i].getModel().setActive(false);
            this._tabs[i].updateUIByModel();
            this._element.insertBefore(this._tabs[i].getElement(), this._btnAdd.getElement());
        }

        //set active Tab
        if (this._model.getIdxActive() != -1) {
            this._tabActive = this._tabs[this._model.getIdxActive()];
            this._tabActive.getModel().setActive(true);
            this._tabActive.updateUIByModel();
        }
    },
    updateModelByUI: function () {
        if (!this._model) this._model = new businesscomponents.ui.tabs.model.Tabs();
        if (this._tabs) {
            this._model.setCount(this._tabs.length);
            if (this._tabActive)
                this._model.setIdxActive(this._tabs.indexOf(this._tabActive));
            else
                this._model.setIdxActive(-1);
        }
        else {
            this._model.setCount(0);
            this._model.setIdxActive(-1);
        }
    },

    _onBtnAddAction: function () {
        if (!this._enabled) return;

        var tab = this._createTab();
        tab.getModel().setIdx(this._model.getCount());
        tab.updateUIByModel();
        this._element.insertBefore(tab.getElement(), this._btnAdd.getElement());
        this._tabs.push(tab);

        this.updateModelByUI();

        toot.fireEvent(this, "added");
    },
    _onTabActionTap: function (sender) {
        if (!this._enabled) return;

        if (sender != this._tabActive) {
            var idxActiveBefore = this._model.getIdxActive();

            if (this._tabActive) {
                this._tabActive.getModel().setActive(false);
                this._tabActive.updateUIByModel();
            }
            sender.getModel().setActive(true);
            sender.updateUIByModel();
            this._tabActive = sender;

            this.updateModelByUI();

            toot.fireEvent(this, "activeChanged", { idxActiveBefore: idxActiveBefore });
        }
    },
    _onTabActionDel: function (sender) {
        if (!this._enabled) return;
        //        if (this._tabs.length == 1) { alert("请至少保留一个题目"); return false; }
        var idxActiveBefore = this._model.getIdxActive();

        this._disposeTab(sender);
        var idx = this._tabs.indexOf(sender);
        this._tabs.splice(idx, 1);
        this._element.removeChild(sender.getElement());
        for (var i = idx, l = this._tabs.length; i < l; i++) {
            var tab = this._tabs[i];
            tab.getModel().setIdx(i);
            tab.updateUIByModel();
        }
        if (sender == this._tabActive) this._tabActive = null;

        this.updateModelByUI();

        toot.fireEvent(this, "removed", { idxRemoved: idx, idxActiveBefore: idxActiveBefore });
    },
    _disposeTab: function (tab) {
        toot.disconnect(tab, "actionDel", this, this._onTabActionDel);
        toot.disconnect(tab, "actionTap", this, this._onTabActionTap);
    }

});
