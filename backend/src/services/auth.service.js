const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const repository = require('../data/mongoBankRepository');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { generateAccountNumber } = require('../utils/accountNumber');

function publicUser(user) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

function createToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

async function register(input) {
  const email = input.email.toLowerCase();
  if (await repository.users.findByEmail(email)) {
    throw new AppError('An account already exists for this email.', 409, 'EMAIL_TAKEN');
  }
  const user = await repository.users.create({
    id: uuid(), email, firstName: input.firstName, lastName: input.lastName,
    passwordHash: await bcrypt.hash(input.password, 12), createdAt: new Date().toISOString()
  });
  const account = await repository.accounts.create({
    id: uuid(), userId: user.id, accountNumber: generateAccountNumber(), type: 'checking',
    currency: 'USD', balance: 0, status: 'active', createdAt: new Date().toISOString()
  });
  return { user: publicUser(user), account, accessToken: createToken(user) };
}

async function login(input) {
  const user = await repository.users.findByEmail(input.email.toLowerCase());
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
    throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
  }
  return { user: publicUser(user), accessToken: createToken(user) };
}

module.exports = { register, login, publicUser };
