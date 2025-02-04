import Campus from "../model/campus.model.js";
import { InfraestructuraTransporte, TipoInfraestructura } from "../model/infraestructuraTransporte.model.js";
import { Op } from "sequelize";

export const infraestructurasController = {
    // Listar tipos de infraestructura
    listarTiposInfraestructura: async (req, res) => {
        try {
            const tiposInfraestructura = await TipoInfraestructura.findAll({
                raw: true,
                nest: true,
            });
            res.render("infraTrans/tiposInfraestructura.ejs", { datos: tiposInfraestructura });
        } catch (error) {
            console.error("Error al obtener los tipos de infraestructura:", error);
            res.status(500).send("Error al cargar la página.");
        }
    },

    // Registrar un tipo de infraestructura
    registrarTipoInfraestructura: async (req, res) => {
        try {
            const { tpi_id, tpi_detalle } = req.body;

            const existe = await TipoInfraestructura.findByPk(tpi_id);

            if (existe) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a un tipo de infraestructura" });

            await TipoInfraestructura.create({
                tpi_id,
                tpi_detalle,
            });

            res.redirect('/infra-transporte/tipos');
        } catch (error) {
            console.error("Error al registrar el tipo de infraestructura:", error);
            res.status(500).send("Error al registrar el tipo de infraestructura.");
        }
    },

    // Eliminar un tipo de infraestructura
    eliminarTipoInfraestructura: async (req, res) => {
        try {
            const tipoInfraestructura = await TipoInfraestructura.findByPk(req.params.id);
            if (!tipoInfraestructura) return res.status(404).send("Tipo de infraestructura no encontrado.");
            await tipoInfraestructura.destroy();
            res.redirect('/infra-transporte/tipos');
        } catch (error) {
            console.error("Error al eliminar el tipo de infraestructura:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este tipo de infraestructura, ya que tiene datos asociados." });
        }
    },

    // Actualizar un tipo de infraestructura
    actualizarTipoInfraestructura: async (req, res) => {
        try {
            const { tpi_id, tpi_detalle } = req.body;

            const tipoInfraestructura = await TipoInfraestructura.findByPk(tpi_id);
            if (!tipoInfraestructura) {
                return res.status(404).send("Tipo de infraestructura no encontrado.");
            }

            await tipoInfraestructura.update({ tpi_detalle });
            res.redirect('/infra-transporte/tipos');
        } catch (error) {
            console.error("Error al actualizar el tipo de infraestructura:", error);
            res.status(500).send("Error al actualizar el tipo de infraestructura.");
        }
    },

    // Listar infraestructuras de transporte
    listarInfraestructuras: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { tipoInfraestructura, orderBy, orderDir, fechaInicio, fechaFin } = req.query;

            // Condición inicial (por campus)
            const condicion = camp_id ? { camp_id } : {};

            // Filtro por Tipo de Infraestructura
            if (tipoInfraestructura) {
                condicion.tpi_id = tipoInfraestructura;
            }

            // Filtro por Rango de Fechas
            if (fechaInicio && fechaFin) {
                condicion.int_fecha_registro = {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
                };
            }

            // Configuración del Orden
            const order = [];
            if (orderBy) {
                order.push([orderBy, orderDir || "ASC"]);
            }

            // Obtener infraestructuras con filtros aplicados
            const infraestructuras = await InfraestructuraTransporte.findAll({
                where: condicion,
                include: [
                    { model: TipoInfraestructura, attributes: ["tpi_id", "tpi_detalle"] },
                    { model: Campus, attributes: ["camp_id", "camp_nom"] },
                ],
                order,
                raw: true,
                nest: true,
            });

            // Consultar datos auxiliares
            const tiposInfraestructura = await TipoInfraestructura.findAll({ raw: true });
            const campuses = await Campus.findAll({ raw: true });

            // Renderizar vista
            res.render("infraTrans/gestionInfraestructuras.ejs", {
                infraestructuras,
                tiposInfraestructura,
                campuses,
                currentCampus: camp_id || null,
                tipoInfraestructura,
                orderBy,
                orderDir,
                fechaInicio,
                fechaFin,
            });
        } catch (error) {
            console.error("Error al listar las infraestructuras:", error);
            res.status(500).send("Error al cargar las infraestructuras.");
        }
    },

    // Registrar una infraestructura de transporte
    registrarInfraestructura: async (req, res) => {
        try {
            const { int_id, int_detalle, tpi_id, int_ubicacion, int_area } = req.body;
            const { camp_id } = req.params;

            const existe = await InfraestructuraTransporte.findByPk(int_id);

            if (existe) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a una infraestructura" });

            await InfraestructuraTransporte.create({
                int_id,
                int_detalle,
                camp_id,
                tpi_id,
                int_ubicacion,
                int_area,
                int_fecha_registro: new Date(),
            });

            res.redirect(`/infra-transporte/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar la infraestructura:", error);
            res.status(500).send("Error al registrar la infraestructura.");
        }
    },

    // Actualizar una infraestructura de transporte
    actualizarInfraestructura: async (req, res) => {
        try {
            const { int_id, int_detalle, tpi_id, int_ubicacion, int_area } = req.body;
            const { camp_id } = req.params;

            const infraestructura = await InfraestructuraTransporte.findByPk(int_id);
            if (!infraestructura) {
                return res.status(404).send("Infraestructura no encontrada.");
            }

            await infraestructura.update({
                int_detalle,
                tpi_id,
                int_ubicacion,
                int_area,
            });

            res.redirect(`/infra-transporte/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al actualizar la infraestructura:", error);
            res.status(500).send("Error al actualizar la infraestructura.");
        }
    },

    // Eliminar una infraestructura de transporte
    eliminarInfraestructura: async (req, res) => {
        try {
            const { camp_id, id } = req.params;

            const infraestructura = await InfraestructuraTransporte.findByPk(id);
            if (!infraestructura) {
                return res.status(404).send("Infraestructura no encontrada.");
            }

            await infraestructura.destroy();
            res.redirect(`/infra-transporte/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al eliminar la infraestructura:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar esta infraestructura, ya que tiene datos asociados." });
        }
    },
};
