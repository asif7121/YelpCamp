import mongoose from "mongoose";
import passportLocalMongoose from 'passport-local-mongoose';

const Schema = mongoose.Schema;


const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  }
 
});

UserSchema.plugin(passportLocalMongoose);

const User =  mongoose.model('User', UserSchema);
export default User;