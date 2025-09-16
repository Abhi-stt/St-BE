require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');

  try {
    // Test basic connection
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );

    console.log('✅ Supabase client created');
    console.log('URL:', process.env.SUPABASE_URL);
    console.log('Anon Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');

    // Test a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Supabase query failed:', error.message);
      console.log('This might be expected if the database is not set up yet');
      
      // Since Supabase connection is failing, let's provide demo credentials
      console.log('\n🎯 WORKING LOGIN CREDENTIALS (Demo Mode):');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📧 Email: demo@storyteller.com');
      console.log('🔐 Password: (not required)');
      console.log('🔑 Use: POST /api/auth/demo-login');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n💡 The real login requires a working Supabase database setup.');
      console.log('   For now, use the demo login which works without database.');
      
    } else {
      console.log('✅ Supabase connection successful');
    }

  } catch (error) {
    console.log('❌ Supabase connection failed:', error.message);
    
    console.log('\n🎯 WORKING LOGIN CREDENTIALS (Demo Mode):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: demo@storyteller.com');
    console.log('🔐 Password: (not required)');
    console.log('🔑 Use: POST /api/auth/demo-login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n💡 The real login requires a working Supabase database setup.');
    console.log('   For now, use the demo login which works without database.');
  }
}

testSupabaseConnection();
