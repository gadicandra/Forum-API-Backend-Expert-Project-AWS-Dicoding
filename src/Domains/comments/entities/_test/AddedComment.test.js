const AddedComment = require('../AddedComment');

describe('AddedComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      content: 'sebuah comment',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('COMMENT_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      content: 123,
      owner: 'user-p9m7',
    };

    // Action & Assert
    expect(() => new AddedComment(payload)).toThrowError('COMMENT_OUTPUT_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create AddedComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      content: 'sebuah comment',
      owner: 'user-p9m7',
    };

    // Action
    const addedComment = new AddedComment(payload);

    // Assert
    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });
});
