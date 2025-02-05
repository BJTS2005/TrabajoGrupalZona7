SELECT * FROM public.gm_wsi_campus
ORDER BY camp_id ASC 

-- Registros de vehículos para el campus CULUI
INSERT INTO GM_TE_VEHICULOS (VEH_ID, FRE_ID, TPE_ID, TPV_ID, CAMP_ID, VEH_CANTIDAD, VEH_CANTIDAD_RUEDAS, VEH_FECHA_REGISTRO, VEH_DISTANCIA_APROX_RECORRIDA)
VALUES 
('V001', 'F0001', 'CMB', 'V0001', 'CULUI', 10, 4, '2024-02-01', 15000),
('V002', 'F0001', 'ZEV', 'V0005', 'CULUI', 5, 2, '2024-02-01', 8000);

-- Registros de vehículos para el campus EOAV.
INSERT INTO GM_TE_VEHICULOS (VEH_ID, FRE_ID, TPE_ID, TPV_ID, CAMP_ID, VEH_CANTIDAD, VEH_CANTIDAD_RUEDAS, VEH_FECHA_REGISTRO, VEH_DISTANCIA_APROX_RECORRIDA)
VALUES 
('V003', 'F0001', 'ZEV', 'V0001', 'EOAV.', 8, 4, '2024-02-01', 12000),
('V004', 'F0001', 'CMB', 'V0005', 'EOAV.', 3, 2, '2024-02-01', 6000);

-- Registros de vehículos para el campus GEYAV
INSERT INTO GM_TE_VEHICULOS (VEH_ID, FRE_ID, TPE_ID, TPV_ID, CAMP_ID, VEH_CANTIDAD, VEH_CANTIDAD_RUEDAS, VEH_FECHA_REGISTRO, VEH_DISTANCIA_APROX_RECORRIDA)
VALUES 
('V005', 'F0001', 'CMB', 'V0001', 'GEYAV', 6, 4, '2024-02-01', 10000),
('V006', 'F0001', 'ZEV', 'V0005', 'GEYAV', 4, 2, '2024-02-01', 7000);

-- Registros de vehículos para el campus SVDPJ
INSERT INTO GM_TE_VEHICULOS (VEH_ID, FRE_ID, TPE_ID, TPV_ID, CAMP_ID, VEH_CANTIDAD, VEH_CANTIDAD_RUEDAS, VEH_FECHA_REGISTRO, VEH_DISTANCIA_APROX_RECORRIDA)
VALUES 
('V007', 'F0001', 'CMB', 'V0001', 'SVDPJ', 9, 4, '2024-02-01', 13000),
('V008', 'F0001', 'ZEV', 'V0005', 'SVDPJ', 2, 2, '2024-02-01', 5000);

-- Shuttles para el campus CULUI
INSERT INTO GM_TE_SHUTTLES (STI_ID, TPE_ID, CAMP_ID, STI_DESCRIPCION, STI_PROM_PASAJEROS, STI_TOT_VIAJES_DIA, STI_FECHA_REGISTRO)
VALUES 
('S001', 'CMB', 'CULUI', 'Shuttle de gasolina que conecta las residencias con el campus', 30, 15, '2024-02-01'),
('S002', 'ZEV', 'CULUI', 'Minibús eléctrico para recorridos internos dentro del campus', 25, 20, '2024-02-01');

-- Shuttles para el campus EOAV.
INSERT INTO GM_TE_SHUTTLES (STI_ID, TPE_ID, CAMP_ID, STI_DESCRIPCION, STI_PROM_PASAJEROS, STI_TOT_VIAJES_DIA, STI_FECHA_REGISTRO)
VALUES 
('S003', 'ZEV', 'EOAV.', 'Shuttle eléctrico que transporta a estudiantes entre edificios', 28, 18, '2024-02-01'),
('S004', 'CMB', 'EOAV.', 'Autobús diésel para rutas largas desde la estación de tren', 35, 12, '2024-02-01');

-- Shuttles para el campus GEYAV
INSERT INTO GM_TE_SHUTTLES (STI_ID, TPE_ID, CAMP_ID, STI_DESCRIPCION, STI_PROM_PASAJEROS, STI_TOT_VIAJES_DIA, STI_FECHA_REGISTRO)
VALUES 
('S005', 'CMB', 'GEYAV', 'Microbús con motor de combustión para rutas fuera del campus', 40, 10, '2024-02-01'),
('S006', 'ZEV', 'GEYAV', 'Shuttle eléctrico que conecta la biblioteca con la cafetería', 22, 22, '2024-02-01');

