class CommentLikeRepository {
    async checkLikeExists(commentId, userId) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addLike(commentId, userId) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteLike(commentId, userId) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getLikeCountByCommentId(commentId) {
        throw new Error('COMMENT_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = CommentLikeRepository;
