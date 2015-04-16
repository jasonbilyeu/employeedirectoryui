'use strict';

angular.module('directory.employeeListCtrl', [])
    .controller('EmployeeListCtrl', ['EmployeeListService', '$scope', 'Employee', 'ngDialog', 'EmployeeTypes', function ($employeeListService, $scope, Employee, ngDialog, EmployeeTypes) {

        $scope.$on('event:auth-forbidden', function () {
            ngDialog.open({
                template: '<p>You do not have sufficient permissions to create, modify, or delete employees.</p>',
                plain: true
            });
        });

        $scope.updateEmployeeList = function updateEmployeeList(tableState) {
            $scope.isLoading = true;
            $scope.tableState = tableState;

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

        $scope.deleteEmployee = function (employee) {
            ngDialog.openConfirm({
                template: 'employeeList/templates/confirmModal.html',
                scope: $scope
            }).then(
                function () {
                    employee.delete().then(function () {
                        $scope.updateEmployeeList($scope.tableState);
                    })
                }
            );
        };

        $scope.editEmployee = function (employee) {
            var editEmployee = angular.copy(employee);
            console.log(EmployeeTypes);
            ngDialog.openConfirm({
                template: 'employeeList/templates/editEmployeeModal.html',
                data: {
                    employee: editEmployee,
                    employeeTypes: EmployeeTypes
                }
            }).then(
                function () {
                    editEmployee.update().then(function () {
                        $scope.updateEmployeeList($scope.tableState);
                    })
                }
            );
        };

        $scope.createEmployee = function () {
            var employee = new Employee();
            ngDialog.openConfirm({
                template: 'employeeList/templates/editEmployeeModal.html',
                data: {
                    employee: employee,
                    employeeTypes: EmployeeTypes
                }
            }).then(
                function () {
                    employee.insert().then(function () {
                        $scope.updateEmployeeList($scope.tableState);
                    })
                }
            );
        }
    }]);