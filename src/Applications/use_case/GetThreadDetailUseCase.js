class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository, replyRepository, commentLikeRepository }) {
    this._threadDataStore = threadRepository;
    this._commentDataStore = commentRepository;
    this._replyDataStore = replyRepository;
    this._commentLikeDataStore = commentLikeRepository;
  }

  async execute(threadIdentifier) {
    const threadData = await this._fetchThreadData(threadIdentifier);
    const commentsWithReplies = await this._enrichCommentsWithReplies(threadIdentifier);

    return this._buildThreadDetailResponse(threadData, commentsWithReplies);
  }

  async _fetchThreadData(threadId) {
    await this._threadDataStore.verifyThreadAvailability(threadId);
    return this._threadDataStore.getThreadById(threadId);
  }

  async _enrichCommentsWithReplies(threadId) {
    const commentsList = await this._commentDataStore.getCommentsByThreadId(threadId);

    return Promise.all(
      commentsList.map(async (commentItem) => {
        const repliesList = await this._replyDataStore.getRepliesByCommentId(commentItem.id);
        const likeCount = await this._commentLikeDataStore.getLikeCountByCommentId(commentItem.id);

        return {
          id: commentItem.id,
          username: commentItem.username,
          date: commentItem.date,
          content: commentItem.content,
          replies: repliesList,
          likeCount,
        };
      }),
    );
  }

  _buildThreadDetailResponse(threadData, enrichedComments) {
    return {
      id: threadData.id,
      title: threadData.title,
      body: threadData.body,
      date: threadData.date,
      username: threadData.username,
      comments: enrichedComments,
    };
  }
}

module.exports = GetThreadDetailUseCase;
