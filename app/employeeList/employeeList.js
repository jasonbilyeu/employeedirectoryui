'use strict';

angular.module('myApp.employeeList', ['ngRoute', 'smart-table', 'ngDialog'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/employeeList', {
            templateUrl: 'templates/employeeList.html',
            controller: 'EmployeeListCtrl'
        });
    }])
    .constant('EmployeeTypes', {
        "HR": "HR",
        "REGULAR": "REGULAR"
    })
    .factory('Employee', ['$http', function ($http) {
        function Employee(employeeData) {
            this.setData(employeeData || {
                id: null,
                firstName: null,
                lastName: null,
                jobTitle: null,
                location: null,
                email: null,
                phoneNumbers: [''],
                employeeType: null
            });
        }

        Employee.prototype = {
            setData: function (employeeData) {
                angular.extend(this, employeeData);
            },
            findOne: function (id) {
                var scope = this;
                $http.get('http://localhost:8080/employee/' + id, {withCredentials: true}).success(function (employeeData) {
                    scope.setData(employeeData);
                });
            },
            delete: function () {
                return $http.delete('http://localhost:8080/employee/' + this.id, {withCredentials: true});
            },
            update: function () {
                return $http.put('http://localhost:8080/employee/' + this.id, this, {withCredentials: true});
            },
            insert: function () {
                return $http.post('http://localhost:8080/employee', this, {withCredentials: true});
            },
            addPhoneNumber: function () {
                this.phoneNumbers.push('');
            },
            deletePhoneNumber: function (phoneNumber) {
                var index = this.phoneNumbers.indexOf(phoneNumber);
                if (index > -1) {
                    this.phoneNumbers.splice(index, 1);
                }
            }
        };
        return Employee;
    }])
    .service('EmployeeListService', ['$http', '$q', 'authService', function ($http, $q) {
        return {
            getEmployees: function (params) {
                var deferred = $q.defer();

                params = params || {pageNumber: 0, pageSize: 10};

                $http.get('http://localhost:8080/employee', {withCredentials: true, params: params})
                    .then(function (response) {
                        if (response.status == 200) {
                            deferred.resolve(response.data);
                        } else {
                            deferred.reject('Error retrieving user info');
                        }
                    });

                return deferred.promise;
            }
        }
    }])
    .controller('EmployeeListCtrl', ['EmployeeListService', '$scope', 'Employee', 'ngDialog', 'EmployeeTypes', function ($employeeListService, $scope, Employee, ngDialog, EmployeeTypes) {

        $scope.$on('event:auth-forbidden', function () {
            ngDialog.open({
                template: '<p>You do not have sufficient permissions to create, modify, or delete employees.</p>',
                plain: true
            });
        });

        $scope.callServer = function callServer(tableState) {
            $scope.isLoading = true;

            $employeeListService.getEmployees({
                pageNumber: getPageNumber(tableState),
                pageSize: getPageSize(tableState),
                sortColumn: getSortColumn(tableState),
                sortDirection: getSortDirection(tableState),
                search: getSearchString(tableState)
            }).then(function (employeesWithPageInfo) {
                $scope.employees = [];
                for (var i in employeesWithPageInfo.content) {
                    $scope.employees.push(new Employee(employeesWithPageInfo.content[i]));
                }
                tableState.pagination.numberOfPages = employeesWithPageInfo.totalPages;//set the number of pages so the pagination can update
                $scope.displayEmployees = [].concat($scope.employees);
                $scope.isLoading = false;
            });
        };

        function getPageNumber(tableState) {
            var pagination = tableState.pagination;
            var start = pagination.start || 0;     // This is NOT the page number, but the index of item in the list that you want to use to display the table.

            var pageNumber = 0;

            if (start != 0) {
                pageNumber = Math.floor(start / getPageSize(tableState));
            } else {
                pageNumber = 0;
            }

            return pageNumber;
        }

        function getPageSize(tableState) {
            var pagination = tableState.pagination;
            return pagination.number || 10;  // Number of entries showed per page.
        }

        function getSortColumn(tableState) {
            return tableState.sort.predicate || 'lastName';
        }

        function getSortDirection(tableState) {
            return (tableState.sort.reverse ? 'DESC' : 'ASC');
        }

        function getSearchString(tableState) {
            var searchStrings = [];
            if (tableState.search.predicateObject && Object.keys(tableState.search.predicateObject).length > 0) {
                var searchKeys = Object.keys(tableState.search.predicateObject);
                for (var i in searchKeys) {
                    searchStrings.push(searchKeys[i] + ':' + tableState.search.predicateObject[searchKeys[i]]);
                }
            }
            return searchStrings.join(',');
        }

        function loadEmployees() {
            $employeeListService.getEmployees().then(function (employeesWithPageInfo) {
                var employees = [];
                for (var i in employeesWithPageInfo.content) {
                    employees.push(new Employee(employeesWithPageInfo.content[i]));
                }
                $scope.employees = employees;
                $scope.displayEmployees = [].concat($scope.employees);
            });
        }

        $scope.deleteEmployee = function (employee) {
            ngDialog.openConfirm({
                template: 'templates/confirmModal.html',
                scope: $scope
            }).then(
                function (value) {
                    employee.delete().then(function () {
                        loadEmployees();
                    })
                }
            );
        };

        $scope.editEmployee = function (employee) {
            var editEmployee = angular.copy(employee);
            console.log(EmployeeTypes);
            ngDialog.openConfirm({
                template: 'templates/editEmployeeModal.html',
                data: {
                    employee: editEmployee,
                    employeeTypes: EmployeeTypes
                }
            }).then(
                function () {
                    editEmployee.update().then(function () {
                        loadEmployees();
                    })
                }
            );
        };

        $scope.createEmployee = function () {
            var employee = new Employee();
            ngDialog.openConfirm({
                template: 'templates/editEmployeeModal.html',
                data: {
                    employee: employee,
                    employeeTypes: EmployeeTypes
                }
            }).then(
                function () {
                    employee.insert().then(function () {
                        loadEmployees();
                    })
                }
            );
        }


    }]);