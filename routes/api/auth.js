const express = require('express');
const { validateBody, authenticate } = require('../../middlewares');
const { registerSchema, loginSchema } = require('../../models');
const { register, login, logout, resendVerifyEmail, verifyEmail } = require('../../controllers/auth');
const { ctrlWrapper } = require('../../utils');


const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), ctrlWrapper(register));

authRouter.get('/verify/:verificationToken', ctrlWrapper(verifyEmail));

authRouter.post(
    '/verify',
    validateBody(registerSchema),
    ctrlWrapper(resendVerifyEmail),
);

authRouter.post('/login', validateBody(loginSchema), ctrlWrapper(login));

authRouter.post('/logout', authenticate, ctrlWrapper(logout));



module.exports = authRouter;
