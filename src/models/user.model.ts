import bcrypt from 'bcryptjs';
import mongoose from "mongoose";

export type UserDocument = mongoose.Document & {
  email: string;
  username: string;
  password: string;
  resetCode: string;
};

const userSchema = new mongoose.Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetCode: { type: String }
});

// pre save hook to hash password before saving user into the database:
userSchema.pre("save", async function (next: (err?: mongoose.NativeError) => void): Promise<void> {
  const user = this as UserDocument;
  if (!user.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    console.error(error);
  }
  return next();
});

export const User = mongoose.model<UserDocument>("User", userSchema);