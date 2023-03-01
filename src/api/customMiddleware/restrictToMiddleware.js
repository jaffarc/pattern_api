exports.restrictToMiddleware = (roles) => {
  return (req, res, next) => {
    if (req?.user?.errors) {
      throw { message: req.__('ROLE_MSG_UNAUTHORIZED') }
    }
    let userRoles = req.user ? req.user.role : req.body.role;
    if (!roles.includes(userRoles)) {
      throw { message: req.__('ROLE_MSG_UNAUTHORIZED') };
    }
    next();
  };
};
