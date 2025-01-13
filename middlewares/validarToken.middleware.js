
export const validateToken = (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
         return res.redirect('/inicio/login');
    }

    next();
}

export const estaAutenticado = (req, res, next) => {
    const {token} = req.cookies;

    if(token){
        console.log("Ya está autenticado");
         return res.redirect('/');
    }
    next();
}