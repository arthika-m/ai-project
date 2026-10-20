app.service("StudentService", function($http) {
    this.getStudents = function() {
        return $http.get("/students");
    };
    this.addStudent = function(student) {
        return $http.post("/students", student);
    };
    this.updateStudent = function(id, student) {
        return $http.put("/students/" + id, student);
    };
    this.deleteStudent = function(id) {
        return $http.delete("/students/" + id);
    };
});