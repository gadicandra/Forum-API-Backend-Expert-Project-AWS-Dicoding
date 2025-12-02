const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });

      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-h5k2',
        owner: 'user-p9m7',
      });

      const fakeIdGenerator = () => 'w3n8';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-w3n8');
      expect(comments).toHaveLength(1);
    });

    it('should return added comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });

      const addComment = new AddComment({
        content: 'sebuah comment',
        threadId: 'thread-h5k2',
        owner: 'user-p9m7',
      });

      const fakeIdGenerator = () => 'w3n8';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-w3n8',
        content: 'sebuah comment',
        owner: 'user-p9m7',
      }));
    });
  });

  describe('verifyCommentAvailability function', () => {
    it('should throw NotFoundError when comment not available', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-w3n8'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentAvailability('comment-w3n8'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when user is not the owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await UsersTableTestHelper.addUser({ id: 'user-x2b9', username: 'other_user' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: 'user-p9m7',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-w3n8', 'user-x2b9'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when user is the owner', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: 'user-p9m7',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-w3n8', 'user-p9m7'))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: 'user-p9m7',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteCommentById('comment-w3n8');

      // Assert
      const isDelete = await CommentsTableTestHelper.checkIsDeleteById('comment-w3n8');
      expect(isDelete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-p9m7', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        content: 'first comment',
        owner: 'user-p9m7',
        date: '2021-08-08T07:22:33.555Z',
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-456',
        threadId: 'thread-h5k2',
        content: 'second comment',
        owner: 'user-p9m7',
        date: '2021-08-08T07:26:21.338Z',
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-h5k2');

      // Assert
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toEqual('comment-w3n8');
      expect(comments[0].username).toEqual('dicoding');
      expect(comments[0].content).toEqual('first comment');
      expect(comments[1].id).toEqual('comment-456');
      expect(comments[1].username).toEqual('dicoding');
      expect(comments[1].content).toEqual('second comment');
    });
  });
});
