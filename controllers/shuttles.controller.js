import { Op } from "sequelize";
import Shuttle from "../model/shuttle.model.js";
import Campus from "../model/campus.model.js";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;

export const shuttlesController = {

    listarShuttles: async (req, res) => {
        try {
            const { camp_id } = req.params;
            const { tipoEmision, orderBy, orderDir, fechaInicio, fechaFin } = req.query;

            // Condición inicial (por campus)
            const condicion = camp_id ? { camp_id } : {};

            // Filtro por Tipo de Emisión
            if (tipoEmision) {
                condicion.tpe_id = tipoEmision;
            }

            // Filtro por rango de fechas
            if (fechaInicio && fechaFin) {
                condicion.sti_fecha_registro = {
                    [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
                };
            }

            // Orden dinámico
            const order = [];
            if (orderBy) {
                order.push([orderBy, orderDir || "ASC"]);
            }

            // Obtener los shuttles con los filtros aplicados
            const shuttles = await Shuttle.findAll({
                where: condicion,
                include: [{ model: TipoEmision, attributes: ['tpe_id', 'tpe_detalle'] }],
                order,
                raw: true,
                nest: true,
            });

            // Datos auxiliares
            const tiposEmision = await TipoEmision.findAll({ raw: true });
            const campuses = await Campus.findAll({ raw: true });

            // Renderizar vista
            res.render('shuttles/gestionShuttles.ejs', {
                shuttles,
                tiposEmision,
                campuses,
                currentCampus: camp_id || null,
                tipoEmision,
                orderBy,
                orderDir,
                fechaInicio,
                fechaFin,
            });
        } catch (error) {
            console.error("Error al listar los servicios de transporte:", error);
            res.status(500).send("Error al cargar los servicios de transporte.");
        }
    },
    registrarShuttle: async (req, res) => {
        try {

            const { camp_id } = req.params;
            const { sti_id, tpe_id, sti_descripcion, sti_prom_pasajeros, sti_tot_viajes_dia } = req.body;

            const shuttleExistente = await Shuttle.findByPk(sti_id);

            if (shuttleExistente) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a un servicio de transporte" });

            await Shuttle.create({
                sti_id,
                tpe_id,
                camp_id,
                sti_descripcion,
                sti_prom_pasajeros,
                sti_tot_viajes_dia,
                sti_fecha_registro: new Date(),
            });

            res.redirect(`/shuttles/gestionar/${camp_id}`);
        } catch (error) {
            console.error("Error al registrar el servicio:", error);
            res.status(500).send("Error al registrar el servicio.");
        }
    },
    actualizarShuttle: async (req, res) => {

        try {
            const { camp_id } = req.params;
            const { sti_id, tpe_id, sti_descripcion, sti_prom_pasajeros, sti_tot_viajes_dia } = req.body;

            const shuttle = await Shuttle.findByPk(sti_id);

            if (!shuttle) {
                return res.status(404).send("Servicio de transporte no encontrado");
            }

            await shuttle.update({
                tpe_id,
                sti_descripcion,
                sti_prom_pasajeros,
                sti_tot_viajes_dia
            });

            res.redirect(`/shuttles/gestionar/${camp_id}`);

        } catch (error) {
            console.error("Error al actualizar el servicio de transporte:", error);
            res.status(500).send("Error al actualizar el servicio de transporte.");
        }
    },
    eliminarShuttle: async (req, res) => {
        try {
            const { camp_id, id } = req.params;

            const shuttle = await Shuttle.findByPk(id);
            if (!shuttle) {
                return res.status(404).send('Servicio de transporte no encontrado');
            }

            await shuttle.destroy();

            res.redirect(`/shuttles/gestionar/${camp_id}`);

        } catch (error) {
            console.error("Error al eliminar el servicio:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar este servicio de transporte, ya que tiene datos asociados." });
        }
    },
};

