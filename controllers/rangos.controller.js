import Rango from "../model/rangos.model.js";
import Indicador from "../model/indicadores.model.js";

export const rangosController = {
    listar: async (req, res) => {
        try {
            const { ind_cod } = req.params;
            const rangos = await Rango.findAll({
                where: { ind_cod },
                raw: true,
            });
            res.json(rangos); // Enviar los rangos como respuesta JSON
        } catch (error) {
            console.error("Error al listar los rangos:", error);
            res.status(500).send("Error al listar los rangos.");
        }
    },

    registrar: async (req, res) => {
        try {
            const { ind_cod, descripcion_ran, valor_ran, esta_seleccionado } = req.body;
    
            if (esta_seleccionado) {
                await Rango.update(
                    { esta_seleccionado: false },
                    { where: { ind_cod } }
                );
            }
       
            const nuevoRango = await Rango.create({
                ind_cod,
                descripcion_ran,
                valor_ran,
                esta_seleccionado: esta_seleccionado || false,
            });
            
            res.json({ success: true, rango: nuevoRango });
        } catch (error) {
            console.error("Error al registrar el rango:", error);     
            res.status(500).json({ success: false, error: "Error al registrar el rango" });
        }
    },
    

    actualizar: async (req, res) => {
        try {
            const { id_ran, descripcion_ran, valor_ran, esta_seleccionado, ind_cod } = req.body;
    
            if (esta_seleccionado) {
                await Rango.update({ esta_seleccionado: false }, { where: { ind_cod } });
            }
    
            await Rango.update(
                { descripcion_ran, valor_ran, esta_seleccionado },
                { where: { id_ran } }
            );
    
            res.json({ success: true });
        } catch (error) {
            console.error("Error al actualizar el rango:", error);
            res.status(500).json({ success: false });
        }
    },

    eliminar: async (req, res) => {
        try {
            const { id } = req.params;
            const rango = await Rango.findByPk(id);
            if (!rango) return res.status(404).send("Rango no encontrado.");
            const { ind_cod } = rango;

            await rango.destroy();
            res.redirect(`/indicadores/gestionar/${ind_cod}`);
        } catch (error) {
            console.error("Error al eliminar el rango:", error);
            res.status(500).send("Error al eliminar el rango.");
        }
    },

    seleccionar: async (req, res) => {
        try {
            const { id } = req.params;

            // Seleccionar un rango y desmarcar los demás
            const rango = await Rango.findByPk(id);
            if (!rango) return res.status(404).send("Rango no encontrado.");

            await Rango.update(
                { esta_seleccionado: false },
                { where: { ind_cod: rango.ind_cod } }
            );

            await rango.update({ esta_seleccionado: true });
            res.redirect(`/indicadores/gestionar/${rango.ind_cod}`);
        } catch (error) {
            console.error("Error al seleccionar el rango:", error);
            res.status(500).send("Error al seleccionar el rango.");
        }
    },
};
