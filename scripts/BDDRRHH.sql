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
  DECLARE v_meses_trabajados INT;
  DECLARE v_monto DECIMAL(10,2);
  DECLARE v_estado INT;
  DECLARE v_existe INT;

  -- Validar existencia del empleado
  SELECT COUNT(*) INTO v_existe FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_existe = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no existe.';
  END IF;

  -- Verificar estado del empleado
  SELECT id_estado INTO v_estado FROM Empleados WHERE id_empleado = p_id_empleado;
  IF v_estado != 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'El empleado no está activo.';
  END IF;

  SELECT fecha_contratacion, salario_base INTO v_fecha_contratacion, v_salario_base
  FROM Empleados WHERE id_empleado = p_id_empleado;

  SET v_meses_trabajados = PERIOD_DIFF(DATE_FORMAT(p_fecha_aplicacion, '%Y%m'), DATE_FORMAT(v_fecha_contratacion, '%Y%m'));

  IF v_meses_trabajados >= 12 THEN
    SET v_monto = v_salario_base;
  ELSE
    SET v_monto = ROUND(v_salario_base * (v_meses_trabajados / 12), 2);
  END IF;

  INSERT INTO PrestacionEmpleado (id_prestacion, id_empleado, fecha_aplicacion, monto)
  VALUES (1, p_id_empleado, p_fecha_aplicacion, v_monto);
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

  IF v_meses_trabajados >= 12 THEN
    SET v_monto = v_salario_base;
  ELSE
    SET v_monto = ROUND(v_salario_base * (v_meses_trabajados / 12), 2);
  END IF;

  INSERT INTO PrestacionEmpleado (id_prestacion, id_empleado, fecha_aplicacion, monto)
  VALUES (2, p_id_empleado, p_fecha_aplicacion, v_monto);
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
  DECLARE v_salario_base DECIMAL(10,2);
  DECLARE v_total_horas_extra DECIMAL(10,2) DEFAULT 0.00;
  DECLARE v_total_prestaciones DECIMAL(10,2) DEFAULT 0.00;

  -- 1. Obtener salario base
  SELECT salario_base INTO v_salario_base
  FROM Empleados
  WHERE id_empleado = p_id_empleado;

  -- 2. Insertar sueldo base
  INSERT INTO NominaDetalles (
    id_nomina, id_impuesto, concepto, monto, tipo
  ) VALUES (
    p_id_nomina, NULL, 'Sueldo base', v_salario_base, 'Ingreso'
  );

  -- 3. Calcular horas extra en el rango
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

  -- 4. Calcular prestaciones aplicadas en el rango
  SELECT IFNULL(SUM(monto), 0) INTO v_total_prestaciones
  FROM PrestacionEmpleado
  WHERE id_empleado = p_id_empleado
    AND fecha_aplicacion BETWEEN p_fecha_inicio AND p_fecha_fin;

  IF v_total_prestaciones > 0 THEN
    INSERT INTO NominaDetalles (
      id_nomina, id_impuesto, concepto, monto, tipo
    ) VALUES (
      p_id_nomina, NULL, 'Prestaciones', v_total_prestaciones, 'Ingreso'
    );
  END IF;

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
  IN p_fecha_inicio DATE,
  IN p_fecha_fin DATE,
  IN p_id_departamento INT -- nuevo parámetro
)
BEGIN
  DECLARE v_id_nomina INT;
  DECLARE v_existe INT;
  DECLARE v_estado INT;

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

  IF p_fecha_inicio IS NULL OR p_fecha_fin IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fechas inválidas: no pueden estar vacías.';
  END IF;

  IF p_fecha_fin < p_fecha_inicio THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fechas inválidas: la fecha final es anterior a la inicial.';
  END IF;

  CALL sp_insertar_nomina(
    p_id_empleado,
    p_fecha_nomina,
    p_fecha_inicio,
    p_fecha_fin,
    p_id_tipo_nomina,
    p_id_estado,
    p_id_departamento,
    v_id_nomina
  );

  CALL sp_insertar_ingresos_nomina(
    v_id_nomina,
    p_id_empleado,
    p_fecha_inicio,
    p_fecha_fin
  );

  CALL sp_aplicar_impuestos_nomina(
    v_id_nomina,
    p_id_empleado
  );

  CALL sp_actualizar_totales_nomina(
    v_id_nomina
  );
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
  IN p_fecha_inicio DATE,
  IN p_fecha_fin DATE
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

  IF p_fecha_inicio IS NULL OR p_fecha_fin IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fechas inválidas: no pueden estar vacías.';
  END IF;

  IF p_fecha_fin < p_fecha_inicio THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fechas inválidas: la fecha final es anterior a la inicial.';
  END IF;

  OPEN empleados_cursor;

  leer_empleado: LOOP
    FETCH empleados_cursor INTO v_id_empleado;
    IF done THEN LEAVE leer_empleado; END IF;

    -- ✅ Aquí está la corrección: ahora sí se manda el ID del departamento
    CALL sp_generar_nomina_empleado(
      v_id_empleado,
      p_fecha_nomina,
      p_id_tipo_nomina,
      p_id_estado,
      p_fecha_inicio,
      p_fecha_fin,
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
  IN p_fecha_inicio DATE,
  IN p_fecha_fin DATE
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

  -- Validaciones
  SELECT COUNT(*) INTO v_total
  FROM Empleados
  WHERE id_estado = 1;

  IF v_total = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay empleados activos en la empresa.';
  END IF;

  IF p_fecha_inicio IS NULL OR p_fecha_fin IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fechas inválidas: no pueden estar vacías.';
  END IF;

  IF p_fecha_fin < p_fecha_inicio THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Fechas inválidas: la fecha final es anterior a la inicial.';
  END IF;

  OPEN empleados_cursor;

  leer_empleado: LOOP
    FETCH empleados_cursor INTO v_id_empleado;
    IF done THEN LEAVE leer_empleado; END IF;

    -- ✅ Corrección aquí: agregamos el parámetro de departamento (usa 0 para "Todos")
    CALL sp_generar_nomina_empleado(
      v_id_empleado,
      p_fecha_nomina,
      p_id_tipo_nomina,
      p_id_estado,
      p_fecha_inicio,
      p_fecha_fin,
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

CREATE PROCEDURE sp_eliminar_dias_mes_actual (
  IN p_id_empleado INT
)
BEGIN
  DELETE FROM DiasTrabajados
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