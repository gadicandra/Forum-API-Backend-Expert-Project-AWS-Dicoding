class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyDataStore = replyRepository;
    this._commentDataStore = commentRepository;
  }

  async execute(requestPayload) {
    const { commentId, replyId, owner } = requestPayload;

    await this._validateResourcesExistence(commentId, replyId);
    await this._verifyReplyOwnership(replyId, owner);
    await this._performReplyDeletion(replyId);
  }

  async _validateResourcesExistence(commentId, replyId) {
    await this._commentDataStore.verifyCommentAvailability(commentId);
    await this._replyDataStore.verifyReplyAvailability(replyId);
  }

  async _verifyReplyOwnership(replyId, ownerId) {
    await this._replyDataStore.verifyReplyOwner(replyId, ownerId);
  }

  async _performReplyDeletion(replyId) {
    await this._replyDataStore.deleteReplyById(replyId);
  }
}

module.exports = DeleteReplyUseCase;
