import EchoModel from "../models/echo.js";
import  { Request, Response } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import FollowerModel from "../models/friend.js";
import LikeModel from "../models/like.js";
import { IEcho } from "../models/echo.js";

export default class EchoController {

    constructor() {}

    static createEcho = async (req: Request, res: Response) => {
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
    }

    static getEchosFromUser = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { lastEchoDate } = req.query;

        try {
            let query: any = { idUser: userId, isReply: null, isDeleted: false };

            // Si se proporciona lastEchoDate, añade la condición de fecha en la consulta
            if (lastEchoDate) {
                query.createdAt = { $lt: new Date(lastEchoDate as string) };
            }

            const echos = await EchoModel.find(query)
                .sort({ createdAt: -1 }) // Ordenar por fecha de creación descendente
               // .limit(10)
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el echo con los campos fullName, username y email

            if (!echos || echos.length === 0) {
                return ApiResponse.notFound(res, "No echos found");
            }

            const likeCountsPromises = echos.map(async (echo) => {
                const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
                return { ...echo.toObject(), likes: likeCount };
            });
    
            // Espera a que todas las consultas asincrónicas se completen
            let echos2 = await Promise.all(likeCountsPromises as Promise<IEcho>[]);

            const filteredEchos = echos2.filter(objeto => {
                let objeto2 = objeto as any;
                return objeto2.idUser.isDisabled === false;
            });

            //Search in database and add the field isLiked to each echo
            const userIdRequest = (req.user as { _id: string })._id;

            const isLikedPromises = filteredEchos.map(async (echo) => {
                const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userIdRequest }).countDocuments() > 0;
                return { ...echo, isLiked: isLiked };
            });

            // Espera a que todas las consultas asincrónicas se completen
            let filteredEchosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);

            
        } catch (error) {
            return ApiResponse.error(res, "Error getting echos", 500);
        }
    }

    static getFeed = async (req: Request, res: Response) => {
        const { userId } = req.params;
        const { lastEchoDate } = req.query;

        try {
            // Encuentra los usuarios que sigue el usuario actual
            const followingUsers = await FollowerModel.find({ idUser: userId }).distinct("idFriendship");

            let query: any = { idUser: { $in: followingUsers }, isDeleted:false, isReply: null };

            // Si se proporciona lastEchoDate, añade la condición de fecha en la consulta
            if (lastEchoDate) {
                query.createdAt = { $lt: new Date(lastEchoDate as string) };
            }

            const echos = await EchoModel.find(query)
                .sort({ createdAt: -1 })
            //    .limit(10)
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el echo con los campos fullName, username y email

            if (!echos || echos.length === 0) {
                return ApiResponse.notFound(res, "No echos found");
            }

            const likeCountsPromises = echos.map(async (echo) => {
                const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
                return { ...echo.toObject(), likes: likeCount };
            });
    
            // Espera a que todas las consultas asincrónicas se completen
            let echos2 = await Promise.all(likeCountsPromises as Promise<IEcho>[]);

            const filteredEchos = echos2.filter(objeto => {
                let objeto2 = objeto as any;
                return objeto2.idUser.isDisabled === false;
            });

            //Search in database and add the field isLiked to each echo
            const userIdRequest = (req.user as { _id: string })._id;

            const isLikedPromises = filteredEchos.map(async (echo) => {
                const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userIdRequest }).countDocuments() > 0;
                return { ...echo, isLiked: isLiked };
            });

            // Espera a que todas las consultas asincrónicas se completen
            let filteredEchosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);

        } catch (error) {
            return ApiResponse.error(res, "Error getting feed", 500);
        }
    }



    static getEchoById = async (req: Request, res: Response) => {
        const { echoId } = req.params;

        try {
            const echo = await EchoModel.findById(echoId).populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); 
            if (!echo) {
                return ApiResponse.notFound(res, "Echo not found");
            }


            const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();

            const echo2 = { ...echo.toObject(), likes: likeCount };

            //Search in database and add the field isLiked to each echo
            const userId = (req.user as { _id: string })._id;

            const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userId }).countDocuments() > 0;

            const echo3 = { ...echo2, isLiked: isLiked };




            return ApiResponse.success(res, "Echo retrieved", echo3);
        } catch (error) {
            return ApiResponse.error(res, "Error getting echo", 500);
        }
    }

    static deleteEcho = async (req: Request, res: Response) => {
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
    }

    static getAllEchos = async (req: Request, res: Response) => {
        const { lastEchoDate } = req.query;
        const { limit = 10 } = req.query;

        try {
            let query: any = {  isReply:null, isDeleted: false };

            // Si se proporciona lastEchoDate, añade la condición de fecha en la consulta
            if (lastEchoDate) {
                query.createdAt = { $lt: new Date(lastEchoDate as string) };
            }

            let echos = await EchoModel.find(query)
                .sort({ createdAt: -1 })
             //   .limit(parseInt(limit as string))
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el echo con los campos fullName, username y email

                
                if (!echos || echos.length === 0) {
                    return ApiResponse.notFound(res, "No echos found");
                }
                
                const likeCountsPromises = echos.map(async (echo) => {
                    const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
                    return { ...echo.toObject(), likes: likeCount };
                });
        
                // Espera a que todas las consultas asincrónicas se completen
                let echos2 = await Promise.all(likeCountsPromises as Promise<IEcho>[]);

                //Filter echos2 variable and remove echos that .idUser.isDisabled = true
        
                const filteredEchos = echos2.filter(objeto => {
                    let objeto2 = objeto as any;
                    return objeto2.idUser.isDisabled === false;
                });

                //Search in database and add the field isLiked to each echo
                const userId = (req.user as { _id: string })._id;

                const isLikedPromises = filteredEchos.map(async (echo) => {
                    const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userId }).countDocuments() > 0;
                    return { ...echo, isLiked: isLiked };
                });

                // Espera a que todas las consultas asincrónicas se completen
                let filteredEchosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);
            
        } catch (error) {
            return ApiResponse.error(res, "Error getting echos", 500);
        }
    }

    static getEchoReplies = async (req: Request, res: Response) => {
        const { echoId } = req.params;

        try {
            let query: any = { isReply: echoId, isDeleted: false };


            const echos = await EchoModel.find(query)
                .sort({ createdAt: 'asc' })
                .limit(10)
                .populate("idUser", ["fullName", "username", "isVerified", "profilePicture", "isDisabled"]); // Popula el usuario que hizo el echo con los campos fullName, username y email

            if (!echos || echos.length === 0) {
                return ApiResponse.notFound(res, "No echos found");
            }

            const likeCountsPromises = echos.map(async (echo) => {
                const likeCount = await LikeModel.find({ idEcho: echo._id }).countDocuments();
                return { ...echo.toObject(), likes: likeCount };
            });
    
            // Espera a que todas las consultas asincrónicas se completen
            let echos2 = await Promise.all(likeCountsPromises as Promise<IEcho>[]);

            const filteredEchos = echos2.filter(objeto => {
                let objeto2 = objeto as any;
                return objeto2.idUser.isDisabled === false;
            });

            //Search in database and add the field isLiked to each echo
            const userId = (req.user as { _id: string })._id;

            const isLikedPromises = filteredEchos.map(async (echo) => {
                const isLiked = await LikeModel.find({ idEcho: echo._id, idUser: userId }).countDocuments() > 0;
                return { ...echo, isLiked: isLiked };
            });

            // Espera a que todas las consultas asincrónicas se completen
            let filteredEchosWithLikes = await Promise.all(isLikedPromises);

            return ApiResponse.success(res, "Echos retrieved", filteredEchosWithLikes);

        } catch (error) {
            return ApiResponse.error(res, "Error getting echos", 500);
        }
    }

    static replyEcho = async (req: Request, res: Response) => {
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
    }


}


