require('dotenv').config();

async function getWorkingCredentials() {
  console.log('🔐 Getting Working Login Credentials...\n');

  try {
    // Test demo login (this works)
    const demoResponse = await fetch('http://localhost:8000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@storyteller.com' })
    });

    if (demoResponse.ok) {
      const result = await demoResponse.json();
      
      console.log('✅ WORKING LOGIN CREDENTIALS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: user@storyteller.com');
      console.log('🔐 Password: (not required for demo)');
      console.log('🔑 Token:', result.token);
      console.log('👤 User:', result.user.full_name);
      console.log('🆔 User ID:', result.user.id);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      console.log('\n🎯 HOW TO USE:');
      console.log('1. Frontend: Send POST to /api/auth/demo-login with email');
      console.log('2. API: Use the token in Authorization header');
      console.log('3. Any email works: test@example.com, user@demo.com, etc.');
      
      console.log('\n📡 TESTING AUTHENTICATED REQUEST:');
      
      // Test an authenticated request
      const storiesResponse = await fetch('http://localhost:8000/api/stories', {
        headers: {
          'Authorization': `Bearer ${result.token}`
        }
      });
      
      if (storiesResponse.ok) {
        const storiesData = await storiesResponse.json();
        console.log('✅ Authenticated request successful!');
        console.log('📚 Stories endpoint working');
      } else {
        console.log('❌ Authenticated request failed (this is expected without real database)');
      }
      
    } else {
      console.log('❌ Demo login failed');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Use dynamic import for node-fetch
import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  getWorkingCredentials();
});
