import {Router} from 'express'
import authController from '../controllers/auth.controller.js'
import schemas from '../validations/schema.js';
import validationYup from '../middleware/validationYup.js';

let authRouter = Router();
authRouter.post("/register",validationYup(schemas.registerSchema),authController.register);
authRouter.post("/login",validationYup(schemas.loginSchema),authController.login);

export default authRouter;
