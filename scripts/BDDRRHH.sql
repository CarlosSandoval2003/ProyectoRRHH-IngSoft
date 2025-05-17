-- Crear la base de datos
CREATE DATABASE GestionRRHH;
USE GestionRRHH;

-- Tabla: Departamentos
CREATE TABLE Departamentos (
    id_departamento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_departamento VARCHAR(100) NOT NULL
);

-- Tabla: Puestos
CREATE TABLE Puestos (
    id_puesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_puesto VARCHAR(100) NOT NULL,
    salario_minimo DECIMAL(10,2) NOT NULL,
    salario_maximo DECIMAL(10,2) NOT NULL
);

CREATE TABLE PuestoDepartamento (
    id_puesto INT,
    id_departamento INT,
    PRIMARY KEY (id_puesto, id_departamento),
    FOREIGN KEY (id_departamento) REFERENCES Departamentos(id_departamento),
    FOREIGN KEY (id_puesto) REFERENCES Puestos(id_puesto)
);
    

CREATE TABLE EstadoEmpleado (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(25)
);

-- Tabla: Empleados
CREATE TABLE Empleados (
    id_empleado INT AUTO_INCREMENT PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dpi VARCHAR(13) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    fecha_contratacion DATE NOT NULL,
    salario_base DECIMAL(10,2) NOT NULL,
    id_puesto INT,
    id_departamento INT,
    id_estado INT,
    FOREIGN KEY (id_puesto) REFERENCES Puestos(id_puesto),
    FOREIGN KEY (id_estado) REFERENCES EstadoEmpleado(id_estado),
    FOREIGN KEY (id_departamento) REFERENCES Departamentos(id_departamento)
);

CREATE TABLE DiasTrabajados (
  id_dia INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT NOT NULL,
  fecha DATE NOT NULL,
  tipo ENUM('Laborado', 'Injustificado', 'Justificado', 'Vacación') DEFAULT 'Laborado',
  observacion VARCHAR(100),
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

CREATE TABLE VacacionesCiclo (
  id_ciclo INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT NOT NULL,
  anio INT NOT NULL,
  dias_asignados INT NOT NULL,
  dias_usados INT DEFAULT 0,
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

CREATE TABLE VacacionesDias (
  id_vacacion INT AUTO_INCREMENT PRIMARY KEY,
  id_ciclo INT NOT NULL,
  fecha DATE NOT NULL,
  FOREIGN KEY (id_ciclo) REFERENCES VacacionesCiclo(id_ciclo)
);




CREATE TABLE EstadoNomina (
    id_estado INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(25)
);

CREATE TABLE TipoNomina (
    id_tipo_nomina INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(25)
);

-- Tabla: Nóminas
CREATE TABLE Nominas (
    id_nomina INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    id_departamento INT,
    fecha_nomina DATE NOT NULL,
    fecha_inicio DATE NOT NULL,    
    fecha_fin DATE NOT NULL,      
    id_tipo_nomina INT,
    salario_bruto DECIMAL(10,2) NOT NULL,
    deducciones DECIMAL(10,2) NOT NULL,
    salario_neto DECIMAL(10,2) NOT NULL,
    id_estado INT,
    FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado),
    FOREIGN KEY (id_estado) REFERENCES EstadoNomina(id_estado),
    FOREIGN KEY (id_tipo_nomina) REFERENCES TipoNomina(id_tipo_nomina),
    FOREIGN KEY (id_departamento) REFERENCES Departamentos(id_departamento)
);


-- Tabla: Impuestos
CREATE TABLE Impuestos (
    id_impuesto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_impuesto VARCHAR(25) NOT NULL,
    porcentaje DOUBLE NOT NULL
);

CREATE TABLE NominaDetalles (
    id_nomina_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_nomina INT NOT NULL,
    id_impuesto INT  NULL DEFAULT NULL,
    concepto VARCHAR(50) NOT NULL, -- Ejemplo: "Sueldo base", "Impuesto sobre la renta", "Horas extras"
    monto DECIMAL(10,2) NOT NULL, 
    tipo ENUM('Ingreso', 'Deducción') NOT NULL, -- Define si suma o resta en la nómina
    FOREIGN KEY (id_nomina) REFERENCES Nominas(id_nomina),
    FOREIGN KEY (id_impuesto) REFERENCES Impuestos(id_impuesto)
);



-- Tabla: Prestaciones
CREATE TABLE Prestaciones (
    id_prestacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre_prestacion VARCHAR(25) NOT NULL
);

-- Tabla: PrestacionEmpleado
CREATE TABLE PrestacionEmpleado (
    id_prestacion_empleado INT AUTO_INCREMENT PRIMARY KEY,
    id_prestacion INT,
    id_empleado INT,
    fecha_aplicacion DATE,
    monto DECIMAL(10,2), 
    FOREIGN KEY (id_prestacion) REFERENCES Prestaciones(id_prestacion),
    FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Tabla: Horas Extras
CREATE TABLE HorasExtras (
    id_hora_extra INT AUTO_INCREMENT PRIMARY KEY,
    id_empleado INT NOT NULL,
    fecha DATE NOT NULL,
    horas INT NOT NULL,
    montoporhora DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);

-- Tabla: Reportes
CREATE TABLE Reportes (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    tipo_reporte INT NOT NULL,
    fecha_reporte DATE NOT NULL,
    contenido TEXT NOT NULL
);

-- Tabla: Roles
CREATE TABLE Roles (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL
);

-- Tabla: Usuarios
CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_rol INT NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES Roles(id_rol)
);


CREATE TABLE Liquidaciones (
  id_liquidacion INT AUTO_INCREMENT PRIMARY KEY,
  id_empleado INT NOT NULL,
  fecha_despido DATE NOT NULL,
  salario_promedio DECIMAL(10,2),
  anios_completos INT,
  meses INT,
  indemnizacion DECIMAL(10,2),
  dias_no_gozados INT,
  vacaciones_pendientes DECIMAL(10,2),
  aguinaldo_proporcional DECIMAL(10,2),
  bono14_proporcional DECIMAL(10,2),
  horas_extra_mes DECIMAL(10,2),
  total_liquidacion DECIMAL(10,2),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id_empleado)
);


-- Inserts iniciales

INSERT INTO Prestaciones (nombre_prestacion) VALUES
('Aguinaldo'),
('Bono 14'),
('Vacaciones'),
('Indemnización');

INSERT INTO Impuestos (nombre_impuesto, porcentaje) VALUES
('IGSS', 4.83),
('IRTRA', 1.00),
('INTECAP', 1.00),
('ISR', 5.00); -- para trabajadores que superen el mínimo anual

INSERT INTO EstadoNomina (estado) VALUES ('Generada'), ('Pagada'), ('Cancelada');

INSERT INTO TipoNomina (tipo) VALUES ('Mensual'), ('Quincenal'), ('Semanal'), ('Diaria');

INSERT INTO EstadoEmpleado (estado) VALUES ('Activo'), ('Inactivo'), ('Suspendido');

INSERT INTO Roles (nombre_rol) VALUES ('Administrador'), ('Recursos Humanos'), ('Empleado');

INSERT INTO Departamentos (nombre_departamento) VALUES
('Finanzas'),
('Recursos Humanos'),
('Marketing'),
('Logística'),
('Desarrollo');

-- INSERTS PUESTOS
INSERT INTO Puestos (nombre_puesto, salario_minimo, salario_maximo) VALUES
('Analista Financiero', 3500.00, 7000.00),
('Desarrollador Web', 4000.00, 8000.00),
('Reclutador', 3000.00, 6000.00),
('Diseñador Gráfico', 3200.00, 6200.00),
('Supervisor de Bodega', 2800.00, 5500.00);

-- INSERTS PuestoDepartamento
INSERT INTO PuestoDepartamento (id_puesto, id_departamento) VALUES
(1, 2), -- Analista Financiero en Finanzas
(2, 1), -- Dev Web en Desarrollo
(3, 3), -- Reclutador en Recursos Humanos
(4, 4), -- Diseñador en Marketing
(5, 5); -- Supervisor en Logística

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Fernanda', 'Silva', '8119494470487', 'fernanda.silva0@correo.com', '5571348833', '2020-04-19', 4677.43, 20, 3, 5, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Carlos', 'Morales', '8772146936514', 'carlos.morales1@correo.com', '5535114225', '2021-04-14', 5692.78, 20, 2, 4, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Ana', 'Pineda', '1793157913028', 'ana.pineda2@correo.com', '5598689966', '2022-12-17', 3519.97, 21, 2, 1, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Pedro', 'Gómez', '3624386334130', 'pedro.gomez3@correo.com', '5555486430', '2023-03-13', 5861.05, 21, 5, 5, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Gabriela', 'Cruz', '5538060920002', 'gabriela.cruz4@correo.com', '5568216563', '2020-04-28', 4335.49, 28, 1, 5, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Andrés', 'Romero', '7739285861606', 'andres.romero5@correo.com', '5598574505', '2021-10-28', 4712.08, 29, 4, 1, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Ana', 'Díaz', '4905762079460', 'ana.diaz6@correo.com', '5596391774', '2022-07-27', 5851.56, 21, 4, 1, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Lucía', 'Navarro', '3381724502766', 'lucia.navarro7@correo.com', '5588880583', '2023-04-24', 3065.37, 24, 4, 2, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Valentina', 'Hernández', '8996070898834', 'valentina.hernandez8@correo.com', '5548859854', '2020-03-03', 4077.85, 30, 5, 1, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Marco', 'Hernández', '6405284771360', 'marco.hernandez9@correo.com', '5543126810', '2021-08-16', 5517.07, 22, 2, 5, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Diego', 'Vargas', '5538203145480', 'diego.vargas10@correo.com', '5575802467', '2022-07-03', 5340.69, 25, 3, 1, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Sofía', 'Morales', '9178936845999', 'sofia.morales11@correo.com', '5523874200', '2023-04-07', 3884.28, 23, 2, 3, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Ana', 'Cruz', '1816355993207', 'ana.cruz12@correo.com', '5553066450', '2020-01-22', 4240.84, 24, 5, 4, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Daniel', 'Vargas', '2144814792643', 'daniel.vargas13@correo.com', '5540776920', '2021-04-24', 5017.40, 23, 2, 5, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Andrea', 'Salazar', '7281459707588', 'andrea.salazar14@correo.com', '5535582648', '2022-01-20', 3325.19, 25, 4, 3, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Carlos', 'Salazar', '5850028935710', 'carlos.salazar15@correo.com', '5512860033', '2023-05-04', 4325.00, 27, 3, 4, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Diego', 'Cortez', '6632678055751', 'diego.cortez16@correo.com', '5543222768', '2020-03-11', 3720.86, 23, 1, 3, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Daniel', 'Cruz', '9246311698222', 'daniel.cruz17@correo.com', '5574805250', '2021-12-15', 3191.38, 25, 2, 1, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Carlos', 'Hernández', '8205717411720', 'carlos.hernandez18@correo.com', '5514224793', '2022-06-09', 4327.51, 26, 4, 2, 1);

