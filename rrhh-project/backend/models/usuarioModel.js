const db = require('../config/db');

exports.login = (username, password, callback) => {

const query = `
  SELECT u.username, r.nombre_rol AS rol
  FROM usuarios u
  JOIN roles r ON u.id_rol = r.id_rol
  WHERE u.username = ? AND u.password = ?
`;

  db.query(query, [username, password], callback);
};
