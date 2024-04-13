const express = require('express');
// const connection = require('./config/db');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const qrcode = require('qrcode');
require('dotenv').config();

const app = express();


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/views"));

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database:process.env.DATABASE
});

// Database connection--------
connection.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Hash password function
const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Example of inserting a user
// const full_name = 'admin';
// const email = 'admin@gmail.com';
// const password = 'password123'; // Plain text password
// hashPassword(password).then(hashedPassword => {
//     const sql = 'INSERT INTO admin (full_name, email, password) VALUES (?, ?, ?)';
//     connection.query(sql, [full_name, email, hashedPassword], (err, result) => {
//         if (err) throw err;
//         console.log('User inserted');
//     });
// });

// Route
app.get('/',(req,res) =>{
    res.render('login');   
})

// --------------------- Login-Logout-Authentication-Section --------------------

// Login route
app.post('/login', (req, res) => {
    const { email, password, role } = req.body;
    const query = `SELECT * FROM ${role} WHERE email = ?`;
    connection.query(query, [email], (err, results) => {  
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    req.session.user = user;
                    
                    res.redirect(`/${role}/dashboard`);
                } else {
                    res.send('Incorrect password');
                }
            });
        } else {
            res.send('User not found');
        }
    });
});

    

// Admin Dashboard route
app.get('/admin/dashboard', (req, res) => {    
    res.render('admin/dashboard', { user: req.session.user });    
});

// Student Dashboard route
app.get('/students/dashboard', (req, res) => {
    // if (!req.session.user || req.session.user.role !== 'students') {
    //     res.redirect('/');
    // } else {
    // }
    res.render('students/dashboard', { user: req.session.user });
});

// Teacher Dashboard route
app.get('/teachers/dashboard', (req, res) => {
    // if (!req.session.user || req.session.user.role !== 'teachers') { 
    //     res.redirect('/');
    // } else {
    // }
    res.render('teachers/dashboard', { user: req.session.user });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/');
    });
});




// -------------------- Forgot-Password-section ---------------------



// Route for the forgot password form
app.get('/forgot-password', (req, res) => {
    // res.sendFile(__dirname + '/forgot-password.html');
    res.render('forgot-password');
});



// ---------------Admin-Students-section -----------------



// Route for the students through admin
app.get('/admin/students-data', (req, res) =>{ 
    const sql = "SELECT s.stud_id, s.enroll_no, s.full_name, s.email, s.dob, s.phone_number, c.course_name, s.gender, s.session, s.section FROM students as s join courses as c on s.course_id = c.course_id";
    connection.query(sql, (err,rows) =>{
        if(err){
            console.log(err);
        }
        res.render('admin/student', {rows});
    });
})

// Route for the addstudentform though admin  
app.get('/admin/students-data/add-student-data-form', (req,res) =>{
    const sql = "SELECT * FROM courses";
    connection.query(sql, (err,rows) =>{
        if(err){
            console.log(err);
        }
        res.render('admin/addstudentform', {rows}); 
    });
})

app.post('/add-student-form', (req, res) => {
    const {enroll_no, full_name, email, dob, phone_number, course_id, gender, session, section, password} = req.body;
    console.log(req.body);
    hashPassword(password).then(hashedPassword => {
        const sql = 'INSERT INTO students (enroll_no, full_name, email, dob, phone_number, course_id, gender, session, section, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [enroll_no, full_name, email, dob, phone_number, course_id, gender, session, section, hashedPassword], (err, result) => {
            if (err) throw err;
            console.log('User inserted');
        });
        res.redirect('/admin/students-data'); 
    });
})




// ---------------Admin-Teacher-section -----------------




// Route for teacher through admin
app.get('/admin/teachers', (req, res) =>{
    const sql = "SELECT t.instructor_id, t.full_name, t.email, t.dob, t.address, t.phone_no, c.course_name FROM teachers as t join courses as c on t.course_id = c.course_id";
    connection.query(sql, (err,rows) =>{
        if(err){
            console.log(err);
        }
        res.render('admin/teacher', {rows});
    });
})

// Route for addteacherform through admin
app.get('/admin/teachers/add-teacher-form', (req,res) =>{
    const sql = "SELECT * FROM courses";
    connection.query(sql, (err,rows) =>{
        if(err){
            console.log(err);
        }
        res.render('admin/addteacherform', {rows});
    });
})

app.post('/add-teacher-form', (req, res) =>{
    const {full_name, email, dob, address, phone_no, course_id, password} = req.body;
    console.log(req.body);
    hashPassword(password).then(hashedPassword => {
        const sql = 'INSERT INTO teachers (full_name, email, dob, address, phone_no, course_id, password) VALUES (?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [full_name, email, dob, address, phone_no, course_id, hashedPassword], (err, result) => {
            if (err) throw err;
            console.log('User inserted');
        });
        res.redirect('/admin/teachers'); 
    });
})