-- Shuttles para el campus SVDPJ
INSERT INTO GM_TE_SHUTTLES (STI_ID, TPE_ID, CAMP_ID, STI_DESCRIPCION, STI_PROM_PASAJEROS, STI_TOT_VIAJES_DIA, STI_FECHA_REGISTRO)
VALUES 
('S007', 'CMB', 'SVDPJ', 'Camioneta compartida para profesores y personal administrativo', 38, 14, '2024-02-01'),
('S008', 'ZEV', 'SVDPJ', 'Shuttle eléctrico para el traslado de estudiantes a laboratorios', 26, 19, '2024-02-01');


-- Infraestructura para el campus CULUI
INSERT INTO GM_TE_INFRAESTRUCTURAS_TRANSPOR (INT_ID, INT_DETALLE, CAMP_ID, TPI_ID, INT_UBICACION, INT_AREA, INT_FECHA_REGISTRO)
VALUES 
('I001', 'Parking principal', 'CULUI', 'TIP01', 'Zona Norte', 500, '2024-02-01'),
('I002', 'Cruce peatonal frente a biblioteca', 'CULUI', 'TIP02', 'Zona Central', 50, '2024-02-01');

-- Infraestructura para el campus EOAV.
INSERT INTO GM_TE_INFRAESTRUCTURAS_TRANSPOR (INT_ID, INT_DETALLE, CAMP_ID, TPI_ID, INT_UBICACION, INT_AREA, INT_FECHA_REGISTRO)
VALUES 
('I003', 'Estacionamiento sur', 'EOAV.', 'TIP01', 'Zona Sur', 300, '2024-02-01'),
('I004', 'Paso peatonal hacia auditorio', 'EOAV.', 'TIP02', 'Zona Este', 40, '2024-02-01');

-- Infraestructura para el campus GEYAV
INSERT INTO GM_TE_INFRAESTRUCTURAS_TRANSPOR (INT_ID, INT_DETALLE, CAMP_ID, TPI_ID, INT_UBICACION, INT_AREA, INT_FECHA_REGISTRO)
VALUES 
('I005', 'Parking para profesores', 'GEYAV', 'TIP01', 'Edificio Administrativo', 200, '2024-02-01'),
('I006', 'Cruce peatonal en entrada principal', 'GEYAV', 'TIP02', 'Entrada Principal', 60, '2024-02-01');

-- Infraestructura para el campus SVDPJ
INSERT INTO GM_TE_INFRAESTRUCTURAS_TRANSPOR (INT_ID, INT_DETALLE, CAMP_ID, TPI_ID, INT_UBICACION, INT_AREA, INT_FECHA_REGISTRO)
VALUES 
('I007', 'Parking para estudiantes', 'SVDPJ', 'TIP01', 'Zona Oeste', 400, '2024-02-01'),
('I008', 'Paso peatonal hacia cafetería', 'SVDPJ', 'TIP02', 'Zona Central', 55, '2024-02-01');

-- Eventos para el campus CULUI
INSERT INTO GM_TE_EVENTOS_SOSTENIBLES (ID_EVE, TPE_ID, CAMP_ID, EVE_DETALLE, EVE_FECHA, EVE_POR_ESTUDIANTES, EVE_URL)
VALUES 
('E001', 'EV001', 'CULUI', 'Festival cultural de sostenibilidad', '2024-03-10', FALSE, 'https://ejemplo.com/evento_cului'),
('E002', 'EV002', 'CULUI', 'Proyecto de reciclaje por estudiantes', '2024-04-15', TRUE, 'https://ejemplo.com/reciclaje_cului'),
('E003', 'EV003', 'CULUI', 'Curso sobre energías renovables', '2024-05-20', FALSE, NULL);

