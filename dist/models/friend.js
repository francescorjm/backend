import { model, Schema } from "mongoose";
import "dotenv/config";
const friendSchema = new Schema({
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
const FriendModel = model("Friend", friendSchema);
export default FriendModel;
