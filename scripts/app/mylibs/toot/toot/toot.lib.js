/******
Requires: toot
******/

try {
    if (toot.toot() != "toot")
        throw 0;
}
catch (ex) {
    var msg = "toot.lib requires toot";
    alert(msg);
    throw msg;
}

toot.lib = toot.lib || {};

toot.lib._createXHR = function () {
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();
    else if (window.ActiveXObject)
        return new ActiveXObject("Microsoft.XMLHTTP");
};

toot.lib.Xhr = function () {
    this._xhr = toot.lib._createXHR();
    var _this = this;
    this._timeout = null;
    this._onreadystatechange = function () {
        toot.fireEvent(_this, "readyStateChange");
    };
    toot.connect(this, "readyStateChange", this, this._handleReadystatechange);
};
toot.defineEvent(toot.lib.Xhr, ["readyStateChange", "success", "error", "timeout", "sessionout"]);
toot.extendClass(toot.lib.Xhr, {
    abort: function () {
        return this._xhr.abort();
    },
    getAllResponseHeaders: function () {
        return this._xhr.getAllResponseHeaders();
    },
    getResponseHeader: function () {
        return this._xhr.getResponseHeader();
    },
    open: function (method, url, async, username, password) {
        if (arguments.length == 1)
            var r = this._xhr.open(method);
        if (arguments.length == 2)
            var r = this._xhr.open(method, url);
        if (arguments.length == 3)
            var r = this._xhr.open(method, url, async);
        if (arguments.length == 4)
            var r = this._xhr.open(method, url, async, username);
        if (arguments.length == 5)
            var r = this._xhr.open(method, url, async, username, password);

        this._xhr.onreadystatechange = this._onreadystatechange;
        return r;
    },
    send: function (body) {
        var r = this._xhr.send(body);
        if (this._timeout) {
            var _this = this;
            setTimeout(function () {
                _this._handleTimeout();
            }, this._timeout);
        }
        return r;
    },
    setRequestHeader: function (name, value) {
        return this._xhr.setRequestHeader(name, value);
    },

    getXMLHttpRequest: function () {
        return this._xhr;
    },
    getReadyState: function () {
        return this._xhr.readyState;
    },
    getStatus: function () {
        return this._xhr.status;
    },
    getResponseText: function () {
        return this._xhr.responseText;
    },
    getResponseJSON: function () {
        return JSON.parse(this._xhr.responseText);
    },

    _isSessionOut: function () {
        return false;
    },
    _handleReadystatechange: function () {
        if (this._xhr.readyState == 4) {
            if (this._isSessionOut())
                toot.fireEvent(this, "sessionout");
            else if (this._xhr.status == 200)
                toot.fireEvent(this, "success");
            else
                toot.fireEvent(this, "error");
        }
    },
    _handleTimeout: function () {
        if (this._xhr.readyState != 4) {
            this._xhr.abort();
            toot.fireEvent(this, "timeout");
        }
    },
    setTimeout: function (milliseconds) {
        this._timeout = milliseconds;
    }
});


toot.lib.SingleThreadRequest = {
    Read: 0,
    Write: 1
}
toot.lib.SingleThreadReadWrite = function (xhr) {
    this._xhr = xhr;
    this._lastWriting = null;
    this._lastRead = null;
    this._lastRequest = null;
    toot.connect(this._xhr, "success", this, this._success);
    toot.connect(this._xhr, "error", this, this._error);
    toot.connect(this._xhr, "timeout", this, this._timeout);
    toot.connect(this._xhr, "sessionout", this, this._sessionout);
};
toot.defineEvent(toot.lib.SingleThreadReadWrite, ["success", "error", "timeout", "sessionout"]);
toot.extendClass(toot.lib.SingleThreadReadWrite, {
    read: function () {
        throw toot.CommonException.NOT_IMPLEMENTED;
    },
    write: function () {
        throw toot.CommonException.NOT_IMPLEMENTED;
    },

    getLastWriting: function () {
        return this._lastWriting;
    },
    getLastRead: function () {
        return this._lastRead;
    },
    getLastRequest: function () {
        return this._lastRequest;
    },

    _success: function () {
        toot.fireEvent(this, "success");
    },
    _error: function () {
        toot.fireEvent(this, "error");
    },
    _timeout: function () {
        toot.fireEvent(this, "timeout");
    },
    _sessionout: function () {
        toot.fireEvent(this, "sessionout");
    }
});


//剪切板
toot.lib.ClipBoard = function () {
};
toot.extendClass(toot.lib.ClipBoard, {
    isSupport: function () {
        if (window.clipboardData) // IE
        {
            return true;
        }
        return false;
    },
    copy: function (content) {
        //this._content = content;
        try {
            return window.clipboardData.setData("Text", content);
        }
        catch (e) {
            return false;
        }
    },
    read: function () {
        try {
            //            if (this.isSupport()) {
            return window.clipboardData.getData("Text");

            //            }
        }
        catch (e) {
            return false;
        }
    }
});
//收藏夹
toot.lib.Favorite = function () {
};
toot.extendClass(toot.lib.Favorite, {
    isSupport: function () {
        //        if (document.all) {
        //            //alert("Ie！You Konw！");
        //            return true;
        //        }
        if (window.sidebar) {
            //alert("Firefox！You Konw！");
            return true;
        }
        else {
            return false;
        }
    },
    add: function (title, url) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            return false;
        }
    }
});

toot.lib.Timeout = function (delay) {
    this._delay = delay;
    this._timer = null;
    var _this = this;
    this._action = function () {
        toot.fireEvent(this, "action");
    }
};
toot.defineEvent(toot.lib.Timeout, "action");
toot.extendClass(toot.lib.Timeout, {
    start: function () {
        this._timer = setTimeout(this._action, delay);
    },
    clear: function () {
        clearTimeout(this._timer);
    }
});

toot.lib.Interval = function (delay) {
    this._delay = delay;
    this._timer = null;
    var _this = this;
    this._action = function () {
        toot.fireEvent(this, "action");
    }
};
toot.defineEvent(toot.lib.Interval, "action");
toot.extendClass(toot.lib.Interval, {
    start: function () {
        this._timer = setInterval(this._action, "action");
    },
    clear: function () {
        clearInterval(this._timer);
    }
});


toot.lib.toot = function () {
    return "toot.lib";
};