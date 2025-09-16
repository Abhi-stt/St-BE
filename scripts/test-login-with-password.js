require('dotenv').config();

async function testLoginWithPassword() {
  console.log('🔐 Testing Login with Email and Password...\n');

  const testCredentials = [
    { email: 'demo@storyteller.com', password: 'demo123' },
    { email: 'test@example.com', password: 'test123' },
    { email: 'admin@storyteller.com', password: 'admin123' },
    { email: 'user@demo.com', password: 'user123' }
  ];

  try {
    for (const cred of testCredentials) {
      console.log(`Testing: ${cred.email} / ${cred.password}`);
      
      const response = await fetch('http://localhost:8000/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ LOGIN SUCCESSFUL!');
        console.log('📧 Email:', result.user.email);
        console.log('👤 Name:', result.user.full_name);
        console.log('🔑 Token:', result.token);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 USE THESE CREDENTIALS:');
        console.log('📧 Email:', cred.email);
        console.log('🔐 Password:', cred.password);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        break;
      } else {
        const error = await response.json();
        console.log('❌ Login failed:', error.message);
        console.log('');
      }
    }

    // Test invalid credentials
    console.log('Testing invalid credentials...');
    const invalidResponse = await fetch('http://localhost:8000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'wrong@example.com', password: 'wrongpass' })
    });

    if (invalidResponse.status === 401) {
      const error = await invalidResponse.json();
      console.log('✅ Invalid credentials correctly rejected:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  testLoginWithPassword();
});
