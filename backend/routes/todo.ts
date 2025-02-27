import express, { NextFunction, Request, Response } from "express";
import Todo from "../models/TodoSchema";
const jwt = require('jsonwebtoken');

const router = express.Router();


router.get('/protected-route', verifyUser, (req: Request, res: Response) => {
    res.json({ message: 'You are authenticated!' });
});

router.post('/addTodo', async (req: Request, res: Response) => {
    console.log('ADD TODO')
    try {
        const cookie = await req.cookies.accessToken;
        console.log('cookie', cookie);

        const claims = jwt.verify(cookie, process.env.JWT_ACCESS_SECRET);
        console.log(claims);


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
        console.log('error', error);

        res.status(500).json({ message: "Internal Server Error" });
    }
});



router.get('/getTodo', async (req: Request, res: Response) => {
    console.log('GET TODO')
    try {
        const cookie = await req.cookies.accessToken;
        console.log(cookie)

        const claims = jwt.verify(cookie, process.env.JWT_ACCESS_SECRET);
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
    console.log('DEL TODO')
    try {
        const { _id } = req.body;
        await Todo.findByIdAndDelete(_id);

        res.status(200).json({ mesage: 'Todo Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})



router.put('/editTodo', async (req: Request, res: Response) => {
    console.log('EDIT TODO')
    try {
        const { _id, updatedTask } = req.body;
        await Todo.findByIdAndUpdate(_id, { task: updatedTask });

        res.json({ message: 'Todo Edited' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



function verifyUser(req: Request, res: Response, next: NextFunction) {
    let accessToken = req.cookies.accessToken;

    if (!accessToken) {
        if (renewToken(req, res)) {
            (req as any).accessToken = req.cookies.accessToken;
            next();
        } else {
            res.status(401).json({ message: 'No Token Found' });
            return;
        }
    } else {
        const claims = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

        if (!claims) {
            res.status(401).json({ message: 'Invalid Token' });
            return;
        } else {
            (req as any)._id = claims._id;
            next();
        }
    }
}

function renewToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;
    let exist = false;

    if (!refreshToken) {
        return false;
    } else {
        const claims = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        if (!claims) {
            res.status(401).json({ message: 'Invalid Token' });
            return;
        } else {
            const accessToken = jwt.sign({ _id: claims._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' });
            const refreshToken = jwt.sign({ _id: claims._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '15m' });


            res.cookie("accessToken", accessToken, {
                maxAge: 300000,
                httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,
                sameSite: "none",
            });
    
            res.cookie("refreshToken", refreshToken, {
                maxAge: 900000,
                httpOnly: true,
                // httpOnly: true,
                // secure: process.env.NODE_ENV === "production",
                secure: true,
                sameSite: "none",
            });

            exist = true;
        }
    }
    return exist;
}



export default router;