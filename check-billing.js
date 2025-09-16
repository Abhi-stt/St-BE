require('dotenv').config();
const OpenAI = require('openai');

console.log('🔍 Checking OpenAI Billing Status...\n');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function checkBilling() {
  try {
    console.log('📊 Testing API with minimal request...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Hello" }
      ],
      max_tokens: 10,
      temperature: 0.1,
    });

    console.log('✅ SUCCESS: OpenAI is working!');
    console.log('📝 Response:', completion.choices[0].message.content);
    console.log('💰 Usage:', completion.usage);
    console.log('\n🎉 Your billing is fixed! Stories will now use real AI.');
    
  } catch (error) {
    console.log('❌ ERROR: OpenAI still not working');
    console.log('📋 Error Details:');
    console.log('   Status:', error.status);
    console.log('   Code:', error.code);
    console.log('   Message:', error.message);
    
    if (error.status === 429 && error.code === 'insufficient_quota') {
      console.log('\n🚨 BILLING ISSUE DETECTED');
      console.log('💡 What to do:');
      console.log('   1. Go to: https://platform.openai.com/account/billing');
      console.log('   2. Add credits or fix payment method');
      console.log('   3. Run this test again: node check-billing.js');
      console.log('   4. Or use demo stories (they are minimal and work great!)');
    } else if (error.status === 401) {
      console.log('\n🔑 API KEY ISSUE');
      console.log('💡 Check your API key in the .env file');
    }
  }
}

checkBilling();
