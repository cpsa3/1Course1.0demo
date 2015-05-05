"use strict";

define(["angular"], function (angular) {
    return angular.module("Common.services", [])
        .service("helloWorld", function () {
            return function () {
                return "hello world";
            };
        })
        .service("guidService", ["$q", function ($q) {
            return {
                get: function () {
                    var S4 = function () {
                        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                    };
                    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                }
            };
        }])
        .service('messageService', ['$rootScope', function ($rootScope) {
            var sharedService = {};

            sharedService.publish = function (msg, data) {
                data = angular.copy(data) || {};
                $rootScope.$broadcast(msg, data);
            };

            sharedService.subscribe = function (msg, scope, func) {
                scope.$on(msg, func);
            };

            return sharedService;
        }])
        .service('messageBus', ['$rootScope', function ($rootScope) {
            var messageBus = {};

            messageBus.publish = function (msg, data) {
                data = angular.copy(data) || {};
                $rootScope.$emit(msg, data);
            };

            messageBus.subscribe = function (msg, scope, func) {
                var unsubscribe = $rootScope.$on(msg, func);
                if (scope) {
                    //remove the listener when $scope is destroyed
                    scope.$on('$destroy', unsubscribe);
                }
                //return the unsubscribe function so the user can do their own memory management
                return unsubscribe;
            };

            return messageBus;
        }])
        .factory('httpRequestWapper', ['$http', '$q', function ($http, $q) {
            return {
                get: function (url) {
                    var deferred = $q.defer();

                    $http.get(url).success(function (result) {
                        if (result.status === 1) {
                            deferred.resolve(result.data);
                        } else {
                            deferred.reject(result.message);
                        }
                    }).error(function (reason) {
                        deferred.reject(reason);
                    });

                    return deferred.promise;
                },
                post: function (url, arg) {
                    var deferred = $q.defer();

                    $http.post(url, arg).success(function (result) {
                        if (result.status === 1) {
                            deferred.resolve(result.data);
                        } else {
                            deferred.reject(result.message);
                        }
                    }).error(function (reason) {
                        deferred.reject(reason);
                    });

                    return deferred.promise;
                },
            };
        }])
        .factory('singlePromiseWapper', ['$q', function ($q) {
            /**
             * [description]
             * @param  {Function}  [first arg is a function whitch return a promise]
             * @return {[function]} [is a function which return a promise]
             */
            return function () {
                var isProcessing = false;
                // default args
                var args = Array.prototype.slice.call(arguments);
                var func = args.shift();
                return function () {
                    var deferred = $q.defer();

                    if (isProcessing) {
                        console.log('isProcessing...');
                        deferred.reject('请求处理中，请勿重复操作！');
                        return deferred.promise;
                    }

                    isProcessing = true;
                    func.apply(null, args.concat(Array.prototype.slice.call(arguments))).then(function (result) {
                        isProcessing = false;
                        deferred.resolve(result);
                    }, function (reason) {
                        isProcessing = false;
                        deferred.reject(reason);
                    });

                    return deferred.promise;
                };
            };
        }])
        .factory('singleHttpFactory', ['httpRequestWapper', 'singlePromiseWapper', function (httpRequestWapper, singlePromiseWapper) {
            return {
                /**
                 * description:
                 * get a function which is prohibited duplicate request.
                 * 
                 * usage: 
                 * var getNetService = singleHttpFactory.get(url);
                 * getNetService();
                 *
                 * var postNetService = singleHttpFactory.post(url);
                 * postNetService(args);
                 */
                get: function (url) {
                    return singlePromiseWapper(httpRequestWapper.get, url);
                },
                post: function (url) {
                    return singlePromiseWapper(httpRequestWapper.post, url);
                }
            };
        }])
        
        .factory('demoNetService', ['$q', 'singleHttpFactory', function ($q, singleHttpFactory) {
            /**
             * usage:
             * demoNetService.getCurrentUser().then();
             *
             * demoNetService.saveCurrentUser(args).then();
             */
            return {
                getCurrentUser: singleHttpFactory.get('/UserService/GetCurrentUser'),
                saveCurrentUser: singleHttpFactory.post('/UserService/SaveCurrentUser')
            };
        }])
        .factory('format', ['$q', function ($q) {
            //Method : format("And the {1} want to know whose {2} you {3}", "papers", "shirt", "wear");
            return function (string) {
                var args = arguments;
                var pattern = new RegExp("{([1-" + arguments.length + "])}", "g");
                return String(string).replace(pattern, function (match, index) {
                    return args[index];
                });
            };
        }]);
});
