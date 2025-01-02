import { Sequelize } from "sequelize";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;
import Campus from "../model/campus.model.js";
import sequelize from "../config/conexion.js";
import FondoInvestigacion from "../model/fondosInvestigacion.model.js";
import Curso from "../model/cursos.model.js";


export const reportesController = {
    listar: async (req, res) => {
        try {
            const campus = await Campus.findAll({
                raw: true,
                nest: true,
            });

            res.render("reportes/listarCampus.ejs", {
                title: 'Campus Registrados',
                datos: campus
            });
        } catch (error) {
            console.error("Error al listar los campus:", error);
            res.status(500).send("Error al cargar la página.");
        }
    },
    reporteCampus: async (req, res) => {
        try {
            const { camp_id } = req.params;

            // Consulta para obtener los datos del campus
            const campus = await Campus.findByPk(camp_id, { raw: true });
            if (!campus) return res.status(404).send("Campus no encontrado.");

            // Consulta para obtener los datos del fondo
            const fondo = await FondoInvestigacion.findOne({ where: { camp_id }, raw: true });

            // Consulta SQL cruda para el reporte de vehículos
            const resultados = await sequelize.query(
                `
                SELECT 
                    tpv.tpv_detalle AS tipo_vehiculo,
                    fre.fre_detalle AS frecuencia,
                    SUM(veh.veh_cantidad) AS total_vehiculos,
                    AVG(veh.veh_distancia_aprox_recorrida) AS distancia_promedio
                FROM 
                    GM_TE_VEHICULOS veh
                JOIN 
                    GM_TE_TIPOS_VEHICULO tpv ON veh.tpv_id = tpv.tpv_id
                JOIN 
                    GM_TE_FRECUENCIAS fre ON veh.fre_id = fre.fre_id
                WHERE 
                    veh.camp_id = :campId
                GROUP BY 
                    tpv.tpv_detalle, fre.fre_detalle
                ORDER BY 
                    tpv.tpv_detalle, fre.fre_detalle;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const resumenEmisiones = await sequelize.query(
                `
                SELECT 
                    tpe.tpe_detalle AS tipo_emision,
                    SUM(veh.veh_cantidad) AS total_vehiculos,
                    c.camp_cant_pobla AS poblacion_campus,
                    ROUND(CAST((SUM(veh.veh_cantidad)::NUMERIC / c.camp_cant_pobla) AS NUMERIC), 6) AS ratio_poblacion
                FROM 
                    GM_TE_VEHICULOS veh
                JOIN 
                    GM_TE_TIPOS_EMISION tpe ON veh.tpe_id = tpe.tpe_id
                JOIN 
                    GM_WSI_CAMPUS c ON veh.camp_id = c.camp_id
                WHERE 
                    veh.camp_id = :campId
                GROUP BY 
                    tpe.tpe_detalle, c.camp_cant_pobla
                ORDER BY 
                    total_vehiculos DESC;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Consulta SQL cruda para el resumen por tipo de emisión
            const emisiones = await sequelize.query(
                `
    SELECT 
        tpe.tpe_detalle AS tipo_emision,
        fre.fre_detalle AS frecuencia,
        SUM(veh.veh_cantidad) AS total_vehiculos
    FROM 
        GM_TE_VEHICULOS veh
    JOIN 
        GM_TE_TIPOS_EMISION tpe ON veh.tpe_id = tpe.tpe_id
    JOIN 
        GM_TE_FRECUENCIAS fre ON veh.fre_id = fre.fre_id
    WHERE 
        veh.camp_id = :campId
    GROUP BY 
        tpe.tpe_detalle, fre.fre_detalle
    ORDER BY 
        tpe.tpe_detalle, fre.fre_detalle;
    `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Consulta SQL cruda para obtener los shuttles
            const shuttles = await sequelize.query(
                `
                SELECT 
                    s.sti_id,
                    s.sti_descripcion,
                    s.sti_prom_pasajeros,
                    s.sti_tot_viajes_dia,
                    te.tpe_detalle AS tipo_emision
                FROM 
                    GM_TE_SHUTTLES s
                LEFT JOIN 
                    GM_TE_TIPOS_EMISION te ON s.tpe_id = te.tpe_id
                WHERE 
                    s.camp_id = :campId;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Consulta SQL cruda para el total de shuttles
            const totalShuttles = await sequelize.query(
                `
                SELECT 
                    COUNT(*) AS total_shuttles
                FROM 
                    GM_TE_SHUTTLES
                WHERE 
                    camp_id = :campId;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const infraestructuras = await sequelize.query(
                `
                SELECT 
        ti.tpi_detalle AS tipo_infraestructura,
        COUNT(it.int_id) AS total_infraestructuras, -- Total por tipo
        SUM(it.int_area) AS area_total_tipo,
        c.camp_area AS area_total_campus,
        ROUND(CAST((SUM(it.int_area) / c.camp_area) * 100 AS NUMERIC), 2) AS porcentaje_campus
    FROM 
        gm_te_infraestructuras_transpor it
    JOIN 
        tipos_inf ti ON it.tpi_id = ti.tpi_id
    JOIN 
        gm_wsi_campus c ON it.camp_id = c.camp_id
    WHERE 
        c.camp_id = :campId
    GROUP BY 
        ti.tpi_detalle, c.camp_area
    ORDER BY 
        porcentaje_campus DESC;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Consulta SQL para resumen de cursos
            const cursosResumen = await sequelize.query(
                `
    SELECT 
        COUNT(*) AS total_cursos,
        SUM(CASE WHEN cur_es_sostenible THEN 1 ELSE 0 END) AS total_cursos_sostenibles,
        ROUND(
            (CAST(SUM(CASE WHEN cur_es_sostenible THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(*)) * 100, 
            2
        ) AS porcentaje_sostenibilidad
    FROM 
        GM_TE_CURSOS
    WHERE 
        camp_id = :campId;
    `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );


            // Extraer resultados
            const { total_cursos, total_cursos_sostenibles, porcentaje_sostenibilidad } = cursosResumen[0];

            const cursosDetalles = await Curso.findAll({
                where: { camp_id: camp_id },
                attributes: ['cur_id', 'cur_descripcion', 'cur_es_sostenible'],
                order: [['cur_es_sostenible', 'DESC'], ['cur_id', 'ASC']], // Ordena los sostenibles primero
                raw: true, // Devuelve objetos planos
            });

            const actividades = await sequelize.query(
                `
                SELECT 
                    te.tpe_detalle AS tipo_evento,
                    SUM(CASE WHEN es.eve_por_estudiantes = TRUE THEN 1 ELSE 0 END) AS eventos_con_estudiantes,
                    SUM(CASE WHEN es.eve_por_estudiantes = FALSE THEN 1 ELSE 0 END) AS eventos_sin_estudiantes,
                    COUNT(*) AS total_eventos
                FROM 
                    gm_te_eventos_sostenibles es
                JOIN 
                    gm_te_tipos_evento te ON es.tpe_id = te.tpe_id
                WHERE 
                    es.camp_id = :campId
                GROUP BY 
                    te.tpe_detalle
                ORDER BY 
                    te.tpe_detalle;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const sitiosWeb = await sequelize.query(
                `
                SELECT 
                    sit_url AS enlace,
                    CASE 
                        WHEN sit_activo THEN 'Activo'
                        ELSE 'Inactivo'
                    END AS estado,
                    sit_es_reporte AS es_reporte
                FROM 
                    gm_te_sitios_web
                WHERE 
                    camp_id = :campId
                ORDER BY 
                    es_reporte DESC, enlace;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const sitiosReportes = sitiosWeb.filter(sitio => sitio.es_reporte);
            const sitiosNoReportes = sitiosWeb.filter(sitio => !sitio.es_reporte);

            const greenJobsGraduados = await sequelize.query(
                `
                SELECT 
                    jobs.job_detalle AS detalle_trabajo,
                    SUM(gra.gra_cantidad) AS cantidad_graduados,
                    SUM(SUM(gra.gra_cantidad)) OVER () AS total_graduados
                FROM 
                    gm_te_graduados_green_jobs gra
                JOIN 
                    gm_te_green_jobs jobs ON gra.job_id = jobs.job_id
                WHERE 
                    gra.camp_id = :campId
                GROUP BY 
                    jobs.job_detalle
                ORDER BY 
                    detalle_trabajo;
                `,
                {
                    replacements: { campId: camp_id },
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Renderizar la vista
            res.render("reportes/reporteCampus.ejs", {
                title: `Reporte General - Campus ${campus.camp_nom}`,
                campus,
                fondo,
                resultados,
                resumenEmisiones,
                emisiones,
                shuttles,
                totalShuttles: totalShuttles[0].total_shuttles,
                infraestructuras,
                total_cursos,
                total_cursos_sostenibles,
                porcentaje_sostenibilidad,
                cursosDetalles,
                actividades,
                sitiosReportes,
                sitiosNoReportes,
                greenJobsGraduados
            });
        } catch (error) {
            console.error("Error al generar el reporte del campus:", error);
            res.status(500).send("Hubo un error al generar el reporte del campus.");
        }
    },

    reporteTotal: async (req, res) => {
        try {
            // Consulta para obtener el resumen total de campus
            const campusResumen = await sequelize.query(
                `
                SELECT 
                    COUNT(camp.camp_id) AS total_campus,
                    STRING_AGG(camp.camp_nom, ', ') AS nombres_campus,
                    SUM(camp.camp_area) AS area_total,
                    SUM(camp.camp_capacidad) AS capacidad_total,
                    SUM(camp.camp_cant_pobla) AS poblacion_total,
                    CASE 
                        WHEN SUM(camp.camp_area) > 0 THEN ROUND(SUM(camp.camp_cant_pobla) / SUM(camp.camp_area)::NUMERIC, 2)
                        ELSE 0
                    END AS densidad_poblacion,
                    SUM(fon.fondo_total) AS fondos_totales,
                    SUM(fon.fondo_sostenibilidad) AS fondos_sostenibles,
                    CASE 
                        WHEN SUM(fon.fondo_total) > 0 THEN ROUND((SUM(fon.fondo_sostenibilidad) / SUM(fon.fondo_total))::NUMERIC * 100, 2)
                        ELSE 0
                    END AS relacion_fondos_sostenibles
                FROM 
                    gm_wsi_campus camp
                LEFT JOIN 
                    gm_te_fondos_investigacion fon ON camp.camp_id = fon.camp_id;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const vehiculosResumen = await sequelize.query(
                `
                SELECT 
                    tpv.tpv_detalle AS tipo_vehiculo,
                    fre.fre_detalle AS frecuencia,
                    SUM(veh.veh_cantidad) AS total_vehiculos,
                    AVG(veh.veh_distancia_aprox_recorrida) AS distancia_promedio
                FROM 
                    GM_TE_VEHICULOS veh
                JOIN 
                    GM_TE_TIPOS_VEHICULO tpv ON veh.tpv_id = tpv.tpv_id
                JOIN 
                    GM_TE_FRECUENCIAS fre ON veh.fre_id = fre.fre_id
                GROUP BY 
                    tpv.tpv_detalle, fre.fre_detalle
                ORDER BY 
                    tpv.tpv_detalle, fre.fre_detalle;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const resumenEmisiones = await sequelize.query(
                `
                SELECT 
                    tpe.tpe_detalle AS tipo_emision,
                    SUM(veh.veh_cantidad) AS total_vehiculos,
                    (SELECT SUM(c.camp_cant_pobla) FROM GM_WSI_CAMPUS c) AS poblacion_total, -- Población total consolidada
                    ROUND(CAST((SUM(veh.veh_cantidad)::NUMERIC / NULLIF((SELECT SUM(c.camp_cant_pobla) FROM GM_WSI_CAMPUS c), 0)) AS NUMERIC), 6) AS ratio_poblacion
                FROM 
                    GM_TE_VEHICULOS veh
                JOIN 
                    GM_TE_TIPOS_EMISION tpe ON veh.tpe_id = tpe.tpe_id
                GROUP BY 
                    tpe.tpe_detalle
                ORDER BY 
                    total_vehiculos DESC;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );


            const emisiones = await sequelize.query(
                `
                SELECT 
                    tpe.tpe_detalle AS tipo_emision,
                    fre.fre_detalle AS frecuencia,
                    SUM(veh.veh_cantidad) AS total_vehiculos
                FROM 
                    GM_TE_VEHICULOS veh
                JOIN 
                    GM_TE_TIPOS_EMISION tpe ON veh.tpe_id = tpe.tpe_id
                JOIN 
                    GM_TE_FRECUENCIAS fre ON veh.fre_id = fre.fre_id
                GROUP BY 
                    tpe.tpe_detalle, fre.fre_detalle
                ORDER BY 
                    tpe.tpe_detalle, fre.fre_detalle;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Consulta SQL cruda para obtener los shuttles globalmente
            const shuttles = await sequelize.query(
                `
    SELECT 
        s.sti_id,
        s.sti_descripcion,
        s.sti_prom_pasajeros,
        s.sti_tot_viajes_dia,
        te.tpe_detalle AS tipo_emision
    FROM 
        GM_TE_SHUTTLES s
    LEFT JOIN 
        GM_TE_TIPOS_EMISION te ON s.tpe_id = te.tpe_id;
    `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Consulta SQL cruda para el total de shuttles globalmente
            const totalShuttles = await sequelize.query(
                `
    SELECT 
        COUNT(*) AS total_shuttles
    FROM 
        GM_TE_SHUTTLES;
    `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const infraestructuras = await sequelize.query(
                `
                SELECT 
                    ti.tpi_detalle AS tipo_infraestructura,
                    COUNT(it.int_id) AS total_infraestructuras, -- Total por tipo
                    SUM(it.int_area) AS area_total_tipo,
                    (SELECT SUM(c.camp_area) FROM gm_wsi_campus c) AS area_total_campus, -- Área total consolidada
                    ROUND(CAST((SUM(it.int_area) / NULLIF((SELECT SUM(c.camp_area) FROM gm_wsi_campus c), 0)) * 100 AS NUMERIC), 2) AS porcentaje_campus
                FROM 
                    gm_te_infraestructuras_transpor it
                JOIN 
                    tipos_inf ti ON it.tpi_id = ti.tpi_id
                GROUP BY 
                    ti.tpi_detalle
                ORDER BY 
                    porcentaje_campus DESC;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const cursosResumen = await sequelize.query(
                `
                SELECT 
                    COUNT(*) AS total_cursos,
                    SUM(CASE WHEN cur_es_sostenible THEN 1 ELSE 0 END) AS total_cursos_sostenibles,
                    ROUND(
                        (CAST(SUM(CASE WHEN cur_es_sostenible THEN 1 ELSE 0 END) AS NUMERIC) / COUNT(*)) * 100, 
                        2
                    ) AS porcentaje_sostenibilidad
                FROM 
                    GM_TE_CURSOS;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            const actividades = await sequelize.query(
                `
                SELECT 
                    te.tpe_detalle AS tipo_evento,
                    SUM(CASE WHEN es.eve_por_estudiantes = TRUE THEN 1 ELSE 0 END) AS eventos_con_estudiantes,
                    SUM(CASE WHEN es.eve_por_estudiantes = FALSE THEN 1 ELSE 0 END) AS eventos_sin_estudiantes,
                    COUNT(*) AS total_eventos
                FROM 
                    gm_te_eventos_sostenibles es
                JOIN 
                    gm_te_tipos_evento te ON es.tpe_id = te.tpe_id
                GROUP BY 
                    te.tpe_detalle
                ORDER BY 
                    te.tpe_detalle;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );


            // Extraer resultados del resumen
            const { total_cursos, total_cursos_sostenibles, porcentaje_sostenibilidad } = cursosResumen[0];

            const cursosDetalles = await Curso.findAll({
                attributes: ['cur_id', 'cur_descripcion', 'cur_es_sostenible'], // Solo las columnas necesarias
                order: [['cur_es_sostenible', 'DESC'], ['cur_id', 'ASC']], // Ordena los sostenibles primero
                raw: true, // Devuelve objetos planos
            });

            const sitiosWeb = await sequelize.query(
                `
                SELECT 
                    sit_url AS enlace,
                    CASE 
                        WHEN sit_activo THEN 'Activo'
                        ELSE 'Inactivo'
                    END AS estado,
                    sit_es_reporte AS es_reporte
                FROM 
                    gm_te_sitios_web
                ORDER BY 
                    es_reporte DESC, enlace;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Separar los sitios por tipo
            const sitiosReportes = sitiosWeb.filter(sitio => sitio.es_reporte);
            const sitiosNoReportes = sitiosWeb.filter(sitio => !sitio.es_reporte);

            const greenJobsGraduados = await sequelize.query(
                `
                SELECT 
                    jobs.job_detalle AS detalle_trabajo,
                    SUM(gra.gra_cantidad) AS cantidad_graduados,
                    SUM(SUM(gra.gra_cantidad)) OVER () AS total_graduados
                FROM 
                    gm_te_graduados_green_jobs gra
                JOIN 
                    gm_te_green_jobs jobs ON gra.job_id = jobs.job_id
                GROUP BY 
                    jobs.job_detalle
                ORDER BY 
                    detalle_trabajo;
                `,
                {
                    type: sequelize.QueryTypes.SELECT,
                }
            );

            // Extraer resultados
            const {
                total_campus,
                nombres_campus,
                area_total,
                capacidad_total,
                poblacion_total,
                densidad_poblacion,
                fondos_totales,
                fondos_sostenibles,
                relacion_fondos_sostenibles,
            } = campusResumen[0];

            // Renderizar la vista
            res.render("reportes/reporteTotal.ejs", {
                title: "Reporte Total de Campus",
                total_campus,
                nombres_campus,
                area_total,
                capacidad_total,
                poblacion_total,
                densidad_poblacion,
                fondos_totales,
                fondos_sostenibles,
                relacion_fondos_sostenibles,
                vehiculosResumen,
                resumenEmisiones,
                emisiones,
                shuttles,
                totalShuttles: totalShuttles[0]?.total_shuttles || 0,
                infraestructuras,
                total_cursos,
                total_cursos_sostenibles,
                porcentaje_sostenibilidad,
                cursosDetalles,
                actividades,
                sitiosReportes,
                sitiosNoReportes,
                greenJobsGraduados,
            });
        } catch (error) {
            console.error("Error al generar el reporte total:", error);
            res.status(500).send("Hubo un error al generar el reporte total.");
        }
    },
};