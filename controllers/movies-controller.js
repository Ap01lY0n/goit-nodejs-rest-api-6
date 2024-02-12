import { ctrlWrapper } from '../decorators/ctrlWrapper.js';
import { HttpError } from '../helpers/HttpError.js';
import { Movies } from '../models/movies.js';

// ============ Get List of Favorites Movies ================ //

async function moviesList(req, res, next) {
  const { _id: owner } = req.user;

  let query = { owner };

  const data = await Movies.find(query, '-createdAt -updatedAt -owner');

  if (!data) return next();
  res.json(data);
}
// ============ Add in Favorite List ================ //

async function addMovie(req, res) {
  const { _id: owner } = req.user;

  const data = await Movies.create({ ...req.body, owner });

  const { name, poster, date, movieId, rating, type, _id } = data;

  const responseObj = { name, poster, date, movieId, rating, type, _id };
  res.status(201).json(responseObj);
  console.log('----------------');
}

async function removeFromList(req, res) {
  const { movieId } = req.params;

  await Movies.findByIdAndDelete(movieId);

  res.status(200).json({ message: 'Movie removed from list' });
  console.log('----------------');
}

export default {
  getAll: ctrlWrapper(moviesList),
  addInFav: ctrlWrapper(addMovie),
  remove: ctrlWrapper(removeFromList),
};
