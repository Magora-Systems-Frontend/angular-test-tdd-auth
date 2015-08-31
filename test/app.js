describe('App', function () {

    var Authorization = 'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0NDEwMDQ5NzMsImV4cCI6MTQ0MTA5NDk3MywiYXVkIjoiNTQ2YTI0NmQtMTFiOC00NDRkLTg5NDEtNzk1YjQ5YWI5NmIyIiwiaXNzIjoianI2VjhLcEVXa0RxZFhhcUZXQm14aHRiYlh3SnNid3NjRklPU3JlSTBNTT0iLCJqdGkiOiJRcWtGWi9EOUI2UzZIVWhXalJabGQvVHFYbHVXK0IyZjlUVWZCUXFOZ0EwPSIsIm5iZiI6MTQ0MTAwNDk3M30.LhvfTrLRivPl1DVNM1hFdAeGTeQGPC0_3ddAGynHCnI';


    beforeEach(angular.mock.module("app"));

    it('Auth', function (done) {

        inject(function ($api, $user, $httpBackend) {


            $httpBackend.expect('POST',
                $api.getUrl('/auth')
            )
                .respond(200,
                {
                    "clientId": "f305bb6f-4bcb-48f0-8b59-2c6978257ed1",
                    "deviceUUID": "29cf6d9f-cbad-465e-a550-55721e05c43c",
                    "deviceName": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
                    "accessToken": "7aZWXnRbLbOn8ZMgLRkIYqUieO/k2cpM8Ax4yguSnsU=",
                    "refreshToken": "L94XLkLcSs9glCWNjgIsXywJxAujDDkriA6u0XJawHI=",
                    "applicationId": "jr6V8KpEWkDqdXaqFWBmxhtbbXwJsbwscFIOSreI0MM=",
                    "created": 1441003100288,
                    "tokenExpirationTime": 1441093100288,
                    "tokenIssuedAt": 1441003100288,
                    "userId": null
                },
                {"Authorization": Authorization});

            $user
                .authenticate()
                .success(function (response, status, headers) {

                    expect(response).toBeObject();
                    expect(headers().authorization).toBeNonEmptyString();
                    expect(response.accessToken).toBeNonEmptyString();
                    expect(response.tokenExpirationTime).toBeNumber();
                    expect(response.refreshToken).toBeNonEmptyString();
                    done();
                });

            $httpBackend.flush();

        });
    }, 30);

    it('Refresh token', function (done) {

        inject(function ($api, $user, $httpBackend) {

            $httpBackend.expect('POST',
                $api.getUrl('/auth/refresh')
            )
                .respond(200,
                {
                    "clientId": "f305bb6f-4bcb-48f0-8b59-2c6978257ed1",
                    "deviceUUID": "29cf6d9f-cbad-465e-a550-55721e05c43c",
                    "deviceName": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
                    "accessToken": "BX8I+ZpqY95U0jDBcAO/alfV1W7bkSVyRaGjvZ80R9I=",
                    "refreshToken": "L94XLkLcSs9glCWNjgIsXywJxAujDDkriA6u0XJawHI=",
                    "applicationId": "jr6V8KpEWkDqdXaqFWBmxhtbbXwJsbwscFIOSreI0MM=",
                    "created": 1441003100000,
                    "tokenExpirationTime": 1441093286943,
                    "tokenIssuedAt": 1441003286943,
                    "userId": null
                },
                {"Authorization": Authorization});

            $user
                .refreshToken()
                .success(function (response, status, headers) {

                    expect(response).toBeObject();
                    expect(headers().authorization).toBeNonEmptyString();
                    expect(response.accessToken).toBeNonEmptyString();
                    expect(response.tokenExpirationTime).toBeNumber();
                    expect(response.refreshToken).toBeNonEmptyString();
                    done();
                });

            $httpBackend.flush();

        });
    }, 30);

    it('check token', function (done) {

        inject(function ($api, $user, $httpBackend) {

            $httpBackend.expect('GET',
                $api.getUrl('/auth/test_fdjwtv1')
            )
                .respond(200,'OK',
                {"Authorization": Authorization});

            $user
                .checkToken()
                .then(function (response) {
                    expect(response).toBe('OK');
                    done()
                });

            $httpBackend.flush();

        });
    }, 30);


});