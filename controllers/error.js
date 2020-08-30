const errorController = (req, res, next) => {
  res.status(404).render('404', {docTitle : 'ERROR', path: ''});
};

module.exports = errorController;