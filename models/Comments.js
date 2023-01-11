import mongoose from "mongoose";

const CommentModel = new mongoose.Schema({
    text: {
        type: String,
        required: true,  
    },
    commentCount:  {
        type: Number,
        default:0,
    },
     user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true, 
    },
    imageUrl: String,   
}, {
   versionKey: false, timestamps: true,  
},
);

export default mongoose.model('Comment', CommentModel);
