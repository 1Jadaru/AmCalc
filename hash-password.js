const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'demo123';
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Verify the hash works
  const isValid = await bcrypt.compare(password, hash);
  console.log('Verification test:', isValid);
}

hashPassword().catch(console.error);
