import md5 from 'md5';
import type {NextApiRequest, NextApiResponse} from 'next';
import { connectDB } from '../../middlewares/connectDB';
import { UserModel } from '../../models/UserModels';
import { DefaultResponseMsg } from '../../types/DefaultResponseMsg';
import jwt from 'jsonwebtoken';

type LoginRequest = {
    login: string,
    password: string
}

const handler = async (req : NextApiRequest, res: NextApiResponse<DefaultResponseMsg | any>) =>{
    try{
        if(req.method !== 'POST'){
            return res.status(405).json({error: 'Metodo solicitado não existe'});
        }

        const {JWT_SECRET} = process.env;
        if(!JWT_SECRET){
            return res.status(500).json({error: 'Env jwt não informada'});
        }

        const {body} = req;
        const dados = body as LoginRequest;

        if(!dados.login || !dados.password){
            return res.status(400).json({error: 'Favor preencher os campos'});
        }

        const existsUsers = await UserModel.find({email: dados.login, password: md5(dados.password)});
        if(existsUsers && existsUsers.length > 0){
            const user = existsUsers[0];
            const token = jwt.sign({_id : user._id}, JWT_SECRET);
            return res.status(200).json({name: user.name, email: user.email, token});
        }
        return res.status(400).json({error : 'Login e senha não conferem'});
    }catch(e : any){
        console.log('Erro ao efetuar cadastro:', e);
        return res.status(500).json({error: 'Ocorreu erro ao cadastrar, tente novamente!'});
    }
}

export default connectDB(handler);