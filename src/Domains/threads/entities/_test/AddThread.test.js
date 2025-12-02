const AddThread = require('../AddThread');

describe('AddThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    const payload = {
      title: 'Ini judul thread',
      body: 'Ini body thread',
    };

    expect(() => new AddThread(payload)).toThrowError('THREAD_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      title: 123,
      body: true,
      owner: 'user-p9m7',
    };

    expect(() => new AddThread(payload)).toThrowError('THREAD_CREATION_VALIDATION.INVALID_DATA_TYPES');
  });

  it('should create AddThread entities correctly', () => {
    const payload = {
      title: 'Ini judul thread',
      body: 'Ini body thread',
      owner: 'user-p9m7',
    };

    const addThread = new AddThread(payload);

    expect(addThread.title).toEqual(payload.title);
    expect(addThread.body).toEqual(payload.body);
    expect(addThread.owner).toEqual(payload.owner);
  });
});
