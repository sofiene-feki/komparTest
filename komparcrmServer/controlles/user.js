const User = require('../models/user');

exports.list = async (req, res) => {
  res.json(await User.find({}).sort({ createdAt: -1 }).exec());
  console.log(res);
};
