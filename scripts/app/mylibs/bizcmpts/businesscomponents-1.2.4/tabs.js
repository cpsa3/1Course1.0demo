var businesscomponents = businesscomponents || {};

businesscomponents.Tab = function (opt_html) {
    businesscomponents.Tab.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Tab.html)[0]);
    this._lblTitle = new toot.ui.Label($(this._element).find('[gi~="lblTitle"]')[0]);
    this._btnClose = new toot.ui.Button($(this._element).find('[gi~="btnClose"]')[0]);
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.Tab, toot.ui.Component);
toot.extendClass(businesscomponents.Tab, {

    _render: function () {
        businesscomponents.Tab.superClass._render.call(this);
        this._renderActive();
        this._renderBtnCloseVisible();
    },

    /* active */
    _active: false,


    isActive: function () { return this._active; },
    setActive: function (active) {
        if (this._active == active) return;
        this._active = active;
        this._renderActive();
    },
    _renderActive: function () {
        if (this._active) $(this._element).addClass(businesscomponents.Tab.active_Class);
        else $(this._element).removeClass(businesscomponents.Tab.active_Class);
    },

    _btnCloseVisible: true,
    isBtnCloseVisible: function () {
        return this._btnCloseVisible;
    },
    setBtnCloseVisible: function (visible) {
        this._btnCloseVisible = visible;
        this._renderBtnCloseVisible();
    },
    _renderBtnCloseVisible: function () {
        if (this._btnCloseVisible) $(this._element).removeClass("noClose");
        else $(this._element).addClass("noClose");
    },


    getLblTitle: function () { return this._lblTitle; },
    getBtnClose: function () { return this._btnClose; }
});
businesscomponents.Tab.html = '<a href="javascript:;" class="closeBox"><span gi="lblTitle"></span><span class="closeItem2" gi="btnClose"></span></a>';

businesscomponents.Tab.active_Class = "current";

businesscomponents.Tab.html_Translation_Correct = '<a href="javascript:;" class="taskMarkPaperTabItem"><span gi="lblTitle"></span><span class="closeItem2" gi="btnClose"></span></a>';




businesscomponents.TabsAddButton = function (opt_html) {
    businesscomponents.TabsAddButton.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.TabsAddButton.html)[0]);
    var $findBase = $('<div></div>').append(this._element);
    this._lblName = new toot.ui.Label($findBase.find('[gi~="lblName"]')[0]);
    this.removeFromParent();
    if (this.constructor == arguments.callee) this._init();
};
toot.inherit(businesscomponents.TabsAddButton, toot.ui.Button);
toot.extendClass(businesscomponents.TabsAddButton, {
    getLblName: function () { return this._lblName }
});
businesscomponents.TabsAddButton.html = '<dd gi="lblName"></dd>';



