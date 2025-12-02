const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });

      const addReply = new AddReply({
        content: 'sebuah balasan',
        commentId: 'comment-w3n8',
        owner: 'user-p9m7',
      });

      const fakeIdGenerator = () => 'q4l6';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(addReply);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-q4l6');
      expect(replies).toHaveLength(1);
    });

    it('should return added reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });

      const addReply = new AddReply({
        content: 'sebuah balasan',
        commentId: 'comment-w3n8',
        owner: 'user-p9m7',
      });

      const fakeIdGenerator = () => 'q4l6';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-q4l6',
        content: 'sebuah balasan',
        owner: 'user-p9m7',
      }));
    });
  });

  describe('verifyReplyAvailability function', () => {
    it('should throw NotFoundError when reply not available', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-q4l6'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply available', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });
      await RepliesTableTestHelper.addReply({ id: 'reply-q4l6', commentId: 'comment-w3n8', owner: 'user-p9m7' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyAvailability('reply-q4l6'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-q4l6', 'user-p9m7'))
        .rejects.toThrowError(NotFoundError);
    });

    it('should throw AuthorizationError when not the owner', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await UsersTableTestHelper.addUser({ id: 'user-x2b9', username: 'otheruser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });
      await RepliesTableTestHelper.addReply({ id: 'reply-q4l6', commentId: 'comment-w3n8', owner: 'user-p9m7' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-q4l6', 'user-x2b9'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw error when owner is correct', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });
      await RepliesTableTestHelper.addReply({ id: 'reply-q4l6', commentId: 'comment-w3n8', owner: 'user-p9m7' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyOwner('reply-q4l6', 'user-p9m7'))
        .resolves.not.toThrowError();
    });
  });

  describe('deleteReplyById function', () => {
    it('should soft delete reply correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });
      await RepliesTableTestHelper.addReply({ id: 'reply-q4l6', commentId: 'comment-w3n8', owner: 'user-p9m7' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReplyById('reply-q4l6');

      const isDeleted = await RepliesTableTestHelper.checkIsDeletedReply('reply-q4l6');
      expect(isDeleted).toBe(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return empty array when no replies', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-w3n8');

      expect(replies).toEqual([]);
    });

    it('should return replies correctly', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-p9m7', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-h5k2', owner: 'user-p9m7' });
      await CommentsTableTestHelper.addComment({ id: 'comment-w3n8', threadId: 'thread-h5k2', owner: 'user-p9m7' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-q4l6',
        commentId: 'comment-w3n8',
        content: 'sebuah balasan',
        owner: 'user-p9m7',
        date: '2024-01-01',
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await replyRepositoryPostgres.getRepliesByCommentId('comment-w3n8');

      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-q4l6');
      expect(replies[0].username).toEqual('dicoding');
      expect(replies[0].content).toEqual('sebuah balasan');
    });
  });
});
