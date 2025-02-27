import express, { NextFunction, Request, Response } from "express";
import User from "../models/UserSchema";
import bcrypt from 'bcryptjs';
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

        const accessToken = jwt.sign({ _id: userExistence._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' });
        const refreshToken = jwt.sign({ _id: userExistence._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '15m' });

        res.cookie("accessToken", accessToken, {
            maxAge: 300000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'none'
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 900000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });



        res.status(200).json({ Login: true, message: 'Logged In Successfully' });
    } catch (error) {
        res.status(500).json({ Login: false, error: 'Internal Server Error' });
    }
});



router.post('/logout', (req: Request, res: Response) => {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });

    res.json({ message: 'Logged out' });
});


export default router;