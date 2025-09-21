import mongoose, { Schema, Document } from "mongoose";

export interface IResource extends Document {
  title: string;
  category: string;
  link: string;
  description: string;
}

const ResourceSchema = new Schema<IResource>({
  title: { type: String, required: true },
  category: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String, required: true },
});

export default mongoose.models.Resource || mongoose.model<IResource>("Resource", ResourceSchema);
