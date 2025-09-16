require('dotenv').config();
const { supabaseAdmin, TABLES } = require('../src/config/supabase');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');
  
  try {
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from(TABLES.PROFILES)
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    
    // Test table existence
    console.log('🔍 Checking table structure...');
    
    const tables = [
      TABLES.PROFILES,
      TABLES.STORIES,
      TABLES.CHAPTERS,
      TABLES.ILLUSTRATIONS,
      TABLES.PDFS,
      TABLES.GENERATION_LOGS
    ];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ Table ${table} not accessible:`, tableError.message);
        } else {
          console.log(`✅ Table ${table} is accessible`);
        }
      } catch (err) {
        console.log(`❌ Error checking table ${table}:`, err.message);
      }
    }
    
    // Test storage buckets
    console.log('🔍 Checking storage buckets...');
    
    const { data: buckets, error: bucketsError } = await supabaseAdmin.storage.listBuckets();
    
    if (bucketsError) {
      console.log('❌ Storage buckets not accessible:', bucketsError.message);
    } else {
      console.log('✅ Storage buckets accessible');
      console.log('Available buckets:', buckets.map(b => b.name));
    }
    
    console.log('🎉 Database test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test script error:', error);
    process.exit(1);
  });
