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