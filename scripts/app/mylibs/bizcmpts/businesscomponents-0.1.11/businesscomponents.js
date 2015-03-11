var businesscomponents = businesscomponents || {};

businesscomponents.RequestAndResponse = function () {
    this._request = null;
    this._response = null;
    this._renderingType = 1;
};
toot.extendClass(businesscomponents.RequestAndResponse, {
    getRequest: function () {
        return this._request;
    },
    setRequest: function (request) {
        this._request = request;
    },
    getResponse: function (response) {
        return this._response;
    },
    setResponse: function (response) {
        this._response = response;
    },
    getRenderingType: function () { return this._renderingType },
    setRenderingType: function (type) { this._renderingType = type }
});