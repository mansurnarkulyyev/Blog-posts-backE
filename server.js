
import express from 'express'; // подключили экпресс

import mongoose from 'mongoose';

import multer from 'multer';

import cors from 'cors';

import fs from 'fs';

import { registerValidation,loginValidation, postCreateValidation, commentCreateValidation } from './validations/validations.js';

import {handleValidationErrors, checkAuth} from './utils/index.js';

import { UserController, PostController, CommentController  } from './controllers/imports.js';


const { MONGODB_URI, PORT=8888 } = process.env;
    mongoose
  .connect("mongodb+srv://admin:wwwwwww@cluster0.pvbvkjs.mongodb.net/?retryWrites=true&w=majority")
  .then(() => app.listen(PORT, () => console.log("Started ok")))
  .catch((err) => {
    console.log(err.message);
    process.exitCode = 1;
  });


const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if(!fs.existsSync('uploads')){
            fs.mkdirSync('uploads')
        }
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({storage})

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/comments', CommentController.getAllComments);
app.post('/comments', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.create);
app.delete('/comments/:id', checkAuth, CommentController.remove);
app.patch('/comments/:id', checkAuth, commentCreateValidation, handleValidationErrors, CommentController.update);

app.get('/tags', PostController.getLastTags);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts', PostController.getAll);

app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);



// app.listen( 8888, (err) => {
//     if (err) {
//         return console.log(err);
//     }
//     return console.log("Server OK!");
// });