INSERT INTO Empleados (nombres, apellidos, dpi, email, telefono, fecha_contratacion, salario_base, dias_trabajados, id_puesto, id_departamento, id_estado)
VALUES ('Valentina', 'Reyes', '8461896398486', 'valentina.reyes19@correo.com', '5588559532', '2023-05-12', 3704.09, 28, 5, 4, 1);




-- Procedimientos

-- Login
DELIMITER $$

CREATE PROCEDURE sp_login_usuario(IN p_username VARCHAR(50))
BEGIN
  SELECT 
    u.username,
    u.password,
    r.nombre_rol AS rol
  FROM usuarios u
  JOIN roles r ON u.id_rol = r.id_rol
  WHERE u.username = p_username;
END $$

DELIMITER ;

 -- Insertar horas extra
DELIMITER $$

CREATE PROCEDURE sp_insertar_horas_extra (
  IN p_id_empleado INT,
  IN p_fecha DATE,
  IN p_horas INT
)
BEGIN
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_salario_diario DECIMAL(10,2);
  DECLARE v_salario_hora DECIMAL(10,2);
  DECLARE v_montoporhora DECIMAL(10,2);
  DECLARE v_estado INT;
  DECLARE v_existe INT;

  -- Validar que las horas sean mayores a 0
  IF p_horas <= 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'La cantidad de horas debe ser mayor a 0.';
  END IF;

  -- Validar que el empleado exista
  SELECT COUNT(*) INTO v_existe
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  -- Verificar si el empleado está activo
  SELECT id_estado INTO v_estado
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  -- Obtener salario base
  SELECT salario_base INTO v_salario_base
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  SET v_salario_diario = v_salario_base / 30;
  SET v_salario_hora = v_salario_diario / 8;
  SET v_montoporhora = ROUND(v_salario_hora * 1.5, 2);

  -- Insertar en la tabla de HorasExtras
  INSERT INTO HorasExtras (id_empleado, fecha, horas, montoporhora)
  VALUES (p_id_empleado, p_fecha, p_horas, v_montoporhora);
END $$

DELIMITER ;


-- PRESTACIONES

DELIMITER $$

CREATE PROCEDURE sp_prestacion_aguinaldo (
  IN p_id_empleado INT,
  IN p_fecha_aplicacion DATE
)
BEGIN
  DECLARE v_fecha_contratacion DATE;
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_dias_trabajados INT;
  DECLARE v_monto DECIMAL(10,2);
  DECLARE v_estado INT;
  DECLARE v_existe INT;
  DECLARE v_fecha_inicio_periodo DATE;
  DECLARE v_fecha_fin_periodo DATE;
  DECLARE v_dias_periodo INT;

  SELECT COUNT(*) INTO v_existe FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  SELECT id_estado INTO v_estado FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  SELECT fecha_contratacion, salario_base INTO v_fecha_contratacion, v_salario_base
  FROM Empleados WHERE id_empleado = p_id_empleado;

  -- Determinar período legal de cálculo (aguinaldo: 15 dic año anterior a 14 dic actual)
  SET v_fecha_inicio_periodo = DATE_SUB(DATE_FORMAT(p_fecha_aplicacion, '%Y-12-15'), INTERVAL 1 YEAR);
  SET v_fecha_fin_periodo = DATE_SUB(DATE_FORMAT(p_fecha_aplicacion, '%Y-12-15'), INTERVAL 1 DAY);
  SET v_dias_periodo = DATEDIFF(v_fecha_fin_periodo, v_fecha_inicio_periodo) + 1;

  -- Calcular días trabajados en el período
  IF v_fecha_contratacion > v_fecha_inicio_periodo THEN
    SET v_dias_trabajados = DATEDIFF(v_fecha_fin_periodo, v_fecha_contratacion) + 1;
  ELSE
    SET v_dias_trabajados = v_dias_periodo;
  END IF;

  -- Calcular aguinaldo proporcional
  SET v_monto = ROUND((v_salario_base * v_dias_trabajados) / v_dias_periodo, 2);

  UPDATE PrestacionEmpleado
  SET monto = v_monto
  WHERE id_empleado = p_id_empleado
    AND id_prestacion = 1
    AND fecha_aplicacion = p_fecha_aplicacion;
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE sp_prestacion_bono14 (
  IN p_id_empleado INT,
  IN p_fecha_aplicacion DATE
)
BEGIN
  DECLARE v_fecha_contratacion DATE;
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_dias_trabajados INT;
  DECLARE v_dias_periodo INT;
  DECLARE v_monto DECIMAL(10,2);
  DECLARE v_estado INT;
  DECLARE v_existe INT;
  DECLARE v_fecha_inicio_periodo DATE;
  DECLARE v_fecha_fin_periodo DATE;

  -- Validar existencia
  SELECT COUNT(*) INTO v_existe FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  -- Validar estado
  SELECT id_estado INTO v_estado FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  -- Obtener fecha de contratación y salario base
  SELECT fecha_contratacion, salario_base INTO v_fecha_contratacion, v_salario_base
  FROM Empleados WHERE id_empleado = p_id_empleado;

  -- Definir período legal del Bono 14: 15 de julio del año anterior al 14 de julio actual
  SET v_fecha_inicio_periodo = DATE_SUB(DATE_FORMAT(p_fecha_aplicacion, '%Y-07-15'), INTERVAL 1 YEAR);
  SET v_fecha_fin_periodo = DATE_SUB(DATE_FORMAT(p_fecha_aplicacion, '%Y-07-15'), INTERVAL 1 DAY);
  SET v_dias_periodo = DATEDIFF(v_fecha_fin_periodo, v_fecha_inicio_periodo) + 1;

  -- Calcular días trabajados en ese período
  IF v_fecha_contratacion > v_fecha_inicio_periodo THEN
    SET v_dias_trabajados = DATEDIFF(LEAST(v_fecha_fin_periodo, CURDATE()), v_fecha_contratacion) + 1;
  ELSE
    SET v_dias_trabajados = v_dias_periodo;
  END IF;

  -- Calcular Bono 14 proporcional
  SET v_monto = ROUND((v_salario_base * v_dias_trabajados) / v_dias_periodo, 2);

  -- Actualizar el monto en la tabla de prestaciones
  UPDATE PrestacionEmpleado
  SET monto = v_monto
  WHERE id_empleado = p_id_empleado
    AND id_prestacion = 2
    AND fecha_aplicacion = p_fecha_aplicacion;

END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE sp_prestacion_vacaciones (
  IN p_id_empleado INT,
  IN p_fecha_aplicacion DATE
)
BEGIN
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_monto DECIMAL(10,2);
  DECLARE v_estado INT;
  DECLARE v_existe INT;

  SELECT COUNT(*) INTO v_existe FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  SELECT id_estado INTO v_estado FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  SELECT salario_base INTO v_salario_base
  FROM Empleados WHERE id_empleado = p_id_empleado;

  SET v_monto = ROUND((v_salario_base / 30) * 15, 2);

  INSERT INTO PrestacionEmpleado (id_prestacion, id_empleado, fecha_aplicacion, monto)
  VALUES (3, p_id_empleado, p_fecha_aplicacion, v_monto);
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_prestacion_indemnizacion (
  IN p_id_empleado INT,
  IN p_fecha_aplicacion DATE
)
BEGIN
  DECLARE v_fecha_contratacion DATE;
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_meses_trabajados INT;
  DECLARE v_monto DECIMAL(10,2);
  DECLARE v_estado INT;
  DECLARE v_existe INT;

  SELECT COUNT(*) INTO v_existe FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  SELECT id_estado INTO v_estado FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  SELECT fecha_contratacion, salario_base INTO v_fecha_contratacion, v_salario_base
  FROM Empleados WHERE id_empleado = p_id_empleado;

  SET v_meses_trabajados = PERIOD_DIFF(DATE_FORMAT(p_fecha_aplicacion, '%Y%m'), DATE_FORMAT(v_fecha_contratacion, '%Y%m'));
  SET v_monto = ROUND(v_salario_base * (v_meses_trabajados / 12), 2);

  INSERT INTO PrestacionEmpleado (id_prestacion, id_empleado, fecha_aplicacion, monto)
  VALUES (4, p_id_empleado, p_fecha_aplicacion, v_monto);
