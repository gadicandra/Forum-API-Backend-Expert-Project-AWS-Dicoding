class ThreadDetail {
  constructor(payload) {
    this._normalizeDateField(payload);
    this._validateDetailData(payload);

    const {
      id, title, body, date, username, comments,
    } = payload;

    this.id = id;
    this.title = title;
    this.body = body;
    this.date = date;
    this.username = username;
    this.comments = comments || [];
  }

  _normalizeDateField(payload) {
    if (payload.date instanceof Date) {
      payload.date = payload.date.toISOString();
    }
  }

  _validateDetailData(payload) {
    const {
      id, title, body, date, username,
    } = payload;

    this._ensureAllRequiredFieldsPresent(id, title, body, date, username);
    this._verifyAllFieldTypesCorrect(id, title, body, date, username);
  }

  _ensureAllRequiredFieldsPresent(id, title, body, date, username) {
    if (!id || !title || !body || !date || !username) {
      throw new Error('THREAD_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _verifyAllFieldTypesCorrect(id, title, body, date, username) {
    const areAllStrings = typeof id === 'string'
      && typeof title === 'string'
      && typeof body === 'string'
      && typeof date === 'string'
      && typeof username === 'string';

    if (!areAllStrings) {
      throw new Error('THREAD_DETAIL_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = ThreadDetail;
