import express, { Request, Response } from "express";
import Todo from "./models/TodoSchema";
import { connectToDb } from "./lib/mongoDb";
import User from "./models/UserSchema";
const cors = require('cors');
import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



const app = express();
app.use(cors({
    origin: ['https://learning-express-js.vercel.app', 'http://localhost:3000'],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

async function connect() {
    try {
        await connectToDb();

        app.listen(3001, () => {
            console.log('Server is running');
        });
    } catch (error: any) {
        console.log(error)
    }
}
connect();


app.post('/addTodo', async (req: Request, res: Response) => {
    try {
        const cookie = req.cookies['jwt'];
        console.log(cookie)

        const claims = jwt.verify(cookie, process.env.JWT_SECRET);
        console.log(claims)


        if (!claims) {
            res.status(401).json({ message: 'Unauthenticated' });
            return;
        }


        const { task } = req.body;
        const newTask = new Todo({
            task,
            userId: claims._id
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
        const cookie = req.cookies['jwt'];
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
});




app.post('/signupUser', async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        if (username.length < 4) {
            res.status(400).json({ message: 'Username should be minimum of 4 characters' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid email" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password too short' });
            return;
        }


        const userExistence = await User.findOne({ email });
        if (userExistence) {
            res.status(400).json({ message: 'User with this Email already exists' });
            return;
        };



        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'Account Created Successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/loginUser', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ error: "Invalid email" });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ message: 'Password too short' });
            return;
        }


        const userExistence = await User.findOne({ email });

        if (!userExistence) {
            res.status(400).json({ message: 'User does not Exist' });
            return;
        }

        if (!await bcrypt.compare(password, userExistence.password)) {
            res.status(400).json({ message: 'Invalid Password' });
            return;
        }

        const token = jwt.sign({ _id: userExistence._id }, process.env.JWT_SECRET);

        res.cookie('jwt', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60
        });

        res.status(200).json({ message: 'Logged In Successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Sevrer Error' });
    }
});



app.post('/logout', (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 0 });

    res.json({ message: 'Logged out' });
});