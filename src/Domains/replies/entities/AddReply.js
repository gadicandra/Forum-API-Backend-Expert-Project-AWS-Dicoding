class AddReply {
  constructor(payload) {
    this._validateReplyCreationData(payload);

    const { content, commentId, owner } = payload;

    this.content = content;
    this.commentId = commentId;
    this.owner = owner;
  }

  _validateReplyCreationData(payload) {
    const { content, commentId, owner } = payload;

    this._ensureRequiredFieldsPresent(content, commentId, owner);
    this._verifyDataTypeCorrectness(content, commentId, owner);
  }

  _ensureRequiredFieldsPresent(content, commentId, owner) {
    if (!content || !commentId || !owner) {
      throw new Error('REPLY_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _verifyDataTypeCorrectness(content, commentId, owner) {
    const isContentString = typeof content === 'string';
    const isCommentIdString = typeof commentId === 'string';
    const isOwnerString = typeof owner === 'string';

    if (!isContentString || !isCommentIdString || !isOwnerString) {
      throw new Error('REPLY_CREATION_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddReply;
