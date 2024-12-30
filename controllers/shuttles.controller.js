import Shuttle from "../model/shuttle.model.js";
import Campus from "../model/campus.model.js";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;

export const shuttlesController = {

    listarShuttles: async (req, res) => {
        try {

            const { camp_id } = req.params;
            const condicion = camp_id ? { camp_id } : {};

            const shuttles = await Shuttle.findAll({
                where: condicion,
                include: [
                    { model: TipoEmision, attributes: ['tpe_id', 'tpe_detalle'] },
                ],
                raw: true,
                nest: true,
            });

            const tiposEmision = await TipoEmision.findAll({ raw: true });
            const campuses = await Campus.findAll({ raw: true });

            res.render('shuttles/gestionShuttles.ejs', {
                shuttles,
                tiposEmision,
                campuses,
                currentCampus: camp_id || null,
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
            res.status(500).send("Error al eliminar el servicio.");
        }
    },
};

