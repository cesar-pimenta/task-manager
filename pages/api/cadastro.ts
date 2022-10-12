import { connect } from 'http2';
import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB } from '../../middlewares/connectDB';

type cadastroRequest = {
    email : string,
    password : string,
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {

    try{

        if(req.method !== 'POST'){
            return res.status(405).json({erro: 'Metodo solicitado não existe'})
        }
    
        const {body} = req;
        const dados = body as cadastroRequest;

        if(!dados.email || !dados.password){
            return res.status(400).json({erro:'Favor preencher os campos'});
        }

        const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/;

        if (!emailRegex.test(dados.email)){
            return res.status(400).json({erro:'email invalido'});
        }

        if(!passwordRegex.test(dados.password)){
            return res.status(400).json({erro:'senha invalida'});
        }

        return res.status(200).json({sucess:'login efetuado'});

    }catch(e: any){
        console.log('erro ao efetuar cadastro', e);
    }
}

export default connectDB(handler);