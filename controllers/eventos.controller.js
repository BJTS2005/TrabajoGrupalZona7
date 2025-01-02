import Campus from "../model/campus.model.js";
import { EventoSostenible, TipoEvento } from "../model/eventos.model.js";

export const eventosController = {
    // *** Controladores para Tipos de Evento ***

    listarTiposEvento: async (req, res) => {
        try {
            const tiposEvento = await TipoEvento.findAll({
                raw: true,
                nest: true,
            });
            res.render("eventos/tiposEvento.ejs", { datos: tiposEvento });
        } catch (error) {
            console.error("Error al obtener los tipos de evento:", error);
            res.status(500).send("Error al cargar los tipos de evento.");
        }
    },

    registrarTipoEvento: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;

            await TipoEvento.create({
                tpe_id,
                tpe_detalle,
            });

            res.redirect("/eventos-sostenibles/tipos");
        } catch (error) {
            console.error("Error al registrar el tipo de evento:", error);
            res.status(500).send("Error al registrar el tipo de evento.");
        }
    },

    eliminarTipoEvento: async (req, res) => {
        try {
            const tipoEvento = await TipoEvento.findByPk(req.params.id);
            if (!tipoEvento) {
                return res.status(404).send("Tipo de evento no encontrado.");
            }

            await tipoEvento.destroy();
            res.redirect("/eventos-sostenibles/tipos");
        } catch (error) {
            console.error("Error al eliminar el tipo de evento:", error);
            res.status(500).send("Error al eliminar el tipo de evento.");
        }
    },

    actualizarTipoEvento: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;

            const tipoEvento = await TipoEvento.findByPk(tpe_id);
            if (!tipoEvento) {
                return res.status(404).send("Tipo de evento no encontrado.");
            }

            await tipoEvento.update({ tpe_detalle });
            res.redirect("/eventos-sostenibles/tipos");
        } catch (error) {
            console.error("Error al actualizar el tipo de evento:", error);
            res.status(500).send("Error al actualizar el tipo de evento.");
        }
    },

    listarEventos: async (req, res) => {
        try {
            const { camp_id } = req.params;
    
            const eventos = await EventoSostenible.findAll({
                where: { camp_id },
                include: [
                    { model: TipoEvento, attributes: ["tpe_id", "tpe_detalle"] },
                    { model: Campus, attributes: ["camp_id", "camp_nom"] },
                ],
                order: [['tpe_id', 'ASC']],
                raw: true,
                nest: true,
            });
    
            const tiposEvento = await TipoEvento.findAll({ raw: true });
            const campuses = await Campus.findAll({ raw: true });
    
            res.render("eventos/gestionEventos.ejs", {
                eventos,
                tiposEvento,
                campuses,
                currentCampus: camp_id || null,
            });
        } catch (error) {
            console.error("Error al listar los eventos:", error);
            res.status(500).send("Error al cargar los eventos.");
        }
    },
    
    registrarEvento: async (req, res) => {
        try {
            const { id_eve, tpe_id, eve_detalle, eve_fecha, eve_por_estudiantes, eve_url } = req.body;
            const { camp_id } = req.params;
    
            await EventoSostenible.create({
                id_eve,
                tpe_id,
                camp_id,
                eve_detalle,
                eve_fecha,
                eve_por_estudiantes: eve_por_estudiantes === "true", 
                eve_url, 
            });
    
            res.redirect(`/eventos-sostenibles/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar el evento:", error);
            res.status(500).send("Error al registrar el evento.");
        }
    },
    
    actualizarEvento: async (req, res) => {
        try {
            const { id_eve, tpe_id, eve_detalle, eve_fecha, eve_por_estudiantes, eve_url } = req.body;
            const { camp_id } = req.params;
    
            const evento = await EventoSostenible.findByPk(id_eve);
            if (!evento) {
                return res.status(404).send("Evento no encontrado.");
            }
    
            await evento.update({
                tpe_id,
                eve_detalle,
                eve_fecha,
                eve_por_estudiantes: eve_por_estudiantes === "true",
                eve_url, // Nuevo campo
            });
    
            res.redirect(`/eventos-sostenibles/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
            res.status(500).send("Error al actualizar el evento.");
        }
    },
    
    eliminarEvento: async (req, res) => {
        try {
            const { camp_id, id } = req.params;
    
            const evento = await EventoSostenible.findByPk(id);
            if (!evento) {
                return res.status(404).send("Evento no encontrado.");
            }
    
            await evento.destroy();
            res.redirect(`/eventos-sostenibles/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al eliminar el evento:", error);
            res.status(500).send("Error al eliminar el evento.");
        }
    },
};
