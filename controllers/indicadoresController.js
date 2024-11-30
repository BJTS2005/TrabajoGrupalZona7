import Indicadores from "../model/indicador.js";
import CategoriasIndicador from "../model/opcion.js";
import SubcomponentesIndicador from "../model/subcomponente_indicador.js";
import Magnitudes from "../model/magnitud.js"; 

export const indicadoresController = {

    getAll: async (req, res) => {
        try {
            const indicadores = await Indicadores.findAll({
                include: {
                    model: Magnitudes,
                    attributes: ['nombre'],
                },
                raw: true,
            });
            res.render("indicadores/indicadores", { title: 'Indicadores Registrados', datos: indicadores });
        } catch (error) {
            console.error("Error al obtener las magnitudes:", error);
            res.status(500).send("Error al cargar la página");
        }
    },
    crear: (req, res) => {
        res.render("indicadores/crear.ejs");
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

