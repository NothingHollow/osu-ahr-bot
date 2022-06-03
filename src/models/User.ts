import { Schema, model } from 'mongoose';

const UserSchema = new Schema({
  User: String,
  score: Number,
  playTime: Number,
  playCount: Number,
  passedCount: Number,
});

export default model('user', UserSchema);