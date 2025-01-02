import Categoria from "../model/categorias.model.js";
import Indicador from "../model/indicadores.model.js";
import RangoIndicador from "../model/rangos.model.js";

export const reporteCategoriaController = {
    listarCategorias: async (req, res) => {
        try {
            // Obtener todas las categorías con indicadores asociados
            const categorias = await Categoria.findAll({
                include: [
                    {
                        model: Indicador,
                        attributes: ['ind_puntos'],
                    },
                ],
            });

            // Procesar las categorías para calcular totales
            const datosCategorias = categorias.map(categoria => {
                const indicadores = categoria.Indicadors || [];
                const totalIndicadores = indicadores.length;
                const puntajeMaximo = indicadores.reduce((acc, ind) => acc + ind.ind_puntos, 0);

                return {
                    codigo: categoria.cat_cod,
                    nombre: categoria.cat_nombre,
                    totalIndicadores,
                    puntajeMaximo,
                };
            });

            // Renderizar la vista con los datos
            res.render("reportes/listarCategorias.ejs", {
                title: "Reporte de Categorías",
                categorias: datosCategorias,
            });
        } catch (error) {
            console.error("Error al listar las categorías:", error);
            res.status(500).send("Error al listar las categorías.");
        }
    },
    reporteCategoria: async (req, res) => {
        try {
            const { cat_cod } = req.params;

            // Obtener la categoría
            const categoria = await Categoria.findByPk(cat_cod, {
                include: [
                    {
                        model: Indicador,
                        include: [
                            {
                                model: RangoIndicador,
                            },
                        ],
                        attributes: ['ind_cod', 'ind_nombre', 'ind_puntos'],
                    },
                ],
            });

            if (!categoria) {
                return res.status(404).send("Categoría no encontrada.");
            }

            // Inicializar puntaje total obtenido
            let puntajeObtenidoTotal = 0;

            // Procesar los indicadores y calcular el puntaje obtenido
            const indicadores = categoria.Indicadors.map(indicador => {
                // Buscar el rango seleccionado
                const rangoSeleccionado = indicador.RangoIndicadors.find(rango => rango.esta_seleccionado);

                // Calcular el puntaje obtenido para este indicador
                const puntajeObtenido = rangoSeleccionado
                    ? (indicador.ind_puntos * rangoSeleccionado.valor_ran) / 100
                    : 0;

                // Acumular el puntaje obtenido en el total
                puntajeObtenidoTotal += puntajeObtenido;

                // Ordenar los rangos asociados por sus valores (ascendente)
                const rangosOrdenados = [...indicador.RangoIndicadors].sort((a, b) => a.valor_ran - b.valor_ran);

                return {
                    codigo: indicador.ind_cod,
                    nombre: indicador.ind_nombre,
                    puntajeMaximo: indicador.ind_puntos,
                    puntajeObtenido: puntajeObtenido.toFixed(2), // Redondear a dos decimales
                    rangos: rangosOrdenados,
                };
            });

            // Ordenar los indicadores por su código (ascendente)
            const indicadoresOrdenados = indicadores.sort((a, b) => a.codigo.localeCompare(b.codigo));

            // Renderizar la vista con los datos
            res.render("reportes/reporteCategoria.ejs", {
                title: `Reporte de Categoría: ${categoria.cat_nombre}`,
                categoria: {
                    nombre: categoria.cat_nombre,
                    totalIndicadores: categoria.Indicadors.length,
                    puntajeMaximo: categoria.Indicadors.reduce((acc, ind) => acc + ind.ind_puntos, 0),
                    puntajeObtenido: puntajeObtenidoTotal.toFixed(2), // Redondear a dos decimales
                },
                indicadores: indicadoresOrdenados,
            });
        } catch (error) {
            console.error("Error al generar el reporte de la categoría:", error);
            res.status(500).send("Error al generar el reporte.");
        }
    },
};
