const jwt = require('jsonwebtoken');
const { AuthenticationError } = require("apollo-server-express");
const { AuthorizationError } = require('./../errors');

const checkAuthAndResolve = (context, controller, args) => {
  if (context && !context.authToken) {
    throw new AuthenticationError('Invalid credentials.');
  } else if (context){
    const { currentUser } = context;
    if (currentUser && currentUser.role.indexOf('product-admin') <= 0 ) {
      throw new AuthorizationError({ message: 'No Permission!' });
    }
  }
  return controller.apply(this, [args]);
};

module.exports = { checkAuthAndResolve };
