'use strict';

// Declare app level module which depends on templates, and components
var app = angular.module('myApp', [
    'ngRoute',
    'ngResource',
    'ngDialog',
    'http-auth-interceptor',
    'myApp.employeeList'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/employeeList'});
}]);