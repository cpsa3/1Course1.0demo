/******
Requires: toot and toot.jquery
******/

try {
    if (!(toot.toot() == "toot" && toot.jquery.toot() == "toot.jquery"))
        throw 0;
}
catch (ex) {
    var msg = "toot.ui requires toot, toot.jquery";
    alert(msg);
    throw msg;
}

toot.ui = toot.ui || {};

////Imports the toot.$ into the global temporarily for a convenient use
////and will restores the global $ immediately afterwards.
//toot.ui._$ = $;
//$ = toot.$;


//Run the code in init function, so the code can still use $ directly
toot.ui._init = function ($) {

    toot.ui.textToHTML = function (text) {
        text = text.replace(/</g, "&lt;");
        text = text.replace(/>/g, "&gt;");

        text = text.replace(/ /g, "&nbsp;");
        text = text.replace(/\b&nbsp;/g, " ");
        text = text.replace(/\r\n|\r|\n/g, "<br>");
        return text;
    };

    toot.ui.Component = function (element) {
        this._element = element;

        if (this._visible)
            $(this._element).show();
        else
            $(this._element).hide();

        var _this = this;
        $(this._element).click(function (e) {
            toot.fireEvent(_this, "click", e);
        });
        $(this._element).dblclick(function (e) {
            toot.fireEvent(_this, "dblclick", e);
        });
    };
    toot.defineEvent(toot.ui.Component, ["click", "dblclick"]);
    toot.extendClass(toot.ui.Component, {
        _visible: true,
        setVisible: function (visible, opt_force) {
            if (!(opt_force || this._visible != visible))
                return;

            if (visible)
                $(this._element).show();
            //Since this doesn't work if the display is set in the class, use jQuery method.
            //            this._element.style.display = "";
            else
                $(this._element).hide();
            //        this._element.style.display = "none";
            this._visible = visible;
        },
        isVisible: function () {
            return this._visible;
        },
        getElement: function () {
            return this._element;
        },
        _textToHTML: function (text) {
            return toot.ui.textToHTML(text);
            //            text = text.replace(/ /g, "&nbsp;");
            //            text = text.replace(/\b&nbsp;/g, " ");
            //            text = text.replace(/\r\n/g, "<br>");
            //            return text;
        }
    });


    toot.ui.Label = function (element) {
        toot.ui.Component.call(this, element);

        this._element.innerHTML = "&nbsp;";
        this._text = null;
    };
    toot.inherit(toot.ui.Label, toot.ui.Component);
    toot.extendClass(toot.ui.Label, {
        getText: function () {
            return this._text;
        },
        setText: function (text) {
            if (text === null) text = "";
            text = text + "";
            if (text)
                this._element.innerHTML = this._textToHTML(text);
            else
                this._element.innerHTML = "&nbsp;";
            this._text = text;
        }
    });


    toot.ui.TextBoxType = {
        SingleLine: 0,
        MultiLine: 1
    };

    toot.ui.TextBoxState = {
        Enabled: 0,
        Readonly: 1,
        Disabled: 2
    }

    toot.ui.TextBox = function (txtElement) {
        toot.ui.Component.call(this, txtElement);
        if (txtElement.nodeName.toLowerCase() == "input" && txtElement.type.toLowerCase() == "text")
            this._textBoxType = toot.ui.TextBoxType.SingleLine;
        else if (txtElement.nodeName.toLowerCase() == "textarea")
            this._textBoxType = toot.ui.TextBoxType.MultiLine;
        else
            throw "wrong element type";

        var ele = this._element;
        if (this._state == toot.ui.TextBoxState.Enabled) {
            ele.disabled = false;
            $(ele).removeAttr("readonly");
        }
        else if (this._state == toot.ui.TextBoxState.Readonly) {
            ele.disabled = false;
            $(ele).attr("readonly", "readonly");
        }
        else if (this._state == toot.ui.TextBoxState.Disabled) {
            $(ele).get(0).disabled = true;
        }

        //        if (this._enabled)
        //        this._element.disabled = false;
        //        else
        //            this._element.disabled = true;

        this._element.value = "";
    }
    toot.inherit(toot.ui.TextBox, toot.ui.Component);
    toot.extendClass(toot.ui.TextBox, {
        //        _enabled: true,
        _state: toot.ui.TextBoxState.Enabled,
        getValue: function () {
            return this._element.value;
        },
        setValue: function (value) {
            if (value)
                this._element.value = value;
            else
                this._element.value = "";
        },
        //to be deprecated, use getState and setState 
        isEnabled: function () {
            return !this._element.disabled;
            //            return this._enabled;
        },
        setEnabled: function (enable) {
            if (!this._element.disabled == enable)
                return;

            //            this._enabled = enable;
            if (this._enabled)
                this._element.disabled = false;
            else
                this._element.disabled = true;
        },
        // 
        getState: function () {
            return this._state;
        },
        setState: function (state) {
            if (this._state == state)
                return;

            this._state = state;
            var ele = this._element;
            if (this._state == toot.ui.TextBoxState.Enabled) {
                ele.disabled = false;
                $(ele).removeAttr("readonly");
            }
            else if (this._state == toot.ui.TextBoxState.Readonly) {
                ele.disabled = false;
                $(ele).attr("readonly", "readonly");
            }
            else if (this._state == toot.ui.TextBoxState.Disabled) {
                $(ele).get(0).disabled = true;
            }
        },
        setFocused: function (focus) {
            if (focus)
                this._element.focus();
            else
                this._element.blur();
        },
        setSelect: function () {
            this._element.select();
        },
        getTextBoxType: function () {
            return this._textBoxType;
        }
    });



    toot.ui.Control = function (element) {
        var _this = this;
        toot.ui.Component.call(this, element);
        if (this._element.nodeName.toLowerCase() == "a")
            this._element.href = "javascript:;";
        $(this._element).click(function (e) {
            if (_this._enabled)
                toot.fireEvent(_this, "action", e);
        });
    };
    toot.inherit(toot.ui.Control, toot.ui.Component);
    toot.defineEvent(toot.ui.Control, "action");
    toot.extendClass(toot.ui.Control, {
        _enabled: true,
        isEnabled: function () {
            return this._enabled;
        },
        setEnabled: function (enable) {
            if (this._enabled != enable)
                this._enabled = enable;
        }
    });


    toot.ui.Button = function (element) {
        toot.ui.Control.call(this, element);
    };
    toot.inherit(toot.ui.Button, toot.ui.Control);
    //    toot.extendClass(toot.ui.Button, {
    //});

    toot.ui.ToggleButton = function (element) {
        toot.ui.Button.call(this, element);
    };
    toot.inherit(toot.ui.ToggleButton, toot.ui.Button);
    toot.extendClass(toot.ui.ToggleButton, {
        _activated: false,
        isActivated: function () {
            return this._activated;
        },
        setActivated: function (activate) {
            if (this._activated != activate)
                this._activated = activate;
        },
        setState: function (enable, activate) {
            this.setEnabled(enable);
            this.setActivated(activate);
        }
    });

    toot.ui.MenuItem = function (element) {
        toot.ui.Control.call(this, element);
    };
    toot.inherit(toot.ui.MenuItem, toot.ui.Control);
    //    toot.extendClass(toot.ui.MenuItem, {
    //});

    toot.ui.DropDownListItem = function (optionElement) {
        toot.ui.Component.call(this, optionElement);
    };
    toot.extendClassStatic(toot.ui.DropDownListItem, {
        createDropDownListItem: function (text, value) {
            var optionElement = document.createElement("option");
            optionElement.text = text;
            optionElement.value = value;
            return new toot.ui.DropDownListItem(optionElement);
        }
    });
    toot.inherit(toot.ui.DropDownListItem, toot.ui.Component);
    toot.extendClass(toot.ui.DropDownListItem, {
        getText: function () {
            return this._element.text;
        },
        setText: function (text) {
            this._element.text = text;
        },
        getValue: function () {
            return this._element.value;
        },
        setValue: function (value) {
            this._element.value = value;
        }
    });


    toot.ui.DropDownList = function (selectElement) {
        toot.ui.Control.call(this, selectElement);
        this._dropDownListItems = [];
        var _this = this;
        $(this._element).change(function () {
            toot.fireEvent(_this, "change");
        });
    };
    toot.inherit(toot.ui.DropDownList, toot.ui.Control);
    toot.defineEvent(toot.ui.DropDownList, "change");
    toot.extendClass(toot.ui.DropDownList, {
        getDropDownListItems: function () {
            return this._dropDownListItems;
        },
        addItem: function (dropDownListItem) {
            this._element.add(dropDownListItem.getElement(), null);
            this._dropDownListItems.push(dropDownListItem);
        },
        removeItem: function (dropDownListItem) {
            var index = dropDownListItem.getElement().index;
            this._element.remove(index);
            this._dropDownListItems.splice(index, 0);
        },
        removeItemAt: function (index) {
            this._element.remove(index);
            this._dropDownListItems.splice(index, 0);
        },
        getSelectedIndex: function () {
            return this._element.selectedIndex;
        },
        setSelectedIndex: function (index) {
            this._element.selectedIndex = index;
        },
        getSelectedItem: function () {
            return this._dropDownListItems[this._element.selectedIndex];
        },
        setEnabled: function (enable) {
            toot.ui.DropDownList.superClass.setEnabled.call(this, enable);
            this._element.disabled = !enable;
        }
    });


    toot.ui.StyledButton = function (element) {
        var _this = this;
        toot.ui.Button.call(this, element);
        $(this._element).css({
            border: "2px",
            padding: "0px 2px 0px 2px",
            cursor: "pointer"
        });
        this._setStyle();
        $(this._element).mouseover(function () {
            if (_this.isEnabled()) {
                _this._element.style.backgroundColor = "yellow";
            }
        });
        $(this._element).mouseout(function () {
            _this._setStyle();
        });
    };
    toot.inherit(toot.ui.StyledButton, toot.ui.Button);
    toot.extendClass(toot.ui.StyledButton, {
        setEnabled: function (enable) {
            if (this._enabled == enable)
                return;

            toot.ui.StyledButton.superClass.setEnabled.call(this, enable);
            this._setStyle();
        },
        _setStyle: function () {
            if (!this._enabled) {
                this._element.style.backgroundColor = "Gray";
            }
            else {
                this._element.style.backgroundColor = "Green";
            }
        }
    });


    toot.ui.WaitingLabel = function (element) {
        toot.ui.Component.call(this, element);

        this._element.innerHTML = "&nbsp;";
        this._text = null;

        this._timer = null;
    };
    toot.inherit(toot.ui.WaitingLabel, toot.ui.Label);
    toot.extendClass(toot.ui.WaitingLabel, {
        _interval: 500,
        setVisible: function (visible) {
            toot.ui.WaitingLabel.superClass.setVisible.call(this, visible);
            if (!visible)
                clearInterval(this._timer);
        },
        setText: function (text) {
            toot.ui.WaitingLabel.superClass.setText.call(this, text);
            clearInterval(this._timer);
        },
        setAnimation: function (animation) {
            clearInterval(this._timer);
            if (this.isVisible() && this._text && animation) {
                var texts = [this._text + " .", this._text + " . .", this._text + " . . ."];
                var _this = this;
                var i = 0;
                var l = texts.length;
                this._timer = setInterval(function () {
                    if (i >= l)
                        i = 0;
                    _this.setText(texts[i]);
                    i++;
                }, this._interval);
            }
        },
        setInterval: function (interval  /* in millisec */) {
            if (this._interval != interval)
                this._interval = interval;
        }
    });



    toot.ui.EditorInIframe = function (iframeElement) {
        toot.ui.Component.call(this, iframeElement);
        var doc = this.getDoc();
        $(this._element).css({
            width: "350px",
            height: "280px"
        });
        $(doc.body).css({
            border: "black solid 2px",
            width: "300px",
            height: "240px",
            padding: "10px"
        });
        this.setEditable(true);
    };
    toot.inherit(toot.ui.EditorInIframe, toot.ui.Component);
    toot.extendClass(toot.ui.EditorInIframe, {
        setEditable: function (editable) {
            var doc = this._element.contentDocument;
            try {
                if (doc.contentEditable != null) {
                    doc.contentEditable = editable ? "true" : "false";
                    return true;
                }
                else if (doc.designMode != null) {
                    doc.designMode = editable ? "on" : "off";
                    return true;
                }
            }
            catch (error) {
            }
        },
        getDoc: function () {
            return this._element.contentDocument;
        }
    });


};

toot.ui._init(toot.jquery.$);

toot.ui.toot = function () {
    return "toot.ui";
}