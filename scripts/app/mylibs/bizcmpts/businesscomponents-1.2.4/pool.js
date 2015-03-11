var businesscomponents = businesscomponents || {};

businesscomponents.Pool = function (ctor) {
    this._ctor = ctor
    this._members = [];
    this._initializer = null;
    this._disposer = null;
    this._isNewLastPoped = false;
}
toot.extendClass(businesscomponents.Pool, {
    pop: function () {
        var member = null;
        if (this._members.length > 0) {
            member = this._members.pop();
            this._isNewLastPoped = false;
        }
        else {
            member = new this._ctor();
            this._isNewLastPoped = true;
        }
        if (this._initializer)
            this._initializer(member);

        return member;
    },
    push: function (member) {
        if (this._disposer) this._disposer(member);
        this._members.push(member);
    },

    isNewLastPoped: function () { return this._isNewLastPoped },
    getInitializer: function () { return this._initializer },
    setInitializer: function (initializer) { this._initializer = initializer },
    getDisposer: function () { return this._disposer },
    setDisposer: function (disposer) { this._disposer = disposer }
});