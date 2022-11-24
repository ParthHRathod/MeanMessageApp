var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'views/signup.html',
        controller: 'signupController'
    })
    .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'signupController',
    })
    .when('/login', {
        templateUrl:'views/login.html',
        controller: 'loginController',
        resolve: ['authService', function (authService) {
            return authService.validate();
        }]
    })
    .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'homeController',
        resolve: ['authService', function (authService) {
            return authService.validate();
        }]
    })
    .when('/messages', {
        templateUrl: 'views/messages.html',
        controller: 'messagesController',
        resolve: ['authService', function (authService) {
            return authService.validate();
        }]
    })
    .when('/messages/:m_id', {
        templateUrl: 'views/details.html',
        controller: 'detailsController',
        resolve: ['authService', function (authService) {
            return authService.validate();
        }]
    })
    .when('/logout', {
        redirectTo: 'views/login.html',
    })
    .when('/error', {
        template: '<h1>Invalid url</h1>'
    })
    .otherwise({
        redirectTo: '/error'
    })
});

app.controller('navController', function($scope, $rootScope, $window) {
    // console.log('main');
        var loggedIn = $window.localStorage.getItem('token');
        $rootScope.loggedIn = loggedIn;
    
    $scope.logout = function() {
        $rootScope.loggedIn = false;
        $window.localStorage.removeItem('token');
        $window.localStorage.removeItem('loggedInUser');
    };
});

app.controller('signupController', function($scope, $rootScope, $window, $location, $http) {
    
    $rootScope.loggedIn = false;
    $scope.errorMsg = '';
    $scope.register = function() {
       var newUser = $scope.newUser;

        $http.post('http://localhost:3000/api/auth/register', newUser)
        .then((resp) => {
            if (resp.data.isLoggedIn) {
                $window.localStorage.setItem('token', resp.data.token);
                $window.localStorage.setItem('loggedInUser', newUser.username);
                $rootScope.loggedIn = true;
                $location.path(['/home']);
            }
        })
        .catch((err) => {
            $scope.errorMsg = (err.data);
        });        
    };
    // console.log("signC = "+$rootScope.loggedIn);
});

app.controller('loginController', function ($scope, $rootScope, $window, $location, $http) {
    // console.log('login controller');
    $scope.errorMsg = '';
    $scope.login = function () {
        
        var user = $scope.user;
        console.log(user); 
        $http.post('http://localhost:3000/api/auth/login', user)
        .then((resp) => {
            if (resp.data.isLoggedIn) {
                $window.localStorage.setItem('token', resp.data.token);
                $window.localStorage.setItem('loggedInUser', user.username);
                $rootScope.loggedIn = true;
                $location.path(['/home']);
            }
        })
        .catch((err) => {
        $scope.errorMsg = (err.data.message);
        });        
    };
    // console.log("loginC = " +$rootScope.loggedIn);
});

app.controller('homeController', function($scope, $window, $http) {

    $scope.errorMsg = '';
    var req = {
        method: 'GET',
        url: 'http://localhost:3000/api/msgs/getName',
        headers: {
            'authtoken': $window.localStorage.getItem('token')
        }
    }
    $http(req).then((data) => {
        $scope.user = ('Welcome '+data.data.firstname+' '+data.data.lastname+'!');
    })
    .catch((err) => {
        $scope.errorMsg = err.data.message;
    });
});

