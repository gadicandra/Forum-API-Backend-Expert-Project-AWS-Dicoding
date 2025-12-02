const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentDetail = require('../../../Domains/comments/entities/CommentDetail');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrate the get thread detail action correctly', async () => {
    // Arrange
    const useCasePayload = 'thread-h5k2';

    const expectedThread = new ThreadDetail({
      id: 'thread-h5k2',
      title: 'Test Thread',
      body: 'Test Body',
      date: '2024-01-01T00:00:00.000Z',
      username: 'user123',
      comments: [],
    });

    const expectedComments = [
      new CommentDetail({
        id: 'comment-w3n8',
        username: 'user456',
        date: '2024-01-01T01:00:00.000Z',
        content: 'Test Comment 1',
        replies: [],
      }),
      new CommentDetail({
        id: 'comment-456',
        username: 'user789',
        date: '2024-01-01T02:00:00.000Z',
        content: 'Test Comment 2',
        replies: [],
      }),
    ];

    // Mock repository
    const mockThreadRepository = new ThreadsRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByCommentId = jest.fn()
      .mockImplementation(() => Promise.resolve([]));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toEqual({
      id: expectedThread.id,
      title: expectedThread.title,
      body: expectedThread.body,
      date: expectedThread.date,
      username: expectedThread.username,
      comments: expectedComments,
    });
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload);
    expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload);
  });

  it('should throw error when thread not found', async () => {
    // Arrange
    const useCasePayload = 'thread-h5k2';

    const mockThreadRepository = new ThreadsRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadAvailability = jest.fn()
      .mockImplementation(() => Promise.reject(new Error('thread tidak ditemukan')));

    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action & Assert
    await expect(getThreadDetailUseCase.execute(useCasePayload))
      .rejects.toThrowError('thread tidak ditemukan');
    expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith(useCasePayload);
  });
});
