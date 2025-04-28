const db = require('../config/db');
const bcrypt = require('bcrypt');

exports.login = (username, password, callback) => {
  const query = 'CALL sp_login_usuario(?)';

  db.query(query, [username], (err, results) => {
    if (err) return callback(err);

    const rows = results[0]; // CALL devuelve array de arrays

    if (rows.length === 0) return callback(null, []);

    const user = rows[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return callback(err);
      if (!isMatch) return callback(null, []);

      delete user.password; // Muy importante 🔐
      callback(null, [user]);
    });
  });
};
