const express = require('express');

const router = express.Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');



// ================= REGISTER =================
router.post('/register', async (req, res) => {

    try {

        const {
            fullName,
            email,
            password,
            phoneNumber
        } = req.body;

        // CHECK EMAIL
        const existingUser = await User.findOne({

            where: {
                email
            }

        });

        if (existingUser) {

            return res.status(400).json({
                message: 'Email already exists'
            });

        }

        // CREATE USER
        const user = await User.create({

            fullName,

            email,

            password,

            phoneNumber

        });

        res.status(201).json({

            message: 'Register successful',

            user

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




// ================= LOGIN =================
router.post('/login', async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // FIND USER
        const user = await User.findOne({

            where: {
                email
            }

        });

        if (!user) {

            return res.status(400).json({
                message: 'Invalid email'
            });

        }

        // CHECK PASSWORD
        const isMatch = await user.comparePassword(
            password
        );

        if (!isMatch) {

            return res.status(400).json({
                message: 'Invalid password'
            });

        }

        // CREATE TOKEN
        const token = jwt.sign(

            {
                id: user.id,
                role: user.role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: '7d'
            }

        );

        res.status(200).json({

            message: 'Login successful',

            token,

            user: {

                id: user.id,

                fullName: user.fullName,

                email: user.email,

                role: user.role

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;