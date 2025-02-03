export const perfilUsuarioController = {
    render: (req, res) => {
        res.render("usuario/perfilUsuario.ejs", { title: "Perfil de Usuario" });
    },
}