import { model, Schema } from "mongoose";
import "dotenv/config";
const echoSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    idUser: {
        type: String,
        required: true,
        ref: "User",
    },
    isReply: {
        type: Schema.Types.Mixed,
        default: null,
    },
    attachmentUrls: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        required: true,
        default: false,
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    mentions: {
        type: [String],
        default: [],
    },
    hashtags: {
        type: [String],
        default: [],
    }
});
echoSchema.methods.updateData = async function (echoData) {
    const echo = this;
    if (echoData.content)
        echo.content = echoData.content;
    if (echoData.attachmentUrls)
        echo.attachmentUrls = echoData.attachmentUrls;
    if (echoData.mentions)
        echo.mentions = echoData.mentions;
    if (echoData.hashtags)
        echo.hashtags = echoData.hashtags;
    if (echoData.isDeleted !== undefined)
        echo.isDeleted = echoData.isDeleted;
    if (echoData.isEdited !== undefined)
        echo.isEdited = echoData.isEdited;
    if (echoData.isReply !== undefined)
        echo.isReply = echoData.isReply;
    await echo.save();
    return true;
};
const EchoModel = model("Echo", echoSchema);
export default EchoModel;
