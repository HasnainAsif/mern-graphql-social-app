const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const { authMiddleware } = require('./utils/authMiddleware');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (context) => {
    const me = authMiddleware(context);

    return {
      me,
      context,
    };
  },
  // formatError: (err) => {
  //   if (err.extensions?.code === 'UNAUTHORIZED') {
  //     return new Error('Authentication required.');
  //   }
  // },
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then((res) => {
    console.log('MongoDb Connected');
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });

//// OR
// server.listen(5000).then((res) => {
//   console.log(res.url);
// });

// createpost, login is done
