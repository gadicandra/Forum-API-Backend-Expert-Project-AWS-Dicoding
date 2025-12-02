const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 'Test Thread',
      body: 'Test Body',
      // missing date and username
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 'Test Thread',
      body: 'Test Body',
      date: 2024, // should be string
      username: 'user123',
    };

    // Action & Assert
    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create ThreadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 'Test Thread',
      body: 'Test Body',
      date: '2024-01-01T00:00:00.000Z',
      username: 'user123',
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual([]);
  });

  it('should create ThreadDetail object with comments correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-h5k2',
      title: 'Test Thread',
      body: 'Test Body',
      date: '2024-01-01T00:00:00.000Z',
      username: 'user123',
      comments: [
        {
          id: 'comment-w3n8',
          username: 'user456',
          date: '2024-01-01T01:00:00.000Z',
          content: 'Test Comment',
        },
      ],
    };

    // Action
    const threadDetail = new ThreadDetail(payload);

    // Assert
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual(payload.comments);
  });
});