-- Eventos para el campus EOAV.
INSERT INTO GM_TE_EVENTOS_SOSTENIBLES (ID_EVE, TPE_ID, CAMP_ID, EVE_DETALLE, EVE_FECHA, EVE_POR_ESTUDIANTES, EVE_URL)
VALUES 
('E004', 'EV001', 'EOAV.', 'Muestra de arte sostenible', '2024-03-12', FALSE, 'https://ejemplo.com/arte_sostenible'),
('E005', 'EV002', 'EOAV.', 'Jornada de reforestación estudiantil', '2024-04-18', TRUE, 'https://ejemplo.com/reforestacion'),
('E006', 'EV003', 'EOAV.', 'Seminario sobre economía circular', '2024-06-05', FALSE, NULL);

-- Eventos para el campus GEYAV
INSERT INTO GM_TE_EVENTOS_SOSTENIBLES (ID_EVE, TPE_ID, CAMP_ID, EVE_DETALLE, EVE_FECHA, EVE_POR_ESTUDIANTES, EVE_URL)
VALUES 
('E007', 'EV001', 'GEYAV', 'Cine ecológico al aire libre', '2024-03-25', FALSE, 'https://ejemplo.com/cine_ecologico'),
('E008', 'EV002', 'GEYAV', 'Concurso de innovación ecológica', '2024-05-02', TRUE, 'https://ejemplo.com/innovacion'),
('E009', 'EV003', 'GEYAV', 'Taller de construcción sostenible', '2024-07-10', FALSE, NULL);

-- Eventos para el campus SVDPJ
INSERT INTO GM_TE_EVENTOS_SOSTENIBLES (ID_EVE, TPE_ID, CAMP_ID, EVE_DETALLE, EVE_FECHA, EVE_POR_ESTUDIANTES, EVE_URL)
VALUES 
('E010', 'EV001', 'SVDPJ', 'Feria gastronómica ecológica', '2024-04-05', FALSE, 'https://ejemplo.com/feria_eco'),
('E011', 'EV002', 'SVDPJ', 'Hackatón ambiental universitario', '2024-05-25', TRUE, 'https://ejemplo.com/hackaton'),
('E012', 'EV003', 'SVDPJ', 'Curso de movilidad sostenible', '2024-08-15', FALSE, NULL);

-- Sitios web para el campus CULUI
INSERT INTO GM_TE_SITIOS_WEB (ID_SIT, CAMP_ID, SIT_DESCRIPCION, SIT_URL, SIT_ACTIVO, SIT_ES_REPORTE)
VALUES 
('S001', 'CULUI', 'Reporte de sostenibilidad 2024', 'https://cului.edu/sostenibilidad', TRUE, TRUE),
('S002', 'CULUI', 'Iniciativa de reciclaje', 'https://cului.edu/reciclaje', TRUE, FALSE);

-- Sitios web para el campus EOAV.
INSERT INTO GM_TE_SITIOS_WEB (ID_SIT, CAMP_ID, SIT_DESCRIPCION, SIT_URL, SIT_ACTIVO, SIT_ES_REPORTE)
VALUES 
('S003', 'EOAV.', 'Informe de impacto ambiental', 'https://eoav.edu/impacto', TRUE, TRUE),
('S004', 'EOAV.', 'Energía renovable en el campus', 'https://eoav.edu/energia', TRUE, FALSE);

-- Sitios web para el campus GEYAV
INSERT INTO GM_TE_SITIOS_WEB (ID_SIT, CAMP_ID, SIT_DESCRIPCION, SIT_URL, SIT_ACTIVO, SIT_ES_REPORTE)
VALUES 
('S005', 'GEYAV', 'Reporte anual de huella de carbono', 'https://geyav.edu/huella', TRUE, TRUE),
('S006', 'GEYAV', 'Movilidad sostenible en el campus', 'https://geyav.edu/movilidad', TRUE, FALSE);

-- Sitios web para el campus SVDPJ
INSERT INTO GM_TE_SITIOS_WEB (ID_SIT, CAMP_ID, SIT_DESCRIPCION, SIT_URL, SIT_ACTIVO, SIT_ES_REPORTE)
VALUES 
('S007', 'SVDPJ', 'Reporte de biodiversidad', 'https://svdpj.edu/biodiversidad', TRUE, TRUE),
('S008', 'SVDPJ', 'Huertos urbanos en la universidad', 'https://svdpj.edu/huertos', TRUE, FALSE);

