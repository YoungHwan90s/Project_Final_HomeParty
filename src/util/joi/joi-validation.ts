import Joi from 'joi';

// 회원가입
export const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).max(20).pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9~!@#$%^&*()_-]{10,20}$/)).required(),
    confirmPassword: Joi.ref('password'),
    name: Joi.string().required(),
    sex: Joi.string().required(),
    phone: Joi.string().length(11).pattern(new RegExp(/^01[0|1|6|7|8|9]{1}[0-9]{8}$/)).required(),
    address: Joi.string().required(),
});

// 로그인
export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).max(20).pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9~!@#$%^&*()_-]{10,20}$/)).required(),
});

// 이메일 찾기
export const findEmailSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().length(11).pattern(new RegExp(/^01[0|1|6|7|8|9]{1}[0-9]{8}$/)).required(),
});

// 비밀번호 찾기
export const findPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

// 비밀번호 업데이트
export const updatePasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(10).max(20).pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9~!@#$%^&*()_-]{10,20}$/)).required(),
    confirmPassword: Joi.ref('password'),
});

// 회원정보 수정
export const updateUserSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().length(11).pattern(new RegExp(/^01[0|1|6|7|8|9]{1}[0-9]{8}$/)).required(),
    address: Joi.string().required(),
});

// 비밀번호 입력
export const enterPasswordSchema = Joi.object({
    password: Joi.string().min(10).max(20).pattern(new RegExp(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9~!@#$%^&*()_-]{10,20}$/)).required(),
});
