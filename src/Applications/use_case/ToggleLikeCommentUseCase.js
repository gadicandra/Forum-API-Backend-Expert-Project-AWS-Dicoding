class ToggleLikeCommentUseCase {
    constructor({
        threadRepository,
        commentRepository,
        commentLikeRepository,
    }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._commentLikeRepository = commentLikeRepository;
    }

    async execute(useCasePayload) {
        this._validatePayload(useCasePayload);
        const { threadId, commentId, userId } = useCasePayload;

        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.verifyCommentAvailability(commentId);

        const isLiked = await this._commentLikeRepository.checkLikeExists(commentId, userId);

        if (isLiked) {
            await this._commentLikeRepository.deleteLike(commentId, userId);
        } else {
            await this._commentLikeRepository.addLike(commentId, userId);
        }
    }

    _validatePayload(payload) {
        const { threadId, commentId, userId } = payload;

        if (!threadId || !commentId || !userId) {
            throw new Error('TOGGLE_LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string' || typeof commentId !== 'string' || typeof userId !== 'string') {
            throw new Error('TOGGLE_LIKE_COMMENT_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ToggleLikeCommentUseCase;
