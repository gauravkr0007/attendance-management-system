const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// var mysqlconnection = mysql.createConnection({
//     host: process.env.HOST,
//     user: process.env.USER,
//     password: process.env.PASSWORD,
//     database:process.env.DATABASE
// })
// var connection =  mysqlconnection.connect((err) =>{
//     if(err) throw err;
//     console.log('Connected to MySQL database');
// });

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

// module.exports = connectToDatabase();

    
