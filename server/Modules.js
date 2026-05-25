function Student(id, name, surname, email, planType){
    this.studentId = id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.planType = planType === null ? null : planType;
}

function Course(code, name, credits, max_students, preparatory, enrolled, incompatible){
    this.courseCode = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = max_students === null ? null : max_students;
    this.preparatory = preparatory === null ? null : preparatory;
    this.incopatible = incompatible || [];
    this.enrolled = enrolled === undefined ? 0 : undefined;
}

export {Student, Course}