import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,  //required - объяхатеьный
        unique: true, //unique уникальный
    },
    passwordHash: {//passwordHash расшифрует пороль что бы ни кто не узнал 
        type: String,
        required: true,
    },
    avatarUrl: String,   // необъязательная свойства а если объект то объязательная 
}, {
    timestamps: true,  // создания дата 
},
);

export default mongoose.model('User', UserSchema);
