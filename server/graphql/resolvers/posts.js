const { UserInputError, AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const authMiddleware = require("../../utils/authMiddleware");
const {
  validatePostInput,
  validateCommentInput,
} = require("../../utils/validators");

const resolvers = {
  Query: {
    getPosts: async () => {
      console.log("Get Posts");
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (parent, { postId }) => {
      console.log("Get Post");
      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
          error = "Post not found";
        }

        throw new Error(error);
      });

      if (!post) {
        throw new Error("Post not found");
      }

      return post;
    },
  },
  Mutation: {
    createPost: async (parent, { body }, context) => {
      console.log("Create Post");
      const { id, username } = authMiddleware(context);

      const { valid, errors } = validatePostInput({ body });
      if (!valid) {
        throw new UserInputError(errors.message, { errors });
      }

      const newPost = new Post({
        body,
        username,
        createdAt: new Date().toISOString(),
        user: id,
      });

      const savedPost = await newPost.save();
      return savedPost;
    },
    deletePost: async (parent, { postId }, context) => {
      const { id, username } = authMiddleware(context);

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
          error = "Post not found";
        }
        throw new UserInputError("Post not found");
      });

      if (!post) {
        throw new UserInputError("Post not found");
      }

      if (post.username !== username) {
        // throw new AuthenticationError('Cannot delete Post. Access Denied.');
        throw new AuthenticationError("Action not allowed");
      }

      // await Post.deleteOne({ _id: postId });
      await post.delete();

      return "Post deleted successfully";
    },
    createComment: async (parent, { postId, body }, context) => {
      const { username } = authMiddleware(context);

      const { valid, errors } = validateCommentInput({ body });
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
          error = "Post not found";
        }
        throw new UserInputError(error);
      });

      if (!post) {
        throw new UserInputError("Post not found");
      }

      post.comments.unshift({
        body,
        username,
        createdAt: new Date().toISOString(),
      });
      const updatedPost = await post.save();

      return updatedPost;
    },
    deleteComment: async (parent, { postId, commentId }, context) => {
      const { username } = authMiddleware(context);

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
          error = "Post not found";
        }
        throw new UserInputError(error);
      });

      if (!post) {
        throw new UserInputError("Post not found");
      }

      const commentIdx = post.comments.findIndex(
        (comment) => comment.id === commentId
      );

      const comment = post.comments[commentIdx];

      if (!comment) {
        throw new UserInputError("Comment not found");
      }

      if (comment.username !== username) {
        // throw new AuthenticationError('Cannot delete Post. Access Denied.');
        throw new AuthenticationError("Action not allowed");
      }

      await post.comments.splice(commentIdx, 1);

      await post.save();

      return post;
    },
    likeUnlikePost: async (parent, { postId }, context) => {
      const { id, username } = authMiddleware(context);

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf("Cast to ObjectId failed") !== -1) {
          error = "Post not found";
        }
        throw new UserInputError("Post not found");
      });

      if (!post) {
        throw new UserInputError("Post not found");
      }

      //
      const likeIdx = post.likes.findIndex(
        (like) => like.username === username
      );

      if (likeIdx === -1) {
        // Post not liked yet, like post
        //like post
        post.likes.push({
          username,
          createdAt: new Date().toISOString(),
        });
      } else {
        // post already liked, unlike post
        // const like = post.likes[likeIdx];
        // post.likes.splice(likeIdx, 1);
        post.likes = post.likes.filter((like) => like.username !== username);
      }

      await post.save();
      return post;
    },
  },
};

module.exports = resolvers;