END $$

DELIMITER ;



-- Impuestos

DELIMITER $$

CREATE PROCEDURE sp_aplicar_impuestos_nomina (
  IN p_id_nomina INT,
  IN p_id_empleado INT
)
BEGIN
  -- ✅ Variables
  DECLARE v_salario_bruto DECIMAL(10,2);
  DECLARE v_monto DECIMAL(10,2);
  DECLARE v_id_impuesto INT;
  DECLARE v_nombre VARCHAR(50);
  DECLARE v_porcentaje DECIMAL(10,2);
  DECLARE v_salario_anual DECIMAL(10,2);
  DECLARE v_excedente DECIMAL(10,2);
  DECLARE v_isr_anual DECIMAL(10,2);
  DECLARE v_isr_mensual DECIMAL(10,2);
  DECLARE done INT DEFAULT 0;

  -- ✅ Cursor y handler
  DECLARE impuestos_cursor CURSOR FOR
    SELECT id_impuesto, nombre_impuesto, porcentaje
    FROM Impuestos
    WHERE nombre_impuesto IN ('IGSS', 'ISR');

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  -- ✅ Obtener salario bruto
  SELECT salario_base INTO v_salario_bruto
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  OPEN impuestos_cursor;

  leer_impuesto: LOOP
    FETCH impuestos_cursor INTO v_id_impuesto, v_nombre, v_porcentaje;
    IF done THEN LEAVE leer_impuesto; END IF;

    IF v_nombre = 'IGSS' THEN
      -- 💰 Cálculo IGSS normal
      SET v_monto = ROUND(v_salario_bruto * v_porcentaje / 100, 2);

      INSERT INTO NominaDetalles (
        id_nomina, id_impuesto, concepto, monto, tipo
      ) VALUES (
        p_id_nomina, v_id_impuesto, v_nombre, v_monto, 'Deducción'
      );

    ELSEIF v_nombre = 'ISR' THEN
      -- 🧠 Cálculo ISR CORRECTO
      SET v_salario_anual = v_salario_bruto * 12;
      SET v_excedente = v_salario_anual - 48000;

      IF v_excedente > 0 THEN
        SET v_isr_anual = v_excedente * 0.05;
        SET v_isr_mensual = ROUND(v_isr_anual / 12, 2);

        INSERT INTO NominaDetalles (
          id_nomina, id_impuesto, concepto, monto, tipo
        ) VALUES (
          p_id_nomina, v_id_impuesto, v_isr_mensual, 'ISR', 'Deducción'
        );
      END IF;

    END IF;

  END LOOP;

  CLOSE impuestos_cursor;
END $$

DELIMITER ;



-- PARA NOMINA DETALLE:


DELIMITER $$

CREATE PROCEDURE sp_insertar_ingresos_nomina (
  IN p_id_nomina INT,
  IN p_id_empleado INT,
  IN p_fecha_inicio DATE,
  IN p_fecha_fin DATE
)
BEGIN
  -- Variables
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_tipo_nomina INT;
  DECLARE v_dias_periodo INT;
  DECLARE v_pago_sueldo DECIMAL(10,2);
  DECLARE v_total_pagado_anteriormente DECIMAL(10,2);
  DECLARE v_total_dias_mes INT;
  DECLARE v_pago_diario DECIMAL(10,4);
  DECLARE v_total_horas_extra DECIMAL(10,2) DEFAULT 0.00;

  DECLARE cur_fecha DATE;
  DECLARE cur_id_prestacion INT;
  DECLARE p_nombre VARCHAR(25);
  DECLARE p_monto DECIMAL(10,2);
  DECLARE nueva_fecha DATE;

  DECLARE done INT DEFAULT 0;

  -- Cursors
  DECLARE cur CURSOR FOR
    SELECT fecha_aplicacion, id_prestacion
    FROM PrestacionEmpleado
    WHERE id_empleado = p_id_empleado
      AND fecha_aplicacion BETWEEN p_fecha_inicio AND p_fecha_fin;

  DECLARE cur2 CURSOR FOR
    SELECT pr.nombre_prestacion, pe.monto
    FROM PrestacionEmpleado pe
    JOIN Prestaciones pr ON pe.id_prestacion = pr.id_prestacion
    WHERE pe.id_empleado = p_id_empleado
      AND pe.fecha_aplicacion BETWEEN p_fecha_inicio AND p_fecha_fin;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  -- 1. Obtener salario y tipo de nómina
  SELECT e.salario_base, n.id_tipo_nomina
  INTO v_salario_base, v_tipo_nomina
  FROM Nominas n
  JOIN Empleados e ON n.id_empleado = e.id_empleado
  WHERE n.id_nomina = p_id_nomina;

  -- 2. Calcular días del período
  SET v_dias_periodo = DATEDIFF(p_fecha_fin, p_fecha_inicio) + 1;
  SET v_total_dias_mes = DAY(LAST_DAY(p_fecha_inicio));
  SET v_pago_diario = v_salario_base / v_total_dias_mes;

  SELECT IFNULL(SUM(nd.monto), 0) INTO v_total_pagado_anteriormente
  FROM NominaDetalles nd
  JOIN Nominas n ON nd.id_nomina = n.id_nomina
  WHERE n.id_empleado = p_id_empleado
    AND MONTH(n.fecha_inicio) = MONTH(p_fecha_inicio)
    AND YEAR(n.fecha_inicio) = YEAR(p_fecha_inicio)
    AND n.id_tipo_nomina = v_tipo_nomina
    AND nd.concepto = 'Sueldo base'
    AND n.fecha_inicio < p_fecha_inicio;

  SET v_pago_sueldo = ROUND((v_pago_diario * v_dias_periodo), 2);

  INSERT INTO NominaDetalles (
    id_nomina, id_impuesto, concepto, monto, tipo
  ) VALUES (
    p_id_nomina, NULL, 'Sueldo base', v_pago_sueldo, 'Ingreso'
  );

  -- 3. Horas extra
  SELECT IFNULL(SUM(horas * montoporhora), 0) INTO v_total_horas_extra
  FROM HorasExtras
  WHERE id_empleado = p_id_empleado
    AND fecha BETWEEN p_fecha_inicio AND p_fecha_fin;

  IF v_total_horas_extra > 0 THEN
    INSERT INTO NominaDetalles (
      id_nomina, id_impuesto, concepto, monto, tipo
    ) VALUES (
      p_id_nomina, NULL, 'Horas extras', v_total_horas_extra, 'Ingreso'
    );
  END IF;

-- 4. Calcular prestaciones y diferir actualización de fecha
SET done = 0;
OPEN cur;
loop1: LOOP
  FETCH cur INTO cur_fecha, cur_id_prestacion;
  IF done THEN LEAVE loop1; END IF;

  IF cur_id_prestacion = 1 THEN
    CALL sp_prestacion_aguinaldo(p_id_empleado, cur_fecha);
  ELSEIF cur_id_prestacion = 2 THEN
    CALL sp_prestacion_bono14(p_id_empleado, cur_fecha);
  END IF;
END LOOP;
CLOSE cur;

-- 5. Insertar en Detalle los nombres + montos reales de prestaciones
SET done = 0;
OPEN cur2;
loop2: LOOP
  FETCH cur2 INTO p_nombre, p_monto;
  IF done THEN LEAVE loop2; END IF;

  INSERT INTO NominaDetalles (
    id_nomina, id_impuesto, concepto, monto, tipo
  ) VALUES (
    p_id_nomina, NULL, p_nombre, p_monto, 'Ingreso'
  );
END LOOP;
CLOSE cur2;

-- 6. ACTUALIZAR FECHA hasta AHORA (después de haberla usado)
SET done = 0;
OPEN cur;
loop3: LOOP
  FETCH cur INTO cur_fecha, cur_id_prestacion;
  IF done THEN LEAVE loop3; END IF;

  IF cur_id_prestacion = 1 THEN
    SET nueva_fecha = STR_TO_DATE(CONCAT(YEAR(cur_fecha) + 1, '-12-15'), '%Y-%m-%d');
  ELSEIF cur_id_prestacion = 2 THEN
    SET nueva_fecha = STR_TO_DATE(CONCAT(YEAR(cur_fecha) + 1, '-07-15'), '%Y-%m-%d');
  END IF;

  WHILE DAYOFWEEK(nueva_fecha) IN (1,7) DO
    SET nueva_fecha = DATE_ADD(nueva_fecha, INTERVAL 1 DAY);
  END WHILE;

  UPDATE PrestacionEmpleado
  SET fecha_aplicacion = nueva_fecha
  WHERE id_empleado = p_id_empleado
    AND id_prestacion = cur_id_prestacion
    AND fecha_aplicacion = cur_fecha;
END LOOP;
CLOSE cur;


