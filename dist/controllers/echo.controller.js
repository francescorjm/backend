var _a;
import EchoModel from "../models/echo.js";
import ApiResponse from "../utils/ApiResponse.js";
import FriendModel from "../models/friend.js";
import LikeModel from "../models/like.js";
class EchoController {
    constructor() { }
}
_a = EchoController;
EchoController.createEcho = async (req, res) => {
    const { userId } = req.body;
    const echo = new EchoModel({
        ...req.body,
        idUser: userId
    });
    const savedEcho = await echo.save();
    if (!echo) {
        return ApiResponse.error(res, "Error creating echo", 400);
    }
    return ApiResponse.success(res, "Echo created", echo);
};
EchoController.getEchosFromUser = async (req, res) => {
    const { userId } = req.params;
    const { lastEchoDate } = req.query;
    try {
        let query = { idUser: userId, isReply: null, isDeleted: false };
        if (lastEchoDate) {
            query.createdAt = { $lt: new Date(lastEchoDate) };
        }
        const echos = await EchoModel.find(query)
            .sort({ createdAt: -1 })
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!echos || echos.length === 0) {
            return ApiResponse.notFound(res, "No echos found");
        }
        const likeCountsPromises = echos.map(async (echo) => {
            const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
            return { ...echo.toObject(), likes: likeCount };
        });
        let echos2 = await Promise.all(likeCountsPromises);
        const filteredEchos = echos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userIdRequest = req.user._id;
        const isLikedPromises = filteredEchos.map(async (echo) => {
            const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userIdRequest }).countDocuments() > 0;
            return { ...echo, isLiked: isLiked };
        });
        let filteredEchosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting echos", 500);
    }
};
EchoController.getFeed = async (req, res) => {
    const { userId } = req.params;
    const { lastEchoDate } = req.query;
    try {
        const friendshipUsers = await FriendModel.find({ idUser: userId }).distinct("idFriendship");
        let query = { idUser: { $in: friendshipUsers }, isDeleted: false, isReply: null };
        if (lastEchoDate) {
            query.createdAt = { $lt: new Date(lastEchoDate) };
        }
        const echos = await EchoModel.find(query)
            .sort({ createdAt: -1 })
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!echos || echos.length === 0) {
            return ApiResponse.notFound(res, "No echos found");
        }
        const likeCountsPromises = echos.map(async (echo) => {
            const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
            return { ...echo.toObject(), likes: likeCount };
        });
        let echos2 = await Promise.all(likeCountsPromises);
        const filteredEchos = echos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userIdRequest = req.user._id;
        const isLikedPromises = filteredEchos.map(async (echo) => {
            const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userIdRequest }).countDocuments() > 0;
            return { ...echo, isLiked: isLiked };
        });
        let filteredEchosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting feed", 500);
    }
};
EchoController.getEchoById = async (req, res) => {
    const { echoId } = req.params;
    try {
        const echo = await EchoModel.findById(echoId).populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!echo) {
            return ApiResponse.notFound(res, "Echo not found");
        }
        const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
        const echo2 = { ...echo.toObject(), likes: likeCount };
        const userId = req.user._id;
        const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userId }).countDocuments() > 0;
        const echo3 = { ...echo2, isLiked: isLiked };
        return ApiResponse.success(res, "Echo retrieved", echo3);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting echo", 500);
    }
};
EchoController.deleteEcho = async (req, res) => {
    const { echoId } = req.params;
    const echo = await EchoModel.findById(echoId);
    if (!echo) {
        return ApiResponse.notFound(res, "Echo not found");
    }
    echo.isDeleted = true;
    const savedEcho = await echo.save();
    if (!savedEcho) {
        return ApiResponse.error(res, "Error deleting echo", 500);
    }
    return ApiResponse.success(res, "Echo deleted", echo);
};
EchoController.getAllEchos = async (req, res) => {
    const { lastEchoDate } = req.query;
    const { limit = 10 } = req.query;
    try {
        let query = { isReply: null, isDeleted: false };
        if (lastEchoDate) {
            query.createdAt = { $lt: new Date(lastEchoDate) };
        }
        let echos = await EchoModel.find(query)
            .sort({ createdAt: -1 })
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!echos || echos.length === 0) {
            return ApiResponse.notFound(res, "No echos found");
        }
        const likeCountsPromises = echos.map(async (echo) => {
            const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
            return { ...echo.toObject(), likes: likeCount };
        });
        let echos2 = await Promise.all(likeCountsPromises);
        const filteredEchos = echos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userId = req.user._id;
        const isLikedPromises = filteredEchos.map(async (echo) => {
            const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userId }).countDocuments() > 0;
            return { ...echo, isLiked: isLiked };
        });
        let filteredEchosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting echos", 500);
    }
};
EchoController.getEchoReplies = async (req, res) => {
    const { echoId } = req.params;
    try {
        let query = { isReply: echoId, isDeleted: false };
        const echos = await EchoModel.find(query)
            .sort({ createdAt: 'asc' })
            .limit(10)
            .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]);
        if (!echos || echos.length === 0) {
            return ApiResponse.notFound(res, "No echos found");
        }
        const likeCountsPromises = echos.map(async (echo) => {
            const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
            return { ...echo.toObject(), likes: likeCount };
        });
        let echos2 = await Promise.all(likeCountsPromises);
        const filteredEchos = echos2.filter(objeto => {
            let objeto2 = objeto;
            return objeto2.idUser.isDisabled === false;
        });
        const userId = req.user._id;
        const isLikedPromises = filteredEchos.map(async (echo) => {
            const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userId }).countDocuments() > 0;
            return { ...echo, isLiked: isLiked };
        });
        let filteredEchosWithLikes = await Promise.all(isLikedPromises);
        return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);
    }
    catch (error) {
        return ApiResponse.error(res, "Error getting echos", 500);
    }
};
EchoController.replyEcho = async (req, res) => {
    const { userId } = req.body;
    const echo = new EchoModel({
        ...req.body,
        idUser: userId
    });
    const savedEcho = await echo.save();
    if (!echo) {
        return ApiResponse.error(res, "Error creating echo", 400);
    }
    return ApiResponse.success(res, "Echo created", echo);
};
export default EchoController;
