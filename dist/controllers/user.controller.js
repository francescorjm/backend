var _a;
import FriendModel from "../models/friend.js";
import EchoModel from "../models/echo.js";
import UserCollection from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
class UserController {
}
_a = UserController;
UserController.deleteUser = async (req, res) => {
    const { userId: id } = req.body;
    const user = await UserCollection.findById(id);
    if (!user) {
        return ApiResponse.notFound(res, "User not found");
    }
    await user.deleteOne();
    return ApiResponse.success(res, "User deleted");
};
UserController.updateUserData = async (req, res) => {
    const { userId: id } = req.body;
    const user = await UserCollection.findById(id);
    if (!user) {
        return ApiResponse.notFound(res, "User not found");
    }
    const updated = await user.updateData(req.body);
    if (!updated) {
        return ApiResponse.error(res, "Error updating user", 400);
    }
    return ApiResponse.success(res, "User updated");
};
UserController.searchUser = async (req, res) => {
    const { userId: id, query } = req.params;
    const users = await UserCollection.find({
        $or: [
            { username: { $regex: query, $options: "i" } },
            { fullName: { $regex: query, $options: "i" } }
        ],
        isDisabled: false
    });
    if (!users) {
        return ApiResponse.notFound(res, "Users not found");
    }
    const friendsPromises = users.map(async (user) => {
        const friends = await FriendModel.find({ idFriendship: user._id }).countDocuments();
        return { ...user.toObject(), friends: friends };
    });
    let users2 = await Promise.all(friendsPromises);
    const friendshipPromises = users2.map(async (user) => {
        const friendship = await FriendModel.find({ idUser: id, idFriendship: user._id }).countDocuments();
        return { ...user, isFriendship: friendship > 0 };
    });
    users2 = await Promise.all(friendshipPromises);
    return ApiResponse.success(res, "Users found", users2);
};
UserController.getProfileData = async (req, res) => {
    const { userId: id } = req.params;
    const user = await UserCollection.findById(id);
    if (!user) {
        return ApiResponse.notFound(res, "User not found");
    }
    if (user.isDisabled) {
        return ApiResponse.error(res, "User is disabled");
    }
    const friends = await FriendModel.find({ idFriendship: id }).countDocuments();
    const friendship = await FriendModel.find({ idUser: id }).countDocuments();
    const echos = await EchoModel.find({ idUser: id }).countDocuments();
    const myId = req.user._id;
    const isFriendship = await FriendModel.find({ idUser: myId, idFriendship: id }).countDocuments() > 0;
    return ApiResponse.success(res, "User found", {
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        profilePicture: user.profilePicture,
        isVerified: user.isVerified,
        friends: friends,
        friendship: friendship,
        echos: echos,
        isFriendship: isFriendship
    });
};
UserController.getAllUsers = async (req, res) => {
    const { userId: id } = req.params;
    const users = await UserCollection.find({ isDisabled: false });
    if (!users) {
        return ApiResponse.notFound(res, "Users not found");
    }
    const friendsPromises = users.map(async (user) => {
        const friends = await FriendModel.find({ idFriendship: user._id }).countDocuments();
        return { ...user.toObject(), friends: friends };
    });
    let users2 = await Promise.all(friendsPromises);
    const friendshipPromises = users2.map(async (user) => {
        const friendship = await FriendModel.find({ idUser: id, idFriendship: user._id }).countDocuments();
        return { ...user, isFriendship: friendship > 0 };
    });
    users2 = await Promise.all(friendshipPromises);
    return ApiResponse.success(res, "Users found", users2);
};
export default UserController;
