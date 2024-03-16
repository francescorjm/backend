
import EchoController from '../controllers/echo.controller.js';
import {Router} from 'express'
import schemas from '../validations/schema.js';
import validationYup from '../middleware/validationYup.js';


import passport from 'passport';
import attachUserId from '../middleware/attachUserId.js';
import validateUserIdToken from '../middleware/validateUserId.js'

let echoRouter = Router();
echoRouter.use(passport.authenticate("jwt", { session: false }));

echoRouter.post("/",validationYup(schemas.createEchoSchema),EchoController.createEcho);

echoRouter.delete("/:echoId/:userId",attachUserId ,validateUserIdToken ,EchoController.deleteEcho);

echoRouter.post("/reply",validationYup(schemas.replySchema),EchoController.replyEcho);
//echoRouter.put("/",validationYup(schemas.updateEchoSchema),EchoController.updateEchoData);

echoRouter.get("/:echoId",EchoController.getEchoById);
echoRouter.get("/allEchos/:userId",EchoController.getAllEchos);
echoRouter.get("/user/:userId", EchoController.getEchosFromUser);
echoRouter.get("/feed/:userId" ,EchoController.getFeed);
echoRouter.get("/replies/:echoId" ,EchoController.getEchoReplies);

export default echoRouter;