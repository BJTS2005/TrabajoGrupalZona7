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
};

