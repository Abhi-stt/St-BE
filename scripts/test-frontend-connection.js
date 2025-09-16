require('dotenv').config();

async function testFrontendConnection() {
  console.log('🔗 Testing Frontend Connection...\n');

  try {
    // Test health endpoint (what frontend checks)
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch('http://localhost:8000/health');
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData.status);
    } else {
      console.log('❌ Health check failed');
      return;
    }

    // Test login endpoint (what frontend uses)
    console.log('\n2. Testing login endpoint...');
    const loginResponse = await fetch('http://localhost:8000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'demo@storyteller.com',
        password: 'demo123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful!');
      console.log('📧 Email:', loginData.user.email);
      console.log('👤 Name:', loginData.user.full_name);
      console.log('🔑 Token:', loginData.token);
      
      console.log('\n🎯 FRONTEND LOGIN CREDENTIALS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: demo@storyteller.com');
      console.log('🔐 Password: demo123');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Test authenticated request
      console.log('\n3. Testing authenticated request...');
      const storiesResponse = await fetch('http://localhost:8000/api/stories', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (storiesResponse.ok) {
        console.log('✅ Authenticated request successful!');
      } else {
        console.log('⚠️  Authenticated request failed (expected without database)');
      }
      
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.message);
    }

    console.log('\n🎉 Frontend connection test completed!');
    console.log('💡 The "Failed to fetch" error should now be resolved.');

  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend server is running on port 8000');
    console.log('2. Frontend is updated to use port 8000');
    console.log('3. No firewall blocking the connection');
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testFrontendConnection();
});
