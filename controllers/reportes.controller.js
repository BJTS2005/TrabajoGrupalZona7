import { Sequelize } from "sequelize";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;
import Campus from "../model/campus.model.js";
import sequelize from "../config/conexion.js";
import FondoInvestigacion from "../model/fondosInvestigacion.model.js";

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
                    SUM(veh.veh_cantidad) AS total_vehiculos
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

            // Renderizar la vista
            res.render("reportes/reporteCampus", {
                title: `Reporte de Vehículos - Campus ${camp_id}`,
                campus,
                fondo,
                resultados,
            });
        } catch (error) {
            console.error("Error al generar el reporte del campus:", error);
            res.status(500).send("Hubo un error al generar el reporte del campus.");
        }
    },
};