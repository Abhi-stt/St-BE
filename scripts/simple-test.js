require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function simpleTest() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase client created successfully');
    console.log('URL:', process.env.SUPABASE_URL);
    console.log('Anon Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');
    
    // Test a simple query
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Query failed:', error.message);
      console.log('This might be expected if the table doesn\'t exist yet');
    } else {
      console.log('✅ Query successful');
    }
    
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
  }
}

simpleTest();
