require('dotenv').config();

async function testAuth() {
  console.log('🔐 Testing Authentication System...\n');

  try {
    // Test demo login first (no password required)
    console.log('1. Testing Demo Login (works with any email)...');
    
    const demoLoginData = {
      email: 'test@example.com'
    };

    const demoResponse = await fetch('http://localhost:8000/api/auth/demo-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(demoLoginData)
    });

    if (demoResponse.ok) {
      const demoResult = await demoResponse.json();
      console.log('✅ Demo Login Successful!');
      console.log('📧 Email:', demoResult.user.email);
      console.log('👤 Name:', demoResult.user.full_name);
      console.log('🔑 Token:', demoResult.token);
      console.log('🎯 Use this token for authenticated requests');
    } else {
      const error = await demoResponse.json();
      console.log('❌ Demo Login Failed:', error.message);
    }

    console.log('\n2. Testing Real Login (requires registration first)...');
    
    // Try to register a test user
    const testEmail = `testuser-${Date.now()}@example.com`;
    const registerData = {
      email: testEmail,
      password: 'testpassword123',
      full_name: 'Test User'
    };

    console.log('📝 Attempting to register:', testEmail);
    const registerResponse = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(registerData)
    });

    if (registerResponse.ok) {
      const registerResult = await registerResponse.json();
      console.log('✅ Registration Successful!');
      console.log('📧 Email:', registerResult.user.email);
      console.log('👤 Name:', registerResult.user.full_name);
      console.log('📧 Email Confirmed:', registerResult.user.email_confirmed);
      
      // Now try to login
      console.log('\n🔐 Attempting to login with registered user...');
      const loginData = {
        email: testEmail,
        password: 'testpassword123'
      };

      const loginResponse = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      if (loginResponse.ok) {
        const loginResult = await loginResponse.json();
        console.log('✅ Real Login Successful!');
        console.log('📧 Email:', loginResult.user.email);
        console.log('👤 Name:', loginResult.user.full_name);
        console.log('🔑 Access Token:', loginResult.token);
        console.log('🔄 Refresh Token:', loginResult.refresh_token);
        
        console.log('\n🎯 CREDENTIALS FOR LOGIN:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', testEmail);
        console.log('🔐 Password: testpassword123');
        console.log('🔑 Token:', loginResult.token);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      } else {
        const error = await loginResponse.json();
        console.log('❌ Real Login Failed:', error.message);
      }
    } else {
      const error = await registerResponse.json();
      console.log('❌ Registration Failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running: npm run dev');
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testAuth();
});
