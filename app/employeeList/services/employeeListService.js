"use strict";

angular.module('directory.employeeListService', ['environment'])
    .service('EmployeeListService', ['$http', '$q', 'Environment', function ($http, $q, Environment) {
        return {
            getEmployees: function (params) {
                var deferred = $q.defer();

                params = params || {pageNumber: 0, pageSize: 10};

                $http.get(Environment.baseUrl + '/employee', {withCredentials: true, params: params})
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
    }]);
