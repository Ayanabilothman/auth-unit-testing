import User from "./../../../DB/models/user.model.js";

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  await User.create({ email, password });
  return res.status(201).json({ success: true });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new Error("Invalid Email!"));

  const checkPassword = user.checkPassword(password);
  if (!checkPassword) return next(new Error("Invalid Password!"));

  const token = user.generateToken();

  return res.status(200).json({ success: true, results: { token } });
};
