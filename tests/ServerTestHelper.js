const Jwt = require('@hapi/jwt');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ServerTestHelper = {
  async getAccessToken() {
    const userPayload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(userPayload);

    return Jwt.token.generate(userPayload, process.env.ACCESS_TOKEN_KEY);
  },

  async getAccessTokenAndUserId() {
    const userPayload = {
      id: 'user-123',
      username: 'dicoding',
      password: 'secret',
      fullname: 'Dicoding Indonesia',
    };

    await UsersTableTestHelper.addUser(userPayload);

    const accessToken = Jwt.token.generate(userPayload, process.env.ACCESS_TOKEN_KEY);

    return { accessToken, userId: userPayload.id };
  },
};

module.exports = ServerTestHelper;