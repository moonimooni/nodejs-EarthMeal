const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  return res.render('auth/login', {
    docTitle: '어스밀 - 로그인',
    path: '/login'
  });
};

exports.postLogin = (req, res, next) => {
  User
    .find({ email: req.body.email })
    .then(user => req.session.user = user)
    .then(() => req.session.isLoggedIn = true)
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  return req.session.destroy((err) => {
    if (err) console.log(err);
    return res.redirect('/');
  });
};