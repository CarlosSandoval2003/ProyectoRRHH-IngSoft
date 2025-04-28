const bcrypt = require('bcrypt');
const db = require('./config/db');

const username = 'admin';
const plainPassword = 'admin123';
const id_rol = 1; // Asegúrate de que el rol 1 sea "Administrador"

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;

  const query = 'INSERT INTO Usuarios (username, password, id_rol) VALUES (?, ?, ?)';
  db.query(query, [username, hash, id_rol], (err, result) => {
    if (err) throw err;
    console.log('Usuario admin insertado correctamente.');
    process.exit();
  });
});
