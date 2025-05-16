// insertRRHH.js
const bcrypt = require('bcrypt');
const db     = require('./config/db');

// Datos para el nuevo usuario de Recursos Humanos
const username      = 'rh';
const plainPassword = 'rh123';
const id_rol        = 2; // Asegúrate de que el rol 2 sea "Recursos Humanos"

bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;

  const query = 'INSERT INTO Usuarios (username, password, id_rol) VALUES (?, ?, ?)';
  db.query(query, [username, hash, id_rol], (err, result) => {
    if (err) throw err;
    console.log('Usuario RRHH insertado correctamente:', { id: result.insertId, username, id_rol });
    process.exit();
  });
});
