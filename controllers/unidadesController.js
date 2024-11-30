import Unidades from "../model/unidad.js";
import Magnitudes from "../model/magnitud.js";  

export const unidadesController = {

    getAll: async (req, res) => {
        try {
            const unidades = await Unidades.findAll({
                include: {
                    model: Magnitudes,
                    attributes: ['nombre'],
                },
                raw: true, 
            });
            console.log(unidades);
            res.render("unidades/unidades", { title: 'Unidades Registradas', datos: unidades });
        } catch (error) {
            console.error("Error al obtener las unidades:", error);
            res.status(500).send("Error al cargar las unidades");
        }
    },

    crear: async (req, res) => {
        try {
            const magnitudes = await Magnitudes.findAll({
                raw: true, 
            });
            res.render("unidades/crear", { magnitudes }); 
        } catch (error) {
            console.error("Error al obtener magnitudes para el formulario de creación:", error);
            res.status(500).send("Error al cargar las magnitudes");
        }
    },

    guardar: async (req, res) => {
        try {
            //console.log(req.body);
            const { nombre, simbolo, idMagnitud } = req.body;
            const nuevaUnidad = await Unidades.create({
                nombre,
                simbolo,
                idMagnitud,  
            });
            res.redirect('/unidades'); 
        } catch (error) {
            console.error("Error al crear unidad:", error);
            res.status(500).send("Error al crear unidad");
        }
    },

    eliminar: async (req, res) => {
        try {
            const unidad = await Unidades.findByPk(req.params.id);
            if (!unidad) return res.status(404).send("Unidad no encontrada");
            await unidad.destroy();
            res.redirect('/unidades');  
        } catch (error) {
            console.error("Error al eliminar unidad:", error);
            res.status(500).send("Error al eliminar unidad");
        }
    },

    editar: async (req, res) => {
        try {
            const unidad = await Unidades.findByPk(req.params.id, {
                raw: true,
            });
            const magnitudes = await Magnitudes.findAll({
                raw: true,
            });
            res.render('unidades/editar', { unidad, magnitudes });
        } catch (error) {
            console.error("Error al obtener la unidad para editar", error);
            res.status(500).send("Error al obtener unidad");
        }
    },

    actualizar: async (req, res) => {
        try {
            const id = req.body.id;
            const { nombre, simbolo, idMagnitud } = req.body;
            const unidad = await Unidades.findByPk(id);
            if (!unidad) return res.status(404).send("Unidad no encontrada");
            unidad.nombre = nombre;
            unidad.simbolo = simbolo;
            unidad.idMagnitud = idMagnitud;  
            await unidad.save();
            res.redirect('/unidades');
        } catch (error) {
            console.error("Error al actualizar unidad:", error);
            res.status(500).send("Error al actualizar unidad");
        }
    },
};
