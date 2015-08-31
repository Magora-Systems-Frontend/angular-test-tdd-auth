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