END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_insertar_nomina (
  IN p_id_empleado INT,
  IN p_fecha_nomina DATE,
  IN p_fecha_inicio DATE,
  IN p_fecha_fin DATE,
  IN p_id_tipo_nomina INT,
  IN p_id_estado INT,
  IN p_id_departamento INT, -- nuevo parámetro
  OUT p_id_nomina INT
)
BEGIN
  DECLARE v_existe INT;
  DECLARE v_estado INT;
  DECLARE v_count INT;

  SELECT COUNT(*) INTO v_existe
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  SELECT id_estado INTO v_estado
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  SELECT COUNT(*) INTO v_count
  FROM Nominas
  WHERE id_empleado = p_id_empleado
    AND (
      (p_fecha_inicio BETWEEN fecha_inicio AND fecha_fin) OR
      (p_fecha_fin BETWEEN fecha_inicio AND fecha_fin) OR
      (fecha_inicio BETWEEN p_fecha_inicio AND p_fecha_fin) OR
      (fecha_fin BETWEEN p_fecha_inicio AND p_fecha_fin)
    );

  IF v_count > 0 THEN
    SIGNAL SQLSTATE '45000' 
    SET MESSAGE_TEXT = 'Ya existe una nómina generada para este empleado que cubre el rango de fechas indicado.';
  END IF;

  INSERT INTO Nominas (
    id_empleado, fecha_nomina, fecha_inicio, fecha_fin, id_tipo_nomina,
    salario_bruto, deducciones, salario_neto, id_estado, id_departamento
  ) VALUES (
    p_id_empleado, p_fecha_nomina, p_fecha_inicio, p_fecha_fin, p_id_tipo_nomina,
    0.00, 0.00, 0.00, p_id_estado, p_id_departamento
  );

  SET p_id_nomina = LAST_INSERT_ID();
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_generar_nomina_empleado (
  IN p_id_empleado INT,
  IN p_fecha_nomina DATE,
  IN p_id_tipo_nomina INT,
  IN p_id_estado INT,
  IN p_mes INT,
  IN p_anio INT,
  IN p_id_departamento INT
)
BEGIN
  DECLARE v_id_nomina INT;
  DECLARE v_existe INT;
  DECLARE v_estado INT;
  DECLARE v_fecha_inicio DATE;
  DECLARE v_fecha_fin DATE;
  DECLARE v_es_ultima_parte TINYINT;

  -- Validar existencia del empleado
  SELECT COUNT(*) INTO v_existe
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  -- Validar estado activo
  SELECT id_estado INTO v_estado
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  -- Obtener rango de fechas según tipo y mes
  CALL sp_calcular_rango_nomina(
    p_id_empleado,
    p_id_tipo_nomina,
    p_mes,
    p_anio,
    v_fecha_inicio,
    v_fecha_fin,
    v_es_ultima_parte
  );

  -- Insertar encabezado de nómina (ya no se pasa el departamento)
  CALL sp_insertar_nomina(
    p_id_empleado,
    CURRENT_DATE(),
    v_fecha_inicio,
    v_fecha_fin,
    p_id_tipo_nomina,
    p_id_estado,
    p_id_departamento,  
    v_id_nomina
  );

  -- Insertar ingresos (sueldo, horas extra y prestaciones)
  CALL sp_insertar_ingresos_nomina(
    v_id_nomina,
    p_id_empleado,
    v_fecha_inicio,
    v_fecha_fin
  );

  -- Aplicar impuestos solo si es la última parte (quincena 2 o semana 4)
  IF v_es_ultima_parte = 1 THEN
    CALL sp_aplicar_impuestos_nomina(
      v_id_nomina,
      p_id_empleado
    );
  END IF;

  -- Actualizar totales
  CALL sp_actualizar_totales_nomina(
    v_id_nomina
  );
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE sp_sumar_ingresos_nomina (
  IN p_id_nomina INT,
  OUT p_total_ingresos DECIMAL(10,2)
)
BEGIN
  SELECT IFNULL(SUM(monto), 0) INTO p_total_ingresos
  FROM NominaDetalles
  WHERE id_nomina = p_id_nomina
    AND tipo = 'Ingreso';
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_sumar_deducciones_nomina (
  IN p_id_nomina INT,
  OUT p_total_deducciones DECIMAL(10,2)
)
BEGIN
  SELECT IFNULL(SUM(monto), 0) INTO p_total_deducciones
  FROM NominaDetalles
  WHERE id_nomina = p_id_nomina
    AND tipo = 'Deducción';
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_actualizar_totales_nomina (
  IN p_id_nomina INT
)
BEGIN
  DECLARE v_total_ingresos DECIMAL(10,2);
  DECLARE v_total_deducciones DECIMAL(10,2);
  DECLARE v_salario_neto DECIMAL(10,2);

  -- 1. Obtener total de ingresos
  CALL sp_sumar_ingresos_nomina(p_id_nomina, v_total_ingresos);

  -- 2. Obtener total de deducciones
  CALL sp_sumar_deducciones_nomina(p_id_nomina, v_total_deducciones);

  -- 3. Calcular salario neto
  SET v_salario_neto = v_total_ingresos - v_total_deducciones;

  -- ❌ Validar que el salario neto no sea negativo
  IF v_salario_neto < 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El salario neto no puede ser negativo. Revisa las deducciones aplicadas.';
  END IF;

  -- 4. Actualizar tabla Nominas
  UPDATE Nominas
  SET salario_bruto = v_total_ingresos,
      deducciones = v_total_deducciones,
      salario_neto = v_salario_neto
  WHERE id_nomina = p_id_nomina;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_obtener_empleados_activos()
BEGIN
  SELECT 
    e.id_empleado, 
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
    e.dpi,
    p.nombre_puesto AS puesto,
    d.nombre_departamento AS departamento
  FROM Empleados e
  JOIN Puestos p ON e.id_puesto = p.id_puesto
  JOIN Departamentos d ON e.id_departamento = d.id_departamento
  WHERE e.id_estado = 1;
END $$

DELIMITER ;




DELIMITER $$

CREATE PROCEDURE sp_obtener_tipos_nomina()
BEGIN
  SELECT * FROM TipoNomina;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_obtener_departamentos()
BEGIN
  SELECT id_departamento, nombre_departamento
  FROM Departamentos;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_empleados_por_departamento(IN p_id_departamento INT)
BEGIN
  SELECT 
    e.id_empleado,
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
    e.dpi,
    p.nombre_puesto AS puesto
  FROM Empleados e
  JOIN Puestos p ON e.id_puesto = p.id_puesto
  WHERE e.id_estado = 1 AND e.id_departamento = p_id_departamento;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_buscar_empleados(IN p_busqueda VARCHAR(100))
BEGIN
  SELECT 
    e.id_empleado,
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
    e.dpi,
    p.nombre_puesto AS puesto,
    d.nombre_departamento AS departamento
  FROM Empleados e
  JOIN Puestos p ON e.id_puesto = p.id_puesto
  JOIN Departamentos d ON e.id_departamento = d.id_departamento
  WHERE e.id_estado = 1
    AND (
      e.nombres LIKE CONCAT('%', p_busqueda, '%')
      OR e.apellidos LIKE CONCAT('%', p_busqueda, '%')
      OR CONCAT(e.nombres, ' ', e.apellidos) LIKE CONCAT('%', p_busqueda, '%')
    );
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_generar_nomina_por_departamento (
  IN p_id_departamento INT,
  IN p_fecha_nomina DATE,
  IN p_id_tipo_nomina INT,
  IN p_id_estado INT,
  IN p_mes INT,
  IN p_anio INT
)
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_id_empleado INT;
  DECLARE v_total INT;

  DECLARE empleados_cursor CURSOR FOR
    SELECT id_empleado
    FROM Empleados
    WHERE id_estado = 1 AND id_departamento = p_id_departamento;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  SELECT COUNT(*) INTO v_total
  FROM Empleados
  WHERE id_estado = 1 AND id_departamento = p_id_departamento;

  IF v_total = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay empleados activos en este departamento.';
  END IF;

  OPEN empleados_cursor;

  leer_empleado: LOOP
    FETCH empleados_cursor INTO v_id_empleado;
    IF done THEN LEAVE leer_empleado; END IF;

    CALL sp_generar_nomina_empleado(
      v_id_empleado,
      p_fecha_nomina,
      p_id_tipo_nomina,
      p_id_estado,
      p_mes,
      p_anio,
      p_id_departamento
    );
  END LOOP;

  CLOSE empleados_cursor;
END $$

DELIMITER ;





DELIMITER $$

CREATE PROCEDURE sp_generar_nomina_todos (
  IN p_fecha_nomina DATE,
  IN p_id_tipo_nomina INT,
  IN p_id_estado INT,
  IN p_mes INT,
  IN p_anio INT
)
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE v_id_empleado INT;
  DECLARE v_total INT;

  DECLARE empleados_cursor CURSOR FOR
    SELECT id_empleado
    FROM Empleados
    WHERE id_estado = 1;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  SELECT COUNT(*) INTO v_total
  FROM Empleados
  WHERE id_estado = 1;

  IF v_total = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay empleados activos en la empresa.';
  END IF;

  OPEN empleados_cursor;

  leer_empleado: LOOP
    FETCH empleados_cursor INTO v_id_empleado;
    IF done THEN LEAVE leer_empleado; END IF;

    CALL sp_generar_nomina_empleado(
      v_id_empleado,
      p_fecha_nomina,
      p_id_tipo_nomina,
      p_id_estado,
      p_mes,
      p_anio,
      NULL
    );
  END LOOP;

  CLOSE empleados_cursor;
END $$

DELIMITER ;





DELIMITER $$

CREATE PROCEDURE sp_listado_nominas_generadas()
BEGIN
  SELECT 
    n.fecha_nomina,
    n.id_tipo_nomina,  -- 👈 AGREGA ESTO
    tn.tipo AS tipo_nomina,
    en.estado AS estado_nomina,
    COUNT(n.id_nomina) AS empleados_incluidos
  FROM Nominas n
  INNER JOIN TipoNomina tn ON n.id_tipo_nomina = tn.id_tipo_nomina
  INNER JOIN EstadoNomina en ON n.id_estado = en.id_estado
  GROUP BY n.fecha_nomina, n.id_tipo_nomina, tn.tipo, en.estado  -- 👈 IMPORTANTE
  ORDER BY n.fecha_nomina DESC;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_detalle_nomina_por_grupo(IN p_fecha_nomina DATE, IN p_id_tipo_nomina INT)
