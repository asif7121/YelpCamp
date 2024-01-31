import mongoose from "mongoose";
const {Schema} = mongoose;

const reviewSchema = new Schema({
    body : String,
    rating : Number,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
},
{

        versionKey: false,
    timestamps:true
    
});


const review =  mongoose.model('Review', reviewSchema)
export default review


