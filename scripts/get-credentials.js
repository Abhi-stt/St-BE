require('dotenv').config();

async function getCredentials() {
  console.log('🔐 Getting Login Credentials...\n');

  try {
    // Demo login (works immediately)
    const demoResponse = await fetch('http://localhost:8000/api/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@storyteller.com' })
    });

    if (demoResponse.ok) {
      const result = await demoResponse.json();
      console.log('✅ DEMO LOGIN CREDENTIALS:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: demo@storyteller.com');
      console.log('🔐 Password: (not required for demo)');
      console.log('🔑 Token:', result.token);
      console.log('👤 User:', result.user.full_name);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n🎯 Use these credentials to test the system!');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

import('node-fetch').then(({ default: fetch }) => {
  global.fetch = fetch;
  getCredentials();
});
