// const {Admin, User} = require('../models/admin');
// const User = require('../models/user');

const { Admin, User } = require('../models/database');

exports.createSession = (req, res, next) => {
  isAdmin = req.session.isAdmin;
  isLoggedIn = req.session.isLoggedIn;
  csrfToken = req.csrfToken();
  return next();
};

exports.checkAdminOrUser = (req, res, next) => {
  if (req.session.admin) {
    return Admin
      .findByPk(req.session.admin.id)
      .then(admin => {
        if (!admin) {
          console.log('관리자가 없습니다');
          return next();
        };
        req.admin = admin;
        loggedInUser = admin;
        return next();
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  if (req.session.user) {
    return User
      .findByPk(req.session.user.id)
      .then(user => {
        if (!user) {
          console.log('유저가 없습니다');
          return next();
        };
        req.user = user;
        loggedInUser = user;
        return next();
      })
      .catch(err => {
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };
  return next();
};