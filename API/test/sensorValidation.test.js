const test = require('node:test');
const assert = require('node:assert/strict');
const validateData = require('../middlewares/validateData');

const validate = async (body) => {
  const req = { body };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(responseBody) {
      this.body = responseBody;
      return this;
    }
  };
  let passed = false;

  for (const middleware of validateData) {
    await middleware(req, res, () => { passed = true; });
  }

  return { req, res, passed };
};

test('accepts and normalizes a valid sensor payload', async () => {
  const result = await validate({
    uvIndex: '4.2',
    temperature: '22.5',
    soilHumidity: '61',
    color: { light: '7000', red: '40', green: '120', blue: '220' }
  });

  assert.equal(result.passed, true);
  assert.equal(result.req.body.temperature, 22.5);
  assert.equal(result.req.body.soilHumidity, 61);
  assert.equal(result.req.body.color.red, 40);
});

test('rejects missing or out-of-range sensor values', async () => {
  const missingTemperature = await validate({ uvIndex: 2, soilHumidity: 50 });
  const invalidHumidity = await validate({ uvIndex: 2, temperature: 20, soilHumidity: 101 });
  const invalidColor = await validate({
    uvIndex: 2,
    temperature: 20,
    soilHumidity: 50,
    color: { red: 256 }
  });

  assert.equal(missingTemperature.res.statusCode, 400);
  assert.equal(invalidHumidity.res.statusCode, 400);
  assert.equal(invalidColor.res.statusCode, 400);
});
