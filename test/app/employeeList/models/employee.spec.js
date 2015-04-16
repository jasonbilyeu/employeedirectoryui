describe('employee', function () {

    beforeEach(module('directory.employee'));

    var Employee,
        $httpBackend;

    beforeEach(inject(function($injector, _$httpBackend_){
        Employee = $injector.get('Employee');
        $httpBackend = _$httpBackend_;
    }));

    describe('Employee', function () {
        it('should default data members', function () {
            var employee = new Employee();

            expect(employee.data).toEqual({
                id: null,
                firstName: null,
                lastName: null,
                jobTitle: null,
                location: null,
                email: null,
                phoneNumbers: [''],
                employeeType: null
            });
        });

        it('should set data members when passed in', function () {
            var employee = new Employee({});

            expect(employee.data).toEqual({});
        });

        it('should delete', function () {
            $httpBackend.expectDELETE('/employee/1').respond({});
            var employee = new Employee({id: 1});

            employee.delete();
            $httpBackend.flush();
        });

        it('should update', function () {
            $httpBackend.expectPUT('/employee/1').respond({});
            var employee = new Employee({id: 1});

            employee.update();
            $httpBackend.flush();
        });

        it('should insert', function () {
            $httpBackend.expectPOST('/employee').respond({});
            var employee = new Employee();

            employee.insert();
            $httpBackend.flush();
        });

        it('should add phone number', function () {
            var employee = new Employee({phoneNumbers: ['']});

            employee.addPhoneNumber();

            expect(employee.data.phoneNumbers).toEqual(['', '']);
        });

        it('should delete phone number', function () {
            var phoneNumber = '(512) 555-5555';
            var employee = new Employee({phoneNumbers: [phoneNumber]});

            employee.deletePhoneNumber(phoneNumber);

            expect(employee.data.phoneNumbers).toEqual([]);
        });
    });
});