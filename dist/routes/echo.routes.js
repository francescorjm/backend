import { Router } from 'express';
import schemas from '../validations/schemas.js';
import validationYup from '../middlewares/validationYup.js';
import EchoController from '../controllers/echo.controller.js';
import passport from 'passport';
import attachUserId from '../middlewares/attachUserId.js';
import validateUserIdToken from '../middlewares/validateUserId.js';


let echoRouter = Router();

echoRouter.use(passport.authenticate("jwt", { session: false }));
echoRouter.post("/", validationYup(schemas.createEchoSchema), EchoController.createEcho);
echoRouter.delete("/:echoId/:userId", attachUserId, validateUserIdToken, EchoController.deleteEcho);
echoRouter.post("/reply", validationYup(schemas.replySchema), EchoController.replyEcho);
echoRouter.get("/:echoId", EchoController.getEchoById);
echoRouter.get("/allechos/:userId", EchoController.getAllEchos);
echoRouter.get("/user/:userId", EchoController.getEchosFromUser);
echoRouter.get("/feed/:userId", EchoController.getFeed);
echoRouter.get("/replies/:echoId", EchoController.getEchoReplies);
export default echoRouter;
