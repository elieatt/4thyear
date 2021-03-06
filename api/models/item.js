const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: String,
    dateOfLoose: { type: String ,required:true },
    found:{type:Number,required:true},
    governorate:{type:String,required:true},
    category:{type:String,required:true},
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    imagePublicId:{type:String,required:false}
});

module.exports = mongoose.model("Item", itemSchema);