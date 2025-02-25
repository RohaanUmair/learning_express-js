import express, { Request, Response } from "express";
import User from "../models/UserSchema";
import bcrypt from "bcrypt";
const jwt = require('jsonwebtoken');



const router = express.Router();


router.post('/signupUser', async (req: Request, res: Response) => {
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


router.post('/loginUser', async (req: Request, res: Response) => {
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



router.post('/logout', (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 0 });

    res.json({ message: 'Logged out' });
});


export default router;