// --------------------- Admin-Courses-section ---------------------

app.get('/admin/courses', (req,res) =>{ 
    const sql = "SELECT * FROM courses";
    connection.query(sql, (err,rows) =>{
        if(err){
            console.log(err);
        }
        res.render('admin/course', {rows});
    });
}) 

app.get('/admin/courses/add-courses-form', (req, res) =>{
    res.render('admin/addcourseform');
})

    // Route to handle form submission and add course to database
app.post('/addCourse', (req, res) => {
    const courseName = req.body.courseName;
    const courseDuration = req.body.courseDuration;

    // Insert course details into Courses table
    const courseInsertQuery = 'INSERT INTO Courses (course_name, course_duration) VALUES (?, ?)';
    connection.query(courseInsertQuery, [courseName, courseDuration], (courseInsertErr, courseInsertResult) => {
        if (courseInsertErr) {
            console.error('Error adding course to database:', courseInsertErr);
            res.status(500).send('Error adding course to database');
            return;
        }
        console.log('Course added successfully');
        res.redirect('/admin/courses'); 
    });
});





// ------------------------ Admin-Subjects-Section ------------------------

app.get('/admin/subjects', (req, res) => {
    const sql = 'SELECT s.subject_id, s.subject_code, s.subject_name, c.course_name, t.full_name, s.credits, s.semester FROM Subjects as s INNER JOIN Courses as c ON s.course_id = c.course_id INNER JOIN Teachers as t ON s.instructor_id = t.instructor_id;'
    connection.query(sql, (err, rows) => {
        if(err){
            console.log(err);
        }
        res.render('admin/subject', {rows});
    })
})

app.get('/admin/subjects/add-subject-form', (req, res) =>{
    const sql = 'SELECT c.course_id, c.course_name, c.course_duration, t.instructor_id, t.full_name  FROM courses as c join teachers as t on c.course_id = t.course_id';
    connection.query(sql, (err, rows) =>{
        if(err){
            console.log(err);
        }
        res.render('admin/addsubjectform', {rows}); 
    })
})

// Route to handle form submission and insert subject into database
app.post('/addSubject', (req, res) => {
    const { subjectCode, subjectName, course_id, instructor_id, credits, semester } = req.body;

    // Insert subject details into Subjects table
    const query = 'INSERT INTO Subjects (subject_code, subject_name, course_id, instructor_id, credits, semester) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(query, [subjectCode, subjectName, course_id, instructor_id, credits, semester], (err, result) => {
        if (err) {
            console.error('Error inserting subject into database:', err);
            res.status(500).send('Error inserting subject into database');
            return;
        }
        console.log('Subject inserted successfully');
        res.redirect('/admin/subjects'); // Redirect to the form page after insertion
    });
});



// -------------------------- QR Code ----------------------------

// // Sample data for the QR code
// const qrData = {
//     classId: "12345",
//     timestamp: "2024-03-10T08:00:00",
//     courseId: "CSE101",
//     subjectId: "S101",
//     instructorId: "I001"
// };

// // Convert data object to JSON string
// const qrDataString = JSON.stringify(qrData);

// // Generate QR code
// qrcode.toDataURL(qrDataString, (err, qrCodeUrl) => {
//     if (err) {
//         console.error('Error generating QR code:', err);
//         return;
//     }
//     console.log('QR code generated successfully');
//     console.log('QR code URL:', qrCodeUrl);
// });



// ---------------------------- Mark-Attendance in students section ----------------------------


// Route to handle attendance marking via QR code (student)
app.post('/markAttendance', (req, res) => {
    const { class_id, stud_id, instructor_id } = req.body;

    // Insert attendance record into Attendance table
    const query = 'INSERT INTO Attendance (class_id, stud_id, instructor_id, attendance_status, timestamp) VALUES (?, ?, ?, ?, NOW())';
    connection.query(query, [class_id, stud_id, instructor_id, 'Present'], (err, result) => {
        if (err) {
            console.error('Error marking attendance:', err);
            res.status(500).send('Error marking attendance');
            return;
        }

        console.log('Attendance marked successfully');
        res.status(200).send('Attendance marked successfully');
    });
});

app.get('/students/scanner', (req,res) =>{
    res.render('students/scanQRCode'); 
})



// ---------------------------- Admin Schedule Classes ----------------------------


app.get('/admin/scheduleclasses', (req, res) =>{
    res.render('admin/scheduleclasses');
})

app.get('/admin/scheduleclasses/add-classes-form', (req, res) =>{
    res.render('admin/addscheduleclasses');
})



// ------------------------- PORT -------------------------

app.listen(process.env.PORT || 4000, (error) =>{
    if(error) throw error;  
    console.log(`server running on port ${process.env.PORT}`); 
});



