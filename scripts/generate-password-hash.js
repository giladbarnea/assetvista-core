#!/usr/bin/env node

const crypto = require('crypto');

const password = process.argv[2];
const salt = process.argv[3] || crypto.randomBytes(16).toString('hex');

if (!password) {
  console.log('Usage: node generate-password-hash.js <password> [salt]');
  console.log('Example: node generate-password-hash.js "MySecurePassword123"');
  process.exit(1);
}

const hash = crypto
  .createHash('sha256')
  .update(password + salt)
  .digest('hex');

console.log('Password Hash Generation:');
console.log('========================');
console.log(`Password: ${password}`);
console.log(`Salt: ${salt}`);
console.log(`Hash: ${hash}`);
console.log('');
console.log('Add these to your .env.local file:');
console.log(`APP_PASSWORD_HASH=${hash}`);
console.log(`PASSWORD_SALT=${salt}`);