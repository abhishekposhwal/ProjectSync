import mongoose, {Schema} from "mongoose";

const documentSchema = new Schema({
    entity_type: {
        type : String, // cloudnary URL
        required: true,
    },
    entity_id: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    document_type: {
        type: String, // Profile picture, ppt, synopsis etc
        required: true,
    }
}, {timestamps:true})

export const Document = mongoose.model("Document",documentSchema)