BEGIN
  -- ✅ Encabezado general de la nómina
  SELECT 
    p_fecha_nomina AS fecha_nomina,
    tn.tipo AS tipo_nomina,
    n.fecha_inicio,
    n.fecha_fin,
    en.estado AS estado_nomina,
    IFNULL(d.nombre_departamento, 'Todos') AS departamento
  FROM Nominas n
  JOIN TipoNomina tn ON tn.id_tipo_nomina = p_id_tipo_nomina
  JOIN EstadoNomina en ON en.id_estado = n.id_estado
  LEFT JOIN Departamentos d ON n.id_departamento = d.id_departamento
  WHERE n.fecha_nomina = p_fecha_nomina AND n.id_tipo_nomina = p_id_tipo_nomina
  LIMIT 1;

  -- ✅ Detalle por empleado incluido en esa nómina grupal
  SELECT 
	n.id_nomina,
    e.id_empleado,
    CONCAT(e.nombres, ' ', e.apellidos) AS empleado,
    e.dpi,
    
    -- Sueldo base
    (SELECT monto FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND concepto = 'Sueldo base' AND tipo = 'Ingreso' LIMIT 1) AS sueldo_base,

    -- Horas extra
    (SELECT monto FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND concepto = 'Horas extras' AND tipo = 'Ingreso' LIMIT 1) AS horas_extra,

    -- Prestaciones
    (SELECT monto FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND concepto = 'Prestaciones' AND tipo = 'Ingreso' LIMIT 1) AS prestaciones,

    -- IGSS
    (SELECT monto FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND concepto = 'IGSS' AND tipo = 'Deducción' LIMIT 1) AS igss,

    -- ISR
    (SELECT monto FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND concepto = 'ISR' AND tipo = 'Deducción' LIMIT 1) AS isr,

    -- Totales
    (SELECT SUM(monto) FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND tipo = 'Ingreso') AS total_ingresos,

    (SELECT SUM(monto) FROM NominaDetalles 
     WHERE id_nomina = n.id_nomina AND tipo = 'Deducción') AS total_deducciones,

    n.salario_neto
  FROM Nominas n
  JOIN Empleados e ON n.id_empleado = e.id_empleado
  WHERE n.fecha_nomina = p_fecha_nomina AND n.id_tipo_nomina = p_id_tipo_nomina;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_detalle_nomina_empleado_por_id (
    IN p_id_nomina INT
)
BEGIN
  -- Detalles de ingresos
  SELECT 
    concepto,
    monto,
    tipo
  FROM NominaDetalles
  WHERE id_nomina = p_id_nomina
  ORDER BY 
    CASE WHEN tipo = 'Ingreso' THEN 1 ELSE 2 END, 
    concepto ASC;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_gestion_empleado (
  IN p_accion           VARCHAR(10),
  IN p_id_empleado      INT,
  IN p_nombres          VARCHAR(100),
  IN p_apellidos        VARCHAR(100),
  IN p_dpi              VARCHAR(13),
  IN p_email            VARCHAR(100),
  IN p_telefono         VARCHAR(15),
  IN p_fecha_contratacion DATE,
  IN p_salario_base     DECIMAL(10,2),
  IN p_id_puesto        INT,
  IN p_id_departamento  INT,
  IN p_id_estado        INT
)
BEGIN
  IF p_accion = 'INSERTAR' THEN
    INSERT INTO Empleados (
      nombres, apellidos, dpi, email, telefono, fecha_contratacion,
      salario_base, id_puesto, id_departamento, id_estado
    ) VALUES (
      p_nombres, p_apellidos, p_dpi, p_email, p_telefono, p_fecha_contratacion,
      p_salario_base, p_id_puesto, p_id_departamento, p_id_estado
    );
    
    -- Obtener el ID del nuevo empleado
SET @nuevo_id := LAST_INSERT_ID();
SET @anio_actual := YEAR(CURDATE());

-- AGUINALDO
SET @fecha_aguinaldo := STR_TO_DATE(CONCAT(@anio_actual, '-12-15'), '%Y-%m-%d');
WHILE DAYOFWEEK(@fecha_aguinaldo) IN (1,7) DO
  SET @fecha_aguinaldo := DATE_ADD(@fecha_aguinaldo, INTERVAL 1 DAY);
END WHILE;
IF CURDATE() > @fecha_aguinaldo THEN
  SET @fecha_aguinaldo := STR_TO_DATE(CONCAT(@anio_actual + 1, '-12-15'), '%Y-%m-%d');
  WHILE DAYOFWEEK(@fecha_aguinaldo) IN (1,7) DO
    SET @fecha_aguinaldo := DATE_ADD(@fecha_aguinaldo, INTERVAL 1 DAY);
  END WHILE;
END IF;

-- BONO 14
SET @fecha_bono14 := STR_TO_DATE(CONCAT(@anio_actual, '-07-15'), '%Y-%m-%d');
WHILE DAYOFWEEK(@fecha_bono14) IN (1,7) DO
  SET @fecha_bono14 := DATE_ADD(@fecha_bono14, INTERVAL 1 DAY);
END WHILE;
IF CURDATE() > @fecha_bono14 THEN
  SET @fecha_bono14 := STR_TO_DATE(CONCAT(@anio_actual + 1, '-07-15'), '%Y-%m-%d');
  WHILE DAYOFWEEK(@fecha_bono14) IN (1,7) DO
    SET @fecha_bono14 := DATE_ADD(@fecha_bono14, INTERVAL 1 DAY);
  END WHILE;
END IF;

-- Registrar sin monto
CALL sp_registrar_prestacion_empleado(@nuevo_id, 1, @fecha_aguinaldo); -- Aguinaldo
CALL sp_registrar_prestacion_empleado(@nuevo_id, 2, @fecha_bono14);   -- Bono 14


  ELSEIF p_accion = 'ACTUALIZAR' THEN
    UPDATE Empleados
    SET nombres             = p_nombres,
        apellidos           = p_apellidos,
        dpi                 = p_dpi,
        email               = p_email,
        telefono            = p_telefono,
        fecha_contratacion  = p_fecha_contratacion,
        salario_base        = p_salario_base,
        id_puesto           = p_id_puesto,
        id_departamento     = p_id_departamento,
        id_estado           = p_id_estado
    WHERE id_empleado = p_id_empleado;

  ELSEIF p_accion = 'ELIMINAR' THEN
    -- Eliminación lógica (estado 2 = Inactivo)
    UPDATE Empleados
    SET id_estado = 2
    WHERE id_empleado = p_id_empleado;

  ELSEIF p_accion = 'CONSULTAR' THEN
    SELECT 
      e.id_empleado,
      e.nombres,
      e.apellidos,
      e.dpi,
      e.email,
      e.telefono,
      e.fecha_contratacion,
      e.salario_base,
      e.id_puesto,
      p.nombre_puesto,
      e.id_departamento,
      d.nombre_departamento,
      e.id_estado,
      est.estado AS nombre_estado
    FROM Empleados e
    JOIN Puestos p ON e.id_puesto = p.id_puesto
    JOIN Departamentos d ON e.id_departamento = d.id_departamento
    JOIN EstadoEmpleado est ON e.id_estado = est.id_estado
    WHERE e.id_empleado = p_id_empleado;

  ELSEIF p_accion = 'LISTAR' THEN
    SELECT 
      e.id_empleado,
      CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
      e.dpi,
      e.email,
      e.telefono,
      e.fecha_contratacion,
      e.salario_base,
      p.nombre_puesto,
      d.nombre_departamento,
      est.estado AS estado
    FROM Empleados e
    JOIN Puestos p ON e.id_puesto = p.id_puesto
    JOIN Departamentos d ON e.id_departamento = d.id_departamento
    JOIN EstadoEmpleado est ON e.id_estado = est.id_estado
    WHERE e.id_estado = 1; -- Solo activos
  END IF;
END $$

-- 1) Lista todos los puestos
CREATE PROCEDURE sp_listar_puestos()
BEGIN
  SELECT id_puesto, nombre_puesto
    FROM Puestos;
END $$

-- 2) Lista todos los departamentos
CREATE PROCEDURE sp_listar_departamentos()
BEGIN
  SELECT id_departamento, nombre_departamento
    FROM Departamentos;
END $$

-- 3) Lista todos los estados de empleado
CREATE PROCEDURE sp_listar_estados()
BEGIN
  SELECT id_estado, estado
    FROM EstadoEmpleado;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_horas_extras_mes_actual(IN p_id_empleado INT)
BEGIN
  SELECT 
    IFNULL(SUM(he.horas), 0) AS horas_extras_mes
  FROM HorasExtras he
  WHERE he.id_empleado = p_id_empleado
    AND MONTH(he.fecha) = MONTH(CURDATE())
    AND YEAR(he.fecha) = YEAR(CURDATE());
END $$

DELIMITER ;

DELIMITER $$
CREATE PROCEDURE sp_listar_horas_extra_mes_actual(IN p_id_empleado INT)
BEGIN
  SELECT id_hora_extra, fecha, horas, montoporhora
  FROM HorasExtras
  WHERE id_empleado = p_id_empleado
    AND MONTH(fecha) = MONTH(CURDATE())
    AND YEAR(fecha) = YEAR(CURDATE())
  ORDER BY fecha ASC;
