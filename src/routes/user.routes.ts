import {Router} from 'express'
import UserController from '../controllers/user.controller.js';
import schemas from '../validations/schema.js';
import validationYup from '../middleware/validationYup.js';
let userRouter = Router();

import passport from 'passport';
import attachUserId from '../middleware/attachUserId.js';
import validateUserIdToken from '../middleware/validateUserId.js';

userRouter.use(passport.authenticate("jwt", { session: false }));


userRouter.put(
    "/",
    attachUserId,
    validateUserIdToken,
    validationYup(schemas.updateUserDataSchema),
    UserController.updateUserData
);

userRouter.delete(
    "/:userId",
    attachUserId,
    validateUserIdToken,
    UserController.deleteUser
);

userRouter.get(
    "/search/:userId/:query",
    UserController.searchUser
);

userRouter.get(
    "/profile/:userId",
   
    UserController.getProfileData
);

userRouter.get("/data/allUsers/:userId", UserController.getAllUsers);


export default userRouter;