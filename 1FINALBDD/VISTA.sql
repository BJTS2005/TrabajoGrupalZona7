INSERT INTO GM_WSI_CAMPUS (CAMP_ID, CAMP_NOM, CAMP_AREA, CAMP_PERIMETRO, CAMP_CANT_POBLA, CAMP_DENS_POBLA)
VALUES 
('C001', 'Campus Norte', 15000, 5000, 5000, 33.33),
('C002', 'Campus Sur', 20000, 7000, 8000, 40),
('C003', 'Campus Este', 18000, 6000, 3000, 16.67);

INSERT INTO GM_TE_CURSOS (CUR_ID, CAMP_ID, CUR_DESCRIPCION, CUR_ES_SOSTENIBLE)
VALUES 
('CU001', 'C001', 'Curso de Energías Renovables', TRUE),
('CU002', 'C001', 'Curso de Ecología Urbana', TRUE),
('CU003', 'C002', 'Curso de Finanzas Verdes', FALSE),
('CU004', 'C002', 'Curso de Biotecnología', TRUE),
('CU005', 'C003', 'Curso de Tecnología Ambiental', TRUE);

INSERT INTO GM_TE_EVENTOS_SOSTENIBLES (ID_EVE, TPE_ID, CAMP_ID, EVE_DETALLE, EVE_FECHA, EVE_POR_ESTUDIANTES, EVE_URL)
VALUES
('E001', 'EV001', 'C001', 'Feria de Energías Sostenibles', '2025-03-20', TRUE, 'http://evento.com/feria-energies'),
('E002', 'EV002', 'C001', 'Conferencia sobre Cambio Climático', '2025-04-15', FALSE, 'http://evento.com/conferencia-climatico'),
('E003', 'EV003', 'C002', 'Taller de Reciclaje en la Comunidad', '2025-05-05', TRUE, 'http://evento.com/taller-reciclaje');

INSERT INTO GM_TE_FONDOS_INVESTIGACION (FONDO_ID, FONDO_SOSTENIBILIDAD, CAMP_ID, FONDO_TOTAL)
VALUES
('F001', 50000, 'C001', 100000),
('F002', 20000, 'C002', 80000),
('F003', 15000, 'C003', 60000);

INSERT INTO GM_TE_GRADUADOS_GREEN_JOBS (GRA_ID, CAMP_ID, JOB_ID, GRA_CANTIDAD)
VALUES
(1, 'C001', 'J001', 30),
(2, 'C001', 'J002', 20),
(3, 'C002', 'J003', 50),
(4, 'C003', 'J004', 10);

INSERT INTO GM_TE_VEHICULOS (VEH_ID, FRE_ID, TPE_ID, TPV_ID, CAMP_ID, VEH_CANTIDAD, VEH_CANTIDAD_RUEDAS, VEH_FECHA_REGISTRO, VEH_DISTANCIA_APROX_RECORRIDA)
VALUES
('V001', 'F0001', 'CMB', 'V0001', 'C001', 5, 4, '2025-01-01', 1000),
('V002', 'F0001', 'ZEV', 'V0002', 'C001', 3, 4, '2025-01-02', 800),
('V003', 'F0001', 'CMB', 'V0005', 'C002', 4, 4, '2025-02-10', 1200),
('V004', 'F0001', 'ZEV', 'V0001', 'C003', 6, 4, '2025-01-15', 1500);

INSERT INTO GM_TE_SHUTTLES (STI_ID, TPE_ID, CAMP_ID, STI_DESCRIPCION, STI_PROM_PASAJEROS, STI_TOT_VIAJES_DIA, STI_FECHA_REGISTRO)
VALUES
('S001', 'ZEV', 'C001', 'Shuttle de Energía', 20, 10, '2025-01-01'),
('S002', 'CMB', 'C001', 'Shuttle Ecológico', 15, 12, '2025-01-15'),
('S003', 'CMB', 'C002', 'Shuttle Comunitario', 25, 8, '2025-02-05'),
('S004', 'ZEV', 'C003', 'Shuttle Campus Sur', 30, 6, '2025-03-01');


CREATE OR REPLACE VIEW REPORTE_POR_CAMPUS AS
SELECT
    c.CAMP_ID                                    AS id_campus,
    c.CAMP_NOM                                   AS nombre_campus,
    c.CAMP_AREA                                  AS area_m2,
    c.CAMP_PERIMETRO                             AS perimetro_m,
    c.CAMP_CANT_POBLA                            AS poblacion,
    c.CAMP_DENS_POBLA                            AS densidad_poblacion,

    COUNT(DISTINCT CASE WHEN cu.CUR_ES_SOSTENIBLE THEN cu.CUR_ID END)
        AS total_cursos_sostenibles,

    COUNT(DISTINCT es.ID_EVE) 
        AS total_eventos_sostenibles,

    SUM(f.FONDO_SOSTENIBILIDAD)
        AS total_fondos_sostenibles,

    SUM(g.GRA_CANTIDAD) 
        AS total_graduados_green_jobs,

    SUM(v.VEH_CANTIDAD) 
        AS total_vehiculos,

    SUM(st.STI_TOT_VIAJES_DIA) 
        AS total_viajes_shuttles_dia

FROM GM_WSI_CAMPUS c
    LEFT JOIN GM_TE_CURSOS cu
        ON c.CAMP_ID = cu.CAMP_ID
    LEFT JOIN GM_TE_EVENTOS_SOSTENIBLES es
        ON c.CAMP_ID = es.CAMP_ID
    LEFT JOIN GM_TE_FONDOS_INVESTIGACION f
        ON c.CAMP_ID = f.CAMP_ID
    LEFT JOIN GM_TE_GRADUADOS_GREEN_JOBS g
        ON c.CAMP_ID = g.CAMP_ID
    LEFT JOIN GM_TE_VEHICULOS v
        ON c.CAMP_ID = v.CAMP_ID
    LEFT JOIN GM_TE_SHUTTLES st
        ON c.CAMP_ID = st.CAMP_ID

GROUP BY 
    c.CAMP_ID,
    c.CAMP_NOM,
    c.CAMP_AREA,
    c.CAMP_PERIMETRO,
    c.CAMP_CANT_POBLA,
    c.CAMP_DENS_POBLA;

SELECT * FROM REPORTE_POR_CAMPUS