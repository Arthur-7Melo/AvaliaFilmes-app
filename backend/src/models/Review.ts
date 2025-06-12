import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReview extends Document {
  author: Types.ObjectId;
  movieId: number;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const ReviewSchema = new Schema<IReview>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  movieId: {
    type: Number,
    required: true
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  content: {
    type: String,
    required: true
  },
},
  { timestamps: true }
);

ReviewSchema.index({ author: 1, movieId: 1 }, { unique: true });
export const Review = mongoose.model<IReview>('Review', ReviewSchema);