const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
  const token = context.req.header("Authorization");
  //   const token = context.req.headers.authorization;

  if (!token) {
    //   throw new Error('Authentication Denied')
    throw new AuthenticationError("Authorization Header must be provided");
  }

  try {
    let authString = token.split(" ");
    let decodedUser = jwt.verify(authString[1], SECRET_KEY);
    return decodedUser; // { id, email, username }
  } catch (error) {
    throw new AuthenticationError("Invalid/Expired Token");
  }
};
