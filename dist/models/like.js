import { model, Schema } from "mongoose";
import "dotenv/config";
const likeSchema = new Schema({
    idUser: {
        type: String,
        required: true,
        ref: "User",
    },
    idEcho: {
        type: String,
        required: true,
        ref: "Echo",
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
});
const LikeModel = model("Like", likeSchema);
export default LikeModel;
