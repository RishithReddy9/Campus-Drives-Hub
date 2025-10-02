// models/User.ts
import mongoose, { Schema, Document, model } from "mongoose";

export interface IUser extends Document {
  email: string;
  role: "admin" | "user";
  otp?: string;
  otpExpiry?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  otp: { type: String },
  otpExpiry: { type: Date },
});

export default mongoose.models.User || model<IUser>("User", userSchema);
