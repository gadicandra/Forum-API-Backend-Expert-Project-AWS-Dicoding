const AddComment = require('../AddComment');

describe('AddComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-h5k2',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('COMMENT_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      content: 123,
      threadId: 'thread-h5k2',
      owner: 'user-p9m7',
    };

    // Action & Assert
    expect(() => new AddComment(payload)).toThrowError('COMMENT_CREATION_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create AddComment entities correctly', () => {
    // Arrange
    const payload = {
      content: 'sebuah comment',
      threadId: 'thread-h5k2',
      owner: 'user-p9m7',
    };

    // Action
    const addComment = new AddComment(payload);

    // Assert
    expect(addComment.content).toEqual(payload.content);
    expect(addComment.threadId).toEqual(payload.threadId);
    expect(addComment.owner).toEqual(payload.owner);
  });
});
