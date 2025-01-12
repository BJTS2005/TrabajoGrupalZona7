import jwt from 'jsonwebtoken';

export function createToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(payload,
            'some secret key',
            {
                expiresIn: '1d'
            },
            (err, token) => {
                if(err) reject(err);
                resolve(token);
            }
        )
    });
};