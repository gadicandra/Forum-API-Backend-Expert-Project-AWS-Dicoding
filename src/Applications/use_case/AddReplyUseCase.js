const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadsRepository }) {
    this._replyDataStore = replyRepository;
    this._commentDataStore = commentRepository;
    this._threadDataStore = threadsRepository;
  }

  async execute(requestPayload) {
    const { commentId, threadId } = requestPayload;

    await this._validateResourcesExistence(threadId, commentId);

    const replyCreationData = new AddReply(requestPayload);

    return this._persistReply(replyCreationData);
  }

  async _validateResourcesExistence(threadId, commentId) {
    await this._threadDataStore.verifyThreadAvailability(threadId);
    await this._commentDataStore.verifyCommentAvailability(commentId);
  }

  async _persistReply(replyData) {
    return this._replyDataStore.addReply(replyData);
  }
}

module.exports = AddReplyUseCase;
