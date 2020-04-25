var bcrypt = require('bcryptjs');
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  card: Boolean,
  email: String,
  password: {
    type: String,
    select: false,
  },
  first_name: String,
  last_name: String,
  phone_no: String,
  address: {
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
  },
  position:String,
  company:String,
  socials:Object,
  introduction:String,
  sharedCardsArray: Array,
  created: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashed = await bcrypt.hash(this['password'], 10);
    this['password'] = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});
