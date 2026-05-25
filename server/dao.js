import sqlite3 from "sqlite3"
import crypto from "crypto"
import { Student, Course } from "./Modules.js"

const db = new sqlite3.Database("database.sqlite", (err) => {
    if (err) throw err;
});

const getIncompatibilities = (courseCode) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT courseCode2 FROM incompatibility WHERE courseCode1 = ?`;
        db.all(sql, [courseCode], (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                const incompatibilities = rows.map((i) => i.courseCode2);
                resolve(incompatibilities);
            }
        })
    })
}

export const listCourses = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT course.*, COUNT(studyPlan.studentId) AS enrolled
            FROM course
            LEFT JOIN studyPlan ON studyPlan.courseCode = course.courseCode
            GROUP BY course.courseCode`;
        db.all(sql, async (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                try{
                    const promises = rows.map(async (c) => 
                        new Course(c.courseCode, c.name, c.credits,
                            c.maxStudents, c.preparatoryCourse, c.enrolled,
                        await getIncompatibilities(c.courseCode)));

                    const courses = await Promise.all(promises);
                    resolve(courses);
                }
                catch (error){
                    reject(error);
                }
            }
        });
    });
}

export const listStudents = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT userId, name, surname, email, planType FROM user`;
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err);
            }
            else{
                const students = rows.map((s) => new Student(s.userId, s.name, s.surname, s.email, s.planType));
                resolve(students);
            }
        });
    });
}

export const listPlan = (studentId) => {
    return new Promise((resolve, reject) => {
        const sql = `
                    SELECT courseCode
                    FROM studyPlan
                    WHERE studyPlan.studentId = ?`;
        db.all(sql, [studentId], async (err, rows) => {
            if (err){
                reject(err);
            }
            else{
                try{
                    const planCourses = rows.map((pc) => pc.courseCode);
                    const courses = await listCourses();
                    const filteredCourses = courses.filter((c) => planCourses.includes(c.courseCode));
                    resolve(filteredCourses)
                }
                catch (error){
                    reject(error);
                }
            }
        })
        
    })
}

export const getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) { 
        reject(err); 
      }
      else if (row === undefined) { 
        resolve(false); 
      }
      else {
        const user = {id: row.userId, email: row.email, name: row.name, surname: row.surname, typeOfOplan: row.planType};
        
        crypto.scrypt(password, row.salt, 64, function(err, hashedPassword) {
          if (err) reject(err);
          if(!crypto.timingSafeEqual(Buffer.from(row.password, "hex"), hashedPassword))
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};