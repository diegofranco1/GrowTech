const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');

const authenticateSensor = require('../middlewares/auth');
const authenticateUser = require('../middlewares/userAuth');

const responseRecorder = () => ({
  statusCode: 200,
  body: null,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test('sensor authentication rejects missing and incorrect API keys', () => {
  process.env.API_KEY = 'test-device-key-with-more-than-32-characters';
  for (const headers of [{}, { 'x-api-key': 'wrong' }]) {
    const response = responseRecorder();
    authenticateSensor({ headers }, response, () => assert.fail('unexpectedly authenticated'));
    assert.equal(response.statusCode, 401);
  }
});

test('sensor authentication accepts the configured key', () => {
  process.env.API_KEY = 'test-device-key-with-more-than-32-characters';
  const response = responseRecorder();
  let authenticated = false;
  authenticateSensor(
    { headers: { 'x-api-key': process.env.API_KEY } },
    response,
    () => { authenticated = true; }
  );
  assert.equal(authenticated, true);
});

test('user authentication rejects requests without a bearer token', () => {
  process.env.JWT_SECRET = 'test-user-jwt-secret-with-more-than-32-characters';
  const response = responseRecorder();
  authenticateUser({ headers: {} }, response, () => assert.fail('unexpectedly authenticated'));
  assert.equal(response.statusCode, 401);
});

test('user authentication accepts a valid user session', () => {
  process.env.JWT_SECRET = 'test-user-jwt-secret-with-more-than-32-characters';
  const token = jwt.sign({}, process.env.JWT_SECRET, { subject: 'user-123', expiresIn: '1h' });
  const request = { headers: { authorization: `Bearer ${token}` } };
  const response = responseRecorder();
  let authenticated = false;
  authenticateUser(request, response, () => { authenticated = true; });
  assert.equal(authenticated, true);
  assert.equal(request.userId, 'user-123');
});

test('user authentication rejects an invalid token', () => {
  process.env.JWT_SECRET = 'test-user-jwt-secret-with-more-than-32-characters';
  const response = responseRecorder();
  authenticateUser(
    { headers: { authorization: 'Bearer invalid' } },
    response,
    () => assert.fail('unexpectedly authenticated')
  );
  assert.equal(response.statusCode, 401);
});
