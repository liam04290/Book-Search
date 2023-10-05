const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    loginUser: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect email or password");
      }

      const passwordValid = await user.isCorrectPassword(password);

      if (!passwordValid) {
        throw new AuthenticationError("Incorrect email or password");
      }

      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const modifiedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedBooks: bookData } },
          { new: true }
        );

        return modifiedUser;
      }
      throw new AuthenticationError("You need to be logged in to save books");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const modifiedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );

        return modifiedUser;
      }
      throw new AuthenticationError("You need to be logged in to remove books");
    },
  },
};

module.exports = resolvers;
