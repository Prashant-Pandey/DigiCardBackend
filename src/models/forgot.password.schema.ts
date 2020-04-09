import * as mongoose from 'mongoose';

export const ForgotPasswordSchema = new mongoose.Schema({
  email: String,
  token: String,
  created: { type: Date, default: Date.now },
});