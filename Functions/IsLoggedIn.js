module.exports.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/auth/Login");
  }
};
module.exports.isAdmin = function isAdmnIn(req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  } else {
    res.redirect("/auth/Login");
  }
};
