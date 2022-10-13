import mongoose, {Schema} from 'mongoose';

const TaskSchema = new Schema({
    name : {type: String, required: [true, '* Campo obrigatorio!']},
    userId : {type: String, required: [true, '* Campo obrigatorio!']},
    finishPrevisionDate : {type: Date, required: [true, '* Campo obrigatorio!']},
    finishDate : {type: Date},
});

export const TaskModel = mongoose.models.tasks || mongoose.model('tasks', TaskSchema);