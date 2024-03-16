import friendController from '../controllers/friend.controller.js';
import {Router} from 'express'
import schemas from '../validations/schema.js';
import validationYup from '../middleware/validationYup.js';


import passport from 'passport';
import attachUserId from '../middleware/attachUserId.js';
import validateUserIdToken from '../middleware/validateUserId.js'

let friendRouter = Router();

friendRouter.use(passport.authenticate("jwt", { session: false }));
friendRouter.use(attachUserId);
friendRouter.use(validateUserIdToken);

friendRouter.post("/friend",validationYup(schemas.friendSchema),friendController.friendUser);

friendRouter.post("/unfriend",validationYup(schemas.friendSchema),friendController.unfriendUser);


export default friendRouter;