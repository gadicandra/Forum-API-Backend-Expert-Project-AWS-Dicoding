const CommentLikesTableTestHelper = require('../../../../tests/CommentLikesTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentLikeRepositoryPostgres = require('../CommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');

describe('CommentLikeRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentLikesTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('checkLikeExists function', () => {
        it('should return false when like does not exist', async () => {
            // Arrange
            const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

            // Action
            const exists = await commentLikeRepository.checkLikeExists('comment-123', 'user-123');

            // Assert
            expect(exists).toEqual(false);
        });

        it('should return true when like exists', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
            await CommentLikesTableTestHelper.addLike({
                id: 'like-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

            // Action
            const exists = await commentLikeRepository.checkLikeExists('comment-123', 'user-123');

            // Assert
            expect(exists).toEqual(true);
        });
    });

    describe('addLike function', () => {
        it('should add like correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

            const fakeIdGenerator = () => '123';
            const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await commentLikeRepository.addLike('comment-123', 'user-123');

            // Assert
            const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
            expect(likes).toHaveLength(1);
            expect(likes[0].comment_id).toEqual('comment-123');
            expect(likes[0].owner).toEqual('user-123');
        });
    });

    describe('deleteLike function', () => {
        it('should delete like correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
            await CommentLikesTableTestHelper.addLike({
                id: 'like-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });

            const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

            // Action
            await commentLikeRepository.deleteLike('comment-123', 'user-123');

            // Assert
            const likes = await CommentLikesTableTestHelper.findLikeById('like-123');
            expect(likes).toHaveLength(0);
        });
    });

    describe('getLikeCountByCommentId function', () => {
        it('should return 0 when no likes', async () => {
            // Arrange
            const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

            // Action
            const count = await commentLikeRepository.getLikeCountByCommentId('comment-123');

            // Assert
            expect(count).toEqual(0);
        });

        it('should return correct like count', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'user1' });
            await UsersTableTestHelper.addUser({ id: 'user-456', username: 'user2' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

            await CommentLikesTableTestHelper.addLike({
                id: 'like-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });
            await CommentLikesTableTestHelper.addLike({
                id: 'like-456',
                commentId: 'comment-123',
                owner: 'user-456',
            });

            const commentLikeRepository = new CommentLikeRepositoryPostgres(pool, {});

            // Action
            const count = await commentLikeRepository.getLikeCountByCommentId('comment-123');

            // Assert
            expect(count).toEqual(2);
        });
    });
});
