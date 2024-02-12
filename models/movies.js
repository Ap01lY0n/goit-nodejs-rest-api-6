import { Schema, model } from 'mongoose';
import { handleMongooseError } from './hooks.js';
import { movieTypes } from '../constans/movies.js';

const moviesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    poster: {
      type: String,
      default:
        'https://avatars.mds.yandex.net/i?id=0eaa142d7202ac9bbd26ac279e7ae159_l-4898876-images-thumbs&n=27&h=480&w=480',
    },
    date: {
      type: String,
      default: 'No date',
    },
    movieId: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 6.0,
    },
    type: {
      type: String,
      enum: movieTypes,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

moviesSchema.post('save', handleMongooseError);

export const Movies = model('favorite', moviesSchema);
