import mongoose, { Schema, Document } from "mongoose";

export interface IReply {
  _id?: mongoose.Types.ObjectId;
  authorEmail?: string;
  text: string;
  createdAt?: Date;
}

export interface IComment {
  _id?: mongoose.Types.ObjectId;
  authorEmail?: string;
  text: string;
  createdAt?: Date;
  replies: IReply[];
}

export interface IRound { date: Date; round: string; }

export interface IDrive extends Document {
  company: string;
  summary: string;
  experiences: string[];
  tags: string[];
  pdfs: String[]; 
  compensation: string;
  skills: string[];
  roles: string[];
  resources: string[];
  rounds: IRound[];
  comments: IComment[];
}

const ReplySchema = new Schema<IReply>({
  authorEmail: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
}, { _id: true });

const CommentSchema = new Schema<IComment>({
  authorEmail: { type: String },
  text: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
  replies: { type: [ReplySchema], default: [] },
}, { _id: true });

const RoundSchema = new Schema({
  date: { type: Date, required: true },
  round: { type: String, required: true },
}, { _id: false });

const DriveSchema = new Schema<IDrive>({
  company: { type: String, required: true },
  summary: { type: String, required: true },
  experiences: { type: [String] },
  tags: [{ type: String }],
  pdfs: [{ type: String }],
  compensation: { type: String, required: true },
  skills: [{ type: String }],
  roles: [{ type: String }],
  resources: [{ type: String }],
  rounds: { type: [RoundSchema], default: [] },
  comments: { type: [CommentSchema], default: [] },
});

export default mongoose.models.Drive || mongoose.model<IDrive>("Drive", DriveSchema);
