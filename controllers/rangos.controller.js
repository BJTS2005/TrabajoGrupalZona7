import Rango from "../model/rangos.model.js";
import Indicador from "../model/indicadores.model.js";
import { MiembroUnidad } from "../model/miembros.model.js";
import Usuario from "../model/usuario.model.js";

export const rangosController = {
    listar: async (req, res) => {
        try {
            const { cat_cod, ind_cod } = req.params;

            // Obtener rangos ordenados por valor de forma ascendente
            const rangos = await Rango.findAll({
                where: { ind_cod },
                order: [['valor_ran', 'ASC']], // Orden ascendente por valor_ran
                raw: true,
            });

            // Obtener detalles del indicador junto con el miembro responsable
            const indicador = await Indicador.findOne({
                where: { ind_cod },
                include: [
                    { model: Usuario, attributes: ['user_nombre', 'user_apellido'] },
                ],
                raw: true,
                nest: true,
            });

            // Calcular el puntaje asignado para cada rango
            const totalPuntos = indicador.ind_puntos; // Puntos totales del indicador
            const rangosConPuntaje = rangos.map((rango, index) => {
                const porcentaje = rango.valor_ran; // El porcentaje es el valor del rango
                const puntajeAsignado = (totalPuntos * porcentaje) / 100; // Puntaje proporcional
                return {
                    ...rango,
                    puntajeAsignado: puntajeAsignado.toFixed(2), // Formatear a 2 decimales
                };
            });

            // Obtener el rango seleccionado
            const rangoSeleccionado = rangosConPuntaje.find(rango => rango.esta_seleccionado);

            res.render("rangos/listarRangos.ejs", {
                title: `Rangos de ${indicador.ind_nombre}`,
                rangos: rangosConPuntaje,
                rangoSeleccionado,
                indicador,
                cat_cod,
            });
        } catch (error) {
            console.error("Error al listar los rangos:", error);
            res.status(500).send("Error al listar los rangos.");
        }
    },

    registrar: async (req, res) => {
        try {
            const { ind_cod, cat_cod, descripcion_ran, valor_ran, esta_seleccionado } = req.body;
            console.log(req.body);
            if (esta_seleccionado) {
                await Rango.update(
                    { esta_seleccionado: false },
                    { where: { ind_cod } }
                );
            }

            await Rango.create({
                ind_cod,
                descripcion_ran,
                valor_ran,
                esta_seleccionado: esta_seleccionado || false,
            });

            res.redirect(`/indicadores/${cat_cod}/rangos/listar/${ind_cod}`);
        } catch (error) {
            console.error("Error al registrar el rango:", error);
            res.status(500).send("Error al registrar el rango");
        }
    },


    actualizar: async (req, res) => {
        try {
            const { id_ran, ind_cod, cat_cod, descripcion_ran, valor_ran, esta_seleccionado } = req.body;

            if (esta_seleccionado) {
                await Rango.update(
                    { esta_seleccionado: false },
                    { where: { ind_cod } }
                );
            }

            await Rango.update(
                {
                    descripcion_ran,
                    valor_ran,
                    esta_seleccionado: esta_seleccionado || false,
                },
                { where: { id_ran } }
            );

            // Redirigir a la lista de rangos del indicador
            res.redirect(`/indicadores/${cat_cod}/rangos/listar/${ind_cod}`);
        } catch (error) {
            console.error("Error al editar el rango:", error);
            res.status(500).send("Error al editar el rango");
        }
    },

    eliminar: async (req, res) => {
        try {
            const { cat_cod, ind_cod, id } = req.params;
            const rango = await Rango.findByPk(id);
            if (!rango) return res.status(404).send("Rango no encontrado.");


            await rango.destroy();
            res.redirect(`/indicadores/${cat_cod}/rangos/listar/${ind_cod}`);
        } catch (error) {
            console.error("Error al eliminar el rango:", error);
            res.status(500).send("Error al eliminar el rango.");
        }
    },

    seleccionar: async (req, res) => {
        try {
            const { id } = req.params;
            const { cat_cod } = req.body;
            const rango = await Rango.findByPk(id);

            if (!rango) return res.status(404).send("Rango no encontrado.");

            const ind_cod = rango.ind_cod;

            await Rango.update(
                { esta_seleccionado: false },
                { where: { ind_cod } }
            );

            await rango.update({ esta_seleccionado: true });
            res.redirect(`/indicadores/${cat_cod}/rangos/listar/${ind_cod}`);
        } catch (error) {
            console.error("Error al seleccionar el rango:", error);
            res.status(500).send("Error al seleccionar el rango.");
        }
    },
};