END $$
DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_listar_dias_trabajados_mes_actual (
  IN p_id_empleado INT
)
BEGIN
  SELECT fecha
  FROM DiasTrabajados
  WHERE id_empleado = p_id_empleado
    AND MONTH(fecha) = MONTH(CURDATE())
    AND YEAR(fecha) = YEAR(CURDATE());
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_insertar_dia_trabajado (
  IN p_id_empleado INT,
  IN p_fecha DATE,
  IN p_tipo ENUM('Laborado', 'Injustificado', 'Justificado', 'Vacación'),
  IN p_observacion VARCHAR(100)
)
BEGIN
  INSERT INTO DiasTrabajados (id_empleado, fecha, tipo, observacion)
  VALUES (p_id_empleado, p_fecha, p_tipo, p_observacion);
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_listar_puestos_por_departamento(IN p_id_departamento INT)
BEGIN
  SELECT p.id_puesto, p.nombre_puesto
  FROM Puestos p
  JOIN PuestoDepartamento pd ON p.id_puesto = pd.id_puesto
  WHERE pd.id_departamento = p_id_departamento;
END $$

DELIMITER ;







DELIMITER $$

CREATE PROCEDURE sp_calcular_rango_nomina (
  IN p_id_empleado INT,
  IN p_id_tipo_nomina INT, -- 1 mensual, 2 quincenal, 3 semanal
  IN p_mes INT,
  IN p_anio INT,
  OUT p_fecha_inicio DATE,
  OUT p_fecha_fin DATE,
  OUT p_es_ultima_parte TINYINT -- 1 si es la última quincena o semana
)
BEGIN
  DECLARE v_dia_inicio DATE;
  DECLARE v_ultimo_dia_mes DATE;
  DECLARE v_cuantas INT;

  SET v_dia_inicio = MAKEDATE(p_anio, 1) + INTERVAL (p_mes - 1) MONTH;
  SET v_ultimo_dia_mes = LAST_DAY(v_dia_inicio);

  IF p_id_tipo_nomina = 1 THEN
    -- Mensual
    SET p_fecha_inicio = v_dia_inicio;
    SET p_fecha_fin = v_ultimo_dia_mes;
    SET p_es_ultima_parte = 1;

  ELSEIF p_id_tipo_nomina = 2 THEN
    -- Quincenal
    SELECT COUNT(*) INTO v_cuantas
    FROM Nominas
    WHERE id_empleado = p_id_empleado
      AND MONTH(fecha_inicio) = p_mes
      AND YEAR(fecha_inicio) = p_anio
      AND id_tipo_nomina = 2;

    IF v_cuantas = 0 THEN
      SET p_fecha_inicio = v_dia_inicio;
      SET p_fecha_fin = DATE_ADD(v_dia_inicio, INTERVAL 14 DAY);
      SET p_es_ultima_parte = 0;
    ELSEIF v_cuantas = 1 THEN
      SET p_fecha_inicio = DATE_ADD(v_dia_inicio, INTERVAL 15 DAY);
      SET p_fecha_fin = v_ultimo_dia_mes;
      SET p_es_ultima_parte = 1;
    ELSE
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Este mes ya tiene ambas quincenas generadas.';
    END IF;

  ELSEIF p_id_tipo_nomina = 3 THEN
    -- Semanal dinámica (hasta alcanzar el último día del mes)
    SELECT COUNT(*) INTO v_cuantas
    FROM Nominas
    WHERE id_empleado = p_id_empleado
      AND MONTH(fecha_inicio) = p_mes
      AND YEAR(fecha_inicio) = p_anio
      AND id_tipo_nomina = 3;

    IF v_cuantas = 0 THEN
      SET p_fecha_inicio = v_dia_inicio;
    ELSE
      SELECT DATE_ADD(MAX(fecha_fin), INTERVAL 1 DAY) INTO p_fecha_inicio
      FROM Nominas
      WHERE id_empleado = p_id_empleado
        AND MONTH(fecha_inicio) = p_mes
        AND id_tipo_nomina = 3;
    END IF;

    -- Calcular fin de semana (de lunes a domingo)
    SET p_fecha_fin = DATE_ADD(p_fecha_inicio, INTERVAL (6 - WEEKDAY(p_fecha_inicio)) DAY);

    -- Si se pasa del mes, recortamos
    IF p_fecha_fin > v_ultimo_dia_mes THEN
      SET p_fecha_fin = v_ultimo_dia_mes;
    END IF;

    -- ¿Contiene esta semana el último día del mes?
    IF p_fecha_fin = v_ultimo_dia_mes THEN
      SET p_es_ultima_parte = 1;
    ELSE
      SET p_es_ultima_parte = 0;
    END IF;

  END IF;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_obtener_departamento_empleado (
  IN p_id_empleado INT
)
BEGIN
  SELECT id_departamento
  FROM Empleados
  WHERE id_empleado = p_id_empleado
  LIMIT 1;
END $$

DELIMITER ;



-- VACACIONES


DELIMITER $$

CREATE PROCEDURE sp_listar_dias_mes (
  IN p_id_empleado INT,
  IN p_mes INT,
  IN p_anio INT
)
BEGIN
  SELECT fecha, tipo
  FROM DiasTrabajados
  WHERE id_empleado = p_id_empleado
    AND MONTH(fecha) = p_mes
    AND YEAR(fecha) = p_anio;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_eliminar_dias_mes_actual (
  IN p_id_empleado INT
)
BEGIN
  -- 1. Eliminar días trabajados del mes actual
  DELETE FROM DiasTrabajados
  WHERE id_empleado = p_id_empleado
    AND MONTH(fecha) = MONTH(CURDATE())
    AND YEAR(fecha) = YEAR(CURDATE());

-- Eliminar de VacacionesDias cruzando por VacacionesCiclo
DELETE vd
FROM VacacionesDias vd
JOIN VacacionesCiclo vc ON vd.id_ciclo = vc.id_ciclo
WHERE vc.id_empleado = p_id_empleado
  AND MONTH(vd.fecha) = MONTH(CURDATE())
  AND YEAR(vd.fecha) = YEAR(CURDATE());


  -- 3. Restar los días eliminados al contador de días usados en el ciclo
  UPDATE VacacionesCiclo
  SET dias_usados = dias_usados - (
    SELECT COUNT(*)
    FROM VacacionesDias vd
    WHERE vd.id_ciclo = VacacionesCiclo.id_ciclo
      AND MONTH(vd.fecha) = MONTH(CURDATE())
      AND YEAR(vd.fecha) = YEAR(CURDATE())
  )
  WHERE id_empleado = p_id_empleado
    AND anio = YEAR(CURDATE());
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_insertar_dia_calendario (
  IN p_id_empleado INT,
  IN p_fecha DATE,
  IN p_tipo ENUM('Laborado', 'Vacación'),
  IN p_id_ciclo INT,
  IN p_observacion VARCHAR(100)
)
BEGIN
  DECLARE v_usados INT;
  DECLARE v_maximos INT;
  DECLARE v_ciclo_actual INT;
  DECLARE v_anio INT;

  SET v_anio = YEAR(p_fecha);

  --  Si es día de vacación, validar e insertar
  IF p_tipo = 'Vacación' THEN

    -- Verificar si ya existe ciclo para el año de la fecha
    SELECT id_ciclo INTO v_ciclo_actual
    FROM VacacionesCiclo
    WHERE id_empleado = p_id_empleado AND anio = v_anio
    LIMIT 1;

    -- Si no existe, crear nuevo ciclo automáticamente
    IF v_ciclo_actual IS NULL THEN
      INSERT INTO VacacionesCiclo (id_empleado, anio, dias_asignados)
      VALUES (p_id_empleado, v_anio, 15);

      SET v_ciclo_actual = LAST_INSERT_ID();
    END IF;

    -- Verificar si ya existe la fecha
    IF EXISTS (
      SELECT 1 FROM VacacionesDias
      WHERE id_empleado = p_id_empleado AND fecha = p_fecha
    ) THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya existe esa fecha registrada como vacación.';
    END IF;

    -- Verificar límite de días disponibles
    SELECT dias_usados, dias_asignados INTO v_usados, v_maximos
    FROM VacacionesCiclo
    WHERE id_ciclo = v_ciclo_actual AND id_empleado = p_id_empleado;

    IF v_usados >= v_maximos THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya usó todos los días de vacaciones asignados.';
    END IF;

    -- Insertar día en tabla de vacaciones
    INSERT INTO VacacionesDias (id_empleado, fecha, id_ciclo)
    VALUES (p_id_empleado, p_fecha, v_ciclo_actual);

    -- Actualizar contador de días usados
    UPDATE VacacionesCiclo
    SET dias_usados = dias_usados + 1
    WHERE id_ciclo = v_ciclo_actual;
  END IF;

  --  Insertar en tabla general de calendario (laborado o vacación)
  INSERT INTO DiasTrabajados (id_empleado, fecha, tipo, observacion)
  VALUES (p_id_empleado, p_fecha, p_tipo, p_observacion);

END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE sp_obtener_ciclo_vacaciones (
  IN p_id_empleado INT
)
BEGIN
  SELECT *
  FROM VacacionesCiclo
  WHERE id_empleado = p_id_empleado
    AND anio = YEAR(CURDATE())
  LIMIT 1;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_registrar_prestacion_empleado (
  IN p_id_empleado INT,
  IN p_id_prestacion INT,
  IN p_fecha_aplicacion DATE
)
BEGIN
  DECLARE v_estado INT;

  -- Validar que el empleado existe y está activo
  SELECT id_estado INTO v_estado FROM Empleados WHERE id_empleado = p_id_empleado;

  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  -- Insertar prestación sin calcular monto aún
  INSERT INTO PrestacionEmpleado (id_prestacion, id_empleado, fecha_aplicacion, monto)
  VALUES (p_id_prestacion, p_id_empleado, p_fecha_aplicacion, NULL);
