const User = require('../models/user');

exports.createOrUpdateUser = async (req, res) => {
  const { name, email } = req.user;
  const user = await User.findOneAndUpdate({ email }, { name }, { new: true });

  if (user) {
    console.log('user updated', user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name,
    }).save();
    console.log('user created', newUser);
    res.json(newUser);
  }
};

exports.currentUser = async (req, res) => {
  User.findOne({ email: req.user.email }).exec((err, user) => {
    if (err) throw new Error(err);
    res.json(user);
  });
};

exports.usersList = async (req, res) => {
  res.json(await User.find({}).sort({ createdAt: -1 }).exec());
  console.log(res);
};
