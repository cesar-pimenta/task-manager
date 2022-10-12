import { connect } from 'http2';
import md5 from 'md5';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../middlewares/connectDB';
import { UserModel } from '../../models/UserModels';
import { DefaultResponseMsg } from '../../types/DefaultResponseMsg';

type cadastroRequest = {
    name : string,
    email : string,
    password : string,
}

const handler = async (req: NextApiRequest, res: NextApiResponse<DefaultResponseMsg>) => {

    try{

        if(req.method !== 'POST'){
            return res.status(405).json({error: 'Metodo solicitado não existe'})
        }
    
        const {body} = req;
        const dados = body as cadastroRequest;
        
        if(!dados.name || !dados.email || !dados.password){
            return res.status(400).json({error:'Favor preencher os campos'});
        }

        if(!dados.name || dados.name.length < 2){
            return res.status(400).json({error: 'Nome inválido'});
        }

        const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/;


        if (!emailRegex.test(dados.email)){
            return res.status(400).json({error:'email invalido'});
        }

        if(!passwordRegex.test(dados.password)){
            return res.status(400).json({error:'senha invalida'});
        }

        const existsUsers = await UserModel.find({email: dados.email});
        if(
            existsUsers && existsUsers.length > 0 
        ){
            return res.status(400).json({error: 'já existe'})
        }

        dados.password = md5(dados.password);

        await UserModel.create(dados)

        return res.status(200).json({msg:'login efetuado'});

    }catch(e: any){
        console.log('erro ao efetuar cadastro', e);
    }
}

export default connectDB(handler);