import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
    task: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    _id: String
}, { _id: false });

const Todo = mongoose.models.Todo || mongoose.model('Todo', TodoSchema);

export default Todo;