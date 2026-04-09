import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGame extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  image: string;
  category: string;
  size: string;
  downloadLink: string;
  tags: string[];
  views: number;
  downloads: number;
  createdAt: Date;
}

const GameSchema = new Schema<IGame>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    size: { type: String, required: true },
    downloadLink: { type: String, required: true },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const GameModel: Model<IGame> =
  mongoose.models.Game ?? mongoose.model<IGame>('Game', GameSchema);

export default GameModel;
