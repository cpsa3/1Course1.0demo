var businesscomponents = businesscomponents || {};

businesscomponents.model = businesscomponents.model || {};

businesscomponents.model.BusinessType = {
    Fill: 1,
    Select: 2
};

businesscomponents.model.BusinessItem = function () {
    this._id = 0;
    this._businessType = null;
    this._content = null;
    this._orderNum = -1;
};
toot.extendClass(businesscomponents.model.BusinessItem, {
    getId: function () {
        return this._id;
    },
    setId: function (id) {
        this._id = id;
    },
    getBusinessType: function () {
        return this._businessType;
    },
    setBusinessType: function (businessType) {
        this._businessType = businessType;
    },
    getContent: function () {
        return this._content;
    },
    setContent: function (content) {
        this._content = content;
    },
    getOrderNum: function () {
        return this._orderNum;
    },
    setOrderNum: function (orderNum) {
        this._orderNum = orderNum;
    }
});


businesscomponents.model.BusinessResponseItem = function () {
    this._id = null;
    this._content = null;
};
toot.extendClass(businesscomponents.model.BusinessResponseItem, {
    getId: function () {
        return this._id;
    },
    setId: function (id) {
        this._id = id;
    },
    getContent: function () {
        return this._content;
    },
    setContent: function (content) {
        this._content = content;
    }
});

businesscomponents.model.RightWrong = function () {
    this._right = 0,
    this._wrong = 0
};
toot.extendClass(businesscomponents.model.RightWrong, {
    getRight: function () {
        return this._right;
    },
    setRight: function (right) {
        this._right = right;
    },
    getWrong: function () {
        return this._wrong;
    },
    setWrong: function (wrong) {
        this._wrong = wrong;
    },
    getTotal: function () {
        return this._right + this._wrong;
    }
});


businesscomponents.model.typeOf = function (val) {
    return val.constructor;
};

businesscomponents.model.parseObjArray = function (array, parser) {
    if (array == null) return null;

    var result = [];
    for (var i = 0, l = array.length; i < l; i++)
        result.push(parser(array[i]));
    return result;
};