import Joi from 'joi';

// 회원가입
export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(30).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    phone: Joi.string().length(11).pattern(new RegExp('^[0-9]*$')),
    address: Joi.string(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-z0-9]*$')).required(),
    confirmPassword: Joi.ref('password'),
});

// 회원정보 수정
export const updateUserSchema = Joi.object({
    name: Joi.string().min(3).max(30).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    phone: Joi.string().length(11).pattern(new RegExp('^[0-9]*$')),
    address: Joi.string(),
    password: Joi.string().min(8).pattern(new RegExp('^[a-z0-9]*$')).required(),
    confirmPassword: Joi.ref('password'),
});

// 로그인
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string(),
});

// 이메일 찾기
export const findEmailSchema = Joi.object({
    name: Joi.string().min(3).max(30).pattern(new RegExp('^[a-z0-9가-힣]*$')).required(),
    phone: Joi.string().length(11).pattern(new RegExp('^[0-9]*$')),
});

// 비밀번호 업데이트
export const updatePasswordSchema = Joi.object({
    password: Joi.string().min(8).pattern(new RegExp('^[a-z0-9]*$')).required(),
    passwordCheck: Joi.ref('password'),
});

// 비밀번호 입력
export const enterPasswordSchema = Joi.object({
    password: Joi.string().min(8).pattern(new RegExp('^[a-z0-9]*$')).required(),
});
