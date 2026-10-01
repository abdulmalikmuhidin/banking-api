const crypto = require('crypto');

function generateAccountNumber() {
  return String(1000000000 + crypto.randomInt(0, 900000000));
}

module.exports = { generateAccountNumber };
