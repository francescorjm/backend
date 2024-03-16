var _a;
import ApiResponse from "../utils/ApiResponse.js";
import LikeModel from "../models/like.js";
class LikeController {
    constructor() { }
}
_a = LikeController;
LikeController.likeEcho = async (req, res) => {
    const { userId, echoId } = req.body;
    const like = await LikeModel.findOne({
        idUser: userId,
        idEcho: echoId
    });
    if (like) {
        return ApiResponse.error(res, "Echo alredy liked", 400);
    }
    const newLike = new LikeModel({
        idUser: userId,
        idEcho: echoId
    });
    await newLike.save();
    return ApiResponse.success(res, "Echo liked", like);
};
LikeController.dislikeEcho = async (req, res) => {
    const { userId, echoId } = req.body;
    const like = await LikeModel.findOne({
        idUser: userId,
        idEcho: echoId
    });
    if (!like) {
        return ApiResponse.error(res, "Echo not liked", 400);
    }
    await like.deleteOne();
    return ApiResponse.success(res, "Echo disliked", like);
};
export default LikeController;