END $$

DELIMITER ;




-- Indemnizacion

DELIMITER $$

CREATE PROCEDURE sp_calcular_liquidacion_despido (
  IN p_id_empleado INT,
  IN p_fecha_despido DATE
)
BEGIN
  DECLARE v_salario_promedio DECIMAL(10,2);
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_total_sueldo_base DECIMAL(10,2) DEFAULT 0;
  DECLARE v_total_meses_salario INT DEFAULT 0;
  DECLARE v_meses_trabajados_total INT;
  DECLARE v_anios_completos INT;
  DECLARE v_meses_residuales INT;
  DECLARE v_fecha_contratacion DATE;

  DECLARE v_dias_no_gozados INT DEFAULT 0;
  DECLARE v_total_vacaciones DECIMAL(10,2);

  DECLARE v_aguinaldo DECIMAL(10,2);
  DECLARE v_bono14 DECIMAL(10,2);
  DECLARE v_horas_extra DECIMAL(10,2);
  DECLARE v_indemnizacion DECIMAL(10,2);
  DECLARE v_total_liquidacion DECIMAL(10,2);

  DECLARE v_fecha_ultimo_aguinaldo DATE;
  DECLARE v_fecha_ultimo_bono14 DATE;
  DECLARE v_existente INT;

  -- 0. Verificar si ya existe una liquidación para este empleado en esa fecha
  SELECT COUNT(*) INTO v_existente
  FROM Liquidaciones
  WHERE id_empleado = p_id_empleado
    AND fecha_despido = p_fecha_despido;

  IF v_existente > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Ya existe una liquidación para este empleado en esta fecha.';
  END IF;

  -- 1. Fecha contratación y salario base
  SELECT fecha_contratacion, salario_base
  INTO v_fecha_contratacion, v_salario_base
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  -- 2. Salario promedio mensual (últimos 6 meses)
  SELECT IFNULL(SUM(nd.monto), 0), COUNT(*) INTO v_total_sueldo_base, v_total_meses_salario
  FROM NominaDetalles nd
  JOIN Nominas n ON nd.id_nomina = n.id_nomina
  WHERE nd.concepto = 'Sueldo base'
    AND n.id_empleado = p_id_empleado
    AND n.id_tipo_nomina = 1
    AND n.fecha_inicio >= DATE_SUB(p_fecha_despido, INTERVAL 6 MONTH);

  SELECT IFNULL(SUM(x.total), 0), COUNT(*) INTO @sum_quincena, @cnt_quincena FROM (
    SELECT SUM(nd.monto) AS total
    FROM NominaDetalles nd
    JOIN Nominas n ON nd.id_nomina = n.id_nomina
    WHERE nd.concepto = 'Sueldo base'
      AND n.id_empleado = p_id_empleado
      AND n.id_tipo_nomina = 2
      AND n.fecha_inicio >= DATE_SUB(p_fecha_despido, INTERVAL 6 MONTH)
    GROUP BY YEAR(n.fecha_inicio), MONTH(n.fecha_inicio)
  ) x;

  SET v_total_sueldo_base = v_total_sueldo_base + IFNULL(@sum_quincena, 0);
  SET v_total_meses_salario = v_total_meses_salario + IFNULL(@cnt_quincena, 0);

  SELECT IFNULL(SUM(x.total), 0), COUNT(*) INTO @sum_semanal, @cnt_semanal FROM (
    SELECT SUM(nd.monto) AS total
    FROM NominaDetalles nd
    JOIN Nominas n ON nd.id_nomina = n.id_nomina
    WHERE nd.concepto = 'Sueldo base'
      AND n.id_empleado = p_id_empleado
      AND n.id_tipo_nomina = 3
      AND n.fecha_inicio >= DATE_SUB(p_fecha_despido, INTERVAL 6 MONTH)
    GROUP BY YEAR(n.fecha_inicio), MONTH(n.fecha_inicio)
  ) x;

  SET v_total_sueldo_base = v_total_sueldo_base + IFNULL(@sum_semanal, 0);
  SET v_total_meses_salario = v_total_meses_salario + IFNULL(@cnt_semanal, 0);

  SET v_salario_promedio = ROUND(v_total_sueldo_base / GREATEST(v_total_meses_salario, 1), 2);

  -- 3. Tiempo trabajado
  SET v_anios_completos = TIMESTAMPDIFF(YEAR, v_fecha_contratacion, p_fecha_despido);
  SET v_meses_trabajados_total = TIMESTAMPDIFF(MONTH, v_fecha_contratacion, p_fecha_despido);
  SET v_meses_residuales = v_meses_trabajados_total - (v_anios_completos * 12);

  -- 4. Indemnización legal
  SET v_indemnizacion = ROUND(v_salario_promedio * v_anios_completos + (v_salario_promedio * v_meses_residuales / 12), 2);

  -- 5. Vacaciones no gozadas
  SELECT IFNULL(SUM(dias_asignados - dias_usados), 0) INTO v_dias_no_gozados
  FROM VacacionesCiclo
  WHERE id_empleado = p_id_empleado
    AND anio BETWEEN YEAR(v_fecha_contratacion) AND YEAR(p_fecha_despido);

  SET v_total_vacaciones = ROUND((v_dias_no_gozados / 30) * v_salario_base, 2);

  -- 6. Aguinaldo proporcional (desde 15 dic anterior)
  SET v_fecha_ultimo_aguinaldo = STR_TO_DATE(CONCAT(YEAR(p_fecha_despido) - IF(MONTH(p_fecha_despido) < 12, 1, 0), '-12-15'), '%Y-%m-%d');
  SET v_aguinaldo = ROUND(LEAST(DATEDIFF(p_fecha_despido, v_fecha_ultimo_aguinaldo), 365) / 365 * v_salario_base, 2);

  -- 7. Bono 14 proporcional (desde 15 jul anterior)
  SET v_fecha_ultimo_bono14 = STR_TO_DATE(CONCAT(YEAR(p_fecha_despido) - IF(MONTH(p_fecha_despido) < 7, 1, 0), '-07-15'), '%Y-%m-%d');
  SET v_bono14 = ROUND(LEAST(DATEDIFF(p_fecha_despido, v_fecha_ultimo_bono14), 365) / 365 * v_salario_base, 2);

-- 8. Horas extras no pagadas del mes actual
SET @inicio_mes = DATE_FORMAT(p_fecha_despido, '%Y-%m-01');

-- ¿Ya se pagaron horas extra en una nómina del mismo rango?
SELECT COUNT(*) INTO @pagadas
FROM NominaDetalles nd
JOIN Nominas n ON nd.id_nomina = n.id_nomina
WHERE n.id_empleado = p_id_empleado
  AND nd.concepto = 'Horas extras'
  AND n.fecha_inicio >= @inicio_mes
  AND n.fecha_fin <= p_fecha_despido;

IF @pagadas = 0 THEN
  SELECT IFNULL(SUM(horas * montoporhora), 0) INTO v_horas_extra
  FROM HorasExtras
  WHERE id_empleado = p_id_empleado
    AND fecha BETWEEN @inicio_mes AND p_fecha_despido;
ELSE
  SET v_horas_extra = 0;
END IF;


  -- 9. Total de la liquidación
  SET v_total_liquidacion = ROUND(
    v_indemnizacion + v_total_vacaciones + v_aguinaldo + v_bono14 + v_horas_extra, 2
  );

  -- 10. Insertar resultado
  INSERT INTO Liquidaciones (
    id_empleado, fecha_despido, salario_promedio, anios_completos, meses,
    indemnizacion, dias_no_gozados, vacaciones_pendientes,
    aguinaldo_proporcional, bono14_proporcional, horas_extra_mes, total_liquidacion
  ) VALUES (
    p_id_empleado, p_fecha_despido, v_salario_promedio, v_anios_completos, v_meses_residuales,
    v_indemnizacion, v_dias_no_gozados, v_total_vacaciones,
    v_aguinaldo, v_bono14, v_horas_extra, v_total_liquidacion
  );

  -- 11. Mostrar al final
  SELECT
    v_salario_promedio AS salario_promedio,
    v_anios_completos AS anios_completos,
    v_meses_residuales AS meses,
    v_indemnizacion AS indemnizacion,
    v_dias_no_gozados AS dias_no_gozados,
    v_total_vacaciones AS vacaciones_pendientes,
    v_aguinaldo AS aguinaldo_proporcional,
    v_bono14 AS bono14_proporcional,
    v_horas_extra AS horas_extra_mes,
    v_total_liquidacion AS total_liquidacion;
END $$

DELIMITER ;

DELIMITER $$

CREATE PROCEDURE sp_listar_liquidaciones()
BEGIN
  SELECT 
    l.id_liquidacion,
    l.id_empleado,
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
    l.fecha_despido,
    l.salario_promedio,
    l.anios_completos,
    l.meses,
    l.indemnizacion,
    l.vacaciones_pendientes,
    l.aguinaldo_proporcional,
    l.bono14_proporcional,
    l.horas_extra_mes,
    l.total_liquidacion,
    l.fecha_registro
  FROM Liquidaciones l
  JOIN Empleados e ON l.id_empleado = e.id_empleado
  ORDER BY l.fecha_registro DESC;
END $$

DELIMITER ;





