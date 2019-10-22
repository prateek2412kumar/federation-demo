const { ApolloServer, gql, AuthenticationError } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");
const jwt = require('jsonwebtoken');

const typeDefs = gql`
    type Mutation {      
        login(email: String!, password: String!): String # login token
    }
`;

const resolvers = {
    Mutation: {
        login: async (_, { email, password }) => {
            const user = users.filter((item) => {
                if (item.email === email && password) {
                    return item;
                }
            });
            if (user && user[0]) {
                return jwt.sign(user[0], 'random_secret_key');
            } else {
                throw new AuthenticationError('Incorrect credentials');
            }
        },
    }
};

const server = new ApolloServer({
    schema: buildFederatedSchema([
        {
            typeDefs,
            resolvers
        }
    ])
});

server.listen({ port: 4005 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

const users = [
    {
        id: "1",
        name: "Ada Lovelace",
        email: "ada.lovelace@gmail.com",
        birthDate: "1815-12-10",
        username: "@ada",
        role: ['account-admin'],
        password: '12345',
    },
    {
        id: "2",
        name: "Alan Turing",
        email: "alan.turing@gmail.com",
        birthDate: "1912-06-23",
        username: "@complete",
        role: ['inventory-admin'],
        password: '12345',
    },
    {
        id: "3",
        name: "John Smith",
        email: "john.smith@gmail.com",
        birthDate: "1815-12-10",
        username: "@ada",
        role: ['product-admin'],
        password: '12345',
    },
    {
        id: "4",
        name: "Jane Smith",
        email: "jane.smith@gmail.com",
        birthDate: "1912-06-23",
        username: "@complete",
        role: ['reviews-admin'],
        password: '12345',
    }
];
