const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const jwt = require('jsonwebtoken');

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set('authToken', context.authToken);
    if (context.currentUser) {
      request.http.headers.set('currentUser', JSON.stringify(context.currentUser));
    }
    console.log('willSendRequest', request.http.headers);
  }
  didReceiveResponse(response, request, context) {
    const body = super.didReceiveResponse(response, request, context);
    // console.log('didReceiveResponse', response, request, context);
    return body;
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4001/graphql" },
    { name: "reviews", url: "http://localhost:4002/graphql" },
    { name: "products", url: "http://localhost:4003/graphql" },
    { name: "inventory", url: "http://localhost:4004/graphql" },
    { name: "auth", url: "http://localhost:4005/graphql" }
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

(async () => {
  const { schema, executor } = await gateway.load();
  console.log('TCL: schema', schema);

  const server = new ApolloServer({
    schema,
    executor,
    context: async ({ req }) => {
      let authToken = null;
      let currentUser = null;

      try {
        authToken = req.headers['authorization'];

        if (authToken) {
          currentUser = jwt.verify(authToken, 'random_secret_key');
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

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
