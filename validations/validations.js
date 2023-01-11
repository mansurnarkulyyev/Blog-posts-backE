import { body } from "express-validator";

export const loginValidation = [
    body('email','Invalid mail format').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
];   

export const registerValidation = [
    body('email','Invalid mail format').isEmail(),
    body('password','Password must be at least 5 characters').isLength({ min: 5 }),
    body('fullName','Write the name').isLength({ min: 3 }),
    body('avatarUrl','Wrong avatar link').optional().isURL(),
];   

export const postCreateValidation = [
    body('title','Enter article title').isLength({ min: 3 }).isString(),
    body('text','Enter the text of the article').isLength({ min: 3 }).isString(),
    body('tags','Invalid tag format (specify array)').optional().isString(),
    // body('comments','Invalid comment format ').optional().isString(),
    body('imageUrl','Invalid image link').optional().isString(),
];   

export const commentCreateValidation = [
    body('text','Enter the text of the article').isLength({ min: 3 }).isString(),
    // body('comments','Invalid comment format ').optional().isString(),
    body('imageUrl','Invalid image link').optional().isString(),
];   