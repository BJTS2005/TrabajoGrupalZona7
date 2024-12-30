import Categoria from "../model/categorias.model.js";
import { MiembroUnidad } from "../model/miembros.model.js";
import Indicador from "../model/indicadores.model.js";
import RangoIndicador from "../model/rangos.model.js";



export const indicadoresController = {
    listar: async (req, res) => {
        try {
            const { cat_cod } = req.params; // Código de la categoría

            // Obtener los indicadores junto con los rangos seleccionados (si existen)
            const indicadores = await Indicador.findAll({
                where: { cat_cod },
                include: [
                    { model: Categoria, attributes: ['cat_nombre', 'cat_porc'] },
                    { model: MiembroUnidad, attributes: ['mie_nombres', 'mie_apellidos'] },
                    { 
                        model: RangoIndicador, 
                        attributes: ['valor_ran', 'descripcion_ran'], 
                        where: { esta_seleccionado: true }, 
                        required: false // Permitir indicadores sin rangos seleccionados
                    },
                ],
                order: [['ind_cod', 'ASC']],
                raw: true,
                nest: true,
            });

            console.log(indicadores);

            // Obtener la categoría para el título
            const categoria = await Categoria.findByPk(cat_cod, { raw: true });

            // Obtener los miembros para el formulario
            const miembros = await MiembroUnidad.findAll({
                attributes: ['mie_ci', 'mie_nombres', 'mie_apellidos'],
                raw: true,
            });

            // Renderizar la vista con los datos
            res.render("indicadores/listarIndicadores.ejs", {
                title: `Indicadores de ${categoria.cat_nombre}`,
                indicadores,
                categoria,
                miembros,
            });
        } catch (error) {
            console.error("Error al listar los indicadores:", error);
            res.status(500).send("Error al cargar los indicadores.");
        }
    },
    registrar: async (req, res) => {
        try {
            const { ind_cod, cat_cod, mie_ci, ind_nombre, ind_puntos } = req.body;

            // Validar si el indicador ya existe
            const indicadorExistente = await Indicador.findByPk(ind_cod);
            if (indicadorExistente) {
                return res.status(400).send("El indicador con este código ya existe.");
            }

            // Registrar el nuevo indicador
            await Indicador.create({
                ind_cod,
                cat_cod,
                mie_ci,
                ind_nombre,
                ind_puntos,
            });

            res.redirect(`/indicadores/gestionar/${cat_cod}`);
        } catch (error) {
            console.error("Error al registrar el indicador:", error);
            res.status(500).send("Error al registrar el indicador.");
        }
    },

    editar: async (req, res) => {
        try {
            const { ind_cod, ind_nombre, ind_puntos, mie_ci } = req.body;

            const indicador = await Indicador.findByPk(ind_cod);
            if (!indicador) {
                return res.status(404).send("Indicador no encontrado.");
            }

            // Actualizar el indicador
            await indicador.update({
                ind_nombre,
                ind_puntos,
                mie_ci,
            });

            res.redirect(`/indicadores/gestionar/${indicador.cat_cod}`);
        } catch (error) {
            console.error("Error al editar el indicador:", error);
            res.status(500).send("Error al actualizar el indicador.");
        }
    },

    eliminar: async (req, res) => {
        try {
            const { cat_cod, ind_cod } = req.params;

            const indicador = await Indicador.findByPk(ind_cod);
            if (!indicador) {
                return res.status(404).send("Indicador no encontrado.");
            }

            await indicador.destroy();

            res.redirect(`/indicadores/gestionar/${cat_cod}`);
        } catch (error) {
            console.error("Error al eliminar el indicador:", error);
            res.status(500).send("Error al eliminar el indicador.");
        }
    },

    obtenerDatosFormulario: async (req, res) => {
        try {
            const { cat_cod } = req.params;

            // Obtener datos auxiliares: miembros y categoría actual
            const miembros = await MiembroUnidad.findAll({
                attributes: ['mie_ci', 'mie_nombres', 'mie_apellidos'],
                raw: true,
            });

            const categoria = await Categoria.findByPk(cat_cod, { raw: true });

            res.json({ miembros, categoria });
        } catch (error) {
            console.error("Error al obtener los datos auxiliares:", error);
            res.status(500).send("Error al cargar los datos del formulario.");
        }
    },
};
