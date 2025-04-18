const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '', // tu contraseña
  database: 'gestionrrhh'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos!');
});

module.exports = db;
