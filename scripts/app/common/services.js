"use strict";

define(["angular"], function(angular) {
    return angular.module("Common.services", [])
        .service("helloWorld", function() {
            return function() {
                return "hello world";
            };
        })
        .service("guidService", ["$q", function($q) {
            return {
                get: function() {
                    var S4 = function() {
                        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
                    };
                    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
                }
            };
        }])
        .service('messageService', ['$rootScope', function($rootScope) {
            var sharedService = {};

            sharedService.publish = function(msg, data) {
                data = angular.copy(data) || {};
                $rootScope.$broadcast(msg, data);
            };

            sharedService.subscribe = function(msg, scope, func) {
                scope.$on(msg, func);
            };

            return sharedService;
        }])
        .service('messageBus', ['$rootScope', function($rootScope) {
            var messageBus = {};

            messageBus.publish = function(msg, data) {
                data = angular.copy(data) || {};
                $rootScope.$emit(msg, data);
            };

            messageBus.subscribe = function(msg, scope, func) {
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
        .factory('singlePromiseWapper', ['$q', function($q) {
            /**
             * [description]
             * @param  {Function} fn [is a function whitch return a promise]
             * @return {[function]} [is a function which return a promise]
             */
            return function(fn) {
                var isProcessing = false;
                return function() {
                    if (isProcessing) {
                        console.log('isProcessing...');
                        return;
                    }

                    isProcessing = true;
                    var deferred = $q.defer();
                    fn.apply(null, arguments).then(function(result) {
                        isProcessing = false;
                        deferred.resolve(result);
                    }, function(reason) {
                        isProcessing = false;
                        deferred.reject(reason);
                    });

                    return deferred.promise;
                };
            };
        }])
        .factory('httpWapper', ['$q', 'singlePromiseWapper', function($q, singlePromiseWapper) {
            //return: a function which return a promise
            return {
                /**
                 * usage: 
                 * var netService = httpWapper.singleGet(url);
                 * netService();
                 */
                singleGet: function(url) {
                    return singlePromiseWapper(function() {
                        return $http.get(url);
                    });
                },
                singlePost: function(url, args) {
                    return singlePromiseWapper(function() {
                        return $http.post(url, args);
                    });
                }
            };
        }])
        .factory('demoNetService', ['$q', 'httpWapper', function($q, httpWapper) {
            /**
             * old usage:
             * demoNetService.getCurrentUser().then();
             * demoNetService.saveCurrentUser(args).then();
             *
             * new usage:
             * var getCurrentUserService = demoNetService.getCurrentUser();
             * getCurrentUserService().then();
             *
             * var saveCurrentUserService = demoNetService.saveCurrentUser(args);
             * saveCurrentUserService().then();
             */
            return {
                getCurrentUser: function() {
                    var url = '/UserService/GetCurrentUser';
                    return httpWapper.singleGet(url);
                },
                saveCurrentUser: function(args) {
                    var url = '/UserService/SaveCurrentUser';
                    return httpWapper.singlePost(url, args);
                }
            };
        }])
        .factory('format', ['$q', function($q) {
            //Method : format("And the {1} want to know whose {2} you {3}", "papers", "shirt", "wear");
            return function(string) {
                var args = arguments;
                var pattern = new RegExp("{([1-" + arguments.length + "])}", "g");
                return String(string).replace(pattern, function(match, index) {
                    return args[index];
                });
            };
        }]);
});