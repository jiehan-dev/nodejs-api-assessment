const db = require('../database');
const Teacher = require('./Teacher');
const Student = require('./Student');

const TeacherStudentRegistry = db.define('teacher_student_registry');

Teacher.belongsToMany(Student, { through: TeacherStudentRegistry });
Student.belongsToMany(Teacher, { through: TeacherStudentRegistry });

module.exports = TeacherStudentRegistry;
