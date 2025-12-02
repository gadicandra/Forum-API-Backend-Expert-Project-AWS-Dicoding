class DeleteCommentUseCase {
  constructor({ commentRepository, threadsRepository }) {
    this._commentDataStore = commentRepository;
    this._threadDataStore = threadsRepository;
  }

  async execute(requestPayload) {
    const { threadId, commentId, owner } = requestPayload;

    await this._validateResourcesExistence(threadId, commentId);
    await this._verifyCommentOwnership(commentId, owner);
    await this._performCommentDeletion(commentId);
  }

  async _validateResourcesExistence(threadId, commentId) {
    await this._threadDataStore.verifyThreadAvailability(threadId);
    await this._commentDataStore.verifyCommentAvailability(commentId);
  }

  async _verifyCommentOwnership(commentId, ownerId) {
    await this._commentDataStore.verifyCommentOwner(commentId, ownerId);
  }

  async _performCommentDeletion(commentId) {
    await this._commentDataStore.deleteCommentById(commentId);
  }
}

module.exports = DeleteCommentUseCase;
