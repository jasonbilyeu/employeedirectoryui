'use strict';

angular.module('directory.employee', ['environment'])
    .factory('Employee', ['$http', 'Environment', function ($http, Environment) {
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
                this.data = employeeData;
            },
            delete: function () {
                return $http.delete(Environment.baseUrl + '/employee/' + this.data.id, {withCredentials: true});
            },
            update: function () {
                return $http.put(Environment.baseUrl + '/employee/' + this.data.id, this.data, {withCredentials: true});
            },
            insert: function () {
                return $http.post(Environment.baseUrl + '/employee', this.data, {withCredentials: true});
            },
            addPhoneNumber: function () {
                this.data.phoneNumbers.push('');
            },
            deletePhoneNumber: function (phoneNumber) {
                var index = this.data.phoneNumbers.indexOf(phoneNumber);
                if (index > -1) {
                    this.data.phoneNumbers.splice(index, 1);
                }
            }
        };
        return Employee;
    }]);