DELIMITER $$
CREATE PROCEDURE sp_gestion_usuario(
  IN p_accion     VARCHAR(10),
  IN p_id_usuario INT,
  IN p_username   VARCHAR(50),
  IN p_password   VARCHAR(255),
  IN p_id_rol     INT
)
BEGIN
  IF p_accion = 'LISTAR' THEN
    SELECT u.id_usuario, u.username, u.id_rol, r.nombre_rol AS rol
      FROM Usuarios u
      JOIN Roles r ON u.id_rol = r.id_rol;

  ELSEIF p_accion = 'OBTENER' THEN
    SELECT u.id_usuario, u.username, u.id_rol, r.nombre_rol AS rol
      FROM Usuarios u
      JOIN Roles r ON u.id_rol = r.id_rol
     WHERE u.id_usuario = p_id_usuario;

  ELSEIF p_accion = 'INSERTAR' THEN
    INSERT INTO Usuarios(username,password,id_rol)
      VALUES(p_username,p_password,p_id_rol);
    SELECT LAST_INSERT_ID() AS id_usuario;


  ELSEIF p_accion = 'ACTUALIZAR' THEN
    IF p_password IS NOT NULL AND p_password <> '' THEN
      UPDATE Usuarios
        SET username=p_username, password=p_password, id_rol=p_id_rol
       WHERE id_usuario=p_id_usuario;
    ELSE
      UPDATE Usuarios
        SET username=p_username, id_rol=p_id_rol
       WHERE id_usuario=p_id_usuario;
    END IF;
    SELECT ROW_COUNT() AS afectados;

  ELSEIF p_accion = 'ELIMINAR' THEN
    DELETE FROM Usuarios WHERE id_usuario = p_id_usuario;
    SELECT ROW_COUNT() AS afectados;
  END IF;
END$$
DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_listar_roles()
BEGIN
  SELECT id_rol, nombre_rol FROM Roles;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_buscar_nominas_por_empleado (
  IN p_termino VARCHAR(100)
)
BEGIN
  SELECT 
    n.fecha_nomina,
    t.tipo AS tipo_nomina,
    e.id_empleado,
    e.nombres,
    e.apellidos,
    en.estado AS estado_nomina,
    COUNT(nd.id_nomina_detalle) AS empleados_incluidos,
    n.id_tipo_nomina
  FROM Nominas n
  JOIN Empleados e ON n.id_empleado = e.id_empleado
  JOIN EstadoNomina en ON n.id_estado = en.id_estado
  JOIN TipoNomina t ON n.id_tipo_nomina = t.id_tipo_nomina
  LEFT JOIN NominaDetalles nd ON nd.id_nomina = n.id_nomina
  WHERE CONCAT(e.nombres, ' ', e.apellidos) LIKE CONCAT('%', p_termino, '%')
     OR e.dpi LIKE CONCAT('%', p_termino, '%')
  GROUP BY n.id_nomina
  ORDER BY n.fecha_nomina DESC;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_listar_nominas_por_empleado (
  IN p_id_empleado INT
)
BEGIN
  SELECT 
    n.id_nomina,
    n.fecha_nomina,
    t.tipo AS tipo_nomina,
    en.estado AS estado_nomina,
    n.id_tipo_nomina
  FROM Nominas n
  JOIN TipoNomina t ON n.id_tipo_nomina = t.id_tipo_nomina
  JOIN EstadoNomina en ON n.id_estado = en.id_estado
  WHERE n.id_empleado = p_id_empleado
  ORDER BY n.fecha_nomina DESC;
END $$

DELIMITER ;


DELIMITER $$

CREATE PROCEDURE sp_obtener_liquidacion_por_id(IN p_id_liquidacion INT)
BEGIN
  SELECT 
    l.*, 
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo
  FROM Liquidaciones l
  JOIN Empleados e ON l.id_empleado = e.id_empleado
  WHERE l.id_liquidacion = p_id_liquidacion;
END $$

DELIMITER ;

-- Empleados con más horas extra por mes
DELIMITER $$

CREATE PROCEDURE sp_empleados_mas_horas_extra(IN p_mes INT, IN p_anio INT)
BEGIN
  SELECT 
    e.id_empleado,
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_empleado,
    SUM(h.horas) AS total_horas
  FROM HorasExtras h
  JOIN Empleados e ON e.id_empleado = h.id_empleado
  WHERE MONTH(h.fecha) = p_mes AND YEAR(h.fecha) = p_anio
  GROUP BY e.id_empleado
  ORDER BY total_horas DESC
  LIMIT 5;
END $$

DELIMITER ;


-- Departamentos con más gasto en nómina por mes
DELIMITER $$

CREATE PROCEDURE sp_gasto_nomina_por_departamento(IN p_mes INT, IN p_anio INT)
BEGIN
  SELECT 
    d.nombre_departamento,
    SUM(n.salario_neto) AS total_gasto
  FROM Nominas n
  JOIN Departamentos d ON n.id_departamento = d.id_departamento
  WHERE MONTH(n.fecha_nomina) = p_mes AND YEAR(n.fecha_nomina) = p_anio
  GROUP BY d.id_departamento
  ORDER BY total_gasto DESC;
END $$

DELIMITER ;



DELIMITER $$

CREATE PROCEDURE sp_generar_planilla (
  IN p_mes INT,
  IN p_anio INT,
  IN p_id_tipo_nomina INT,
  IN p_id_departamento INT -- NULL para todos
)
BEGIN
  SELECT 
    e.id_empleado,
    CONCAT(e.nombres, ' ', e.apellidos) AS nombre_completo,
    e.dpi,
    p.nombre_puesto,
    d.nombre_departamento,
    n.fecha_nomina,
    n.fecha_inicio,
    n.fecha_fin,
    n.salario_bruto,
    n.deducciones,
    n.salario_neto
  FROM Nominas n
  JOIN Empleados e ON e.id_empleado = n.id_empleado
  JOIN Puestos p ON p.id_puesto = e.id_puesto
  JOIN Departamentos d ON d.id_departamento = e.id_departamento
  WHERE MONTH(n.fecha_nomina) = p_mes
    AND YEAR(n.fecha_nomina) = p_anio
    AND n.id_tipo_nomina = p_id_tipo_nomina
    AND n.id_estado = 1 -- Solo planillas generadas
    AND (p_id_departamento IS NULL OR n.id_departamento = p_id_departamento);
END$$

DELIMITER ;


 DELIMITER $$

CREATE PROCEDURE sp_detalle_planilla_por_nomina (
  IN p_id_nomina INT
)
BEGIN
  SELECT concepto, monto, tipo
  FROM NominaDetalles
  WHERE id_nomina = p_id_nomina;
END$$

DELIMITER ;



-- Horas Extras (con cálculo automático vía SP)

CALL sp_insertar_horas_extra(2, '2025-04-10', 3);
CALL sp_insertar_horas_extra(3, '2025-04-10', 1);
CALL sp_insertar_horas_extra(4, '2025-04-10', 2);
CALL sp_insertar_horas_extra(5, '2025-04-10', 2);
CALL sp_insertar_horas_extra(6, '2025-04-10', 3);
CALL sp_insertar_horas_extra(7, '2025-04-10', 3);
CALL sp_insertar_horas_extra(8, '2025-04-10', 1);
CALL sp_insertar_horas_extra(9, '2025-04-10', 2);
CALL sp_insertar_horas_extra(10, '2025-04-10', 2);
CALL sp_insertar_horas_extra(11, '2025-04-10', 1);
CALL sp_insertar_horas_extra(12, '2025-04-10', 3);
CALL sp_insertar_horas_extra(13, '2025-04-10', 1);
CALL sp_insertar_horas_extra(14, '2025-04-10', 1);
CALL sp_insertar_horas_extra(15, '2025-04-10', 2);
CALL sp_insertar_horas_extra(16, '2025-04-10', 3);
CALL sp_insertar_horas_extra(17, '2025-04-10', 2);
CALL sp_insertar_horas_extra(18, '2025-04-10', 3);
CALL sp_insertar_horas_extra(19, '2025-04-10', 1);
CALL sp_insertar_horas_extra(20, '2025-04-10', 1);
CALL sp_insertar_horas_extra(1, '2025-04-10', 2);

-- Prestaciones (alternando entre los 4 tipos con fechas válidas)

CALL sp_prestacion_bono14(2, '2025-04-10');
CALL sp_prestacion_vacaciones(3, '2025-04-10');
CALL sp_prestacion_indemnizacion(4, '2025-04-10');
CALL sp_prestacion_aguinaldo(5, '2025-04-10');
CALL sp_prestacion_bono14(6, '2025-04-10');
CALL sp_prestacion_vacaciones(7, '2025-04-10');
CALL sp_prestacion_indemnizacion(8, '2025-04-10');
CALL sp_prestacion_aguinaldo(9, '2025-04-10');
CALL sp_prestacion_bono14(10, '2025-04-10');
CALL sp_prestacion_vacaciones(11, '2025-04-10');
CALL sp_prestacion_indemnizacion(12, '2025-04-10');
CALL sp_prestacion_aguinaldo(13, '2025-04-10');
CALL sp_prestacion_bono14(14, '2025-04-10');
CALL sp_prestacion_vacaciones(15, '2025-04-10');
CALL sp_prestacion_indemnizacion(16, '2025-04-10');
CALL sp_prestacion_aguinaldo(17, '2025-04-10');
CALL sp_prestacion_bono14(18, '2025-04-10');
CALL sp_prestacion_vacaciones(19, '2025-04-10');
CALL sp_prestacion_indemnizacion(20, '2025-04-10');
CALL sp_prestacion_aguinaldo(1, '2025-04-10');