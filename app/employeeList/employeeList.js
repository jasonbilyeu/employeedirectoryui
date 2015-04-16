'use strict';

angular.module('directory.employeeList', ['ngRoute', 'smart-table', 'ngDialog'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/employeeList', {
            templateUrl: 'employeeList/templates/employeeList.html',
            controller: 'EmployeeListCtrl'
        });
    }]);