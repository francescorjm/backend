var _a;
import ApiResponse from "../utils/ApiResponse.js";
import FriendModel from "../models/friend.js";
class friendController {
    constructor() { }
}
_a = friendController;
friendController.friendUser = async (req, res) => {
    const { userId, idFriendship } = req.body;
    const friend = await FriendModel.findOne({ idUser: userId, idFriendship });
    if (friend) {
        return ApiResponse.error(res, "Error following user, user already followed", 400);
    }
    const newFriend = new FriendModel({ idUser: userId, idFriendship });
    await newFriend.save();
    return ApiResponse.success(res, "User followed", friend);
};
friendController.unfriendUser = async (req, res) => {
    const { userId, idFriendship } = req.body;
    const friend = await FriendModel.findOneAndDelete({ idUser: userId, idFriendship });
    if (!friend) {
        return ApiResponse.error(res, "Error unfriend user", 400);
    }
    return ApiResponse.success(res, "User unfriend", friend);
};
export default friendController;