INSERT INTO GM_TE_GREEN_JOBS (JOB_ID, JOB_DETALLE)
VALUES 
('J001', 'Especialista en Energías Renovables'),
('J002', 'Auditor de Sostenibilidad'),
('J003', 'Ingeniero en Movilidad Eléctrica'),
('J004', 'Técnico en Transporte Sostenible'),
('J005', 'Coordinador de Gestión de Residuos'),
('J006', 'Analista de Reciclaje Urbano'),
('J007', 'Educador en Sostenibilidad'),
('J008', 'Consultor en Responsabilidad Social');

-- Graduados en Green Jobs para el campus CULUI
INSERT INTO GM_TE_GRADUADOS_GREEN_JOBS (CAMP_ID, JOB_ID, GRA_CANTIDAD)
VALUES 
('CULUI', 'J001', 15),
('CULUI', 'J003', 10),
('CULUI', 'J005', 8),
('CULUI', 'J007', 5);

-- Graduados en Green Jobs para el campus EOAV.
INSERT INTO GM_TE_GRADUADOS_GREEN_JOBS (CAMP_ID, JOB_ID, GRA_CANTIDAD)
VALUES 
('EOAV.', 'J002', 12),
('EOAV.', 'J004', 9),
('EOAV.', 'J006', 7),
('EOAV.', 'J008', 6);

-- Graduados en Green Jobs para el campus GEYAV
INSERT INTO GM_TE_GRADUADOS_GREEN_JOBS (CAMP_ID, JOB_ID, GRA_CANTIDAD)
VALUES 
('GEYAV', 'J001', 18),
('GEYAV', 'J003', 11),
('GEYAV', 'J005', 9),
('GEYAV', 'J007', 4);

-- Graduados en Green Jobs para el campus SVDPJ
INSERT INTO GM_TE_GRADUADOS_GREEN_JOBS (CAMP_ID, JOB_ID, GRA_CANTIDAD)
VALUES 
('SVDPJ', 'J002', 14),
('SVDPJ', 'J004', 10),
('SVDPJ', 'J006', 6),
('SVDPJ', 'J008', 5);

-- Cursos para el campus CULUI
INSERT INTO GM_TE_CURSOS (CUR_ID, CAMP_ID, CUR_DESCRIPCION, CUR_ES_SOSTENIBLE)
VALUES 
('C001', 'CULUI', 'Energías Renovables', TRUE),
('C002', 'CULUI', 'Gestión del Cambio Climático', TRUE),
('C003', 'CULUI', 'Transporte y Movilidad Sostenible', TRUE),
('C004', 'CULUI', 'Desarrollo Sostenible y ODS', TRUE);

-- Cursos para el campus EOAV.
INSERT INTO GM_TE_CURSOS (CUR_ID, CAMP_ID, CUR_DESCRIPCION, CUR_ES_SOSTENIBLE)
VALUES 
('C005', 'EOAV.', 'Economía Circular y Reciclaje', TRUE),
('C006', 'EOAV.', 'Diseño de Infraestructura Verde', TRUE),
('C007', 'EOAV.', 'Políticas Ambientales', TRUE),
('C008', 'EOAV.', 'Energías Renovables', TRUE);

-- Cursos para el campus GEYAV
INSERT INTO GM_TE_CURSOS (CUR_ID, CAMP_ID, CUR_DESCRIPCION, CUR_ES_SOSTENIBLE)
VALUES 
('C009', 'GEYAV', 'Gestión de Residuos Urbanos', TRUE),
('C010', 'GEYAV', 'Movilidad Sostenible en Ciudades', TRUE),
('C011', 'GEYAV', 'Desarrollo Sostenible y ODS', TRUE),
('C012', 'GEYAV', 'Transporte y Movilidad Sostenible', TRUE);

-- Cursos para el campus SVDPJ
INSERT INTO GM_TE_CURSOS (CUR_ID, CAMP_ID, CUR_DESCRIPCION, CUR_ES_SOSTENIBLE)
VALUES 
('C013', 'SVDPJ', 'Energías Renovables', TRUE),
('C014', 'SVDPJ', 'Políticas Ambientales', TRUE),
('C015', 'SVDPJ', 'Economía Circular y Reciclaje', TRUE),
('C016', 'SVDPJ', 'Gestión del Cambio Climático', TRUE);