businesscomponents.Tabs = function (opt_html, opt_html_tab) {

    /*    0    dMin <-  maxTabs-1  ->  dMax        max = 0 + length -1
    *     |_____|_______________________|___________|
    *                                        |
    *                                     current
    */

    businesscomponents.Tabs.superClass.constructor.call(this, $(opt_html !== undefined ? opt_html : businesscomponents.Tabs.html)[0]);

    //    this._max = -1;
    this._length = 0;
    this._dMin = 0;
    this._dMinBefore = 0;
    this._current = -1;
    this._currentBefore = -1;
    this._opt_html_tab = opt_html_tab !== undefined ? opt_html_tab : businesscomponents.Tab.html
    this._btnAdd = new toot.ui.Button($(this._element).find('[gi~="btnAdd"]')[0]);
    this._btnAdd2 = new toot.ui.Button($(this._element).find('[gi~="btnAdd2"]')[0]); ;
    this._btnScrollLeft = new toot.ui.Button($(this._element).find('[gi~="btnScrollLeft"]')[0]);
    this._btnScrollRight = new toot.ui.Button($(this._element).find('[gi~="btnScrollRight"]')[0]);
    this._btnScrollLeftP = new toot.ui.Button($(this._element).find('[gi~="btnScrollLeftP"]')[0]);
    this._btnScrollRightP = new toot.ui.Button($(this._element).find('[gi~="btnScrollRightP"]')[0]);
    //设置分页按钮为默认不显示
    this._btnScrollLeft.setVisible(false);
    this._btnScrollRight.setVisible(false);
    this._btnScrollLeftP.setVisible(false);
    this._btnScrollRightP.setVisible(false);

    this._elementCtnTabs = $(this._element).find('[gi~="ctnTabs"]')[0];
    this._elementCtnAddButtons = $(this._element).find('[gi~="ctnAddButtons"]')[0];
    this._$multiButtons = $(this._element).find('[gi~="multiButtons"]');
    this._tabs = [];

    this._addButtons = [];

    this._sortable();

    if (this.constructor == arguments.callee) this._init();
};
businesscomponents.Tabs.AddMode = {
    SingleButton: 10,
    MultiButtons: 20
}
businesscomponents.Tabs.PagingMode = {
    SingleOne: 1,
    Pages: 2
}
toot.inherit(businesscomponents.Tabs, toot.ui.Component);
toot.defineEvent(businesscomponents.Tabs, ["switch", "add", "remove", "drag", "scroll", "beforeSwitch", "beforeAdd"]);
toot.extendClass(businesscomponents.Tabs, {

    _sortable: function () {
        var _this = this;
        this._sortable = $(this._elementCtnTabs).sortable({
            update: function (e, ui) {
                _this._currentBefore = _this._current;
                var e = {};
                //find out the original index 
                for (var i = 0, l = _this._tabs.length; i < l; i++)
                    if (_this._tabs[i].getElement() == ui.item[0]) {
                        e.originalIndex = _this._dMin + i;
                        break;
                    }

                //reorder the tabs
                var tabs = [];
                for (var i = 0, l = _this._elementCtnTabs.childNodes.length; i < l; i++) {
                    for (var j = 0, m = _this._tabs.length; j < m; j++)
                        if (_this._tabs[j].getElement() == _this._elementCtnTabs.childNodes[i]) {
                            tabs.push(_this._tabs[j]);
                            _this._tabs.splice(j, 1);
                            break;
                        }
                }
                _this._tabs = tabs;

                //find out the new index
                for (var i = 0, l = _this._tabs.length; i < l; i++)
                    if (_this._tabs[i].getElement() == ui.item[0]) {
                        e.newIndex = _this._dMin + i;
                        break;
                    }


                //keep the active and decide if the current changed
                for (var i = 0, l = _this._tabs.length; i < l; i++)
                    if (_this._tabs[i].isActive()) {
                        _this._current = _this._dMin + i;
                        break;
                    }
                _this._renderState();
                toot.fireEvent(_this, "drag", e);
            }
        });
    },

    _init_manageEvents: function () {
        businesscomponents.Tabs.superClass._init_manageEvents.call(this);
        toot.connect(this._btnAdd, "action", this, this._onBtnAddAction);
        toot.connect(this._btnScrollLeft, "action", this, this._onBtnScrollLeftAction);
        toot.connect(this._btnScrollRight, "action", this, this._onBtnScrollRightAction);
        toot.connect(this._btnScrollLeftP, "action", this, this._onBtnScrollLeftActionP);
        toot.connect(this._btnScrollRightP, "action", this, this._onBtnScrollRightActionP);
    },

    _render: function () {
        businesscomponents.Tabs.superClass._render.call(this);
        this._renderTabs();
        this._renderEnabledAdd();
        this._renderEnabledScroll();
        this._renderState();
        this._renderAddMode();
        this._renderEnabledDrag();
    },


    _maxTabs: 8,
    _enabledSwitch: true,
    _enabledAdd: true,  //含义不清晰
    _enabledRemove: true,
    _enabledDrag: true,
    _enabledScroll: true,  //含义不清晰
    _switchToNewAdded: false,
    _switchWhenScroll: false,
    _pageIndex: 1,

    getEnabledRemove: function () {
        return this._enabledRemove;
    },
    setEnabledRemove: function (enable) {
        if (this._enabledRemove == enable) return;
        this._enabledRemove = enable;
        this._renderEnabledRemove();
    },
    _renderEnabledRemove: function () {
        this._renderState();
    },

    getEnabledDrag: function () {
        return this._enabledDrag;
    },
    setEnabledDrag: function (enable) {
        if (this._enabledDrag == enable) return;
        this._enabledDrag = enable;
        this._renderEnabledDrag();
    },
    _renderEnabledDrag: function () {
        $(this._elementCtnTabs).sortable("option", "disabled", !this._enabledDrag);
    },

    _superEnabledAdd: true,  //在任何情形下是否允许添加，由于_enabledAdd的含义不够清晰，添加此状态
    getSuperEnabledAdd: function () {
        return this._superEnabledAdd;
    },
    setSuperEnabledAdd: function (enable) {
        if (this._superEnabledAdd == enable) return;
        this._superEnabledAdd = enable;
        this._renderSuperEnabledAdd();
    },
    _renderSuperEnabledAdd: function () {
        this._renderState();
    },


    _renderEnabledAdd: function () {
        this._btnAdd.setVisible(this._enabledAdd && this._superEnabledAdd);
        this._btnAdd2.setVisible(this._enabledAdd && this._superEnabledAdd);
    },
    _renderEnabledScroll: function () {
        if (this._pagingMode == businesscomponents.Tabs.PagingMode.Pages) {
            this._btnScrollLeftP.setVisible(this._enabledScroll);
            this._btnScrollRightP.setVisible(this._enabledScroll);
        }
        else if (this._pagingMode == businesscomponents.Tabs.PagingMode.SingleOne) {
            this._btnScrollLeft.setVisible(this._enabledScroll);
            this._btnScrollRight.setVisible(this._enabledScroll);
        }
    },

    setEnabledSwitch: function (enabled) {
        if (this._enabledSwitch == enabled) return;
        this._enabledSwitch = enabled;
    },
    setEnabledAdd: function (enabled) {
        if (this._enabledAdd == enabled) return;
        this._enabledAdd = enabled;
        this._renderEnabledAdd();
    },
    //    setEnabledRemove: function (enabled) {
    //        if (this._enabledRemove == enabled) return;
    //        this._enabledRemove = enabled;
    //    },
    setEnabledScroll: function (enabled) {
        if (this._enabledScroll == enabled) return;
        this._enabledScroll = enabled;
        this._renderEnabledScroll();
    },

    getSwitchToNewAdded: function () { return this._switchToNewAdded },
    setSwitchToNewAdded: function (toSwitch) { this._switchToNewAdded = toSwitch },
    getSwitchWhenScroll: function () { return this._switchWhenScroll },
    setSwitchWhenScroll: function (toSwitch) { this._switchWhenScroll = toSwitch },

    getMaxTabs: function () {
        return this._maxTabs;
    },
    setMaxTabs: function (maxTabs) {
        if (maxTabs <= 0) return;
        this._maxTabs = maxTabs;
        this._renderTabs();
        this._renderState();
    },
    _renderTabs: function () {
        this._tabs = [];
        if (this._elementCtnTabs.childNodes)
            for (var i = this._elementCtnTabs.childNodes.length - 1; i >= 0; i--)
                this._elementCtnTabs.removeChild(this._elementCtnTabs.childNodes[i]);

        for (var i = 0; i < this._maxTabs; i++) {
            var tab = new businesscomponents.Tab(this._opt_html_tab);
            this._tabs.push(tab);
            this._elementCtnTabs.appendChild(tab.getElement());
            toot.connect(tab, "click", this, this._onTabClick);
            toot.connect(tab.getBtnClose(), "action", this, this._onTabBtnCloseAction);
        }
    },

    getLength: function () { return this._length; },
    getMax: function () { return this._length - 1; },
    getDMin: function () { return this._dMin },
    getCurrent: function () { return this._current },
    getCurrentBefore: function () { return this._currentBefore },
    isCurrentChanged: function () { return this._current != this._currentBefore },

    setState: function (length, dMin, current) {
        if (length >= 0 && dMin >= 0 && current >= -1 && dMin <= Math.max(length - 1, 0) && current <= Math.max(length - 1, 0)) {
            this._length = length;
            this._dMin = dMin;
            this._current = current;
        }
        this._renderState();
    },
    _renderState: function () {
        var dMax = Math.min(this.getMax(), this._dMin + this._maxTabs - 1);
        for (var i = this._dMin; i <= dMax; i++) {
            var tab = this._tabs[i - this._dMin];
            tab.getLblTitle().setText(i + 1);
            tab.setActive(false);
            tab.setVisible(true);
        }
        for (; i - this._dMin < this._maxTabs; i++)
            this._tabs[i - this._dMin].setVisible(false);

        if (this._current >= this._dMin && this._current <= dMax) {
            this._tabs[this._current - this._dMin].setActive(true);
            this._tabs[this._current - this._dMin].getBtnClose().setVisible(this._enabledRemove);
        }
        if (this._pagingMode == businesscomponents.Tabs.PagingMode.Pages) {
            this._btnScrollLeftP.setVisible(this._dMin > 0);
            this._btnScrollRightP.setVisible(dMax < this.getMax());
            //            if (this._dMin > 0) {
            //                this.setEnabledAdd(false);
            //            }
            if (dMax < this.getMax()) {
                if (this._addMode == businesscomponents.Tabs.AddMode.SingleButton)
                    this._btnAdd.setVisible(false && this._superEnabledAdd);
                else
                    this._btnAdd2.setVisible(false && this._superEnabledAdd);
                //                this.setEnabledAdd(false);
                //                this._renderAddMode();
            }
            else {
                if (this._addMode == businesscomponents.Tabs.AddMode.SingleButton)
                    this._btnAdd.setVisible(true && this._superEnabledAdd);
                else
                    this._btnAdd2.setVisible(true && this._superEnabledAdd);
                //                this.setEnabledAdd(true);
                //                this._renderAddMode();
            }

        }
        else if (this._pagingMode == businesscomponents.Tabs.PagingMode.SingleOne) {
            this._btnScrollLeft.setVisible(this._dMin > 0);
            this._btnScrollRight.setVisible(dMax < this.getMax());
        }

        this._pageIndex = Math.floor(this._dMin / this._maxTabs) + 1;
    },

    _onTabBtnCloseAction: function (sender) {
        if (!this._enabledRemove) return;
        var _this = this;
        //添加是否删除当前项的提示
        _this._confirm(StatusMessage[2119],
                     function () {
                         _this._currentBefore = _this._current;

                         var idx = -1;
                         for (var i = 0, l = _this._tabs.length; i < l; i++) {
                             if (sender == _this._tabs[i].getBtnClose()) {
                                 idx = i;
                                 break;
                             }
                         }
                         var target = _this._dMin + idx;

                         _this._length--;
                         if (_this._current == target) _this._current = -1;
                         else if (_this._current > target) _this._current--;
                         _this._renderState();
                         var e = {};
                         e.idx = target;
                         toot.fireEvent(_this, "remove", e);
                     });
    },
    _onTabClick: function (sender, e) {
        if (!this._enabledSwitch) return;

        if (e.srcElement == sender.getBtnClose().getElement()) return;

        var target = this._dMin + this._tabs.indexOf(sender);
        if (this._current == target) return;

        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeSwitch", e);
        if (e.preventDefault) return;

        this._currentBefore = this._current;
        this._current = target;
        this._renderState();
        toot.fireEvent(this, "switch");
    },
    _onBtnAddAction: function (sender) {
        if (!this._superEnabledAdd) return;

        var e = { preventDefault: false };
        toot.fireEvent(this, "beforeAdd", e);
        if (e.preventDefault) return;

        this._currentBefore = this._current;
        this._length++;
        //        if (this._switchToNewAdded) {
        //            this._current = this.getMax();
        //            this._dMin = Math.max(this._dMin, this.getMax() - this._maxTabs + 1);
        //        }
        if (this._switchToNewAdded) {
            this._current = this.getMax();
            if (this._pagingMode == businesscomponents.Tabs.PagingMode.Pages) {
                if (this._current != 0 && this._current % this._maxTabs == 0) {
                    this._dMin = this._current
                    this._pageIndex++;
                }
            }
            this._dMin = Math.max(this._dMin, this.getMax() - this._maxTabs + 1);
        }
        this._renderState();

        if (this._addMode == businesscomponents.Tabs.AddMode.SingleButton)
            toot.fireEvent(this, "add");
        else {
            var idx = this._addButtons.indexOf(sender);
            toot.fireEvent(this, "add", { idx: idx });
        }
    },
    _onBtnScrollLeftAction: function () {
        var e = {};
        e.direction = "left";
        this._currentBefore = this._current;
        this._dMin--;
        if (this._switchWhenScroll) {
            this._current--;
            var dMax = Math.min(this.getMax(), this._dMin + this._maxTabs - 1);
            if (this._current > dMax) this._current = dMax;
        }
        this._renderState();
        toot.fireEvent(this, "scroll", e);
    },
    _onBtnScrollLeftActionP: function () {

        this._pageIndex--;
        this._dMinBefore = this._dMin;
        this._dMin = (this._pageIndex - 1) * this._maxTabs;
        var e = {};
        e.direction = "left";
        this._currentBefore = this._current;
        //        this._dMin--;
        if (this._switchWhenScroll) {
            //            this._current--;
            var dMax = Math.min(this.getMax(), this._dMin + this._maxTabs - 1);
            //            if (this._current > dMax) this._current = dMax;

            var e = { preventDefault: false };
            toot.fireEvent(this, "beforeSwitch", e);
            if (e.preventDefault) {
                this._pageIndex++;
                this._dMin = this._dMinBefore;
                return
            };
            this._current = this._dMin + this._maxTabs - 1;
            toot.fireEvent(this, "switch");
        }
        this._renderState();
        toot.fireEvent(this, "scroll", e);
    },
    _onBtnScrollRightAction: function () {
        var e = {};
        e.direction = "right";
        this._currentBefore = this._current;
        this._dMin++;
        if (this._switchWhenScroll) {
            this._current++;
            if (this._current < this._dMin) this._current = this._dMin;
        }
        this._renderState();
        toot.fireEvent(this, "scroll", e);
    },
    _onBtnScrollRightActionP: function () {


        this._dMinBefore = this._dMin;
        this._dMin = this._pageIndex * this._maxTabs;
        this._pageIndex++;
        var e = {};
        e.direction = "right";
        this._currentBefore = this._current;

        if (this._switchWhenScroll) {
            //            this._current++;
            //            if (this._current < this._dMin) this._current = this._dMin;

            var e = { preventDefault: false };
            toot.fireEvent(this, "beforeSwitch", e);
            if (e.preventDefault) {
                this._pageIndex--;
                this._dMin = this._dMinBefore;
                return
            };
            this._current = this._dMin;
            toot.fireEvent(this, "switch");
        }
        this._renderState();
        toot.fireEvent(this, "scroll", e);
    },

    _addMode: businesscomponents.Tabs.AddMode.SingleButton,
    getAddMode: function () {
        return this._addMode;
    },
    setAddMode: function (mode) {
        this._addMode = mode;
        this._renderAddMode();
    },
    _pagingMode: businesscomponents.Tabs.PagingMode.Pages,
    getPagingMode: function () {
        return this._pagingMode;
    },
    setPagingMode: function (pagingMode) {
        this._pagingMode = pagingMode;
        this._renderPagingMode();
    },
    _renderAddMode: function () {
        if (this._addMode == businesscomponents.Tabs.AddMode.SingleButton) {
            this._btnAdd.setVisible(true && this._superEnabledAdd);
            this._$multiButtons.hide();
        }
        else {
            this._btnAdd.setVisible(false && this._superEnabledAdd);
            this._$multiButtons.show();
        }
    },
    _renderPagingMode: function () {
        //不同的分页采用不同的样式
        //        if (this._pagingMode == businesscomponents.Tabs.PagingMode.Pages) {
        //            this._btnScrollLeft.setVisible(false);
        //            this._btnScrollRight.setVisible(false);
        //        }
        //        else if (this._pagingMode == businesscomponents.Tabs.PagingMode.SingleOne) {
        //            this._btnScrollLeftP.setVisible(false);
        //            this._btnScrollRightP.setVisible(false);
        //        }
    },
    addAddButton: function (name) {
        var button = new businesscomponents.TabsAddButton();
        button.getLblName().setText(name);
        button.appendTo(this._elementCtnAddButtons);
        toot.connect(button, "action", this, this._onBtnAddAction);
        this._addButtons.push(button);
    },
    addAddButtons: function (names) {
        for (var i = 0, l = names.length; i < l; i++)
            this.addAddButton(names[i]);
    },

    getTabs: function () { return this._tabs },
    _confirm: function (msg, yes, no) {
        greedyint.dialog.confirm(msg, yes, no, null, null, null, null, 90000);
    },
    setTabsWidth: function (tabWidth) {
        $(this._elementCtnAddButtons).width(tabWidth);
    }
});

