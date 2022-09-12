 //req - хранится информации что присылал клиент  
//res - что я буду предавать клиенту 

import express from 'express'; // подключили экпресс

import mongoose from 'mongoose';

import multer from 'multer';

import cors from 'cors';

import { registerValidation,loginValidation, postCreateValidation } from './validations/validations.js';

import {handleValidationErrors, checkAuth} from './utils/index.js';

import { UserController, PostController  } from './controllers/imports.js';

mongoose.connect("mongodb+srv://Mansur:FRVIPW86c5pZwPNS@cluster0.iwyzd6b.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express();//вся логика хранится в переменной app

const storage = multer.diskStorage({
    destination: (_, __, cb) => {//cb callback
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


app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

app.get('/tags', PostController.getLastTags);
// app.get('/comments', PostController.getComments);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
// app.get('/posts/comments', PostController.getComments);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update);



app.listen(process.env.PORT || 8888, (err) => {//на какой порт нужен прикрепить наше приложении на ноджс, 
    //вторым параметром передаем фций не объяз, но  желательно. и мы передаем
    //что если сервер не запустился тогд а вернет ошибку предупрежедении
    // если все ок то ок 
    if (err) {
        return console.log(err);
    }
    return console.log("Server OK!");
});