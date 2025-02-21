import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Todo from "./models/TodoSchema";
import { connectToDb } from "./lib/mongoDb";
const cors = require('cors');


const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type"
}));
app.use(express.json());

async function connect() {
    try {
        await connectToDb();

        app.listen(3001, () => {
            console.log('Server is running')
        });
    } catch (error: any) {
        console.log(error)
    }
}
connect();


app.post('/addTodo', async (req: Request, res: Response) => {
    try {
        const { task } = req.body;
        const newTask = new Todo({
            task
        });
        await newTask.save();

        res.status(200).json({ message: "Task added successfully", task: newTask });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



app.get('/getTodo', async (req: Request, res: Response) => {
    try {
        const todos = await Todo.find({});
        res.status(201).json({ data: todos });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.delete('/delTodo', async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        await Todo.findByIdAndDelete(_id);  

        res.status(200).json({ mesage: 'Todo Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



app.put('/editTodo', async (req: Request, res: Response) => {
    try {
        const { _id, updatedTask } = req.body;
        await Todo.findByIdAndUpdate(_id, { task: updatedTask });

        res.json({ message: 'Todo Edited' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})