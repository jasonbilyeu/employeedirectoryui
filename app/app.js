'use strict';

// Declare app level module which depends on templates, and components
var app = angular.module('directory', [
    'ngRoute',
    'ngResource',
    'ngDialog',
    'ui.mask',
    'http-auth-interceptor',
    'directory.employeeList',
    'directory.employeeTypes',
    'directory.employee',
    'directory.employeeListService',
    'directory.employeeListCtrl',
    'environment'
]);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/employeeList'});
}]);