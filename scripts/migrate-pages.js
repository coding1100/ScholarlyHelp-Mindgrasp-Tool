const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migratePages() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('Database URL not configured');
    return;
  }

  const client = new MongoClient(databaseUrl);
  await client.connect();
  const db = client.db('scholarly_help');

  // Sample pages for assignment subjects
  const pages = [
    {
      category: 'assignment',
      slug: 'math',
      title: 'Math Assignments',
      content: '<h1>Math Assignment Help</h1><p>Get expert help with your math assignments.</p>',
      meta_title: 'Math Assignment Help - Scholarly Help',
      meta_description: 'Professional math assignment assistance.',
      status: 'published',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      category: 'assignment',
      slug: 'english',
      title: 'English Assignments',
      content: '<h1>English Assignment Help</h1><p>Expert writing help for English assignments.</p>',
      meta_title: 'English Assignment Help - Scholarly Help',
      meta_description: 'Professional English assignment assistance.',
      status: 'published',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      category: 'assignment',
      slug: 'anatomy',
      title: 'Anatomy Assignments',
      content: '<h1>Anatomy Assignment Help</h1><p>Detailed anatomy assignment solutions.</p>',
      meta_title: 'Anatomy Assignment Help - Scholarly Help',
      meta_description: 'Professional anatomy assignment assistance.',
      status: 'published',
      created_at: new Date(),
      updated_at: new Date(),
    },
    // Add more as needed
  ];

  for (const page of pages) {
    await db.collection('pages').insertOne(page);
  }

  console.log('Pages migrated successfully');
  await client.close();
}

migratePages().catch(console.error);