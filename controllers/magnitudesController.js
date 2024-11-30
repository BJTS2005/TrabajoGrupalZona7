import Magnitudes from "../model/magnitud.js";

export const magnitudesController = {

    getAll: async (req, res) => {
        try {
            const magnitudes = await Magnitudes.findAll({
                raw: true,
                nest: true,
            });
            res.render("magnitudes/magnitudes", { title: 'Magnitudes Registradas', datos: magnitudes });
        } catch (error) {
            console.error("Error al obtener las magnitudes:", error);
            res.status(500).send("Error al cargar la página");
        }
    },
    crear: (req, res) => {
        res.render("magnitudes/crear");
    },
    guardar: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;
            const nuevaMagnitud = await Magnitudes.create({ nombre, descripcion });
            res.redirect('/magnitudes');
        } catch (error) {
            console.error("Error al crear magnitud:", error);
            res.status(500).send("Error al crear magnitud");
        }
    },
    eliminar: async (req, res) => {
        try {
            const magnitud = await Magnitudes.findByPk(req.params.id);
            if (!magnitud) return res.status(404).send("Magnitud no encontrada");
            await magnitud.destroy();
            res.redirect('/magnitudes');      
        } catch (error) {
            console.error("Error al eliminar magnitud:", error);
            res.status(500).send("Error al eliminar magnitud");
        }
    },
    editar: async (req, res) => {
        try {
            const magnitud = await Magnitudes.findByPk(req.params.id, {
                raw: true,
            });
            res.render('magnitudes/editar', {magnitud});
        } catch (error) {
            console.error("Error al obtener la magnitud", error);
            res.status(500).send("Error al obtener magnitud");
        }
    },
    actualizar: async (req, res) => {
        try {
            const id = req.body.id;
            const { nombre, descripcion } = req.body;
            const magnitud = await Magnitudes.findByPk(id);
            if (!magnitud) return res.status(404).send("Magnitud no encontrada");
            magnitud.nombre = nombre;
            magnitud.descripcion = descripcion;
            await magnitud.save();
             res.redirect('/magnitudes');
        } catch (error) {
            console.error("Error al actualizar magnitud:", error);
            res.status(500).send("Error al actualizar magnitud");
        }
       //console.log(req.body.id);
    },
    /*getById: async (req, res) => {
        try {
            const id = req.params.id;
            const magnitud = await Magnitudes.findByPk(id);
            if (!magnitud) return res.status(404).send("Magnitud no encontrada");
            res.json(magnitud); 
        } catch (error) {
            console.error("Error al obtener la magnitud:", error);
            res.status(500).send("Error al obtener la magnitud");
        }
    },*/
};