app.controller('messagesController', function ($scope, $window, $http, receivedMessages) {
    // $scope.errorMsg = '';
    receivedMessages.getMessages()
    .then((resp) => {
        // console.log(resp.data);
        $scope.messages = resp.data;
    })
    .catch((err) => {
        console.log(err);
        $scope.errorMsg = err.data.message;
    });
    
    var newMsg = {};
    $scope.compose = function() {
        $scope.sendClick = true;
    };
    $scope.send = function() {
        newMsg = {
            // id: Math.random() * (10000 - 0) + 0,
            sender: $window.localStorage.getItem('loggedInUser'),
            receiver: $scope.toUser,
            body: $scope.sendMsg,
            important: false
        }

        var req = {
            method: 'POST',
            url: 'http://localhost:3000/api/msgs/sendMessage',
            headers: {
                'authtoken': $window.localStorage.getItem('token')
            },
            data: newMsg
        }

        $http(req).then((resp) => {
            console.log('Msg sent at: '+resp.data.date);
        })
        .catch((err) => {
            $scope.errorMsg = err.data.message;
        });

        $scope.toUser = "";
        $scope.sendMsg = "";
        $scope.sendClick = false;
        receivedMessages.getMessages()
        .then((resp) => {
            // console.log(resp.data);
            $scope.messages = resp.data;
        })
        .catch((err) => {
            $scope.errorMsg = err.data.msg;
        });
    };

    $scope.delete = function(msg) {

        var req ={
            method: 'POST',
            url: 'http://localhost:3000/api/msgs/deleteMessage',
            headers: {
                'authtoken': $window.localStorage.getItem('token')
            },
            data: msg
        }

        $http(req)
        .then((resp) => {
            console.log(resp.data);
            // $scope.messages = resp.data;
        })
        .catch((err) => {
            $scope.errorMsg = err.data.msg;
        });

        receivedMessages.getMessages()
        .then((resp) => {
            // console.log(resp.data);
            $scope.messages = resp.data;
        })
        .catch((err) => {
            $scope.errorMsg = err.data.message;
        });
    };

    $scope.important = function(msg) {

        var req = {
            method: 'POST',
            url: 'http://localhost:3000/api/msgs/important',
            headers: {
                'authtoken': $window.localStorage.getItem('token')
            },
            data: msg
        }

        $http(req).then((data) => {

        })
        .catch((err) => {

        });
        receivedMessages.getMessages()
        .then((resp) => {
            // console.log(resp.data);
            $scope.messages = resp.data;
        })
        .catch((err) => {
            $scope.errorMsg = err.data.message;
        });
    };
});

app.controller("detailsController", function ($routeParams, $location, $http, $window, $scope, receivedMessages) {
    var received = [];
    receivedMessages.getMessages()
    .then((resp) => {
        // console.log(resp.data);
        received = resp.data;
        gofurther();
    })
    .catch((err) => {
        $scope.errorMsg = err.data.message;
    });
    function gofurther() {
        $scope.message = (received[$routeParams.m_id]);
        // var msgs = JSON.parse($window.localStorage.getItem('messages'));
        var sender = $window.localStorage.getItem('loggedInUser');
        $scope.back = function () {
            $location.path(['/messages']);
        };
        $scope.reply = function () {
            $scope.replyClick = true;
        };
        $scope.send = function () {
            var newMsg = {
                // id: Math.random() * (10000 - 0) + 0,
                sender: sender,
                receiver: received[$routeParams.m_id].sender,
                body: $scope.replyMsg,
                important: false
            }
            var req = {
                method: 'POST',
                url: 'http://localhost:3000/api/msgs/sendMessage',
                headers: {
                    'authtoken': $window.localStorage.getItem('token')
                },
                data: newMsg
            }

            $http(req).then((resp) => {
                console.log('Reply sent at: ' + resp.data.date);
            })
            .catch((err) => {
                $scope.errorMsg = err.data.message;
            });
            $scope.replyMsg = "";
            $scope.replyClick = false;
        };
    }
});

app.factory('receivedMessages', function ($window, $http) {
    return {
        "getMessages": function () {

            var req = {
                method: 'GET',
                url: 'http://localhost:3000/api/msgs/getReceviedMessages',
                headers: {
                    'authtoken': $window.localStorage.getItem('token')
                }
            }
            return $http(req);            
        }
    }
});

app.factory('authService', function ($window, $location, $rootScope) {
    return {
        validate: function () {
            if (!$window.localStorage.getItem('token')) {
                $location.path(['/login']);
                $rootScope.loggedIn = false;
            }
        }
    }
});

// app.directive('testDirective', function ($compile) {
//     return {
//         'template': `
//         <div class="content">
//             <div class="msg" ng-repeat="msg in messages">
//                 <a href="#/messages/{{$index}}">
//                     <p>From: {{msg.sender}} </p>
//                     <p>Message: {{msg.body}} </p>
//                     -----------------------------------------------
//                 </a>
//             </div>
//         </div>`,
//         restrict: 'EAC',
//         scope: false,
//         link: function (scope, elem, attributes) {
//             $compile(elem.contents())(scope);
//         }
//     }
// });