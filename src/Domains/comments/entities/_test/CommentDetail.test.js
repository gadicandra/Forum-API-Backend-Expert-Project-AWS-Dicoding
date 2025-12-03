const CommentDetail = require('../CommentDetail');

describe('CommentDetail entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      // missing content
    };

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      username: 'user123',
      date: 2024, // should be string
      content: 'Test Content',
    };

    // Action & Assert
    expect(() => new CommentDetail(payload)).toThrowError('COMMENT_DETAIL_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create CommentDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'Test Content',
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.replies).toEqual([]);
    expect(commentDetail.likeCount).toEqual(0);
  });

  it('should create CommentDetail with deleted content correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'Test Content',
      isDelete: true,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual('**komentar telah dihapus**');
    expect(commentDetail.replies).toEqual([]);
  });

  it('should create CommentDetail with replies correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'Test Content',
      replies: [
        {
          id: 'reply-q4l6',
          username: 'user456',
          date: '2024-01-01T01:00:00.000Z',
          content: 'Test Reply',
        },
      ],
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.replies).toEqual(payload.replies);
  });

  it('should create CommentDetail with likeCount correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-w3n8',
      username: 'user123',
      date: '2024-01-01T00:00:00.000Z',
      content: 'Test Content',
      likeCount: 5,
    };

    // Action
    const commentDetail = new CommentDetail(payload);

    // Assert
    expect(commentDetail.id).toEqual(payload.id);
    expect(commentDetail.username).toEqual(payload.username);
    expect(commentDetail.date).toEqual(payload.date);
    expect(commentDetail.content).toEqual(payload.content);
    expect(commentDetail.likeCount).toEqual(5);
  });
});
