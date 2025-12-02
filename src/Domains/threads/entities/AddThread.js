class AddThread {
  constructor(payload) {
    this._validateThreadCreationData(payload);

    const { title, body, owner } = payload;

    this.title = title;
    this.body = body;
    this.owner = owner;
  }

  _validateThreadCreationData(payload) {
    const { title, body, owner } = payload;

    this._ensureRequiredFieldsPresent(title, body, owner);
    this._verifyDataTypeCorrectness(title, body, owner);
  }

  _ensureRequiredFieldsPresent(title, body, owner) {
    if (!title || !body || !owner) {
      throw new Error('THREAD_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _verifyDataTypeCorrectness(title, body, owner) {
    const isTitleString = typeof title === 'string';
    const isBodyString = typeof body === 'string';
    const isOwnerString = typeof owner === 'string';

    if (!isTitleString || !isBodyString || !isOwnerString) {
      throw new Error('THREAD_CREATION_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddThread;
