import mongoose from "mongoose";

const PostModel = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,  //required - объяхатеьный
        unique: true, //unique уникальный
    },
    tags: {//passwordHash расшифрует пороль что бы ни кто не узнал 
        type: Array,
        default:[],
    },
    // comments: {
    //     type: String,
    //     default:[],
    // },
    viewsCount:  {//количество просмотров
        type: Number,
        default:0,
    },
     user: {//автор статьи который создал
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  //required - объяхатеьный
        required: true, //unique уникальный
    },
    imageUrl: String,   // необъязательная свойства а если объект то объязательная 
}, {
    timestamps: true,  // создания дата 
},
);

export default mongoose.model('Post', PostModel);
