describe('employeeListService', function () {

    beforeEach(module('directory.employeeListService'));

    var EmployeeListService,
        $httpBackend;

    beforeEach(inject(function ($injector, _$httpBackend_) {
        EmployeeListService = $injector.get('EmployeeListService');
        $httpBackend = _$httpBackend_;
    }));

    it('should get employees with default params', function () {
        $httpBackend.expectGET('/employee?pageNumber=0&pageSize=10').respond({data:{}});

        EmployeeListService.getEmployees();
        $httpBackend.flush();
    });

    it('should get employees with set params', function () {
        $httpBackend.expectGET('/employee?pageNumber=1&pageSize=15&search=firstName:abc').respond({data:{}});

        EmployeeListService.getEmployees({pageNumber:1, pageSize:15, search:'firstName:abc'});
        $httpBackend.flush();
    });
});