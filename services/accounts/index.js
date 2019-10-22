const express = require('express');
const { ApolloServer, gql } = require("apollo-server-express");
const { buildFederatedSchema } = require("@apollo/federation");

const { checkAuthAndResolve } = require('./resolvers');

const typeDefs = gql`
  extend type Query {
    me: User
    allUsers: [User]
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const getUser = () => {
  console.log('TCL: getUser -> getUser called >>');
  return users[0];
} 

const resolvers = {
  Query: {
    me: (_, args, context) => {
      return checkAuthAndResolve(context, getUser);
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  context: async ({ req }) => {
    let authToken = null;
    let currentUser = null;

    try {
      if (req.headers) {
        authToken = req.headers.authtoken;
        if (req.headers.currentuser) {
          currentUser = JSON.parse(req.headers.currentuser);
        }
      }
    } catch (e) {
      console.warn(`Unable to authenticate using auth token: ${authToken}`);
    }

    return {
      authToken,
      currentUser,
    };
  },
});

// server.listen({ port: 4001 }).then(({ url }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });

const app = express();
const path = '/graphql';

const jwtCheck = (req, res, next) => {
  next();
}

app.use(path, jwtCheck);
server.applyMiddleware({ app, path });
 
app.listen({ port: 4001 }, () =>
  console.log(`🚀 Server ready at http://localhost:4001${server.graphqlPath}`)
);

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
