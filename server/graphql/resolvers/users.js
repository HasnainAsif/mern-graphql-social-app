const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
    }
  );
};

const resolvers = {
  Mutation: {
    register: async (parent, args, context, info) => {
      let { username, email, password, confirmPassword } = args.registerInput;

      // Validate user Input
      const { errors, valid } = validateRegisterInput({
        username,
        email,
        password,
        confirmPassword,
      });

      if (!valid) {
        throw new UserInputError('Validation Errors Occured...', { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      password = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password,
        confirmPassword,
        createdAt: new Date().toISOString(),
      });
      const savedUser = await newUser.save();

      const token = generateToken(savedUser);

      return {
        ...savedUser._doc,
        id: savedUser._id,
        token,
      };
    },
    login: async (parent, args, context, info) => {
      let { username, password } = args;

      // Validate user Input
      const { errors, valid } = validateLoginInput({
        username,
        password,
      });

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};

module.exports = resolvers;
