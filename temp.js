// Database connection--------
// async function connectToDatabase() {
//     try {
//         const connection = await mysql.createConnection({
//             host: process.env.HOST,
//             user: process.env.USER,
//             password: process.env.PASSWORD,
//             database: process.env.DATABASE
//         });
//         console.log('Connected to MySQL database');
//         return connection;
//     } catch (error) {
//         console.error('Error connecting to MySQL database:', error);
//         throw error; // Propagate the error to the caller
//     }
// }
// let connection = connectToDatabase();

// Hash password function
// async function hashPassword(password) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         return await bcrypt.hash(password, salt);
//     } catch (error) {
//         console.error('Error hashing password:', error);
//         throw error; // Propagate the error to the caller
//     }
// }


// Example of inserting a user
// async function insertUser(full_name, email, password) {
//     try {
//         const connection = await connectToDatabase();
//         const hashedPassword = await hashPassword(password);
//         const sql = 'INSERT INTO admin (full_name, email, password) VALUES (?, ?, ?)';
//         const [rows, fields] = await connection.query(sql, [full_name, email, hashedPassword]);
//         console.log('User inserted');
//         return rows;
//     } catch (error) {
//         console.error('Error inserting user:', error);
//         throw error; // Propagate the error to the caller
//     }
// }


// Usage
// const full_name = 'Gaurav';
// const email = 'gaurav_kumar_mca23s2@jimsindia.org';
// const password = 'jims@123';

// insertUser(full_name, email, password)
//     .then(() => {
//         console.log('User inserted successfully');
//     })
//     .catch(error => {
//         console.error('Failed to insert user:', error);
//     });




// const full_name = 'gaurav';
// const email = 'itsmegaurav121@gmail.com';
// const password = 'password123';
// const hashPassword = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
//   };
  
//   (async () => {
//     try {
//       const hashedPassword = await hashPassword(password);
//       const sql = 'INSERT INTO admin (full_name, email, Password) VALUES (?, ?, ?)';
//       const [rows,fields] = connection.query(sql, [full_name, email, hashedPassword]);
//       console.log('User inserted');
//     } catch (err) {
//       console.error(err + 'hello');
//     }
//   })();




// Route to handle the form submission
// app.post('/forgot-password', (req, res) => {
//     const {role, email} = req.body;
//     const query = `SELECT * FROM ${role} WHERE email = ?`;
//     connection.query(query, [email], (err, results) => {
//         if(err) throw err;
//     })

//     // Generate a reset token
//     const token = crypto.randomBytes(20).toString('hex');
//     // TODO: Save the token and associate it with the user's email in your database

//     // Send email with reset link
//     const resetLink = `http://localhost:${process.env.PORT}/reset-password?token=${token}`;
//     const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     });
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: 'Password Reset',
//         text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
//                Please click on the following link, or paste this into your browser to complete the process:\n\n
//                ${resetLink}\n\n
//                If you did not request this, please ignore this email and your password will remain unchanged.\n`
//     };
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log(error);
//             res.status(500).send('Error sending email');
//         } else {
//             console.log('Email sent: ' + info.response);
//             res.send('Check your email for the password reset link');
//         }
//     });
// });

// // Route for the password reset page
// app.get('/reset-password', (req, res) => {
//     const token = req.query.token;
//     // TODO: Verify the token and render the password reset form
//     res.send('Password reset form');
// });


// Scanner page -----------------
