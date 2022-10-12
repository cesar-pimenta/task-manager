import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';

export const connectDB = (handler : NextApiHandler) => 
   async (req: NextApiRequest, res: NextApiResponse) => {
    
    console.log('verifica o stado da conexão ( 0 ) = offline ( 1 ) == conectado', mongoose.connections[0].readyState)
    if(mongoose.connections[0].readyState){
        return handler(req, res);
    }

    const {DB_CONNECTION_STRING} = process.env;
    
    if(!DB_CONNECTION_STRING){
       return res.status(500).json({erro:'erro de conection'})
    }

    mongoose.connection.on('connectes', () => console.log('conectado com sucess'));
    mongoose.connection.on('error', err => console.log('conectado com sucess'));

    await mongoose.connect(DB_CONNECTION_STRING);

    return handler(req, res);
   }