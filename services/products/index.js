const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const { checkAuthAndResolve } = require('./resolvers');

const typeDefs = gql`
  extend type Query {
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }
`;

const topProducts = (first) => {
  return products.slice(0, first);
}

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    }
  },
  Query: {
    topProducts(_, args, context) {
      return checkAuthAndResolve(context, topProducts, args.first);
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

server.listen({ port: 4003 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50
  },
  {
    upc: "4",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "5",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "6",
    name: "Chair",
    price: 54,
    weight: 50
  },
  {
    upc: "7",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "8",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "9",
    name: "Chair",
    price: 54,
    weight: 50
  },
];
