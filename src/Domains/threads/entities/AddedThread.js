class AddedThread {
  constructor(payload) {
    this._validateThreadOutput(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _validateThreadOutput(payload) {
    const { id, title, owner } = payload;

    this._checkAllFieldsPresent(id, title, owner);
    this._validateFieldTypes(id, title, owner);
  }

  _checkAllFieldsPresent(id, title, owner) {
    if (!id || !title || !owner) {
      throw new Error('THREAD_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS');
    }
  }

  _validateFieldTypes(id, title, owner) {
    const hasValidTypes = typeof id === 'string'
      && typeof title === 'string'
      && typeof owner === 'string';

    if (!hasValidTypes) {
      throw new Error('THREAD_OUTPUT_VALIDATION.INVALID_DATA_TYPES');
    }
  }
}

module.exports = AddedThread;
