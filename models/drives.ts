import mongoose, { Schema, Document } from "mongoose";

export interface IDrive extends Document {
  company: string;
  role: string;
  date: string;
  summary: string;
  experience: string;
  author: string;
  tags: string[];
}

const DriveSchema = new Schema<IDrive>({
  company: { type: String, required: true },
  role: { type: String, required: true },
  date: { type: String, required: true },
  summary: { type: String, required: true },
  experience: { type: String, required: true },
  author: { type: String, default: "Anonymous" },
  tags: [{ type: String }]
});

export default mongoose.models.Drive || mongoose.model<IDrive>("Drive", DriveSchema);
