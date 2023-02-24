exports.restrictToMiddleware = (roles) => {
  return (req, res, next) => {
    console.log(roles)
    if (req?.user?.errors) {
      console.log('roles')
      throw { message: req.__('ROLE_MSG_UNAUTHORIZED') }
    }
    let userRoles = req.user ? req.user.role : req.body.role;
    if (!roles.includes(userRoles)) {
      throw { message: req.__('ROLE_MSG_UNAUTHORIZED') };
    }
    next();
  };
};
