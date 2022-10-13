import type {NextApiRequest, NextApiResponse} from 'next';
import md5 from 'md5';
import {DefaultResponseMsg} from '../../types/DefaultResponseMsg';
import { User } from '../../types/User';
import connectDB from '../../middlewares/connectDB';
import {UserModel} from '../../models/UserModel';

const handler = async(req : NextApiRequest, res : NextApiResponse<DefaultResponseMsg>) =>{
    try{
        if(req.method !== 'POST'){
            res.status(400).json({ error: 'Metodo solicitado nao existe '});
            return;
        }

        if(req.body){
            const user = req.body as User;
            if(!user.name || user.name.length < 3){
                res.status(400).json({ error: 'Nome do usuario invalido'});
                return;
            }

            if(!user.email || !user.email.includes('@') || !user.email.includes('.')
                || user.email.length < 4){
                res.status(400).json({ error: 'Email do usuario invalido'});
                return;
            }

            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            if(!strongRegex.test(user.password)){
                res.status(400).json({ error: 'Senha do usuario invalida'});
                return;
            }

            const existingUser = await UserModel.find({email : user.email});
            if(existingUser && existingUser.length > 0){
                res.status(400).json({ error: 'Ja existe usuario com o email informado'});
                return;
            }

            const final = {
                ...user,
                password : md5(user.password)
            }

            await UserModel.create(final);
            res.status(200).json({msg: 'Usuario adicionado com sucesso'});
            return;
        }

        res.status(400).json({error: 'Parametros de entrada invalidos'});
    }catch(e){
        console.log('Ocorreu erro ao criar usuario: ', e);
        res.status(500).json({ error: 'Ocorreu erro ao criar usuario, tente novamente '});
    }
}

export default connectDB(handler);