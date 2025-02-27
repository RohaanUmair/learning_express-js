import express from "express";
import { connectToDb } from "./lib/mongoDb";
const cors = require('cors');
const cookieParser = require('cookie-parser');
import authRoutes from './routes/auth';
import todosRoutes from './routes/todo';



const app = express();
app.use(cors({
    origin: 'https://learning-express-js.vercel.app',
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(authRoutes);
app.use(todosRoutes);


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
