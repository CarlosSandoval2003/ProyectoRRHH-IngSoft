const db = require('../config/db');

exports.login = (username, password, callback) => {
  const query = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
  db.query(query, [username, password], callback);
};
