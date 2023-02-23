exports.restrictTo = (...roles) => {
    return (req, res, next) => {
      if (req.user.errors) {
        return resJsonP(res, 200, false, req.user.errors);
      }
      let userRoles = req.user ? req.user.role : req.body.role;
      if (!roles.includes(userRoles)) {
        return resJsonP(res, 200, false, { msg: req.__('ROLE_MSG_UNAUTHORIZED') });
      }
      next();
    };
  };