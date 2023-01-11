
import express from 'express'; // подключили экпресс

import mongoose from 'mongoose';

import multer from 'multer';

import cors from 'cors';

import { registerValidation,loginValidation, postCreateValidation, commentCreateValidation } from './validations/validations.js';

import {handleValidationErrors, checkAuth} from './utils/index.js';

import { UserController, PostController, CommentController  } from './controllers/imports.js';

// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect("mongodb+srv://admin:wwwwwww@cluster0.pvbvkjs.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
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

// app.post('/auth/login', (req, res) => {//не обязательно указать auth можно вместо него писать users или вообше не указать а оставить логин 
//     const token = jwt.sign({
//         email: req.body.email,
//         fullName: 'Joe Dou',
//     }, 'secret123')
//     res.json({//когда делают пост запрос мы передаем жсон формат ответ ,можно что угодно писать можно писать запрос успешно отп
//         success: true,
//         token,
//     })
    
// });


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
// app.get('/posts/comments', PostController.getComments);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);



app.listen( 8888, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log("Server OK!");
});