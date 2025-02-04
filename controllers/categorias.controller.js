import Categoria from "../model/categorias.model.js";

export const categoriasController = {
    // Listar todas las categorías
    listar: async (req, res) => {
        try {
            const categorias = await Categoria.findAll({ raw: true, nest: true });
            res.render("categorias/listar.ejs", { title: "Gestión de Categorías", categorias });
        } catch (error) {
            console.error("Error al listar las categorías:", error);
            res.status(500).send("Error al cargar las categorías.");
        }
    },

    // Mostrar formulario para crear una categoría
    mostrarFormularioCrear: (req, res) => {
        res.render("categorias/crear", { title: "Registrar Categoría" });
    },

    // Guardar una nueva categoría
    guardar: async (req, res) => {
        try {
            const { cat_cod, cat_nombre, cat_porc } = req.body;

            const categoriaExistente = await Categoria.findByPk(cat_cod);

            if(categoriaExistente) return res.render("atraparErrores.ejs", { error: "Este id ya esta asociado a una categoria" });


            // Validar que el porcentaje sea un número válido
            if (cat_porc < 0 || cat_porc > 100) {
                return res.status(400).send("El porcentaje debe estar entre 0 y 100.");
            }

            // Crear la categoría
            await Categoria.create({ cat_cod, cat_nombre, cat_porc });
            res.redirect("/categorias");
        } catch (error) {
            console.error("Error al guardar la categoría:", error);
            res.render("atraparErrores.ejs", {error});
        }
    },

    // Mostrar formulario para editar una categoría
    mostrarFormularioEditar: async (req, res) => {
        try {
            const categoria = await Categoria.findByPk(req.params.id, { raw: true });
            if (!categoria) return res.status(404).send("Categoría no encontrada.");

            res.render("categorias/editar", { title: "Editar Categoría", categoria });
        } catch (error) {
            console.error("Error al obtener la categoría:", error);
            res.status(500).send("Error al cargar la categoría.");
        }
    },

    // Actualizar una categoría existente
    actualizar: async (req, res) => {
        try {
            const { cat_cod, cat_nombre, cat_porc } = req.body;

            // Validar que el porcentaje sea un número válido
            if (cat_porc < 0 || cat_porc > 100) {
                return res.status(400).send("El porcentaje debe estar entre 0 y 100.");
            }

            const categoria = await Categoria.findByPk(cat_cod);
            if (!categoria) return res.status(404).send("Categoría no encontrada.");

            await categoria.update({ cat_nombre, cat_porc });
            res.redirect("/categorias");
        } catch (error) {
            console.error("Error al actualizar la categoría:", error);
            res.status(500).send("Error al actualizar la categoría.");
        }
    },

    // Eliminar una categoría
    eliminar: async (req, res) => {
        try {
            const categoria = await Categoria.findByPk(req.params.id);
            if (!categoria) return res.status(404).send("Categoría no encontrada.");

            await categoria.destroy();
            res.redirect("/categorias");
        } catch (error) {
            console.error("Error al eliminar la categoría:", error);
            res.render("atraparErrores.ejs", { error: "No se puede eliminar esta categoría, ya que tiene datos asociados." });
        }
    },
};
