import FriendModel from "../models/friend.js";
import EchoModel from "../models/echo.js";
import UserCollection, { IUser } from "../models/user.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Request, Response } from "express";

export default class UserController {

    static deleteUser = async (req: Request, res: Response) => {
        const { userId: id } = req.body;
        const user = await UserCollection.findById(id);
        if (!user) {
            return ApiResponse.notFound(res, "User not found");
        }

        await user.deleteOne();
        return ApiResponse.success(res, "User deleted");
    }



    static updateUserData = async (req: Request, res: Response) => {
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
    }

    static searchUser = async (req: Request, res: Response) => {
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

        //get the ammount of friends for each user
        const friendsPromises = users.map(async (user) => {
            const friends = await FriendModel.find({idFriendship: user._id}).countDocuments();
            return { ...user.toObject(), friends: friends };
        });

        // Espera a que todas las consultas asincrónicas se completen
        let users2 = await Promise.all(friendsPromises);


        const friendshipPromises = users2.map(async (user) => {
            const friendship = await FriendModel.find({idUser: id, idFriendship: user._id}).countDocuments();
            return { ...user, isFriendship: friendship > 0 };
        });

        // Espera a que todas las consultas asincrónicas se completen
        users2 = await Promise.all(friendshipPromises);


        return ApiResponse.success(res, "Users found", users2);
    }

    static getProfileData = async (req: Request, res: Response) => {
        const { userId: id } = req.params;
        const user = await UserCollection.findById(id);

        //tell typescript that req.user is not undefined

        if (!user) {
            return ApiResponse.notFound(res, "User not found");
        }

        if(user.isDisabled){
            return ApiResponse.error(res, "User is disabled");
        }

        //get the ammount of friends
        const friends = await FriendModel.find({idFriendship: id}).countDocuments();
        const friendship = await FriendModel.find({idUser: id}).countDocuments();
        const echos = await EchoModel.find({idUser: id}).countDocuments();

        const myId = (req.user as { _id: string })._id;

        const isFriendship = await FriendModel.find({idUser: myId, idFriendship: id}).countDocuments() > 0; 


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
    }

    static getAllUsers = async (req: Request, res: Response) => {

        const { userId: id } = req.params;

        const users = await UserCollection.find({isDisabled: false});
        if (!users) {
            return ApiResponse.notFound(res, "Users not found");
        }

        //get the ammount of friends for each user
        const friendsPromises = users.map(async (user) => {
            const friends = await FriendModel.find({idFriendship: user._id}).countDocuments();
            return { ...user.toObject(), friends: friends };
        });

        // Espera a que todas las consultas asincrónicas se completen
        let users2 = await Promise.all(friendsPromises);


        //Necesito agregar el campo a cda usuario que verifique si el usuario que hace la peticion sigue a cada uno de los usuarios
        const friendshipPromises = users2.map(async (user) => {
            const friendship = await FriendModel.find({idUser: id, idFriendship: user._id}).countDocuments();
            return { ...user, isFriendship: friendship > 0 };
        });

        // Espera a que todas las consultas asincrónicas se completen
        users2 = await Promise.all(friendshipPromises);

        return ApiResponse.success(res, "Users found", users2);
    }
    

}

