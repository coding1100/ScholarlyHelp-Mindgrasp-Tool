const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env.local' });

async function testSave() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    console.log('Testing save to:', databaseUrl);

    const client = new MongoClient(databaseUrl);
    await client.connect();
    const db = client.db('ScholarlyHelp_V1');

    // Test data
    const testData = {
      btnText: "Test Button",
      heroContent: {
        mainHeading: "Test Heading",
        description: "Test Description"
      }
    };

    // Save to assignments collection
    await db.collection('assignments').replaceOne({}, testData, { upsert: true });
    console.log('✅ Save successful!');

    // Verify by reading back
    const saved = await db.collection('assignments').findOne({});
    console.log('📄 Saved data:', JSON.stringify(saved, null, 2));

    await client.close();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testSave();