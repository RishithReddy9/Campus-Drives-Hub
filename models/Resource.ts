import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  title: string;
  type: "folder" | "file" | "blog";
  parentId: mongoose.Types.ObjectId | null;
  content: string | null; 
  pdf: string | null;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  type: { type: String, enum: ["folder", "file", "blog"], required: true },
  parentId: { type: Schema.Types.ObjectId, ref: "Resource", default: null },
  content: { type: String },
  pdf: { type: String },
});

export default mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);
