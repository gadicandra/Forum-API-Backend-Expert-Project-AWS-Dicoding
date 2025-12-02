const AddedThread = require('../AddedThread');

describe('AddedThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 'sebuah thread',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('THREAD_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 123,
      owner: 'user-p9m7',
    };

    // Action & Assert
    expect(() => new AddedThread(payload)).toThrowError('THREAD_OUTPUT_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create AddedThread entities correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 'sebuah thread',
      owner: 'user-p9m7',
    };

    // Action
    const addedThread = new AddedThread(payload);

    // Assert
    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });
});
