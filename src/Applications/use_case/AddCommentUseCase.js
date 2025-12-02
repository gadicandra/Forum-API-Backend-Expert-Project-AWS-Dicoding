const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ commentRepository, threadsRepository }) {
    this._commentDataStore = commentRepository;
    this._threadDataStore = threadsRepository;
  }

  async execute(requestPayload) {
    const { threadId } = requestPayload;

    await this._validateThreadExists(threadId);

    const commentCreationData = new AddComment(requestPayload);

    return this._persistComment(commentCreationData);
  }

  async _validateThreadExists(threadId) {
    await this._threadDataStore.verifyThreadAvailability(threadId);
  }

  async _persistComment(commentData) {
    return this._commentDataStore.addComment(commentData);
  }
}

module.exports = AddCommentUseCase;
