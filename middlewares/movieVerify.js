import { HttpError } from '../helpers/HttpError.js';
import { Movies } from '../models/movies.js';

export const movieVerify = async (req, _, next) => {
  const { movieId } = req.params;
  const { _id } = req.user;

  try {
    const movie = await Movies.findById(movieId);

    if (!movie) {
      return next(HttpError(404, 'Movie not found'));
    }

    const verifyUser = movie.owner.toString() === _id.toString();

    if (!movie || !verifyUser) next(HttpError(404, 'Movie not found'));

    next();
  } catch (error) {
    next(error.message);
  }
};
