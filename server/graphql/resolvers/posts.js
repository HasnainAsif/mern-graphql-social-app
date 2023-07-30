const {
  UserInputError,
  AuthenticationError,
  ApolloError,
} = require('apollo-server');
const { Post, Comment } = require('../../models/Post');
const authMiddleware = require('../../utils/authMiddleware');
const {
  validatePostInput,
  validateCommentInput,
} = require('../../utils/validators');
const { default: mongoose } = require('mongoose');

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });

        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPost: async (parent, { postId }) => {
      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
          error = 'Post not found';
        }

        throw new Error(error);
      });

      if (!post) {
        throw new Error('Post not found');
      }

      return post;
    },

    getComments: async (parent, args) => {
      const { postId, first, after } = args.commentsArgs;
      const query = (after) => {
        return after
          ? { postId: postId, createdAt: { $lt: after } }
          : { postId: postId };
      };
      try {
        const comments = await Comment.find(query(after))
          .sort({ createdAt: 'descending' })
          .limit(first);

        if (!comments || comments.length === 0) {
          throw new Error('Comments not found');
        }

        const lastComment = comments[comments.length - 1];
        const hasNextPage = await Comment.exists(
          query(lastComment.createdAt)
        ).sort({ createdAt: -1 });

        const edges = comments.map((comment) => ({
          node: comment,
          cursor: comment.createdAt,
        }));

        const endCursor =
          edges.length > 0 ? edges[edges.length - 1].cursor : null;

        return {
          edges,
          pageInfo: {
            hasNextPage: !!hasNextPage,
            endCursor,
          },
        };
      } catch (error) {
        throw new Error(error.message || 'Error fetching comments');
      }
    },
  },
  Mutation: {
    createPost: async (parent, { body }, context) => {
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
      const { id: userId, username } = authMiddleware(context);

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
          error = 'Post not found';
        }
        throw new UserInputError('Post not found');
      });

      if (!post) {
        throw new UserInputError('Post not found');
      }

      if (post.user.toString() !== userId) {
        // throw new AuthenticationError('Cannot delete Post. Access Denied.');
        throw new AuthenticationError('Action not allowed');
      }

      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        if (post.comments?.length > 0) {
          await Comment.deleteMany({ postId }); // delete all comments where postId matches
        }
        // await Post.deleteOne({ _id: postId });

        await post.delete();

        session.commitTransaction();

        return 'Post deleted successfully';
      } catch (error) {
        session.abortTransaction();
        throw new ApolloError('Server Error');
      }
    },
    createComment: async (parent, { postId, body }, context) => {
      const { username, id } = authMiddleware(context);

      const { valid, errors } = validateCommentInput({ body });
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
          error = 'Post not found';
        }
        throw new UserInputError(error);
      });

      if (!post) {
        throw new UserInputError('Post not found');
      }

      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        const comment = await Comment.create({
          postId,
          body,
          username,
          user: id,
          createdAt: new Date().toISOString(),
        });

        post.comments.unshift(comment.id); // Add comment to comment document
        await post.save(); // Add comment reference to post document

        session.commitTransaction();

        return { node: comment, cursor: comment.createdAt };
      } catch (error) {
        session.abortTransaction();
        throw new ApolloError('Server Error');
      }
    },
    deleteComment: async (parent, { postId, commentId }, context) => {
      const { id: userId } = authMiddleware(context);

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
          error = 'Post not found';
        }
        throw new UserInputError(error);
      });
      if (!post) {
        throw new UserInputError('Post not found');
      }
      const comment = await Comment.findById(commentId).catch((error) => {
        if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
          error = 'Comment not found';
        }
        throw new UserInputError(error);
      });
      if (!comment) {
        throw new UserInputError('Comment not found');
      }

      const commentIdx = post.comments.findIndex(
        (comment) => comment.id === commentId
      );

      const postComment = post.comments[commentIdx];

      if (postComment === -1) {
        throw new UserInputError('Comment not found');
      }

      if (comment.user.toString() !== userId) {
        // throw new AuthenticationError('Cannot delete Post. Access Denied.');
        throw new AuthenticationError('Action not allowed');
      }

      const session = await mongoose.startSession();
      try {
        session.startTransaction();

        await comment.delete(); // delete comment from comment document
        await post.comments.splice(commentIdx, 1);
        await post.save(); // delete comment reference from post document

        session.commitTransaction();

        return post;
      } catch (error) {
        session.abortTransaction();
        throw new ApolloError('Server Error');
      }
    },
    likeUnlikePost: async (parent, { postId }, context) => {
      const { id, username } = authMiddleware(context);

      const post = await Post.findById(postId).catch((error) => {
        if (error.message.indexOf('Cast to ObjectId failed') !== -1) {
          error = 'Post not found';
        }
        throw new UserInputError('Post not found');
      });

      if (!post) {
        throw new UserInputError('Post not found');
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
