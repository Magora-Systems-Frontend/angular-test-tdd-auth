(function (window, angular) {
    'use strict';

    angular
        .module('app', [
            'app.api',
            'app.user'
        ])
        .config(config);

    config.$inject = ['$apiProvider', '$userProvider'];

    function config($apiProvider, $userProvider) {
        $apiProvider.defaults.url = 'http://fd-api-2-testing.freelancediary.com';

        $userProvider.defaults = {
            applicationId: "jr6V8KpEWkDqdXaqFWBmxhtbbXwJsbwscFIOSreI0MM=",
            deviceUUID: "29cf6d9f-cbad-465e-a550-55721e05c43c",
            deviceName: "Mozilla\/5.0 (X11; Linux x86_64) AppleWebKit\/537.36 (KHTML, like Gecko) Chrome\/43.0.2357.130 Safari\/537.36"
        };

    }


})(window, window.angular);
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
(function (window, angular) {
    'use strict';

    angular
        .module('app.user', [
            'app.api'
        ])
        .provider('$user', provider);

    function provider() {

        var provider = this;

        this.default = {
            applicationId: null,
            deviceUUID: null,
            deviceName: null
        };

        this.$get = factory;

        factory.$inject = ['$api', '$q'];

        function factory($api, $q) {

            return {
                authenticate: function () {
                    return $api
                        .post('/auth', {
                            applicationId: provider.defaults.applicationId,
                            deviceUUID: provider.defaults.deviceUUID,
                            deviceName: provider.defaults.deviceName
                        })
                        .success(function (response, status, headers) {

                            var credentials = {
                                authorization: headers().authorization,
                                refreshToken: response.refreshToken,
                                accessToken: response.accessToken,
                                tokenExpirationTime: response.tokenExpirationTime
                            };

                            $api.setDefaults(credentials);

                        });
                },

                refreshToken: function () {
                    return $api
                        .post('/auth/refresh', {
                            accessToken: provider.defaults.applicationId,
                            refreshToken: provider.defaults.deviceUUID
                        })
                        .success(function (response, status, headers) {

                            var credentials = {
                                authorization: headers().authorization,
                                refreshToken: response.refreshToken,
                                accessToken: response.accessToken,
                                tokenExpirationTime: response.tokenExpirationTime
                            };

                            $api.setDefaults(credentials);

                        });
                },

                checkToken: function () {

                    var def = $q.defer();

                    function runCheck() {
                        $api
                            .get('/auth/test_fdjwtv1')
                            .success(function (data) {
                                def.resolve(data)
                            });
                    }

                    if ($api.tokenIsExpire()) {
                        this.refreshToken()
                            .then(function () {
                                runCheck();
                            });
                    } else {
                        runCheck()
                    }

                    return def.promise;


                }


            }

        }

    }


})(window, window.angular);