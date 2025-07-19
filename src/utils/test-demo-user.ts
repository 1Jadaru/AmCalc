/**
 * Test script to verify demo user credentials
 */
import { executeQuerySingle } from './database-pg';
import { verifyPassword } from './auth.utils';

async function testDemoUser() {
  try {
    console.log('🧪 Testing demo user credentials...');
    
    // Test database connection
    const testResult = await executeQuerySingle('SELECT 1 as test');
    console.log('✅ Database connection test:', testResult);
    
    // Look up demo user
    const user = await executeQuerySingle(
      'SELECT id, email, password_hash, first_name, last_name, is_active FROM "User" WHERE email = $1',
      ['demo@amcalc.com']
    );
    
    console.log('👤 Demo user found:', user ? 'Yes' : 'No');
    
    if (user) {
      console.log('📊 User details:', {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isActive: user.is_active,
        passwordHashLength: user.password_hash?.length || 0
      });
      
      // Test password verification
      const isValidPassword = await verifyPassword('demo123', user.password_hash);
      console.log('🔑 Password verification result:', isValidPassword);
      
      if (isValidPassword) {
        console.log('✅ Demo user credentials are valid!');
      } else {
        console.log('❌ Demo user password verification failed');
        console.log('🔍 Password hash:', user.password_hash);
      }
    } else {
      console.log('❌ Demo user not found in database');
      
      // List all users
      const allUsers = await executeQuerySingle('SELECT COUNT(*) as count FROM "User"');
      console.log('📊 Total users in database:', allUsers?.count);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testDemoUser()
    .then(() => {
      console.log('🏁 Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

export { testDemoUser }; 