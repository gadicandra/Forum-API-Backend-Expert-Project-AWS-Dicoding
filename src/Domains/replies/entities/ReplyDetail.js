class ReplyDetail {
  constructor(payload) {
    this._normalizeDateField(payload);
    this._validateDetailData(payload);

    const {
      id, username, date, content, isDelete,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = this._getContentBasedOnDeletionStatus(content, isDelete);
  }

  _normalizeDateField(payload) {
    if (payload.date instanceof Date) {
      payload.date = payload.date.toISOString();
    }
  }

  _getContentBasedOnDeletionStatus(content, isDelete) {
    return isDelete ? '**balasan telah dihapus**' : content;
  }

  _validateDetailData(payload) {
    const {
      id, username, date, content,
    } = payload;

    this._ensureAllRequiredFieldsPresent(id, username, date, content);
    this._verifyAllFieldTypesCorrect(id, username, date, content);
  }

  _ensureAllRequiredFieldsPresent(id, username, date, content) {
    if (!id || !username || !date || !content) {
      throw new Error('REPLY_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _verifyAllFieldTypesCorrect(id, username, date, content) {
    const areAllStrings = typeof id === 'string'
      && typeof username === 'string'
      && typeof date === 'string'
      && typeof content === 'string';

    if (!areAllStrings) {
      throw new Error('REPLY_DETAIL_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = ReplyDetail;
