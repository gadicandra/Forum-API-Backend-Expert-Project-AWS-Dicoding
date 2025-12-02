const ReplyDetail = require('../ReplyDetail');

describe('ReplyDetail entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-q4l6',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
    };

    expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'sebuah balasan',
    };

    expect(() => new ReplyDetail(payload)).toThrowError('REPLY_DETAIL_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create ReplyDetail object correctly', () => {
    const payload = {
      id: 'reply-q4l6',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'sebuah balasan',
      isDelete: false,
    };

    const replyDetail = new ReplyDetail(payload);

    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.username).toEqual(payload.username);
    expect(replyDetail.date).toEqual(payload.date);
    expect(replyDetail.content).toEqual(payload.content);
  });

  it('should create ReplyDetail with deleted content correctly', () => {
    const payload = {
      id: 'reply-q4l6',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'sebuah balasan',
      isDelete: true,
    };

    const replyDetail = new ReplyDetail(payload);

    expect(replyDetail.id).toEqual(payload.id);
    expect(replyDetail.username).toEqual(payload.username);
    expect(replyDetail.date).toEqual(payload.date);
    expect(replyDetail.content).toEqual('**balasan telah dihapus**');
  });

  it('should convert Date object to ISO string', () => {
    const payload = {
      id: 'reply-q4l6',
      username: 'user123',
      date: new Date('2024-01-01T00:00:00.000Z'),
      content: 'sebuah balasan',
      isDelete: false,
    };

    const replyDetail = new ReplyDetail(payload);

    expect(replyDetail.date).toEqual('2024-01-01T00:00:00.000Z');
  });
});
