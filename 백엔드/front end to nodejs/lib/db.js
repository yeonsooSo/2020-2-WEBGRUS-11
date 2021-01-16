var mysql = require('mysql');
var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'web11'
});
db.connect();
module.exports = db;
