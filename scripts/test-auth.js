require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:8080';

async function testAuth() {
  console.log('🔐 Testing Authentication System...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.status);

    // Test 2: Auth health check
    console.log('\n2. Testing auth health endpoint...');
    const authHealthResponse = await fetch(`${BASE_URL}/api/auth/health`);
    const authHealthData = await authHealthResponse.json();
    console.log('✅ Auth health check:', authHealthData.status);

    // Test 3: Demo login (should work without real credentials)
    console.log('\n3. Testing demo login...');
    const demoLoginResponse = await fetch(`${BASE_URL}/api/auth/demo-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com'
      })
    });
    
    if (demoLoginResponse.ok) {
      const demoLoginData = await demoLoginResponse.json();
      console.log('✅ Demo login successful:', demoLoginData.message);
      console.log('   User:', demoLoginData.user.email);
      console.log('   Token:', demoLoginData.token.substring(0, 20) + '...');
    } else {
      const errorData = await demoLoginResponse.json();
      console.log('❌ Demo login failed:', errorData.message);
    }

    // Test 4: Real login with invalid credentials
    console.log('\n4. Testing real login with invalid credentials...');
    const invalidLoginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      })
    });
    
    if (invalidLoginResponse.status === 401) {
      const errorData = await invalidLoginResponse.json();
      console.log('✅ Invalid login correctly rejected:', errorData.message);
    } else {
      console.log('❌ Invalid login should have been rejected');
    }

    // Test 5: Registration with valid data
    console.log('\n5. Testing user registration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const registerResponse = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'testpassword123',
        full_name: 'Test User'
      })
    });
    
    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ Registration successful:', registerData.message);
      console.log('   User:', registerData.user.email);
      console.log('   Email confirmed:', registerData.user.email_confirmed);
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ Registration failed:', errorData.message);
    }

    // Test 6: Login with the newly registered user
    console.log('\n6. Testing login with registered user...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'testpassword123'
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful:', loginData.message);
      console.log('   User:', loginData.user.email);
      console.log('   Token:', loginData.token.substring(0, 20) + '...');
      
      // Test 7: Profile endpoint with valid token
      console.log('\n7. Testing profile endpoint...');
      const profileResponse = await fetch(`${BASE_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile fetch successful');
        console.log('   User:', profileData.user.email);
        console.log('   Full name:', profileData.user.full_name);
      } else {
        const errorData = await profileResponse.json();
        console.log('❌ Profile fetch failed:', errorData.message);
      }
    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.message);
    }

    console.log('\n🎉 Authentication tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nMake sure the server is running: npm run dev');
  }
}

// Run the tests
testAuth();
