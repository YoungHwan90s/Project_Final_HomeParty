import Joi from 'joi';

export const createUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    nickname: Joi.string().min(2).max(20).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-z0-9]*$')).required(),
    passwordCheck: Joi.ref('password'),
    phone: Joi.string().length(11).pattern(new RegExp('^[0-9]*$')),
});

// login
const userLoginDataValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string(),
});

// get user id
const getUserIdDataValidate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
});

// update password
const userUpdatePasswordDataValidate = Joi.object({
    id: Joi.number().required(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-z0-9]*$')).required(),
    passwordCheck: Joi.ref('password'),
});

// get email
const userGetEmailDataValidate = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
});

// page
const pageValidate = Joi.object({
    page: Joi.number().required(),
});

// search by email
const searchByEmailValidate = Joi.object({
    email: Joi.string().email().required(),
});

// delete user
const deleteByIdEmailValidate = Joi.object({
    id: Joi.number().required(),
    email: Joi.string().email().required(),
});

// update user
const userUpdateDataValidate = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().min(3).max(30).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    nickname: Joi.string().min(2).max(20).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().length(11).pattern(new RegExp('^[0-9]*$')),
    point: Joi.number().required(),
});

// create item
const createItemDataValidate = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    level: Joi.number().required(),
    stock: Joi.number().min(0).required(),
    image: Joi.string().required(),
});

// delete item
const deleteItemDataValidate = Joi.object({
    itemId: Joi.number().required(),
});

// update item
const updateItemDataValidate = Joi.object({
    itemId: Joi.number().required(),
    name: Joi.string().required(),
    price: Joi.number().min(0).required(),
    level: Joi.number().required(),
    stock: Joi.number().min(0).required(),
    image: Joi.string().required(),
});

// search item
const searchItemDataValidate = Joi.object({
    name: Joi.string().required(),
});

// delete user
const deleteUserDataValidate = Joi.object({
    id: Joi.number().required(),
});