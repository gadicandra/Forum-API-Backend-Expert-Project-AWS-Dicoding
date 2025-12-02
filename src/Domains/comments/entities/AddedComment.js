class AddedComment {
  constructor(payload) {
    this._validateCommentOutput(payload);

    const { id, content, owner } = payload;

    this.id = id;
    this.content = content;
    this.owner = owner;
  }

  _validateCommentOutput(payload) {
    const { id, content, owner } = payload;

    this._checkAllFieldsPresent(id, content, owner);
    this._validateFieldTypes(id, content, owner);
  }

  _checkAllFieldsPresent(id, content, owner) {
    if (!id || !content || !owner) {
      throw new Error('COMMENT_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _validateFieldTypes(id, content, owner) {
    const hasValidTypes = typeof id === 'string'
      && typeof content === 'string'
      && typeof owner === 'string';

    if (!hasValidTypes) {
      throw new Error('COMMENT_OUTPUT_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddedComment;
