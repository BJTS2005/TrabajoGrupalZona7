
export const validateToken = (req, res, next) => {
    const {token} = req.cookies;

    if(!token){
         return res.status(401).json({message: "Acceso denegado"});
        }
    console.log("holiwiw");

    next();
}