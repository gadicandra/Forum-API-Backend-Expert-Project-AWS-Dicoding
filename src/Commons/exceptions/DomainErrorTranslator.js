const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return this._translateError(error.message) || error;
  },

  _translateError(errorMessage) {
    return DomainErrorTranslator._errorMappings[errorMessage];
  },
};

DomainErrorTranslator._errorMappings = {
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
  'REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('output user tidak lengkap'),
  'REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('output user memiliki tipe data yang tidak sesuai'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

  'THREAD_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'THREAD_CREATION_VALIDATION.INVALID_DATA_TYPES': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'THREAD_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('output thread tidak lengkap'),
  'THREAD_OUTPUT_VALIDATION.INVALID_DATA_TYPES': new InvariantError('output thread memiliki tipe data yang tidak sesuai'),
  'THREAD_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('detail thread tidak lengkap'),
  'THREAD_DETAIL_VALIDATION.INVALID_DATA_TYPES': new InvariantError('detail thread memiliki tipe data yang tidak sesuai'),

  'COMMENT_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'COMMENT_CREATION_VALIDATION.INVALID_DATA_TYPES': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
  'COMMENT_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('output comment tidak lengkap'),
  'COMMENT_OUTPUT_VALIDATION.INVALID_DATA_TYPES': new InvariantError('output comment memiliki tipe data yang tidak sesuai'),
  'COMMENT_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('detail comment tidak lengkap'),
  'COMMENT_DETAIL_VALIDATION.INVALID_DATA_TYPES': new InvariantError('detail comment memiliki tipe data yang tidak sesuai'),

  'REPLY_CREATION_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada'),
  'REPLY_CREATION_VALIDATION.INVALID_DATA_TYPES': new InvariantError('tidak dapat membuat balasan baru karena tipe data tidak sesuai'),
  'REPLY_OUTPUT_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('output balasan tidak lengkap'),
  'REPLY_OUTPUT_VALIDATION.INVALID_DATA_TYPES': new InvariantError('output balasan memiliki tipe data yang tidak sesuai'),
  'REPLY_DETAIL_VALIDATION.MISSING_REQUIRED_FIELDS': new InvariantError('detail balasan tidak lengkap'),
  'REPLY_DETAIL_VALIDATION.INVALID_DATA_TYPES': new InvariantError('detail balasan memiliki tipe data yang tidak sesuai'),
};

module.exports = DomainErrorTranslator;
