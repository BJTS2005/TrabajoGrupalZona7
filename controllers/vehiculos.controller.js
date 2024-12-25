import Campus from "../model/campus.model.js";
import modelos from "../model/vehiculos.model.js";
const { TipoVehiculo, TipoEmision, Frecuencia, Vehiculo } = modelos;

export const vehiculosController = {

    listarTiposEmision: async (req, res) => {
        try {
            const tpEmision = await TipoEmision.findAll({
                raw: true,
                nest: true,
            });
            res.render("vehiculos/tiposVehiculo.ejs", { tpEmision: tpEmision })
        } catch (error) {
            console.error("Error al obtener los tipos de emision:", error);
            res.status(500).send("Error al cargar la pagina");
        }
    },
    registrarTpEmision: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;

            // Crear el nuevo tipo de emisión
            await TipoEmision.create({
                tpe_id,
                tpe_detalle,
            });

            res.redirect('/vehiculos/tipos-emision');
        } catch (error) {
            console.error("Error al crear el tipo de emisión:", error);
            res.status(500).send("Error al registrar el tipo de emisión.");
        }
    },
    eliminarTpEmision: async (req, res) => {
        try {
            const tpEmi = await TipoEmision.findByPk(req.params.id);
            if (!tpEmi) return res.status(404).send("Tipo de Emision no encontrado");
            await tpEmi.destroy();
            res.redirect('/vehiculos/tipos-emision');
        } catch (error) {
            console.error("Error al eliminar este tipo de emision:", error);
            res.status(500).send("Error al eliminar este tipo de emision");
        }
    },
    actualizarTpEmision: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;

             //const t
        } catch (error) {
            
        }
    },
    actualizarTpEmision: async (req, res) => {
        try {
            const { tpe_id, tpe_detalle } = req.body;
    
            
            const tipoEmision = await TipoEmision.findByPk(tpe_id);
            if (!tipoEmision) {
                return res.status(404).send("Tipo de Emisión no encontrado.");
            }

            await tipoEmision.update({ tpe_detalle });
            
            res.redirect('/vehiculos/tipos-emision');
        } catch (error) {
            console.error("Error al actualizar el tipo de emisión:", error);
            res.status(500).send("Error al actualizar el tipo de emisión.");
        }
    }


};