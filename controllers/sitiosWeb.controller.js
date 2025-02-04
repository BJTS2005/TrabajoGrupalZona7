import { Op } from "sequelize";
import Campus from "../model/campus.model.js";
import SitioWeb from "../model/sitiosWeb.model.js";


export const sitiosWebController = {
    // *** Listar Sitios Web por Campus ***
    listarSitiosWeb: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { estado, esReporte, busqueda, orderBy, orderDir } = req.query;

            // Condición inicial (filtro por campus)
            const condicion = camp_id ? { camp_id } : {};

            // Filtro por Estado
            if (estado !== undefined && estado !== "") {
                condicion.sit_activo = estado === "true";
            }

            // Filtro por Si es Reporte
            if (esReporte !== undefined && esReporte !== "") {
                condicion.sit_es_reporte = esReporte === "true";
            }

            // Filtro por Búsqueda en URL o Descripción
            if (busqueda) {
                condicion[Op.or] = [
                    { sit_url: { [Op.iLike]: `%${busqueda}%` } },
                    { sit_descripcion: { [Op.iLike]: `%${busqueda}%` } },
                ];
            }

            // Configuración del Orden
            const order = [];
            if (orderBy) {
                order.push([orderBy, orderDir || "ASC"]);
            }

            // Consultar sitios web con filtros aplicados
            const sitiosWeb = await SitioWeb.findAll({
                where: condicion,
                include: [
                    { model: Campus, attributes: ["camp_id", "camp_nom"] },
                ],
                order,
                raw: true,
                nest: true,
            });

            res.render("sitiosWeb/gestionSitiosWeb.ejs", {
                sitiosWeb,
                currentCampus: camp_id,
                estado,
                esReporte,
                busqueda,
                orderBy,
                orderDir,
            });
        } catch (error) {
            console.error("Error al listar los sitios web:", error);
            res.status(500).send("Error al cargar los sitios web.");
        }
    },

    // *** Registrar un Nuevo Sitio Web ***
    registrarSitioWeb: async (req, res) => {
        try {
            const { id_sit, sit_descripcion, sit_url, sit_activo, sit_es_reporte } = req.body;
            const { camp_id } = req.params;

            const sitioWebExistente = await SitioWeb.findByPk(id_sit);


            if (sitioWebExistente) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a otro sitio web" });

            await SitioWeb.create({
                id_sit,
                camp_id,
                sit_descripcion,
                sit_url,
                sit_activo: sit_activo === "true", // Convertir a booleano
                sit_es_reporte: sit_es_reporte === "true", // Convertir a booleano
            });

            res.redirect(`/sitiosWeb/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar el sitio web:", error);
            res.status(500).send("Error al registrar el sitio web.");
        }
    },

    // *** Actualizar un Sitio Web Existente ***
    actualizarSitioWeb: async (req, res) => {
        try {
            const { id_sit, sit_descripcion, sit_url, sit_activo, sit_es_reporte } = req.body;
            const { camp_id } = req.params;

            const sitioWeb = await SitioWeb.findByPk(id_sit);
            if (!sitioWeb) {
                return res.status(404).send("Sitio web no encontrado.");
            }

            await sitioWeb.update({
                sit_descripcion,
                sit_url,
                sit_activo: sit_activo === "true",
                sit_es_reporte: sit_es_reporte === "true",
            });

            res.redirect(`/sitiosWeb/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al actualizar el sitio web:", error);
            res.status(500).send("Error al actualizar el sitio web.");
        }
    },

    // *** Eliminar un Sitio Web ***
    eliminarSitioWeb: async (req, res) => {
        try {
            const { camp_id, id } = req.params;

            const sitioWeb = await SitioWeb.findByPk(id);
            if (!sitioWeb) {
                return res.status(404).send("Sitio web no encontrado.");
            }

            await sitioWeb.destroy();
            res.redirect(`/sitiosWeb/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al eliminar el sitio web:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este sitio web, ya que tiene datos asociados." });
        }
    },
};
