const jwt = require('jsonwebtoken');
const { AuthenticationError } = require("apollo-server-express");
const { AuthorizationError } = require('./../errors');

const checkAuthAndResolve = (context, controller) => {
  if (context && !context.authToken) {
    throw new AuthenticationError('Invalid credentials.');
  } else if (context){
    const { currentUser } = context;
    if (currentUser && currentUser.role.indexOf('account-admin') > 0 ) {
      throw new AuthorizationError({ message: 'No Permission!' });
    }
  }
  return controller.apply(this);
};

module.exports = { checkAuthAndResolve };
