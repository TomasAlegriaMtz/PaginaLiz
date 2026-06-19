import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { extractText } from '../utils/textExtractor';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/resources';

async function migrate() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for migration.');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('No database connection');
    process.exit(1);
  }

  const documentsCol = db.collection('documents');
  const contentCol = db.collection('documentcontents');

  // Find documents with root-level filename but no 'es' field
  const docs = await documentsCol.find({
    filename: { $exists: true, $ne: null },
    es: { $exists: false }
  }).toArray();

  console.log(`Found ${docs.length} documents to migrate.`);
  let migrated = 0;
  let errors = 0;

  for (const doc of docs) {
    try {
      // Move root fields to 'es' sub-object
      const esData = {
        filename: doc.filename,
        originalName: doc.originalName,
        path: doc.path
      };

      // Try to extract text from the file
      let extractedText = '';
      if (doc.path) {
        const filePath = path.join(__dirname, '../../../data', doc.path);
        try {
          extractedText = await extractText(filePath);
        } catch (e) {
          console.warn(`  Could not extract text for ${doc.title}: ${e}`);
        }
      }

      // Update the document: set es, unset root fields
      await documentsCol.updateOne(
        { _id: doc._id },
        {
          $set: { es: esData },
          $unset: { filename: '', originalName: '', path: '' }
        }
      );

      // Create DocumentContent entry
      if (extractedText) {
        await contentCol.updateOne(
          { documentId: doc._id, lang: 'es' },
          { $set: { content: extractedText, extractedAt: new Date() } },
          { upsert: true }
        );
      }

      migrated++;
      console.log(`  Migrated: ${doc.title}`);
    } catch (err) {
      errors++;
      console.error(`  Error migrating ${doc.title}:`, err);
    }
  }

  console.log(`\nMigration complete: ${migrated} migrated, ${errors} errors.`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