businesscomponents.Tabs.html =
                  '<div class="QuestionNumGroup StyleW1 clearfix">' +
                            '<a href="#" gi="btnScrollLeft"><</a><a href="#" gi="btnScrollLeftP"><<</a>' +
                            '<div gi="ctnTabs"></div>' +
                            '<a href="#" gi="btnScrollRight">></a><a href="#" gi="btnScrollRightP">>></a>' +
                            '<a href="#" gi="btnAdd" class="addItem">+</a>' +
                            '<div class="fl addItembox AddTransition" style="display: block;" gi="multiButtons">' +
                              '<div class="addItem2" gi="btnAdd2">+</div>' +
                              '<dl class="addItemNew transitionStyle" style="width:150px;" gi="ctnAddButtons"></dl>' +
                            '</div>' +
                          '</div>';

/*
<div class="taskMarkPaperTabOuter clearfix">
<div class="taskMarkPaperTabbox">
<a href="#" class="taskMarkPaperTabItem disableItem">&lt;</a>
<div>
<a href="#" class="taskMarkPaperTabItem currentItem">1</a>
<a href="#" class="taskMarkPaperTabItem">2</a>
<a href="#" class="taskMarkPaperTabItem">3</a>
<a href="#" class="taskMarkPaperTabItem">4</a>
<a href="#" class="taskMarkPaperTabItem">5</a>
</div>
<a href="#" class="taskMarkPaperTabItem">&gt;</a>
</div>
</div>
*/
businesscomponents.Tabs.html_Translation_Correct = '<div class="taskMarkPaperTabOuter  clearfix">' +
 '<div class="taskMarkPaperTabbox">' +
                            '<a href="#" gi="btnScrollLeft"  class="taskMarkPaperTabItem"><</a><a href="#" gi="btnScrollLeftP" class="taskMarkPaperTabItem"><<</a>' +
                            '<div gi="ctnTabs" class="fl" ></div>' +
                            '<a href="#" gi="btnScrollRight"  class="taskMarkPaperTabItem">></a><a href="#" gi="btnScrollRightP"  class="taskMarkPaperTabItem">>></a>' +
                            '<a href="#" gi="btnAdd" class="addItem">+</a>' +
                            '<div class="fl addItembox AddTransition" style="display: none;" gi="multiButtons">' +
                              '<div class="addItem2" gi="btnAdd2">+</div>' +
                              '<dl class="addItemNew transitionStyle" style="width:150px;" gi="ctnAddButtons"></dl>' +
                            '</div>' +
                            '</div>' +
                          '</div>';