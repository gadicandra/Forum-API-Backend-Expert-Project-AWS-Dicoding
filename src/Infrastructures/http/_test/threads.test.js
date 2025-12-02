const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });

    it('should response 401 when request without authentication', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        title: 'sebuah thread',
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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
        title: 'sebuah thread',
        body: 123,
      };
      const server = await createServer(container);
      const { accessToken } = await ServerTestHelper.getAccessTokenAndUserId();

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads',
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

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return thread detail', async () => {
      // Arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-h5k2',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.id).toEqual('thread-h5k2');
      expect(responseJson.data.thread.title).toEqual('sebuah thread');
      expect(responseJson.data.thread.body).toEqual('sebuah body thread');
      expect(responseJson.data.thread.username).toBeDefined();
      expect(responseJson.data.thread.date).toBeDefined();
      expect(responseJson.data.thread.comments).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments)).toBe(true);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-999',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toBeDefined();
    });

    it('should response 200 and return thread with comments', async () => {
      // Arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        content: 'sebuah komentar',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-h5k2',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].id).toEqual('comment-w3n8');
      expect(responseJson.data.thread.comments[0].content).toEqual('sebuah komentar');
      expect(responseJson.data.thread.comments[0].username).toBeDefined();
    });

    it('should response 200 and return thread with comments and replies', async () => {
      // Arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserId();

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
        content: 'sebuah balasan',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-h5k2',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies).toBeDefined();
      expect(Array.isArray(responseJson.data.thread.comments[0].replies)).toBe(true);
      expect(responseJson.data.thread.comments[0].replies).toHaveLength(1);
      expect(responseJson.data.thread.comments[0].replies[0].id).toEqual('reply-q4l6');
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual('sebuah balasan');
    });

    it('should show deleted comment correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserId();

      await ThreadsTableTestHelper.addThread({
        id: 'thread-h5k2',
        owner: userId,
      });

      await CommentsTableTestHelper.addComment({
        id: 'comment-w3n8',
        threadId: 'thread-h5k2',
        content: 'sebuah komentar',
        owner: userId,
        isDelete: true,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-h5k2',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.thread.comments[0].content).toEqual('**komentar telah dihapus**');
    });

    it('should show deleted reply correctly', async () => {
      // Arrange
      const server = await createServer(container);
      const { userId } = await ServerTestHelper.getAccessTokenAndUserId();

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
        content: 'sebuah balasan',
        owner: userId,
        isDelete: true,
      });

      // Action
      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-h5k2',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data.thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
    });
  });
});
