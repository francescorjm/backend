import { Router } from 'express';
import schemas from '../validations/schema.js';
import validationYup from '../middleware/validationYup.js';
import LikeController from '../controllers/like.controller.js';
import passport from 'passport';
import attachUserId from '../middleware/attachUserId.js';
import validateUserIdToken from '../middleware/validateUserId.js';
const router = Router();
let likeRouter = Router();
likeRouter.use(passport.authenticate("jwt", { session: false }));
likeRouter.use(attachUserId);
likeRouter.use(validateUserIdToken);
likeRouter.post("/like", validationYup(schemas.likeSchema), LikeController.likeEcho);
likeRouter.post("/dislike", validationYup(schemas.likeSchema), LikeController.dislikeEcho);
export default likeRouter;
