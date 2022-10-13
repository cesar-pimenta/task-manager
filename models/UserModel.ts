import mongoose, {Schema} from 'mongoose';

const UserSchema = new Schema({
    name : { type : String, required: [true, '* Campo obrigatorio!']},
    email : { type : String, required: [true, '* Campo obrigatorio!']},
    password : { type : String, required: [true, '* Campo obrigatorio!']},
});

export const UserModel = mongoose.models.users || mongoose.model('users', UserSchema);