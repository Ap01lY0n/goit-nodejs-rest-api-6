const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { sendEmail } = require('../../utils');
const { User } = require('../../models');
const HttpError = require('../../utils');

const SECRET_KEY = process.env.SECRET_KEY;
const register = async ({ body }, res) => {
	const { email, password } = body;
	const user = await User.findOne({ email });
	if (user) {
		throw HttpError(409, 'Email in use');
	}
	const hashPassword = await bcrypt.hash(password, 10);

	const avatarURL = gravatar.url(email);

	const newUser = await User.create({ ...body, password: hashPassword, avatarURL });

	res.status(201).json({
		user: {
			email: newUser.email,
			subscription: newUser.subscription,
		},
	});
};
const verifyEmail = async (req, res) => {
	const { verificationToken } = req.params;
  
	const user = await User.findOne({ verificationToken });
  
	if (!user) throw HttpError(404, 'User Not Found');
  
	await User.findByIdAndUpdate(user._id, {
	  verify: true,
	  verificationToken: null,
	});
  
	res.json({
	  message: 'Verification successful',
	});
  };
  
  const resendVerifyEmail = async (req, res) => {
	const { email } = req.body;
	const user = await User.findOne({ email });
  
	if (!user) throw HttpError(401, 'Email not found');
  
	if (user.verify) throw HttpError(400, 'Verification has already been passed');
  
	await sendEmail(email, user.verificationToken);
  
	res.json({
	  message: 'Verification email sent',
	});
  };
const login = async ({ body }, res) => {
	const { email, password } = body;
	const user = await User.findOne({ email });
	if (!user) {
		throw HttpError(401, 'Email or password is wrong');
	}
	const passwordCompare = await bcrypt.compare(password, user.password);
	if (!passwordCompare) {
		throw HttpError(401, 'Email or password is wrong');
	}
	const payload = {
		id: user._id,
	};

	const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '12h' });

	await User.findByIdAndUpdate(user._id, { token });

	res.json({
		token: token,
		user: {
			email: user.email,
			subscription: user.subscription,
		},
	});
};

const logout = async ({ user }, res) => {
	const { _id: id } = user;

	await User.findByIdAndUpdate(id, { token: '' });

	res.status(204).json({});
};

module.exports = {
	register,
	login,
	logout,
	verifyEmail,
	resendVerifyEmail,
};
