
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
    try {
     
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();
        
        const token = jwt.sign({
            _id: user._id,
        },
            'secret123',
            {
                expiresIn: '60d',// token перестанет быть валидным через 60 дней 
            },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to register',
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email} = req.body;
        const user = await UserModel.findOne({ email });
       
        if (!user) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }
        
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
         
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Invalid username or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '60d',// token перестанет быть валидным через 60 дней 
            },
        );
        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to login',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            })
        }

        const { passwordHash, ...userData } = user._doc;

        res.json({ userData });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'No access',
        });
    }
};
