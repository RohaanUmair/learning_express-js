import express, { Request, Response } from "express";
import Todo from "../models/TodoSchema";
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/addTodo', async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['jwt'];
        console.log(cookie)

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        console.log(claims)


        if (!claims) {
            res.status(401).json({ message: 'Unauthenticated' });
            return;
        }


        const { task, _id } = req.body;
        const newTask = new Todo({
            task,
            userId: claims._id,
            _id
        });
        await newTask.save();

        res.status(200).json({ message: "Task added successfully", task: newTask });
    } catch (error: any) {
        console.log(error);

        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get('/getTodo', async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies.jwt;
        console.log(cookie)

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        console.log(claims)


        if (!claims) {
            res.status(401).json({ message: 'Unauthenticated' });
            return;
        }

        const todos = await Todo.find({ userId: claims._id });
        res.status(201).json({ data: todos });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.delete('/delTodo', async (req: Request, res: Response) => {
    try {
        const { _id } = req.body;
        await Todo.findByIdAndDelete(_id);

        res.status(200).json({ mesage: 'Todo Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.put('/editTodo', async (req: Request, res: Response) => {
    try {
        const { _id, updatedTask } = req.body;
        await Todo.findByIdAndUpdate(_id, { task: updatedTask });

        res.json({ message: 'Todo Edited' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



export default router;