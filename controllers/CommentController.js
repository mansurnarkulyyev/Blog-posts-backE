

import CommentModel from "../models/Comments.js"


export const getAllComments = async (req, res) => {
    try {
        const posts = await CommentModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve article',
        });
    }
};


export const remove = async (req, res) => {
    try {
        const postId = req.params.id;
        
        CommentModel.findOneAndDelete(
            {
                _id: postId,
            },
            (err,doc) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                    message: 'Failed to delete article',
                });
                }
                if (!doc) {
                     return res.status(404).json({
                        message: 'Article not found',
                    });
                }

                res.json({
                    success: true,
                }); 
            },
        );

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Failed to retrieve article',
        });
    }
};


export const create = async (req, res) => {//создание одну статьи 
    try {
        // const doc = new CommentModel({
        //     text: req.body.text,
        //     imageUrl: req.body.imageUrl,
        //     user: req.userId,
        // },);
        // const comment = await doc.save();

        // res.json(comment);
const response = await CommentModel.create({
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });
    res.status(201).json(response)
        
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create article',
        });
    }
};


export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await CommentModel.updateOne({
            _id: postId,
        }, {
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.userId,
        });

        res.json({
            success:true,
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update article',
        });
    }
}
