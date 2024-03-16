import { model, Schema, Document } from "mongoose";
import "dotenv/config";

export interface IFriend extends Document {
    idUser: string;
    idFriendship: string;
    createdAt: Date;
}

const friendSchema: Schema<IFriend> = new Schema<IFriend>({
    idUser: {
        type: String,
        required: true,
        ref: "User",
    },
    idFriendship: {
        type: String,
        required: true,
        ref: "User",
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});



const FriendModel = model<IFriend>("Friend", friendSchema);

export default FriendModel;
