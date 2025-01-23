import jwt from 'jsonwebtoken';


export const validateToken = (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
         return res.redirect('/inicio/login');
    }

    const decodificado = jwt.verify(token, "some secret key");

    res.locals.user = decodificado;

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

