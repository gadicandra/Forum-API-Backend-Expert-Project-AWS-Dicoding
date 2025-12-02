const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
      owner: 'user-p9m7',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-h5k2',
      title: 'sebuah thread',
      owner: 'user-p9m7',
    });

    const mockThreadRepository = new ThreadsRepository();

    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedThread));

    const addThreadUseCase = new AddThreadUseCase({
      threadsRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload);

    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-h5k2',
      title: 'sebuah thread',
      owner: 'user-p9m7',
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread(useCasePayload));
  });
});
