const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
    it('should response 201 and persisted reply', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan',
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
      expect(responseJson.data.addedReply.id).toBeDefined();
      expect(responseJson.data.addedReply.content).toEqual(requestPayload.content);
      expect(responseJson.data.addedReply.owner).toBeDefined();
    });

    it('should response 401 when request without authentication', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-999/comments/comment-w3n8/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'sebuah balasan',
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-h5k2/comments/comment-999/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {};
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
    it('should response 200 when reply deleted successfully', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: userId,
      });

      await RepliesTableTestHelper.addReply({
        id: 'reply-q4l6',
        commentId: 'comment-w3n8',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies/reply-q4l6',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');

      // Verify reply is soft deleted
      const isDeleted = await RepliesTableTestHelper.checkIsDeletedReply('reply-q4l6');
      expect(isDeleted).toEqual(true);
    });

    it('should response 401 when request without authentication', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies/reply-q4l6',
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 when deleting other user reply', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: userId,
      });

      await UsersTableTestHelper.addUser({ id: 'user-x2b9', username: 'dicoding2' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-q4l6',
        commentId: 'comment-w3n8',
        owner: 'user-x2b9',
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies/reply-q4l6',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when reply not found', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-h5k2/comments/comment-w3n8/replies/reply-999',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 404 when comment not found', async () => {
      // Arrange
      const server = await createServer(container);
      const { accessToken, userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-h5k2/comments/comment-999/replies/reply-q4l6',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });
  });
});
