const AddReply = require('../AddReply');

describe('AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      content: 'sebuah balasan',
      commentId: 'comment-w3n8',
    };

    expect(() => new AddReply(payload)).toThrowError('REPLY_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
      commentId: 'comment-w3n8',
      owner: 'user-p9m7',
    };

    expect(() => new AddReply(payload)).toThrowError('REPLY_CREATION_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create AddReply object correctly', () => {
    const payload = {
      content: 'sebuah balasan',
      commentId: 'comment-w3n8',
      owner: 'user-p9m7',
    };

    const { content, commentId, owner } = new AddReply(payload);

    expect(content).toEqual(payload.content);
    expect(commentId).toEqual(payload.commentId);
    expect(owner).toEqual(payload.owner);
  });
});
