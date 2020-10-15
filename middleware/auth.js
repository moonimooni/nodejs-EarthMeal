module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) return res.redirect('/login');
  // status code should be 401 here
  next();
}