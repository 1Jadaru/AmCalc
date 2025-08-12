const { Pool } = require('pg');

async function updateDemoPassword() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const newPasswordHash = '$2a$12$8MMQQiCGxy3JFeDF4oUbIOA1HZu/MgQJ6LNrihhOwh8rMFwznmZie';
    const result = await pool.query(
      'UPDATE "User" SET password_hash = $1 WHERE email = $2',
      [newPasswordHash, 'demo@amcalc.com']
    );
    
    console.log('Password updated successfully!');
    console.log('Rows affected:', result.rowCount);
    
    // Verify the update
    const user = await pool.query(
      'SELECT email, password_hash FROM "User" WHERE email = $1',
      ['demo@amcalc.com']
    );
    
    console.log('User after update:', user.rows[0]);
    
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    await pool.end();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });
updateDemoPassword();
