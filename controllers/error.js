exports.get404 = (req, res, next) => {
  res.status(404).render('404', {
    docTitle : 'ERROR', 
    path: '',
    isLoggedIn: req.session.isLoggedIn
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render('500', {
    docTitle : 'ERROR', 
    path: '',
    isLoggedIn: req.session.isLoggedIn
  });
};