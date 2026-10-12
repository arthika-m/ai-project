app.controller("StudentController", function($scope, StudentService) {

    $scope.student = {};
    $scope.students = [];
    $scope.search = "";
    $scope.editing = false;

    $scope.loadStudents = function() {

        StudentService.getStudents()
            .then(function(response) {
                $scope.students = response.data;
            });

    };


    $scope.addStudent = function() {

        StudentService.addStudent($scope.student)
            .then(function(response) {

                $scope.students.push(response.data);
                $scope.student = {};

            });

    };


    $scope.editStudent = function(student) {

        $scope.student = angular.copy(student);
        $scope.editing = true;

    };


    $scope.updateStudent = function() {

        StudentService.updateStudent(
            $scope.student._id,
            $scope.student
        )
        .then(function() {

            $scope.student = {};
            $scope.editing = false;
            $scope.loadStudents();

        });

    };


    $scope.deleteStudent = function(id) {

        StudentService.deleteStudent(id)
            .then(function() {
                $scope.loadStudents();
            });

    };


    $scope.cancelEdit = function() {

        $scope.student = {};
        $scope.editing = false;

    };


    $scope.loadStudents();

});