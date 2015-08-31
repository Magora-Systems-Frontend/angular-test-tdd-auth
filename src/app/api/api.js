(function (window, angular) {
    'use strict';

    angular
        .module('app.api', [
            'uuid'
        ])
        .provider('$api', provider);

    function provider() {

        var provider = this;

        this.defaults = {
            url: '',
            authorizationToken: null,
            tokenExpirationTime: ''
        };

        this.$get = factory;

        factory.$inject = ['$http', 'rfc4122'];

        function factory($http, rfc4122) {

            return {
                setDefaults: function (credentials) {
                    provider.defaults = angular.extend(provider.defaults, credentials);
                },

                getParam: function (param) {
                    return provider.defaults[param];
                },

                getUrl: function (url) {
                    return provider.defaults.url + url;
                },

                getHeaders: function () {
                    var headers = {
                        'X-Reference': rfc4122.v4(),
                        'X-UTC-Timestamp': Math.floor(new Date().getTime() / 1000)
                    };
                    if (provider.authorizationToken !== null) {
                        headers['Authorization'] = provider.defaults.authorizationToken;
                    }

                    return headers;
                },

                tokenIsExpire: function () {
                    return Math.floor(new Date().getTime() / 1000) <= provider.defaults.tokenExpirationTime
                },

                request: function(method, path, data){
                    var url = this.getUrl(path);
                    var headers = this.getHeaders();

                    return $http[method](url, data, {
                        headers: headers
                    });
                },

                get: function (path) {

                    return this.request('get', path)
                },

                post: function (path, data) {

                    return this.request('post', path, data)
                }
            }

        }

    }


})(window, window.angular);