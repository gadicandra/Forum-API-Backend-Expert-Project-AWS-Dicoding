const ToggleLikeCommentUseCase = require('../ToggleLikeCommentUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentLikeRepository = require('../../../Domains/comments/CommentLikeRepository');

describe('ToggleLikeCommentUseCase', () => {
    it('should throw error if payload not contain needed property', async () => {
        // Arrange
        const useCasePayload = {};
        const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({});

        // Action & Assert
        await expect(toggleLikeCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('TOGGLE_LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if payload not meet data type specification', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 123,
            commentId: 'comment-123',
            userId: 'user-123',
        };
        const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({});

        // Action & Assert
        await expect(toggleLikeCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('TOGGLE_LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrate the add like action correctly when not liked yet', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        const mockThreadRepository = new ThreadsRepository();
        const mockCommentRepository = new CommentRepository();
        const mockCommentLikeRepository = new CommentLikeRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentLikeRepository.checkLikeExists = jest.fn()
            .mockImplementation(() => Promise.resolve(false));
        mockCommentLikeRepository.addLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentLikeRepository: mockCommentLikeRepository,
        });

        // Action
        await toggleLikeCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123');
        expect(mockCommentLikeRepository.checkLikeExists).toBeCalledWith('comment-123', 'user-123');
        expect(mockCommentLikeRepository.addLike).toBeCalledWith('comment-123', 'user-123');
    });

    it('should orchestrate the delete like action correctly when already liked', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        const mockThreadRepository = new ThreadsRepository();
        const mockCommentRepository = new CommentRepository();
        const mockCommentLikeRepository = new CommentLikeRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentLikeRepository.checkLikeExists = jest.fn()
            .mockImplementation(() => Promise.resolve(true));
        mockCommentLikeRepository.deleteLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentLikeRepository: mockCommentLikeRepository,
        });

        // Action
        await toggleLikeCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123');
        expect(mockCommentLikeRepository.checkLikeExists).toBeCalledWith('comment-123', 'user-123');
        expect(mockCommentLikeRepository.deleteLike).toBeCalledWith('comment-123', 'user-123');
    });

    it('should throw error when thread not found', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        const mockThreadRepository = new ThreadsRepository();
        const mockCommentRepository = new CommentRepository();
        const mockCommentLikeRepository = new CommentLikeRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.reject(new Error('thread tidak ditemukan')));

        const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentLikeRepository: mockCommentLikeRepository,
        });

        // Action & Assert
        await expect(toggleLikeCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('thread tidak ditemukan');
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
    });

    it('should throw error when comment not found', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            userId: 'user-123',
        };

        const mockThreadRepository = new ThreadsRepository();
        const mockCommentRepository = new CommentRepository();
        const mockCommentLikeRepository = new CommentLikeRepository();

        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentAvailability = jest.fn()
            .mockImplementation(() => Promise.reject(new Error('komentar tidak ditemukan')));

        const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            commentLikeRepository: mockCommentLikeRepository,
        });

        // Action & Assert
        await expect(toggleLikeCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('komentar tidak ditemukan');
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
        expect(mockCommentRepository.verifyCommentAvailability).toBeCalledWith('comment-123');
    });
});
