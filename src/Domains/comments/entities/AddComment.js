class AddComment {
  constructor(payload) {
    this._validateCommentCreationData(payload);

    const { content, threadId, owner } = payload;

    this.content = content;
    this.threadId = threadId;
    this.owner = owner;
  }

  _validateCommentCreationData(payload) {
    const { content, threadId, owner } = payload;

    this._ensureRequiredFieldsPresent(content, threadId, owner);
    this._verifyDataTypeCorrectness(content, threadId, owner);
  }

  _ensureRequiredFieldsPresent(content, threadId, owner) {
    if (!content || !threadId || !owner) {
      throw new Error('COMMENT_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _verifyDataTypeCorrectness(content, threadId, owner) {
    const isContentString = typeof content === 'string';
    const isThreadIdString = typeof threadId === 'string';
    const isOwnerString = typeof owner === 'string';

    if (!isContentString || !isThreadIdString || !isOwnerString) {
      throw new Error('COMMENT_CREATION_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddComment;
