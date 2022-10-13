import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import {DefaultResponseMsg} from '../types/DefaultResponseMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtValidator = (handler : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) => {

    const {MY_SECRET_KEY} = process.env;
    if(!MY_SECRET_KEY){
        return res.status(500).json({ error: 'ENV my secret key nao encontrada '});
    }

    if(!req || !req.headers){
        return res.status(400).json({ error: 'Nao foi possivel validar o token de acesso '});
    }

    if(req.method !== 'OPTIONS'){
        const authorization = req.headers['authorization'];
        if(!authorization){
            return res.status(401).json({ error: 'Nenhum token de acesso informado'});
        }

        const token = authorization.substr(7);
        if(!token){
            return res.status(401).json({ error: 'Nenhum token de acesso informado'});
        }

        try{
            const decoded = await jwt.verify(token, MY_SECRET_KEY) as JwtPayload;
            if(!decoded){
                return res.status(401).json({ error: 'Nao foi possivel validar o token'});
            }

            if(req.body){
                req.body.userId = decoded._id;
            }else if(req.query){
                req.query.userId = decoded._id;
            }
        }catch(e){
            console.log(e)
            return res.status(500).json({ error: 'Ocorreu erro ao tratar token JWT'});
        }
    }

    return handler(req, res);
}

export default jwtValidator;