import Campus from "../model/campus.model.js";
import SitioWeb from "../model/sitiosWeb.model.js";

export const sitiosWebController = {
    // *** Listar Sitios Web por Campus ***
    listarSitiosWeb: async (req, res) => {
        try {
            const { camp_id } = req.params;

            // Obtener los sitios web del campus especificado
            const sitiosWeb = await SitioWeb.findAll({
                where: { camp_id },
                include: [
                    { model: Campus, attributes: ["camp_id", "camp_nom"] },
                ],
                raw: true,
                nest: true,
            });

            res.render("sitiosWeb/gestionSitiosWeb.ejs", {
                sitiosWeb,
                currentCampus: camp_id,
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
            res.status(500).send("Error al eliminar el sitio web.");
        }
    },
};
