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

            // Renderizar la vista
            res.render("reportes/reporteCampus", {
                title: `Reporte de Vehículos - Campus ${campus.camp_nom}`,
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
            });
        } catch (error) {
            console.error("Error al generar el reporte del campus:", error);
            res.status(500).send("Hubo un error al generar el reporte del campus.");
        }
    },
};