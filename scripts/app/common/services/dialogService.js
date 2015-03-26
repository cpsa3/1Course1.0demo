"use strict";

define(["angular", 'ngDialog'], function (angular) {
    return angular.module("Dialog.services", ['ngDialog'])
        .service('gintDialog', ['$timeout', 'ngDialog', function ($timeout, ngDialog) {
            return {
                confirm: function (title, message, successCallback, errorCallback) {

                    var dialog = ngDialog.openConfirm({
                        template: 'common/templates/dialogs/confirm.html',
                        data: {
                            title: title,
                            message: message
                        }
                    }).then(function (data) {
                        successCallback(data);
                    }, function (data) {
                        errorCallback(data);
                    });
                },
                error: function (message, duration) {
                    duration = duration || 3000;

                    var dialog = ngDialog.openConfirm({
                        template: 'common/templates/dialogs/error.html',
                        data: {
                            message: message,
                            close: function () {
                                ngDialog.close();
                                $timeout.cancel(timer);
                            }
                        }
                    });

                    var timer = $timeout(function () {
                        ngDialog.close();
                    }, duration);
                },
                success: function (message, duration) {
                    duration = duration || 1000;
                    var dialog = ngDialog.openConfirm({
                        template: 'common/templates/dialogs/success.html',
                        data: {
                            message: message
                        }
                    });

                    $timeout(function () {
                        ngDialog.close();
                    }, duration);
                }
            };
        }]);
});
