const AddedReply = require('../AddedReply');

describe('AddedReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-q4l6',
      content: 'sebuah balasan',
    };

    expect(() => new AddedReply(payload)).toThrowError('REPLY_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'sebuah balasan',
      owner: 'user-p9m7',
    };

    expect(() => new AddedReply(payload)).toThrowError('REPLY_OUTPUT_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create AddedReply object correctly', () => {
    const payload = {
      id: 'reply-q4l6',
      content: 'sebuah balasan',
      owner: 'user-p9m7',
    };

    const { id, content, owner } = new AddedReply(payload);

    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.owner);
  });
});
