const AddThread = require('../../Domains/threads/entities/AddThread');

class AddThreadUseCase {
  constructor({ threadsRepository }) {
    this._threadDataStore = threadsRepository;
  }

  async execute(requestPayload) {
    const threadCreationData = new AddThread(requestPayload);
    return this._performThreadCreation(threadCreationData);
  }

  async _performThreadCreation(threadData) {
    return this._threadDataStore.addThread(threadData);
  }
}

module.exports = AddThreadUseCase;
